import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import App from "./App";
import Setting from "./Components/Setting";

import Vs from "./Components/Vs";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

import * as serviceWorker from "./serviceWorker";

if (localStorage.jwtToken) {
    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());
        // Redirect to login
        window.location.href = "./login";
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route exact path="/" component={App} />
            <Route path="/vs/:n" component={Vs} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/Setting" component={Setting} />
        </Router>
    </Provider>,
    document.getElementById("root")
);

serviceWorker.unregister();
