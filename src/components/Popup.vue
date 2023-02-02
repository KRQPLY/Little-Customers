<template>
  <div class="popup">
    <div class="popup-blocker" @click="$emit('close')"></div>
    <div class="popup-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({ position: { type: String, default: "relative" } });
</script>

<style scoped lang="scss">
.popup {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 50px;
}

.popup-blocker {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 999;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
.popup-content {
  position: v-bind(position);
  height: fit-content;
  z-index: 1000;
}
</style>
