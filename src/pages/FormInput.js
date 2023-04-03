import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { useStateContext } from "../contexts/ContextProvider";

function FormInput() {
  const { screenSize } = useStateContext();
  const [input1, setInput1] = useState("");

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h4>Title</h4>
      <Card>
        <Card.Header>Input Sample</Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    onChange
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={input1}
                      onChange={(e) => setInput1(e.target.value.toUpperCase())}
                      placeholder="Input1"
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Input 2
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control placeholder="Input2" />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Currency
                  </Form.Label>
                  <Col sm="9">
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Rp</InputGroup.Text>
                      <Form.Control
                        placeholder="Currency"
                        aria-label="Currency"
                        aria-describedby="basic-addon1"
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Group
                  </Form.Label>
                  <Col sm="9">
                    <InputGroup className="mb-3">
                      <Form.Control aria-label="First" />
                      <Form.Control aria-label="Last" />
                    </InputGroup>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Disabled
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={input1}
                      onChange={(e) => setInput1(e.target.value.toUpperCase())}
                      placeholder="Input1"
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Readonly
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control placeholder="Input2" readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    TextArea
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control as="textarea" rows={3} />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Select
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select aria-label="Default select example">
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Button variant="primary">Save</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FormInput;
