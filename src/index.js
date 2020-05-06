import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store";
import { HashRouter } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
// import { far } from "@fortawesome/free-regular-svg-icons";
import {
  faAddressBook,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
library.add(faAddressBook, faChevronLeft);

ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </HashRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
