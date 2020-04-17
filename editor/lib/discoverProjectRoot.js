// this module discovers the
const path = require("path");
const fs = require("fs");

let PROJECT_ROOT = __dirname;
let FILESYSTEM_ROOT = path.resolve(path.sep);
while (
  !fs.existsSync(path.join(PROJECT_ROOT, "package.json")) &&
  PROJECT_ROOT != FILESYSTEM_ROOT
) {
  PROJECT_ROOT = path.dirname(PROJECT_ROOT);
  console.log(PROJECT_ROOT);
}
module.exports = {
  PROJECT_ROOT,
  package: require(path.join(PROJECT_ROOT, "package.json")),
};
