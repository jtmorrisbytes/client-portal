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
import Axios from "axios";
import type { AxiosError } from "axios";
import { registerApiUrl } from "../../store/constants";

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
  // [any:any]:any
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
    this.handlePhoneInput = this.handlePhoneInput.bind(this);
    this.handleEnableSubmit = this.handleEnableSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstNameInput = this.handleFirstNameInput.bind(this);
    this.handleLastNameInput = this.handleLastNameInput.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  handleFirstNameInput(e) {
    this.setState({ ...this.state, firstName: new Name(e.target.value) });
  }
  handleLastNameInput(e) {
    this.setState({ ...this.state, lastName: new Name(e.target.value) });
  }
  getAuthState() {}
  handleSubmit(e) {
    e.preventDefault();
    console.log("submitting form auth state", this.getAuthState());
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      streetAddress,
      city,
      state,
      zip,
    } = this.state;
    console.log(
      "creating user",
      `firstName: ${firstName.value || undefined}`,
      `lastName: ${lastName.value || undefined}`,
      `email: ${email.value}`,
      password,
      phone,
      city,
      state,
      zip
    );
    Axios.post(registerApiUrl + "?test=true", {
      state: this.getAuthState(),
      user: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        phoneNumber: phone,
        streetAddress,
        city,
        state,
        zip,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // dispatch the session
        }
      })
      .catch((err: AxiosError) => {
        if (err.response?.data) {
        }
      });
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
  handleEnableSubmit(): boolean {
    return !(
      this.state.password.isValid &&
      this.state.email.isValid &&
      this.state.password.value === this.state.passwordConfirmation &&
      this.state.phone.length === 10
    );
  }
  handlePhoneInput(e) {
    console.log("phone number", e);
    if (e.target.value.length <= 10) {
      this.setState({
        ...this.state,
        phone: e.target.value,
      });
    }
  }
  handleInput(e) {
    this.setState({ ...this.state, [e.target.id]: e.target.value });
  }
  render() {
    // console.log(
    //   "password",
    //   this.state.password.value,
    //   "passwordconfirm",

    //   this.state.passwordConfirmation
    // );
    return (
      <Container>
        <Row>
          <Col>
            <Form name="register" onSubmit={this.handleSubmit}>
              <Form.Group controlId="email">
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    value={this.state.firstName.value}
                    onChange={this.handleFirstNameInput}
                    type="text"
                    placeholder={"Johnny"}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    value={this.state.lastName.value}
                    onChange={this.handleLastNameInput}
                    type="text"
                    placeholder={"Bravo"}
                  />
                </Form.Group>
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
                  onChange={this.handlePhoneInput}
                  maxLength={10}
                  value={this.state.phone}
                  placeholder="1234567890"
                />

                {this.state.phone.length < 10 ? (
                  <Form.Text id={"phone-too-short"} className="text-danger">
                    Phone Number is too short
                  </Form.Text>
                ) : null}
              </Form.Group>
              <Form.Group controlId="streetAddress">
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  value={this.state.streetAddress}
                  onChange={this.handleInput}
                  name="address"
                  placeholder="123 Software Way"
                />
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  value={this.state.city}
                  onChange={this.handleInput}
                  name="city"
                  placeholder="Silicon Valley"
                />
              </Form.Group>
              <Form.Group controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control
                  value={this.state.state}
                  onChange={this.handleInput}
                  name="state"
                  placeholder="California"
                />
              </Form.Group>
              <Form.Group controlId="zip">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  value={this.state.zip}
                  onChange={this.handleInput}
                  name="zip"
                  placeholder="12345"
                />
              </Form.Group>
              <Button
                type="submit"
                name="register"
                block
                disabled={this.handleEnableSubmit()}>
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
