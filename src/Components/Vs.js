import React, { Component } from "react";
import Nav from "./Nav";
import axios from "axios";
import Comment from "./Comment";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Vs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: null,
            commentToAdd: "",
            data: null,
            dir: {
                0: "",
                1: ""
            },
            view: "",
            vote: {}
        };
    }

    componentDidMount() {
        console.log("didMount");
        console.log("get Contents...");
        console.log(this.props.auth);
        this.getContents();
        //console.log(this.state.data)
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    onSubmit = () => {
        let tmp = {
            n: this.props.match.params.n,
            id: this.props.auth.user["id"],
            name: this.props.auth.user["name"],
            commentToAdd: this.state.commentToAdd
        };

        axios
            .post("/contents/addComments", tmp)
            .then(this.getContents())
            .catch(err => {
                console.log(err);
            });
    };

    getContents = () => {
        axios
            .post("/contents/getContentsByNum", this.props.match.params)
            .then(res => {
                console.log("setState...");
                this.setState({
                    data: res.data,
                    dir: {
                        0: res.data["fileDir"][0],
                        1: res.data["fileDir"][1]
                    },
                    view: res.data["view"],
                    comments: res.data["comments"],
                    vote: {
                        0: Object.keys(res.data["balletBoxA"]).length,
                        1: Object.keys(res.data["balletBoxB"]).length
                    }
                });
            })
            .catch(err => {
                console.log(err);
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
        //console.log(e);
        if (!this.props.auth.isAuthenticated) {
            this.toLogin();
        } else {
            let tmp = {
                id: this.props.auth.user["id"],
                n: this.props.match.params.n
            };
            axios
                .post("/contents/checkBox", tmp)
                .then(res => {
                    console.log(res.data);
                    //res.data가 true면 이미 투표한 상태
                    if (res.data === e) {
                        window.alert("이미 투표한 상태입니다.");
                    } else if (res.data !== false) {
                        if (
                            window.confirm(
                                (e === "A" ? "B" : "A") + "에 투표한 상태입니다. 바꾸시겠습니까?"
                            )
                        ) {
                            tmp["side"] = e;
                            axios.post("/contents/changeVote", tmp);
                            window.location.reload();
                            //this.props.history.push("/");
                        } else {
                        }
                    } else {
                        if (window.confirm("투표하시겠습니까?")) {
                            tmp["side"] = e;
                            axios.post("/contents/Vote", tmp);
                            window.location.reload();
                        } else {
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    render() {
        console.log("rendering...");
        return (
            <div>
                <Nav name="HOME" />
                <div className="container">
                    <div className="row">
                        <div className="col-6" style={{ backgroundColor: "" }}>
                            <img
                                className=""
                                src={this.state.dir[0]}
                                style={{
                                    height: "300px",
                                    width: "100%",
                                    opacity: 0.75
                                }}
                                alt={this.state.vote[0]}
                                onClick={() => this.vote("A")}
                            />
                            <h3>투표 수 : {this.state.vote[0]}</h3>
                        </div>
                        <div className="col-6">
                            <img
                                className=""
                                src={this.state.dir[1]}
                                style={{
                                    height: "300px",
                                    width: "100%",
                                    opacity: 0.75
                                }}
                                alt={this.state.vote[1]}
                                onClick={() => this.vote("B")}
                            />
                            <h3>투표 수 : {this.state.vote[1]}</h3>
                        </div>
                    </div>
                    <div className="row">
                        <h3>조회수 : {this.state.view}</h3>
                        <div className="row">
                            <div className="col-12">
                                <Comment data={this.state.comments} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
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
