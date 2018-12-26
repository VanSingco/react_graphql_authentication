import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from '../component/Home';
import Login from '../component/Login';
import Signup from '../component/Signup';
import ResetPassword from '../component/ResetPassword';
import PasswordResetForm from '../component/PasswordResetForm';
import { Query } from "react-apollo";
import { req_user } from "../schema/user";

const AppRoute = () => {
      return (
        <Query 
        query={req_user}
        pollInterval={5}
        >
        {({ loading, error, data, startPolling }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          const req_user = !!data.req_user
    
          return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <PublicRoute currentUser={req_user} path="/login" component={Login} />
                    <PublicRoute currentUser={req_user} path="/signup" component={Signup} />
                    <PublicRoute currentUser={req_user} path="/reset-password" component={ResetPassword} />
                    <PublicRoute currentUser={req_user} path="/reset/:token" component={PasswordResetForm} />
                </Switch>
            </BrowserRouter>
          );
        }}
      </Query>
      );
}

export default AppRoute;

// Must be logged in for this route... Briefly shows '...' while loading account data rather than redirecting...
const ProtectedRoute = ({ component: Component, currentUser, ...rest }) => (
        <Route
        {...rest}
        render={props => {
            return currentUser ? <Component {...props} /> : <Redirect to={{ pathname: "/login" }}/>;
        }}
        />
  );

  const PublicRoute = ({ component: Component, currentUser, ...rest }) => (
        <Route
        {...rest}
        render={props => {
            return !currentUser ? <Component {...props} /> : <Redirect to={{ pathname: "/" }} />;
        }}
        />
  );