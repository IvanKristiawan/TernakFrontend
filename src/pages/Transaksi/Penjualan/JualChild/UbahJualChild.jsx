import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const UbahJualChild = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id, idJualChild } = useParams();
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noNotaJual, setNoNotaJual] = useState("");
  const [stok, setStok] = useState("");
  const [kodeStok, setKodeStok] = useState("");
  const [tanggalJual, setTanggalJual] = useState("");
  const [qtyJualChild, setQtyJualChild] = useState("");
  const [qtyJualChildBaru, setQtyJualChildBaru] = useState("");
  const [hargaJualChild, setHargaJualChild] = useState("");
  const [hargaJualChildBaru, setHargaJualChildBaru] = useState("");
  const [subtotalJualChild, setSubtotalJualChild] = useState("");
  const [subtotalJualChildBaru, setSubtotalJualChildBaru] = useState("");

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
    getJualChildById();
  }, []);

  const getJualChildById = async () => {
    setLoading(true);
    const pickedJualChild = await axios.post(
      `${tempUrl}/jualsChild/${idJualChild}`,
      {
        _id: user.id,
        token: user.token
      }
    );
    setNoNotaJual(pickedJualChild.data.jual.noNotaJual);
    setStok(
      `${pickedJualChild.data.stok.kodeStok} - ${pickedJualChild.data.stok.namaStok}`
    );
    setKodeStok(pickedJualChild.data.stok.kodeStok);
    let newTanggalJual = new Date(pickedJualChild.data.jual.tanggalJual);
    let tempTanggalJual = `${newTanggalJual.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTanggalJual.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTanggalJual.getFullYear()}`;
    setTanggalJual(tempTanggalJual);
    setQtyJualChild(pickedJualChild.data.qtyJualChild);
    setQtyJualChildBaru(
      pickedJualChild.data.qtyJualChild.toLocaleString("en-US")
    );
    setHargaJualChild(pickedJualChild.data.hargaJualChild);
    setHargaJualChildBaru(
      pickedJualChild.data.hargaJualChild.toLocaleString("en-US")
    );
    setSubtotalJualChild(pickedJualChild.data.subtotalJualChild);
    setSubtotalJualChildBaru(
      pickedJualChild.data.subtotalJualChild.toLocaleString("en-US")
    );
    setLoading(false);
  };

  const updateJualChild = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateJualChild/${idJualChild}`, {
          jualId: id,
          kodeStok,
          qtyJualChildLama: qtyJualChild,
          qtyJualChild: qtyJualChildBaru.replace(/,/g, ""),
          subtotalJualChildLama: subtotalJualChild,
          subtotalJualChild: subtotalJualChildBaru.replace(/,/g, ""),
          hargaJualChild: hargaJualChildBaru.replace(/,/g, ""),
          userIdUpdate: user.id,
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
      <h5 style={{ fontWeight: 400 }}>Ubah Detail Jual</h5>
      <hr />
      <Card>
        <Card.Header>Detail Jual</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateJualChild}>
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
                    <Form.Control required value={stok} disabled readOnly />
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
                      value={qtyJualChildBaru}
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
                        setQtyJualChildBaru(tempNum);
                        setSubtotalJualChildBaru(
                          (
                            tempNum.replace(/,/g, "") *
                            hargaJualChildBaru.replace(/,/g, "")
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
                      value={hargaJualChildBaru}
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
                        setHargaJualChildBaru(tempNum);
                        setSubtotalJualChildBaru(
                          (
                            tempNum.replace(/,/g, "") *
                            qtyJualChildBaru.replace(/,/g, "")
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
                      value={subtotalJualChildBaru}
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
                onClick={() =>
                  navigate(`/daftarJual/jual/${id}/${idJualChild}`)
                }
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

export default UbahJualChild;

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
