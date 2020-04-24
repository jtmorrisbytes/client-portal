const validateEmail = require("../../../lib/validateEmail");
const validatePasswordLocally = require("../../../lib/validatePassword.js");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const sha1 = require("sha1");

const crypto = require("crypto");
const {
  MESSAGE_NOT_AUTHORIZED,
  MESSAGE_BAD_REQUEST,
  REASON,
  MESSAGE_NOT_FOUND,
  PASSWORD,
} = require("../../../lib/constants.js");
const { MAX_ELAPSED_REQUEST_TIME } = require("../../../lib/constants.js");
const { NIST } = PASSWORD;
async function register(req, res) {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    streetAddress,
    city,
    state,
    zip,
    password,
  } = req.body;
  const db = req.app.get("db");
  if (!email) {
    res.status(400).json({ error: "field email is required" });
  } else if (!validateEmail(email)) {
    res.status(400).json({ error: `invalid email '${email}'` });
    return;
  } else {
    let result = await db.user.getByEmail(email);
    if (result.length > 0) {
      res.status(400).json({ error: `email ${email} is already in use` });
      return;
    }
  }
  if (!password) {
    res.status(400).json({ error: "field password is required" });
    return;
  } else {
    // email is marked as a unique, required field. if it already exists, the database will throw an error
    // run
    let passwordLocal = validatePasswordLocally(password);
    if (passwordLocal.isValid === false) {
      res.status(400).json({
        message: passwordLocal.description,
        reason: passwordLocal.reason,
      });
      return;
    } else if (process.env.NIST_TOKEN) {
      let nistHash = sha1(password);
      let { found } = await axios.get(NIST.URL + nistHash, {
        headers: {
          Authentication: ` ${process.env.NIST_TOKEN}`,
        },
      });
      if (found) {
        res.status(400).json({
          message: NIST.MESSAGE,
          reason: NIST.REASON,
          info: "https://pages.nist.gov/800-63-3/",
        });
      }
    }
    let encoded = Buffer.from(password).toString("base64");
    let salt = await bcrypt.genSalt(15);
    let hash = await bcrypt.hash(encoded, salt);
    try {
      let result = await db.user.create(
        firstName,
        lastName,
        hash,
        email,
        phoneNumber,
        streetAddress,
        city,
        state,
        zip
      );
      req.session.user = {
        email,
        timestamp: Date.now(),
        ip: req.connection.remoteAddress,
      };
      req.session.destroy;
      res.json(result);
    } catch (e) {
      switch (e.code) {
        case "23505":
          res.status(400);
          break;
        default:
          res.status(500);
      }
      res.json({ error: e.detail });

      console.error(e);
    }
  }
}
async function checkAuthState(req, res, next) {
  // let { auth } = req.session.get();
  req.session.hello = "world";
  console.log(
    "checking if req.session works, session.get() should return everything or undefined"
  );
  // res.json(req.session);
  return;
  const { timestamp, state, ipAddr } = auth || {};
  let currentTimestamp = Date.now();
  if (timestamp && state && ipAddr) {
    // if there is already an auth session
    if (currentTimestamp > timestamp + MAX_ELAPSED_REQUEST_TIME) {
      req.session.destroy();
      res.clearCookie("connect.sid");
      res.status(401).json({
        message: MESSAGE_NOT_AUTHORIZED,
        reason: REASON.AUTH.SESSION_EXPIRED,
      });
    } else if (
      req.connection.remoteAddress &&
      req.connection.remoteAddress != ipAddr
    ) {
      // if the user jumps between devices or there is an ip address mismatch, clear session and cookie
      req.session.destroy();
      res.clearCookie("connect.sid");
      res.status(401).json({
        message: MESSAGE_NOT_AUTHORIZED,
        reason: REASON.AUTH.IP_MISMATCH,
      });
    } else if (state && !req.query.state) {
      res.status(401).json({
        message: MESSAGE_NOT_AUTHORIZED,
        reason: REASON.AUTH.STATE_MISSING,
        path: "query",
      });
    } else if (state != req.query.state) {
      console.log(state, req.query.state);
      res.status(401).json({
        message: MESSAGE_NOT_AUTHORIZED,
        reason: REASON.AUTH.STATE_MISMATCH,
      });
    } else {
      next();
    }
  } else if (!state) {
    res.status(400).json({
      message: MESSAGE_BAD_REQUEST,
      reason: REASON.AUTH.STATE_INVALID,
      redirectTo: "/api/auth/",
      redirectMethod: "POST",
    });
  } else {
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON.AUTH.STATE_INVALID,
      description: "You must POST '/' on this route first",
      redirectTo: "/api/auth",
      redirectMethod: "POST",
    });
  }
}
async function logIn(req, res) {
  console.log("log in requested");
  let { email, password } = req.body;
  if (!email) {
    res.status(400).json({
      message: MESSAGE_BAD_REQUEST,
      reason: REASON.LOGIN.EMAIL.MISSING,
    });
  } else if (!password) {
    res.status(400).json({
      message: MESSAGE_BAD_REQUEST,
      reason: REASON_LOGIN_EMAIL_MISSING,
    });
  } else {
    console.log("searching database for username");
    let result = await req.app.get("db").user.getByEmail(email);
    if (result.length === 0) {
      console.log("user not found");
      res.status(401).json({
        message: MESSAGE_NOT_AUTHORIZED,
        reason: REASON.USER.NOT_FOUND,
      });
    } else {
      let user = result[0];
      console.log(result);
      console.log("user found, comparing hash");
      authenticated = await bcrypt.compare(
        Buffer.from(password).toString("base64"),
        user.hash
      );
      if (authenticated) {
        (req.session.user.firstName = user.first_name),
          (req.session.user.lastName = user.lastName),
          (req.session.user.email = user.email),
          (req.session.user.streetAddress = user.street_address),
          (req.session.user.city = user.city),
          (req.session.user.state = user.state),
          (req.session.user.zip = user.zip);
      }
    }
  }
}
async function logOut(req, res) {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.sendStatus(200);
}
function getUser(req, res) {
  let user = (req.session || {}).user || null;
  res.json({ user: user });
}
function startAuthSession(req, res) {
  // if we already have a session, clear the session
  // and restart it
  console.log(req.socket.remoteAddress);
  req.session.user = null;
  req.session.auth = {
    timestamp: Date.now(),
    //record the time that the auth session
    state: crypto.randomBytes(64).toString("base64"),
    ipAddr: req.connection.remoteAddress,
  };
  res.json(req.session);
}
module.exports = {
  register,
  logIn,
  logOut,
  startAuthSession,
  getUser,
  checkAuthState,
};
