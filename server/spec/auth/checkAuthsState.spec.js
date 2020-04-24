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
        console.error("an error occurred while registering", err);
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
function expectErrorMessages(res) {
  console.log(res.body);
  expect(res.body).toBeDefined(
    "The server should send an error response object in the body"
  );
  expect(res.body.message).toBeDefined(
    "The server should respond with a message detailing the response"
  );
  expect(res.body.message).toEqual(jasmine.any(String));
  expect(res.body.reason).toBeDefined(
    "The server should reply with the appropriate constant associated with the event"
  );
  expect(res.body.reason).toEqual(jasmine.any(String));
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
        .send({
          state,
          user: { ...testUser, password: strongPassword },
        })
        .expect("Content-Type", /json/)
        .expect(200, (err, registerRes) => {
          if (err) {
            expectErrorMessages(registerRes);
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
            const { session } = body;
            expect(session.sessionID).toBeDefined(
              "The server should respond with property session ID on body.session"
            );
            const { user } = body;
            expect(user).toBeDefined();
            expect(user.id).toBeDefined();
            expect(user.id).toBeGreaterThanOrEqual(0);

            done(err);
          }
        });
    });
  });
  it("should let the user log in", (done) => {
    startAuthSession(done, (server, state, timestamp, ipAddr) => {
      request(server)
        .post("/api/auth/login")
        .send({
          state,
          user: { email: testUser.email, password: strongPassword },
        })
        .expect(200, (err, res) => {
          if (err) {
            console.error("an error occurred while trying to log in", err);
            expectErrorMessages(res);
            done(err);
          } else {
            expect(res.body).toBeDefined(
              "The server should respond with an object in the body"
            );
            expect(res.body).toEqual(jasmine.any(Object));
            expect(res.body.session).toBeDefined(
              "The server should respond with property session in the body"
            );
            expect(res.body.session).toEqual(jasmine.any(Object));
            let user = ((res.body || {}).session || {}).user;

            expect(user).toBeDefined(
              "The sever should respond with property user in session"
            );
            expect(user).toEqual(jasmine.any(String));
          }
        });
    });
  });
});
