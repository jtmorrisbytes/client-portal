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
    cy.get("form[name='register']").as("register");
    cy.get("@register")
      .get("label[for='email']")
      .should("have.text", "Email Address");
    //email
    cy.get("@register").get("input[name='email'][type='email']").as("email");
    // password
    cy.get("label[for='password']").should("have.text", "Password");
    cy.get("input[name='password'][type='password']").as("password");
    // password conformation
    cy.get("label[for='confirmPassword']").should(
      "have.text",
      "Confirm Password"
    );
  });
});
