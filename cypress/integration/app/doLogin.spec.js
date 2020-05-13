/// <reference types="cypress" />
const { login, setupApiRoutes } = require("../../fixtures/functions");

describe("Autologin", () => {
  it("should login and visit contacts", () => {
    cy.viewport(480, 720);
    setupApiRoutes();
    Cypress.Cookies.preserveOnce("connect.sid");
    login();
    cy.wait("@getUser");
    cy.visit("/#/contacts/add");
  });
});
