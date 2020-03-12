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
                this.getContents(ref.limit(3));
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
                this.getContents(ref.limit(3));
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
                this.getContents(ref.limit(3));
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
        this.getContents(ref.startAfter(this.state.idx.data()[order]).limit(3));
    };

    componentDidMount() {
        var ref = this.getRef(this.state.type, this.state.order);
        //this.getContents(ref.where("author.id", "==", "n4@naver.com").limit(3));
        this.getContents(ref.limit(3));
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
