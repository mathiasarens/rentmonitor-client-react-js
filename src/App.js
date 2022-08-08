import '@aws-amplify/ui-react/styles.css';
import {Amplify, Auth} from 'aws-amplify';
import React, {useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import {SignIn} from './authentication/signin/SignIn';
import awsExports from './aws-exports';
import BookingEditor from './booking/BookingEditor';
import Bookings from './booking/Bookings';
import {
  ACCOUNT_PATH,
  BOOKINGS_PATH,
  BOOKING_PATH,
  CONTRACT_PATH,
  OVERVIEW_PATH,
  SIGNIN_PATH,
  TENANTS_PATH,
  TRANSACTIONS_PATH,
  WELCOME_PATH,
} from './Constants';
import Contract from './contract/Contract';
import ContractEditor from './contract/ContractEditor';
import Account from './fints/account/Account';
import AccountEditorStepAccountSelection from './fints/account/AccountEditorStepAccountSelection';
import AccountEditorStepInitial from './fints/account/AccountEditorStepInitial';
import AccountEditorStepTan from './fints/account/AccountEditorStepTan';
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
  const [loginStateCounter, setLoginStateCounter] = useState(0);
  useEffect(() => {
    console.log('App - Auth.currentAuthenticatedUser - effect');
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
  }, [loginStateCounter]);

  return (
    <BrowserRouter>
      <PageTemplate
        loggedIn={loggedIn}
        setLoginStateCounter={setLoginStateCounter}
      />
      {!loggedIn && (
        <Routes>
          <Route
            path={SIGNIN_PATH}
            element={<SignIn setLoginStateCounter={setLoginStateCounter} />}
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
          <Route path={CONTRACT_PATH} element={<Contract />}>
            <Route path="edit/:contractId" element={<ContractEditor />} />
          </Route>
          <Route path={BOOKINGS_PATH} element={<Bookings />}>
            <Route path=":tenantId" element={<Bookings />} />
          </Route>
          <Route path={BOOKING_PATH} element={<BookingEditor />}>
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
