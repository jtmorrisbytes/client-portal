import React from "react";
import { connect } from "react-redux";
import { getUserClients, TUser, GUCFAction } from "../../store/user";
import { Button, Container, Row, Col } from "react-bootstrap";
import ContactCard from "./ContactCard";
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
      console.log("renderClients", client);
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
    if (this.props.user.loading || this.state.loading) {
      return <div>Loading</div>;
    } else {
      return (
        <Container>
          <Row>
            <Col>
              <Button block>Add Contact</Button>
            </Col>
          </Row>
          <Row>
            <div id="CurrentUser">
              <div className="name">
                {this.props.user.firstName || "FirstName"}{" "}
                {this.props.user.lastName || "LastName"}
              </div>
            </div>
          </Row>
          {this.state.mappedClients}
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
