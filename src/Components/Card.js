import React, { Component } from "react";

class Card extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                className="card border-0 my-3"
                onClick={() => {
                    window.location = "/vs/" + this.props.id;
                }}
                style={{ cursor: "pointer" }}
            >
                <div className="col p-0">
                    {this.props.url ? (
                        <>
                            <img
                                className="card-img-top"
                                src={this.props.url[0]}
                                style={{ height: "300px", width: "50%" }}
                                alt="agjrgioajregioaejrgio"
                            ></img>
                            <img
                                className="card-img-top"
                                src={this.props.url[1]}
                                style={{ height: "300px", width: "50%" }}
                                alt=""
                            ></img>
                        </>
                    ) : (
                        <div className="row m-0 pt-4">
                            <div
                                className="col-6 p-0"
                                style={{
                                    height: "200px",
                                    width: "50%",
                                    backgroundColor: "rgb(247, 202, 201)"
                                }}
                            >
                                <h3>{this.props.sub[0]}</h3>
                            </div>
                            <div
                                className="col-6 p-0 "
                                style={{
                                    height: "200px",
                                    width: "50%",
                                    backgroundColor: "rgb(145, 168, 209)"
                                }}
                            >
                                <h3>{this.props.sub[1]}</h3>
                            </div>
                        </div>
                    )}
                </div>
                <div className="card-img-overlay p-0">
                    <h5
                        className="card-title text-center"
                        style={{
                            color: "white",
                            backgroundColor: "rgb(51, 85, 139)"
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
