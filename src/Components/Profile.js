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
                        console.log(err);
                        // An error happened.
                    });
            })
            .catch(err => {
                console.log(err);
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
                console.log(this.state.changePassword);
                user.updatePassword(this.state.changePassword)
                    .then(() => {
                        window.alert("변경 완료");
                        this.props.history.push("/");
                        // Update successful.
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    };
    render() {
        return (
            <div>
                <Nav />
                <div className="container">
                    <div className="row h-400">
                        <form className="form" onSubmit={this.submit}>
                            <label>닉네임 변경</label>
                            <input
                                type="text"
                                defaultValue={this.props.auth.user.displayName}
                            ></input>
                            <label>아이디</label>
                            <input type="text" value={this.props.auth.user.email} readOnly></input>
                            <label>비밀번호 확인</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="현재 비밀번호"
                                onChange={this.handleChange}
                            ></input>
                            <label>비밀번호 변경</label>
                            <input
                                type="password"
                                id="changePassword"
                                placeholder="변경할 비밀번호"
                                onChange={this.handleChange}
                            ></input>
                            <button>변경</button>
                        </form>
                        <button onClick={this.signOut}>회원 탈퇴</button>
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
