import React from "react";
import { connect } from "react-redux";
import { TUser } from "../../../store/user";
import ClientRegistrationForm from "./RegistrationForm/RegistrationForm.tsx";
interface Props {
  user: TUser;
}

interface State {}

class ContactAdd extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(
    e,
    firstName,
    lastName,
    email,
    phoneNumber,
    streetAddress,
    city,
    state,
    zip
  ) {
    // e.preventDefault;
  }

  render() {
    return (
      <ClientRegistrationForm
        handleSubmit={this.handleSubmit}></ClientRegistrationForm>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;

  return { user };
}

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ContactAdd);
