import React from "react";
import { Container, Row, Col, FormLabel, Button } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import "./ContactAddEdit.css";
import Axios, { AxiosResponse } from "axios";
import { contactsApiUrl, clientsApiUrl } from "../../../store/constants";
import { getUserClients } from "../../../store/user";
import { TUser } from "../../../store/user";

interface ClientResponse {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
}

interface match {
  id?: string;
}

interface Props extends RouteComponentProps<match> {
  user: TUser;
  getUserClients: () => Promise<any>;
}
interface State {
  loading: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  streetAddress: string;
  state: string;
  zip: string;
}
{
  /* <Col data-test-id={"user-image-container"}>
<img src="https://picsum.photos/100/100" />
</Col>
<Col data-test-id={"user-names-container"}>
<input
  name="firstName"
  data-test-id={"user-first-name"}
  placeholder="First Name"
/>
{/* <input name='firstName' data-test-id={"user-first-name"} placeholder="First Name" /> */
}
{
  /* <input
  name="lastName"
  data-test-id={"user-last-name"}
  placeholder="Last Name"
/> */
}
// </Col>

class ContactAddEdit extends React.Component<Props, State> {
  componentStr: string = "";
  state = {
    loading: false,
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
  };
  constructor(props) {
    super(props);
    this.componentStr = this.constructor.name
      ? `Component ${this.constructor.name}: `
      : "";
    this.handleInput = this.handleInput.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handlePhoneInput = this.handlePhoneInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleStreetAddress = this.handleStreetAddress.bind(this);
  }

