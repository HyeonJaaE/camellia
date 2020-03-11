import React, { Component } from "react";
import firebase from "../firebase";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Comment extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        };
    }

    up = () => {
        var db = firebase.firestore();
        var ref = db
            .collection("contents")
            .doc(this.props.n)
            .collection("comments")
            .doc(this.props.docId);

        ref.get().then(snapShot => {
            if (!snapShot.data().cUp.find(e => e === this.props.auth.user.email)) {
                if (window.confirm("추천하시겠습니까?")) {
                    ref.update({
                        cUp: firebase.firestore.FieldValue.arrayUnion(this.props.auth.user.email)
                    }).then(() => {
                        window.alert("추천 완료");
                    });
                }
            } else {
                window.alert("이미 추천하셨습니다");
            }
        });
    };

    report = () => {
        var db = firebase.firestore();
        var ref = db
            .collection("contents")
            .doc(this.props.n)
            .collection("comments")
            .doc(this.props.docId);

        ref.get().then(snapShot => {
            if (!snapShot.data().cUp.find(e => e === this.props.auth.user.email)) {
                if (window.confirm("신고하시겠습니까?")) {
                    ref.update({
                        cReport: firebase.firestore.FieldValue.arrayUnion(
                            this.props.auth.user.email
                        )
                    }).then(() => {
                        window.alert("신고 완료");
                    });
                }
            } else {
                window.alert("이미 신고하셨습니다.");
            }
        });
    };

    del = () => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            var db = firebase.firestore();
            var ref = db
                .collection("contents")
                .doc(this.props.n)
                .collection("comments")
                .doc(this.props.docId);

            ref.delete().then(() => {
                window.alert("삭제 완료");
                window.location.reload();
            });
        }
    };

    render() {
        return (
            <div className="container">
                <br />
                <br />
                <div className="row text-white" style={{ backgroundColor: "rgb(51, 85, 139)" }}>
                    {this.props.data.cAuthor.cName}
                </div>
                {this.props.data.cDate && this.props.data.cDate.toDate().toString()}
                <div className="row" style={{ height: "100px" }}>
                    {this.props.data.cBody}
                </div>
                <div className="row justify-content-end">
                    추천수
                    {this.props.data.cUp.length}
                    <input type="button" value="추천" onClick={this.up}></input>
                    <input type="button" value="신고" onClick={this.report}></input>
                    {this.props.data.cAuthor.cid === this.props.auth.user.email && (
                        <input type="button" value="삭제" onClick={this.del}></input>
                    )}
                </div>
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
