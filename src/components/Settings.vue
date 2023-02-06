<template>
  <div class="settings">
    <h3>Settings</h3>
    <div v-if="userStore.userTag">{{ userStore.userTag }}</div>
    <input v-model="nick" placeholder="Nickname" v-else />
    <RelativesList
      :relatives="userStore.children"
      :relatives-requests="userStore.childrenRequests"
      type="children"
      v-if="userStore.userTag"
    />
    <Button
      label="Add a child"
      @click="showAddRelativePopup('child')"
      v-if="userStore.userTag"
    />
    <RelativesList
      :relatives="userStore.parents"
      :relatives-requests="userStore.parentsRequests"
      type="parents"
      v-if="userStore.userTag"
    />
    <Button
      label="Add a parent"
      @click="showAddRelativePopup('parent')"
      v-if="userStore.userTag"
    />
    <Button label="Set a nickname" @click="setNick" v-else />
    <Popup
      @close="isAddRelativePopupVisible = false"
      v-if="isAddRelativePopupVisible"
    >
      <AddRelative
        :relative="relative"
        @close="isAddRelativePopupVisible = false"
      />
    </Popup>

    <Button
      class="logout-button"
      label="Logout"
      type="secondary"
      @click="logout"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/Button.vue";
import Popup from "@/components/Popup.vue";
import AddRelative from "./AddRelative.vue";
import { useUserStore } from "@/stores/useUserStore";
import { getAuth, signOut } from "@firebase/auth";
import { ref } from "vue";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import RelativesList from "./RelativesList.vue";

const emits = defineEmits(["close"]);

const auth = getAuth();
const userStore = useUserStore();
const relative = ref<"child" | "parent">("parent");
const isAddRelativePopupVisible = ref(false);
const nick = ref("");

function showAddRelativePopup(relativeValue: "child" | "parent") {
  relative.value = relativeValue;
  isAddRelativePopupVisible.value = true;
}

async function setNick() {
  if (!auth.currentUser) {
    return;
  }
  const userTag = `${nick.value}-${userStore.uid.slice(-5)}`;

  await setDoc(doc(db, "users", userStore.uid), {
    nick: nick.value,
    userTag: userTag,
  });
}

function logout() {
  signOut(auth);
  emits("close");
}
</script>

<style scoped lang="scss">
.settings {
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
.logout-button {
  margin-top: 60px;
}
</style>
