describe("The Register component", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("include", "/login");
    cy.location("hash");
    cy.get("a.btn[name='register']").click();
    cy.url().should("include", "register");
    // ensure that login redirected with the state variable
    cy.location("hash").should("include", "?state=");
  });
  it("should have a registration form", () => {
    cy.get("form");
  });
});
