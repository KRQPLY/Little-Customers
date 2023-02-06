<template>
  <div class="add-relative">
    <h1>Add a {{ relative }}</h1>
    <input v-model="userTag" placeholder="Search" />
    <div class="results">
      <div
        class="result"
        v-for="result in filteredResults"
        @click="sendRelativeRequest(result.nick, result.userTag, result.uid)"
      >
        <div class="result-nick">{{ result.nick }}</div>
        <div class="result-user-tag">@{{ result.userTag }}</div>
      </div>
      <div v-if="!filteredResults.length">No results</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/useUserStore";
import {
  collection,
  onSnapshot,
  query,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/firebase";
import { ref, computed } from "vue";

const props = defineProps<{ relative: "child" | "parent" }>();
const emits = defineEmits(["close"]);

interface Result {
  nick: string;
  userTag: string;
  uid: string;
}

const userStore = useUserStore();
const results = ref<Result[]>([]);
const userTag = ref("");

const filteredResults = computed(() => {
  return results.value.filter(
    (result) =>
      result.userTag.toLowerCase().includes(userTag.value.toLowerCase()) &&
      !userStore.parents.some((parent) => parent.userTag === result.userTag) &&
      !userStore.children.some((child) => child.userTag === result.userTag) &&
      !userStore.parentsRequests.some(
        (request) => request.userTag === result.userTag
      ) &&
      !userStore.childrenRequests.some(
        (request) => request.userTag === result.userTag
      ) &&
      !userStore.requestsSent.some(
        (request) => request.userTag === result.userTag
      ) &&
      userStore.userTag !== result.userTag
  );
});

onSnapshot(query(collection(db, "users")), (querySnapshot) => {
  const resultsArray: Result[] = [];
  querySnapshot.forEach((doc) => {
    const result = {
      nick: doc.data().nick,
      userTag: doc.data().userTag,
      uid: doc.id,
    };
    resultsArray.push(result);
  });
  results.value = resultsArray;
});

function sendRelativeRequest(nick: string, userTag: string, uid: string) {
  let relativeData = {};
  const userData = {
    requestsSent: arrayUnion({
      nick,
      userTag,
      uid,
    }),
  };
  if (props.relative === "child") {
    relativeData = {
      parentsRequests: arrayUnion({
        nick: userStore.nick,
        userTag: userStore.userTag,
        uid: userStore.uid,
      }),
    };
  }
  if (props.relative === "parent") {
    relativeData = {
      childrenRequests: arrayUnion({
        nick: userStore.nick,
        userTag: userStore.userTag,
        uid: userStore.uid,
      }),
    };
  }
  emits("close");
  updateDoc(doc(db, "users", uid), relativeData);
  updateDoc(doc(db, "users", userStore.uid), userData);
}
</script>

<style scoped lang="scss">
.add-relative {
  color: $color-deep-koamaru;
  background-color: $color-white;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 300px;
}
input {
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid $color-athens-gray;
  border-radius: 4px;
  font-family: Poppins;
  padding: 10px;
  outline: none;
  &:focus {
    border: 1px solid $color-black;
  }
}
.results {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
}
.result {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid $color-athens-gray;

  &:hover {
    background-color: $color-athens-gray;
    cursor: pointer;
  }
}
.result-user-tag {
  align-self: center;
  font-size: 10px;
  color: $color-main;
}
</style>
