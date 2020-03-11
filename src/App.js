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
            card: []
        };
    }

    test = () => {
        var db = firebase.firestore();

        let first = db
            .collection("contents")
            .orderBy("date", "desc")
            .limit(3);

        let paginate = first.get().then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.data());
            });
            let last = snapshot.docs[snapshot.docs.length - 1];

            let next = db
                .collection("contents")
                .orderBy("date", "desc")
                .startAfter(last.data().date)
                .limit(3);
        });
    };

    componentDidMount() {
        var db = firebase.firestore();

        db.collection("contents")
            .orderBy("date", "desc")
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
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
                        card: this.state.card.concat(tmp)
                    });
                    //console.log(doc.id, " => ", doc.data());
                });
            });
    }

    render() {
        return (
            <div>
                <Nav />
                <div className="container">
                    <Menu />
                    <div>{this.state.card}</div>
                    <button onClick={this.test}>더 보기</button>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(App);
