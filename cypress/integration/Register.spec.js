describe("The Register component", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("include", "/login");
    cy.location("hash");
    cy.get("a.btn[name='register']").click();
    cy.url().should("include", "register");
    // ensure that login redirected with the state variable
    cy.location("hash").should("include", "?state=");
    cy.get("form[name='register']").as("register");
    cy.get("@register").get("input[id='email'][type='email']").as("email");

    //password
    cy.get("@register")
      .get("input[id='password'][type='password']")
      .as("password");
    cy.get("@register")
      .get("input[id='confirmPassword'][type='password']")
      .as("confirmPassword");
    // street address input
    cy.get("@register")
      .get("input[id='streetAddress'][name='address']")
      .as("address");
    // city input
    cy.get("@register").get("input[id='city'][name='city']").as("city");
    // state input
    cy.get("@register").get("input[id='state'][name=state]").as("state");
    cy.get("@register").get("input[id='zip'][name=zip]").as("zip");
    cy.get("@register")
      .get("button[type='submit'][name='register']")
      .as("registerButton");
  });
  it("should have the correct labels and label text", () => {
    cy.get("@register")
      .get("label[for='email']")
      .should("have.text", "Email Address");
    //email

    // password label
    cy.get("@register")
      .get("label[for='password']")
      .should("have.text", "Password");

    // password conformation
    cy.get("@register")
      .get("label[for='confirmPassword']")
      .should("have.text", "Confirm Password");
    //street address Label
    cy.get("@register")
      .get("label[for='streetAddress']")
      .should("have.text", "Street Address");
    // city label
    cy.get("@register").get("label[for='city']").should("have.text", "City");
    cy.get("@register").get("label[for='state']").should("have.text", "State");
    cy.get("@register").get("label[for='zip']").should("have.text", "Zip");
    cy.get("@registerButton")
      .should("have.text", "Register")
      .should("be.disabled");
  });
});
