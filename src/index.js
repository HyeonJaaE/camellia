import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";
import firebase from "./firebase";

import { Provider } from "react-redux";
import store from "./store";
import { setCurrentUser } from "./actions/authActions";

import App from "./App";
import Setting from "./Components/Setting";

import Vs from "./Components/Vs";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

import * as serviceWorker from "./serviceWorker";

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        store.dispatch(setCurrentUser(user));
    } else {
        store.dispatch(setCurrentUser({}));
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
});

serviceWorker.unregister();
