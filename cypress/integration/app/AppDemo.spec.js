///<reference types='cypress' />
const constants = require("../../../src/store/constants");
function findLoginInputs() {
  cy.get("input[name='email']").as("email");
  cy.get("input[name='password']").as("password");
  cy.get("button[type='submit'][name='login']").as("logInButton");
}
describe("Client Portal", () => {
  let email = "";
  before(() => {
    Cypress.Cookies.debug(true);
    cy.clearCookies();
  });
  after(() => {
    cy.fixture("client.json").then((client) => {
      cy.request(`${constants.clientsSearchApiUrl}?q=${client.email}`).then(
        (clientSearch) => {
          if (clientSearch.body.length > 0) {
            let { clientId } = clientSearch.body[0];
            cy.request({
              method: "DELETE",
              url: constants.clientsApiUrl + `/${clientId}`,
              failOnStatusCode: false,
            });
          }
        }
      );
    });
    cy.fixture("newClient.json").then((client) => {
      cy.request(`${constants.clientsSearchApiUrl}?q=${client.email}`).then(
        (clientSearch) => {
          if (clientSearch.body.length > 0) {
            let { clientId } = clientSearch.body[0];
            cy.request({
              method: "DELETE",
              url: constants.clientsApiUrl + `/${clientId}`,
              failOnStatusCode: false,
            });
          }
        }
      );
    });
  });
  beforeEach(() => {
    cy.viewport(480, 720);
    // setup routes
    // cy.clearCookies();
    cy.server();
    cy.route("GET", constants.userApiUrl).as("getUser");
    cy.route("GET", constants.sessionApiUrl).as("getSession");
    cy.route("GET", constants.authApiUrl).as("getAuth");
    cy.route("POST", constants.authApiUrl).as("postAuth");
    cy.route("POST", constants.loginApiUrl).as("loginUser");
    cy.route("POST", constants.registerApiUrl + "?test=true").as("register");
    cy.route("POST", constants.clientsApiUrl).as("registerClient");
    cy.route("GET", constants.userClientsApiUrl).as("getUserClients");
    cy.route("POST", constants.userClientsApiUrl).as("registerClientToUser");
    cy.route("PUT", constants.clientsApiUrl).as("updateClient");
    cy.route("DELETE", constants.clientsApiUrl + "/*").as("deleteClient");
    cy.fixture("demoLoginUser").as("user");
  });
  it("should require users to register", () => {
    Cypress.Cookies.preserveOnce("connect.sid");
    cy.visit("/");
    cy.wait(["@getSession", "@getUser"]);
    cy.wait("@postAuth");
    cy.hash().should("eq", "#/login");
    cy.get("@user").then((user) => {
      email = `${Math.floor(Math.random() * 9999 - 1) + 1}${
        user.email
      }`.toLowerCase();
      findLoginInputs();
      cy.get("@email").type(email);
      cy.get("@password").type(user.password);
      cy.get("@logInButton").click();
      // try logging in. it should fail
      cy.wait("@loginUser").then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
      // the inputs should be cleared after a failure

      cy.get("@email").should("have.value", "");
      cy.get("@password").should("have.value", "");
      cy.get("div.alert-danger")
        .as("alert")
        .should("exist")
        .should("contain", "the email does not exist")
        .children("button.close")
        .should("exist")
        .wait(800)
        .click();
      // transition to registration
      cy.get("a[name='register']").click();
      cy.wait(500);
      // get form inputs
      cy.get("@user").then((user) => {
        user.email = email;
        for (let property in user) {
          cy.get(`#${property}`)
            .as(property)
            .scrollIntoView()
            // .wait(40)
            .type(user[property] /*, { delay: 80 }*/);
          // .wait(40);
        }
      });
      cy.get("button[name='register']").click();
      cy.wait("@register").then((registerxhr) => {
        expect(registerxhr.status).to.eq(200);
      });
      cy.wait("@getUser");
      cy.hash().should("eq", "#/");
    });
  });
  // it("should require users to log in", () => {
  //   Cypress.Cookies.preserveOnce("connect.sid");
  //   cy.visit("#/login");
  //   cy.wait("@getUser");
  //   findLoginInputs();
  //   cy.get("@user").then((user) => {
  //     cy.get("@email").type(email);
  //     cy.get("@password").type(user.password);
  //     cy.get("@logInButton").click();
  //   });
  //   cy.wait(["@loginUser"]);
  //   cy.hash().should("eq", "#/");
  // });
  it("should allow the user to use ContactsApp after logging in", () => {
    Cypress.Cookies.preserveOnce("connect.sid");
    cy.get("@user").then((user) => {
      return cy
        .request({ method: "POST", url: constants.authApiUrl })
        .then((authXhr) => {
          console.log("AUTHXHR", authXhr);
          cy.request({
            method: "POST",
            url: constants.loginApiUrl,
            body: {
              state: authXhr.body.state,
              email: email,
              password: user.password,
            },
          }).then((loginXhr) => {
            expect(loginXhr.status).to.eq(200);
          });
        });
    });
    cy.visit("/");
    // cy.wait(["@getUser,@getSession"]);
    cy.hash().should("eq", "#/");
    cy.get("#contacts.AppIcon").should("exist").click();
    cy.hash().should("eq", "#/contacts");
    cy.wait("@getUser");
    // cy.wait(20000);
    cy.get("[data-test-id='add-contact']").click();
    // fill out the client registration form
    cy.fixture("client.json").then((client) => {
      for (let property in client) {
        cy.get(`input[data-test-id='${property}'`)
          .scrollIntoView()
          .type(client[property])
          .should("have.value", client[property]);
      }
    });
    cy.get("[data-test-id='submit']").click();
    cy.wait("@registerClient").then((regClientxhr) => {
      let { id } = regClientxhr.response.body;
      expect(regClientxhr.status).to.eq(201);
      cy.wait("@registerClientToUser").then((regClientUserXhr) => {
        expect(regClientUserXhr.status).to.eq(204);
      });

      cy.wait("@getUserClients");
      cy.hash().should("eq", "#/contacts");
      cy.request("GET", constants.userClientsApiUrl).then((userClients) => {
        expect(userClients.body.length).to.be.greaterThan(0);
        let client = userClients.body[0];
        cy.get(`#${client.id}`).should("exist");
        cy.get(`[data-test-id='name-${client.id}']`).click();
        cy.hash().should("eq", `#/contacts/edit/${client.id}`);
        cy.fixture("newClient.json").then((newClient) => {
          cy.get("[data-test-id='first-name']")
            .clear()
            .type(newClient.firstName)
            .should("have.value", newClient.firstName);
          cy.get("[data-test-id='last-name']")
            .clear()
            .type(newClient.lastName)
            .should("have.value", newClient.lastName);
          cy.get("[data-test-id='phone']")
            .clear()
            .type(newClient.phoneNumber)
            .should("have.value", newClient.phoneNumber);
          cy.get("[data-test-id='street']")
            .clear()
            .type(newClient.streetAddress)
            .should("have.value", newClient.streetAddress);
          cy.get("[data-test-id='city']")
            .clear()
            .type(newClient.city)
            .should("have.value", newClient.city);
          cy.get("[data-test-id='state']")
            .clear()
            .type(newClient.state)
            .should("have.value", newClient.state);
          cy.get("[data-test-id='zip']")
            .clear()
            .type(newClient.zip)
            .should("have.value", newClient.zip);
          cy.get("[data-test-id='save-changes']").click();
          cy.wait("@updateClient").then((updateClientXhr) => {
            console.log("updateClientXHR request", updateClientXhr);
          });
          cy.request("GET", constants.clientsApiUrl + `/${client.id}`).then(
            (updatedClientXhr) => {
              // expect(updatedClientXhr.body).to.be.an("object");
              let updatedClient = updatedClientXhr.body;
              if (Array.isArray(updatedClient)) {
                updatedClient = updatedClient[0];
              }
              expect(updatedClient.firstName).to.eq(newClient.firstName);
              expect(updatedClient.lastName).to.eq(newClient.lastName);
              expect(updatedClient.phoneNumber).to.eq(newClient.phoneNumber);
              expect(updatedClient.streetAddress).to.eq(
                newClient.streetAddress
              );
              expect(updatedClient.city).to.eq(newClient.city);
              expect(updatedClient.state).to.eq(newClient.state);
              expect(updatedClient.zip).to.eq(newClient.zip);
            }
          );
        });
        cy.get(`[data-test-id='name-${client.id}']`).click();
        cy.hash().should("eq", `#/contacts/edit/${client.id}`);
        cy.get("[data-test-id='delete-client']").click();
        cy.wait("@deleteClient");
        cy.hash().should("eq", "#/contacts");
        cy.request("GET", constants.userClientsApiUrl).then((userClients) => {
          expect(userClients.body.length).to.eq(0);
        });
      });
    });
  });
});
