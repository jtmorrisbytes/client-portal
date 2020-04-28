import React from "react";
// import logo from './logo.svg';
import "./App.css";
import { connect } from "react-redux";
import { checkSessionStatus } from "./store/session";
import type { Session } from "./store/session";
type State = {};
type Props = { session: Session };

class App extends React.Component<Props, State> {
  componentDidMount() {}
  render() {
    return <div>hello</div>;
  }
}

function mapStateToProps(state: any): object {
  const { session } = state;
  return {
    session,
  };
}
export default connect(mapStateToProps, { checkSessionStatus })(App);
