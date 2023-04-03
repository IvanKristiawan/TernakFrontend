import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { useStateContext } from "../../../contexts/ContextProvider";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahProfilUser = () => {
  const { screenSize } = useStateContext();
  const { user, dispatch } = useContext(AuthContext);
  const [kodeCabang, setKodeCabang] = useState("");
  const [username, setUsername] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/findUser/${id}`, {
      _id: user.id,
      token: user.token
    });
    setUsername(response.data.username);
    setTipeUser(response.data.tipeUser);
    setKodeCabang(response.data.cabang);
    setLoading(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (password.length === 0) {
      setPassword(user.password);
    }
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/users/${id}`, {
        password,
        _id: user.id,
        token: user.token
      });
      setLoading(false);
      logoutButtonHandler();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const logoutButtonHandler = async (e) => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "13px"
  };

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Password User</h5>
      <hr />
      <Card>
        <Card.Header>User</Card.Header>
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
                    Username :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={username} disabled readOnly />
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
                    <Form.Control value={tipeUser} disabled readOnly />
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Password (baru) :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value.toUpperCase())
                      }
                    />
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
                    Cabang :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={`${kodeCabang.id} - ${kodeCabang.namaCabang}`}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Box sx={spacingTop}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/profilUser")}
              sx={{ marginRight: 2 }}
            >
              {"< Kembali"}
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={updateUser}
            >
              Ubah
            </Button>
          </Box>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UbahProfilUser;

const spacingTop = {
  mt: 4
};
