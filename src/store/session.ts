import type { AxiosError, AxiosResponse } from "axios";
// import type { IResponse } from "@jtmorrisbytes/lib/Response";
import * as Response from "@jtmorrisbytes/lib/Response";
// import * as ERROR from "@jtmorrisbytes/lib/Error";
// import { ISession, MaxAge } from "@jtmorrisbytes/lib/Session";
// import * as User from "@jtmorrisbytes/lib/User";
import * as Auth from "@jtmorrisbytes/lib/Auth";
import Axios from "axios";

type Action = {
  type: string;
  payload: any;
};
export type User = {
  userId: number;
  email?: string;
  firstName?: string;
  lastName?: string;
};

export type Session = {
  cookie: {
    maxAge: Number;
    expires: Date;
  };
  user: null | User;
  ipAddr: string;
  loading: boolean;
  error?: {
    MESSAGE: string;
    TYPE: string;
    REASON: string;
  };
};

type AsyncAction = {
  type: String;
  payload: Promise<Object>;
};

const initialState: Session = {
  cookie: {
    maxAge: 0,
    expires: new Date(),
  },
  user: null,
  ipAddr: "",
  loading: true,
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

const sessionApiUrl = "/api/auth/session";
export function checkSessionStatus(): AsyncAction {
  return {
    type: CHECK_SESSION_STATUS,
    payload: Axios.get(sessionApiUrl).then((res) => {
      if (res.status == 200) {
      }
      return res;
    }),
  };
}

export function sessionReducer(state = initialState, action: any): Session {
  const type: string = action.type;
  // refine this type over time
  let payload: AxiosError | AxiosResponse = action.payload;
  let response: any = {};
  let responseType: string = "";
  let responseMessage: string = "";
  let responseReason: string = "";
  let resonseCode: number = 0;
  switch (type) {
    case CHECK_SESSION_STATUS_PENDING:
      console.log("check session pending");
      return { ...state, loading: true };
    case CHECK_SESSION_STATUS_REJECTED:
      console.group("Check Session failed");
      let sessionError = response.EGeneralFailure;
      if (payload.request.response.startsWith("{")) {
        console.log(
          "A response body was included with the request",
          payload.request.response
        );
        response = JSON.parse(payload.request.response);
        responseType = response.type || responseType;
        responseReason = response.reason || responseReason;
        responseMessage = response.message || responseMessage;

        switch (responseType) {
          case Response.EBadRequest.TYPE:
            console.log("because of a general not bad request response");
            sessionError = Response.EBadRequest;
            break;
          case Response.ENotAuthorized.TYPE:
            console.log("because of a general not authorized response");
            sessionError = Response.ENotAuthorized;
            break;
          case Auth.ELoginRequired.TYPE:
            console.log("because you must log in first");
            sessionError = Auth.ELoginRequired;
            break;
          default:
            sessionError = Response.EGeneralFailure;
        }
      }
      console.groupEnd();
      return { ...state, loading: false, error: sessionError };
    case CHECK_SESSION_STATUS_FULFILLED:
      payload = <AxiosResponse>payload;
      if (payload.data) {
        payload.data = <Session>payload.data;
        console.log("check session succeded, payload", payload.data);
        return {
          ...state,
          cookie: payload.data.cookie,
          user: payload.data.user || null,
          loading: false,
        };
      } else {
        return {
          ...state,
          error: {
            ...Response.EGeneralFailure,
            REASON: "Missing data in response Body",
          },
        };
        break;
      }
    default:
      return state;
  }
}
