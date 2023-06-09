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

const TambahBeli = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noNotaBeli, setNoNotaBeli] = useState("");
  const [inputTanggalBeli, setInputTanggalBeli] = useState(new Date());
  const [kodeSupplier, setKodeSupplier] = useState("");

  const [suppliers, setSuppliers] = useState([]);
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
    getNextKodeBeli();
    getSuppliersData();
  }, []);

  const getSuppliersData = async (kodeUnit) => {
    setKodeSupplier("");
    const response = await axios.post(`${tempUrl}/suppliers`, {
      _id: user.id,
      token: user.token,
    });
    setSuppliers(response.data);
    setKodeSupplier(response.data[0].kodeSupplier);
  };

  const getNextKodeBeli = async () => {
    setLoading(true);
    const nextKodeBeli = await axios.post(`${tempUrl}/beliNextKode`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id,
    });
    setNoNotaBeli(nextKodeBeli.data);
    setLoading(false);
  };

  const saveBeli = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        let savedBeli = await axios.post(`${tempUrl}/saveBeli`, {
          tanggalBeli: inputTanggalBeli,
          kodeSupplier,
          userIdInput: user.id,
          kodeCabang: user.cabang.id,
          _id: user.id,
          token: user.token,
        });
        setLoading(false);
        navigate(`/daftarBeli/beli/${savedBeli.data.id}`);
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
      <h5 style={{ fontWeight: 400 }}>Tambah Beli</h5>
      <hr />
      <Card>
        <Card.Header>Beli</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveBeli}>
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
                      value={noNotaBeli}
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
                      selected={inputTanggalBeli}
                      customInput={<Form.Control required />}
                      onChange={(date) => setInputTanggalBeli(date)}
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
                    Supplier :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={kodeSupplier}
                      onChange={(e) => {
                        setKodeSupplier(e.target.value);
                      }}
                    >
                      {suppliers.map((supplier, index) => (
                        <option value={supplier.kodeSupplier}>
                          {supplier.kodeSupplier} - {supplier.namaSupplier}
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
                onClick={() => navigate("/daftarBeli")}
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

export default TambahBeli;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};

const subTitleText = {
  fontWeight: "900",
};
