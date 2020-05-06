import React from "react";
import { connect } from "react-redux";
import { getUserClients, TUser, GUCFAction } from "../../../store/user";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ContactCard.css";
interface Props {
  firstName: string;
  lastName: string;
  id: string | number;
}
interface State {}
class ContactCard extends React.Component<Props, State> {
  state: State = {};

  componentDidMount() {}
  render() {
    return (
      <Row
        id={String(this.props.id)}
        className="ContactCard py-1 border border-dark">
        <Col xs="auto">
          <img src="https://picsum.photos/50/50" />
        </Col>
        <Col>
          <div> {this.props.firstName}</div>
          <div>{this.props.lastName}</div>
        </Col>
        <Col xs="2" className="text-center">
          <FontAwesomeIcon
            fixedWidth
            className="img-fluid mx-auto"
            icon="phone-alt"
          />
        </Col>
        <Col xs="2">
          <FontAwesomeIcon className="text-center" fixedWidth icon="envelope" />
        </Col>
        <Col xs="2">
          <FontAwesomeIcon className="text-center" fixedWidth icon="comment" />
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
