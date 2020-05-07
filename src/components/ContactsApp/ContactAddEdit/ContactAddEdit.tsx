import React from "react";
import { Container, Row, Col, FormLabel } from "react-bootstrap";

interface Props {}
interface State {}

class ContactAddEdit extends React.Component<Props, State> {
  render() {
    return (
      <Container id="ContactAddEdit" data-test-id={"contact-add-edit"}>
        <Row className="names-image-container">
          <Col data-test-id={"user-image-container"}>
            <img src="https://picsum.photos/100/100" />
          </Col>
          <Col data-test-id={"user-names-container"}>
            <input
              name="fName"
              data-test-id={"user-first-name"}
              placeholder="First Name"
            />
            {/* <input name='fName' data-test-id={"user-first-name"} placeholder="First Name" /> */}
            <input
              name="lName"
              data-test-id={"user-last-name"}
              placeholder="Last Name"
            />
          </Col>
        </Row>
        <Row>
          <Container>
            <Row>
              <Col className="text-center">
                <FormLabel htmlFor="email">Email: </FormLabel>
              </Col>
              <Col>
                <input id="email" />
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default ContactAddEdit;
