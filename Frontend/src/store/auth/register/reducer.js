import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
  RESET_REGISTER_FLAG
} from "./actionTypes";

const initialState = {
  registrationError: "",
  message: null,
  loading: false,
  user: null,
  success: false,
  error: false
};

const Account = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        loading: true,
        registrationError: "",
        success: false,
        error: false
      };
    case REGISTER_USER_SUCCESSFUL:
      return {
        ...state,
        loading: false,
        user: action.payload,
        success: true,
        registrationError: "",
        error: false
      };
    case REGISTER_USER_FAILED:
      return {
        ...state,
        user: null,
        loading: false,
        success: false,
        registrationError: action.payload,
        error: true
      };
    case RESET_REGISTER_FLAG:
      return {
        ...state,
        success: false,
        error: false
      };
    default:
      return state;
  }
};

export default Account;
