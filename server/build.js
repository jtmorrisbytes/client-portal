const path = require("path");
const fs = require("fs");
const tar = require("tar");
const readline = require("readline");
const crypto = require("crypto");
const { Transform } = require("stream");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class AppendInitVect extends Transform {
  constructor(initVect, opts) {
    super(opts);
    this.initVect = initVect;
    this.appended = false;
  }

  _transform(chunk, encoding, cb) {
    if (!this.appended) {
      this.push(this.initVect);
      this.appended = true;
    }
    this.push(chunk);
    cb();
  }
}

/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 * @author https://stackoverflow.com/a/22185855/7933259
 */

function copyRecursiveSync(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest); // UPDATE FROM:    fs.linkSync(src, dest);
  }
}
try {
  fs.rmdirSync("dist", { recursive: true });
  fs.rmdirSync("out", { recursive: true });
  fs.unlinkSync("dist.aes");
} catch (e) {}
try {
  fs.mkdirSync("dist");
} catch (e) {}
let directories = ["db"];
let files = ["package.json", "package-lock.json"];
let srcDir = path.resolve("src");
let distDir = path.resolve("dist");
for (directory in directories) {
  copyRecursiveSync(
    path.join(srcDir, directories[directory]),
    path.join(distDir, directories[directory])
  );
}
for (file in files) {
  fs.copyFileSync(
    path.join(srcDir, files[file]),
    path.join(distDir, files[file])
  );
}

rl.question(
  "Please enter the password that you want to use to secure the app",
  (answer) => {
    if (answer.length === 0 && !process.env.PASSWORD) {
      console.error("cannot proceed without a password");
      process.exit(0);
    }
    require("webpack")(require("./webpack.config.js"), (err, status) => {
      if (err || status.hasErrors()) {
        console.error(err);
        process.exit();
      }
      fs.mkdirSync("out");
      tar.c({ gzip: true, file: "out/dist.tgz" }, [distDir], (err) => {
        if (err) {
          console.error(err);
        } else {
          fs.rmdirSync("dist", { recursive: true });
          const readStream = fs.createReadStream("out/dist.tgz");
          const writeStream = fs.createWriteStream("dist.aes");
          const initVect = crypto.randomBytes(16);
          const KEY = crypto
            .createHash("sha256")
            .update(answer || process.env.PASSWORD)
            .digest();
          const cipher = crypto.createCipheriv("aes-256-gcm", KEY, initVect);
          const appendinitVect = new AppendInitVect(initVect);
          readStream.pipe(appendinitVect).pipe(writeStream);
          fs.rmdirSync("out", { recursive: true });
        }
      });
    });
    rl.close();
  }
);
