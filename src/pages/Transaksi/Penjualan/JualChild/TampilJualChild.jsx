import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonGroup
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

const TampilJualChild = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id, idJualChild } = useParams();
  const [tempIdJualChild, setTempIdJualChild] = useState("");
  const [noNotaJual, setNoNotaJual] = useState("");
  const [kodeStok, setKodeStok] = useState("");
  const [stok, setStok] = useState("");
  const [tanggalJual, setTanggalJual] = useState("");
  const [tanggalJualDate, setTanggalJualDate] = useState("");
  const [qtyJualChild, setQtyJualChild] = useState("");
  const [hargaJualChild, setHargaJualChild] = useState("");
  const [subtotalJualChild, setSubtotalJualChild] = useState("");
  const [isPost, setIsPost] = useState("");

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  let today = new Date();
  let isEditableManager = user.tipeUser !== "ADMIN" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADMIN" &&
    tanggalJualDate?.getFullYear() === today.getFullYear() &&
    tanggalJualDate?.getMonth() === today.getMonth() &&
    tanggalJualDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getJualChildById();
  }, []);

  const getJualChildById = async () => {
    if (id) {
      const response = await axios.post(
        `${tempUrl}/jualsChild/${idJualChild}`,
        {
          _id: user.id,
          token: user.token
        }
      );
      setTempIdJualChild(response.data.id);
      setNoNotaJual(response.data.jual.noNotaJual);
      setKodeStok(response.data.stok.kodeStok);
      setStok(
        `${response.data.stok.kodeStok} - ${response.data.stok.namaStok}`
      );
      let newTglJual = new Date(response.data.tanggalJual);
      let tempTglJual = `${newTglJual.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${(newTglJual.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${newTglJual.getFullYear()}`;
      setTanggalJual(tempTglJual);
      setTanggalJualDate(response.data.tanggalJual);
      setIsPost(response.data.isPost);
      setQtyJualChild(response.data.qtyJualChild);
      setHargaJualChild(response.data.hargaJualChild);
      setSubtotalJualChild(response.data.subtotalJualChild);
    }
  };

  const deleteJualChild = async (id) => {
    try {
      setLoading(true);
      // Delete Jual Child
      await axios.post(`${tempUrl}/deleteJualChild/${tempIdJualChild}`, {
        kodeStok,
        jualId: id,
        qtyJualChild,
        subtotalJualChild,
        _id: user.id,
        token: user.token
      });
      setLoading(false);
      navigate(`/daftarJual/jual/${id}`);
    } catch (error) {
      alert(error);
    }
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
      <h5 style={{ fontWeight: 400 }}>Detail Jual</h5>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(`/daftarJual/jual/${id}`)}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={deleteButtonContainer}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Hapus Data`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {`Yakin ingin menghapus data ${stok}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => deleteJualChild(id)}>Ok</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {isEditable && (
          <ButtonGroup variant="contained">
            <Button
              color="primary"
              startIcon={<EditIcon />}
              sx={{ textTransform: "none" }}
              onClick={() => {
                navigate(`/daftarJual/jual/${id}/${idJualChild}/edit`);
              }}
            >
              Ubah
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              sx={{ textTransform: "none" }}
              onClick={handleClickOpen}
            >
              Hapus
            </Button>
          </ButtonGroup>
        )}
      </Box>
      <hr />
      <Card>
        <Card.Header>Detail Jual</Card.Header>
        <Card.Body>
          <Form>
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
                    Kuantitas :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={qtyJualChild.toLocaleString()}
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
                    Harga :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={hargaJualChild.toLocaleString()}
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
                    Subtotal :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={subtotalJualChild.toLocaleString()}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TampilJualChild;

const deleteButtonContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
