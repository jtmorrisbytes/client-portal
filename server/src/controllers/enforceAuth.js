import { REASON, MESSAGE_NOT_AUTHORIZED } from "../../../lib/constants.mjs";
export function enforceUserLoggedIn(req, res, next) {
  if (!req.session.user) {
    res.status(401).json({
      message: MESSAGE_NOT_AUTHORIZED,
      reason: REASON.LOGIN.REQUIRED,
      path: "/api/auth/login",
    });
  }
}
