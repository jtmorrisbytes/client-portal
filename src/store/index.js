import { createStore, combineReducers, applyMiddleware } from "redux";
// import promiseMiddleware from "redux-promise-middleware";
import ReduxThunk from "redux-thunk";
import { sessionReducer } from "./session";
import { authStateReducer } from "./auth";
import { routeReducer } from "./routes";
import { composeWithDevTools } from "redux-devtools-extension";
const rootReducer = combineReducers({
  session: sessionReducer,
  auth: authStateReducer,
  router: routeReducer,
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);
