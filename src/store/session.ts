import type { AxiosError } from "axios";
import { User } from "@jtmorrisbytes/lib/dist/User";
import Axios from "axios";

type Session = {
  cookie: {
    maxAge: Number;
    expires: Date;
  };
  user: {};
  ipAddr: string;
  loading: boolean;
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
  user: new User("", ""),
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
    payload: Axios.get(sessionApiUrl)
      .then((res) => {
        return res.data;
      })
      .catch((err: AxiosError) => {
        return err.request.response;
      }),
  };
}

export function sessionReducer(state = initialState, action: any): Object {
  const type: string = action.type;
  // refine this type over time
  const payload: any = action.payload;
  switch (type) {
    case CHECK_SESSION_STATUS_PENDING:
      console.log("check session pending");
      return state;
    case CHECK_SESSION_STATUS_REJECTED:
      console.error("check session failed");
      return state;
    case CHECK_SESSION_STATUS_FULFILLED:
      console.log("check session succeded");
      return state;
    default:
      return state;
  }
}
