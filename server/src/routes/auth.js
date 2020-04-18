// do processing here
import { logIn, logOut, register } from "../controllers/auth";
// const controller = require("../controllers/auth");
export const router = require("express").Router();
export const basePath = "/auth";
router.post("/register", register);
router.post("/login", logIn);
router.post("/logout", logOut);

export default { router, basePath };
