// do processing here
import { logIn, logOut, register } from "../controllers/auth";
// const controller = require("../controllers/auth");
import { MAX_ELAPSED_REQUEST_TIME } from "../constants";
export const router = require("express").Router();
export const basePath = "/auth";

// create a session

function checkTimeStamp(req, res, next) {
  if (!req.session.timestamp) {
    res.status(401).json({ message: "You must POST /api/auth first" });
  } else {
    next();
  }
}

router.get("/", (req, res, next) => {
  let currentTimestamp = Date.now();
  if (!req.session.firstTimestamp) {
    // req.session.destroy();
    console.log("timestamp was not found on session");
    req.session.user = { email: "" };
    req.session.firstTimeStamp = currentTimestamp;
    req.session.timestamp = currentTimestamp;
  }
  req.session.timestamp = currentTimestamp;
  req.session.expires =
    MAX_ELAPSED_REQUEST_TIME + req.session.firstTimestamp - currentTimestamp;
  res.status(200).json({ session: req.session });
  next();
});
// router.use(checkTimeStamp);
router.post("/", (req, res) => {
  req.session.timestamp = Date.now();
  res.json(req.session);
});
router.post("/register", register);
router.post("/login", logIn);
// router.post("/logout", logOut);

export default { router, basePath, controller: { logIn, logOut, register } };
