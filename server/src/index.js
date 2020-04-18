require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const massive = require("massive");
const session = require("express-session");

global.log =
  process.env.NODE_ENV === "production" ? function () {} : console.log;
global.debug =
  process.env.NODE_ENV === "production" ? function () {} : console.debug;
let {
  SERVER_HOST,
  SERVER_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  NODE_ENV,
  SESSION_SECRET,
  SESSION_COOKIE_MAXAGE,
} = process.env;
// if publishing client and server together,
// make sure to include an app.use

const app = express();

// set up express session
const SqLiteStore = require("connect-sqlite3")(session);

app.use(
  session({
    store: new SqLiteStore(),
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      maxAge: SESSION_COOKIE_MAXAGE,
    },
  })
);

if (process.NODE_ENV === "production") {
  app.use(morgan("tiny"));
} else {
  app.use(morgan("dev"));
}
log("loading routes...");
const routes = require("./routes");
debug("Routes module done loading, with result:", routes);
app.use(routes.rootPath, routes.router);

if (/^test/.test(NODE_ENV)) {
  module.exports = app;
} else {
  log("setup complete... attempting to connect to the database...");
  massive({
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    database: DATABASE_NAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    ssl: {
      mode: "require",
      // rejectUnauthorized: false,
      ca: fs.readFileSync("db.ca-certificate.crt"),
    },
  })
    .then((db) => {
      app.set("db", db);
      app.listen(SERVER_PORT, SERVER_HOST, () => {
        log(`SERVER LISTENING on ${SERVER_HOST}:${SERVER_PORT}`);
      });
    })
    .catch((err) => {
      console.error("Database connection failed!", err);
    });
}
