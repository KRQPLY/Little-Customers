<template>
  <div class="add">
    <h1>{{ id ? $t("addForm.addItem") : $t("addForm.addList") }}</h1>
    <FormField
      name="name"
      type="text"
      :placeholder="$t('addForm.name')"
      secondary
    />
    <FormField
      name="description"
      type="textarea"
      :placeholder="$t('addForm.description')"
      secondary
    />
    <FormField
      name="quantity"
      type="number"
      :placeholder="$t('addForm.number')"
      secondary
      v-if="id"
    />
    <img class="icon" :src="iconUrl" :alt="iconUrl" v-if="iconUrl" />
    <div class="button-icon-section">
      <Button
        :label="$t('addForm.pickIcon')"
        type="secondary"
        @click="isIconPopupVisible = true"
      />
      <div class="error-message" v-if="iconErrorMessage">
        {{ iconErrorMessage }}
      </div>
    </div>
    <Popup v-if="isIconPopupVisible" @close="isIconPopupVisible = false">
      <PickIcon @picked="handleIconPick" />
    </Popup>
    <Button
      :label="id ? $t('addForm.addItem') : $t('addForm.addList')"
      @click="addItemOrList"
    />
  </div>
</template>

<script setup lang="ts">
import FormField from "@/components/FormField.vue";
import Button from "@/components/Button.vue";
import PickIcon from "@/components/PickIcon.vue";
import Popup from "./Popup.vue";
import { useUserStore } from "@/stores/useUserStore";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const emits = defineEmits(["added"]);
const props = defineProps<{ id?: string }>();

const userStore = useUserStore();
const { t } = useI18n();
const isIconPopupVisible = ref(false);
const iconUrl = ref("");
const iconErrorMessage = ref("");

const schema = !props.id
  ? yup.object({
      name: yup
        .string()
        .required(t("validation.fieldIsRequired"))
        .max(20, t("validation.cannotBeLongerThan", { number: "20" })),
      description: yup
        .string()
        .required(t("validation.fieldIsRequired"))
        .max(80, t("validation.cannotBeLongerThan", { number: "80" })),
    })
  : yup.object({
      name: yup
        .string()
        .required(t("validation.fieldIsRequired"))
        .max(20, t("validation.cannotBeLongerThan", { number: "20" })),
      description: yup
        .string()
        .required(t("validation.fieldIsRequired"))
        .max(80, t("validation.cannotBeLongerThan", { number: "80" })),
      quantity: yup
        .number()
        .typeError("Quantity must be a number")
        .required(t("validation.fieldIsRequired")),
    });

const { values, validate } = useForm({
  validationSchema: schema,
});

function handleIconPick(url: string) {
  iconUrl.value = url;
  iconErrorMessage.value = "";
  isIconPopupVisible.value = false;
}

async function addItemOrList() {
  const validation = await validate();
  if (!iconUrl.value) {
    iconErrorMessage.value = t("validation.selectAnIcon");
    return;
  }
  if (!auth?.currentUser?.uid) {
    return;
  }
  const collectionArgs = ["lists"];
  const collectionAttrs: {
    name: string;
    description: string;
    iconUrl: string;
    owner?: string;
    users?: string[];
    quantity?: number;
    bought?: boolean;
  } = {
    name: values.name,
    description: values.description,
    iconUrl: iconUrl.value,
  };
  if (props.id) {
    collectionArgs.push(props.id);
    collectionArgs.push("items");
    collectionAttrs.quantity = values.quantity;
    collectionAttrs.bought = false;
  } else {
    collectionAttrs.users = [auth.currentUser.uid].concat([
      ...userStore.parents.map((parent) => parent.uid),
      ...userStore.children.map((child) => child.uid),
    ]);
    collectionAttrs.owner = auth.currentUser.uid;
  }
  if (validation.valid) {
    emits("added");
    await addDoc(collection(db, collectionArgs.join("/")), collectionAttrs);
  }
}
</script>

<style scoped lang="scss">
.add {
  color: $color-deep-koamaru;
  background-color: $color-white;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.button-icon-section {
  width: 100%;
}
.error-message {
  font-size: 10px;
  color: $color-red;
}
.icon {
  width: 50px;
}
</style>
