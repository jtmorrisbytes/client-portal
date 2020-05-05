/// <reference types="cypress" />
const { user } = require("../../fixtures/constants");
const { fillLoginForm, getLoginInputs } = require("../../fixtures/functions");
before(() => {
  Cypress.Cookies.debug(true);
});
describe("when the user visits the app", () => {
  beforeEach(() => {
    cy.visit("/");
    getLoginInputs();
  });
  it(
    "should alert the user if they havent registered yet" +
      " and allow them to go to the register link with a button",
    () => {
      // cy.contains("Email address");

      cy.get("@emailInput").type("hello" + user.email);
      cy.get("@passwordInput").type(user.password);
      cy.server();
      cy.route("POST", "**/api/auth/login").as("login");
      cy.get("@loginButton").should("have.text", "Log In").click();
      cy.get("@emailInput").should("be.empty");
      cy.get("@login").then((response) => {
        console.log("cypress network request settled", response);
      });
      // it should render an alert box
      cy.get("div[role='alert']")
        .get("button.close[type='button']")
        .wait(800)
        .click();
      cy.get("@registerButton").should("have.text", "Sign Up").click();
      cy.url().should("include", "/register");
    }
  );
  it("should alert the user if they have the incorrect password", () => {
    // cy.contains("Email address");

    cy.get("@emailInput").type("hello" + user.email);
    cy.get("@passwordInput").type(user.password + "NOPE");
    cy.server();
    cy.route("POST", "**/api/auth/login").as("login");
    cy.get("@loginButton").should("have.text", "Log In").click();
    cy.get("@emailInput").should("be.empty");
    cy.wait("@login").then((response) => {
      expect(response.status).to.eq(401);
      console.log("cypress network request settled", response);
    });
  });
  it("Should Successfully log in the user", () => {
    cy.fixture("user").then((user) => {
      fillLoginForm(user);
      cy.get("@loginButton").click();
    });
  });
});
