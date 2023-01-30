<template>
  <div class="form-field">
    <input v-model="value" :type="type" :placeholder="placeholder" />
    <div class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
});

const nameRef = toRef(props, "name");

const { errorMessage, value } = useField(nameRef);
</script>

<stye lang="scss" scoped>
.form-field {
  width: 100%;

  input {
    width: 100%;
    box-sizing: border-box;
    height: 40px;
    border: 1px solid $color-athens-gray;
    border-radius: 4px;
    font-family: Poppins;
    padding: 10px;
  }

  .error-message {
    font-size: 10px;
    color: $color-red;
  }
}
</stye>
