import { REDIRECT_LOGIN, REDIRECT_REGISTER } from "./constants";

export const LOGIN_URL = "/login";
export type LOGIN_QUERY_PARAMS = {
  state: string;
};
function convertToQueryString(params: object) {
  return (
    "?" +
    Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&")
  );
}
const BEGIN_ROUTE_TRANSITION = "BEGIN_ROUTE_TRANSITION";
const REDIRECT = "REDIRECT";
const END_ROUTE_TRANSITION = "END_ROUTE_TRANSITION";
export function requestRedirect(
  redirectType: string = "",
  path: string,
  params: object
) {
  console.log("request redirect function got callede");
  return {
    type: BEGIN_ROUTE_TRANSITION,
    payload: { redirectType, url: path + convertToQueryString(params) },
  };
}
export function notifyRedirectInterstitial() {
  console.log("notifyRedirectInterstitial called");
  return {
    type: REDIRECT,
    payload: {},
  };
}
export function endRouteTransition(type = "") {
  return {
    type: END_ROUTE_TRANSITION,
    payload: {},
  };
}
export type RouteState = {
  redirectRequested: boolean;
  redirectInProgress: boolean;
  redirectTo: string | null;
  redirectType: string | null;
};
const initialState: RouteState = {
  // when redirect requested is true,
  // begin whatever animation or
  // loading process needs to happen
  // before the app redirects eg. disable inputs
  redirectRequested: false,
  /**
   * this variable is set to true
   * after the app renders a redirect
   * allowing the APP to render a loading screen
   * while waiting for the next component
   * to mount. the component will then call
   * endRouteTransition which will flip
   * this variable to false
   */
  redirectType: null,
  redirectInProgress: false,
  redirectTo: null,
};

/**
 * 1. request redirect calls dispatch which sets a loading var
 *    to true
 * 2. doRedirect sets the url to redirect to, which will notify app
 *    to render the redirect and call startRouteTransition
 * 3. notifyRedirectInterstitial will clear the condition causing the app to redirect,
 *    while notifying the store that the redirect is happening and the next component will mount
 * 4. when the next component loads, it will render its loading screen, calling endRouteTransition
 *    on componentDidMount, then performing whatever work needs to happen on its end
 *
 */

export function routeReducer(
  state = initialState,
  action: { type: string; payload: any }
) {
  const { type, payload } = action;
  console.log("route reducer", type, payload);
  switch (type) {
    case BEGIN_ROUTE_TRANSITION:
      console.log("redirect requested, beginning route transition");
      // a redirect has been requested
      // set redirectRequested to true along with the path
      return {
        ...state,
        redirectRequested: true,
        redirectType: payload.redirectType,
        redirectTo: payload.url,
      };
    case REDIRECT:
      console.log("a redirect occurred");
      return { ...state, redirectRequested: false, redirectInProgress: true };
    case END_ROUTE_TRANSITION:
      return { ...initialState };
    default:
      return state;
  }
}
