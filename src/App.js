import React from 'react';


import Welcome from './welcome/Welcome'
import Signup from './signup/Signup'
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
      </Switch>
    </Router>
  );
}

export default App;
