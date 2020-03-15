import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "./actions/authActions";

import Nav from "./Components/Nav";
import Card from "./Components/Card";
import Menu from "./Components/Menu";
import firebase from "./firebase";
//import reducers from './reducers';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            card: [],
            idx: null,
            type: "all",
            order: "view",
            getMy: false,
            limit: 10,
            search: false
        };
    }

    handleType = e => {
        //console.log(e);
        this.setState(
            {
                type: e,
                idx: null,
                card: []
            },
            () => {
                var ref = this.getRef(this.state.type, this.state.order);
                this.getContents(ref.limit(this.state.limit));
            }
        );
    };

    handleOrder = e => {
        this.setState(
            {
                order: e,
                idx: null,
                card: []
            },
            () => {
                var ref = this.getRef(this.state.type, this.state.order);
                this.getContents(ref.limit(this.state.limit));
            }
        );
    };

    handleGetMyContents = e => {
        if (this.props.auth.isAuthenticated) {
            this.setState(
                {
                    getMy: e,
                    idx: null,
                    card: []
                },
                () => {
                    var ref = this.getRef(this.state.type, this.state.order);
                    this.getContents(ref.limit(this.state.limit));
                }
            );
        } else {
            window.alert("로그인 후 사용 가능");
        }
    };

    getRef = (t, o) => {
        var db = firebase.firestore();
        var tmp;
        switch (t) {
            case "all":
                tmp = db.collection("contents");
                break;
            case "img":
                tmp = db.collection("contents").where("type", "==", "img");
                break;
            case "txt":
                tmp = db.collection("contents").where("type", "==", "txt");
                break;
            default:
                tmp = db.collection("contents");
        }

        switch (o) {
            case "view":
                return tmp.orderBy("view", "desc");

            case "date":
                return tmp.orderBy("date", "desc");
            default:
                return tmp.orderBy("date", "desc");
        }
    };

    componentDidUpdate() {
        //console.log("idx", this.state.type);
    }

    getContents = e => {
        var ref = e;
        if (this.state.getMy) {
            ref = e.where("author.id", "==", this.props.auth.user.email);
        }

        ref.get()
            .then(snapShot => {
                snapShot.forEach(doc => {
                    var tmp = (
                        <Card
                            id={doc.id}
                            key={doc.id}
                            title={doc.data().title}
                            url={doc.data().url ? doc.data().url : null}
                            sub={doc.data().subtitle}
                            date={doc.data().date}
                            view={doc.data().view}
                        />
                    );
                    this.setState({
                        card: this.state.card.concat(tmp),
                        idx: snapShot.docs[snapShot.docs.length - 1]
                    });
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    more = () => {
        var order = this.state.order;
        var ref = this.getRef(this.state.type, this.state.order);
        this.getContents(ref.startAfter(this.state.idx.data()[order]).limit(this.state.limit));
    };

    componentDidMount() {
        var ref = this.getRef(this.state.type, this.state.order);
        //this.getContents(ref.where("author.id", "==", "n4@naver.com").limit(this.state.limit));
        this.getContents(ref.limit(this.state.limit));
    }

    render() {
        return (
            <div style={{ backgroundColor: "rgb(242, 244, 247)" }}>
                <Nav />
                <div className="container-fluid ">
                    <div className="col-sm-12 col-md-10 col-lg-7 mx-auto ">
                        <Menu
                            handleType={this.handleType}
                            getMyContents={this.handleGetMyContents}
                            handleOrder={this.handleOrder}
                            search={this.search}
                        />
                        <div>{this.state.card}</div>
                        {this.state.idx && (
                            <div className="row pb-3 justify-content-center">
                                <button
                                    className="btn text-white"
                                    style={{ backgroundColor: "rgb(51, 85, 139)" }}
                                    onClick={this.more}
                                >
                                    더 보기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="py-4 bg-dark text-center text-white-50">
                    presentlee914@gmail.com
                </div>
            </div>
        );
    }
}

App.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(App);
