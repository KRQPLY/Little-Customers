<template>
  <div class="folder" @click="goToList">
    <div class="folder-main">
      <div class="name">{{ name }}</div>
      <div class="icon-placeholder" v-if="!isIconLoaded"></div>
      <img
        :src="iconUrl"
        :alt="iconUrl"
        class="icon"
        @load="isIconLoaded = true"
      />
    </div>
    <div class="description">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  name: string;
  id: string;
  iconUrl: string;
  description: string;
}>();

const router = useRouter();
const isIconLoaded = ref(false);

function goToList() {
  router.push({ name: "list", query: { id: props.id } });
}
</script>

<style scoped lang="scss">
.folder {
  min-height: 160.4px;
  padding: 10px;
  background-color: $color-main;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}
.folder-main {
  position: relative;
  display: flex;
  justify-content: flex-end;
}
.icon {
  width: 130px;
}
.icon-placeholder {
  height: 130px;
  width: 90px;
}
.name {
  position: absolute;
  left: 0;
  width: 70%;
  color: $color-deep-koamaru;
  font-size: 27px;
  font-weight: 700;
}
.description {
  font-size: 20px;
  overflow: hidden;
  color: $color-white;
}

@include media-xs {
  .folder {
    min-height: 190.8px;
  }
}
</style>
