import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { RESET_PASSWORD } from "./actionTypes";
import { userResetPasswordSuccess, userResetPasswordError } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeResetPwd,
  // postJwtResetPwd,
} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* resetUser({ payload: { user, history } }) {

  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.resetPassword, user.email);
      if (response) {
        yield put(
          userResetPasswordSuccess(
            "Reset link are sended to your mailbox, check there first"
          )
        );
      }
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      // const response = yield call(postJwtResetPwd, "/jwt-reset-pwd", {
      //   email: user.email,
      // });
      // if (response) {
      //   yield put(
      //     userResetPasswordSuccess(
      //       "Reset link are sended to your mailbox, check there first"
      //     )
      //   );
      // }
    } else if (process.env.REACT_APP_API_URL) {
      const response = yield call(postFakeResetPwd, user);
      if (response) {
        yield put(
          userResetPasswordSuccess(
            "Reset code is sent to your mailbox, check there first"
          )
        );
        history('/login')
      }
    }
  } catch (error) {
    yield put(userResetPasswordError(error));
  }
}

export function* watchUserPasswordReset() {
  yield takeEvery(RESET_PASSWORD, resetUser);
}

function* resetPasswordSaga() {
  yield all([fork(watchUserPasswordReset)]);
}

export default resetPasswordSaga;
