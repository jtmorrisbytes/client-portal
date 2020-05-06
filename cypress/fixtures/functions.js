function fillLoginForm(fixture) {
  cy.get("@emailInput").type(fixture.email);
  cy.get("@passwordInput").type(fixture.password);
}
function setupApiRoutes() {
  cy.server();
  cy.route("POST", "/api/auth").as("startAuthSession");
  cy.route("GET", "/api/auth/session").as("getSession");
  cy.route("GET", "/api/user").as("getUser");
  cy.route("POST", "/api/auth/login").as("login");
}
function getLoginInputs() {
  cy.get("input[type='email'][name='email']").as("emailInput");
  cy.get("input[type='password'][name='password']").as("passwordInput");
  cy.get("button[type='submit'][name='login']").as("loginButton");
  cy.get("a.btn[name='register']").as("registerButton");
}

function login(fixture) {
  cy.server();
  Cypress.Cookies.preserveOnce("connect.sid");
  setupApiRoutes();
  cy.visit("/");
  cy.wait("@getSession");
  cy.wait("@getUser");
  // cy.wait("@")
  cy.wait("@startAuthSession");
  cy.hash().should("include", "/login");
  getLoginInputs();
  cy.fixture("user")
    .as("User")
    .then((user) => {
      fillLoginForm(user);
    });
  cy.get("@loginButton").click();
  cy.wait("@login");
  // wait until the app redirects
  cy.hash().should("eq", "#/");
  cy.wait("@getUser");
}
module.exports = {
  fillLoginForm,
  login,
  setupApiRoutes,
  getLoginInputs,
};
