/// <reference types='cypress' />
const {
  clientsApiUrl,
  clientsSearchApiUrl,
  authApiUrl,
  loginApiUrl,
  userClientsApiUrl,
} = require("../../../src/store/constants");
after(() => {
  cy.fixture("client.json").then((client) => {
    cy.request("GET", `${clientsSearchApiUrl}?q=${client.email}`).then(
      (xhr) => {
        cy.request({
          method: "DELETE",
          url: clientsApiUrl,
          body: { clientId: xhr.body[0].clientId || xhr.body[0].id },
          failOnStatusCode: false,
        });
      }
    );
  });
});
describe("the user", () => {
  it("should be able to create a client, and associate the client with the user", () => {
    cy.fixture("user.json").then((user) => {
      cy.fixture("client.json").then((client) => {
        // start the auth session
        cy.request("POST", authApiUrl).then((authxhr) => {
          // log in the user
          cy.request({
            method: "POST",
            url: loginApiUrl,
            body: {
              state: authxhr.body.state,
              email: user.email,
              password: user.password,
            },
          }).then((loginxhr) => {
            expect(loginxhr.status).to.eq(200);
            // search for the client. the client should not exist in this test,
            //so it should be created

            cy.request(`${clientsSearchApiUrl}?q=${client.email}`).then(
              (clientSearchXhr) => {
                expect(clientSearchXhr.status).to.eq(200);
                expect(clientSearchXhr.body.length).to.eq(0);
                // create client if not exists
                cy.request({
                  method: "POST",
                  url: clientsApiUrl,
                  body: client,
                }).then((clientRegXhr) => {
                  expect(clientRegXhr.status).to.eq(201);
                  // register the client to the user
                  cy.request({
                    method: "POST",
                    url: userClientsApiUrl,
                    body: {
                      clientId: clientRegXhr.body.clientId,
                      userId: loginxhr.body.id,
                    },
                  }).then((userClientXhr) => {
                    expect(userClientXhr.status).to.eq(204);
                    // get the users clients. the client should be on the list
                    cy.request(userClientsApiUrl).then((getClientsXhr) => {
                      expect(getClientsXhr.body).to.be.an("array");
                      expect(getClientsXhr.body.length).to.eq(1);
                      let userClient = getClientsXhr.body[0];
                      for (key in client) {
                        expect(userClient).to.have.property(key);
                      }
                    });
                  });
                });
              }
            );
          });
        });
      });
    });
  });
});
