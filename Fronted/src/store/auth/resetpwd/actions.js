import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from "./actionTypes";

export const userResetPassword = (user, history) => {
 console.log('aaaaaaaaaaaaa at actions')
  return {
    type: RESET_PASSWORD,
    payload: { user, history },
  };
};

export const userResetPasswordSuccess = message => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    payload: message,
  };
};

export const userResetPasswordError = message => {
  return {
    type: RESET_PASSWORD_ERROR,
    payload: message,
  };
};
