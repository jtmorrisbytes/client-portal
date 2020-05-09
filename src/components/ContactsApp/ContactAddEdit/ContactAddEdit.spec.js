/// <reference types="cypress" />

import React, { useReducer } from "react";
import { mount } from "cypress-react-unit-test";

import { store } from "../../../store";
import { connect, Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import ContactAddEdit from "./ContactAddEdit";
import * as constants from "../../../store/constants";
import "../../../bootstrap.min.css";
describe("Component ContactAddEdit", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", constants.contactsApiUrl + "/*", "fixture:user").as(
      "getContact"
    );
    mount(
      <HashRouter>
        <Provider store={store}>
          <ContactAddEdit />
        </Provider>
      </HashRouter>
    );
  });
  it("should let you type into the inputs", () => {
    let endWidth = 720;
    let delayMs = 2;
    let startWidth = 360;
    cy.viewport(startWidth, (startWidth * 16) / 9);
    // cy.get("input").then((inputs) => {
    //   inputs.each((index, input) => {
    //     cy.get(input).type("2").should("have.value", "2");
    //   });
    // });

    cy.get("input[data-validation-type='name']").then((inputs) => {
      let valid = "ABCDabcd";
      let invalid1 = "12345!";
      let invalid2 = valid + invalid1;
      inputs.each((index, input) => {
        cy.get(input)
          .type(valid)
          .should("have.value", "ABCDabcd")
          .clear()
          .type(invalid1)
          .should("have.value", "")
          .clear()
          .type(invalid2)
          .should("have.value", valid);
      });
    });
  });
});
