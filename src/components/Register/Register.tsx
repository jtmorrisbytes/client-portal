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
import * as EMAIL from "@jtmorrisbytes/lib/Email";
import { Email } from "@jtmorrisbytes/lib/Email";

interface Props {}
interface State {
  firstName: IName;
  lastName: IName;
  email: {
    isValid: boolean;
    value: string;
  };
  password: {
    isValid: boolean;
    value: string;
    toString: Function;
  };
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
      password: Password(""),
      streetAddress: "",
      city: "",
      state: "",
      zip: "",
    };
    // this line is correct. getAuthState
    // is imported externally
    this.getAuthState = getAuthState.bind(this);
  }
  getAuthState() {}
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Form name="register">
              <Form.Group controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={"johnDoe@gmail.com"}
                  required
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" required />
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" required />
              </Form.Group>
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
