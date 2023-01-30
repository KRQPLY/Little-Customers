import { ref } from "vue";
import { defineStore } from "pinia";

export const useTokenStore = defineStore("counter", () => {
  const token = ref("");

  function setToken(tokenValue: string) {
    token.value = tokenValue;
  }

  function clearToken() {
    token.value = "";
  }

  return { token, setToken, clearToken };
});
