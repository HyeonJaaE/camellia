import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "./actions/authActions";

import Nav from "./Components/Nav";
import Card from "./Components/Card";
import Menu from "./Components/Menu";
import firebase from "./firebase";
//import reducers from './reducers';
//검색 기능 만드는 중
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            card: [],
            idx: null,
            type: "all",
            order: "view",
            getMy: false,
            search: false,
            searchTxt: "",
            limit: 3
        };
    }

    componentDidUpdate() {
        console.log(this.state.card.length / this.state.limit);
        if (this.state.search) {
            while (this.state.card.length === 0) {
                var ref = this.getRef(this.state.type, this.state.order);
                this.getContents(ref.limit(this.state.limit));
                if (!this.state.search) break;
            }
        }
        if (this.state.search && this.state.card.length > 0) {
            while (this.state.card.length / this.state.limit !== 0) {
                var ref = this.getRef(this.state.type, this.state.order);
                this.getContents(ref.limit(this.state.limit));
                if (!this.state.search) break;
            }
        }
    }
    search = e => {
        this.setState(
            {
                searchTxt: e,
                search: true,
                idx: null,
                card: [],
                limit: 1
            },
            () => {
                var ref = this.getRef(this.state.type, this.state.order);
                this.getContents(ref.limit(this.state.limit));
            }
        );
    };

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

    getMyContents = () => {
        this.setState(
            {
                getMy: true,
                idx: null,
                card: []
            },
            () => {
                var ref = this.getRef(this.state.type, this.state.order);
                this.getContents(ref.limit(this.state.limit));
            }
        );
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

    getContents = e => {
        var ref = e;
        if (this.state.getMy) {
            ref = e.where("author.id", "==", this.props.auth.user.email);
        }
        ref.get()
            .then(snapShot => {
                if (snapShot.empty) {
                    console.log("empty");
                    this.setState({
                        search: false
                    });
                }
                snapShot.forEach(doc => {
                    var pass = true;
                    if (this.state.search) {
                        if (doc.data().title.indexOf(this.state.searchTxt) === -1) pass = false;
                    }
                    var tmp = (
                        <Card
                            id={doc.id}
                            key={doc.id}
                            title={doc.data().title}
                            url={doc.data().url ? doc.data().url : null}
                            sub={doc.data().subtitle}
                        />
                    );
                    if (pass) {
                        this.setState({
                            card: this.state.card.concat(tmp),
                            idx: snapShot.docs[snapShot.docs.length - 1]
                        });
                    }
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
            <div>
                <Nav handleType={this.handleType} getMyContents={this.getMyContents} />
                <div className="container">
                    <Menu handleOrder={this.handleOrder} search={this.search} />
                    <div>{this.state.card}</div>
                    {this.state.idx && <button onClick={this.more}>더 보기</button>}
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
