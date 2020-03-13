import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import firebase from "../firebase";
import Card from "./Card";
import Nav from "./Nav";
//import { GET_ERRORS } from '../actions/types';

class Setting extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            subtitle1: "",
            subtitle2: "",
            file1: null,
            file2: null,
            option: "txt",
            url1: null,
            url2: null,
            data: null,
            errors: {}
        };
    }

    componentDidUpdate() {
        //파일 업로드 => url1, url2 != null
        if (this.state.url1 !== null && this.state.url2 !== null) {
            var _data = this.state.data;
            _data.url = [this.state.url1, this.state.url2];
            this.docSet(_data);
        }
        /*
        if (this.state.file1) {
            if (this.state.file1.size > 1024 * 1024 * 2) window.alert("용량 초과");
        }*/
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
    };

    onSubmit = e => {
        e.preventDefault();
        //타입이 img 일때, txt 일때 따로 처리
        //img일때는 fileupload 함수 호출하여 url값을 반환 받는다
        var _data = {
            author: {
                id: this.props.auth.user.email,
                name: this.props.auth.user.displayName
            },
            subtitle: [this.state.subtitle1, this.state.subtitle2],
            title: this.state.title,
            type: this.state.option,
            view: 0,
            voteA: [],
            voteB: [],
            date: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (this.state.option === "img") {
            if (this.state.file1.size > 1024 * 1024 * 2) {
                window.alert("1번 파일의 용량이 2MB를 초과합니다.");
                return;
            }
            if (this.state.file2.size > 1024 * 1024 * 2) {
                window.alert("2번 파일의 용량이 2MB를 초과합니다.");
                return;
            }

            this.setState({
                data: _data
            });
            this.fileUpload(this.state.file1, 1);
            this.fileUpload(this.state.file2, 2);
        } else {
            this.docSet(_data);
        }
    };

    docSet = e => {
        console.log("e", e);
        var db = firebase.firestore();
        db.collection("contents")
            .doc()
            .set(e)
            .then(docRef => {
                console.log("Document written with ID: ", docRef);
                this.props.history.push("/");
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    };

    fileUpload = (e, o) => {
        var storageRef = firebase.storage().ref();
        // File or Blob named mountains.jpg
        var file = e;
        // Create the file metadata
        var metadata = {
            contentType: "image"
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child("img/" + Date.now() + file.name).put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log("Upload is paused");
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log("Upload is running");
                        break;
                }
            },
            function(error) {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        break;

                    case "storage/canceled":
                        // User canceled the upload
                        break;

                    case "storage/unknown":
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    console.log("File available at", downloadURL);
                    switch (o) {
                        case 1:
                            this.setState({ url1: downloadURL });
                            break;
                        case 2:
                            this.setState({ url2: downloadURL });
                            break;
                    }
                });
            }
        );
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
                                alt=""
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
                                        className="form-control"
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
                                <div className="col-12">
                                    글 설명 작성, 첨부 파일의 용량은 2MB를 넘을 수 없습니다.
                                </div>
                            </div>
                            <div className="row mt-4" style={{}}>
                                <div className="col-6 text-center">
                                    <textarea
                                        className="form-control"
                                        rows="8"
                                        id="subtitle1"
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
                                            required
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
                                        className="form-control"
                                        rows="8"
                                        id="subtitle2"
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
                                            onChange={this.handleChange}
                                            required
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

                            <div stlye={{ display: "none" }}></div>

                            <div className="row justify-content-end">
                                {this.state.data ? (
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        type="submit"
                                        value="submit"
                                    >
                                        작성
                                    </button>
                                )}
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
