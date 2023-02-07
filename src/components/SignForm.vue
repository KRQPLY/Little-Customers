<template>
  <div class="sign-in">
    <h1>{{ isSignIn ? $t("login.signIn") : $t("login.signUp") }}</h1>
    <FormField name="email" type="email" :placeholder="$t('login.email')" />
    <FormField
      name="password"
      type="password"
      :placeholder="$t('login.password')"
    />
    <FormField
      name="confirmedPassword"
      type="password"
      :placeholder="$t('login.confirmPassword')"
      v-if="!isSignIn"
    />

    <Button @click="signIn" :label="$t('login.signIn')" v-if="isSignIn" />
    <Button
      @click="signWithGoogle"
      :label="$t('login.signInWithGoogle')"
      type="google"
      v-if="isSignIn"
    />
    <Button @click="signUp" :label="$t('login.signUp')" v-else />
  </div>
</template>

<script setup lang="ts">
import FormField from "@/components/FormField.vue";
import Button from "@/components/Button.vue";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isSignIn: {
    type: Boolean,
    default: false,
  },
});

const googleProvider = new GoogleAuthProvider();
const { t } = useI18n();

const schema = props.isSignIn
  ? yup.object({
      email: yup
        .string()
        .required(t("validation.fieldIsRequired"))
        .email(t("validation.fieldMustBeAValidEmail")),
      password: yup.string().required(t("validation.fieldIsRequired")),
    })
  : yup.object({
      email: yup
        .string()
        .required(t("validation.fieldIsRequired"))
        .email(t("validation.fieldMustBeAValidEmail")),
      password: yup
        .string()
        .required(t("validation.fieldIsRequired"))
        .min(8, t("validation.passwordMustConatinAtLeast", { number: "8" })),
    });

const { errors, values, setFieldError, validate } = useForm({
  validationSchema: schema,
});

async function signIn() {
  const validation = await validate();
  if (validation.valid) {
    signInWithEmailAndPassword(auth, values.email, values.password).catch(
      (error) => {
        console.error(error.code);
      }
    );
  }
}

function signWithGoogle() {
  signInWithPopup(auth, googleProvider).catch((error) => {
    console.error(error.code);
  });
}

async function signUp() {
  const validation = await validate();
  if (values.confirmedPassword !== values.password) {
    setFieldError("confirmedPassword", t("validation.passwordsDontMatch"));
  }
  if (validation.valid) {
    createUserWithEmailAndPassword(auth, values.email, values.password).catch(
      (error) => {
        console.error(error.code);
      }
    );
  }
}
</script>

<style scoped lang="scss">
.sign-in {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>
