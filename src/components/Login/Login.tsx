import React from "react";
import { connect } from "react-redux";
import type { TSession } from "../../store/session";
import type { TRouter } from "../../store/routes";

import { Container, ContainerProps } from "react-bootstrap";
interface Props {
  session: TSession;
  router: TRouter;
}
interface State {}

class Login extends React.Component<Props, State> {
  componentDidMount() {
    console.log("the login component mounted");
  }
  render() {
    return <Container>welcome to login</Container>;
  }
}

function mapStateToProps(state: any): Props {
  return { session: state.session, router: state.router };
}
const mapDispachToProps = {};
export default connect(mapStateToProps, mapDispachToProps)(Login);
