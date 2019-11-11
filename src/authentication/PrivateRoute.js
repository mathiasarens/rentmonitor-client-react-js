import { Route, Redirect } from "react-router-dom";
import React from 'react';
import {AUTH_TOKEN} from '../Constants'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export default function PrivateRoute({ children , ...rest }) {
    return (
      <Route {...rest} render={({location}) => 
          sessionStorage.getItem(AUTH_TOKEN) !== null  ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }