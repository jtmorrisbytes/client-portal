import express from "express";
const Router = express.Router;
import fs from "fs";
import path from "path";
export const rootPath = process.env.API_ROOT || "/api";
export const routes = Router();

// require routers
import auth from "./auth";
import timestamp from "../controllers/timestamp";
// mount routers

import { MESSAGE_BAD_REQUEST, MESSAGE_NOT_AUTHORIZED } from "../constants";
const { REACT_APP_CLIENT_ID } = process.env;

// verify client id

routes.use((req, res, next) => {
  if (!req.query.clientid) {
    res.status(400).json({
      message: MESSAGE_BAD_REQUEST,
      reason: "MISSING_CLIENT_ID",
      location: "query",
    });
  } else if (req.query.clientid != REACT_APP_CLIENT_ID) {
    res
      .status(401)
      .json({ message: notAuthorizedMessage, reason: "INVALID_CLIENT_ID" });
    return;
  } else {
    next();
  }
});
routes.use(auth.basePath, auth.router);
// enforce that the time stamp exists at this point
routes.use(timestamp.enforceTimeStampExists);

// finalize the request
routes.use((req, res) => {
  if (!req.locals.status) {
    res.status(404).json({ message: "path not Found" });
  } else {
    req.session = req.locals.session || req.session;
    res.body = req.locals.body || {};
    res.body.session = req.session;
    res.status(req.locals.status).json(res.body);
  }
});
export default { router: routes, rootPath };
