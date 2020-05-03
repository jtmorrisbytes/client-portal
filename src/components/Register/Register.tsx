import React from "react";
import { connect } from "react-redux";
import { getAuthState } from "../functions";
import { requestRedirect } from "../../store/routes";
import { Form, Container, Row, Col } from "react-bootstrap";
interface Props {}
interface State {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
}
class Register extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
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
                <Form.Control type="email" placeholder={"johnDoe@gmail.com"} />
              </Form.Group>
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
