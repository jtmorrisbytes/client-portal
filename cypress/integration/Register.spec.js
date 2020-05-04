///<reference types="chai" />

const EmailErrors = require("@jtmorrisbytes/lib/Email/Errors");

function fillRegistrationForm(fixture, random) {
  let email = fixture.email;
  if (random === true) {
    email = String(Math.floor(Math.random() * 9999)) + email;
  }
  cy.get("@firstName").type(fixture.firstName);
  cy.get("@lastName").type(fixture.lastName);
  cy.get("@email").type(email);
  cy.get("@password").type(fixture.password);
  cy.get("@confirmPassword").type(fixture.password);
  cy.get("@phone").type(fixture.phone);
  cy.get("@registerButton").should("be.enabled");
  cy.get("@address").type(fixture.streetAddress);
  cy.get("@city").type(fixture.city);
  cy.get("@state").type(fixture.state);
  cy.get("@zip").type(fixture.zip);
  cy.server();
  cy.route("POST", "/api/auth/register?test=true").as("requestRegister");
}
function getRegInputs() {
  cy.get("form[name='register']").as("register");
  cy.get("@register").get("input[id='email'][type='email']").as("email");
  //first name
  cy.get("@register").get("input[id='firstName']").as("firstName");
  cy.get("@register").get("input[id='lastName']").as("lastName");
  //password
  cy.get("@register")
    .get("input[id='password'][type='password']")
    .as("password");
  cy.get("@register")
    .get("input[id='confirmPassword'][type='password']")
    .as("confirmPassword");

  //phone number
  cy.get("@register").get("input[id='phone'][type='tel']").as("phone");

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
}

describe("The Register component", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("include", "/login");
    cy.get("a.btn[name='register']").click();
    cy.url().should("include", "register");
    // ensure that login redirected with the state variable
    cy.location("hash").should("include", "?state=");
    getRegInputs();
  });
  it("should have the correct labels and label text", () => {
    //firstName
    cy.get("@register")
      .get("label[for='firstName']")
      .should("have.text", "First Name");
    // last Name
    cy.get("@register")
      .get("label[for='lastName']")
      .should("have.text", "Last Name");
    // Email Address
    cy.get("@register")
      .get("label[for='email']")
      .should("have.text", "Email Address");
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
      .get("label[for='phone']")
      .should("have.text", "Phone Number");
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
  it("should allow all fields to by typed into", () => {
    cy.fixture("nonExistantUser").then((user) => {
      cy.get("@firstName")
        .type(user.firstName)
        .should("have.value", user.firstName);
      cy.get("@lastName")
        .type(user.lastName)
        .should("have.value", user.lastName);
      cy.get("@email").type(user.email).should("have.value", user.email);
      cy.get("@password")
        .type(user.password)
        .should("have.value", user.password);
      cy.get("@confirmPassword")
        .type(user.password)
        .should("have.value", user.password);
      cy.get("@phone").type(user.phone).should("have.value", user.phone);
      cy.get("@address")
        .type(user.streetAddress)
        .should("have.value", user.streetAddress);
      cy.get("@city").type(user.city).should("have.value", user.city);
      cy.get("@state").type(user.state).should("have.value", user.state);
      cy.get("@zip").type(user.zip).should("have.value", String(user.zip));
    });
  });
  it("should validate the email address on the client", () => {
    cy.fixture("nonExistantUser").then((user) => {
      console.log("chai user", user);
      cy.get("@email").type(user.badEmailNoAt);
      cy.get("#email-invalid.text-danger").should(
        "have.text",
        EmailErrors.EInvalid.MESSAGE
      );
      cy.get("@email").clear();
      cy.get("#email-invalid.text-danger").should("exist");
      cy.get("@email").type(user.badEmailNoDomain);
      cy.get("#email-invalid.text-danger").should("exist");
      cy.get("@email").clear().type(user.email);
      cy.get("#email-invalid.text-danger").should("not.exist");
    });
  });
  it("should validate passwords on the client", () => {
    cy.fixture("nonExistantUser").then((user) => {
      cy.get("@password").type(user.badPassword);
      cy.get("#password-invalid.text-danger").should("exist");
      cy.get("@password").clear();
      cy.get("#password-invalid.text-danger").should("exist");
      cy.get("@password").type(user.longPassword);
      cy.get("#password-invalid.text-danger").should("exist");
      cy.get("@password").clear().type(user.password);
      cy.get("#password-invalid.text-danger").should("not.exist");
    });
  });
  it("should require the user to confirm their password", () => {
    cy.fixture("nonExistantUser").then((user) => {
      cy.get("@password").type(user.password);
      cy.get("#password-no-match.form-text.text-danger")
        .should("exist")
        .should("have.text", "Passwords do not match");
      cy.get("@confirmPassword").type(user.password);
      cy.get("#password-no-match.form-text.text-danger").should("not.exist");
    });
  });
  it("should require user to enter their phone number", () => {
    cy.fixture("nonExistantUser").then((user) => {
      cy.get("#phone-too-short.form-text.text-danger")
        .should("exist")
        .should("have.text", "Phone Number is too short");
      cy.get("@phone").type(user.phone);
      cy.get("#phone-too-short.form-text.text-danger").should("not.exist");
    });
  });
  it("should enable the registration button after all required fields are entered", () => {
    cy.fixture("nonExistantUser").then((user) => {
      cy.get("@email").type(user.email);
      cy.get("@password").type(user.password);
      cy.get("@confirmPassword").type(user.password);
      cy.get("@phone").type(user.phone);
      cy.get("@registerButton").should("be.enabled");
    });
  });
  it("should sucessfully register the user", () => {
    cy.server();
    cy.route("POST", "/api/auth/register?test=true").as("requestRegister");
    cy.fixture("nonExistantUser").then((user) => {
      let randomEmail = String(Math.floor(Math.random() * 9999)) + user.email;
      cy.get("@firstName").type(user.firstName);
      cy.get("@lastName").type(user.lastName);
      cy.get("@email").type(randomEmail);
      cy.get("@password").type(user.password);
      cy.get("@confirmPassword").type(user.password);
      cy.get("@phone").type(user.phone);
      cy.get("@registerButton").should("be.enabled");
      cy.get("@address").type(user.streetAddress);
      cy.get("@city").type(user.city);
      cy.get("@state").type(user.state);
      cy.get("@zip").type(user.zip);
      cy.get("@registerButton").click();
      cy.get("@registerButton").should("be.disabled");
      cy.wait("@requestRegister").then((xhr) => {
        console.log(xhr);
        expect(xhr.status).to.equal(
          200,
          "The server should respond with a successful status"
        );
        let sess = xhr.response.body;
        expect(sess.user.id).to.be.greaterThan(0);
        expect(sess.user.firstName).to.equal(user.firstName);
        expect(sess.user.lastName).to.equal(user.lastName);
        expect(sess.user.email).to.equal(randomEmail);
        expect(sess.user.state).to.equal(user.state);
        expect(sess.user.zip).to.equal(String(user.zip));
      });
    });
  });
  it("should return an error if the user already exists", () => {
    cy.fixture("nonExistantUser").then((user) => {
      fillRegistrationForm(user, false);
      cy.get("@registerButton").click();
      cy.wait("@requestRegister").then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
  });
  it("should redirect the user after a sucessful registration", () => {
    cy.fixture("nonExistantUser").then((user) => {
      fillRegistrationForm(user, true);
      cy.get("@registerButton").click();
      cy.wait("@requestRegister").then((xhr) => {
        cy.location("hash").should("equal", "#/");
      });
    });
  });
});
