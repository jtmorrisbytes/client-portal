const { login } = require("../../fixtures/functions");
describe("Contacts App", () => {
  beforeEach(function () {
    login();
    cy.visit("/#/contacts");
  });
  it("should work", () => {});
});
