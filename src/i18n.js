import i18n from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      home: 'Home',
      tenants: 'Tenants',
      accounts: 'Accounts',
      account: 'Account',
      email: 'Email',
      emailAddress: 'Email Address',
      password: 'Password',
      projectName: 'Project Name',
      phone: 'Phone',
      iban: 'IBAN',
      bic: 'BIC',
      dateFormat: 'dd/MM/yyyy',

      connectFints: 'Connect',
      tenant: 'Tenant',
      tenantSave: 'Save',
      tenantAccountSynchronizationName: 'Name on account statement',
      formValidationFailed: 'Please correct your inputs',
      newAccountSettings: 'New account settings',
      fintsBlz: 'FinTs BLZ',
      fintsUrl: 'FinTs URL',
      fintsUser: 'FinTs User',
      fintsPassword: 'FinTs Password',
      signupButton: 'Sign up',
      signupHeadline: 'Sign up',
      signupSignin: 'Already registered? Sign in',
      signinHeadline: 'Sign in',
      signinButton: 'Sign in',
      signinSignup: "Don't have an account? Sign Up",
      signinRemmeberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      homeHeadline: 'Welcome to Rent Monitor',
      connectionError: 'Connection Error. Please try again later.',
      unauthenticatedError: 'You were logged out',
      fintsAccountSynchronisationTitle: 'FinTS Synchronisation',
      fintsAccountSynchronisationButton: 'Start',
      fintsAccountSynchronisationStep2Button: 'Save',
      fintsAccountTransactionTitle: 'Fints Account Transactions',
      fintsAccountTransactionDate: 'Date',
      fintsAccountTransactionName: 'Name',
      fintsAccountTransactionIban: 'IBAN',
      fintsAccountTransactionBic: 'BIC',
      fintsAccountTransactionText: 'Comment',
      fintsAccountTransactionAmount: 'Amount',
      fintsAccountSelectionHead: 'Select an account',
      fintsAccountSyncronisationFrom: 'from',
      fintsAccountSyncronisationTo: 'to',
      fintsAccountSyncronisationSuccess:
        'Synchronisation: New: {{newBookingsCount}} Unmatched: {{unmatchedTransactions}}',
      transactions: 'Transactions',

      contracts: 'Contracts',
      contract: 'Contract',
      contractRentDueEveryMonth: 'Monthly',
      contractRentDueDayOfMonth: 'Pay Day',
      contractAmount: 'Rent',
      contractSave: 'Save',
      contractStart: 'Start',
      contractEnd: 'End',

      bookings: 'Bookings',
      booking: 'Booking',
      bookingDate: 'Date',
      bookingComment: 'Comment',
      bookingAmount: 'Amount',
    },
  },
  de: {
    translation: {
      home: 'Übersicht',
      tenants: 'Mieter',
      accounts: 'Konten',
      account: 'Konto',
      email: 'E-Mail',
      emailAddress: 'E-Mail-Addresse',
      password: 'Passwort',
      projectName: 'Projektname',
      phone: 'Telefon',
      iban: 'IBAN',
      bic: 'BIC',
      dateFormat: 'dd.MM.yyyy',

      tenant: 'Mieter',
      connectFints: 'Verbinden',
      tenantSave: 'Anlegen',
      tenantAccountSynchronizationName: 'Name auf Kontoauszug',
      formValidationFailed: 'Bitte korrigieren Sie Ihre Eingaben',
      newAccountSettings: 'Neue Kontoeinstellungen',
      fintsBlz: 'FinTs BLZ',
      fintsUrl: 'FinTs URL',
      fintsUser: 'FinTs Benutzer',
      fintsPassword: 'FinTs Passwort',
      signupButton: 'Konto erstellen',
      signupHeadline: 'Konto erstellen',
      signupSignin: 'Schon registriert? Hier einloggen',
      signinHeadline: 'Einloggen',
      signinButton: 'Einloggen',
      signinSignup: 'Noch kein Konto erstellt? Dann lege hier eines an.',
      signinRemmeberMe: 'Angemeldet bleiben',
      forgotPassword: 'Passwort vergessen?',
      homeHeadline: 'Willkommen bei Rent Monitor',
      connectionError:
        'Verbindungsfehler. Bitte versuchen Sie es später noch einmal.',
      unauthenticatedError: 'Sie wurden ausgeloggt.',
      fintsAccountSynchronisationTitle: 'Kontoabgleich mit der Bank',
      fintsAccountSynchronisationButton: 'Starten',
      fintsAccountSynchronisationStep2Button: 'Speichern',
      fintsAccountTransactionTitle: 'Umsätze',
      fintsAccountTransactionDate: 'Datum',
      fintsAccountTransactionName: 'Name',
      fintsAccountTransactionIban: 'IBAN',
      fintsAccountTransactionBic: 'BIC',
      fintsAccountTransactionText: 'Verwendungszweck',
      fintsAccountTransactionAmount: 'Betrag',
      fintsAccountSelectionHead: 'Wählen Sie ein Konto aus',
      fintsAccountSyncronisationFrom: 'von',
      fintsAccountSyncronisationTo: 'bis',
      fintsAccountSyncronisationSuccess:
        'Kontoabgleich erfolgreich: Neu: {{newBookingsCount}} Nicht zuordenbar: {{unmatchedTransactions}}',
      transactions: 'Umsätze',

      contracts: 'Mietverträge',
      contract: 'Mietvertrag',

      contractRentDueEveryMonth: 'Monatlich',
      contractRentDueDayOfMonth: 'Zahltag',
      contractAmount: 'Miete',
      contractSave: 'Speichern',
      contractStart: 'Beginn',
      contractEnd: 'Ende',

      bookings: 'Buchungen',
      booking: 'Buchung',
      bookingDate: 'Datum',
      bookingComment: 'Verwendungszweck',
      bookingAmount: 'Betrag',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LngDetector)
  .init({
    resources,
    lng: 'de',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
