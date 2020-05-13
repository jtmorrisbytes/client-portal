import React from "react";
import { Button, Container, Row, Form } from "react-bootstrap";
interface Props {
  handleSubmit: Function;
}
interface State {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  city: string;
  state: string;
  zip: string;
}
class ClientRegistrationForm extends React.Component<Props, State> {
  state = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container className="ClientRegistrationForm">
        <Form>
          <Form.Group controlId={"firstName"}>
            <Form.Label>First Name</Form.Label>
            <Form.Control />
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
