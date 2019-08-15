import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Home from "./home/Home";
import Signup from "./signup/Signup";
import Tenant from "./tenant/Tenant";
import TenantEditor from "./tenant/TenantEditor";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Redirect } from "react-router";
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

export default function App() {
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Home" component={Link} to="/home" />
            <Tab label="Tenant" component={Link} to="/tenant" />
            <Tab label="Accounts" component={Link} to="/accounts" />
          </Tabs>
        </AppBar>

        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route path="/home" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/tenant" component={Tenant} />
          <Route path="/tenant/edit" component={TenantEditor} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
};
