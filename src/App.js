import {withAuthenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {Amplify} from 'aws-amplify';
import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import awsExports from './aws-exports';
import BookingEditor from './booking/BookingEditor';
import Bookings from './booking/Bookings';
import {
  ACCOUNT_PATH,
  BOOKINGS_PATH,
  BOOKING_PATH,
  CONTRACT_PATH,
  OVERVIEW_PATH,
  TENANTS_PATH,
} from './Constants';
import Contract from './contract/Contract';
import ContractEditor from './contract/ContractEditor';
import Account from './fints/account/Account';
import AccountEditorStepAccountSelection from './fints/account/AccountEditorStepAccountSelection';
import AccountEditorStepInitial from './fints/account/AccountEditorStepInitial';
import AccountEditorStepTan from './fints/account/AccountEditorStepTan';
import FintsAccountSynchronisationSingle from './fints/synchronisation/FintsAccountSynchronisationSingle';
import FintsAccountTransaction from './fints/transaction/FintsAccountTransaction';
import Overview from './overview/Overview';
import PageTemplate from './PageTemplate';
import Tenant from './tenant/Tenant';
import TenantEditor from './tenant/TenantEditor';

Amplify.configure(awsExports);

function App() {
  return (
    <BrowserRouter>
      <PageTemplate />
      <Routes>
        <Route path={OVERVIEW_PATH} element={<Overview />} />
        <Route path={TENANTS_PATH}>
          <Route index element={<Tenant />} />
          <Route path=":tenantId" element={<TenantEditor />} />
        </Route>
        <Route path={CONTRACT_PATH} element={<Contract />}>
          <Route path="edit/:contractId" element={<ContractEditor />} />
        </Route>
        <Route path={BOOKINGS_PATH} element={<Bookings />}>
          <Route path=":tenantId" element={<Bookings />} />
        </Route>
        <Route path={BOOKING_PATH}>
          <Route path=":bookingId" element={<BookingEditor />} />
        </Route>
        <Route path={ACCOUNT_PATH} element={<Account />}>
          <Route
            from="edit"
            render={<Navigate to={`${ACCOUNT_PATH}/edit/step1`} />}
          />
          <Route
            path="edit/step1/:accountId?"
            element={<AccountEditorStepInitial />}
          />
          <Route
            path="edit/step2/:accountId?"
            element={<AccountEditorStepAccountSelection />}
          />
          <Route
            path="edit/stepTan/:accountId?"
            element={<AccountEditorStepTan />}
          />
        </Route>
        <Route
          path="accountsynchronisation"
          element={<FintsAccountSynchronisationSingle />}
        >
          <Route
            path=":accountSettingsId"
            element={<FintsAccountSynchronisationSingle />}
          />
        </Route>
        <Route path="transaction" element={<FintsAccountTransaction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default withAuthenticator(App);
