import React from 'react';


import Welcome from './welcome/Welcome'
import Signup from './signup/Signup'
import Tenant from './tenant/Tenant'
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { Redirect } from 'react-router'

function App() {
  return (
    <Router>
      <Switch>
      <Redirect exact from="/" to="/welcome" />
      <Route path="/welcome" component={Welcome} />
      <Route path="/signup" component={Signup} />
      <Route path="/tenant" component={Tenant} />
      </Switch>
    </Router>
  );
}

export default App;
