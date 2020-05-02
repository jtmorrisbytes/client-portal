import React from "react";
import { connect } from "react-redux";
import type { TSession } from "../../store/session";
import type { TRouter } from "../../store/routes";

import {
  Container,
  ContainerProps,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
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
    return (
      <Container>
        <Row>
          <Col sm={true}>
            <h5>Log in to client portal</h5>
            <Form>
              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control size="lg" type="email" required />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control size="lg" type="password" required />
              </Form.Group>
              <Button block type="submit">
                Log in
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state: any): Props {
  return { session: state.session, router: state.router };
}
const mapDispachToProps = {};
export default connect(mapStateToProps, mapDispachToProps)(Login);
