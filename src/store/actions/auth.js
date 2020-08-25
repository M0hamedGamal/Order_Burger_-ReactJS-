import * as actionTypes from "./actionTypes";
import axios from "axios";

const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId,
  };
};

// sync function to logout user after one hour.
export const logout = () => {
  // remove items from local storage when user logged out.
  localStorage.removeItem("token");
  localStorage.removeItem("userID");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

// async function to logout user after one hour.
const authTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000); // * 1000 to convert Seconds to Milliseconds.
  };
};

export const auth = (email, password, isSignup) => {
  return async (dispatch) => {
    try {
      dispatch(authStart());

      const authData = {
        email: email,
        password: password,
        returnSecureToken: true,
      };
      /*  When you need to login & signup by firebase rest Auth API you need to goto
          this link: [https://firebase.google.com/docs/reference/rest/auth#section-create-email-password]
          from side bar choose 'sign up with email / password': 
          & Goto endpoint to copy: https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
          Or choose 'sign in with email / password: 
          & Goto endpoint to copy: https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
          API_KEY --> Get API Key From --> Firebase / Setting [the gear] / Project Setting / Web API Key.
       */
      // API to Signup.
      let url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCpw7IIrwhu1Um62AOBGxY_tI7O_uupNGg";

      if (!isSignup) {
        // API to Sign in.
        url =
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCpw7IIrwhu1Um62AOBGxY_tI7O_uupNGg";
      }
      const response = await axios.post(url, authData);
      console.log(response.data);
      /*console.log(expirationDate);
        console.log(new Date().getTime());  // getTime --> Returns the number of milliseconds since 01 January, 1970.
        console.log(response.data.expiresIn * 1000); // * 1000 to Get time into Milliseconds.
      */
      const expirationDate = new Date(
        new Date().getTime() + response.data.expiresIn * 1000
      );
      // Store token into local storage to login the user automatically when he refresh page.
      localStorage.setItem("token", response.data.idToken);
      localStorage.setItem("userID", response.data.localId);
      localStorage.setItem("expirationDate", expirationDate);
      dispatch(authSuccess(response.data.idToken, response.data.localId));
      // logout user after one hour.
      dispatch(authTimeout(response.data.expiresIn));
    } catch (error) {
      // path of error message provided by firebase.
      console.log(error.response.data.error.message);
      dispatch(authFail(error.response.data.error.message));
    }
  };
};

const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

// For Auto Login by user's token stored into local storage.
// Async.
export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");

    // if there's no token into local storage.
    if (!token) {
      // dispatch logout.
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));

      // check if expirationDate time less than current time.
      if (expirationDate <= new Date()) {
        // dispatch logout.
        dispatch(logout());
      } else {
        const userID = localStorage.getItem("userID");
        // dispatch authSuccess with token, userID which stored into local storage.
        dispatch(authSuccess(token, userID));
        /* 
        console.log((expirationDate.getTime() - new Date().getTime()) / 1000);
        dispatch authTimeout with subtraction Milliseconds.
        [/ 1000] --> Because in authTimeout method we [* 1000] to convert time to Milliseconds 
        which came from 'response.data.expiresIn' in auth method. & this time will return Milliseconds So we need [/ 1000].
         */
        dispatch(
          authTimeout((expirationDate.getTime() - new Date().getTime()) / 1000)
        );
      }
    }
  };
};
