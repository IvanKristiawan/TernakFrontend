import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahUser = () => {
  const { screenSize } = useStateContext();
  const { user, setting, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeCabang, setKodeCabang] = useState("");
  const [username, setUsername] = useState("");
  const [usernameLama, setUsernameLama] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [password, setPassword] = useState("");

  // Akses Master
  const [stok, setStok] = useState(false);
  const [supplier, setSupplier] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [cabang, setCabang] = useState(false);

  // Akses Transaksi
  const [pembelian, setPembelian] = useState(false);
  const [penjualan, setPenjualan] = useState(false);
  const [kematian, setKematian] = useState(false);

  // Laporan
  const [lapPembelian, setLapPembelian] = useState(false);
  const [lapPenjualan, setLapPenjualan] = useState(false);
  const [lapStok, setLapStok] = useState(false);
  const [lapKematianStok, setLapKematianStok] = useState(false);
  const [lapLabaRugi, setLapLabaRugi] = useState(false);
  const [lapKematian, setLapKematian] = useState(false);

  // Akses Utility
  const [profilUser, setProfilUser] = useState(false);
  const [daftarUser, setDaftarUser] = useState(false);
  const [settingAkses, setSettingAkses] = useState(false);

  const [cabangs, setCabangs] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
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
    getUserById();
  }, []);

  const getCabangsData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/cabangs`, {
      _id: user.id,
      token: user.token,
    });
    setCabangs(response.data);
  };

  const getUserById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/findUser/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setUsername(response.data.username);
    setUsernameLama(response.data.username);
    setTipeUser(response.data.tipeUser);
    setKodeCabang(response.data.cabang.id);

    // Akses Master
    setStok(response.data.akses.stok);
    setSupplier(response.data.akses.supplier);
    setCustomer(response.data.akses.customer);
    setCabang(response.data.akses.cabang);
    setSettingAkses(response.data.akses.setting);

    // Akses Transaksi
    setPembelian(response.data.akses.pembelian);
    setPenjualan(response.data.akses.penjualan);
    setKematian(response.data.akses.kematian);

    // Akses Laporan
    setLapPembelian(response.data.akses.lapPembelian);
    setLapPenjualan(response.data.akses.lapPenjualan);
    setLapStok(response.data.akses.lapStok);
    setLapKematianStok(response.data.akses.lapKematianStok);
    setLapLabaRugi(response.data.akses.lapLabaRugi);
    setLapKematian(response.data.akses.lapKematian);

    // Akses Utility
    setProfilUser(response.data.akses.profilUser);
    setDaftarUser(response.data.akses.daftarUser);
    setSettingAkses(response.data.akses.setting);

    setLoading(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        let tempUsername = await axios.post(`${tempUrl}/getUsername`, {
          username,
          _id: user.id,
          token: user.token,
          kodeCabang: user.cabang.id,
        });
        let isUsernameNotValid =
          tempUsername.data.length > 0 && username !== usernameLama;
        if (isUsernameNotValid) {
          handleClickOpenAlert();
        } else {
          setLoading(true);
          if (password.length === 0) {
            setPassword(user.password);
          }
          await axios.post(`${tempUrl}/users/${id}`, {
            username,
            tipeUser,
            password,
            tipeAdmin: user.tipeUser,
            akses: {
              stok,
              supplier,
              customer,
              cabang,
              pembelian,
              penjualan,
              kematian,
              lapPembelian,
              lapPenjualan,
              lapStok,
              lapKematianStok,
              lapLabaRugi,
              lapKematian,
              profilUser,
              daftarUser,
              setting: settingAkses,
            },
            cabangId: kodeCabang,
            _id: user.id,
            token: user.token,
          });
          setLoading(false);

          if (user.id == id) {
            dispatch({ type: "LOGOUT" });
            navigate("/");
          } else {
            navigate("/daftarUser");
          }
        }
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

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px",
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah User</h5>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
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
          <Button onClick={handleCloseAlert}>Ok</Button>
        </DialogActions>
      </Dialog>
      <hr />
      <Card>
        <Card.Header>User</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateUser}>
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
                  </Form>
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
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Kematian"
                      checked={kematian}
                      onChange={() => setKematian(!kematian)}
                    />
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
                      label="Stok"
                      checked={lapStok}
                      onChange={() => setLapStok(!lapStok)}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Kematian Stok"
                      checked={lapKematianStok}
                      onChange={() => setLapKematianStok(!lapKematianStok)}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Laba Rugi"
                      checked={lapLabaRugi}
                      onChange={() => setLapLabaRugi(!lapLabaRugi)}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Lap. Kematian"
                      checked={lapKematian}
                      onChange={() => setLapKematian(!lapKematian)}
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
                startIcon={<EditIcon />}
                type="submit"
              >
                Edit
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

export default UbahUser;

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row",
  },
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw",
  },
};

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};

const secondWrapper = {
  marginLeft: {
    sm: 4,
  },
  marginTop: {
    sm: 0,
    xs: 4,
  },
};

const checkboxTitle = {
  marginBottom: 0,
};

const secondCheckboxTitle = {
  marginTop: 15,
  marginBottom: 0,
};
