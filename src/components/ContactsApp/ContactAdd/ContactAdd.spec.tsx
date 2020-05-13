import React from "react";
import { mount } from "cypress-react-unit-test";
import { store } from "../../../store";
import { connect, Provider } from "react-redux";
import "../../../bootstrap.min.css";

import ContactAdd from "./ContactAdd";
describe("when the user tries to add a client", () => {
  let component: Cypress.Chainable | null = null;
  beforeEach(() => {
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
  });
});
