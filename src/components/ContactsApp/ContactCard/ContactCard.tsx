import React from "react";
import { connect } from "react-redux";
import { getUserClients, TUser, GUCFAction } from "../../../store/user";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, RouteComponentProps } from "react-router-dom";
import "./ContactCard.css";
interface Props extends RouteComponentProps {
  firstName: string;
  lastName: string;
  id: string | number;
  email: string;
  phoneNumber: string;
}
interface State {}
class ContactCard extends React.Component<Props, State> {
  ref;
  state: State = {};
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  goToContactView(e) {
    if (this.ref.current.id === e.target.id) {
      console.log(this.props);
      if (this.props.history) {
        this.props.history.push(`/contacts/edit/${this.props.id}`);
      } else {
        console.log("the react router is not connected to this component ");
      }
    }
  }
  componentDidMount() {}
  render() {
    return (
      <Row
        ref={this.ref}
        // onClick={this.goToContactView.bind(this)}
        id={String(this.props.id)}
        className="ContactCard py-1 border border-dark">
        <Col xs="auto">
          <Link to={`/contacts/edit/${this.props.id}`}>
            <img src="https://picsum.photos/50/50" />
          </Link>
        </Col>
        <Col xs="3" sm="4" lg="7" xl="8" data-test-id={`name-${this.props.id}`}>
          <Link to={`/contacts/edit/${this.props.id}`}>
            <div> {this.props.firstName}</div>
            <div>{this.props.lastName}</div>
          </Link>
        </Col>
        {this.props.phoneNumber ? (
          <Col xs="auto" className="text-center">
            <a
              className="tel"
              data-test-id={`tel-${this.props.id}`}
              href={`tel:${this.props.phoneNumber}`}>
              <FontAwesomeIcon
                fixedWidth
                className="img-fluid mx-auto"
                icon="phone-alt"
              />
            </a>
          </Col>
        ) : null}
        {this.props.email ? (
          <Col xs="auto">
            <a
              className="email"
              data-test-id={`email-${this.props.id}`}
              href={`mailto:${this.props.email}`}>
              <FontAwesomeIcon
                className="text-center"
                fixedWidth
                icon="envelope"
              />
            </a>
          </Col>
        ) : null}
        {this.props.phoneNumber ? (
          <Col xs="auto">
            <a
              className="sms"
              data-test-id={`phone-${this.props.id}`}
              href={`sms:${this.props.phoneNumber}`}>
              <FontAwesomeIcon
                className="text-center"
                fixedWidth
                icon="comment"
              />
            </a>
          </Col>
        ) : null}
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
