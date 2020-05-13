import React from "react";
import { connect } from "react-redux";
import { TUser } from "../../../store/user";
import ClientRegistrationForm from "./RegistrationForm/RegistrationForm.tsx";
import Axios from "axios";
import { clientsApiUrl, userClientsApiUrl } from "../../../store/constants";
import { RouteComponentProps } from "react-router-dom";
interface Props extends RouteComponentProps {
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
    Axios.post(clientsApiUrl, {
      firstName,
      lastName,
      email,
      phoneNumber,
      city,
      state,
      zip,
    }).then((res) => {
      if (res.status == 201) {
        console.log("registering client with user");
        Axios.post(
          userClientsApiUrl,
          { clientId: res.data.clientId },
          { withCredentials: true }
        ).then((UCRegRes) => {
          if (UCRegRes.status >= 200 && UCRegRes.status <= 204) {
            console.log("client registration successful");
            alert("Client registration succesful");
            if (this.props.history) {
              this.props.history.replace("/contacts");
            }
          }
        });
      }
    });
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
