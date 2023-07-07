import i18n from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      overview: 'Overview',
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
      signup: 'Sign Up',
      signin: 'Sign In',
      logout: 'Logout',
      filter: 'Filter',
      edit: 'Edit',
      delete: 'Delete',
      synchronize: 'Synchronize',
      name: 'Name',

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
      signInError: 'Unknown email or wrong password',
      forgotPassword: 'Forgot password?',
      homeHeadline: 'Welcome to Rent Monitor',
      connectionError: 'Connection Error. Please try again later.',
      unauthenticatedError: 'You were logged out',
      fintsAccountSynchronisationTitle: 'Accounts',
      fintsAccountSynchronisationPeriodFrom: 'from',
      fintsAccountSynchronisationPeriodTo: 'to',
      fintsAccountSynchronisationPeriod: 'Period',
      fintsAccountSynchronisationButton: 'Synchronze',
      fintsAccountSynchronisationResultNewBookings: 'New Bookings',
      fintsAccountSynchronisationResultNewTransactions: 'New Transactions',
      fintsAccountSynchronisationResultNoTransactions: 'No new transactions',
      fintsAccountSynchronisationStep2Button: 'Save',
      fintsAccountTransactionTitle: 'Fints Account Transactions',
      fintsAccountTransactionDate: 'Date',
      fintsAccountTransactionName: 'Name',
      fintsAccountTransactionIban: 'IBAN',
      fintsAccountTransactionBic: 'BIC',
      fintsAccountTransactionText: 'Comment',
      fintsAccountTransactionAmount: 'Amount',
      fintsAccountSelectionHead: 'Select an account',
      fintsAccountTransactionCreateDueBookingsButton: 'Create due bookings',
      fintsAccountTransactionCreateBookingButton: 'Create booking',
      fintsAccountTransactionLoadNextBookingsButton: 'More',
      fintsAccountTransactionsLoading: 'Loading...',
      fintsAccountSyncronisationFrom: 'from',
      fintsAccountSyncronisationTo: 'to',
      fintsAccountSyncronisationSuccess:
        'Synchronisation: New: {{newBookingsCount}} Unmatched: {{unmatchedTransactions}}',
      fintsAccountSynchronisationErrorAccountSettingsId:
        'Please select an account',
      fintsAccountSynchronisationErrorFrom: 'Please enter a from date',
      fintsAccountSynchronisationErrorTo: 'Please enter a to date',
      transactions: 'Transactions',

      contracts: 'Contracts',
      contract: 'Contract',
      contractRentDueEveryMonth: 'Monthly',
      contractRentDueEveryMonth1: 'monthly',
      contractRentDueEveryMonthX: 'every {{month}} months',
      contractRentDueEveryMonth12: 'annualy',
      contractRentDueDayOfMonthX: 'payable until {{day}} of month',
      contractRentDueDayOfMonth: 'pay day',
      contractAmount: 'Rent',
      contractSave: 'Save',
      contractStart: 'Start',
      contractEnd: 'End',
      contractErrorMessageTenantId: 'Please select a tenant',
      contractErrorMessageRentDueEveryMonth:
        'Please enter 1 for every month 2 for every second month, etc.',
      contractErrorMessageRentDueDayOfMonth:
        'Please enter a day of month like 10.',
      contractErrorMessageAmount: 'Please enter an amount like 12 or 13.50',
      contractErrorMessageDeposit: 'Please enter an deposit like 12 or 13.50',
      contractErrorMessageStart: 'Please enter a start date',
      contractToBookingTitle: 'Create due bookings for contracts',
      contractDeleteConfirmationText: 'Do you want to delete this contract?',
      contractDeposit: 'Rent deposit',

      bookings: 'Bookings',
      bookingsLoading: 'Loading...',
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
      bookingContractLink: 'Contract',

      tenantBookingOverview: 'Overview',
      tenantBookingOverviewSum: 'Sum',

      accountErrorMessageNameRequired: 'Please enter a name for the account',
      accountErrorMessageFintsBlzRequired:
        'Please enter a sort code for the account',
      accountErrorMessageFintsBlzPatternMismatch:
        'A German bank code consists of 8 digits',
      accountErrorMessageFintsUrlRequired:
        'Please enter a FinTs url for the account',
      accountErrorMessageFintsUserRequired:
        'Please enter a FinTs user for the account',
      accountErrorMessageFintsPasswordRequired:
        'Please enter a FinTs password for the account',

      overviewFetchAccountTransactions: 'Fetch transactions',
    },
  },
  de: {
    translation: {
      overview: 'Übersicht',
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
      signup: 'Registrieren',
      signin: 'Anmelden',
      logout: 'Abmelden',
      filter: 'Filter',
      edit: 'Ändern',
      delete: 'Löschen',
      synchronize: 'Synchronisieren',
      name: 'Name',

      tenant: 'Mieter',
      connectFints: 'Verbinden',
      tenantSave: 'Speichern',
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
      signInError: 'Unbekannte E-Mail-Adresse oder falsches Passwort',
      forgotPassword: 'Passwort vergessen?',
      homeHeadline: 'Willkommen bei Rent Monitor',
      connectionError:
        'Verbindungsfehler. Bitte versuchen Sie es später noch einmal.',
      unauthenticatedError: 'Sie wurden ausgeloggt.',
      fintsAccountSynchronisationTitle: 'Konten',
      fintsAccountSynchronisationPeriod: 'Zeitraum',
      fintsAccountSynchronisationPeriodFrom: 'von',
      fintsAccountSynchronisationPeriodTo: 'bis',
      fintsAccountSynchronisationButton: 'Abgleichen',
      fintsAccountSynchronisationResultNewBookings: 'Neue Buchungen',
      fintsAccountSynchronisationResultNewTransactions: 'Neue Umsätze',
      fintsAccountSynchronisationResultNoTransactions: 'Keine neuen Umsätze',
      fintsAccountSynchronisationStep2Button: 'Speichern',
      fintsAccountTransactionTitle: 'Umsätze',
      fintsAccountTransactionDate: 'Datum',
      fintsAccountTransactionName: 'Name',
      fintsAccountTransactionIban: 'IBAN',
      fintsAccountTransactionBic: 'BIC',
      fintsAccountTransactionText: 'Verwendungszweck',
      fintsAccountTransactionAmount: 'Betrag',
      fintsAccountTransactionCreateDueBookingsButton:
        'Fällige Buchungen erzeugen',
      fintsAccountTransactionCreateBookingButton: 'Buchung erzeugen',
      fintsAccountTransactionLoadNextBookingsButton: 'Mehr',
      fintsAccountTransactionsLoading: 'Laden...',

      fintsAccountSelectionHead: 'Wählen Sie ein Konto aus',
      fintsAccountSyncronisationFrom: 'von',
      fintsAccountSyncronisationTo: 'bis',
      fintsAccountSyncronisationSuccess:
        'Kontoabgleich erfolgreich: Neu: {{newBookingsCount}} Nicht zuordenbar: {{unmatchedTransactions}}',
      fintsAccountSynchronisationErrorAccountSettingsId:
        'Bitte waehle ein Konto aus',
      fintsAccountSynchronisationErrorFrom: 'Bitte waehle einen Starttag',
      fintsAccountSynchronisationErrorTo: 'Bitte waehlen ein Endtag',
      transactions: 'Umsätze',

      contracts: 'Mietverträge',
      contract: 'Mietvertrag',

      contractRentDueEveryMonth: 'Monatlich',
      contractRentDueEveryMonth1: 'monatlich',
      contractRentDueEveryMonthX: 'jeden {{month}} Monat',
      contractRentDueEveryMonth12: 'jährlich',
      contractRentDueDayOfMonthX: 'zum {{day}} eines Monats',
      contractRentDueDayOfMonth: 'Zahltag',
      contractAmount: 'Miete',
      contractSave: 'Speichern',
      contractStart: 'Beginn',
      contractEnd: 'Ende',
      contractErrorMessageTenantId: 'Bitte wähle einen Mieter aus',
      contractErrorMessageRentDueEveryMonth:
        'Bitte gib 1 für jeden Monat an, 2 für jeden zweiten Monat, etc.',
      contractErrorMessageRentDueDayOfMonth:
        'Bitte gib einen Tag im Monat an. Wie 10.',
      contractErrorMessageAmount: 'Bitte gib einen Betrag wie 12 or 13.50 an',
      contractErrorMessageDeposit: 'Bitte gib einen Betrag wie 12 or 13.50 an',
      contractErrorMessageStart: 'Bitte gib einen Mietbeginn ein',
      contractToBookingTitle: 'Mietbuchungen erzeugen',
      contractDeleteConfirmationText:
        'Möchten Sie den Mietvertrag für {{tenantsMap[contractToDelete.tenantId]?.name}} wirklich löschen?',
      contractDeposit: 'Kaution',

      bookings: 'Buchungen',
      bookingsLoading: 'Laden...',
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
      bookingContractLink: 'Vertrag',

      tenantBookingOverview: 'Übersicht',
      tenantBookingOverviewSum: 'Summe',

      accountErrorMessageNameRequired:
        'Bitte gib einen Namen für Kontoverbindung an',
      accountErrorMessageFintsBlzRequired:
        'Bitte gib eine Bankleitzahl für die Kontoverbindung an',
      accountErrorMessageFintsBlzPatternMismatch:
        'Eine Bankleitzahl besteht aus 8 Ziffern',
      accountErrorMessageFintsUrlRequired:
        'Bitte gib eine FinTs URL für die Kontoverbindung an',
      accountErrorMessageFintsUserRequired:
        'Bitte gib einen FinTs User für die Kontoverbindung an',
      accountErrorMessageFintsPasswordRequired:
        'Bitte gib ein FinTs Passwort für die Kontoverbindung an',

      overviewFetchAccountTransactions: 'Umsätze laden',
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
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'wbr'],
  });

export default i18n;
