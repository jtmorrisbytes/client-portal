import React from "react";
import { Switch, Route } from "react-router-dom";
import { LOGIN_URL } from "./store/routes";
export default function Routes(props) {
  return (
    <Switch>
      <Route exact path="/">
        hello from main menu
      </Route>
      <Route path={LOGIN_URL}>this is the login component</Route>
      <Route>this is a default route</Route>
    </Switch>
  );
}
