<template>
  <button type="button" :class="type">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ label: string; type?: string }>();
</script>

<style scoped lang="scss">
button {
  height: 40px;
  border: none;
  border-radius: 4px;
  width: 100%;
  background-color: $color-orange;
  font-family: Poppins;
  color: $color-white;

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
  &.google {
    background-color: $color-google-blue;
  }
}
</style>
