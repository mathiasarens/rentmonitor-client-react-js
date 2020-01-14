import i18n from "i18next";
import LngDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      home: "Home",
      tenants: "Tenants",
      accounts: "Accounts",
      email: "Email",
      emailAddress: "Email Address",
      password: "Password",
      projectName: "Project Name",
      phone: "Phone",
      newTenant: "New Tenant",
      connectFints: "Connect",
      createTenant: "Create",
      formValidationFailed: "Please correct your inputs",
      newAccountSettings: "New account settings",
      fintsBlz: "FinTs BLZ",
      fintsUrl: "FinTs URL",
      fintsUser: "FinTs User",
      fintsPassword: "FinTs Password",
      signupButton: "Sign up",
      signupHeadline: "Sign up",
      signupSignin: "Already registered? Sign in",
      signinHeadline: "Sign in",
      signinButton: "Sign in",
      signinSignup: "Don't have an account? Sign Up",
      signinRemmeberMe: "Remember me",
      forgotPassword: "Forgot password?",
      homeHeadline: "Welcome to Rent Monitor",
      connectionError: "Connection Error. Please try again later.",
      unauthenticatedError: "You were logged out",
      fintsAccountSynchronisationTitle: "FinTS Synchronisation",
      fintsAccountSynchronisationButton: "Start",
      fintsAccountTransactionTitle: "Fints Account Transactions",
      fintsAccountTransactionDate: "Date",
      fintsAccountTransactionName: "Name",
      fintsAccountTransactionIban: "IBAN",
      fintsAccountTransactionBic: "BIC",
      fintsAccountTransactionText: "Comment",
      fintsAccountTransactionAmount: "Amount",
      fintsAccountSelectionHead: "Select an account",
      iban: "IBAN",
      bic: "BIC"
    }
  },
  de: {
    translation: {
      home: "Übersicht",
      tenants: "Mieter",
      accounts: "Konten",
      email: "E-Mail",
      emailAddress: "E-Mail-Addresse",
      password: "Passwort",
      projectName: "Projektname",
      phone: "Telefon",
      newTenant: "Neuer Mieter",
      connectFints: "Verbinden",
      createTenant: "Anlegen",
      formValidationFailed: "Bitte korrigieren Sie Ihre Eingaben",
      newAccountSettings: "Neue Kontoeinstellungen",
      fintsBlz: "FinTs BLZ",
      fintsUrl: "FinTs URL",
      fintsUser: "FinTs Benutzer",
      fintsPassword: "FinTs Passwort",
      signupButton: "Konto erstellen",
      signupHeadline: "Konto erstellen",
      signupSignin: "Schon registriert? Hier einloggen",
      signinHeadline: "Einloggen",
      signinButton: "Einloggen",
      signinSignup: "Noch kein Konto erstellt? Dann lege hier eines an.",
      signinRemmeberMe: "Angemeldet bleiben",
      forgotPassword: "Passwort vergessen?",
      homeHeadline: "Willkommen bei Rent Monitor",
      connectionError: "Verbindungsfehler. Bitte versuchen Sie es später noch einmal.",
      unauthenticatedError: "Sie wurden ausgeloggt.",
      fintsAccountSynchronisationTitle: "FinTS Kontoabgleich",
      fintsAccountSynchronisationButton: "Start",
      fintsAccountTransactionTitle: "Fints Konto Transaktionen",
      fintsAccountTransactionDate: "Datum",
      fintsAccountTransactionName: "Name",
      fintsAccountTransactionIban: "IBAN",
      fintsAccountTransactionBic: "BIC",
      fintsAccountTransactionText: "Verwendungszweck",
      fintsAccountTransactionAmount: "Betrag",
      fintsAccountSelectionHead: "Wählen Sie ein Konto aus",
      iban: "IBAN",
      bic: "BIC"
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
