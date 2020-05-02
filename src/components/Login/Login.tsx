import React, { KeyboardEvent, SyntheticEvent } from "react";
import { connect } from "react-redux";
import type { TSession } from "../../store/session";
import type { TRouter } from "../../store/routes";
import { loginApiUrl } from "../../store/constants";
import Axios from "axios";
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
  componentDidMount() {
    console.log("the login component mounted");
  }
  handleInputUpdate(e) {
    const { name, value } = e.target;
    console.log("handleInputUpdate", name, value || "");
    this.setState({ ...this.state, [name]: value });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log("the form has been submitted");
    console.log(e.target.email);
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

function mapStateToProps(state: any): Props {
  return { session: state.session, router: state.router };
}
const mapDispachToProps = {};
export default connect(mapStateToProps, mapDispachToProps)(Login);
