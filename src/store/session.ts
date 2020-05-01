import type { AxiosError, AxiosResponse } from "axios";
// import type { IResponse } from "@jtmorrisbytes/lib/Response";
import * as Response from "@jtmorrisbytes/lib/Response";
// import * as ERROR from "@jtmorrisbytes/lib/Error";
// import { ISession, MaxAge } from "@jtmorrisbytes/lib/TSession";
// import * as User from "@jtmorrisbytes/lib/User";
import * as Auth from "@jtmorrisbytes/lib/Auth";
import Axios from "axios";

type Action = {
  type: string;
  payload: any;
};
export type TUser = {
  userId: number;
  email?: string;
  firstName?: string;
  lastName?: string;
};
export type TAuth = {
  loading: boolean;
  state: string;
};
type TAuthResponse = {
  state: string;
};
export type TCookie = {
  maxAge: number;
  expires: Date;
};
export type TSession = {
  cookie: TCookie | null;
  user: null | TUser;
  ipAddr: string;
  loading: boolean;
  error?: {
    MESSAGE: string;
    TYPE: string;
    REASON: string;
  };
  auth: TAuth;
};

type AsyncAction = {
  type: String;
  payload: Promise<Object>;
};

const initialState: TSession = {
  cookie: null,
  user: null,
  ipAddr: "",
  loading: true,
  auth: {
    state: "",
    loading: false,
  },
};
// create constants
const _REJECTED: string = "_REJECTED";
const _PENDING: string = "_PENDING";
const _FULFILLED: string = "_FULFILLED";

const CHECK_SESSION_STATUS: string = "CHECK_SESSION_STATUS";
const CHECK_SESSION_STATUS_PENDING: string = CHECK_SESSION_STATUS + _PENDING;
const CHECK_SESSION_STATUS_REJECTED: string = CHECK_SESSION_STATUS + _REJECTED;
const CHECK_SESSION_STATUS_FULFILLED: string =
  CHECK_SESSION_STATUS + _FULFILLED;

const START_AUTH_SESSION = "START_AUTH_SESSION";
const START_AUTH_SESSION_FULFILLED = START_AUTH_SESSION + _FULFILLED;
const START_AUTH_SESSION_PENDING = START_AUTH_SESSION + _PENDING;
const ContentTypeJson = "application/json";
const sessionApiUrl = "/api/auth/session";
function startAuthSession() {
  return (dispatch) => {};
}
function checkSessionStatusRejected(error) {
  return {
    type: CHECK_SESSION_STATUS_REJECTED,
    payload: { error },
  };
}

export function checkSessionStatus() {
  // first get the status of the session
  // if the user is null, start auth state
  //when the auth state request resolves,
  // perform router transition when successful
  // stop if it fails
  // else if the user is not null, then dispatch/resolve the user
  return (dispatch) => {
    console.log("checkSessionStatus dispatch", dispatch);
    dispatch({ type: CHECK_SESSION_STATUS_PENDING, payload: {} });
    Axios.get(sessionApiUrl)
      .then((response) => {
        // if the response body was provided
        console.log("checkSessionStatus response", response);
        console.log("typeof response data", typeof response.data);
        if (!response.data) {
          dispatch(
            checkSessionStatusRejected({
              ...Response.EMissing,
              REASON: `${sessionApiUrl} returned an empty response or the response type was not json`,
            })
          );
          return;
        } else if (typeof response.data === "object") {
          console.log("CHECK SESSION STATUS FULFILLED");
          dispatch({
            type: CHECK_SESSION_STATUS_FULFILLED,
            payload: response.data,
          });
          if (response.data.user === null) {
            console.log(
              "user was not logged in...start auth session and initiate rotuer transition"
            );
            dispatch(startAuthSession());
          }
        } else {
          console.log(
            "checksessionstatus fallthrough response.data",
            response.data
          );
          dispatch(checkSessionStatusRejected(Response.EMissing));
        }
      })
      .catch((error) => {
        console.log(error);
        if ((error.request || {}).response.type) {
          switch (error.request.response.type) {
            case Response.ENotAuthorized.TYPE:
              dispatch(checkSessionStatusRejected(Response.ENotAuthorized));
              return;
            case Response.ENotFound.TYPE:
              dispatch(checkSessionStatusRejected(Response.ENotFound));
              return;
          }
        } else {
          console.log("check session rejected", error);
          dispatch({
            type: CHECK_SESSION_STATUS_REJECTED,
            payload: { error: Response.EGeneralFailure },
          });
        }
      });
  };
}
export function updateSession(response) {}
const sessionStartUrl = "/api/auth/";

export function sessionReducer(state = initialState, action: any): TSession {
  const type: string = action.type;
  // refine this type over time
  let payload: any = action.payload;
  // console.log("SessionReducer action, payload", type, payload);
  let response: any = {};
  let responseType: string = "";
  let responseMessage: string = "";
  let responseReason: string = "";
  let resonseCode: number = 0;
  switch (type) {
    case CHECK_SESSION_STATUS_PENDING:
      // console.log("check session pending");
      return { ...state, loading: true };
    case CHECK_SESSION_STATUS_REJECTED:
      return { ...state, loading: false, error: payload.error || null };
    case CHECK_SESSION_STATUS_FULFILLED:
      payload = <AxiosResponse>payload;
      if (payload) {
        // console.log("check session succeded, payload", payload.data);
        return {
          ...state,
          cookie: payload.cookie,
          user: payload.user || null,
          loading: false,
        };
      } else {
        return {
          ...state,
          loading: false,
          error: {
            MESSAGE:
              "SessionResolver CHECK_SESSION_STATUS_FUFILLED recieved an empty payload",
            REASON:
              "SessionResolver was expecting action.payload to be defined",
            TYPE: "",
          },
        };
        break;
      }
    case START_AUTH_SESSION_PENDING:
      // console.log("START AUTH SESSION PENDING");
      return { ...state, auth: { loading: true, state: "" } };
    case START_AUTH_SESSION_FULFILLED:
      console.log("START AUTH SESSION FUFILLED", payload);
      payload = <TAuthResponse>payload;
      return { ...state, auth: { loading: false, state: payload.state } };
    default:
      return state;
  }
}
