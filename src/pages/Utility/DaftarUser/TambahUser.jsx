import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Alert,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahUser = () => {
  const { screenSize } = useStateContext();
  const { user, setting } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeCabang, setKodeCabang] = useState("");
  const [username, setUsername] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [password, setPassword] = useState("");

  // Akses Master
  const [stok, setStok] = useState(false);
  const [perubahan, setPerubahan] = useState(false);
  const [supplier, setSupplier] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [cabang, setCabang] = useState(false);

  // Akses Transaksi
  const [pembelian, setPembelian] = useState(false);
  const [penjualan, setPenjualan] = useState(false);

  // Akses Laporan
  const [lapPembelian, setLapPembelian] = useState(false);
  const [lapPenjualan, setLapPenjualan] = useState(false);
  const [lapStok, setLapStok] = useState(false);
  const [lapPerubahanStok, setLapPerubahanStok] = useState(false);
  const [lapLabaRugi, setLapLabaRugi] = useState(false);

  // Akses Utility
  const [profilUser, setProfilUser] = useState(false);
  const [daftarUser, setDaftarUser] = useState(false);
  const [settingAkses, setSettingAkses] = useState(false);

  const [cabangs, setCabangs] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openAlertUsername, setOpenAlertUsername] = useState(false);

  const handleClickOpenAlertUsername = () => {
    setOpenAlertUsername(true);
  };

  const handleCloseAlertUsername = () => {
    setOpenAlertUsername(false);
  };

  const tipeUserOption = ["MANAGER", "ADMIN"];
  const tipeUserOptionOwner = ["OWNER", "MANAGER", "ADMIN"];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getCabangsData();
  }, []);

  const getCabangsData = async (kodeUnit) => {
    setKodeCabang("");
    const response = await axios.post(`${tempUrl}/cabangs`, {
      _id: user.id,
      token: user.token
    });
    setCabangs(response.data);
    if (user.tipeUser === "OWNER") {
      setKodeCabang(response.data[0].id);
    } else {
      setKodeCabang(user.cabang.id);
    }
    if (user.tipeUser === "OWNER") {
      setTipeUser(tipeUserOptionOwner[0]);
    } else {
      setTipeUser(tipeUserOption[0]);
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        let tempUsername = await axios.post(`${tempUrl}/getUsername`, {
          username,
          _id: user.id,
          token: user.token
        });

        let isUsernameAlreadyExist = tempUsername.data.length > 0;
        if (isUsernameAlreadyExist) {
          handleClickOpenAlertUsername();
        } else {
          setLoading(true);
          await axios.post(`${tempUrl}/auth/register`, {
            username,
            password,
            tipeUser,
            akses: {
              stok,
              perubahan,
              supplier,
              customer,
              cabang,
              pembelian,
              penjualan,
              lapPembelian,
              lapPenjualan,
              lapStok,
              lapPerubahanStok,
              lapLabaRugi,
              profilUser,
              daftarUser,
              setting: settingAkses
            },
            cabangId: kodeCabang,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate("/daftarUser");
        }
      } catch (err) {
        alert(err);
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

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px"
  };

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah User</h5>
      <Dialog
        open={openAlertUsername}
        onClose={handleCloseAlertUsername}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Username Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Username ${username} sudah ada, ganti Username!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertUsername}>Ok</Button>
        </DialogActions>
      </Dialog>
      <hr />
      <Card>
        <Card.Header>User</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveUser}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Username :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.toUpperCase())
                      }
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
                    Tipe User :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={tipeUser}
                      onChange={(e) => {
                        setTipeUser(e.target.value);
                      }}
                    >
                      {user.tipeUser === "OWNER"
                        ? tipeUserOptionOwner.map((tipeUser) => (
                            <option value={tipeUser}>{tipeUser}</option>
                          ))
                        : tipeUserOption.map((tipeUser) => (
                            <option value={tipeUser}>{tipeUser}</option>
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
                    Password :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value.toUpperCase())
                      }
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
                    Cabang :
                  </Form.Label>
                  <Col sm="9">
                    {user.tipeUser === "OWNER" ? (
                      <Form.Select
                        required
                        value={kodeCabang}
                        onChange={(e) => {
                          setKodeCabang(e.target.value);
                        }}
                      >
                        {cabangs.map((cabang, index) => (
                          <option value={cabang.id}>
                            {cabang.id} - {cabang.namaCabang}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        required
                        value={kodeCabang}
                        disabled
                        readOnly
                      />
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Container style={{ marginTop: 30 }}>
              <h4>Hak Akses User</h4>
              <Box sx={showDataContainer}>
                <Box sx={showDataWrapper}>
                  <p style={checkboxTitle}>Master</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Stok"
                      checked={stok}
                      onChange={() => setStok(!stok)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Perubahan"
                      checked={perubahan}
                      onChange={() => setPerubahan(!perubahan)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Supplier"
                      checked={supplier}
                      onChange={() => setSupplier(!supplier)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Customer"
                      checked={customer}
                      onChange={() => setCustomer(!customer)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Cabang"
                      checked={cabang}
                      onChange={() => setCabang(!cabang)}
                    />
                    <p style={secondCheckboxTitle}>Transaksi</p>
                    <Form>
                      <Form.Check
                        type="checkbox"
                        label="Pembelian"
                        checked={pembelian}
                        onChange={() => setPembelian(!pembelian)}
                      />
                    </Form>
                    <Form>
                      <Form.Check
                        type="checkbox"
                        label="Penjualan"
                        checked={penjualan}
                        onChange={() => setPenjualan(!penjualan)}
                      />
                    </Form>
                  </Form>
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <p style={secondCheckboxTitle}>Laporan</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Lap. Pembelian"
                      checked={lapPembelian}
                      onChange={() => setLapPembelian(!lapPembelian)}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Lap. Penjualan"
                      checked={lapPenjualan}
                      onChange={() => setLapPenjualan(!lapPenjualan)}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Lap. Stok"
                      checked={lapStok}
                      onChange={() => setLapStok(!lapStok)}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Perubahan Stok"
                      checked={lapPerubahanStok}
                      onChange={() => setLapPerubahanStok(!lapPerubahanStok)}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="LabaRugi"
                      checked={lapLabaRugi}
                      onChange={() => setLapLabaRugi(!lapLabaRugi)}
                    />
                  </Form>
                  <p style={secondCheckboxTitle}>Utility</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Profil User"
                      checked={profilUser}
                      onChange={() => setProfilUser(!profilUser)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Daftar User"
                      checked={daftarUser}
                      onChange={() => setDaftarUser(!daftarUser)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Setting"
                      checked={settingAkses}
                      onChange={() => setSettingAkses(!settingAkses)}
                    />
                  </Form>
                </Box>
              </Box>
            </Container>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/daftarUser")}
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

export default TambahUser;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};

const checkboxTitle = {
  marginBottom: 0
};

const secondCheckboxTitle = {
  marginTop: 15,
  marginBottom: 0
};
