<template>
  <div class="item" @click="toggleBought">
    <div class="main">
      <img
        :src="iconUrl"
        :alt="iconUrl"
        class="icon"
        @load="isIconLoaded = true"
      />
      <div class="icon-placeholder" v-if="!isIconLoaded"></div>
      <div class="info">
        <div class="bought">
          <IconCheck class="bought-icon" v-if="bought" />
        </div>
        <div class="name">
          {{ name }}
        </div>
        <div class="quantity">Quantity: {{ quantity }}</div>
      </div>
    </div>
    <div class="description">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import IconCheck from "@/components/icons/IconCheck.vue";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { ref } from "vue";

const props = defineProps<{
  name: string;
  id: string;
  iconUrl: string;
  description: string;
  quantity: number;
  bought: boolean;
  listId: string;
}>();

const isIconLoaded = ref(false);

async function toggleBought() {
  if (!auth?.currentUser?.uid) {
    return;
  }
  const itemRef = doc(
    db,
    "users",
    auth.currentUser.uid,
    "lists",
    props.listId,
    "items",
    props.id
  );
  await updateDoc(itemRef, {
    bought: !props.bought,
  });
}
</script>

<style scoped lang="scss">
.item {
  padding: 10px;
  background-color: $color-main;
  border-radius: 10px;
  cursor: pointer;
}
.main {
  position: relative;
  display: flex;
}
.icon {
  width: 130px;
}
.icon-placeholder {
  height: 130px;
  width: 90px;
}
.info {
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
}
.bought {
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 5px;
  align-self: flex-end;
  height: 15px;
  width: 15px;
  border: 3px solid $color-deep-koamaru;
}
.bought-icon {
  position: absolute;
  bottom: 2px;
  scale: 1.7;
}
.name {
  color: $color-deep-koamaru;
  font-size: 27px;
  font-weight: 700;
}
.quantity {
  align-self: flex-end;
  color: $color-secondary;
}
.description {
  font-size: 20px;
  overflow: hidden;
  color: $color-white;
}
</style>
