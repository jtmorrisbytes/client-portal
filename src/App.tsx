import React from "react";
// import logo from './logo.svg';
import "./App.css";
import { connect } from "react-redux";
import { checkSessionStatus, startAuthSession, TCookie } from "./store/session";
import type { TSession, TUser, TAuth } from "./store/session";
type State = {};
type Props = {
  sessionLoading: boolean;
  ipAddr: string;

  cookie: TCookie;
  user: TUser | null;
  auth: TAuth;
  checkSessionStatus: typeof checkSessionStatus;
  startAuthSession: typeof startAuthSession;
};

class App extends React.Component<Props, State> {
  componentDidMount() {
    this.props.checkSessionStatus();
  }
  componentDidUpdate() {
    console.log("something changed");
    if (!this.props.sessionLoading && this.props.user === null) {
      console.log("session finished loading and user was not on session");
    }
  }
  render() {
    console.log("this.props.session", this.props.cookie);
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
  };
}
export default connect(mapStateToProps, {
  checkSessionStatus,
  startAuthSession,
})(App);
