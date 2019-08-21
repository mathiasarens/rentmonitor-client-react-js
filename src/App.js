import React, { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Home from "./home/Home";
import Signup from "./signup/Signup";
import Tenant from "./tenant/Tenant";
import Account from "./account/Account";
import TenantEditor from "./tenant/TenantEditor";
import AccountEditor from "./account/AccountEditor";
import Notifier from "./notifier/Notifier";
import "./App.css";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Redirect } from "react-router";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { useTranslation } from 'react-i18next';

const theme = createMuiTheme();

function getFirstPathElement(path) {
  let pathelements = path.split('/');
  let firstPathelement = "/" + pathelements[1];
  return firstPathelement;
}

export default function App() {
  const {t} = useTranslation();
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Route
          path="/"
          render={({ location }) => (
            <Fragment>
              <Notifier />
              <AppBar position="static">
                <Tabs
                  value={getFirstPathElement(location.pathname)}
                  aria-label="simple tabs example"
                >
                  <Tab label={t('home')} component={Link} to="/home" value="/home" />
                  <Tab
                    label={t('tenants')}
                    component={Link}
                    to="/tenant"
                    value="/tenant"
                  />
                  <Tab
                    label={t('accounts')}
                    component={Link}
                    to="/account"
                    value="/account"
                  />
                </Tabs>
              </AppBar>
            </Fragment>
          )}
        />
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route path="/home" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route exact path="/tenant" component={Tenant} />
          <Route path="/tenant/edit" component={TenantEditor} />
          <Route exact path="/account" component={Account} />
          <Route path="/account/edit" component={AccountEditor} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}