const validateEmail = require("../../../lib/validateEmail");
const validatePasswordLocally = require("../../../lib/validatePassword.js");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const sha1 = require("sha1");
const inspect = require("util").inpect;
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
  // try to destructure, respond with 500 if it fails
  try {
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
    } = req.body.user;
    const db = req.app.get("db");
    if (!email) {
      res.status(400).json({ message: "field email is required" });
      return;
    }
    if (!validateEmail(email)) {
      res.status(400).json({ message: `invalid email '${email}'` });
      return;
    }
    let result = await db.user.getByEmail(email);
    if (result.length > 0) {
      res.status(400).json({ message: `email ${email} is already in use` });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "field password is required" });
      return;
    }
    // email is marked as a unique, required field. if it already exists, the database will throw an error
    // run
    let passwordLocal = validatePasswordLocally(password);
    if (passwordLocal.isValid === false) {
      res.status(400).json({
        message: passwordLocal.description,
        reason: passwordLocal.reason,
      });
      return;
    }
    if (process.env.NIST_TOKEN) {
      console.log("attempting NIST check with token ", process.env.NIST_TOKEN);
      let nistHash = sha1(password);
      let { found } = await axios.get(
        NIST.URL + nistHash + `?api_key=${process.env.NIST_TOKEN}`
      );
      if (found) {
        res.status(400).json({
          message: NIST.MESSAGE,
          reason: NIST.REASON,
          info: "https://pages.nist.gov/800-63-3/",
        });
      }
    }
    let encoded = Buffer.from(password).toString("base64");
    let hash = await bcrypt.hash(encoded, await bcrypt.genSalt(15));
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
    console.log("Got result from database", result);
    await req.session.create();
    req.session.user = {
      id: (result[0] || {}).users_id,
    };
    res.json({ session: req.session });
    console.error(e);
  } catch (e) {
    console.log("Failed to register user", e);
  }
}

async function logIn(req, res) {
  console.log("log in requested");
  let { email, password } = req.body;
  if (!email) {
    console.warn("/api/auth/login: email was missing from request");
    console.dir(req.body);
    console.dir(req.query);
    res.status(400).json({
      message: MESSAGE_BAD_REQUEST,
      reason: REASON.LOGIN.EMAIL.MISSING,
    });
  } else if (!password) {
    console.warn("/api/auth/login: password was missing from request");
    console.dir(req.body);
    console.dir(req.query);

    res.status(400).json({
      message: MESSAGE_BAD_REQUEST,
      reason: REASON.LOGIN.PASSWORD.MISSING,
    });
  } else {
    console.log("searching database for username");
    let result = await req.app.get("db").user.getByEmail(email);
    if (result.length === 0) {
      console.warn(
        `/api/auth/login: user '${email.substr(
          0,
          email.indexOf("@") - 2
        )}' not found`
      );
      res.status(401).json({
        message: MESSAGE_NOT_AUTHORIZED,
        reason: REASON.USER.NOT_FOUND,
      });
    } else {
      let user = result[0];
      console.log("/api/auth/login user found, comparing hash");
      authenticated = await bcrypt.compare(
        Buffer.from(password).toString("base64"),
        user.hash
      );
      if (authenticated) {
        console.log("logging in user with id:", user);
        req.session.user_id = user.users_id;
        res.json(req.session);
      } else {
        console.warn("/api/auth/login recieved an invalid password");
        res.status(401).json({
          message: MESSAGE_NOT_AUTHORIZED,
          reason: REASON.LOGIN.PASSWORD.MISSING,
        });
      }
    }
  }
}
async function logOut(req, res) {
  req.session.destroy();
  res.sendStatus(200);
}
function getUser(req, res) {
  let user = (req.session || {}).user || null;
  res.json({ user: user });
}

function checkAuthState(req, res, next) {
  // const stateObj = req.app.get(req.query.state||req.body.state);
  // if(!stateObj)
  // const { timestamp, state, ipAddr } = auth || {};
  console.log(
    "Checkauthstate called. checking query and body",
    req.query.state,
    req.body.state
  );
  if (!req.query.state && !req.body.state) {
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON.AUTH.STATE_MISSING,
      path: "query",
    });
    return;
  }
  let state = req.app.get(req.query.state || req.body.state);
  if (!state) {
    console.log(state, req.query.state);
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON.AUTH.STATE_NOT_FOUND,
    });
    return;
  }
  if (state.ipAddr != req.connection.remoteAddress) {
    req.app.set(state.state, undefined);
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON.AUTH.IP_MISMATCH,
    });
    return;
  }
  let currentTimestamp = Date.now();
  if (currentTimestamp > state.timestamp + MAX_ELAPSED_REQUEST_TIME) {
    req.app.set(state.state, undefined);
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON.AUTH.SESSION_EXPIRED,
    });
    // if there is already an auth session
    return;
    // if the user jumps between devices or there is an ip address mismatch, clear session and cookie
  }
  next();
}

function startAuthSession(req, res) {
  // if we already have a session, clear the session
  // and restart it
  const state = crypto.randomBytes(64).toString("base64");
  const stateObj = {
    state,
    timestamp: Date.now(),
    ipAddr: req.connection.remoteAddress,
  };
  req.app.set(state, stateObj);

  res.json(stateObj);
}
module.exports = {
  register,
  logIn,
  logOut,
  getUser,
  startAuthSession,
  checkAuthState,
};
