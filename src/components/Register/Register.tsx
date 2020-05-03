import React from "react";
import { connect } from "react-redux";
import { getAuthState } from "../functions";
import { requestRedirect } from "../../store/routes";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { Name } from "@jtmorrisbytes/lib/Name";
import type { IName } from "@jtmorrisbytes/lib/Name";
import * as NAME from "@jtmorrisbytes/lib/Name";
import * as PASSWORD from "@jtmorrisbytes/lib/Password";
import { Password } from "@jtmorrisbytes/lib/Password";
import * as EmailErrors from "@jtmorrisbytes/lib/Email/Errors";
import { Email } from "@jtmorrisbytes/lib/Email";

interface Props {}
interface State {
  firstName: IName;
  lastName: IName;
  email: {
    isValid: boolean;
    value: string;
  };
  emailError: string;
  phone: string;
  password: {
    isValid: boolean;
    value: string;
    toString: Function;
    error: any;
  };
  passwordConfirmation: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
}
class Register extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      firstName: new Name(""),
      lastName: new Name(""),
      email: Email(""),
      phone: "",
      emailError: "",
      password: Password(""),
      passwordConfirmation: "",
      streetAddress: "",
      city: "",
      state: "",
      zip: "",
    };
    // this line is correct. getAuthState
    // is imported externally
    this.getAuthState = getAuthState.bind(this);
    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handlePasswordConfirmationInput = this.handlePasswordConfirmationInput.bind(
      this
    );
  }
  getAuthState() {}
  handleSubmit(e) {
    e.preventDefault();
  }
  handleEmailInput(e) {
    this.setState({ ...this.state, email: Email(e.target.value) });
  }
  handlePasswordInput(e) {
    this.setState({ ...this.state, password: Password(e.target.value) });
  }
  handlePasswordConfirmationInput(e) {
    this.setState({ ...this.state, passwordConfirmation: e.target.value });
  }
  handlePhoneInput(e) {
    console.log("phone number", e);
    this.setState({
      ...this.state,
      phone: e.target.value <= 10 ? e.target.value : this.state.phone,
    });
  }
  render() {
    console.log(
      "password",
      this.state.password.value,
      "passwordconfirm",

      this.state.passwordConfirmation
    );
    return (
      <Container>
        <Row>
          <Col>
            <Form name="register">
              <Form.Group controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  onChange={this.handleEmailInput}
                  value={String(this.state.email.value)}
                  placeholder={"johnDoe@gmail.com"}
                  required
                />
                {this.state.email.isValid === false ? (
                  <Form.Text id={"email-invalid"} className="text-danger">
                    {EmailErrors.EInvalid.MESSAGE}
                  </Form.Text>
                ) : null}
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={this.handlePasswordInput}
                  value={this.state.password.value}
                  required
                />
              </Form.Group>
              {this.state.password.isValid === false ? (
                <Form.Text id={"password-invalid"} className="text-danger">
                  {this.state.password.error.MESSAGE}
                </Form.Text>
              ) : null}
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  value={this.state.passwordConfirmation}
                  onChange={this.handlePasswordConfirmationInput}
                  type="password"
                  required
                />
                {this.state.passwordConfirmation ===
                this.state.password.value ? null : (
                  <Form.Text id={"password-no-match"} className="text-danger">
                    Passwords do not match
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group controlId="phone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  name="phone"
                  type="tel"
                  minLength={10}
                  maxLength={10}
                  placeholder="1234567890"
                />
              </Form.Group>
              {this.state.phone.length < 10 ? (
                <Form.Text id={"phone-too-short"} className="text-danger">
                  Phone Number is too short
                </Form.Text>
              ) : null}
              <Form.Group controlId="streetAddress">
                <Form.Label>Street Address</Form.Label>
                <Form.Control name="address" placeholder="123 Software Way" />
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control name="city" placeholder="Silicon Valley" />
              </Form.Group>
              <Form.Group controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control name="state" placeholder="California" />
              </Form.Group>
              <Form.Group controlId="zip">
                <Form.Label>Zip</Form.Label>
                <Form.Control name="zip" placeholder="12345" />
              </Form.Group>
              <Button type="submit" name="register" block disabled>
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}
const mapDispatchToProps = {
  requestRedirect,
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
