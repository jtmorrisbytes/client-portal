//messages
const MESSAGE_NOT_AUTHORIZED = "You are not authorized to access this resource";
const MESSAGE_BAD_REQUEST = "Bad request.";
//reason codes
const MESSAGE_NOT_FOUND = "Resource not found";
const REASON_LOGIN_EMAIL_INVALID = "LOGIN_EMAIL_INVALID";
const PASSWORD = {
  LENGTH: {
    MIN: 8,
    MAX: 64,
    REGEX: /(.{8,64})/s,
    TOO_SHORT: {
      REASON: "PASSWORD_TOO_SHORT",
      DESCRIPTION: "Password is too short.",
    },
    TOO_LONG: {
      REASON: "PASSWORD_TOO_LONG",
      DESCRIPTION: "Password is too long",
    },
  },
  REQUIRED: {
    CHARACTERS: {
      REGEX: /[a-zA-Z0-9]+/,
      MISSING: {
        REASON: "PASSWORD_MISSING_REQUIRED_CHARACTERS",
        DESCRIPTION:
          "Password is required to have at least one special character",
      },
    },
    SPECIAL_CHARACTERS: {
      REGEX: /\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\-|\+|\=|\\|\||\,|\<|\.|\>|\?|\//,
      MISSING: {
        REASON: "PASSWORD_MISSING_REQUIRED_SPECIAL_CHARACTERS",
        DESCRIPTION:
          "Password is required to have one of the following characters: !@#$%^&*()_+=\\/,.<>",
      },
    },
  },
  NIST: {
    URL: "https://api.badpasswordcheck.com/check/",
    MESSAGE:
      "That password is not allowed as it has been compromised elsewhere",
    REASON: "PASSWORD_COMPROMISED",
    INFOLINK: "https://pages.nist.gov/800-63-3/",
  },
};

const REASON = {
  LOGIN: {
    REQUIRED: "LOGIN_REQUIRED",
    PASSWORD: {
      MISSING: "LOGIN_PASSWORD_MISSING",
      INCORRECT: "LOGIN_PASSWORD_INCORRECT",
    },
    EMAIL: {
      MISSING: "LOGIN_EMAIL_MISSING",
    },
  },
  AUTH: {
    STATE_INVALID: "STATE_INVALID",
    STATE_MISSING: "STATE_MISSING",
    STATE_MISMATCH: "STATE_MISMATCH",
    IP_MISMATCH: "IP_MISMATCH",
    SESSION_EXPIRED: "SESSION_EXPIRED",
  },
  USER: {
    NOT_FOUND: "USER_NOT_FOUND",
  },
};

const REASON_STATE_INVALID = "STATE_INVALID";
// default constant variables
const MAX_ELAPSED_REQUEST_TIME =
  process.env.MAX_ELAPSED_REQUEST_TIME || 1000 * 60 * 3;
module.exports = {
  MAX_ELAPSED_REQUEST_TIME,
  REASON,
  PASSWORD,
  MESSAGE_BAD_REQUEST,
  MESSAGE_NOT_FOUND,
  MESSAGE_NOT_AUTHORIZED,
};
