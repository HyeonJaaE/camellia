import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Nav from "./Nav";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import firebase from "../firebase";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {}

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.history.push("/");
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
                console.log(errorCode);
                // ...
            });
    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <Nav name="HOME" />
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <Link to="/" className="btn-flat waves-effect">
                                <i className="material-icons left">keyboard_backspace</i> Back to
                                home
                            </Link>
                            <div style={{ paddingLeft: "11.250px" }}>
                                <h4>
                                    <b>Login</b> below
                                </h4>
                                <p className="grey-text text-darken-1">
                                    Don't have an account? <Link to="/signup">Sign Up</Link>
                                </p>
                            </div>
                            <form noValidate onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <input
                                        className="form-control my-input"
                                        onChange={this.onChange}
                                        value={this.state.email}
                                        error={errors.email}
                                        id="email"
                                        type="email"
                                        placeholder="email"
                                        /*className={classnames("", {
                          invalid: errors.email || errors.emailnotfound
                        })}*/
                                    />
                                    <span className="red-text">
                                        {errors.email}
                                        {errors.emailnotfound}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <input
                                        className="form-control my-input"
                                        onChange={this.onChange}
                                        value={this.state.password}
                                        error={errors.password}
                                        id="password"
                                        type="password"
                                        placeholder="password"
                                        /*className={classnames("", {
                          invalid: errors.password || errors.passwordincorrect
                        })}*/
                                    />
                                    <span className="red-text">
                                        {errors.password}
                                        {errors.passwordincorrect}
                                    </span>
                                </div>
                                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                    <button
                                        style={{
                                            width: "150px",
                                            borderRadius: "3px",
                                            letterSpacing: "1.5px",
                                            marginTop: "1rem"
                                        }}
                                        type="submit"
                                        className="btn btn-block send-button tx-tfm"
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(withRouter(Login));
