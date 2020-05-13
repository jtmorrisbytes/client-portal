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
  routeWhitelist = ["/register", "/login"];
  ref;
  constructor(props) {
    super(props);
    this.checkUserState = this.checkUserState.bind(this);
    this.setAppHeight = this.setAppHeight.bind(this);
    this.ref = React.createRef();
  }
  setAppHeight(e?) {
    console.log("SETTING APP HEIGHT", this.ref?.current?.style?.height);
    if (this.ref.current) {
      this.ref.current.style.height = `${window.document.documentElement.clientHeight}px`;
    }
    // this.ref
  }
  componentDidMount() {
    this.props.getSessionStatus();
    this.checkUserState();
    window.addEventListener("hashchange", this.checkUserState);
    // need to add scroll listener to handle the app height
    this.setAppHeight();
    window.addEventListener("scroll", this.setAppHeight);
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
      <div className="App" ref={this.ref}>
        <div
          id="app-load"
          data-show={
            this.props.sessionLoading ||
            this.props.user.loading ||
            this.props.auth.loading
          }>
          LOADING...
        </div>
        <Routes />
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
          if (this.props.auth.state.length === 0) {
            console.log(
              "Promise rejected, user not logged in, starting auth session"
            );
            return this.props.startAuthSession().then((AuthAction) => {
              console.log("Checking whitelist before redirecting");

              if (AuthAction) {
                console.log("promise chain returned authAction");
                this.props.history.replace("/login");
              }
              console.log(AuthAction);
            });
          } else if (this.props.auth.state.length > 0) {
            console.log("login or signup in progress, checking whitelist");
            if (
              this.routeWhitelist.includes(this.props.history.location.pathname)
            ) {
              console.log("login in progress route was in whitelist");
            } else {
              console.log(
                this.props.history.location.pathname,
                "was not in ",
                this.routeWhitelist
              );
              this.props.history.goBack();
            }
          }
        } else {
          console.error(
            "ComponentDidMount checkLoggedInUser unhandled rejection",
            errAction
          );
          return Promise.reject();
        }
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
