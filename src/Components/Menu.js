import React, { Component } from "react";

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ""
        };
    }
    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };
    btnClick = e => {
        e.preventDefault();
        this.props.handleOrder(e.target.id);
    };

    onSearch = e => {
        e.preventDefault();

        this.props.search(this.state.search);
    };
    render() {
        return (
            <div className="mt-2">
                <div className="row">
                    <div className="col-4 p-0">
                        <button
                            className="btn"
                            id="date"
                            onClick={this.btnClick}
                            style={{ fontSize: "13px" }}
                        >
                            최신순
                        </button>
                        <button
                            className="btn"
                            id="view"
                            onClick={this.btnClick}
                            style={{ fontSize: "13px" }}
                        >
                            인기순
                        </button>
                    </div>
                    <div className="col-4 p-0" />
                    <div className="col-4 p-0">
                        <form
                            className="form-inline d-flex justify-content-center md-form form-sm mt-0"
                            onSubmit={this.onSearch}
                        >
                            <input
                                className="form-control form-control-sm ml-3 w-75"
                                type="text"
                                id="search"
                                onChange={this.handleChange}
                                placeholder="Search"
                                aria-label="Search"
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Menu;
