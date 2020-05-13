import React, { ChangeEvent } from "react";
import { Button, Container, Row, Form, FormControl } from "react-bootstrap";
import NAME from "@jtmorrisbytes/lib/Name";
import { Email } from "@jtmorrisbytes/lib/Email/";
import "./RegistrationForm.css";

interface GroupProps {
  id: string;
  text: string;
  placeholder: string;
  onChange: (e: ChangeEvent) => any;
  name: string;
  value: string;
  type: string;
  "data-test-id"?: string;
}

function Group(props: GroupProps) {
  let {
    id,

    text,
    placeholder,
    onChange,
    value,
    type,
    name,
  } = props;

  return (
    <Form.Group controlId={id}>
      <Form.Label>{text}</Form.Label>
      <Form.Control
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        data-test-id={props["data-test-id"]}
      />
    </Form.Group>
  );
}

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
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleNameInput(e) {
    console.log(e.target.name, e.target.value);
    this.setState({
      ...this.state,
      [e.target.id || e.target.name]:
        e.target.value.length < 254
          ? e.target.value
          : this.state[e.target.id || e.target.name],
    });
  }
  handleInput(e) {
    this.setState({
      ...this.state,
      [e.target.id || e.target.name]: e.target.value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit(
      this.state.firstName,
      this.state.lastName,
      this.state.email,
      this.state.phoneNumber,
      this.state.streetAddress,
      this.state.city,
      this.state.zip
    );
  }
  render() {
    return (
      <Container className="ClientRegistrationForm">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId={"firstName"}>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              data-test-id={"firstName"}
              value={this.state.firstName}
              onChange={this.handleNameInput}
              name="firstName"
            />
          </Form.Group>
          <Form.Group controlId={"lastName"}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              data-test-id={"lastName"}
              value={this.state.lastName}
              onChange={this.handleNameInput}
              name="lastName"
            />
          </Form.Group>
          <Group
            id="email"
            type="email"
            name="email"
            data-test-id={"email"}
            onChange={this.handleInput}
            text="Email"
            value={this.state.email}
            placeholder="johnDoe@gmail.com"
          />
          <Group
            id="phoneNumber"
            type="tel"
            name="phone"
            data-test-id={"phoneNumber"}
            onChange={this.handleInput}
            text="Phone Number"
            value={this.state.phoneNumber}
            placeholder="1234567890"
          />
          <Group
            id="streetAddress"
            type="text"
            name="address"
            data-test-id={"streetAddress"}
            onChange={this.handleInput}
            text="Street Address"
            value={this.state.streetAddress}
            placeholder="123 California Way"
          />
          <Group
            id="city"
            type="text"
            name="city"
            data-test-id="city"
            onChange={this.handleInput}
            text="City"
            value={this.state.city}
            placeholder="Silicon Valley"
          />
          <Group
            id="state"
            type="text"
            name="state"
            data-test-id={"state"}
            onChange={this.handleInput}
            text="State"
            value={this.state.state}
            placeholder="California"
          />
          <Group
            id="zip"
            type="text"
            name="zip"
            data-test-id={"zip"}
            onChange={this.handleInput}
            text="Zip"
            value={this.state.zip}
            placeholder="123450"
          />
          <Button
            disabled={!Email(this.state.email).isValid}
            data-test-id="submit"
            block
            type="submit">
            Create Client
          </Button>
        </Form>
      </Container>
    );
  }
}
export default ClientRegistrationForm;
