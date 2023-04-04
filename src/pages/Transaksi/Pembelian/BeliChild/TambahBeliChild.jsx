import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahBeliChild = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noNotaBeli, setNoNotaBeli] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [tanggalBeli, setTanggalBeli] = useState("");
  const [tanggalBeliDate, setTanggalBeliDate] = useState("");
  const [qtyBeliChild, setQtyBeliChild] = useState("");
  const [hargaBeliChild, setHargaBeliChild] = useState("");
  const [subtotalBeliChild, setSubtotalBeliChild] = useState("");
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
    getBeliChild();
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

  const getBeliChild = async () => {
    setLoading(true);
    const pickedBeli = await axios.post(`${tempUrl}/belis/${id}`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setNoNotaBeli(pickedBeli.data.noNotaBeli);
    setSupplierId(pickedBeli.data.supplierId);
    let newTanggalBeli = new Date(pickedBeli.data.tanggalBeli);
    let tempTanggalBeli = `${newTanggalBeli.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTanggalBeli.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTanggalBeli.getFullYear()}`;
    setTanggalBeli(tempTanggalBeli);
    setTanggalBeliDate(pickedBeli.data.tanggalBeli);
    setLoading(false);
  };

  const saveBeliChild = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveBeliChild`, {
          tanggalBeli: tanggalBeliDate,
          qtyBeliChild: qtyBeliChild.replace(/,/g, ""),
          hargaBeliChild: hargaBeliChild.replace(/,/g, ""),
          subtotalBeliChild: subtotalBeliChild.replace(/,/g, ""),
          beliId: id,
          kodeStok,
          supplierId,
          userIdInput: user.id,
          kodeCabang: user.cabang.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate(`/daftarBeli/beli/${id}`);
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
      <h5 style={{ fontWeight: 400 }}>Tambah Detail Beli</h5>
      <Typography sx={subTitleText}>
        Periode : {user.tutupperiode.namaPeriode}
      </Typography>
      <hr />
      <Card>
        <Card.Header>Detail Beli</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveBeliChild}>
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
                    <Form.Control
                      required
                      value={tanggalBeli}
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
                      value={qtyBeliChild}
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
                        setQtyBeliChild(tempNum);
                        setSubtotalBeliChild(
                          (
                            tempNum.replace(/,/g, "") * hargaBeliChild
                          ).toLocaleString()
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
                      value={hargaBeliChild}
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
                        setHargaBeliChild(tempNum);
                        setSubtotalBeliChild(
                          (
                            tempNum.replace(/,/g, "") * qtyBeliChild
                          ).toLocaleString()
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
                      value={subtotalBeliChild}
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
                onClick={() => navigate(`/daftarBeli/beli/${id}`)}
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

export default TambahBeliChild;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const subTitleText = {
  fontWeight: "900"
};
