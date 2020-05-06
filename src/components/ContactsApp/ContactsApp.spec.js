/// <reference types="cypress" />

import React from "react";
import { mount } from "cypress-react-unit-test";
import ContactsApp from "./ContactsApp.tsx";
import { store } from "../../store";
import { connect, Provider } from "react-redux";
describe("HelloWorld component", () => {
  beforeEach(() => {
    cy.viewport(480, 720);
    cy.server();
    cy.route({ url: "/api/user/clients", response: "fixture:users.json" }).as(
      "getClients"
    );
  });
  it("works", () => {
    mount(
      <Provider store={store}>
        <ContactsApp />
      </Provider>
    );
    // now use standard Cypress commands
    cy.wait("@getClients");
  });
});
