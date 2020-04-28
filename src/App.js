import React from "react";
// import logo from './logo.svg';
import "./App.css";
import { connect } from "react-redux";
import { checkSessionStatus } from "./store/session";
class App extends React.Component {}

function mapStateToProps(state) {
  const { session } = state;
  return {
    session,
  };
}

export default connect(App, { checkSessionStatus });
