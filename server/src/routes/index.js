const express = require("express");
const Router = express.Router;
const fs = require("fs");
const path = require("path");
const rootPath = process.env.API_ROOT || "/api";
const routes = Router();

// require routers
const auth = require("./auth");

// mount routers
routes.use(auth.basePath, auth.router);
module.exports = {
  rootPath,
  router: routes,
};
