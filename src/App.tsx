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

import type { TSession, TUser, TAuth } from "./store/session";
type State = {};
type Props = {
  sessionLoading: boolean;
  ipAddr: string;

  cookie: TCookie;
  user: TUser | null;
  auth: TAuth;
  sessionError: object;
  getSessionStatus: Function;
  startLoginFlow: Function;
  dispatch: Function;
};

class App extends React.Component<Props, State> {
  componentDidMount() {
    this.props.getSessionStatus();
  }
  componentDidUpdate() {
    let str = "App Component did update:";
    if (this.props.sessionLoading === false) {
      if (this.props.user === null) {
        console.log("the user was not logged in");
        if (
          this.props.auth.state.length === 0 &&
          this.props.auth.loading === false
        ) {
          console.log("starting auth session");
          this.props.startLoginFlow();
        } else if (
          this.props.auth.state.length > 0 &&
          this.props.auth.loading === false
        ) {
          console.log("the auth session resolved");
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
  }
  render() {
    // console.log("this.props.session", this.props.auth);
    return <div>{String(this.props.sessionLoading)}</div>;
  }
}

function mapStateToProps(state: any): Object {
  const { session, auth } = state;
  return {
    sessionLoading: session.loading,
    ipAddr: session.ipAddr,
    cookie: session.cookie,
    user: session.user,
    auth,
    sessionError: session.error,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    getSessionStatus: () => {
      dispatch(checkSessionStatus());
    },
    startLoginFlow: () => {
      dispatch(startAuthSession());
    },
    // startAuthSession,
    // updateSession,
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
