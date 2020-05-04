///<reference types='cypress' />
const apiUrl = "/api/user";
const loginUrl = "/api/auth/login";
const authUrl = "/api/auth/";
describe("User api", () => {
  it("should return 401 when the user is not logged in", () => {
    cy.request({ url: apiUrl, failOnStatusCode: false }, (xhr) => {
      expect(xhr.status).to.equal(401);
    });
  });
  it("should return the logged in user after logging in", () => {
    cy.fixture("user").then((user) => {
      cy.request(
        {
          url: authUrl,
          method: "POST",
        },
        (xhr1) => {
          expect(xhr1.status).to.eq(200);
          expect(xhr1.response.body).to.not.be.undefined();
        }
      ).then((xhr2) => {
        console.log(xhr2);
        cy.request(
          {
            url: loginUrl,
            method: "POST",
            body: {
              state: xhr2.body.state,
              email: user.email,
              password: user.password,
            },
          },
          (xhr3) => {
            expect(xhr3.status).to.eq(200);
          }
        ).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.id).to.be.greaterThan(0);
          cy.request(apiUrl, (xhr3) => {
            expect(xhr3.status).to.eq(200);
            expect(xhr3.response.body.id).to.be.greaterThan(0);
            expect(xhr3.response.body.firstName).to.eq(user.firstName);
            console.log("currently logged in user");
          });
          // console.log("currently logged in user");
        });
      });
    });
  });
});
