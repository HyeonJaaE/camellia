import React, { Component } from "react";
import firebase from "../firebase";
import PropTypes from "prop-types";
import Nav from "./Nav";
import { connect } from "react-redux";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            password: "",
            changeDisplayName: "",
            changePassword: ""
        };
    }

    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            window.alert("비 로그인 상태입니다.");
            this.props.history.push("/");
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    signOut = e => {
        e.preventDefault();
        var user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            this.props.auth.user.email,
            this.state.password
        );

        // Prompt the user to re-provide their sign-in credentials

        user.reauthenticateWithCredential(credential)
            .then(() => {
                user.delete()
                    .then(() => {
                        window.alert("탈퇴 완료");
                        this.props.history.push("/");

                        // User deleted.
                    })
                    .catch(err => {
                        //console.log(err);
                        // An error happened.
                    });
            })
            .catch(err => {
                //console.log(err);
            });
    };

    submit = e => {
        e.preventDefault();
        var user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            this.props.auth.user.email,
            this.state.password
        );

        // Prompt the user to re-provide their sign-in credentials

        user.reauthenticateWithCredential(credential)
            .then(() => {
                user.updatePassword(this.state.changePassword)
                    .then(() => {
                        window.alert("변경 완료");
                        this.props.history.push("/");
                        // Update successful.
                    })
                    .catch(err => {
                        window.alert(err);
                    });
            })
            .catch(err => {
                window.alert(err);
            });
    };
    render() {
        return (
            <div
                className="d-flex flex-column h-100"
                style={{ backgroundColor: "rgb(242, 244, 247)" }}
            >
                <Nav />
                <div className="container-fluid mt-4" style={{ minHeight: "100vh" }}>
                    <div className="col-12 col-sm-8 col-md-6 col-lg-5 mx-auto p-0">
                        <form className="form-group" onSubmit={this.submit}>
                            <label className="mb-0 mt-3">닉네임 변경</label>
                            <input
                                className="form-control"
                                type="text"
                                id="changeDisplayName"
                                onChange={this.handleChange}
                                defaultValue={this.props.auth.user.displayName}
                                readOnly
                            ></input>
                            <label className="mb-0 mt-3">아이디</label>
                            <input
                                className="form-control"
                                type="text"
                                value={this.props.auth.user.email}
                                readOnly
                            ></input>
                            <label className="mb-0 mt-3">비밀번호 확인</label>
                            <input
                                className="form-control"
                                type="password"
                                id="password"
                                placeholder="현재 비밀번호"
                                onChange={this.handleChange}
                            ></input>
                            <label className="mb-0 mt-3">비밀번호 변경</label>
                            <input
                                className="form-control"
                                type="password"
                                id="changePassword"
                                placeholder="변경할 비밀번호"
                                onChange={this.handleChange}
                            ></input>
                            <div className="d-flex justify-content-between pt-4">
                                <button className="btn btn-outline-secondary">변경</button>
                                <button className="btn btn-danger" onClick={this.signOut}>
                                    회원 탈퇴
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Profile);
