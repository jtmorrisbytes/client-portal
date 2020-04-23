// const jasmine = require("jasmine");
const server = require("../../src/index.js");
if (!server) {
  throw new Error();
}
console.log(server || "nothing");
const request = require("supertest");
async function startAuthSession(done, callback) {
  request(await server())
    .post("/api/auth/")
    .expect("Content-Type", /json/)
    .expect(200, (err, res) => {
      if (err) {
        done(err);
      } else {
        expect(res.body).toEqual(jasmine.any(Object));
        expect(res.body.auth).toEqual(jasmine.any(Object));
        const { auth } = res.body;
        expect(auth.timestamp).toEqual(jasmine.any(Number));
        expect(auth.timestamp).toBeLessThan(Date.now());
        expect(auth.timestamp).toBeGreaterThan(0);
        expect(auth.state).toBeDefined();
        expect(auth.state).toEqual(jasmine.any(String));
        callback(res);
      }
    });
}

describe("When the app tries to authenticate", function () {
  // console.dir(app);
  it("should be able to POST /", async (done) => {
    startAuthSession(done, (res) => {
      done();
    });
  });
});
