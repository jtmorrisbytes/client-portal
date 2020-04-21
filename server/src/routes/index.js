import express from "express";
const Router = express.Router;
import fs from "fs";
import path from "path";
export const rootPath = process.env.API_ROOT || "/api";
export const routes = Router();

// require routers
import { enforceUserLoggedIn } from "../controllers/enforceAuth";

function postRequest(req, res) {
  console.log("this function ran after the request finished");
}

import auth from "./auth";

// mount routers
import { enforceClientIdExists } from "../controllers/clientId";
import { MESSAGE_BAD_REQUEST, MESSAGE_NOT_AUTHORIZED } from "../constants";
const { REACT_APP_CLIENT_ID } = process.env;

// verify client id

routes.use(enforceClientIdExists);
routes.post(auth.basePath + "/logout", auth.controller.logOut);
routes.use(auth.basePath, auth.router);
routes.use(enforceUserLoggedIn);
// finalize the request

export default { router: routes, rootPath };
