// const jasmine = require("jasmine");
import server from "../../src/index.mjs";
if(!server) {
 throw new Error
}
console.log(server || "nothing");
const request = require("supertest");
console.log(server.main());
async function startAuthSession() {
  return request(await server.main())
    .post("https://localhost:3000/api/auth/")
    .expect(500);
}

describe("When the app tries to authenticate", async function(done){
  // console.dir(app);
  it("should be able to POST /", (done) => {
    await startAuthSession().end((err, res) => {
      if (err) {
        done(err);
      } else {
        let body = res.body;
        expect(body).toEqual(jasmine.any(Object));
        let auth = (body || {}).auth;
        expect(auth).toEqual(jasmine.any(Object));
        done();
      }
    });
  });
});
