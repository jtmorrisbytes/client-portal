const express = require("express");
const wellKnown = express.Router();
const basePath = "/.well-known";

wellKnown.get(
  "/acme-challenge/X13PspBp6HEnB4Z0w_4QrYmaJgAB6rT4ipnM5wdRxJ0",
  (req, res) => {
    res.send(
      "X13PspBp6HEnB4Z0w_4QrYmaJgAB6rT4ipnM5wdRxJ0.r1OHXF_2zw9HT48x7f--HmiggPr59Xgya2_U5mG4LZU"
    );
  }
);

module.exports = {
  router: wellKnown,
  basePath,
};
