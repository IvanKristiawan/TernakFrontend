import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahCustomer = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeCustomer, setKodeCustomer] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [alamatCustomer, setAlamatCustomer] = useState("");
  const [kotaCustomer, setKotaCustomer] = useState("");
  const [noTelpCustomer, setNoTelpCustomer] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getCustomerById();
  }, []);

  const getCustomerById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/customers/${id}`, {
      _id: user.id,
      token: user.token
    });
    setKodeCustomer(response.data.kodeCustomer);
    setNamaCustomer(response.data.namaCustomer);
    setAlamatCustomer(response.data.alamatCustomer);
    setKotaCustomer(response.data.kotaCustomer);
    setNoTelpCustomer(response.data.noTelpCustomer);
    setLoading(false);
  };

  const updateCustomer = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateCustomer/${id}`, {
            kodeCustomer,
            namaCustomer,
            alamatCustomer,
            kotaCustomer,
            noTelpCustomer,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate(`/customer/${id}`);
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
      } catch (error) {
        alert(error);
      }
      setLoading(false);
    } else {
      setError(true);
      setOpen(!open);
    }
    setValidated(true);
  };

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Customer</h5>
      <hr />
      <Card>
        <Card.Header>Customer</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateCustomer}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Kode :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={kodeCustomer}
                      disabled
                      readOnly
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
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaCustomer}
                      onChange={(e) =>
                        setNamaCustomer(e.target.value.toUpperCase())
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
                    Alamat :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={alamatCustomer}
                      onChange={(e) =>
                        setAlamatCustomer(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Row>
                <Col sm={6}>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextPassword"
                  >
                    <Form.Label column sm="3" style={textRight}>
                      Kota :
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        value={kotaCustomer}
                        onChange={(e) =>
                          setKotaCustomer(e.target.value.toUpperCase())
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
                      No. Telp :
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        value={noTelpCustomer}
                        onChange={(e) =>
                          setNoTelpCustomer(e.target.value.toUpperCase())
                        }
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Row>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/customer")}
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                type="submit"
              >
                Edit
              </Button>
            </Box>
          </Form>
        </Card.Body>
      </Card>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default UbahCustomer;

const alertBox = {
  width: "100%"
};
