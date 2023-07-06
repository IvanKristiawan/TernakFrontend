import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahJualChild = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noNotaJual, setNoNotaJual] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [tanggalJual, setTanggalJual] = useState("");
  const [tanggalJualDate, setTanggalJualDate] = useState("");
  const [qtyJualChild, setQtyJualChild] = useState("");
  const [hargaJualChild, setHargaJualChild] = useState("");
  const [subtotalJualChild, setSubtotalJualChild] = useState("");
  const [kodeStok, setKodeStok] = useState("");

  const [stoks, setStoks] = useState([]);
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
    getStoksData();
    getJualChild();
  }, []);

  const getStoksData = async (kodeUnit) => {
    setKodeStok("");
    const response = await axios.post(`${tempUrl}/stoks`, {
      _id: user.id,
      token: user.token
    });
    setStoks(response.data);
    setKodeStok(response.data[0].kodeStok);
  };

  const getJualChild = async () => {
    setLoading(true);
    const pickedJual = await axios.post(`${tempUrl}/juals/${id}`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setNoNotaJual(pickedJual.data.noNotaJual);
    setCustomerId(pickedJual.data.customerId);
    let newTanggalJual = new Date(pickedJual.data.tanggalJual);
    let tempTanggalJual = `${newTanggalJual.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTanggalJual.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTanggalJual.getFullYear()}`;
    setTanggalJual(tempTanggalJual);
    setTanggalJualDate(pickedJual.data.tanggalJual);
    setLoading(false);
  };

  const saveJualChild = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveJualChild`, {
          tanggalJual: tanggalJualDate,
          qtyJualChild: qtyJualChild.replace(/,/g, ""),
          hargaJualChild: hargaJualChild.replace(/,/g, ""),
          subtotalJualChild: subtotalJualChild.replace(/,/g, ""),
          jualId: id,
          kodeStok,
          customerId,
          userIdInput: user.id,
          kodeCabang: user.cabang.id,
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
      <h5 style={{ fontWeight: 400 }}>Tambah Detail Jual</h5>
      <hr />
      <Card>
        <Card.Header>Detail Jual</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveJualChild}>
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
                      value={tanggalJual}
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
                    Stok :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={kodeStok}
                      onChange={(e) => {
                        setKodeStok(e.target.value);
                      }}
                    >
                      {stoks.map((stok, index) => (
                        <option value={stok.kodeStok}>
                          {stok.kodeStok} - {stok.namaStok}
                        </option>
                      ))}
                    </Form.Select>
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
                    Kuantitas :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={qtyJualChild}
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
                          ).toLocaleString("en-US");
                        }
                        setQtyJualChild(tempNum);
                        setSubtotalJualChild(
                          (
                            tempNum.replace(/,/g, "") *
                            hargaJualChild.replace(/,/g, "")
                          ).toLocaleString("en-US")
                        );
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
                    Harga :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={hargaJualChild}
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
                          ).toLocaleString("en-US");
                        }
                        setHargaJualChild(tempNum);
                        setSubtotalJualChild(
                          (
                            tempNum.replace(/,/g, "") *
                            qtyJualChild.replace(/,/g, "")
                          ).toLocaleString("en-US")
                        );
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
                    Subtotal :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={subtotalJualChild}
                      disabled
                      readOnly
                    />
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

export default TambahJualChild;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const subTitleText = {
  fontWeight: "900"
};
