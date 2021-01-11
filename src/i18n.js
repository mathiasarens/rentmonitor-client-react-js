import i18n from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

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
      fintsAccountSynchronisationErrorAccountSettingsId: 'Please select an account',
      fintsAccountSynchronisationErrorFrom: 'Please enter a from date',
      fintsAccountSynchronisationErrorTo: 'Please enter a to date',
      transactions: 'Transactions',

      contracts: 'Contracts',
      contract: 'Contract',
      contractRentDueEveryMonth: 'Monthly',
      contractRentDueDayOfMonth: 'Pay Day',
      contractAmount: 'Rent',
      contractSave: 'Save',
      contractStart: 'Start',
      contractEnd: 'End',
      contractErrorMessageRentDueEveryMonth: 'Please enter 1 for every month 2 for every second month, etc.',
      contractErrorMessageRentDueDayOfMonth: 'Please enter a day of month like 10.',
      contractErrorMessageAmount: 'Please enter an amount in like 12 or 13.50',

      bookings: 'Bookings',
      booking: 'Booking',
      bookingDate: 'Date',
      bookingComment: 'Comment',
      bookingAmount: 'Amount',
      bookingSave: 'Save',
      bookingErrorMessageAmount:
        'Please enter a amount with 2 decimal places max.',
      bookingErrorMessageComment:
        'Please enter a booking comment with 255 characters max.',
      bookingErrorMessageTenantId: 'Please select a tenant',
      bookingErrorMessageDate: 'Please add a booking date',
      bookingCommentRentDue: 'Rent due',

      tenantBookingOverview: 'Overview',
      tenantBookingOverviewSum: 'Sum'
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
      fintsAccountSynchronisationErrorAccountSettingsId: 'Bitte waehle ein Konto aus',
      fintsAccountSynchronisationErrorFrom: 'Bitte waehle einen Starttag',
      fintsAccountSynchronisationErrorTo: 'Bitte waehlen ein Endtag',
      transactions: 'Umsätze',

      contracts: 'Mietverträge',
      contract: 'Mietvertrag',

      contractRentDueEveryMonth: 'Monatlich',
      contractRentDueDayOfMonth: 'Zahltag',
      contractAmount: 'Miete',
      contractSave: 'Speichern',
      contractStart: 'Beginn',
      contractEnd: 'Ende',
      contractErrorMessageRentDueEveryMonth: 'Bitte gib 1 für jeden Monat an, 2 für jeden zweiten Monat, etc.',
      contractErrorMessageRentDueDayOfMonth: 'Bitte gib einen Tag im Monat an. Wie 10.',
      contractErrorMessageAmount: 'Bitte gib einen Betrag wie 12 or 13.50 an',

      bookings: 'Buchungen',
      booking: 'Buchung',
      bookingDate: 'Datum',
      bookingComment: 'Verwendungszweck',
      bookingAmount: 'Betrag',
      bookingSave: 'Speichern',
      bookingErrorMessageAmount:
        'Bitte gib einen Betrag mit max. 2 Nachkommastellen an',
      bookingErrorMessageComment:
        'Bitte gib einen Verwendungszweck mit max. 255 Zeichen an',
      bookingErrorMessageTenantId: 'Bitte wähle einen Mieter aus',
      bookingErrorMessageDate: 'Bitte geben Sie ein Buchungsdatum an',

      bookingCommentRentDue: 'Miete fällig',

      tenantBookingOverview: 'Uebersicht',
      tenantBookingOverviewSum: 'Summe'
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
