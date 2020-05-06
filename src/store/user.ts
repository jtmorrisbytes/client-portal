import Axios, { AxiosError } from "axios";
import {
  _PENDING,
  _FULFILLED,
  _REJECTED,
  userApiUrl,
  GET_LOGGED_IN_USER_FULFILLED,
  GET_LOGGED_IN_USER_PENDING,
  GET_LOGGED_IN_USER_REJECTED,
  GET_USER_CLIENTS_PENDING,
  GET_USER_CLIENTS_FULFILLED,
  GET_USER_CLIENTS_REJECTED,
} from "./constants";
import Response from "@jtmorrisbytes/lib/Response";
import Auth from "@jtmorrisbytes/lib/Auth";
import Errors from "@jtmorrisbytes/lib/Error";

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
// GetUserClientResolved
export type GUCFAction = {
  type: string;
  payload: any[];
};
function getUsersClientsRejected(error: object) {
  return {
    type: GET_LOGGED_IN_USER_PENDING,
    payload: error,
  };
}
function getUserClientsPending() {
  return {
    type: GET_USER_CLIENTS_PENDING,
    payload: {},
  };
}
function getUserClientsFulfilled(payload: any[]): GUCFAction {
  return {
    type: GET_USER_CLIENTS_FULFILLED,
    payload,
  };
}
export function getUserClients() {
  return (dispatch) => {
    dispatch(getUserClientsPending());
    return Axios.get("/api/user/clients", {
      withCredentials: true,
    })
      .then((res) => {
        return Promise.resolve(
          dispatch(getUserClientsFulfilled(res.data || []))
        );
      })
      .catch((err) => {
        return Promise.reject(getUsersClientsRejected(dispatch(err)));
      });
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
  clients: TUser[];
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
  clients: [],
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
    case GET_USER_CLIENTS_PENDING:
      return { ..._state, loading: true };
    case GET_LOGGED_IN_USER_PENDING:
      console.log("GET_LOGGED_IN_USER_PENDING");
      return { ..._state, loading: true };
    case GET_USER_CLIENTS_FULFILLED:
      return { ..._state, loading: false, clients: payload };
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
      return { ..._state, error: payload, loading: false };
    default:
      return _state;
  }
}
