import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const UbahJual = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noNotaJual, setNoNotaJual] = useState("");
  const [inputTanggalJual, setInputTanggalJual] = useState("");
  const [kodeCustomer, setKodeCustomer] = useState("");

  const [customers, setCustomers] = useState([]);
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
    getJualById();
    getCustomersData();
  }, []);

  const getCustomersData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/customers`, {
      _id: user.id,
      token: user.token
    });
    setCustomers(response.data);
  };

  const getJualById = async () => {
    setLoading(true);
    const pickedJual = await axios.post(`${tempUrl}/juals/${id}`, {
      _id: user.id,
      token: user.token
    });
    setNoNotaJual(pickedJual.data.noNotaJual);
    let newTanggalJual = new Date(pickedJual.data.tanggalJual);
    let tempTanggalJual = `${newTanggalJual.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTanggalJual.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTanggalJual.getFullYear()}`;
    setInputTanggalJual(tempTanggalJual);
    setKodeCustomer(pickedJual.data.customer.kodeCustomer);
    setLoading(false);
  };

  const updateJual = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateJual/${id}`, {
          userIdUpdate: user.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate(`/daftarJual/jual/${id}`);
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

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h3>Transaksi</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Jual</h5>
      <hr />
      <Card>
        <Card.Header>Jual</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateJual}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    No. Nota :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={noNotaJual}
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
                    Tanggal :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={inputTanggalJual}
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
                    Customer :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={kodeCustomer}
                      onChange={(e) => {
                        setKodeCustomer(e.target.value);
                      }}
                    >
                      {customers.map((customer, index) => (
                        <option value={customer.kodeCustomer}>
                          {customer.kodeCustomer} - {customer.namaCustomer}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/daftarJual/jual/${id}`)}
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
              >
                Simpan
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

export default UbahJual;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const subTitleText = {
  fontWeight: "900"
};

const dialogContainer = {
  display: "flex",
  flexDirection: "column",
  padding: 4,
  width: "800px"
};

const dialogWrapper = {
  width: "100%",
  marginTop: 2
};
