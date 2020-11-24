import DateFnsUtils from '@date-io/date-fns';
import {createMuiTheme} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {ThemeProvider} from '@material-ui/styles';
import deLocale from 'date-fns/locale/de';
import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import './App.css';
import PrivateRoute from './authentication/PrivateRoute';
import Signin from './authentication/signin/Signin';
import Signup from './authentication/signup/Signup';
import {ACCOUNT_PATH, CONTRACT_PATH, TENANT_PATH} from './Constants';
import Contract from './contract/Contract';
import ContractEditor from './contract/ContractEditor';
import Account from './fints/account/Account';
import AccountEditorWizard from './fints/account/AccountEditorWizard';
import FintsAccountSynchronisationSingle from './fints/synchronisation/FintsAccountSynchronisationSingle';
import FintsAccountTransaction from './fints/transaction/FintsAccountTransaction';
import Home from './home/Home';
import Notifier from './notifier/Notifier';
import Tenant from './tenant/Tenant';
import TenantEditor from './tenant/TenantEditor';
import Welcome from './welcome/Welcome';
const theme = createMuiTheme();

function getFirstPathElement(path) {
  let pathelements = path.split('/');
  let firstPathelement = '/' + pathelements[1];
  return firstPathelement;
}

export default function App() {
  const {t} = useTranslation();
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
        <BrowserRouter>
          <Route
            path="/"
            render={({location}) => (
              <Fragment>
                <Notifier />
                <AppBar position="static">
                  <Tabs
                    value={getFirstPathElement(location.pathname)}
                    aria-label="simple tabs example"
                  >
                    <Tab
                      label={t('home')}
                      component={Link}
                      to="/home"
                      value="/home"
                    />
                    <Tab
                      label={t('tenants')}
                      component={Link}
                      to="/tenant"
                      value="/tenant"
                    />
                    <Tab
                      label={t('contracts')}
                      component={Link}
                      to="/contract"
                      value="/contract"
                    />
                    <Tab
                      label={t('accounts')}
                      component={Link}
                      to={ACCOUNT_PATH}
                      value={ACCOUNT_PATH}
                    />
                    <Tab
                      label={t('transactions')}
                      component={Link}
                      to="/transaction"
                      value="/transaction"
                    />
                  </Tabs>
                </AppBar>
              </Fragment>
            )}
          />
          <Switch>
            <Redirect exact from="/" to="/welcome" />
            <Route path="/welcome">
              <Welcome />
            </Route>
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Signin} />
            <PrivateRoute path="/home">
              <Home />
            </PrivateRoute>
            <PrivateRoute exact path={TENANT_PATH}>
              <Tenant />
            </PrivateRoute>
            <PrivateRoute exact path={`${TENANT_PATH}/edit`}>
              <TenantEditor />
            </PrivateRoute>
            <PrivateRoute path={`${TENANT_PATH}/edit/:tenantId`}>
              <TenantEditor />
            </PrivateRoute>
            <PrivateRoute exact path={CONTRACT_PATH}>
              <Contract />
            </PrivateRoute>
            <PrivateRoute path={`${CONTRACT_PATH}/edit`}>
              <ContractEditor />
            </PrivateRoute>
            <PrivateRoute exact path={ACCOUNT_PATH}>
              <Account />
            </PrivateRoute>
            <PrivateRoute path={`${ACCOUNT_PATH}/edit`}>
              <AccountEditorWizard />
            </PrivateRoute>
            <PrivateRoute path={`${ACCOUNT_PATH}/synchronisation`}>
              <FintsAccountSynchronisationSingle />
            </PrivateRoute>
            <PrivateRoute path="/transaction">
              <FintsAccountTransaction />
            </PrivateRoute>
          </Switch>
        </BrowserRouter>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}