  handleInput(e) {
    this.setState({
      ...this.state,
      [e.target.name || e.target.id]: e.target.value,
    });
    // not doing input validation right now
  }
  handleStreetAddress(e) {
    this.setState({ ...this.state, streetAddress: e.target.value });
  }
  handlePhoneInput(e) {
    this.setState({ ...this.state, phoneNumber: e.target.value });
  }
  handleNameInput(e) {
    if (/^[a-zA-Z]{0,255}$/.test(e.target?.value)) {
      console.debug(`${this.componentStr} Name validation passed`);
      this.setState({
        ...this.state,
        [e.target.id || e.target.name]: e.target.value,
      });
    } else {
      console.debug(`${this.componentStr} Name validation failed`);
    }
  }
  handleSubmit(e) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      streetAddress,
      city,
      state,
      zip,
    } = this.state;
    Axios.put(
      clientsApiUrl,
      {
        clientId: this.props.match.params.id,
        firstName,
        lastName,
        email,
        phoneNumber,
        streetAddress,
        city,
        state,
        zip,
      },
      { withCredentials: true }
    )
      .then((response) => {
        if (response.status == 200) {
          alert("Update Success");
          if (this.props.history?.push) {
            // the detail view is not implemented at this time,
            // so the view will redirect back to contacts
            this.props.history.push("/contacts");
          } else {
            console.warn(
              "ContactAddEdit: Could not redirect user on success because React Router history.push was unavailible "
            );
          }
        }
      })
      .catch((e) => {
        switch (e.response.status) {
          case 400:
            console.error("Server Returned bad request", e);
          case 401:
            alert("You are not logged in. Cannot save changes.");
            console.error(
              "The user is not logged in... cant fufull the request to add/update contact"
            );

            console.info("trying to redirect to index...");
            if (this.props?.history?.replace) this.props.history.replace("/");
            else
              console.log(
                "ContactAddEdit: Could not redirect user on not authorized error because React Router was unavailible"
              );
            window.location.reload();

            break;
          case 500:
            console.error("The Server had an error");
            alert("Something went wrong, please try again later");
            try {
              this.props.history.replace("/");
            } catch (e) {
              console.log(
                "handleSubmit: redirect failed while trying to handle status code 500 "
              );
            }
          default:
            console.error(
              "ContactAddEdit: Either No response was given from server or the error was not handled"
            );
        }
      });
  }
  handleDelete() {
    Axios.delete(clientsApiUrl + "/" + this.props.match.params.id).then(
      (response) => {
        this.props.getUserClients().then(() => {
          this.props.history.replace("/contacts");
        });
      }
    );
  }
  componentDidMount() {
    this.setState({ ...this.state, loading: true }, () => {
      if (this.props.match?.params?.id) {
        console.debug(
          `${this.componentStr} Attepmting to request Client id ${this.props.match.params.id}`
        );
        Axios.get(clientsApiUrl + "/" + this.props.match.params.id, {
          withCredentials: true,
        })
          .then((response: AxiosResponse<ClientResponse>) => {
            let client: ClientResponse = {
              firstName: "",
              lastName: "",
              email: "",
              streetAddress: "",
              phoneNumber: "",
              city: "",
              state: "",
              zip: "",
            };
            if (Array.isArray(response.data) && response.data?.length > 0) {
              client = response.data[0];
            } else if (typeof response.data === "object") {
              client = response.data;
            }
            this.setState({
              ...this.state,
              firstName: client.firstName || "",
              middleName: client.middleName || "",
              lastName: client.lastName || "",
              email: client.email || "",
              phoneNumber: client.phoneNumber || "",
              streetAddress: client.streetAddress || "",
              city: client.city || "",
              state: client.state || "",
              zip: client.zip || "",
              loading: false,
            });
          })
          .catch((err) => {
            if (err.status == 401) {
              alert("you are not logged in, please log in again");

              if (this.props?.history?.replace) {
                console.debug(
                  "the user was not logged in, redirecting to login component"
                );
                this.props.history.replace("/login");
              } else {
                // note that this action could result in an infinite loop of redirects
                console.debug(
                  "the user was!logged in && the router was unavailable. reloading the page instead"
                );
                window.location.reload();
              }
            }
            console.log(err);
          });
      } else {
        console.info(
          `${this.componentStr} was not mounted with router.
        Attempting to load info from the first index of the clients state array`.trim()
        );
        if (Array.isArray(this.props.user?.clients)) {
          console.debug(
            `${this.componentStr} found clients array.`,
            this.props.user.clients
          );
          if (this.props.user.clients.length > 0) {
            console.debug(
              `clients array was longer than 0, grabbing the first entry on the array`
            );

            let user = this.props.user.clients[0] || {};

            this.setState({
              ...this.state,
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              city: user.city || "",
              state: user.state || "",
              zip: user.zip || "",
              phoneNumber: user.phoneNumber || "",
              email: user.email || "",
              streetAddress: user.streetAddress || "",
              loading: false,
            });
          } else {
            console.debug(
              `${this.componentStr} Clients array was empty. Cannot get client from redux store`
            );
          }
        }
      }
    });
  }
  render() {
    return (
      <Container id="ContactAddEdit" data-test-id={"contact-add-edit"}>
        <div id="img-names">
          <img data-test-id={"user-img"} src="https://picsum.photos/100/100" />
          <input
            id="firstName"
            name="firstName"
            data-validation-type={"name"}
            value={this.state.firstName}
            onChange={this.handleNameInput}
            data-test-id={"first-name"}
            placeholder="First Name"
          />
          <input
            id="middleName"
            value={this.state.middleName}
            onChange={this.handleNameInput}
            data-validation-type={"name"}
            data-test-id={"middle-name"}
            placeholder="Middle Name"
          />
          <input
            id="lastName"
            value={this.state.lastName}
            onChange={this.handleNameInput}
            data-validation-type={"name"}
            data-test-id={"last-name"}
            placeholder="Last Name"
          />
        </div>
        <div id="email-phone">
          <input
            id="email"
            value={this.state.email}
            onChange={this.handleInput}
            type="email"
            name="email"
            data-test-id={"email"}
            placeholder="Email"
          />
          <input
            id="phoneNumber"
            value={this.state.phoneNumber}
            onChange={this.handlePhoneInput}
            type="tel"
            name="phone"
            data-test-id={"phone"}
            placeholder="Phone Number"
          />
        </div>
        <div id="address">
          {/* <h3>Address</h3> */}
          <div className="inputs">
            <input
              onChange={this.handleStreetAddress}
              id="streetAddress"
              name="street"
              value={this.state.streetAddress}
              data-test-id={"street"}
              placeholder="Street Address"
            />
            <input
              id="cit"
              value={this.state.city}
              onChange={this.handleInput}
              name="city"
              data-test-id={"city"}
              placeholder="City"
            />
            <input
              onChange={this.handleInput}
              id="sta"
              name="state"
              value={this.state.state}
              data-test-id={"state"}
              placeholder="State"
            />
            <input
              onChange={this.handleInput}
              id="zip"
              name="zip"
              type="number"
              value={this.state.zip}
              data-test-id={"zip"}
              placeholder="Zip"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="danger"
          data-test-id="delete-client"
          onClick={this.handleDelete}
          block>
          Delete
        </Button>
        <Button
          type="submit"
          data-test-id="save-changes"
          onClick={this.handleSubmit}
          block>
          Save
        </Button>
      </Container>
    );
  }
}
function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

const mapDispatchToProps = { getUserClients };
export default connect(mapStateToProps, mapDispatchToProps)(ContactAddEdit);
