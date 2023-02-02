<template>
  <div class="home-view" v-if="isUserLoggedIn">
    <div class="lists">
      <ListFolder
        v-for="list in lists"
        :name="list.name"
        :id="list.id"
        :iconUrl="list.iconUrl"
        :description="list.description"
      />
      <button class="add-list-button" @click="isAddListPopupVisible = true">
        <IconAddList />
      </button>
    </div>
    <Popup v-if="isAddListPopupVisible" @close="isAddListPopupVisible = false">
      <AddForm @added="isAddListPopupVisible = false" />
    </Popup>
  </div>
</template>

<script setup lang="ts">
import ListFolder from "@/components/ListFolder.vue";
import IconAddList from "@/components/icons/IconAddList.vue";
import Popup from "@/components/Popup.vue";
import AddForm from "@/components/AddForm.vue";
import type List from "@/types/List";
import { useRouter } from "vue-router";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { ref } from "vue";

const router = useRouter();
const auth = getAuth();
const isUserLoggedIn = ref(false);
const lists = ref<List[]>([]);
const isAddListPopupVisible = ref(false);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    isUserLoggedIn.value = false;
    router.push({ name: "login" });
  } else {
    isUserLoggedIn.value = true;
    watchAndUpdateLists(user.uid);
  }
});

function watchAndUpdateLists(uid: string) {
  onSnapshot(query(collection(db, "users", uid, "lists")), (querySnapshot) => {
    const listArray: List[] = [];
    querySnapshot.forEach((doc) => {
      const list: List = {
        id: doc.id,
        name: doc.data().name,
        iconUrl: doc.data().iconUrl,
        description: doc.data().description,
      };
      listArray.push(list);
    });
    lists.value = listArray;
  });
}
</script>

<style scoped lang="scss">
.home-view {
  height: 100%;
}
.lists {
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.skeleton {
  height: 180px;
}
.add-list-button {
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
}
@include media-xs {
  .lists {
    grid-template-columns: 1fr 1fr;
  }
  .add-list-button {
    min-height: 190.8px;
  }
}
@include media-sm {
  .lists {
    grid-template-columns: repeat(3, 1fr);
  }
}
@include media-md {
  .lists {
    grid-template-columns: repeat(4, 1fr);
  }
}
@include media-lg {
  .lists {
    grid-template-columns: repeat(5, 1fr);
  }
}
@include media-xl {
  .lists {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
