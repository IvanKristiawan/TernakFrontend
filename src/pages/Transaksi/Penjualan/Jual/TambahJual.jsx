import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar, Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SaveIcon from "@mui/icons-material/Save";

const TambahJual = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noNotaJual, setNoNotaJual] = useState("");
  const [inputTanggalJual, setInputTanggalJual] = useState(new Date());
  const [kodeCustomer, setKodeCustomer] = useState("");

  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getNextKodeJual();
    getCustomersData();
  }, []);

  const getCustomersData = async (kodeUnit) => {
    setKodeCustomer("");
    const response = await axios.post(`${tempUrl}/customers`, {
      _id: user.id,
      token: user.token,
    });
    setCustomers(response.data);
    setKodeCustomer(response.data[0].kodeCustomer);
  };

  const getNextKodeJual = async () => {
    setLoading(true);
    const nextKodeJual = await axios.post(`${tempUrl}/jualNextKode`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id,
    });
    setNoNotaJual(nextKodeJual.data);
    setLoading(false);
  };

  const saveJual = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        let savedJual = await axios.post(`${tempUrl}/saveJual`, {
          tanggalJual: inputTanggalJual,
          kodeCustomer,
          userIdInput: user.id,
          kodeCabang: user.cabang.id,
          _id: user.id,
          token: user.token,
        });
        setLoading(false);
        navigate(`/daftarJual/jual/${savedJual.data.id}`);
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
    textAlign: screenSize >= 650 && "right",
  };

  return (
    <Container>
      <h3>Transaksi</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Jual</h5>
      <hr />
      <Card>
        <Card.Header>Jual</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveJual}>
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
                    <DatePicker
                      required
                      dateFormat="dd/MM/yyyy"
                      selected={inputTanggalJual}
                      customInput={<Form.Control required />}
                      onChange={(date) => setInputTanggalJual(date)}
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
                onClick={() => navigate("/daftarJual")}
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

export default TambahJual;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};

const subTitleText = {
  fontWeight: "900",
};
