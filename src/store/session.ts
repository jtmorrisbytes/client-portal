import type { AxiosError, AxiosResponse } from "axios";
// import type { IResponse } from "@jtmorrisbytes/lib/Response";
import * as Response from "@jtmorrisbytes/lib/Response";
// import { startAuthSession } from "./auth";

import {
  CHECK_SESSION_STATUS_FULFILLED,
  CHECK_SESSION_STATUS_PENDING,
  CHECK_SESSION_STATUS_REJECTED,
  sessionApiUrl,
} from "./constants";

// import * as Auth from "@jtmorrisbytes/lib/Auth";
import Axios from "axios";

// type Action = {
//   type: string;
//   payload: any;
// };

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
  ipAddr: string;
  loading: boolean;
  error?: {
    MESSAGE: string;
    TYPE: string;
    REASON: string;
  };
  auth: TAuth;
};

// type AsyncAction = {
//   type: String;
//   payload: Promise<Object>;
// };

const initialState: TSession = {
  cookie: null,
  ipAddr: "",
  loading: true,
  auth: {
    state: "",
    loading: false,
  },
};
// create constants

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
    // console.log("checkSessionStatus dispatch", dispatch);
    dispatch({ type: CHECK_SESSION_STATUS_PENDING, payload: {} });
    Axios.get(sessionApiUrl)
      .then((response) => {
        // if the response body was provided
        // console.log("checkSessionStatus response", response);
        if (!response.data) {
          dispatch(
            checkSessionStatusRejected({
              ...Response.EMissing,
              REASON: `${sessionApiUrl} returned an empty response or the response type was not json`,
            })
          );
          return;
        } else if (typeof response.data === "object") {
          console.log("CHECK SESSION STATUS FULFILLED:", response.data);
          dispatch({
            type: CHECK_SESSION_STATUS_FULFILLED,
            payload: response.data,
          });
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
// export function updateSession(response) {}

export function sessionReducer(state = initialState, action: any): TSession {
  const type: string = action.type;
  // refine this type over time
  let payload: any = action.payload;
  // console.log("SessionReducer action, payload", type, payload);
  switch (type) {
    case CHECK_SESSION_STATUS_PENDING:
      // console.log("check session pending");
      return { ...state, loading: true };
    case CHECK_SESSION_STATUS_REJECTED:
      return { ...state, loading: false, error: payload.error || null };
    case CHECK_SESSION_STATUS_FULFILLED:
      payload = payload as AxiosResponse;
      if (payload) {
        // console.log("check session succeded, payload", payload.data);
        return {
          ...state,
          cookie: payload.cookie,
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
    default:
      return state;
  }
}
