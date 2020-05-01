export const _REJECTED: string = "_REJECTED";
export const _PENDING: string = "_PENDING";
export const _FULFILLED: string = "_FULFILLED";
export const CHECK_SESSION_STATUS: string = "CHECK_SESSION_STATUS";
export const CHECK_SESSION_STATUS_PENDING: string =
  CHECK_SESSION_STATUS + _PENDING;
export const CHECK_SESSION_STATUS_REJECTED: string =
  CHECK_SESSION_STATUS + _REJECTED;
export const START_AUTH_SESSION = "START_AUTH_SESSION";
export const CHECK_SESSION_STATUS_FULFILLED: string =
  CHECK_SESSION_STATUS + _FULFILLED;
export const START_AUTH_SESSION_FULFILLED = START_AUTH_SESSION + _FULFILLED;
export const START_AUTH_SESSION_REJECTED = START_AUTH_SESSION + _FULFILLED;
export const START_AUTH_SESSION_PENDING = START_AUTH_SESSION + _PENDING;
export const ContentType = { json: "application/json" };
// api routes
export const sessionApiUrl = "/api/auth/session";
export const authApiUrl = "/api/auth/";
export const loginApiUrl = "/api/auth/login";
export const logoutApiUrl = "/api/auth/logout";
