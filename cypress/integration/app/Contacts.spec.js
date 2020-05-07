const { login } = require("../../fixtures/functions");
const constants = require("../../../src/store/constants");
describe("Contacts App", () => {
  afterEach(() => {
    cy.clearCookies();
  });
  beforeEach(function () {
    cy.server();
    cy.route({ url: "/api/user/clients", response: "fixture:users.json" }).as(
      "getClients"
    );
    cy.request("POST", constants.authApiUrl, (xhr1) => {});
    cy.visit("/#/contacts");
    cy.wait(["@getClients", "@getUser"]);
  });
  it("should work", () => {});
});
