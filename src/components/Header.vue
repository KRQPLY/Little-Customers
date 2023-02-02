<template>
  <header>
    <div class="title" @click="goHome">
      <div class="title-top">Little</div>
      <div>Customers</div>
    </div>
    <div class="buttons">
      <div v-if="isUserLoggedIn" class="nick" @click="isSettingsActive = true">
        {{ nick }}
      </div>
      <Popup @close="isSettingsActive = false" v-if="isSettingsActive">
        hi
      </Popup>
      <div v-if="isUserLoggedIn" class="logout" @click="logout">Logout</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Popup from "./Popup.vue";
import { getAuth, signOut, onAuthStateChanged } from "@firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { ref } from "vue";
import { useRouter } from "vue-router";

const auth = getAuth();
const router = useRouter();
const isUserLoggedIn = ref(false);
const nick = ref("");
const isSettingsActive = ref(false);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    isUserLoggedIn.value = false;
  } else {
    isUserLoggedIn.value = true;
    watchAndUpdateLists(user.uid);
  }
});

function goHome() {
  router.push({ name: "home" });
}

function logout() {
  signOut(auth);
}

function watchAndUpdateLists(uid: string) {
  onSnapshot(doc(db, "users", uid), (doc) => {
    const data = doc.data();
    if (data) {
      nick.value = data.nick;
    }
  });
}
</script>

<style scoped lang="scss">
header {
  padding: 10px 20px;
  background-color: $color-secondary;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $color-white;

  .title {
    cursor: pointer;
    font-size: 30px;
    line-height: 30px;
  }

  .title-top {
    color: $color-deep-koamaru;
  }
  .buttons {
    display: flex;
    gap: 100px;
  }
  .nick {
    cursor: pointer;
    color: $color-white;
    font-weight: 500;
  }
}
</style>
