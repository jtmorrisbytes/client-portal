const constants = require("../../../src/store/constants");
describe("ContactAddEditComponent", () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("connect.sid");
    cy.server();
    cy.fixture("user").as("User");
    cy.request("POST", constants.authApiUrl).then((xhr1) => {
      console.log("BEFOREEACH START AUTH SESSION");
      console.log("BEFOREEACH RESPONSE OBJECT", xhr1);
      let body = xhr1.body;
      cy.get("@User").then((user) => {
        cy.request({
          method: "POST",
          url: constants.loginApiUrl,
          body: {
            state: body.state,
            email: user.email,
            password: user.password,
          },
        });
      });
    });
  });
  it("should be able to add a new contact", () => {
    cy.route({
      method: "POST",
      url: constants.contactsApiUrl,
      status: 401,
    });
    cy.visit("#/contacts/add");
    cy.get("[data-test-id='save-changes']").click();
  });
});
