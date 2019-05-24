import React from 'react';


import Welcome from './welcome/Welcome'
import Signup from './signup/Signup'
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
      <Link to="/welcome">Welcome</Link>
      </div>
      <div>
      <Link to="/signup">Signup</Link>
      </div>
      <Route path="/welcome" component={Welcome} />
      <Route path="/signup" component={Signup} />
    </Router>
  );
}

export default App;
