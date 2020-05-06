import React from "react";
import { connect } from "react-redux";
import { getUserClients, TUser, GUCFAction } from "../../store/user";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface Props {
  firstName: string;
  lastName: string;
}
interface State {}
class ContactCard extends React.Component<Props, State> {
  state: State = {};

  componentDidMount() {}
  render() {
    return (
      <Row className="ContactCard x-2">
        <Col xs="auto">
          <img src="https://picsum.photos/50/50" />
        </Col>
        <Col>
          <div> {this.props.firstName}</div>
          <div>{this.props.lastName}</div>
        </Col>
        <Col xs="2">
          <FontAwesomeIcon icon="phone-alt" />
        </Col>
        <Col xs="2">
          <FontAwesomeIcon icon="envelope" />
        </Col>
        <Col xs="2">
          <FontAwesomeIcon icon="comment" />
        </Col>
      </Row>
    );
  }
}
function mapStateToProps(state: any) {
  const {} = state;
  return {};
}
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ContactCard);
