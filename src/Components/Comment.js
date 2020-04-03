import React, { Component } from "react";
import firebase from "../firebase";
import CommentDiv from "./CommentDiv";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fn_dateTimeToFormatted } from "./Function";

class Comment extends Component {
    constructor() {
        super();
        this.state = {
            replyToAdd: "",
            willReply: false,
            reply: null
        };
    }

    replyListener = () => {
        const db = firebase.firestore();
        let doc = db
            .collection("contents")
            .doc(this.props.n)
            .collection("comments")
            .doc(this.props.docId)
            .collection("reply");

        doc.onSnapshot(
            docSnapshot => {
                //console.log(docSnapshot);
                this.getReply();
            },
            err => {
                //console.log(`Encountered error: ${err}`);
            }
        );
    };

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    toggle = () => {
        if (this.props.auth.isAuthenticated) {
            if (!this.state.willReply) {
                this.setState({
                    willReply: true
                });
            } else {
                this.setState({
                    willReply: false
                });
            }
        } else {
            window.alert("로그인 후 이용할 수 있습니다.");
        }
    };

    getReply = () => {
        const db = firebase.firestore();
        db.collection("contents")
            .doc(this.props.n)
            .collection("comments")
            .doc(this.props.docId)
            .collection("reply")
            .orderBy("cDate", "asc")
            .get()
            .then(querySnaphot => {
                var tmp = [];
                querySnaphot.forEach(doc => {
                    //console.log(doc.id);
                    // this.props.docid는 comment id , doc.id 는 reply id
                    tmp.push([doc.data(), this.props.docId, doc.id]);
                });
                //console.log("tmp", tmp);
                this.setState({
                    reply: tmp
                });
            });
    };

    componentDidMount() {
        //답글을 갖고 있을 떄 가져와서 날짜순으로 출력
        if (!this.props.data.replyTo) {
            this.getReply();
            this.replyListener();
        } else {
        }
    }

    up = () => {
        var db = firebase.firestore();
        //this.props.n 글 id
        var ref = db.collection("contents").doc(this.props.n);

        //comment 일때는 docId = comment id , docId2 = undefined
        //reply 일때는 docId = comment id , docId2 = reply id
        if (this.props.data.replyTo) {
            ref = ref
                .collection("comments")
                .doc(this.props.docId)
                .collection("reply")
                .doc(this.props.docId2);
        } else {
            ref = ref.collection("comments").doc(this.props.docId);
        }

        if (this.props.auth.isAuthenticated) {
            ref.get().then(snapShot => {
                if (!snapShot.data().cUp.find(e => e === this.props.auth.user.email)) {
                    if (window.confirm("추천하시겠습니까?")) {
                        ref.update({
                            cUp: firebase.firestore.FieldValue.arrayUnion(
                                this.props.auth.user.email
                            ),
                            upCount: firebase.firestore.FieldValue.increment(1)
                        }).then(() => {
                            window.alert("추천 완료");
                        });
                    }
                } else {
                    window.alert("이미 추천하셨습니다");
                }
            });
        } else {
            window.alert("로그인 후 이용 가능합니다");
        }
    };

    report = () => {
        var db = firebase.firestore();
        var ref = db.collection("contents").doc(this.props.n);

        if (this.props.data.replyTo) {
            ref = ref
                .collection("comments")
                .doc(this.props.docId)
                .collection("reply")
                .doc(this.props.docId2);
        } else {
            ref = ref.collection("comments").doc(this.props.docId);
        }

        if (this.props.auth.isAuthenticated) {
            ref.get().then(snapShot => {
                if (!snapShot.data().cReport.find(e => e === this.props.auth.user.email)) {
                    if (window.confirm("신고하시겠습니까?")) {
                        ref.update({
                            cReport: firebase.firestore.FieldValue.arrayUnion(
                                this.props.auth.user.email
                            ),
                            reportCount: firebase.firestore.FieldValue.increment(1)
                        }).then(() => {
                            window.alert("신고 완료");
                        });
                    }
                } else {
                    window.alert("이미 신고하셨습니다.");
                }
            });
        } else {
            window.alert("로그인 후 이용 가능합니다");
        }
    };

    del = () => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            var db = firebase.firestore();
            var ref = db.collection("contents").doc(this.props.n);

            if (this.props.data.replyTo) {
                ref = ref
                    .collection("comments")
                    .doc(this.props.docId)
                    .collection("reply")
                    .doc(this.props.docId2);
            } else {
                ref = ref.collection("comments").doc(this.props.docId);
            }

            ref.delete().then(() => {
                window.alert("삭제 완료");
                //window.location.reload();
            });
        }
    };

    onSubmit = e => {
        e.preventDefault();

        var db = firebase.firestore();
        db.collection("contents")
            .doc(this.props.n)
            .collection("comments")
            .doc(this.props.docId)
            .collection("reply")
            .doc()
            .set({
                cAuthor: {
                    cName: this.props.auth.user.displayName,
                    cid: this.props.auth.user.email
                },
                replyTo: this.props.data.cAuthor.cName,
                cBody: this.state.replyToAdd,
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

    render() {
        var btnStyleActive = {
            outline: "none",
            background: "none!important",
            border: "none",
            padding: "0!important",
            backgroundColor: "white",
            cursor: "pointer",
            fontSize: "11px"
        };

        return (
            <div className="d-flex flex-column p-3">
                <div className="d-flex justify-content-between" style={{}}>
                    <div>
                        <p className="mb-0">
                            <strong>{this.props.data.cAuthor.cName} </strong>
                            <small className="text-secondary">
                                {this.props.data.cDate &&
                                    fn_dateTimeToFormatted(this.props.data.cDate.toDate())}
                            </small>
                        </p>
                    </div>
                    <div>
                        <input
                            className="text-info"
                            type="button"
                            style={btnStyleActive}
                            value="신고"
                            onClick={this.report}
                        ></input>
                    </div>
                </div>
                <div className="">
                    {this.props.data.replyTo && (
                        <small className="pr-2 text-secondary">ㅡ{this.props.data.replyTo} </small>
                    )}

                    {this.props.data.cBody}
                </div>
                <div className="d-flex ">
                    <div className="pr-2">
                        <input
                            type="button"
                            style={btnStyleActive}
                            value="답글"
                            onClick={this.toggle}
                        ></input>
                        <input
                            type="button"
                            style={btnStyleActive}
                            value="추천"
                            onClick={this.up}
                        ></input>
                        <small>{this.props.data.upCount && this.props.data.upCount}개</small>
                    </div>

                    <div>
                        {this.props.data.cAuthor.cid === this.props.auth.user.email && (
                            <input
                                type="button"
                                style={btnStyleActive}
                                value="삭제"
                                onClick={this.del}
                            ></input>
                        )}
                    </div>
                </div>

                {this.state.reply && (
                    <div>
                        <CommentDiv n={this.props.n} data={this.state.reply} />
                    </div>
                )}

                {this.state.willReply && (
                    <div className="col-12 my-3">
                        <form onSubmit={this.onSubmit}>
                            <div className="d-flex">
                                <div className="w-100">
                                    <input
                                        className="w-100 form-control my-input"
                                        type="text"
                                        id="replyToAdd"
                                        placeholder="답글 달기"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div>
                                    <input
                                        className="form-control my-input"
                                        type="submit"
                                        value="답글 등록"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

Comment.propTypes = {
    auth: PropTypes.object
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Comment);
