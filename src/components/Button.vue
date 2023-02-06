<template>
  <button type="button" :class="type">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ label?: string; type?: string }>();
</script>

<style scoped lang="scss">
button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  width: 100%;
  background-color: $color-main;
  font-family: Poppins;
  color: $color-white;

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
  &.google {
    background-color: $color-google-blue;
  }
  &.secondary {
    background-color: $color-deep-koamaru;
  }
  &.accept {
    padding: 5px 7px;
    width: auto;
  }
  &.delete {
    padding: 5px 7px;
    background-color: $color-deep-koamaru;
    width: auto;
  }
}
</style>
