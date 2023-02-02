<template>
  <header>
    <div class="title">
      <div class="title-top">Little</div>
      <div>Customers</div>
    </div>
    <div v-if="tokenStore.token" class="logout" @click="logout">Logout</div>
  </header>
</template>

<script setup lang="ts">
import { getAuth, signOut } from "@firebase/auth";
import { useTokenStore } from "@/stores/token";

const tokenStore = useTokenStore();

function logout() {
  signOut(getAuth());
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
    font-size: 30px;
    line-height: 30px;
  }

  .title-top {
    color: $color-deep-koamaru;
  }

  .logout {
    cursor: pointer;
    color: $color-white;
    font-weight: 500;
  }
}
</style>
