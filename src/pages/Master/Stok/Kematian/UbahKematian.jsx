import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const UbahKematian = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [inputTanggalKematian, setInputTanggalKematian] = useState("");
  const [qtyKematian, setQtyKematian] = useState("");
  const [kodeStok, setKodeStok] = useState("");

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
    getKematianById();
  }, []);

  const getKematianById = async () => {
    setLoading(true);
    const pickedKematian = await axios.post(`${tempUrl}/kematians/${id}`, {
      _id: user.id,
      token: user.token
    });
    let newTanggalKematian = new Date(pickedKematian.data.tanggalKematian);
    let tempTanggalKematian = `${newTanggalKematian
      .getDate()
      .toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${(newTanggalKematian.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTanggalKematian.getFullYear()}`;
    setInputTanggalKematian(tempTanggalKematian);
    setQtyKematian(pickedKematian.data.qtyKematian.toLocaleString("en-US"));
    setKodeStok(
      `${pickedKematian.data.stok.kodeStok} - ${pickedKematian.data.stok.namaStok}`
    );
    setLoading(false);
  };

  const updateKematian = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateKematian/${id}`, {
          qtyKematian,
          userIdUpdate: user.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate(`/kematian/${id}`);
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
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Kematian</h5>
      <hr />
      <Card>
        <Card.Header>Kematian</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateKematian}>
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
                      value={inputTanggalKematian}
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
                    Kuantitas :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={qtyKematian}
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
                        setQtyKematian(tempNum);
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
                    Stok :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control required value={kodeStok} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/kematian/${id}`)}
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

export default UbahKematian;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const subTitleText = {
  fontWeight: "900"
};
