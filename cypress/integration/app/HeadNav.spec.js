const { login, setupApiRoutes } = require("../../fixtures/functions");

before(() => {
  login();
});
describe("Header Navigation", () => {
  beforeEach(() => {
    setupApiRoutes();
    cy.visit("/#/contacts");
    cy.wait("@getUser");
    cy.get("nav#HeadNav").as("HeadNav").should("exist");
  });
  it("should exist after navigating to an app", () => {
    cy.get("@HeadNav").should("exist");
  });
  it("should have a heading called title", () => {
    cy;
  });
});
