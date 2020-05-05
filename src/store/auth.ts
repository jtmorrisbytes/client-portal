import {
  START_AUTH_SESSION,
  START_AUTH_SESSION_PENDING,
  START_AUTH_SESSION_FULFILLED,
  START_AUTH_SESSION_REJECTED,
  START_LOGIN_FLOW_FULFILLED,
  START_LOGIN_FLOW_PENDING,
  START_LOGIN_FLOW_REJECTED,
  authApiUrl,
} from "./constants";
import Response from "@jtmorrisbytes/lib/Response";
import Axios from "axios";
import {} from "@jtmorrisbytes/lib/Auth";

function rejectAuthSessionAction(error) {
  return {
    type: START_AUTH_SESSION_REJECTED,
    payload: error,
  };
}
function resolveAuthSessionAction(payload) {
  console.log("Auth session resolved with payload", payload);
  return {
    type: START_AUTH_SESSION_FULFILLED,
    payload,
  };
}
export function startAuthSession() {
  console.log("startAuthSession requested");
  return (dispatch) => {
    dispatch({
      type: START_AUTH_SESSION_PENDING,
      payload: {},
    });
    return Axios.post(authApiUrl)
      .then((response) => {
        if (typeof response.data === "object") {
          return Promise.resolve(
            dispatch(resolveAuthSessionAction(response.data))
          );
        } else {
          return Promise.reject(
            dispatch(rejectAuthSessionAction(Response.EMissing))
          );
        }
      })
      .catch((err) => {
        if (err.response?.data) {
          return Promise.reject(
            dispatch(rejectAuthSessionAction(err.response.data))
          );
        } else
          return Promise.reject(
            dispatch(rejectAuthSessionAction(Response.EGeneralFailure))
          );
      });
  };
}
function resolveStartLoginFlowAction(data) {}
function rejectStartLoginFlowAction(error) {
  return {
    type: START_LOGIN_FLOW_REJECTED,
    payload: { error },
  };
}
export function startLoginFlow(state: string) {
  if (typeof state !== "string") {
    state = "";
  }
  if (state.length > 0) {
  } else {
    return rejectStartLoginFlowAction({
      MESSAGE: "Start Login Flow got an invalid login state",
      REASON: "Start Login flow requires a string of length > 0",
      TYPE: "AUTH_STATE_INVALID",
    });
  }
}
export type TAuth = {
  state: string;
  timestamp: number;
  ipAddr: string;
  loading: boolean;
};

const initialState = {
  state: "",
  timestamp: -1,
  ipAddr: "",
  loading: false,
};

export function authStateReducer(
  state = initialState,
  action: { type: string; payload: any }
) {
  const { type, payload } = action;
  switch (type) {
    case START_AUTH_SESSION_PENDING:
      console.log("authStateReducer started auth session");
      return { ...state, loading: true };
    case START_AUTH_SESSION_FULFILLED:
      console.log("authStateReducer got reply from start auth session");
      return {
        ...state,
        loading: false,
        state: payload.state,
        timestamp: payload.timestamp,
      };
    case START_AUTH_SESSION_REJECTED:
      console.log("authStateReducer got an error", payload);
      return { ...initialState, error: payload };
    default:
      return state;
  }
}
