import React, { KeyboardEvent, SyntheticEvent } from "react";
import { connect } from "react-redux";
import type { TSession } from "../../store/session";
import { TRouter, REGISTER_URL } from "../../store/routes";
import { loginApiUrl } from "../../store/constants";
import type { TAuth } from "../../store/auth";
import type { RouteComponentProps } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import * as UserErrors from "@jtmorrisbytes/lib/User/Errors";
import { requestRedirect } from "../../store/routes";
import Axios from "axios";
import { getLoggedInUser, TUser } from "../../store/user";

import {
  Container,
  ContainerProps,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
interface Props extends RouteComponentProps {
  session: TSession;
  router: TRouter;
  auth: TAuth;
  user: TUser;
  getLoggedInUser: () => Promise<any>;
}
interface State {
  email: string;
  error: string;
  password: string;
}

class Login extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      error: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputUpdate = this.handleInputUpdate.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
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
  redirectToHome() {
    this.props.history.replace("/");
  }
  componentDidUpdate() {
    if (this.props.user.id) {
      console.log("User Logged In");
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    // get the state string
    console.log("HANDLESUBMIT AUTH STATE", this.props.auth.state);
    let state =
      this.props.auth.state || decodeURIComponent(this.getAuthState());
    if (state.length === 0) {
      console.log("state was empty on form submit, login will fail currently");
    }
    // console.log("getting state from query", params.get("state"));
    console.log("trying to log in with state variable", state);
    Axios.post(
      loginApiUrl,
      {
        state,
        email: this.state.email,
        password: this.state.password,
      },
      { withCredentials: true }
    )
      .then((res) => {
        console.log(res);
        // this.props.getLoggedInUser();
        if (res.status === 200 && res.data.id) {
          // this.props.getLoggedInUser().then((res) => {
          //   this.redirectToHome();
          // });
          this.redirectToHome();
        }
      })
      .catch((error) => {
        try {
          let resObj = JSON.parse(error.request.response);
          console.log("response object could be parsed", resObj);
          console.log("response type", resObj.TYPE);
          switch (resObj.TYPE) {
            case UserErrors.ENotFoundByEmail.TYPE:
              this.setState({
                ...this.state,
                email: "",
                password: "",
                error: resObj.REASON,
              });
              break;
            default:
              console.log("Login error not handled");
              this.setState({ ...this.state, email: "", password: "" });
              break;
          }
        } catch (e) {
          console.error("handlesubmit error", e);
        }
      });
  }
  clearErrors() {
    this.setState({ ...this.state, error: "" });
  }
  render() {
    return (
      <Container>
        <Alert
          variant="danger"
          show={this.state.error.length > 0}
          dismissible
          onClose={this.clearErrors}>
          {this.state.error}
        </Alert>
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
              <Button block type="submit" name="login">
                Log In
              </Button>
              <LinkContainer
                to={REGISTER_URL + `?state=${this.getAuthState()}`}>
                <Button block name="register" variant="secondary">
                  Sign Up
                </Button>
              </LinkContainer>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state: any): any {
  return {
    session: state.session,
    router: state.router,
    auth: state.auth,
    user: state.user as TUser,
  };
}
const mapDispachToProps = { requestRedirect, getLoggedInUser };
export default connect(mapStateToProps, mapDispachToProps)(Login);
