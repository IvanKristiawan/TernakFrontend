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

const TampilBeliChild = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id, idBeliChild } = useParams();
  const [tempIdBeliChild, setTempIdBeliChild] = useState("");
  const [noNotaBeli, setNoNotaBeli] = useState("");
  const [kodeStok, setKodeStok] = useState("");
  const [stok, setStok] = useState("");
  const [tanggalBeli, setTanggalBeli] = useState("");
  const [tanggalBeliDate, setTanggalBeliDate] = useState("");
  const [qtyBeliChild, setQtyBeliChild] = useState("");
  const [hargaBeliChild, setHargaBeliChild] = useState("");
  const [subtotalBeliChild, setSubtotalBeliChild] = useState("");
  const [isPost, setIsPost] = useState("");

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  let today = new Date();
  let isEditableManager = user.tipeUser !== "ADMIN" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADMIN" &&
    tanggalBeliDate?.getFullYear() === today.getFullYear() &&
    tanggalBeliDate?.getMonth() === today.getMonth() &&
    tanggalBeliDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getBeliChildById();
  }, []);

  const getBeliChildById = async () => {
    if (id) {
      const response = await axios.post(
        `${tempUrl}/belisChild/${idBeliChild}`,
        {
          _id: user.id,
          token: user.token
        }
      );
      setTempIdBeliChild(response.data.id);
      setNoNotaBeli(response.data.beli.noNotaBeli);
      setKodeStok(response.data.stok.kodeStok);
      setStok(
        `${response.data.stok.kodeStok} - ${response.data.stok.namaStok}`
      );
      let newTglBeli = new Date(response.data.tanggalBeli);
      let tempTglBeli = `${newTglBeli.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${(newTglBeli.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${newTglBeli.getFullYear()}`;
      setTanggalBeli(tempTglBeli);
      setTanggalBeliDate(response.data.tanggalBeli);
      setIsPost(response.data.isPost);
      setQtyBeliChild(response.data.qtyBeliChild);
      setHargaBeliChild(response.data.hargaBeliChild);
      setSubtotalBeliChild(response.data.subtotalBeliChild);
    }
  };

  const deleteBeliChild = async (id) => {
    try {
      setLoading(true);
      // Delete Beli Child
      await axios.post(`${tempUrl}/deleteBeliChild/${tempIdBeliChild}`, {
        kodeStok,
        beliId: id,
        qtyBeliChild,
        subtotalBeliChild,
        _id: user.id,
        token: user.token
      });
      setLoading(false);
      navigate(`/daftarBeli/beli/${id}`);
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
      <h5 style={{ fontWeight: 400 }}>Detail Beli</h5>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(`/daftarBeli/beli/${id}`)}
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
            <Button onClick={() => deleteBeliChild(id)}>Ok</Button>
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
                navigate(`/daftarBeli/beli/${id}/${idBeliChild}/edit`);
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
        <Card.Header>Detail Beli</Card.Header>
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
                    Kuantitas :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={qtyBeliChild.toLocaleString("en-US")}
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
                      value={hargaBeliChild.toLocaleString("en-US")}
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
                      value={subtotalBeliChild.toLocaleString("en-US")}
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

export default TampilBeliChild;

const deleteButtonContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
