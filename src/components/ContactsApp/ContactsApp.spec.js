/// <reference types="cypress" />

import React, { useReducer } from "react";
import { mount } from "cypress-react-unit-test";
import ContactsApp from "./ContactsApp.tsx";
import { store } from "../../store";
import { connect, Provider } from "react-redux";
import "../../icons";
// import "../../../node_modules/bootstrap-css-only/css/bootstrap-grid.min.css";
// import "../../../node_modules/bootstrap-css-only/css/bootstrap.min.css";
import "../../bootstrap.min.css";
import { HashRouter, MemoryRouter, Route, withRouter } from "react-router-dom";
describe("HelloWorld component", () => {
  beforeEach(() => {
    cy.viewport(480, 720);
    cy.server();
    cy.route({ url: "/api/user/clients", response: "fixture:users.json" }).as(
      "getClients"
    );
    mount(
      <HashRouter>
        <Provider store={store}>
          <Route path="*" component={withRouter(ContactsApp)} />
        </Provider>
      </HashRouter>
    );
    // now use standard Cypress commands
    cy.wait("@getClients");
    cy.get("button#addContact").as("addContact");
  });
  it("Allows the user to add a contact", () => {
    cy.get("@addContact").click();
    // cy.wait("@getUser");
    // cy.hash().should("eq", "#/contacts/add");
  });
  it("should have the corect HTML structure", () => {
    // cy.wait("@getClients");

    function iterate(fixture, limit, count = 0, start = 0) {
      console.log(
        "iterate user:",
        fixture[count],
        `count: ${count}`,
        `limit ${limit}`,
        `length ${fixture.length}`
      );

      limit = limit || fixture.length;
      if (count >= limit || count >= fixture.length) {
        console.log("iterate returning");
        return;
      } else {
        let user = fixture[start + count];
        console.log(user);
        cy.get(`[data-test-id=name-${user.id}]`)
          .scrollIntoView()
          .wait(1)
          .should("exist")
          .get(`[data-test-id=email-${user.id}]`)
          .should("exist")
          .get(`[data-test-id=phone-${user.id}]`)
          .should("exist")
          .get(`[data-test-id=tel-${user.id}]`)
          .should("exist")
          .then(() => {
            iterate(fixture, limit, count + 1, start);
          });
      }
    }

    cy.fixture("users").then((users) => {
      iterate(users, 10, 0, Math.floor(Math.random() * users.length - 20) + 20);
      // result.each((index, contactCard) => {
      //   cy.get(contactCard).as("card").children("img").as("img")
      //   cy.get("@card").children("")
      // });
    });
  });
});
