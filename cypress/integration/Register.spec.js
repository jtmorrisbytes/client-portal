describe("The Register component", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("include", "/login");
    cy.get("a.btn[name='register']").click();
    cy.url().should("include", "register");
  });
  it("should have a registration form", () => {
    cy.get("form");
  });
});
