import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

export const signUp
//Sign up
export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/users/add", userData)
        .then(res => history.push("/login"))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

//login
export const loginUser = userData => dispatch => {
    console.log("loginUser 함수 호출" + userData);
    axios
        .post("/users/login", userData)
        .then(res => {
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// User loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

// Log user out
export const logoutUser = () => dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};