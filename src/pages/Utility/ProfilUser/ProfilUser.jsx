import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { useStateContext } from "../../../contexts/ContextProvider";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Button, ButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ProfilUser = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Profil User</h5>
      <Container className="d-flex justify-content-center">
        <ButtonGroup variant="contained">
          <Button
            color="primary"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => {
              navigate(`/profilUser/${user.id}/edit`);
            }}
          >
            Ubah Password
          </Button>
        </ButtonGroup>
      </Container>
      <hr />
      <Container>
        <Form>
          <Row>
            <Col sm={6}>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="3" style={textRight}>
                  Username :
                </Form.Label>
                <Col sm="9">
                  <Form.Control value={user.username} disabled readOnly />
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
                  Tipe User :
                </Form.Label>
                <Col sm="9">
                  <Form.Control value={user.tipeUser} disabled readOnly />
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Container>
    </Container>
  );
};

export default ProfilUser;
