import { defineStore } from "pinia";
import { onAuthStateChanged } from "@firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  interface User {
    nick: string;
    userTag: string;
    uid: string;
  }

  const uid = ref("");
  const userTag = ref("");
  const nick = ref("");
  const isLoggedIn = ref(false);
  const parents = ref<User[]>([]);
  const children = ref<User[]>([]);
  const parentsRequests = ref<User[]>([]);
  const childrenRequests = ref<User[]>([]);
  const requestsSent = ref<User[]>([]);

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      isLoggedIn.value = false;
      userTag.value = "";
      nick.value = "";
      uid.value = "";
      parents.value = [];
      children.value = [];
      parentsRequests.value = [];
      childrenRequests.value = [];
    } else {
      isLoggedIn.value = true;
      uid.value = user.uid;
      onSnapshot(doc(db, "users", user.uid), (doc) => {
        const data = doc.data();
        if (data && user.uid === uid.value) {
          nick.value = data.nick ? data.nick : "";
          userTag.value = data.userTag ? data.userTag : "";
          children.value = data.children ? data.children : [];
          parents.value = data.parents ? data.parents : [];
          parentsRequests.value = data.parentsRequests
            ? data.parentsRequests
            : [];
          childrenRequests.value = data.childrenRequests
            ? data.childrenRequests
            : [];
          requestsSent.value = data.requestsSent ? data.requestsSent : [];
        }
      });
    }
  });

  return {
    uid,
    userTag,
    nick,
    isLoggedIn,
    parents,
    children,
    parentsRequests,
    childrenRequests,
    requestsSent,
  };
});
