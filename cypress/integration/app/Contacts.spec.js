const { login } = require("../../fixtures/functions");
describe("Contacts App", () => {
  afterEach(() => {
    cy.clearCookies();
  });
  beforeEach(function () {
    cy.server();
    cy.route({ url: "/api/user/clients", response: "fixture:users.json" }).as(
      "getClients"
    );
    login();
    cy.visit("/#/contacts");
    cy.wait(["@getClients", "@getUser"]);
  });
  it("should work", () => {
    cy.racee;
  });
});
