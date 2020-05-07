import React from "react";
import { Switch, Route } from "react-router-dom";
import { LOGIN_URL, REGISTER_URL, PASSWORD_RESET } from "./store/routes";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { AppPicker } from "./components/AppPicker/AppPicker";

import ContactsApp from "./components/ContactsApp/ContactsApp";
import ContactAddEdit from "./components/ContactsApp/ContactAddEdit/ContactAddEdit";
import HeadNav from "./components/HeadNav/HeadNav";
import FootNav from "./components/FootNav/FootNav";

export default function Routes(props) {
  return (
    <Switch>
      <Route exact path="/" component={AppPicker} />
      <Route path={REGISTER_URL} component={Register} />
      <Route path={LOGIN_URL} component={Login} />
      <Route path={PASSWORD_RESET}></Route>
      <Route path="/401">not authorized</Route>
      <Route path="/500">internal server error</Route>
      <Route path="*">
        <HeadNav />
        <Switch>
          <Route path="/contacts/add" component={ContactAddEdit} />
          <Route path="/contacts" component={ContactsApp} />
          <Route>Page not found</Route>
        </Switch>
        <FootNav />
      </Route>
    </Switch>
  );
}
