import React, { Component } from "react";
import Nav from "./Nav";
import { fn_dateTimeToFormatted } from "./Function";
import CommentDiv from "./CommentDiv";
import PropTypes, { nominalTypeHack } from "prop-types";
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
            check: [],
            order: "upCount"
        };
    }

    onChangeOrder = e => {
        e.preventDefault();
        this.setState(
            {
                comments: null,
                order: e.target.value
            },
            this.getComments
        );
    };

    commentsListener = () => {
        const db = firebase.firestore();
        let doc = db
            .collection("contents")
            .doc(this.props.match.params.n)
            .collection("comments");

        doc.onSnapshot(
            docSnapshot => {
                //console.log(docSnapshot);
                this.getComments();
            },
            err => {
                //console.log(`Encountered error: ${err}`);
            }
        );
    };

    getComments = () => {
        const db = firebase.firestore();
        db.collection("contents")
            .doc(this.props.match.params.n)
            .collection("comments")
            .orderBy(this.state.order, "desc")
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
    };

    componentDidMount() {
        this.commentsListener();
        this.getComments();
        const db = firebase.firestore();
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
                cDate: firebase.firestore.FieldValue.serverTimestamp(),
                upCount: 0,
                reportCount: 0
            })
            .then(docRef => {
                window.location.reload();
                //console.log(docRef);
            })
            .catch(err => {
                //console.log(err);
            });
    };

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
                            //console.log(docRef);
                            window.location.reload();
                        })
                        .catch(err => {
                            //console.log(err);
                        });
                } else {
                }
            } else {
                window.alert("이미 투표함");
            }
        }
    };
    componentDidUpdate() {
        //console.log(this.state.comments);
    }
    render() {
        var imgDivStyle = {
            height: "300px",
            width: "100%",
            cursor: "pointer"
        };

        var btnStyleActive = {
            outline: "none",
            background: "none!important",
            border: "none",
            padding: "0!important",
            backgroundColor: "white",
            cursor: "pointer"
        };

        var btnStyleInactive = {
            outline: "none",
            background: "none!important",
            border: "none",
            padding: "0!important",
            backgroundColor: "white",
            color: "gray",
            cursor: "pointer"
        };

        return (
            <div
                className="d-flex flex-column h-100"
                style={{ backgroundColor: "rgb(242, 244, 247)" }}
            >
                <Nav name="HOME" />
                <div
                    className="d-flex flex-column col-lg-8 col-md-9 col-sm-10 align-self-center shadow my-4 p-0"
                    style={{ minHeight: "100vh", backgroundColor: "white" }}
                >
                    {this.state.data ? (
                        this.state.data.type === "img" ? (
                            <div className="d-flex justify-content-center">
                                <div
                                    className="d-flex flex-column justify-content-center p-0 vsDiv whenHover1 text-light"
                                    style={imgDivStyle}
                                    id="voteA"
                                    onClick={() => this.vote("voteA")}
                                >
                                    <img
                                        src={this.state.data.url[0]}
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            opacity: 0.85
                                        }}
                                        alt={this.state.vote[1]}
                                    />
                                    <div
                                        className="align-self-center text-center"
                                        style={{ position: "absolute", zIndex: "123" }}
                                    >
                                        <h3>{this.state.data.subtitle[0]}</h3>
                                        {(this.state.check[0] || this.state.check[1]) && (
                                            <>
                                                <h1 className="mb-0">
                                                    {this.state.vote[0] > 0
                                                        ? (
                                                              (this.state.vote[0] /
                                                                  (this.state.vote[0] +
                                                                      this.state.vote[1])) *
                                                              100
                                                          ).toFixed(1)
                                                        : 0}
                                                    %
                                                </h1>
                                                {this.state.vote[0]}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="d-flex align-self-center justify-content-center bg-dark text-white rounded-circle shadow-lg"
                                    style={{
                                        position: "absolute",
                                        zIndex: "9999",
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >
                                    <div className="align-self-center">
                                        <h4 className="m-0">VS</h4>
                                    </div>
                                </div>

                                <div
                                    className="d-flex flex-column justify-content-center p-0 vsDiv whenHover1 text-light"
                                    style={imgDivStyle}
                                    id="voteB"
                                    onClick={() => this.vote("voteB")}
                                >
                                    <img
                                        src={this.state.data.url[1]}
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            opacity: 0.85
                                        }}
                                        alt={this.state.vote[1]}
                                    />
                                    <div
                                        className="align-self-center text-center"
                                        style={{ position: "absolute", zIndex: "123" }}
                                    >
                                        <h3>{this.state.data.subtitle[1]}</h3>
                                        {(this.state.check[0] || this.state.check[1]) && (
                                            <>
                                                <h1 className="mb-0">
                                                    {this.state.vote[1] > 0
                                                        ? (
                                                              (this.state.vote[1] /
                                                                  (this.state.vote[0] +
                                                                      this.state.vote[1])) *
                                                              100
                                                          ).toFixed(1)
                                                        : 0}
                                                    %
                                                </h1>
                                                {this.state.vote[1]}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center">
                                <div
                                    className="d-flex flex-column justify-content-center p-0 text-center vsDiv whenHover2 text-dark"
                                    style={{
                                        height: "300px",
                                        width: "100%",
                                        backgroundColor: "rgb(247, 202, 201)"
                                    }}
                                    id="voteA"
                                    onClick={() => this.vote("voteA")}
                                >
                                    <h3 className="">{this.state.data.subtitle[0]}</h3>
                                    {(this.state.check[0] || this.state.check[1]) && (
                                        <>
                                            <h1 className="mb-0">
                                                {this.state.vote[0] > 0
                                                    ? (
                                                          (this.state.vote[0] /
                                                              (this.state.vote[0] +
                                                                  this.state.vote[1])) *
                                                          100
                                                      ).toFixed(1)
                                                    : 0}
                                                %
                                            </h1>
                                            {this.state.vote[0]}
                                        </>
                                    )}
                                </div>
                                <div
                                    className="d-flex align-self-center justify-content-center bg-dark text-white rounded-circle shadow-lg"
                                    style={{
                                        position: "absolute",
                                        zIndex: "9999",
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >
                                    <div className="align-self-center">
                                        <h4 className="m-0">VS</h4>
                                    </div>
                                </div>
                                <div
                                    className="d-flex flex-column justify-content-center p-0 text-center vsDiv whenHover3 text-dark"
                                    style={{
                                        height: "300px",
                                        width: "100%",
                                        backgroundColor: "rgb(145, 168, 209)"
                                    }}
                                    id="voteB"
                                    onClick={() => this.vote("voteB")}
                                >
                                    <h3>{this.state.data.subtitle[1]}</h3>
                                    {(this.state.check[0] || this.state.check[1]) && (
                                        <>
                                            <h1 className="mb-0">
                                                {this.state.vote[1] > 0
                                                    ? (
                                                          (this.state.vote[1] /
                                                              (this.state.vote[0] +
                                                                  this.state.vote[1])) *
                                                          100
                                                      ).toFixed(1)
                                                    : 0}
                                                %
                                            </h1>
                                            {this.state.vote[1]}
                                        </>
                                    )}
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

                    <blockquote
                        className="blockquote p-3 m-0"
                        style={{
                            borderBottomColor: "rgb(223,223,223)",
                            borderBottomStyle: "solid",
                            borderBottomWidth: "1px"
                        }}
                    >
                        <p className="mb-0">{this.state.data && this.state.data.title}</p>
                        <footer className="blockquote-footer">
                            by&nbsp;
                            {this.state.data && this.state.data.author.name}&nbsp;&nbsp;
                            <cite title="Source Title">
                                {this.state.data &&
                                    fn_dateTimeToFormatted(this.state.data.date.toDate())}
                            </cite>
                        </footer>
                    </blockquote>

                    <div
                        className="d-flex px-3 py-2 align-items-center"
                        style={{
                            borderBottomColor: "rgb(223,223,223)",
                            borderBottomStyle: "solid",
                            borderBottomWidth: "1px"
                        }}
                    >
                        <div className="mr-2">
                            <p className="mb-0">댓글</p>
                        </div>
                        <div className="flex-fill"></div>
                        {this.state.order == "upCount" ? (
                            <div className="">
                                <button
                                    style={btnStyleActive}
                                    value="upCount"
                                    onClick={this.onChangeOrder}
                                >
                                    추천순
                                </button>
                                <button
                                    style={btnStyleInactive}
                                    value="cDate"
                                    onClick={this.onChangeOrder}
                                >
                                    최신순
                                </button>
                            </div>
                        ) : (
                            <div className="btn-group btn-group-sm">
                                <button
                                    style={btnStyleInactive}
                                    value="upCount"
                                    onClick={this.onChangeOrder}
                                >
                                    추천순
                                </button>
                                <button
                                    style={btnStyleActive}
                                    value="cDate"
                                    onClick={this.onChangeOrder}
                                >
                                    최신순
                                </button>
                            </div>
                        )}
                    </div>

                    {this.state.comments && (
                        <CommentDiv n={this.props.match.params.n} data={this.state.comments} />
                    )}

                    <div className="col-12 my-3">
                        <form onSubmit={this.onSubmit}>
                            {this.props.auth.isAuthenticated ? (
                                <div className="d-flex">
                                    <div className="w-100">
                                        <input
                                            className="w-100 form-control my-input"
                                            type="text"
                                            id="commentToAdd"
                                            placeholder="댓글 달기"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            className="form-control my-input"
                                            type="submit"
                                            value="댓글 등록"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex">
                                    <div className="w-100">
                                        <input
                                            className="w-100 form-control my-input"
                                            type="button"
                                            id="commentToAdd"
                                            value="로그인 후 댓글 작성 가능"
                                            style={{ cursor: "pointer", width: "500px" }}
                                            onClick={this.toLogin}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            className="form-control my-input"
                                            type="submit"
                                            value="댓글 등록"
                                            disabled
                                        />
                                    </div>
                                </div>
                            )}
                        </form>
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
