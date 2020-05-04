import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { sessionReducer } from "./session";
import { authStateReducer } from "./auth";
import { routeReducer } from "./routes";
import { userReducer } from "./user";
import { composeWithDevTools } from "redux-devtools-extension";
// import promiseMiddleware from "redux-promise-middleware";

const rootReducer = combineReducers({
  session: sessionReducer,
  auth: authStateReducer,
  router: routeReducer,
  user: userReducer,
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);
