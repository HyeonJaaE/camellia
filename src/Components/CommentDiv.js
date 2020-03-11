import React, { Component } from "react";
import Comment from "./Comment";

class CommentDiv extends Component {
    constructor() {
        super();
    }

    render() {
        const tmp = this.props.data;
        //console.log("div", tmp);
        const list = tmp.map((t, i) => (
            <Comment key={i} data={t[0]} docId={t[1]} n={this.props.n}></Comment>
        ));

        return <div>{list}</div>;
    }
}

export default CommentDiv;
