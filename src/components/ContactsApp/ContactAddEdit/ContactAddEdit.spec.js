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
  it("should work", () => {
    let endWidth = 720;
    let delayMs = 2;
    let startWidth = 360;
    for (let width = startWidth; width < endWidth; width++) {
      cy.viewport(width, (width * 16) / 9);
    }
  });
});
