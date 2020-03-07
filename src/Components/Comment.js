import React, { Component } from "react";

class Comment extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        };
    }

    render() {
        //console.log("data : " + this.props.data);
        let a = "";
        for (var key in this.props.data) {
            for (var key_ in this.props.data[key]) {
                a += this.props.data[key][key_];
            }
            a += "\n";
        }

        return (
            <div>
                {a}
                <input type="button" value="추천"></input>
                <input type="button" value="신고"></input>
            </div>
        );
    }
}

export default Comment;
