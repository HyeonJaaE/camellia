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
            errors: { password: "" }
        };
    }

    componentDidMount() {
        //console.log(this.props.auth);
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            window.alert("잘못된 접근입니다.");
            this.props.history.push("/");
        }
    }

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
            <div
                className="d-flex flex-column h-100"
                style={{ backgroundColor: "rgb(242, 244, 247)" }}
            >
                <Nav />
                <div className="container-fluid mt-4" style={{ minHeight: "100vh" }}>
                    <div className="col-xs-12 col-sm-8 col-md-6 col-lg-4 mx-auto ">
                        <div className="text-center">
                            <h4>로그인</h4>
                        </div>
                        <small>
                            아직 계정이 없다면 <Link to="/signup">계정 생성</Link>
                        </small>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input
                                    className="form-control my-input"
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                    placeholder="이메일"
                                    /*className={classnames("", {
                          invalid: errors.email || errors.emailnotfound
                        })}*/
                                />
                                <span className="text-danger">
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
                                    placeholder="비밀번호"
                                    /*className={classnames("", {
                          invalid: errors.password || errors.passwordincorrect
                        })}*/
                                />
                                <span className="text-danger">
                                    {errors.password}
                                    {errors.passwordincorrect}
                                </span>
                            </div>

                            <div className="form-group text-right">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    type="submit"
                                    value="submit"
                                >
                                    로그인
                                </button>
                            </div>
                        </form>
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
