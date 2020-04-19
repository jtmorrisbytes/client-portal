import express from "express";
const Router = express.Router;
import fs from "fs";
import path from "path";
export const rootPath = process.env.API_ROOT || "/api";
export const routes = Router();

// require routers
import auth from "./auth";
// mount routers
routes.get("/", (req, res) => {
  res.send("ok");
});
routes.use(auth.basePath, auth.router);
export default { router: routes, rootPath };
