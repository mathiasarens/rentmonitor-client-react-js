import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LngDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      home: "Home",
      tenants: "Tenants",
      accounts: "Accounts",
      email: "Email",
      phone: "Phone"
    }
  },
  de: {
    translation: {
      home: "Übersicht",
      tenants: "Mieter",
      accounts: "Konten",
      email: "E-Mail",
      phone: "Telefon"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LngDetector)
  .init({
    resources,
    lng: "de",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
