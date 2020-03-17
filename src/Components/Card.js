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
                <div className="col p-4">
                    <div
                        className="d-flex pb-1 justify-content-between"
                        style={{
                            borderBottomColor: "rgb(223,223,223)",
                            borderBottomStyle: "solid",
                            borderBottomWidth: "1px"
                        }}
                    >
                        {this.props.view > 100 ? (
                            <div>
                                <span className="badge badge-primary align-self-center">인기</span>
                            </div>
                        ) : (
                            <div>
                                <span
                                    className="badge badge-primary align-self-center"
                                    style={{ visibility: "hidden" }}
                                >
                                    인기
                                </span>
                            </div>
                        )}

                        <div className="lead m-0 align-self-center">{this.props.title}</div>

                        {this.props.url ? (
                            <div>
                                <span className="badge badge-dark align-self-center">사진</span>
                            </div>
                        ) : (
                            <div>
                                <span
                                    className="badge badge-dark align-self-center"
                                    style={{ visibility: "hidden" }}
                                >
                                    사진
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="row m-0" style={{ height: "150px" }}>
                        <div
                            className="d-flex col-6 p-1 justify-content-center align-items-center"
                            style={{
                                borderRightStyle: "solid",
                                borderWidth: "1px",
                                borderColor: "rgb(223,223,223)"
                            }}
                        >
                            <h3 className="">{this.props.sub[0]}</h3>
                        </div>
                        <div className="d-flex col-6 p-1 justify-content-center align-items-center">
                            <h3>{this.props.sub[1]}</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
