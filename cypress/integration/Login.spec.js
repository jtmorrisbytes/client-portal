let testUser = {
  email: "johnDoe25@gmail.com",
  password: "@d3!,EQ;+G68;E",
};

describe("when the user visits the app", () => {
  it("should allow them to log in if the user exists", () => {
    cy.visit("/");
    cy.url().should("include", "/login");
    // cy.contains("Email address");

    cy.get("input[type='email'][name='email']")
      .as("emailInput")
      .type(testUser.email);
    cy.get("input[type='password'][name='password']")
      .as("passwordInput")
      .type(testUser.password);
    cy.server();
    cy.route("POST", "**/api/auth/login").as("login");
    cy.get("button[type='submit']").click();
    cy.get("@emailInput").should("be.empty");
    cy.get("@login").then((response) => {
      console.log("cypress network request settled", response);
    });
  });
});
