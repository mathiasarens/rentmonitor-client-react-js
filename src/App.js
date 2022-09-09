import '@aws-amplify/ui-react/styles.css';
import {Amplify, Auth} from 'aws-amplify';
import React, {useCallback, useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import {SignIn} from './authentication/signin/SignIn';
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
  SIGNIN_PATH,
  TENANTS_PATH,
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
  const [loggedIn, setLoggedIn] = useState(false);

  const loadCurrentAuthenticatedUser = useCallback(() => {
    Auth.currentAuthenticatedUser()
      .then((session) => {
        console.log(
          'App - Logged in: ' + session.signInUserSession.idToken.payload.email,
        );
        setLoggedIn(true);
      })
      .catch(() => {
        setLoggedIn(false);
        console.log('App - Not logged In');
      });
  }, []);

  useEffect(() => {
    console.log('App - Auth.currentAuthenticatedUser - effect');
    loadCurrentAuthenticatedUser();
  }, [loadCurrentAuthenticatedUser]);

  return (
    <BrowserRouter>
      <PageTemplate
        loggedIn={loggedIn}
        loadCurrentAuthenticatedUser={loadCurrentAuthenticatedUser}
      />
      {!loggedIn && (
        <Routes>
          <Route
            path={SIGNIN_PATH}
            element={
              <SignIn
                loadCurrentAuthenticatedUser={loadCurrentAuthenticatedUser}
              />
            }
          />
          <Route path={WELCOME_PATH} element={<Welcome />} />
          <Route path="*" element={<Welcome />} />
        </Routes>
      )}
      {loggedIn && (
        <Routes>
          <Route path={OVERVIEW_PATH} element={<Overview />} />
          <Route path={TENANTS_PATH}>
            <Route index element={<Tenant />} />
            <Route path=":tenantId" element={<TenantEditor />} />
          </Route>
          <Route path={CONTRACTS_PATH} element={<Contract />}></Route>
          <Route path={CONTRACT_PATH}>
            <Route index element={<ContractEditor />} />
            <Route path=":contractId" element={<ContractEditor />} />
          </Route>
          <Route path={BOOKINGS_PATH} element={<Bookings />}>
            <Route path=":tenantId" element={<Bookings />} />
          </Route>
          <Route path={BOOKING_PATH} element={<BookingEditor />}>
            <Route path=":bookingId" element={<BookingEditor />} />
          </Route>
          <Route path={ACCOUNTS_PATH} element={<Account />}></Route>
          <Route path={ACCOUNT_PATH}>
            <Route path="step1" element={<AccountEditorStepInitial />}>
              <Route path=":accountId" element={<AccountEditorStepInitial />} />
            </Route>
            <Route path="step2" element={<AccountEditorStepAccountSelection />}>
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
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
