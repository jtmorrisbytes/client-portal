import {
  START_AUTH_SESSION,
  START_AUTH_SESSION_PENDING,
  START_AUTH_SESSION_FULFILLED,
  START_AUTH_SESSION_REJECTED,
  authApiUrl,
} from "./constants";
import Resopnse from "@jtmorrisbytes/lib/Response";
import Axios from "axios";

function rejectAuthSessionAction(error) {
  return {
    type: START_AUTH_SESSION_REJECTED,
    payload: { error },
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
    Axios.post(authApiUrl).then((response) => {
      if (typeof response.data === "object") {
        resolveAuthSessionAction(response.data);
      } else {
        rejectAuthSessionAction(Resopnse.EMissing);
      }
    });
  };
}
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
