import { createI18n } from "vue-i18n";

const messages = {
  "en-US": {
    login: {
      signUp: "Sign Up",
      signIn: "Sign In",
      signInWithGoogle: "Sign in with Google",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
    },
    settings: {
      settings: "Settings",
      nickname: "Nickname",
      setANickname: "Set a nickname",
      logout: "Logout",
      addAChild: "Add a child",
      addAParent: "Add a parent",
      children: "Children",
      parents: "Parents",
      noChildren: "No children",
      noParents: "No Parents",
      accept: "Accept",
      delete: "Delete",
      search: "Search",
      noResults: "No results",
    },
    addForm: {
      addItem: "Add item",
      addList: "Add list",
      name: "Name",
      description: "Description",
      number: "Number",
      pickIcon: "Pick icon",
    },
    validation: {
      fieldIsRequired: "Field is required",
      fieldMustBeAValidEmail: "Field must be a valid email",
      passwordMustConatinAtLeast:
        "Password must contain at least {number} characters",
      passwordsDontMatch: "Passwords don't match",
      cannotBeLongerThan: "Field cannot be longer than {number} characters",
      selectAnIcon: "Select an icon",
    },
  },
  "pl-PL": {
    login: {
      signUp: "Zarejestruj się",
      signIn: "Zaloguj się",
      signInWithGoogle: "Zaloguj przez Google",
      email: "Email",
      password: "Hasło",
      confirmPassword: "Potwierdź hasło",
    },
    settings: {
      settings: "Ustawienia",
      nickname: "Pseudonim",
      setANickname: "Ustaw pseudonim",
      logout: "Wyloguj się",
      addAChild: "Dodaj dziecko",
      addAParent: "Dodaj rodzica",
      children: "Dzieci",
      parents: "Rodzice",
      noChildren: "Brak dzieci",
      noParents: "Brak rodziców",
      accept: "Zaakceptuj",
      delete: "Usuń",
      search: "Szukaj",
      noResults: "Brak wyników",
    },
    addForm: {
      addItem: "Dodaj element",
      addList: "Dodaj listę",
      name: "Nazwa",
      description: "Opis",
      number: "Ilość",
      pickIcon: "Wybierz ikonkę",
    },
    validation: {
      fieldIsRequired: "Pole jest wymagane",
      fieldMustBeAValidEmail: "Wpisz prawidłowy email",
      passwordMustConatinAtLeast:
        "Hasło musi zawierać przynajmniej {number} znaków",
      passwordsDontMatch: "Hasła się różnią",
      cannotBeLongerThan: "Pole nie może być dłuższe niż {number} znaków",
      selectAnIcon: "Wybierz ikonkę",
    },
  },
};

type MessageSchema = (typeof messages)["en-US"];

let locale = window.location.pathname.replace(/^\/([^\/]+).*/i, "$1");

if (!Object.keys(messages).includes(locale)) {
  locale = "en-US";
}

const i18n = createI18n<[MessageSchema], "en-US" | "pl-PL">({
  locale: locale,
  fallbackLocale: "en-US",
  messages,
});

export default i18n;
