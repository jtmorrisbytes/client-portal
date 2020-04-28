// load Cypress TypeScript definitions for IntelliSense
/// <reference types="cypress" />
/// <reference types="cypress-react-unit-test" />

// const expect = chai.expect;
import React from "react";

import App from "../../../src/App";
import "cypress-react-unit-test";
describe("app component", () => {
  it("works", () => {
    cy.mount(<App />);
  });
});
