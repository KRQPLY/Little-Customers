<template>
  <div class="pick-icon">
    <div class="icons-list scrollable">
      <img
        class="icon"
        :src="url"
        :alt="url"
        v-for="url in urls"
        @click="$emit('picked', url)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storage } from "@/firebase";
import { ref as dbRef, listAll, getDownloadURL } from "firebase/storage";
import { ref } from "vue";

const storageRef = dbRef(storage);
const urls = ref<string[]>([]);

listAll(storageRef)
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
      listAll(folderRef)
        .then((res) => {
          res.items.forEach((imageRef) => {
            getDownloadURL(imageRef)
              .then((url) => {
                urls.value.push(url);
              })
              .catch((error) => {
                console.error(error);
              });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  })
  .catch((error) => {
    console.error(error);
  });
</script>

<style scoped lang="scss">
.pick-icon {
  background-color: $color-white;
  border-radius: 10px;
  padding: 10px;
}
.icons-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  &.scrollable {
    height: 70vh;
    overflow-y: scroll;
    overflow-x: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.icon {
  width: 50px;
  cursor: pointer;
}
</style>
