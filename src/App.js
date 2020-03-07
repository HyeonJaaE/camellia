import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "./actions/authActions";

import Nav from "./Components/Nav";
import Card from "./Components/Card";
import Menu from "./Components/Menu";
import firebase, { auth } from "./firebase";
//import reducers from './reducers';

class App extends Component {
    constructor(props) {
        console.log("class App constructor called");
        super(props);
        this.state = {
            user: auth.currentUser
        };
        this.authListener();
    }

    authListener() {
        console.log("auth listner called");
        firebase.auth().onAuthStateChanged(_user => {
            console.log("onAuthStateChanged");
            this.setState({
                user: _user
            });
        });
    }

    render() {
        console.log("render ");
        return (
            <div>
                <Nav user={this.state.user} />
                <div className="container">
                    <Menu />
                    <div>{this.state.dir}</div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(App);
