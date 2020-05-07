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
    cy.viewport(360, 480).wait(1500);
    cy.viewport(575, 720).wait(1500);
    cy.viewport(720, 1080).wait(1500);
  });
});
