import React from "react";
import { mount } from "cypress-react-unit-test";
import { store } from "../../../store";
import { connect, Provider } from "react-redux";
import "../../../bootstrap.min.css";

import ContactAdd from "./ContactAdd";
import {
  clientsSearchApiUrl,
  clientsApiUrl,
  authApiUrl,
  loginApiUrl,
  userClientsApiUrl,
} from "../../../store/constants";
describe("when the user tries to add a client", () => {
  let component: Cypress.Chainable | null = null;
  beforeEach(() => {
    cy.server();
    cy.route("POST", userClientsApiUrl).as("ucReg");
    cy.viewport(480, 720);
    component = mount(
      <Provider store={store}>
        <ContactAdd></ContactAdd>
      </Provider>
    );
    cy.fixture("client.json")
      .as("client")
      .then((client) => {
        for (let property in client) {
          cy.get(`input[data-test-id='${property}']`).as(property);
        }
      });
    cy.get("button[data-test-id='submit']").as("submit");
    cy.fixture("user.json").then((user) => {
      return cy.request("POST", authApiUrl).then((authxhr) => {
        return cy.request({
          method: "POST",
          url: loginApiUrl,
          body: {
            state: authxhr.body.state,
            email: user.email,
            password: user.password,
          },
        });
      });
    });
  });
  afterEach(() => {
    cy.get("@client").then((client) => {
      cy.request(`${clientsSearchApiUrl}?q=${client.email}`).then((xhr) => {
        cy.request({
          method: "DELETE",
          url: clientsApiUrl,
          body: { clientId: xhr.body[0].clientId },
          failOnStatusCode: false,
        });
      });
    });
  });

  it("should work", () => {
    cy.fixture("client.json").then((client) => {
      for (let property in client) {
        cy.get(`@${property}`)
          .type(client[property])
          .should("have.value", client[property]);
      }
    });
    cy.get("@submit").click();
    cy.wait("@ucReg");
  });
});
