import React, {Fragment} from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Home from "./home/Home";
import Signup from "./signup/Signup";
import Tenant from "./tenant/Tenant";
import TenantEditor from "./tenant/TenantEditor";
import "./App.css";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Redirect } from "react-router";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme();

export default function App() {

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Route
          path="/"
          render={({ location }) => (
            <Fragment>
              <AppBar position="static">
                <Tabs
                  value={location.pathname}
                  aria-label="simple tabs example"
                >
                  <Tab label="Home" component={Link} to="/home" value="/home" />
                  <Tab label="Tenant" component={Link} to="/tenant" value="/tenant" />
                  <Tab label="Accounts" component={Link} to="/accounts" value="/accounts" />
                </Tabs>
              </AppBar>

              <Switch>
                <Redirect exact from="/" to="/home" />
                <Route path="/home" component={Home} />
                <Route path="/signup" component={Signup} />
                <Route path="/tenant" component={Tenant} />
                <Route path="/tenant/edit" component={TenantEditor} />
              </Switch>
            </Fragment>
          )}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
