import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import firebase from "../firebase";

class Nav extends Component {
    constructor() {
        super();
    }
    onLogoutClick = e => {
        e.preventDefault();
        firebase
            .auth()
            .signOut()
            .then(window.location.reload())
            .catch(function(error) {
                // An error happened.
            });
    };

    profile = e => {
        //e.preventDefault();
        console.log(this.props.auth);
    };

    render() {
        return (
            <header>
                <nav
                    className="navbar navbar-expand-md navbar-dark "
                    style={{ backgroundColor: "rgb(51, 85, 139)" }}
                >
                    <a className="navbar-brand" href="/">
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
                        <div className="col-sm mx-auto " />
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/setting">
                                    작성
                                </a>
                            </li>
                            {this.props.auth.isAuthenticated ? (
                                <>
                                    <li className="nav-item">
                                        <a
                                            className="nav-link"
                                            href="/profile"
                                            onClick={this.profile}
                                        >
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
