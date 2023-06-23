import {useAuthenticator} from '@aws-amplify/ui-react';
import {Amplify} from 'aws-amplify';
import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import awsExports from './aws-exports';
import BookingEditor from './booking/BookingEditor';
import Bookings from './booking/Bookings';
import {
  ACCOUNTS_PATH,
  ACCOUNT_PATH,
  BOOKINGS_PATH,
  BOOKING_PATH,
  CONTRACTS_PATH,
  CONTRACT_PATH,
  OVERVIEW_PATH,
  TENANTS_PATH,
  TENANT_PATH,
  TRANSACTIONS_PATH,
  WELCOME_PATH,
} from './Constants';
import ContractEditor from './contract/ContractEditor';
import Contract from './contract/Contracts';
import AccountEditorStepAccountSelection from './fints/account/AccountEditorStepAccountSelection';
import AccountEditorStepInitial from './fints/account/AccountEditorStepInitial';
import AccountEditorStepTan from './fints/account/AccountEditorStepTan';
import Account from './fints/account/Accounts';
import FintsAccountSynchronisationOverview from './fints/synchronisation/FintsAccountSynchronisationOverview';
import FintsAccountTransactions from './fints/transaction/FintsAccountTransactions';
import Overview from './overview/Overview';
import PageTemplate from './PageTemplate';
import Tenant from './tenant/Tenant';
import TenantEditor from './tenant/TenantEditor';
import Welcome from './welcome/Welcome';

Amplify.configure(awsExports);

function App() {
  const {authStatus} = useAuthenticator((context) => [context.authStatus]);

  return (
    <BrowserRouter>
      <PageTemplate>
        {authStatus !== 'authenticated' ? (
          <Routes>
            <Route path={WELCOME_PATH} element={<Welcome />} />
            <Route path="*" element={<Welcome />} />
          </Routes>
        ) : (
          <Routes>
            <Route path={OVERVIEW_PATH} element={<Overview />} />
            <Route path={TENANTS_PATH} element={<Tenant />} />
            <Route path={TENANT_PATH}>
              <Route index element={<TenantEditor />} />
              <Route path=":tenantId" element={<TenantEditor />} />
            </Route>
            <Route path={CONTRACTS_PATH} element={<Contract />}></Route>
            <Route path={CONTRACT_PATH}>
              <Route index element={<ContractEditor />} />
              <Route path=":contractId" element={<ContractEditor />} />
            </Route>
            <Route path={BOOKINGS_PATH} element={<Bookings />} />
            <Route path={BOOKING_PATH} element={<BookingEditor />}>
              <Route path=":bookingId" element={<BookingEditor />} />
            </Route>
            <Route path={ACCOUNTS_PATH} element={<Account />}></Route>
            <Route path={ACCOUNT_PATH}>
              <Route path="step1" element={<AccountEditorStepInitial />}>
                <Route
                  path=":accountId"
                  element={<AccountEditorStepInitial />}
                />
              </Route>
              <Route
                path="step2"
                element={<AccountEditorStepAccountSelection />}
              >
                <Route
                  path=":accountId"
                  element={<AccountEditorStepAccountSelection />}
                />
              </Route>
              <Route path="stepTan" element={<AccountEditorStepTan />} />
            </Route>
            <Route
              path="accountsynchronisation"
              element={<FintsAccountSynchronisationOverview />}
            />
            <Route
              path={TRANSACTIONS_PATH}
              element={<FintsAccountTransactions />}
            />
            <Route path="*" element={<Navigate to={OVERVIEW_PATH} replace />} />
          </Routes>
        )}
      </PageTemplate>
    </BrowserRouter>
  );
}

export default App;
