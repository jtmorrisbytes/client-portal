const crypto = require("crypto");
const redis = require("redis");
const equal = require("deep-equal");
const defaultConfig = {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
  session: {
    maxAge: 1000 * 60 * 3,
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
  function hash(object) {
    return crypto
      .createHash("sha1")
      .update(JSON.stringify(object))
      .digest("hex");
  }
  return async function SessionHandler(req, res, next) {
    let sessionID =
      req.query.sessionID ||
      req.body.sessionID ||
      crypto.randomBytes(32).toString("base64");
    let updateRedisSession = function updateRedisSession() {
      console.log("update redis session requested", sessionID);

      if (req.session) {
        console.log("redis session object after close", req.session);
        let oldHash = req.app.get(sessionID);
        let newHash = hash(req.session);

        console.log("hash compare old, new", oldHash, newHash);
        if (oldHash !== newHash) {
          this.client.set(
            sessionID,
            JSON.stringify(req.session),
            "EX",
            this.sessionConfig.maxAge,
            (err, reply) => {
              if (err) {
                console.error(
                  `an error occurred while updating a redis session ID beginning with ${sessionID.substring(
                    0,
                    5,
                    err
                  )}`
                );
              } else {
                console.log(
                  "successfully updated session, redis replied ",
                  reply
                );

                req.app.set(sessionID, newHash);
              }
            }
          );
        }
      }
    }.bind(this);
    function destroy() {
      if (sessionID) {
        req.app.set(sessionID, undefined);
        this.client.del(sessionID, (err, reply) => {
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
    this.client.get(sessionID.toString(), (err, reply) => {
      if (err) {
        next(err);
      } else if (reply === null) {
        req.session = {
          session: {
            sessionID: this.sessionConfig.prefix + sessionID,
            timestamp: Date.now(),
          },
        };
        req.app.set(sessionID, hash(req.session));
        next();
      } else {
        req.session = JSON.parse(reply);
        next();
      }
    });
    res.on("finish", updateRedisSession);
    res.on("close", updateRedisSession);
    console.log("redis session handler called");
  }.bind(this);
}

module.exports = RedisSession;
