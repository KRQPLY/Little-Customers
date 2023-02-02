<template>
  <div class="add">
    <h1>Add {{ id ? "item" : "list" }}</h1>
    <FormField name="name" type="text" placeholder="Name" secondary />
    <FormField
      name="description"
      type="textarea"
      placeholder="Description"
      secondary
    />
    <FormField
      name="quantity"
      type="number"
      placeholder="Number"
      secondary
      v-if="id"
    />
    <img class="icon" :src="iconUrl" :alt="iconUrl" v-if="iconUrl" />
    <div class="button-icon-section">
      <Button
        label="Pick icon"
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
    <Button :label="`Add ${id ? 'item' : 'list'}`" @click="addItemOrList" />
  </div>
</template>

<script setup lang="ts">
import FormField from "@/components/FormField.vue";
import Button from "@/components/Button.vue";
import PickIcon from "@/components/PickIcon.vue";
import Popup from "./Popup.vue";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";

const emits = defineEmits(["added"]);
const props = defineProps<{ id?: string }>();

const isIconPopupVisible = ref(false);
const iconUrl = ref("");
const iconErrorMessage = ref("");

const schema = !props.id
  ? yup.object({
      name: yup
        .string()
        .required("Field is required")
        .max(20, "Name cannot be longer than 20 characters"),
      description: yup
        .string()
        .required("Field is required")
        .max(80, "Description cannot be longer than 80 characters"),
    })
  : yup.object({
      name: yup
        .string()
        .required("Field is required")
        .max(20, "Name cannot be longer than 20 characters"),
      description: yup
        .string()
        .required("Field is required")
        .max(80, "Description cannot be longer than 80 characters"),
      quantity: yup
        .number()
        .typeError("Quantity must be a number")
        .required("Field is required"),
    });

const { errors, values } = useForm({
  validationSchema: schema,
});

function handleIconPick(url: string) {
  iconUrl.value = url;
  iconErrorMessage.value = "";
  isIconPopupVisible.value = false;
}

async function addItemOrList() {
  if (!iconUrl.value) {
    iconErrorMessage.value = "Choose an icon";

    return;
  }
  if (!auth?.currentUser?.uid) {
    return;
  }
  const collectionArgs = ["users", auth.currentUser.uid, "lists"];
  const collectionAttrs: {
    name: string;
    description: string;
    iconUrl: string;
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
  }
  if (!Object.keys(errors.value).length) {
    await addDoc(collection(db, collectionArgs.join("/")), collectionAttrs);
    emits("added");
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
