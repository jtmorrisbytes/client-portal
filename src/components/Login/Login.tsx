import React, { KeyboardEvent, SyntheticEvent } from "react";
import { connect } from "react-redux";
import type { TSession } from "../../store/session";
import type { TRouter } from "../../store/routes";
import { loginApiUrl } from "../../store/constants";
import type { TAuth } from "../../store/auth";
import type { RouteComponentProps } from "react-router-dom";

import Axios from "axios";
import {
  Container,
  ContainerProps,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
interface Props extends RouteComponentProps {
  session: TSession;
  router: TRouter;
  auth: TAuth;
}
interface State {
  email: string;
  password: string;
}

class Login extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputUpdate = this.handleInputUpdate.bind(this);
  }

  getAuthState() {
    return (
      new URLSearchParams((this.props.location || {}).search || "").get(
        "state"
      ) ||
      (this.props.auth || {}).state ||
      ""
    );
  }
  componentDidMount() {
    console.log("the login component mounted");
    if (this.getAuthState().length === 0) {
      console.log(
        "auth state was empty on both redux and query," +
          "this component will not work properly"
      );
    }
  }
  handleInputUpdate(e) {
    const { name, value } = e.target;
    console.log("handleInputUpdate", name, value || "");
    this.setState({ ...this.state, [name]: value });
  }
  handleSubmit(e) {
    e.preventDefault();
    // get the state string
    console.log("the form has been submitted");
    let state = this.getAuthState();
    if (state.length === 0) {
      console.log("state was empty on form submit, login will fail currently");
    }
    // console.log("getting state from query", params.get("state"));
    Axios.post(loginApiUrl, { state })
      .then(console.log)
      .catch((error) => {
        console.log("login rejected");
      });
  }
  render() {
    return (
      <Container>
        <Row>
          <Col sm={true}>
            <h5>Log in to client portal</h5>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="emailGroup">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  onChange={this.handleInputUpdate}
                  value={this.state.email}
                  size="lg"
                  type="email"
                  name="email"
                  required
                />
              </Form.Group>
              <Form.Group controlId="passwordGroup">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  size="lg"
                  value={this.state.password}
                  onChange={this.handleInputUpdate}
                  type="password"
                  name="password"
                  required
                />
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

function mapStateToProps(state: any): any {
  return { session: state.session, router: state.router, auth: state.auth };
}
const mapDispachToProps = {};
export default connect(mapStateToProps, mapDispachToProps)(Login);
