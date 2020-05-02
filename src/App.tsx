import React from "react";
// import logo from './logo.svg';
import Axios from "axios";
import "./App.css";
import { connect } from "react-redux";
import {
  checkSessionStatus,
  // startAuthSession,
  TCookie,
  // updateSession,
} from "./store/session";
import { startAuthSession } from "./store/auth";
import {
  requestRedirect,
  notifyRedirectInterstitial,
  LOGIN_URL,
  TRouter,
  endRouteTransition,
} from "./store/routes";
import { REDIRECT_LOGIN } from "./store/constants";
import type { TSession, TUser, TAuth } from "./store/session";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import Routes from "./routes";
type State = {};
interface Props extends RouteComponentProps<any> {
  sessionLoading: boolean;
  ipAddr: string;

  cookie: TCookie;
  user: TUser | null;
  auth: TAuth;
  router: TRouter;
  sessionError: object;
  getSessionStatus: Function;
  startAuthSession: Function;
  requestRedirect: typeof requestRedirect;
  notifyRedirectInterstitial: typeof notifyRedirectInterstitial;
  endRouteTransition: typeof endRouteTransition;
  dispatch: Function;
}

class App extends React.Component<Props, State> {
  componentDidMount() {
    this.props.getSessionStatus();
  }
  componentDidUpdate() {
    console.log(
      "router redirect requested",
      this.props.router.redirectRequested,
      "router redirect in progress",
      this.props.router.redirectInProgress,
      "redirect to ",
      this.props.router.redirectTo
    );
    let str = "App Component did update:";
    if (this.props.sessionLoading === false) {
      if (this.props.user === null) {
        console.log("the user was not logged in");
        if (
          this.props.auth.state.length === 0 &&
          this.props.auth.loading === false
        ) {
          console.log("starting auth session");
          this.props.startAuthSession();
        } else if (
          this.props.auth.state.length > 0 &&
          this.props.auth.loading === false
        ) {
          console.log("the auth session resolved");
          if (
            this.props.router.redirectRequested === false &&
            this.props.router.redirectTo === null
          ) {
            this.props.requestRedirect(REDIRECT_LOGIN, LOGIN_URL, {
              state: this.props.auth.state,
            });
          }
        } else if (
          this.props.auth.state.length === 0 &&
          this.props.auth.loading === true
        ) {
          console.log(
            "the user is not logged in and the auth session is loading"
          );
        }
      } else {
        console.log("App Component did update: the user is logged in");
      }
    } else {
      console.log(str + " the session is loading...");
    }
    if (
      this.props.router.redirectRequested &&
      this.props.router.redirectTo !==
        this.props.history.location.pathname +
          this.props.history.location.search
    ) {
      console.log(
        "App a redirect was requested, redirecting to ",
        this.props.router.redirectTo
      );
      console.log("location");
      this.props.notifyRedirectInterstitial();
      this.props.history.push(this.props.router.redirectTo || "");
    } else if (this.props.router.redirectRequested) {
      console.log("ending route transition");
      // this.propendRouteTransition();
    }
  }
  render() {
    // console.log("this.props.session", this.props.auth);
    return (
      <div className="App">
        <Routes />
      </div>
    );
  }
}

function mapStateToProps(state: any): Object {
  const { session, auth, router } = state;
  return {
    sessionLoading: session.loading,
    ipAddr: session.ipAddr,
    cookie: session.cookie,
    user: session.user,
    router,
    auth,
    sessionError: session.error,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    getSessionStatus: () => {
      dispatch(checkSessionStatus());
    },
    startAuthSession: () => {
      dispatch(startAuthSession());
    },
    requestRedirect: (redirectType, path, params) => {
      dispatch(requestRedirect(redirectType, path, params));
    },
    notifyRedirectInterstitial: () => {
      dispatch(notifyRedirectInterstitial());
    },
    endRouteTransition: () => dispatch(endRouteTransition()),
    // startAuthSession,
    // updateSession,
    dispatch,
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
