// do processing here
import { logIn, logOut, register } from "../controllers/auth";
// const controller = require("../controllers/auth");
export const router = require("express").Router();
export const basePath = "/auth";

// create a session

function checkTimeStamp(req, res, next) {
  if (!req.session.timestamp) {
    res.send(401).json({ message: "You must GET /auth first" });
  }
}

router.get("/", (req, res, next) => {
  let currentTimestamp = Date.now();
  if (!req.session.timestamp) {
    req.session.destroy();
    req.session.user = { email: "" };

    req.session.firstTimestamp = currentTimestamp;
    req.session.timestamp = currentTimestamp;
  }
  res.status(200).json({ session: req.session });
});
router.use(checkTimeStamp);
router.post("/", (req, res) => {
  req.locals.status = 200;
  req.locals.body = req.locals.body || {};
  req.locals.body.message = "ok";
});
router.post("/register", register);
router.post("/login", logIn);
router.post("/logout", logOut);

export default { router, basePath };
