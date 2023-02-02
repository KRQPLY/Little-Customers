<template>
  <div class="pick-icon">
    <img
      class="icon"
      :src="url"
      :alt="url"
      v-for="url in urls"
      @click="$emit('picked', url)"
    />
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
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}
.icon {
  width: 50px;
}

@include media-sm {
  .pick-icon {
    grid-template-columns: repeat(9, 1fr);
  }
}

@include media-md {
  .pick-icon {
    grid-template-columns: repeat(14, 1fr);
  }
}
</style>
