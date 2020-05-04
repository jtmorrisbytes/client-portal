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
    Axios.get(userApiUrl)
      .then((res) => {
        dispatch(getLoggedInUserResolved(res.data as TUser));
      })
      .catch((err: AxiosError) => {
        if (err.response?.data?.TYPE) {
          switch (err.response.data.TYPE) {
            case Auth.ELoginRequired.TYPE:
              dispatch(getLoggedInUserRejected(Auth.ELoginRequired));
              break;
            case Errors.EReferenceError.TYPE:
              dispatch(getLoggedInUserRejected(Errors.EReferenceError));
              break;
            case Errors.ESyntaxError.TYPE:
              dispatch(getLoggedInUserRejected(Errors.ESyntaxError));
              break;
            case Errors.ETypeError.TYPE:
              dispatch(getLoggedInUserRejected(Errors.ETypeError));
              break;
            case Errors.EUnknownError:
              dispatch(getLoggedInUserRejected(Errors.EUnknownError));
            default:
              dispatch(getLoggedInUserRejected(Response.EGeneralFailure));
          }
        } else if (err.response?.status) {
          switch (err.response.status) {
            case Response.ENotFound.CODE:
              console.log("you need to update your user api url");
              dispatch(getLoggedInUserRejected(Response.ENotFound));
              break;
            case Response.EBadRequest.CODE:
              dispatch(getLoggedInUserRejected(Response.EBadRequest));
              break;
            default:
              dispatch(getLoggedInUserRejected(Response.EGeneralFailure));
          }
        } else {
          dispatch(Response.EGeneralFailure);
        }
        // return new Promise(() => {
        //   Promise.resolve();
        // });
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
};
export const User: TUser = {
  id: null,
  email: "",
  firstName: "",
  lastName: "",
  city: "",
  state: "",
  zip: "",
};

const IState = {
  ...User,
  loading: false,
  error: null,
  authorized: false,
  id: null,
};

export function userReducer(_state = IState, action: any) {
  let { type, payload } = action;
  let state = _state;
  switch (type) {
    case GET_LOGGED_IN_USER_PENDING:
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
      return { ..._state, error: payload };
    default:
      return _state;
  }
}
