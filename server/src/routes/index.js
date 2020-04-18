const express = require("express");
const Router = express.Router;
const fs = require("fs");
const path = require("path");
const rootPath = process.env.API_ROOT || "/api";
const routes = Router();

// use this code to dynamically load routers
fs.readdirSync(__dirname).forEach((entry) => {
  if (fs.statSync(path.join(__dirname, entry)).isDirectory()) {
    let module = require(`./${entry}`);
    console.debug(
      `Routes module loading router submodule at '${path.join(
        __dirname,
        entry
      )}' with path ${module.basePath}\n`,
      module.router
    );
    routes.use(module.basePath, module.router);
  }
});
module.exports = {
  rootPath,
  router: routes,
};
