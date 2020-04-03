import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import firebase from "../firebase";
import Nav from "./Nav";
import { loginUser } from "../actions/authActions";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            errors: {}
        };
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        //prevent default action of form tag
        e.preventDefault();

        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                window.alert("회원가입 완료.");
                firebase
                    .auth()
                    .currentUser.updateProfile({
                        displayName: this.state.name
                    })
                    .then(function() {
                        //console.log("user name updated");
                        // Update successful.
                    })
                    .catch(function(error) {
                        // An error happened.
                    });
                this.props.history.push("/");
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                //console.log("errorCode : " + errorCode);
                //console.log("error msg : " + errorMessage);

                if (errorCode === "auth/invalid-email") {
                    window.alert("이메일 확인");
                }

                if (errorCode === "auth/email-already-in-use") {
                    window.alert("중복");
                }

                if (errorCode === "auth/weak-password") {
                    window.alert("비밀번호");
                }
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
                            <h4>신규 계정 생성</h4>
                        </div>

                        <small>
                            이미 회원이라면 <Link to="/login">로그인</Link>
                        </small>

                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input
                                    className="form-control my-input"
                                    required
                                    onChange={this.onChange}
                                    value={this.state.name}
                                    errors={errors.name}
                                    id="name"
                                    type="text"
                                    placeholder="닉네임"
                                    /*className={classnames("", {
                                            invalid: errors.name
                                        })}*/
                                />
                                <span className="red-text">{errors.name}</span>
                            </div>
                            <div className="form-group">
                                <input
                                    className="form-control my-input"
                                    required
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    errors={errors.email}
                                    id="email"
                                    type="email"
                                    placeholder="이메일"
                                    /*className={classnames("", {
                                            invalid: errors.email
                                        })}*/
                                />
                                <span className="red-text">{errors.email}</span>
                            </div>
                            <div className="form-group">
                                <span>비밀번호 6자 이상</span>
                                <input
                                    className="form-control my-input"
                                    required
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    errors={errors.password}
                                    id="password"
                                    type="password"
                                    placeholder="비밀번호"
                                    /*className={classnames("", {
                                            invalid: errors.password
                                        })}*/
                                />
                                <span className="red-text">{errors.password}</span>
                            </div>
                            <div className="form-group text-right">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    type="submit"
                                    value="submit"
                                >
                                    계정 생성
                                </button>
                            </div>

                            {null && (
                                <p className="small mt-3">
                                    By signing up, you are indicating that you have read and agree
                                    to the{" "}
                                    <a href="/#" className="ps-hero__content__link">
                                        Terms of Use
                                    </a>{" "}
                                    and <a href="/#">Privacy Policy</a>.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Signup.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

//this allows us to call this.props.auth in our Signup component
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(withRouter(Signup));

//export default Signup;
