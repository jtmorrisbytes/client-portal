import Axios, { AxiosError } from "axios";
import { _PENDING, _FULFILLED, _REJECTED, userApiUrl } from "./constants";
import Response from "@jtmorrisbytes/lib/Response";
import Auth from "@jtmorrisbytes/lib/Auth";
import Errors from "@jtmorrisbytes/lib/Error";
const GET_LOGGED_IN_USER = "GET_LOGGED_IN_USER";
const GET_LOGGED_IN_USER_PENDING = GET_LOGGED_IN_USER + _PENDING;
const GET_LOGGED_IN_USER_FULFILLED = GET_LOGGED_IN_USER + _FULFILLED;
const GET_LOGGED_IN_USER_REJECTED = GET_LOGGED_IN_USER + _REJECTED;
const NOT_AUTHORIZED = "NOT_AUTHORIZED";

function getLoggedInUserRejected(payload?: object) {
  return {
    type: GET_LOGGED_IN_USER_REJECTED,
    payload: payload || {},
  };
}
function getLoggedInUserResolved(payload: TUser) {
  return {
    type: GET_LOGGED_IN_USER_FULFILLED,
    payload: payload,
  };
}
function getLoggedInUserPending() {
  return {
    type: GET_LOGGED_IN_USER_PENDING,
    payload: {},
  };
}

export function getLoggedInUser() {
  return (dispatch) => {
    dispatch(getLoggedInUserPending());
    return Axios.get(userApiUrl, { withCredentials: true })
      .then((res) => {
        return Promise.resolve(
          dispatch(getLoggedInUserResolved(res.data as TUser))
        );
      })
      .catch((err: AxiosError) => {
        console.warn(
          "GET_LOGGED_IN_USER: the server responded with an error",
          err
        );
        console.dir(err);
        let errRes: any = Response.EGeneralFailure;
        if (err.response?.data) {
          errRes = err.response.data;
        } else if (err.response?.status) {
          switch (err.response.status) {
            case Response.ENotFound.CODE:
              console.log("you need to update your user api url");
              errRes = Response.ENotFound;
              break;
            case Response.EBadRequest.CODE:
              errRes = Response.EBadRequest;
              break;
            case Auth.ELoginRequired.CODE:
              errRes = Auth.ELoginRequired;
            default:
              errRes = Response.EGeneralFailure;
          }
        }
        errRes = getLoggedInUserRejected(errRes);

        return Promise.reject(dispatch(errRes));
      });
  };
}
export type TUser = {
  id: number | null;
  email?: string;
  firstName?: string;
  lastName?: string;
  city: string;
  state: string;
  zip: string;
  loading: boolean;
};
export const User: TUser = {
  id: null,
  email: "",
  firstName: "",
  lastName: "",
  loading: false,
  city: "",
  state: "",
  zip: "",
};

const IState = {
  ...User,
  error: null,
  authorized: false,
  id: null,
};

export function userReducer(_state = IState, action: any) {
  let { type, payload } = action;
  let state = _state;
  switch (type) {
    case GET_LOGGED_IN_USER_PENDING:
      console.log("GET_LOGGED_IN_USER_PENDING");
      return { ..._state, loading: true };
    case GET_LOGGED_IN_USER_FULFILLED:
      payload = payload as TUser;
      const { id, firstName, lastName, email, city, state, zip } = payload;
      return {
        ..._state,
        id,
        firstName,
        lastName,
        email,
        city,
        state,
        zip,
        loading: false,
      };
    case GET_LOGGED_IN_USER_REJECTED:
      console.error("GET_LOGGED_IN_USER_REJECTED", payload);
      return { ..._state, error: payload };
    default:
      return _state;
  }
}
