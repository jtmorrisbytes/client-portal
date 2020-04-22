import validateEmail from "../../../lib/validateEmail";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  MESSAGE_NOT_AUTHORIZED,
  REASON,
  MESSAGE_NOT_FOUND,
} from "../../../lib/constants";
export async function register(req, res) {
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

    let hash = null;
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
export function checkAuthState(req, res, next) {
  if (
    req.session?.auth?.timestamp &&
    req.session?.auth?.state &&
    req.session?.auth?.ipAddr
  ) {
    // if there is already an auth session
    next();
  } else if (!req.session?.auth?.state) {
    res.status(400).json({
      message: MESSAGE_BAD_REQUEST,
      reason: REASON.AUTH.STATE_INVALID,
      redirectTo: "/api/auth/",
      redirectMethod: "POST",
    });
  } else if (req.session?.auth?.state && !req.query.state) {
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON.AUTH.STATE_MISSING,
      path: "query",
    });
  } else if (req.session?.auth?.state != req.query.state) {
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON.AUTH.STATE_INVALID,
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
export async function logIn(req, res) {
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
      console.log(result);
      console.log("user found, comparing hash");
    }
  }
}
export async function logOut(req, res) {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.sendStatus(200);
}
export function getUser(req, res) {
  let user = req.session?.user || null;
  res.json({ user: user });
}
export function startAuthSession(req, res) {
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
export default { register, logIn, logOut };
