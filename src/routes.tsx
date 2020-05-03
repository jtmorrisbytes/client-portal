import React from "react";
import { Switch, Route } from "react-router-dom";
import { LOGIN_URL, REGISTER_URL, PASSWORD_RESET } from "./store/routes";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
export default function Routes(props) {
  return (
    <Switch>
      <Route exact path="/">
        hello from main menu
      </Route>
      <Route path={REGISTER_URL} component={Register} />
      <Route path={LOGIN_URL} component={Login} />
      <Route path={PASSWORD_RESET}></Route>
      <Route path="/404">this is the not found page</Route>
      <Route path="/401">not authorized</Route>
      <Route path="/500">internal server error</Route>
      <Route path="*">
        {/* this will be the navbar */}
        {/* <Switch>
          this is the PASSWORD_RESET component this is a default route
        </Switch> */}
        {/* this will be the footer nav */}
      </Route>
    </Switch>
  );
}
