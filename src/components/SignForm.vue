<template>
  <div class="sign-in">
    <h1>{{ isSignIn ? "Sign In" : "Sign Up" }}</h1>
    <FormField name="email" type="email" placeholder="Email" />
    <FormField name="password" type="password" placeholder="Password" />
    <FormField
      name="confirmedPassword"
      type="password"
      placeholder="Confirm Password"
      v-if="!isSignIn"
    />

    <Button @click="signIn" label="Sign in" v-if="isSignIn" />
    <Button
      @click="signWithGoogle"
      label="Sign in with Google"
      type="google"
      v-if="isSignIn"
    />
    <Button @click="signUp" label="Sign up" v-else />
  </div>
</template>

<script setup lang="ts">
import FormField from "@/components/FormField.vue";
import Button from "@/components/Button.vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  isSignIn: {
    type: Boolean,
    default: false,
  },
});

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const schema = props.isSignIn
  ? yup.object({
      email: yup
        .string()
        .required("Field is required")
        .email("Field must be a valid email"),
      password: yup.string().required("Field is required"),
    })
  : yup.object({
      email: yup
        .string()
        .required("Field is required")
        .email("Field must be a valid email"),
      password: yup
        .string()
        .required("Field is required")
        .min(8, "Password must contain at least 8 characters"),
    });

const { errors, values, setFieldError } = useForm({
  validationSchema: schema,
});

function signIn() {
  if (!Object.keys(errors.value).length) {
    signInWithEmailAndPassword(auth, values.email, values.password).catch(
      (error) => {
        console.error(error.code);
        alert(error.message);
      }
    );
  }
}

function signWithGoogle() {
  signInWithPopup(auth, googleProvider).catch((error) => {
    console.error(error.code);
    alert(error.message);
  });
}

function signUp() {
  if (values.confirmedPassword !== values.password) {
    setFieldError("confirmedPassword", "Passwords don't match");
  }
  if (!Object.keys(errors.value).length) {
    createUserWithEmailAndPassword(auth, values.email, values.password).catch(
      (error) => {
        console.error(error.code);
        alert(error.message);
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

  input {
    width: 100%;
    box-sizing: border-box;
    height: 40px;
    border: 1px solid $color-athens-gray;
    border-radius: 4px;
    font-family: Poppins;
    padding: 10px;
  }
}
</style>
