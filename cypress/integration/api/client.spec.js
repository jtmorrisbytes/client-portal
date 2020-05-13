/// <reference types='cypress' />
const { clientsApiUrl } = require("../../../src/store/constants");
let clientId = null;
describe("clients api", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", `${clientsApiUrl}/*`).as("getClientById");
    cy.route("GET", `${clientsApiUrl}/search`).as("searchClients");
    cy.route("POST", clientsApiUrl).as("registerClient");
    cy.route("PUT", clientsApiUrl).as("updateClient");
    cy.route("DELETE", clientsApiUrl).as("deleteClient");
    cy.fixture("client.json").as("client");
  });
  it("should allow the client to register", () => {
    cy.get("@client").then((client) => {
      cy.request({ method: "POST", url: clientsApiUrl, body: client }).then(
        (xhr) => {
          console.log(xhr.body);
          expect(xhr.body).to.be.an("object");
          expect(xhr.status).to.be.eq(201);
          for (property in client) {
            expect(xhr.body).to.have.property(property);
            expect(xhr.body[property]).to.eq(client[property]);
          }
        }
      );
    });
  });
  it("should allow any user to search the client", () => {
    cy.get("@client").then((client) => {
      cy.request("GET", `${clientsApiUrl}/search?q=${client.email}`).then(
        (xhr) => {
          expect(xhr.body).to.be.an("array");
          expect(xhr.body.length).to.be.greaterThan(0);
          let clientresult = xhr.body[0];
          expect(clientresult.email).to.eq(client.email.toLowerCase());
          expect(clientresult.firstName).to.eq(client.firstName);
          expect(clientresult.lastName).to.eq(client.lastName);
        }
      );
    });
  });
  it("should allow the client to update all fields", () => {
    cy.get("@client").then((client) => {
      cy.fixture("newClient.json").then((newClient) => {
        cy.request("GET", `${clientsApiUrl}/search?q=${client.email}`).then(
          (xhr) => {
            let searchResult = xhr.body[0];
            cy.request({
              method: "PUT",
              url: clientsApiUrl,
              body: { ...newClient, clientId: searchResult.clientId },
            }).then((updateXhr) => {
              for (key in newClient) {
                expect(updateXhr.body).to.have.property(key);
                expect(updateXhr.body[key]).to.eq(newClient[key]);
              }
            });
          }
        );
      });
    });
  });
  it("should allow the client to be deleted", () => {
    cy.fixture("newClient.json").then((client) => {
      cy.request({
        method: "GET",
        url: `${clientsApiUrl}/search?q=${client.email}`,
      }).then((xhr) => {
        console.log("search body", xhr.body);
        xhr.body.forEach((clientResult) => {
          cy.request({
            method: "DELETE",
            url: clientsApiUrl,
            body: { clientId: clientResult.clientId },
          });
        });
      });
    });
    cy.get("@client").then((client) => {
      cy.request({
        method: "GET",
        url: `${clientsApiUrl}/search?q=${client.email}`,
      }).then((xhr) => {
        console.log("search body", xhr.body);
        xhr.body.forEach((clientResult) => {
          cy.request({
            method: "DELETE",
            url: clientsApiUrl,
            body: { clientId: clientResult.clientId },
            failOnStatusCode: false,
          });
        });
      });
    });
  });
});
