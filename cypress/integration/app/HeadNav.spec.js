/// <reference types="cypress" />
const { login, setupApiRoutes } = require("../../fixtures/functions");

describe("Header Navigation", () => {
  beforeEach(() => {
    cy.viewport(480, 1080);
    setupApiRoutes();
    cy.clearCookie("connect.sid");
    Cypress.Cookies.preserveOnce("connect.sid");
    login();
    cy.visit("/#/contacts");
    cy.wait("@getUser");
    cy.get("nav#HeadNav").as("HeadNav").should("exist");
  });
  it("should exist after navigating to an app", () => {
    cy.get("@HeadNav").should("exist");
  });
  it("should have a heading called title", () => {
    cy.get("@HeadNav").should("contain", "Contacts");
  });
});
