<template>
  <header>
    <div class="title" @click="goHome">
      <div class="title-top">Little</div>
      <div>Customers</div>
    </div>
    <div class="buttons">
      <div
        v-if="userStore.isLoggedIn"
        class="nick"
        @click="isSettingsActive = true"
      >
        {{ userStore.nick ? userStore.nick : "Settings" }}
      </div>
      <Popup
        @close="isSettingsActive = false"
        v-if="isSettingsActive"
      >
        <Settings @close="isSettingsActive = false" />
      </Popup>
    </div>
  </header>
</template>

<script setup lang="ts">
import Popup from "@/components/Popup.vue";
import Settings from "@/components/Settings.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { ref } from "vue";

const router = useRouter();
const userStore = useUserStore();
const isSettingsActive = ref(false);

function goHome(){
  router.push({ name: "home" });
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
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
