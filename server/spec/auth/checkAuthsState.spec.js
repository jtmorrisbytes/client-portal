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
        // expect(res.body.auth).toEqual(jasmine.any(Object));
        const { state, timestamp, ipAddr } = res.body;
        expect(timestamp).toEqual(jasmine.any(Number));
        expect(timestamp).toBeLessThan(Date.now());
        expect(timestamp).toBeGreaterThan(0);
        expect(state).toBeDefined();
        expect(state).toEqual(jasmine.any(String));
        expect(state.length).toBeGreaterThan(0);
        if (callback) {
          callback(server, state, timestamp, ipAddr);
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
    email: `johnDoe${Math.floor(Math.random() * 10000)}@gmail.com`,
    address: "123 Software way",
    city: "Silicon Valley",
    state: "California",
    zip: "12345",
    phoneNumber: "1234567890",
  };
  let toShortPassword = "!a3";
  let badPassword = "password";
  let strongPassword = "j}4Sf_td'pQ%";
  let testSessionID = null;
  it("should be able to POST /", async (done) => {
    startAuthSession(done);
  });
  it("should be able to register after starting an auth session", (done) => {
    startAuthSession(done, (serverInst, state, timestamp, ipAddr) => {
      request(serverInst)
        .post("/api/auth/register")
        .send({ state, user: { ...testUser, password: strongPassword } })
        .expect("Content-Type", /json/)
        .expect(200, (err, registerRes) => {
          if (err) {
            console.log(registerRes.body);
            expect(registerRes.body).toBeDefined(
              "The server should send an error response object in the body"
            );
            expect(registerRes.body.message).toBeDefined(
              "The server should respond with a message detailing the response"
            );
            expect(registerRes.body.message).toEqual(jasmine.any(String));
            expect(registerRes.body.reason).toBeDefined(
              "The server should reply with the appropriate constant to associate with the event"
            );
            expect(registerRes.body.reason).toEqual(jasmine.any(String));
            done(err);
          } else {
            expect(registerRes.body).toBeDefined(
              "The server should respond with an object in the body"
            );
            expect(registerRes.body).toEqual(jasmine.any(Object));
            const body = registerRes.body;
            expect(body.session).toBeDefined(
              "The server should respond with a property called session inside of body"
            );
            expect(body.session).toEqual(jasmine.any(Object));
            expect(body.session.sessionID).toBeDefined(
              "The server should respond with property session ID on body.session"
            );
            done(err);
          }
        });
    });
  });
});
