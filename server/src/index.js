require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const massive = require("massive");
const session = require("express-session");

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
console.log("require.main.filename", require?.main?.filename);

app.use(
  session({
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
console.debug("loading routes...");
const routes = require("./routes");
console.debug("Routes module done loading, with result:", routes);
app.use(routes.rootPath, routes.router);

if (/^test/.test(NODE_ENV)) {
  module.exports = app;
} else {
  console.log("setup complete... attempting to connect to the database...");
  massive({
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    database: DATABASE_NAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    ssl: "require",
    rejectUnauthorized: false,
  })
    .then((db) => {
      app.listen(SERVER_PORT, SERVER_HOST, () => {
        console.log(`SERVER LISTENING on ${SERVER_HOST}:${SERVER_PORT}`);
      });
    })
    .catch((err) => {
      console.error("Database connection failed!", err);
    });
}
