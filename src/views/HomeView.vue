<template>
  <div class="home-view" v-if="tokenStore.token">
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
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useTokenStore } from "@/stores/token";
import { ref } from "vue";

const router = useRouter();
const tokenStore = useTokenStore();
const lists = ref<List[]>([]);
const isAddListPopupVisible = ref(false);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    tokenStore.setToken("");
    router.push({ name: "login" });
  } else {
    tokenStore.setToken(user.uid);
    watchAndUpdateLists(user.uid);
  }
});

async function watchAndUpdateLists(uid: string) {
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
  .skeleton {
    height: 210px;
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
