import React from "react";
import { connect } from "react-redux";
import { getUserClients, TUser, GUCFAction } from "../../store/user";
import { Button, Container, Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import ContactCard from "./ContactCard/ContactCard";
import "./ContactsApp.css";
interface Props extends RouteComponentProps {
  getUserClients: () => Promise<GUCFAction>;
  user: TUser;
}
interface State {
  loading: boolean;
  mappedClients: any[];
}

function UserCard(props: TUser) {
  return (
    <Container data-test-id={`current-user-${props.id}`} id="CurrentUser">
      <Row className="border my-3">
        <Col xs="auto">
          <img className="userImg" src="https://picsum.photos/75/75" />
        </Col>
        <Col>
          <div className="name lead">
            {props.firstName || "FirstName"} {props.lastName || "LastName"}
          </div>
          <div className="phone">{props.phoneNumber || "1234567890"}</div>
          <div className="email">{props.email || "placeholder@domain.com"}</div>
        </Col>
      </Row>
    </Container>
  );
}

class ContactsApp extends React.Component<Props, State> {
  state: State = {
    loading: true,
    mappedClients: [],
  };
  renderClients(action: GUCFAction): any[] {
    return action.payload.map((client) => {
      // console.log("renderClients", client);
      return <ContactCard history={this.props.history} {...client} />;
    });
  }
  redirectToAdd() {
    this.props.history.push("/contacts/add");
  }
  componentDidMount() {
    this.props.getUserClients().then((action: GUCFAction) => {
      console.log("componentdidmount clients", action.payload);
      this.setState({
        ...this.state,
        mappedClients: this.renderClients(action || []),
        loading: false,
      });
    });
    this.setState({ ...this.state, loading: false });
  }
  render() {
    console.log("Contacts Current User", this.props.user);
    if (this.props.user.loading || this.state.loading) {
      return <UserCard {...this.props.user} />;
    } else {
      return (
        <Container>
          <UserCard {...this.props.user} />
          <Row className="my-2">
            {/* <Col xs="9">
              <input
                type="text"
                name="search"
                placeholder="Search For somebody"
              />
            </Col> */}
            <Col>
              <Button
                onClick={this.redirectToAdd.bind(this)}
                data-test-id={"add-contact"}
                id="addContact"
                block>
                Add Contact
              </Button>
            </Col>
          </Row>
          <Container className="ContactCards">
            {this.state.mappedClients}
          </Container>
        </Container>
      );
    }
  }
}
function mapStateToProps(state: any) {
  const { router, user } = state;
  return {
    router,
    user,
  };
}
const mapDispatchToProps = { getUserClients };
export default connect(mapStateToProps, mapDispatchToProps)(ContactsApp);
