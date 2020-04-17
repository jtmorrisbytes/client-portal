require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const app = express();
const massive = require("massive");
let { SERVER_HOST, SERVER_PORT, DATABASE_URL, NODE_ENV } = process.env;

SERVER_HOST = SERVER_HOST || "127.0.0.1";

// if publishing client and server together,
// make sure to include an app.use

if (process.NODE_ENV === "production") {
  SERVER_PORT = SERVER_PORT || 80;
  app.use(morgan("tiny"));
} else {
  SERVER_PORT = SERVER_PORT || 3001;
  app.use(morgan("dev"));
}

console.debug("loading routes...");
const routes = require("./routes");
console.debug("Routes module done loading, with result:", routes);
app.use(routes.rootPath, routes.router);

if (/^test/.test(NODE_ENV)) {
  module.exports = app;
} else {
  console.log("setup complete... attempting to connect to the database...");
  if (!DATABASE_URL) {
    console.error(
      "ERROR!: DATABASE_URL Must be in envorionment variables... exiting."
    );
    process.exit(-1);
  }
  massive(DATABASE_URL)
    .then((db) => {
      app.listen(SERVER_PORT, SERVER_HOST, () => {
        console.log(`SERVER LISTENING on ${SERVER_HOST}:${SERVER_PORT}`);
      });
    })
    .catch((err) => {
      console.error("Database connection failed!", err);
    });
}
