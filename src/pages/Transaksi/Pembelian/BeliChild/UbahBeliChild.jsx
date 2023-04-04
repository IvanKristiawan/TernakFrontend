import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Colors } from "../../../../constants/styles";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SaveIcon from "@mui/icons-material/Save";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

const UbahBeliChild = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id, idBeliChild } = useParams();
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noNotaBeli, setNoNotaBeli] = useState("");
  const [stok, setStok] = useState("");
  const [kodeStok, setKodeStok] = useState("");
  const [tanggalBeli, setTanggalBeli] = useState("");
  const [qtyBeliChild, setQtyBeliChild] = useState("");
  const [qtyBeliChildBaru, setQtyBeliChildBaru] = useState("");
  const [hargaBeliChild, setHargaBeliChild] = useState("");
  const [hargaBeliChildBaru, setHargaBeliChildBaru] = useState("");
  const [subtotalBeliChild, setSubtotalBeliChild] = useState("");
  const [subtotalBeliChildBaru, setSubtotalBeliChildBaru] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getBeliChildById();
  }, []);

  const getBeliChildById = async () => {
    setLoading(true);
    const pickedBeliChild = await axios.post(
      `${tempUrl}/belisChild/${idBeliChild}`,
      {
        _id: user.id,
        token: user.token
      }
    );
    setNoNotaBeli(pickedBeliChild.data.beli.noNotaBeli);
    setStok(
      `${pickedBeliChild.data.stok.kodeStok} - ${pickedBeliChild.data.stok.namaStok}`
    );
    setKodeStok(pickedBeliChild.data.stok.kodeStok);
    let newTanggalBeli = new Date(pickedBeliChild.data.beli.tanggalBeli);
    let tempTanggalBeli = `${newTanggalBeli.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTanggalBeli.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTanggalBeli.getFullYear()}`;
    setTanggalBeli(tempTanggalBeli);
    setQtyBeliChild(pickedBeliChild.data.qtyBeliChild);
    setQtyBeliChildBaru(pickedBeliChild.data.qtyBeliChild.toLocaleString());
    setHargaBeliChild(pickedBeliChild.data.hargaBeliChild);
    setHargaBeliChildBaru(pickedBeliChild.data.hargaBeliChild.toLocaleString());
    setSubtotalBeliChild(pickedBeliChild.data.subtotalBeliChild);
    setSubtotalBeliChildBaru(
      pickedBeliChild.data.subtotalBeliChild.toLocaleString()
    );
    setLoading(false);
  };

  const updateBeliChild = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateBeliChild/${idBeliChild}`, {
          beliId: id,
          kodeStok,
          qtyBeliChildLama: qtyBeliChild,
          qtyBeliChild: qtyBeliChildBaru.replace(/,/g, ""),
          subtotalBeliChildLama: subtotalBeliChild,
          subtotalBeliChild: subtotalBeliChildBaru.replace(/,/g, ""),
          hargaBeliChild: hargaBeliChildBaru.replace(/,/g, ""),
          userIdUpdate: user.id,
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
      <h5 style={{ fontWeight: 400 }}>Ubah Detail Beli</h5>
      <Typography sx={subTitleText}>
        Periode : {user.tutupperiode.namaPeriode}
      </Typography>
      <hr />
      <Card>
        <Card.Header>Detail Beli</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateBeliChild}>
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
                      value={qtyBeliChildBaru}
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
                        setQtyBeliChildBaru(tempNum);
                        setSubtotalBeliChildBaru(
                          (
                            tempNum.replace(/,/g, "") *
                            hargaBeliChildBaru.replace(/,/g, "")
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
                      value={hargaBeliChildBaru}
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
                        setHargaBeliChildBaru(tempNum);
                        setSubtotalBeliChildBaru(
                          (
                            tempNum.replace(/,/g, "") *
                            qtyBeliChildBaru.replace(/,/g, "")
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
                      value={subtotalBeliChildBaru}
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
                  navigate(`/daftarBeli/beli/${id}/${idBeliChild}`)
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

export default UbahBeliChild;

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
