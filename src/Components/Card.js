import React, { Component } from "react";

class Card extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        /*console.log(
            this.props.date
                .toDate()
                .toString()
                .split(" ")
        );*/
    }

    render() {
        return (
            <div
                className="card border-1 my-3 shadow-sm"
                onClick={() => {
                    window.location = "/vs/" + this.props.id;
                }}
                style={{ cursor: "pointer" }}
            >
                {this.props.url ? (
                    <div className="col px-0 pt-4 ">
                        <div
                            className="d-flex"
                            style={{
                                borderBottomColor: "rgb(223,223,223)",
                                borderBottomStyle: "solid",
                                borderBottomWidth: "1px"
                            }}
                        >
                            <div className="flex-md-fill flex-sm-fill">
                                <p className="lead pb-2 m-0 text-center">{this.props.title}</p>
                            </div>
                            <div>
                                <p className="text-muted my-auto" style={{ fontSize: "10px" }}>
                                    {this.props.view}
                                </p>
                            </div>
                        </div>
                        <img
                            className=""
                            src={this.props.url[0]}
                            style={{
                                height: "174px",
                                width: "50%"
                            }}
                            alt="agjrgioajregioaejrgio"
                        ></img>
                        <img
                            className=""
                            src={this.props.url[1]}
                            style={{ height: "174px", width: "50%" }}
                            alt=""
                        ></img>
                    </div>
                ) : (
                    <div className="col p-4 ">
                        <div
                            className="d-flex"
                            style={{
                                borderBottomColor: "rgb(223,223,223)",
                                borderBottomStyle: "solid",
                                borderBottomWidth: "1px"
                            }}
                        >
                            <div className="flex-md-fill flex-sm-fill">
                                <p className="lead pb-2 m-0 text-center">{this.props.title}</p>
                            </div>
                            <div>
                                <p className="text-muted my-auto" style={{ fontSize: "10px" }}>
                                    {this.props.view}
                                </p>
                            </div>
                        </div>
                        <div className="row m-0" style={{ height: "150px" }}>
                            <div
                                className="d-flex col-6 p-0 justify-content-center align-items-center"
                                style={{
                                    borderRightStyle: "solid",
                                    borderWidth: "1px",
                                    borderColor: "rgb(223,223,223)"
                                }}
                            >
                                <h3 className="align-middle">{this.props.sub[0]}</h3>
                            </div>
                            <div className="d-flex col-6 p-0 justify-content-center align-items-center">
                                <h3>{this.props.sub[1]}</h3>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Card;
