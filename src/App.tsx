import React from "react";
// import logo from './logo.svg';
import "./App.css";
import { connect } from "react-redux";
import { checkSessionStatus } from "./store/session";
import type { Session, User } from "./store/session";
type State = {};
type Props = {
  session: Session;
  user: User | null;
  checkSessionStatus: typeof checkSessionStatus;
};

class App extends React.Component<Props, State> {
  componentDidMount() {
    this.props.checkSessionStatus();
    if (this.props.user == null) {
      console.log("no user has been detected for this cookie, log in first");
    }
  }
  render() {
    return <div>{String(this.props.session.loading)}</div>;
  }
}

function mapStateToProps(state: any): object {
  const { session } = state;
  const user = session.user || null;
  return {
    session,
    user,
  };
}
export default connect(mapStateToProps, { checkSessionStatus })(App);
