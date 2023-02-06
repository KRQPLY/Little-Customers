<template>
  <div class="relatives">
    <div class="relatives-header">
      {{ type.charAt(0).toUpperCase() + type.slice(1) }}
    </div>
    <div class="relatives-list">
      <div class="request" v-for="request in relativesRequests">
        <div class="request-user-tag">@{{ request.userTag }}</div>
        <Button
          label="accept"
          type="accept"
          @click="acceptRequest(request.nick, request.userTag, request.uid)"
        />
        <Button
          label="delete"
          type="delete"
          @click="deleteRequest(request.nick, request.userTag, request.uid)"
        />
      </div>
      <div class="relative" v-for="relative in relatives">
        <div class="relative-nick">{{ relative.nick }}</div>
        <div class="relative-user-tag">@{{ relative.userTag }}</div>
        <Button
          label="delete"
          type="delete"
          @click="deleteRelative(relative.nick, relative.userTag, relative.uid)"
        />
      </div>
      <div v-if="!relatives.length && !relativesRequests.length">
        No {{ type }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "./Button.vue";
import { useUserStore } from "@/stores/useUserStore";
import {
  collection,
  query,
  updateDoc,
  where,
  doc,
  arrayRemove,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";

const props = defineProps<{
  relatives: { nick: string; userTag: string; uid: string }[];
  relativesRequests: { nick: string; userTag: string; uid: string }[];
  type: "parents" | "children";
}>();

const userStore = useUserStore();

function deleteRelative(nick: string, userTag: string, uid: string) {
  let userData = {};
  let relativeData = {};
  if (props.type === "children") {
    userData = {
      children: arrayRemove({ nick, userTag, uid }),
    };
    relativeData = {
      parents: arrayRemove({
        nick: userStore.nick,
        userTag: userStore.userTag,
        uid: userStore.uid,
      }),
    };
  }
  if (props.type === "parents") {
    userData = {
      parents: arrayRemove({ nick, userTag, uid }),
    };
    relativeData = {
      children: arrayRemove({
        nick: userStore.nick,
        userTag: userStore.userTag,
        uid: userStore.uid,
      }),
    };
  }
  updateDoc(doc(db, "users", userStore.uid), userData);
  updateDoc(doc(db, "users", uid), relativeData);
  stopSharingLists(uid);
}

async function stopSharingLists(uid: string) {
  const listsOwned = await getDocs(
    query(collection(db, "lists"), where("owner", "==", userStore.uid))
  );
  listsOwned.forEach(async (list) => {
    await updateDoc(doc(db, "lists", list.id), { users: arrayRemove(uid) });
  });
  const listsShared = await getDocs(
    query(collection(db, "lists"), where("owner", "==", uid))
  );
  listsShared.forEach(async (list) => {
    await updateDoc(doc(db, "lists", list.id), {
      users: arrayRemove(userStore.uid),
    });
  });
}

function acceptRequest(nick: string, userTag: string, uid: string) {
  let userData = {};
  let relativeData = {};
  if (props.type === "children") {
    userData = {
      children: arrayUnion({ nick, userTag, uid }),
    };
    relativeData = {
      parents: arrayUnion({
        nick: userStore.nick,
        userTag: userStore.userTag,
        uid: userStore.uid,
      }),
    };
  }
  if (props.type === "parents") {
    userData = {
      parents: arrayUnion({ nick, userTag, uid }),
    };
    relativeData = {
      children: arrayUnion({
        nick: userStore.nick,
        userTag: userStore.userTag,
        uid: userStore.uid,
      }),
    };
  }
  updateDoc(doc(db, "users", userStore.uid), userData);
  updateDoc(doc(db, "users", uid), relativeData);
  shareLists(uid);
  deleteRequest(nick, userTag, uid);
}

function deleteRequest(nick: string, userTag: string, uid: string) {
  let userData = {};
  const relativeData = {
    requestsSent: arrayRemove({
      nick: userStore.nick,
      userTag: userStore.userTag,
      uid: userStore.uid,
    }),
  };
  if (props.type === "children") {
    userData = {
      childrenRequests: arrayRemove({
        nick,
        userTag,
        uid,
      }),
    };
  }
  if (props.type === "parents") {
    userData = {
      parentsRequests: arrayRemove({
        nick,
        userTag,
        uid,
      }),
    };
  }
  updateDoc(doc(db, "users", userStore.uid), userData);
  updateDoc(doc(db, "users", uid), relativeData);
}

async function shareLists(uid: string) {
  const listsOwned = await getDocs(
    query(collection(db, "lists"), where("owner", "==", userStore.uid))
  );
  listsOwned.forEach(async (list) => {
    await updateDoc(doc(db, "lists", list.id), { users: arrayUnion(uid) });
  });
  const listsShared = await getDocs(
    query(collection(db, "lists"), where("owner", "==", uid))
  );
  listsShared.forEach(async (list) => {
    await updateDoc(doc(db, "lists", list.id), {
      users: arrayUnion(userStore.uid),
    });
  });
}
</script>

<style scoped lang="scss">
.relatives-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 100px;
  overflow-y: auto;
}
.relatives {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.relatives-header {
  align-self: flex-start;
}
.relative,
.request {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid $color-athens-gray;

  &:hover {
    background-color: $color-athens-gray;
    cursor: pointer;
  }
}
.relative-nick {
  width: 100%;
}
.relative-user-tag,
.request-user-tag {
  font-size: 10px;
  color: $color-main;
  width: 100%;
}
</style>
