import { createStore, combineReducers, applyMiddleware } from "redux";
// import promiseMiddleware from "redux-promise-middleware";
import ReduxThunk from "redux-thunk";
import { sessionReducer } from "./session";

const rootReducer = combineReducers({
  session: sessionReducer,
});

export const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
