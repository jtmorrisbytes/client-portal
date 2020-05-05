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
  onHashChange: any;
  constructor(props) {
    super(props);
    this.checkUserState = this.checkUserState.bind(this);
    this.onHashChange = null;
  }
  componentDidMount() {
    this.props.getSessionStatus();
    this.checkUserState();
    window.addEventListener("hashchange", this.checkUserState);
  }
  compnentWillUnmount() {
    window.removeEventListener("hashchange", this.checkUserState);
  }
  componentDidUpdate(prevProps: Props) {
    if (this.props.location.hash != prevProps.location.hash) {
      this.checkUserState();
    }
  }

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
  checkUserState() {
    this.props
      .getLoggedInUser()
      .then((action) => {
        if (action.payload) {
          console.log("Promise resolved, user logged in");
        }
      })
      .catch((errAction) => {
        // the line below indicates that the structs are out of sync
        if (
          errAction.payload.TYPE === Auth.ELoginRequired.TYPE ||
          "LOGIN_REQUIRED"
        ) {
          console.log("Promise rejected, user not logged in");
          return this.props.startAuthSession();
        } else {
          console.error(
            "ComponentDidMount checkLoggedInUser unhandled rejection",
            errAction
          );
          return Promise.reject();
        }
      })
      .then((AuthAction) => {
        if (AuthAction) {
          console.log("promise chain returned authAction");
          this.props.history.replace("/login");
        }
        console.log(AuthAction);
      });
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
      return dispatch(startAuthSession());
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
