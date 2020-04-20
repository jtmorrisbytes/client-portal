const brycpt = require("bcryptjs");
const readline = require("readline");
const crypto = require("crypto");
const tar = require("tar");
rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const fs = require("fs");
// First, create a stream which will read the init vect from the file.
const readIv = fs.createReadStream("dist.aes", { end: 15 });
// Then, wait to get the initVect.
let initVect;
readIv.on("data", (chunk) => {
  initVect = chunk;
});
// Once we’ve got the initialization vector, we can decrypt
// the file.
readIv.on("close", () => {
  rl.question(
    "Please enter the password used to encrypt your software",
    (answer) => {
      if (!answer) {
        console.error("password is required");
        process.exit(-1);
      }
      console.log("starting decryption");
      const KEY = crypto
        .createHash("sha256")
        .update(answer || process.env.PASSWORD)
        .digest();
      rl.close();
      const decypher = crypto.createDecipheriv("aes-256-gcm", KEY, initVect);
      fs.createReadStream("dist.aes", { start: 16 })
        .pipe(decypher)
        .pipe(fs.createWriteStream("dist.tgz"));
      tar.x({ file: "dist.tgz" }, (err) => {
        console.error(err);
      });
    }
  );
});
// let authorized = await bcrypt.compare(
//   "fj59y#25!%25125^2345!$%@#$%@^",
//   "$2b$15$uKUKOwIx3IDh9sV4gp4KL.TsfzHZjGu7Y.a0YLiyodPsl2PMyzQpO"
// );
// if(!authorized){
//   console.error("you are not authorized to run this server")
// }
// else
