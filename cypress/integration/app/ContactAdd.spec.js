const constants = require("../../../src/store/constants");
describe("ContactAddComponent", () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("connect.sid");
    cy.server();
    cy.fixture("user").as("User");
    cy.request("POST", constants.authApiUrl).then((xhr1) => {
      let body = xhr1.body;
      cy.get("@User").then((user) => {
        return cy.request({
          method: "POST",
          url: constants.loginApiUrl,
          body: {
            state: body.state,
            email: user.email,
            password: user.password,
          },
        });
      });
      cy.visit("#/contacts/add");
    });
  });
  it("should work", () => {});
});
