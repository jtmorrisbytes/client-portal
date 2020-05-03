const { nonExistantUser } = require("../fixtures/constants");
describe("when the user visits the app", () => {
  it(
    "should alert the user if they havent registered yet" +
      " and allow them to go to the register link with a button",
    () => {
      cy.visit("/");
      cy.url().should("include", "/login");
      // cy.contains("Email address");

      cy.get("input[type='email'][name='email']")
        .as("emailInput")
        .type(nonExistantUser.email);
      cy.get("input[type='password'][name='password']")
        .as("passwordInput")
        .type(nonExistantUser.password);
      cy.server();
      cy.route("POST", "**/api/auth/login").as("login");
      cy.get("button[type='submit'][name='login']")
        .as("loginButton")
        .should("have.text", "Log In")
        .click();
      cy.get("@emailInput").should("be.empty");
      cy.get("@login").then((response) => {
        console.log("cypress network request settled", response);
      });
      // it should render an alert box
      cy.get("div[role='alert']")
        .get("button.close[type='button']")
        .wait(800)
        .click();
      cy.get("a.btn[name='register']").should("have.text", "Sign Up").click();
      cy.url().should("include", "/register");
    }
  );
});
