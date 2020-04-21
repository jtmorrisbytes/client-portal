import { MESSAGE_NOT_AUTHORIZED, REASON_LOGIN_REQUIRED } from "../constants";

export function enforceUserLoggedIn(req, res, next) {
  if (!req.session.user) {
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON_LOGIN_REQUIRED,
      path: "/api/auth/login",
    });
  }
}
