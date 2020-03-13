import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ""
        };
    }
    onChangeOrder = e => {
        e.preventDefault();
        this.props.handleOrder(e.target.value);
    };

    onChangeType = e => {
        //console.log(e.target.value);
        this.props.handleType(e.target.value);
    };

    onChangeGetMyContents = e => {
        switch (e.target.value) {
            case "mine":
                this.props.getMyContents(true);
                break;
            case "every":
                this.props.getMyContents(false);
                break;
            default:
                this.props.getMyContents(false);
                break;
        }
    };

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    onSearch = e => {
        e.preventDefault();

        this.props.search(this.state.search);
    };

    render() {
        return (
            <div className="mt-2">
                <div className="row">
                    <div className="col p-0">
                        <select
                            className="form-control"
                            style={{ display: "inline", width: "auto" }}
                            name="정렬"
                            onChange={this.onChangeOrder}
                        >
                            <option value="view">인기순</option>
                            <option value="date">최신순</option>
                        </select>
                        <select
                            className="form-control"
                            style={{ display: "inline", width: "auto" }}
                            name="타입"
                            onChange={this.onChangeType}
                        >
                            <option value="all">모두</option>
                            <option value="img">이미지</option>
                            <option value="txt">텍스트</option>
                        </select>
                        {this.props.auth.isAuthenticated && (
                            <select
                                className="form-control"
                                style={{ display: "inline", width: "auto" }}
                                name="글 종류"
                                onChange={this.onChangeGetMyContents}
                            >
                                <option value="every">모든 글</option>
                                <option value="mine">내가 작성한 글</option>
                            </select>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Menu);
