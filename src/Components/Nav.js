import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import firebase, { auth } from "../firebase";

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.currentUser
        };
    }

    onLogoutClick = e => {
        e.preventDefault();
        firebase
            .auth()
            .signOut()
            .then()
            .catch(function(error) {
                // An error happened.
            });
    };

    profile = () => {
        console.log(firebase.auth().currentUser.email);
        var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified;

        if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
        }
        console.log(name);
        console.log(email);
        console.log(uid);
    };

    render() {
        return (
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <a className="navbar-brand" href="/#">
                        BALANCEGAME
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarTogglerDemo02"
                        aria-controls="navbarTogglerDemo02"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse pl-4" id="navbarTogglerDemo02">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/">
                                    모두
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/setting">
                                    이미지
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/setting">
                                    글
                                </a>
                            </li>
                        </ul>
                        <div className="col-sm mx-auto " />
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/setting">
                                    작성
                                </a>
                            </li>
                            {this.state.user ? (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" onClick={this.profile}>
                                            내 정보
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className="nav-link "
                                            onClick={this.onLogoutClick}
                                            href="/"
                                        >
                                            로그아웃
                                        </a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/login">
                                            로그인
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/Signup">
                                            회원가입
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}

Nav.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Nav);
