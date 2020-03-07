import React, { Component } from "react";
//import { Link } from 'react-router-dom';
//import axios from "axios";

class Card extends Component {
    constructor() {
        super();
        this.state = {
            __dir: "http://localhost:5000/",
            dir1: "",
            dir2: ""
        };
    }

    componentDidMount() {
        console.log(this.props);
        this.setState({
            dir1: this.state.__dir + this.props.dir1,
            dir2: this.state.__dir + this.props.dir2
        });
    }

    render() {
        return (
            <div
                className="card border-0 my-3"
                onClick={() => {
                    window.location = "/vs/" + this.props.contentNum;
                }}
                style={{ cursor: "pointer" }}
            >
                <div className="col p-0">
                    <img
                        className="card-img-top"
                        src={this.state.dir1}
                        style={{ height: "300px", width: "50%" }}
                        alt="agjrgioajregioaejrgio"
                    ></img>
                    <img
                        className="card-img-top"
                        src={this.state.dir2}
                        style={{ height: "300px", width: "50%" }}
                        alt=""
                    ></img>
                </div>
                <div className="card-img-overlay p-0">
                    <h5
                        className="card-title text-center bg-dark"
                        style={{
                            color: "white"
                        }}
                    >
                        {this.props.title}
                    </h5>
                </div>
            </div>
        );
    }
}

export default Card;
