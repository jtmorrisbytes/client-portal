import React from "react";
import { Container, Row, Col, FormLabel } from "react-bootstrap";

import "./ContactAddEdit.css";

interface Props {}
interface State {}
{
  /* <Col data-test-id={"user-image-container"}>
<img src="https://picsum.photos/100/100" />
</Col>
<Col data-test-id={"user-names-container"}>
<input
  name="fName"
  data-test-id={"user-first-name"}
  placeholder="First Name"
/>
{/* <input name='fName' data-test-id={"user-first-name"} placeholder="First Name" /> */
}
{
  /* <input
  name="lName"
  data-test-id={"user-last-name"}
  placeholder="Last Name"
/> */
}
// </Col>

class ContactAddEdit extends React.Component<Props, State> {
  render() {
    return (
      <Container id="ContactAddEdit" data-test-id={"contact-add-edit"}>
        <Row>
          <Col>
            <Container>
              <Row>
                <Col>
                  <img
                    data-test-id={"user-img"}
                    src="https://picsum.photos/100/100"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label>Email:</label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <label>Phone Number:</label>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col>
            <Row>
              <input placeholder="First Name" />
              <input placeholder="Middle Name" />
              <input placeholder="Last Name" />
            </Row>
            <Row>
              <input placeholder="Email" />
            </Row>
            <Row>
              <input placeholder="Phone Number" />
            </Row>
          </Col>
        </Row>
        <Row>
          <Container>
            <Row>
              <Col className="text-center">
                <h3>Address</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <input placeholder="Street Address" />
              </Col>
            </Row>
            <Row>
              <Col>
                <input placeholder="City" />
              </Col>
            </Row>
            <Row>
              <Col>
                <input placeholder="State" />
              </Col>
              <Col>
                <input placeholder="State" />
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default ContactAddEdit;
