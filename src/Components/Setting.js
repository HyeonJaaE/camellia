import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import Card from "./Card";
import Nav from "./Nav";
//import { GET_ERRORS } from '../actions/types';

class Setting extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            name1: "",
            name2: "",
            file1: null,
            file2: null,
            option: "txt",
            errors: {}
        };
    }

    componentDidMount() {
        //console.log(this.props.auth);
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (!this.props.auth.isAuthenticated) {
            window.alert("로그인 후 이용가능합니다");
            this.props.history.push("/");
        }
    }

    componentWillReceiveProps(nextProps) {
        //로그아웃 하면 생성화면에서 메인화면으로 다시 이동
        console.log(this.state.option);
        if (!nextProps.auth.isAuthenticated) {
            window.alert("로그인 후 이용가능합니다");
            this.props.history.push("/");
        }
    }

    componentWillUpdate() {
        console.log(this.state.file1);
    }

    handleChange = e => {
        if (e.target.files) {
            this.setState({
                [e.target.id]: e.target.files[0]
            });
        } else {
            this.setState({
                [e.target.id]: e.target.value
            });
        }
        console.log(this.state.option);
    };

    handleChangeFile = event => {
        let reader = new FileReader();
        reader.onloadend = e => {
            // 2. 읽기가 완료되면 아래코드가 실행
            const base64 = reader.result; //reader.result는 이미지를 인코딩(base64 ->이미지를 text인코딩)한 결괏값이 나온다.
            if (base64) {
                this.setState({
                    imgBase64: base64.toString() // 파일 base64 상태 업데이트
                });
            }
        };
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다. 저장후 onloadend 트리거
            this.setState({
                imgFile: event.target.files[0] // 파일 상태 업데이트 업로드 하는것은 파일이기 때문에 관리 필요
            });
        }
    };

    onSubmit = e => {
        e.preventDefault();
        console.log("data : ");

        if (this.state.option === "img") {
            //when content-type is img
            const setData = new FormData();

            setData.append("contentType", this.state.option);
            setData.append("contentAuthorId", this.props.auth.user.id);
            setData.append("contentAuthorName", this.props.auth.user.name);
            setData.append("title", this.state.title);
            setData.append("name1", this.state.name1);
            setData.append("name2", this.state.name2);
            setData.append("file1", this.state.file1);
            setData.append("file2", this.state.file2);

            for (var pair of setData.entries()) {
                console.log(pair[0] + ", " + pair[1]);
            }
            axios
                .post("/contents/addWithFile", setData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                .then(res => {
                    //console.log(res);
                    this.props.history.push("/");
                })
                .catch(error => {
                    console.log(error.message);
                });
        } else {
            //when content-type is txt
            const _setData = {
                contentType: this.state.option,
                contentAuthorId: this.props.auth.user.id,
                contentAuthorName: this.props.auth.user.name,
                title: this.state.title,
                name1: this.state.name1,
                name2: this.state.name2
            };
            axios
                .post("/contents/addWithNoFile", _setData)
                .then(res => {
                    //console.log(res);
                    this.props.history.push("/");
                })
                .catch(error => {
                    console.log(error.message);
                });
        }
    };

    render() {
        return (
            <div>
                <Nav name="HOME" />
                <div className="container">
                    <div className="img_preview" placeholder="이미지 파일을 추가해주세요">
                        {this.state.imgBase64 ? (
                            <img
                                src={this.state.imgBase64}
                                onClick={this.handleRemove}
                                style={{ width: "100px", height: "100px" }}
                            ></img>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="col-9 mx-auto mt-4">
                        <form onSubmit={this.onSubmit}>
                            <div className="row">
                                <div className="col-2">
                                    <select
                                        class="form-control"
                                        id="option"
                                        onChange={this.handleChange}
                                    >
                                        <option value="txt">글</option>
                                        <option value="img">이미지</option>
                                    </select>
                                </div>
                                <div className="col-10">
                                    <input
                                        className="form-control my-input"
                                        type="text"
                                        id="title"
                                        placeholder="제목"
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row my-4">
                                <div className="col-12">글 설명 작성</div>
                            </div>
                            <div className="row mt-4" style={{}}>
                                <div className="col-6 text-center">
                                    <textarea
                                        class="form-control"
                                        rows="8"
                                        id="name1"
                                        onChange={this.handleChange}
                                        required
                                        style={{ resize: "none" }}
                                    />

                                    {this.state.option === "img" ? (
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="file1"
                                            name="file1"
                                            onChange={this.handleChange}
                                        />
                                    ) : (
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="file1"
                                            name="file1"
                                            onChange={this.handleChange}
                                            disabled
                                            style={{ visibility: "hidden" }}
                                        />
                                    )}
                                </div>

                                <div className="col-6 text-center">
                                    <textarea
                                        class="form-control"
                                        rows="8"
                                        id="name2"
                                        onChange={this.handleChange}
                                        required
                                        style={{ resize: "none" }}
                                    />

                                    {this.state.option === "img" ? (
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="file2"
                                            name="file2"
                                            onChange={this.handleChangeFile}
                                        />
                                    ) : (
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="file2"
                                            name="file2"
                                            onChange={this.handleChange}
                                            disabled
                                            style={{ visibility: "hidden" }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div stlye={{ visibility: "hidden" }}>
                                <Card
                                    title={this.state.title}
                                    name1={this.state.name1}
                                    nmae2={this.state.name2}
                                />
                            </div>

                            <div className="row justify-content-end">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    type="submit"
                                    value="submit"
                                >
                                    작성
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Setting.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Setting);
