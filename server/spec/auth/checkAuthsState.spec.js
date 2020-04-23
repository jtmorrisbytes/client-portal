// const jasmine = require("jasmine");

let request = require("supertest");
async function startAuthSession(done, callback) {
  let server = await require("../../src/index.js")();
  request(server)
    .post("/api/auth/")
    .expect("Content-Type", /json/)
    .expect(200, (err, res) => {
      if (err) {
        done(err);
        server = null;
      } else {
        expect(res.body).toEqual(jasmine.any(Object));
        expect(res.body.auth).toEqual(jasmine.any(Object));
        const { auth, user } = res.body;
        expect(auth.timestamp).toEqual(jasmine.any(Number));
        expect(auth.timestamp).toBeLessThan(Date.now());
        expect(auth.timestamp).toBeGreaterThan(0);
        expect(auth.state).toBeDefined();
        expect(auth.state).toEqual(jasmine.any(String));
        expect(auth.state.length).toBeGreaterThan(0);
        expect(user).toBeNull();
        if (callback) {
          callback(res, server);
        } else {
          done();
          server = null;
        }
      }
    });
}

describe("When the app tries to authenticate", function () {
  // console.dir(app);
  const testUser = {
    firstName: "Jordan",
    lastName: "Morris",
    address: "123 Software way",
    city: "Silicon Valley",
    state: "California",
    zip: "12345",
    phoneNumber: "1234567890",
  };
  let toShortPassword = "!a3";
  let badPassword = "password";
  let strongPassword = "j}4Sf_td'pQ%";
  it("should be able to POST /", async (done) => {
    startAuthSession(done);
  });
  it("should be able to register after starting an auth session", (done) => {
    startAuthSession(done, (res, serverInst) => {
      request(serverInst)
        .post("/api/auth/register?state=" + res.body.auth.state)
        .expect("Content-Type", /json/)
        .expect(200, (err, registerRes) => {
          if (err) {
            console.log(registerRes.body);
            done(err);
          }
        });
    });
  });
});
