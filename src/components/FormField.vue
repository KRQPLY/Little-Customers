<template>
  <div class="form-field">
    <div class="label" v-if="secondary">{{ placeholder }}</div>
    <input
      :class="{ secondary: secondary }"
      v-model="value"
      :type="type"
      :placeholder="secondary ? '' : placeholder"
      v-if="type !== 'textarea'"
    />
    <textarea
      :class="{ secondary: secondary }"
      v-model="(value as string)"
      :placeholder="secondary ? '' : placeholder"
      rows="3"
      v-else
    />
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
  secondary: {
    type: Boolean,
    default: false,
  },
});

const nameRef = toRef(props, "name");

const { errorMessage, value } = useField(nameRef);
</script>

<stye scoped lang="scss">
.form-field {
  width: 100%;

  .label {
    color: $color-athens-gray;
  }

  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid $color-athens-gray;
    border-radius: 4px;
    font-family: Poppins;
    padding: 10px;
    outline: none;
    &:focus {
      border: 1px solid $color-black;
    }
    &.secondary {
      width: 300px;
      padding: 0;
      padding-bottom: 20px;
      color: $color-black;
      background: none;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid $color-athens-gray;
      &:focus {
        border-color: $color-deep-koamaru;
      }
    }
  }

  input {
    height: 40px;
  }

  textarea {
    resize: none;
  }

  .error-message {
    font-size: 10px;
    color: $color-red;
  }

  &:focus-within {
    .label {
      color: $color-deep-koamaru;
    }
  }
}
</stye>
