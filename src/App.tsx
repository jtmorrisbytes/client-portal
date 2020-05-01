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
  // startAuthSession: typeof startAuthSession;
  // updateSession: typeof updateSession;
  dispatch: Function;
};

class App extends React.Component<Props, State> {
  componentDidMount() {
    this.props.getSessionStatus();
  }
  componentDidUpdate() {
    if (this.props.sessionError) {
      console.log("an error occurred in the session", this.props.sessionError);
    }
  }
  render() {
    // console.log("this.props.session", this.props.auth);
    return <div>{String(this.props.sessionLoading)}</div>;
  }
}

function mapStateToProps(state: any): Object {
  const { session } = state;
  return {
    sessionLoading: session.loading,
    ipAddr: session.ipAddr,
    cookie: session.cookie,
    user: session.user,
    auth: session.auth,
    sessionError: session.error,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    getSessionStatus: () => {
      dispatch(checkSessionStatus());
    },
    // startAuthSession,
    // updateSession,
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
