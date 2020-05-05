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
import Auth from "@jtmorrisbytes/lib/Auth";
import {
  requestRedirect,
  notifyRedirectInterstitial,
  LOGIN_URL,
  TRouter,
  endRouteTransition,
} from "./store/routes";
import { REDIRECT_LOGIN } from "./store/constants";
import type { TSession, TAuth } from "./store/session";
import { TUser, getLoggedInUser } from "./store/user";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import Routes from "./routes";
type State = {};
interface Props extends RouteComponentProps<any> {
  sessionLoading: boolean;
  ipAddr: string;

  cookie: TCookie;
  user: TUser;
  auth: TAuth;
  router: TRouter;
  sessionError: object;
  getSessionStatus: Function;
  startAuthSession: Function;
  requestRedirect: typeof requestRedirect;
  notifyRedirectInterstitial: typeof notifyRedirectInterstitial;
  endRouteTransition: typeof endRouteTransition;
  getLoggedInUser: () => Promise<any>;
  dispatch: Function;
}

class App extends React.Component<Props, State> {
  componentDidMount() {
    this.props.getSessionStatus();
    this.props
      .getLoggedInUser()
      .then((data) => {
        console.log("user", data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
  componentDidUpdate() {}

  render() {
    // console.log("this.props.session", this.props.auth);
    return (
      <div
        id="app-load"
        data-show={this.props.sessionLoading || this.props.user.loading}>
        <div className="App">
          <Routes />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: any): Object {
  const { session, auth, router, user } = state;
  return {
    sessionLoading: session.loading,
    ipAddr: session.ipAddr,
    cookie: session.cookie,
    user,
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
    getLoggedInUser: () => dispatch(getLoggedInUser()),
    // startAuthSession,
    // updateSession,
    dispatch,
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
