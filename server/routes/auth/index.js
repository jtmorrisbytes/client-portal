// do processing here
const controller = require("../../controllers/auth");
const router = require("express").Router();

router.get("/", controller.getAll);

module.exports = {
  basePath: "/template",
  router,
};
