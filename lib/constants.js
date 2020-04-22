//messages
export const MESSAGE_NOT_AUTHORIZED =
  "You are not authorized to access this resource";
export const MESSAGE_BAD_REQUEST = "Bad request.";
//reason codes
export const MESSAGE_NOT_FOUND = "Resource not found";
export const REASON_LOGIN_EMAIL_INVALID = "LOGIN_EMAIL_INVALID";
export const PASSWORD = {
  LENGTH: {
    MIN: 8,
    MAX: 64,
    REGEX: /(.{8,64})/s,
    TOO_SHORT = 'PASSWORD_TOO_SHORT',
    TOO_LONG = "PASSWORD_TOO_LONG"
  },
  REQUIRED: {
    CHARACTERS: {
      REGEX: /\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\-|\+|\=|\\|\||\,|\<|\.|\>|\?\//,
      MISSING: "PASSWORD_MISSING_REQUIRED_CHARACTERS"
    },
    SPECIAL_CHARACTERS: {
      REGEX: /[a-zA-Z0-9]+/,
      MISSING: "PASSWORD_MISSING_REQUIRED_SPECIAL_CHARACTERS"
    },
  },
  NIST:{
    URL:"https://api.badpasswordcheck.com/check/"
  }
};

export const REASON = {
  LOGIN: {
    REQUIRED: "LOGIN_REQUIRED",
    PASSWORD: {
      MISSING: "LOGIN_PASSWORD_MISSING",
    },
    EMAIL: {
      MISSING: "LOGIN_EMAIL_MISSING",
    },
  },
  AUTH: {
    STATE_INVALID: "STATE_INVALID",
    STATE_MISSING: "STATE_MISSING",
  },
  USER: {
    NOT_FOUND: "USER_NOT_FOUND",
  },
};

export const REASON_STATE_INVALID = "STATE_INVALID";
// default constant variables
export const MAX_ELAPSED_REQUEST_TIME =
  process.env.MAX_ELAPSED_REQUEST_TIME || 1000 * 60 * 3;
