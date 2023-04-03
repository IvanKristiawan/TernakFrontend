import React, { useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useStateContext } from "../contexts/ContextProvider";

function Login() {
  const { screenSize } = useStateContext();
  const [input1, setInput1] = useState("");

  const cardContainer = {
    width: screenSize >= 650 ? "23rem" : "18rem"
  };

  return (
    <Container>
      <Card style={cardContainer}>
        <Card.Header style={headerContainer}>
          <p style={headerText}>TECHKU</p>
          <p style={headerText}>(SISTEM INFORMASI ........... ONLINE)</p>
          <p style={headerDetail}>Aplikasi Management ............</p>
        </Card.Header>
        <Card.Body>
          <Card>
            <Card.Header style={headerDetail}>Login Pengguna</Card.Header>
            <Card.Body>
              <Form className="d-flex flex-column">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Control placeholder="Username" className="mb-3" />
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary">Login</Button>
              </Form>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;

const headerContainer = {
  fontWeight: 700,
  textAlign: "center"
};

const headerText = {
  marginBottom: 1
};

const headerDetail = {
  fontSize: 12,
  fontWeight: 500,
  color: "gray"
};
