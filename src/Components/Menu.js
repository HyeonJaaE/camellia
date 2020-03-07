import React, { Component } from "react";

class Menu extends Component {
    render() {
        return (
            <div className="mt-2">
                <div className="row">
                    <div className="col-4 p-0">
                        <button className="btn" style={{ fontSize: "13px" }}>
                            최신순
                        </button>
                        <button className="btn" style={{ fontSize: "13px" }}>
                            인기순
                        </button>
                    </div>
                    <div className="col-4 p-0" />
                    <div className="col-4 p-0">
                        <form className="form-inline d-flex justify-content-center md-form form-sm mt-0">
                            <input
                                className="form-control form-control-sm ml-3 w-75"
                                type="text"
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
