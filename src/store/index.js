import { createStore, combineReducers, applyMiddleware } from "redux";
import promiseMiddleware from "redux-promise-middleware";
import { sessionReducer } from "./session";

const rootReducer = combineReducers({
  session: sessionReducer,
});

export const store = createStore(
  rootReducer,
  applyMiddleware(promiseMiddleware)
);
