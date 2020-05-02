import { createStore, combineReducers, applyMiddleware } from "redux";
// import promiseMiddleware from "redux-promise-middleware";
import ReduxThunk from "redux-thunk";
import { sessionReducer } from "./session";
import { authStateReducer } from "./auth";
import { routeReducer } from "./routes";
const rootReducer = combineReducers({
  session: sessionReducer,
  auth: authStateReducer,
  router: routeReducer,
});

export const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
