import { combineReducers } from "redux";
import authReducer from "../reducers/authReducers";
import errorReducer from "../reducers/errorReducers";
import writeReducer from "../reducers/wrtieReducers";

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    data: writeReducer
});
