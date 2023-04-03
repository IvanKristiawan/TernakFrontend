import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahStok = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaStok, setNamaStok] = useState("");
  const [namaStokLama, setNamaStokLama] = useState("");
  const [qtyStok, setQtyStok] = useState("");
  const [kodeGroupStok, setKodeGroupStok] = useState("");

  const [groupStoks, setGroupStoks] = useState([]);
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
    getStokById();
    getGroupStoksData();
  }, []);

  const getStokById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/stoks/${id}`, {
      _id: user.id,
      token: user.token
    });
    setNamaStok(response.data.namaStok);
    setNamaStokLama(response.data.namaStok);
    setQtyStok(response.data.qtyStok.toLocaleString());
    setKodeGroupStok(response.data.groupstok.kodeGroupStok);
    setLoading(false);
  };

  const getGroupStoksData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/groupStoks`, {
      _id: user.id,
      token: user.token
    });
    setGroupStoks(response.data);
  };

  const updateStok = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateStok/${id}`, {
            namaStok,
            namaStokLama,
            qtyStok: qtyStok.replace(/,/g, ""),
            kodeGroupStok,
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate(`/stok/${id}`);
        } catch (error) {
          alert(error.response.data.message);
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

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px"
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Stok</h5>
      <hr />
      <Card>
        <Card.Header>Stok</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateStok}>
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
                      value={namaStok}
                      onChange={(e) =>
                        setNamaStok(e.target.value.toUpperCase())
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Kuantitas :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={qtyStok}
                      onChange={(e) => {
                        let tempNum;
                        let isNumNan = isNaN(
                          parseInt(e.target.value.replace(/,/g, ""), 10)
                        );
                        if (isNumNan) {
                          tempNum = "";
                        } else {
                          tempNum = parseInt(
                            e.target.value.replace(/,/g, ""),
                            10
                          ).toLocaleString();
                        }
                        setQtyStok(tempNum);
                      }}
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
                    Group Stok :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={kodeGroupStok}
                      onChange={(e) => {
                        setKodeGroupStok(e.target.value);
                      }}
                    >
                      {groupStoks.map((kategoriJaminan) => (
                        <option value={kategoriJaminan.kodeGroupStok}>
                          {kategoriJaminan.kodeGroupStok} -{" "}
                          {kategoriJaminan.namaGroupStok}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/stok")}
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

export default UbahStok;

const alertBox = {
  width: "100%"
};
