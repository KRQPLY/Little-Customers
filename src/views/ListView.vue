<template>
  <div class="list" v-if="isUserLoggedIn">
    <div class="items">
      <ItemTile
        v-for="item in items"
        :name="item.name"
        :id="item.id"
        :iconUrl="item.iconUrl"
        :description="item.description"
        :quantity="item.quantity"
        :bought="item.bought"
        :listId="id"
      />
      <button class="add-item-button" @click="isAddItemPopupVisible = true">
        <IconAddItem />
      </button>
    </div>
    <Popup v-if="isAddItemPopupVisible" @close="isAddItemPopupVisible = false">
      <AddForm @added="isAddItemPopupVisible = false" :id="id" />
    </Popup>
  </div>
</template>

<script setup lang="ts">
import type Item from "@/types/Item";
import Popup from "@/components/Popup.vue";
import ItemTile from "@/components/ItemTile.vue";
import IconAddItem from "@/components/icons/IconAddItem.vue";
import AddForm from "@/components/AddForm.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { onAuthStateChanged, getAuth } from "@firebase/auth";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const router = useRouter();
const auth = getAuth();
const isUserLoggedIn = ref(false);
const items = ref<Item[]>([]);
const isAddItemPopupVisible = ref(false);

const id =
  typeof router.currentRoute.value.query.id === "string"
    ? router.currentRoute.value.query.id
    : "";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    isUserLoggedIn.value = false;
    router.push({ path: `/${locale.value}/login` });
  } else {
    isUserLoggedIn.value = true;
    watchAndUpdateItems(user.uid);
  }
});

async function watchAndUpdateItems(uid: string) {
  if (!id) {
    router.push({ path: `/${locale.value}` });
    return;
  }
  const docRef = doc(db, "lists", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists() && docSnap.data().users.includes(uid)) {
    onSnapshot(query(collection(db, "lists", id, "items")), (querySnapshot) => {
      const itemArray: Item[] = [];
      querySnapshot.forEach((doc) => {
        const item: Item = {
          id: doc.id,
          name: doc.data().name,
          iconUrl: doc.data().iconUrl,
          description: doc.data().description,
          quantity: doc.data().quantity,
          bought: doc.data().bought,
        };
        itemArray.push(item);
      });
      items.value = itemArray;
    });
  } else {
    router.push({ path: `/${locale.value}` });
  }
}
</script>

<style scoped lang="scss">
.list {
  height: 100%;
}
.items {
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.add-item-button {
  box-sizing: content-box;
  min-height: 160.4px;
  padding: 10px;
  background-color: $color-main;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity: 0.9;
  }
}
@include media-xs {
  .items {
    grid-template-columns: 1fr 1fr;
  }
  .add-item-button {
    min-height: 190.8px;
  }
}
@include media-sm {
  .items {
    grid-template-columns: repeat(3, 1fr);
  }
}
@include media-md {
  .items {
    grid-template-columns: repeat(4, 1fr);
  }
}
@include media-lg {
  .items {
    grid-template-columns: repeat(5, 1fr);
  }
}
@include media-xl {
  .items {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
