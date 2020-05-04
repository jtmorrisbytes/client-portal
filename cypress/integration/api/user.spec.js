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
        (xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.response.body).to.not.be.undefined();
          cy.request(
            {
              url: loginUrl,
              body: {
                state: xhr.response.body.state,
                email: user.email,
                password: user.password,
              },
            },
            (xhr) => {
              expect(xhr.status).to.eq(200);
              cy.request(apiUrl, (xhr) => {
                expect(xhr.status).to.eq(200);
                expect(xhr.response.body.id).to.be.greaterThan(0);
                console.log("currently logged in user");
              });
            }
          );
        }
      );
    });
  });
});
