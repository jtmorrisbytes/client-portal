/// <reference types="cypress" />
const { login, setupApiRoutes } = require("../../fixtures/functions");
const constants = require("../../../src/store/constants");
describe("Contacts App", () => {
  afterEach(() => {
    cy.clearCookies();
  });
  beforeEach(function () {
    cy.server();
    setupApiRoutes();
    cy.route({ url: "/api/user/clients", response: "fixture:users.json" }).as(
      "getClientsFixture"
    );
    cy.route({ method: "POST", url: constants.authApiUrl }).as("authRoute");

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
        }).then((xhr2) => {
          cy.visit("/#/contacts");
          console.log(xhr2);
        });
      });
    });

    // cy.visit("/#/contacts");
    cy.wait(["@getClientsFixture", "@getUser", "@getSession"]);
  });
  it("should show the add view when you click on the add button", () => {
    cy.get("button[data-test-id='add-contact']")
      .should("exist")
      .should("have.text", "Add Contact")
      .click();
    cy.hash().should("eq", "#/contacts/add");
    cy.get("button[data-test-id='add-contact']").should("not.exist");
  });
});
