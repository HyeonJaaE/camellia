import React, { Component } from "react";
import Nav from "./Nav";

import CommentDiv from "./CommentDiv";
import PropTypes from "prop-types";
import firebase from "../firebase";
import { connect } from "react-redux";

class Vs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentToAdd: "",
            data: null,
            comments: null,
            vote: [],
            check: []
        };
    }

    componentDidMount() {
        const db = firebase.firestore();
        db.collection("contents")
            .doc(this.props.match.params.n)
            .collection("comments")
            .orderBy("cDate", "desc")
            .get()
            .then(querySnaphot => {
                var tmp = [];
                querySnaphot.forEach(doc => {
                    //console.log(doc.id);
                    tmp.push([doc.data(), doc.id]);
                });
                //console.log("tmp", tmp);
                this.setState({
                    comments: tmp
                });
            });

        const data = db.collection("contents").doc(this.props.match.params.n);

        data.update({
            view: firebase.firestore.FieldValue.increment(1)
        });

        data.onSnapshot(snapShot => {
            var A = snapShot.data().voteA;
            var B = snapShot.data().voteB;
            this.setState({
                data: snapShot.data(),
                check: [
                    A.find(e => e === this.props.auth.user.email),
                    B.find(e => e === this.props.auth.user.email)
                ],
                vote: [A.length, B.length]
            });
        });
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    onSubmit = e => {
        e.preventDefault();

        var db = firebase.firestore();
        db.collection("contents")
            .doc(this.props.match.params.n)
            .collection("comments")
            .doc()
            .set({
                cAuthor: {
                    cName: this.props.auth.user.displayName,
                    cid: this.props.auth.user.email
                },
                cBody: this.state.commentToAdd,
                cReport: [],
                cUp: [],
                cDate: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(docRef => {
                window.location.reload();
                console.log(docRef);
            })
            .catch(err => {
                console.log(err);
            });
    };

    getContents = () => {};

    toLogin = () => {
        if (window.confirm("로그인 후 이용 가능합니다. 로그인 화면으로 이동하시겠습니까?")) {
            this.props.history.push("/login");
        } else {
            // They clicked no
        }
    };

    vote = e => {
        if (!this.props.auth.isAuthenticated) {
            this.toLogin();
        } else {
            if (!this.state.check[0] && !this.state.check[1]) {
                if (window.confirm("한 번 투표하면 변경/취소 불가능 합니다. 투표하시겠습니까?")) {
                    let db = firebase.firestore();
                    db.collection("contents")
                        .doc(this.props.match.params.n)
                        .update({
                            [e]: firebase.firestore.FieldValue.arrayUnion(
                                this.props.auth.user.email
                            )
                        })
                        .then(docRef => {
                            console.log(docRef);
                            window.location.reload();
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                }
            } else {
                window.alert("이미 투표함");
            }
        }
    };

    render() {
        return (
            <div>
                <Nav name="HOME" />
                <div className="container">
                    {this.state.data && <h3>조회수 : {this.state.data.view}</h3>}
                    {this.state.data ? (
                        this.state.data.type === "img" ? (
                            <div className="row">
                                <div className="col-6">
                                    <img
                                        className=""
                                        src={this.state.data.url[0]}
                                        style={{
                                            height: "300px",
                                            width: "100%",
                                            opacity: 0.75
                                        }}
                                        id="voteImgA"
                                        alt={this.state.vote[0]}
                                        onClick={() => this.vote("voteA")}
                                    />
                                    <h3>
                                        투표 수 : {this.state.vote[0]}(
                                        {this.state.vote[0] > 0
                                            ? (this.state.vote[0] /
                                                  (this.state.vote[0] + this.state.vote[1])) *
                                              100
                                            : 0}
                                        %)
                                    </h3>
                                </div>
                                <div className="col-6">
                                    <img
                                        className=""
                                        src={this.state.data.url[1]}
                                        style={{
                                            height: "300px",
                                            width: "100%",
                                            opacity: 0.75
                                        }}
                                        alt={this.state.vote[1]}
                                        onClick={() => this.vote("voteB")}
                                    />
                                    <h3>
                                        투표 수 : {this.state.vote[1]}(
                                        {this.state.vote[1] > 0
                                            ? (this.state.vote[1] /
                                                  (this.state.vote[0] + this.state.vote[1])) *
                                              100
                                            : 0}
                                        %)
                                    </h3>
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                <div className="col-6">
                                    <div
                                        className=" text-white text-center"
                                        style={{
                                            height: "300px",
                                            width: "100%",
                                            opacity: 0.75,
                                            backgroundColor: "rgb(247, 202, 201)"
                                        }}
                                        id="voteA"
                                        onClick={() => this.vote("voteA")}
                                    >
                                        <h3>{this.state.data.subtitle[0]}</h3>
                                    </div>
                                    <h3>
                                        투표 수 : {this.state.vote[0]}(
                                        {this.state.vote[0] > 0
                                            ? (this.state.vote[0] /
                                                  (this.state.vote[0] + this.state.vote[1])) *
                                              100
                                            : 0}
                                        %)
                                    </h3>
                                </div>
                                <div className="col-6">
                                    <div
                                        className="text-white text-center"
                                        style={{
                                            height: "300px",
                                            width: "100%",
                                            opacity: 0.75,
                                            backgroundColor: "rgb(145, 168, 209)"
                                        }}
                                        id="voteB"
                                        onClick={() => this.vote("voteB")}
                                    >
                                        <h3>{this.state.data.subtitle[1]}</h3>
                                    </div>
                                    <h3>
                                        투표 수 : {this.state.vote[1]}(
                                        {this.state.vote[1] > 0
                                            ? (this.state.vote[1] /
                                                  (this.state.vote[0] + this.state.vote[1])) *
                                              100
                                            : 0}
                                        %)
                                    </h3>
                                </div>
                            </div>
                        )
                    ) : (
                        <div style={{ height: "300px", width: "100%" }}>
                            <div className="mx-auto" style={{ height: "30px", width: "30px" }}>
                                <div className="spinner-border text-secondary m-auto" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="row ddd">
                        <div className="col-12">
                            <div className="col">
                                {this.state.comments && (
                                    <CommentDiv
                                        n={this.props.match.params.n}
                                        data={this.state.comments}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="col">
                                <form onSubmit={this.onSubmit}>
                                    {this.props.auth.isAuthenticated ? (
                                        <div className="input-group">
                                            <input
                                                className="form-control my-input"
                                                type="text"
                                                id="commentToAdd"
                                                onChange={this.handleChange}
                                            />
                                            <input
                                                className="form-control my-input"
                                                type="submit"
                                                value="댓글달기"
                                            />
                                        </div>
                                    ) : (
                                        <div className="input-group">
                                            <input
                                                className="form-control my-input"
                                                type="button"
                                                id="commentToAdd"
                                                value="로그인 후 댓글 작성 가능"
                                                style={{ cursor: "pointer", width: "500px" }}
                                                onClick={this.toLogin}
                                            />
                                            <input
                                                className="form-control my-input"
                                                type="submit"
                                                value="댓글달기"
                                                disabled
                                            />
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Vs.propTypes = {
    auth: PropTypes.object
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Vs);
