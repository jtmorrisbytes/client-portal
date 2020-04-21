//messages
export const MESSAGE_NOT_AUTHORIZED =
  "You are not authorized to access this resource";
export const MESSAGE_BAD_REQUEST = "Bad request.";
//reason codes
export const REASON_TIMESTAMP_EXPIRED = "TIMESTAMP_EXPIRED";
export const REASON_TIMESTAMP_MISMATCH = "TIMESTAMP_MISMATCH";
export const REASON_TIMESTAMP_MISSING = "TIMESTAMP_MISSING";
export const REASON_LOGIN_REQUIRED = "LOGIN_REQUIRED";
export const REASON_AUTH_STATE_INVALID = "AUTH_STATE_INVALID";

// default constant variables
export const MAX_ELAPSED_REQUEST_TIME =
  process.env.MAX_ELAPSED_REQUEST_TIME || 1000 * 60 * 3;
