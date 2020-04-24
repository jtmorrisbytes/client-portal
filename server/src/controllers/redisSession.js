const crypto = require("crypto");
const redis = require("redis");
const equal = require("deep-equal");
const util = require("util");
const defaultConfig = {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
  session: {
    maxAge: 60 * 3,
    prefix: "sess",
  },
};

function RedisSession(config) {
  console.log("redis session initialized with config", config);
  config = config || defaultConfig;
  console.log("config defaulted to ", config);
  this.sessionConfig = config.session;
  this.redisConfig = config.redis;
  this.client = redis.createClient(this.redisConfig);

  //create the client
  // this.session = new Session(this.client);
  // console.log("closure creator recieved client", client);
  this.set = util.promisify(this.client.set).bind(this.client);
  this.del = util.promisify(this.client.del).bind(this.client);
  this.get = util.promisify(this.client.get).bind(this.client);

  function hash(object) {
    return crypto
      .createHash("sha1")
      .update(JSON.stringify(object))
      .digest("hex");
  }
  return (function (_this) {
    return function SessionHandler(req, res, next) {
      let sessionID = req.query.sessionID || req.body.sessionID;
      let update = async function update() {
        console.log("update redis session requested", sessionID);
        if (req.session) {
          console.log("redis session object after close", req.session);
          let oldHash = req.app.get(sessionID);
          let newHash = hash(req.session);
          console.log("hash compare old, new", oldHash, newHash);
          if (oldHash !== newHash) {
            let reply = await _this.set(
              sessionID,
              JSON.stringify(req.session),
              "EX",
              _this.sessionConfig.maxAge
            );
            if (reply === "OK") {
              console.log("successfully updated session with id", sessionID);
            } else {
              console.warn(
                "A potential error occurred when updating the session",
                reply
              );
            }
          }
        }
      };
      async function destroy() {
        if (sessionID) {
          req.app.set(sessionID, undefined);
          _this.client.del(sessionID, (err, reply) => {
            if (err) {
              console.error("an error occurred deleting a session", err);
            } else if (reply === "OK") {
              console.log(
                "sucessfully updated session beginning with " +
                  sessionID.substring(0, 5)
              );
              req.session = null;
              sessionID = null;
            }
          });
        }
      }
      if (sessionID) {
        _this.client.get(sessionID.toString(), (err, reply) => {
          if (err) {
            next(err);
          } else if (reply === null) {
            // res.removeListener("finish", (_this, sessionID, req) => () =>
            //   update(_this, sessionID, req)
            // );
            // res.removeListener("close", update.bind(_this, sessionID, req));
            res.status(400).json({ message: "Session ID does not exist" });
            return;
          } else {
            try {
              req.session = JSON.parse(reply);
              next();
            } catch (e) {
              console.warn(
                "Something went wrong while performing the initial session ID Lookup"
              );
              res.removeListener("finish", update);
              res.removeListener("close", update);
              res
                .status(500)
                .json({ message: "Initial session lookup failed", reply });
            }
          }
        });
      } else {
        sessionID = crypto.randomBytes(32).toString("base64");
        req.session = {
          session: {
            sessionID,
            destroy,
            update,
          },
        };
        req.app.set(sessionID, hash(JSON.stringify(req.session)));
        next();
      }
      console.log("redis session handler called");
      res.on("finish", update);
    };
  })(this);
}
module.exports = RedisSession;
