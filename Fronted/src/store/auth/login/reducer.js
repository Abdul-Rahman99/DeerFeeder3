import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  RESET_LOGIN_FLAG
} from "./actionTypes";

const initialState = {
  errorMsg: "",
  loading: false,
  error: false,
  isUserLogout: false, // Initialize isUserLogout in the initial state
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isUserLogout: false,
      };
    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        isUserLogout: true,
      };
    case API_ERROR:
      return {
        ...state,
        errorMsg: action.payload.data,
        loading: false, // Set loading to false in case of an error
        error: true,
        isUserLogout: false,
      };
    case RESET_LOGIN_FLAG:
      return {
        ...state,
        errorMsg: null,
        loading: false,
        error: false,
      };
    default:
      return state;
  }
};

export default login;