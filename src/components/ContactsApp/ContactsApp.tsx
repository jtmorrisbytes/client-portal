import React from "react";
import { connect } from "react-redux";
import { getUserClients, TUser, GUCFAction } from "../../store/user";
import { Button, Container, Row, Col } from "react-bootstrap";
import ContactCard from "./ContactCard/ContactCard";
import "./ContactsApp.css";
interface Props {
  getUserClients: () => Promise<GUCFAction>;
  user: TUser;
}
interface State {
  loading: boolean;
  mappedClients: any[];
}
class ContactsApp extends React.Component<Props, State> {
  state: State = {
    loading: true,
    mappedClients: [],
  };
  renderClients(action: GUCFAction): any[] {
    return action.payload.map((client) => {
      // console.log("renderClients", client);
      return <ContactCard {...client} />;
    });
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
      return <div>Loading</div>;
    } else {
      return (
        <Container>
          <Row id="CurrentUser" className="border my-3">
            <Col xs="auto">
              <img className="userImg" src="https://picsum.photos/75/75" />
            </Col>
            <Col>
              <div className="name lead">
                {this.props.user.firstName || "FirstName"}{" "}
                {this.props.user.lastName || "LastName"}
              </div>
              <div className="phone">
                {this.props.user.phoneNumber || "1234567890"}
              </div>
              <div className="email">
                {this.props.user.email || "placeholder@domain.com"}
              </div>
            </Col>
          </Row>
          <Row className="my-2">
            {/* <Col xs="9">
              <input
                type="text"
                name="search"
                placeholder="Search For somebody"
              />
            </Col> */}
            <Col>
              <Button id="addContact" block>
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
