export const _REJECTED = "_REJECTED";
export const _PENDING = "_PENDING";
export const _FULFILLED = "_FULFILLED";
export const CHECK_SESSION_STATUS = "CHECK_SESSION_STATUS";
export const CHECK_SESSION_STATUS_PENDING = CHECK_SESSION_STATUS + _PENDING;
export const CHECK_SESSION_STATUS_REJECTED = CHECK_SESSION_STATUS + _REJECTED;
export const START_AUTH_SESSION = "START_AUTH_SESSION";
export const CHECK_SESSION_STATUS_FULFILLED = CHECK_SESSION_STATUS + _FULFILLED;
export const START_AUTH_SESSION_FULFILLED = START_AUTH_SESSION + _FULFILLED;
export const START_AUTH_SESSION_REJECTED = START_AUTH_SESSION + _FULFILLED;
export const START_AUTH_SESSION_PENDING = START_AUTH_SESSION + _PENDING;

export const START_LOGIN_FLOW = "START_LOGIN_FLOW";
export const START_LOGIN_FLOW_FULFILLED = "START_LOGIN_FLOW_FULFILLED";
export const START_LOGIN_FLOW_REJECTED = "START_LOGIN_FLOW_REJECTED";
export const START_LOGIN_FLOW_PENDING = "START_LOGIN_FLOW_PENDING";

export const REDIRECT_ = "REDIRECT_";

export const REDIRECT_LOGIN = REDIRECT_ + "LOGIN";
export const REDIRECT_REGISTER = REDIRECT_ + "REGISTER";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";

export const UPDATE_TITLE = "UPDATE_TITLE";

export const ContentType = { json: "application/json" };
// api routes
export const sessionApiUrl = "/api/auth/session";
export const authApiUrl = "/api/auth/";
export const loginApiUrl = "/api/auth/login";
export const logoutApiUrl = "/api/auth/logout";
export const registerApiUrl = "/api/auth/register";
export const userApiUrl = "/api/user";