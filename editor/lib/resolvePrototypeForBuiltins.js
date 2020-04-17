// this module takes functions from a directory and injects them into a object called 'prototype'
const path = require("path");
const fs = require("fs");
module.exports = function resolvePrototypeForBuiltins(schema) {
  console.log(
    "attempting to resolve extra prototype functions placed in the builtins directory"
  );
  const prototypeDir = path.resolve(
    path.join("lib", "types", "builtins", schema.name)
  );
  try {
    let prototypeFuncs = fs.readdirSync(prototypeDir);
    prototypeFuncs = prototypeFuncs.filter((path) => {
      return !path.endsWith("index.js");
    });
    prototypeFuncs = prototypeFuncs.forEach((funcPath) => {
      let func = require(path.join(prototypeDir, funcPath));
      schema.prototype[funcPath.replace(".js", "")] = func;
    });
    console.log("found prototype functions for " + schema.name, prototypeFuncs);
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log(
        "no extra prototype functions were found for " +
          schema.name +
          " at " +
          prototypeDir
      );
    } else {
      console.error(e);
    }
  }
  console.log("");
  return schema;
};
