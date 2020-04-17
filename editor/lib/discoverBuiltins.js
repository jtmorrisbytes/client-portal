const fs = require("fs");
const path = require("path");
module.exports = function (projectRoot) {
  const builtinsRoot = path.join(projectRoot, "components", "builtins");
  const dirs = fs.readdirSync(builtinsRoot);
  dirs.filter((dir) => {
    return fs.statSync(path.join(builtinsRoot, dir)).isDirectory();
  });
  const componentListing = dirs.map((dir) => {
    return fs.readdirSync(path.join(builtinsRoot, dir));
  });
  console.log(componentListing);
};
