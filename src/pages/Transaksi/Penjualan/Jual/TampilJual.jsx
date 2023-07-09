import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader, usePagination, ButtonModifier } from "../../../../components";
import { ShowTableJualChild } from "../../../../components/ShowTable";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Pagination, ButtonGroup } from "@mui/material";
import jsPDF from "jspdf";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";

const TampilJual = () => {
  const { screenSize } = useStateContext();
  const reportTemplateRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const [noNotaJual, setNoNotaJual] = useState("");
  const [tanggalJual, setTanggalJual] = useState("");
  const [tanggalJualDate, setTanggalJualDate] = useState();
  const [totalJual, setTotalJual] = useState("");
  const [kodeCustomer, setKodeCustomer] = useState("");
  const [isPost, setIsPost] = useState("");
  const [previewPdf, setPreviewPdf] = useState(false);

  const [jualsChildData, setJualsChildData] = useState([]);
  const navigate = useNavigate();
  let today = new Date();
  let isEditableManager = user.tipeUser !== "ADMIN" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADMIN" &&
    tanggalJualDate?.getFullYear() === today.getFullYear() &&
    tanggalJualDate?.getMonth() === today.getMonth() &&
    tanggalJualDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const currentPosts = jualsChildData.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(jualsChildData.length / PER_PAGE);
  const _DATA = usePagination(jualsChildData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("StrukJual");
      },
      html2canvas: { scale: 0.5 },
    });
  };

  useEffect(() => {
    getJualById();
  }, []);

  const getJualById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/juals/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setNoNotaJual(response.data.noNotaJual);
    let newTanggalJual = new Date(response.data.tanggalJual);
    let tempTanggalJual = `${newTanggalJual.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}-${(newTanggalJual.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}-${newTanggalJual.getFullYear()}`;
    setTanggalJual(tempTanggalJual);
    setTanggalJualDate(new Date(response.data.tanggalJual));
    setIsPost(response.data.isPost);
    setTotalJual(response.data.totalJual);
    setKodeCustomer(
      `${response.data.customer.kodeCustomer} - ${response.data.customer.namaCustomer}`
    );
    const response2 = await axios.post(`${tempUrl}/jualsChildByJual`, {
      jualId: response.data.id,
      kodeCabang: user.cabang.id,
      _id: user.id,
      token: user.token,
    });
    setJualsChildData(response2.data);
    setLoading(false);
  };

  const deleteJual = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteJual/${id}`, {
        _id: user.id,
        token: user.token,
      });
      navigate("/daftarJual");
    } catch (error) {
      alert(error);
    }
    setLoading(false);
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
      <h5 style={{ fontWeight: 400 }}>Jual</h5>
      <hr />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/daftarJual")}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={buttonModifierContainer}>
        {isEditable && (
          <>
            <ButtonModifier
              id={id}
              kode={"test"}
              addLink={`/daftarJual/jual/${id}/tambahJualChild`}
              nameAddButton={"Tambah Barang"}
              editLink={`/daftarJual/jual/${id}/edit`}
              deleteUser={deleteJual}
              nameUser={noNotaJual}
            />
          </>
        )}
      </Box>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewPdf(!previewPdf);
            }}
          >
            PDF
          </Button>
        </ButtonGroup>
      </Box>

      {previewPdf && (
        <div>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handleGeneratePdf}
          >
            CETAK
          </Button>
          <div ref={reportTemplateRef} style={cetakContainer}>
            <p style={cetakCenter}>{setting.namaPerusahaan}</p>
            <p style={cetakCenter}>{setting.alamatPerusahaan}</p>
            <p style={cetakCenter}>({setting.kotaPerusahaan})</p>
            <p style={cetakCenter}>{setting.provinsiPerusahaan}</p>
            <p style={cetakCenter}>NO. TELP. {setting.teleponPerusahaan}</p>
            <hr />
            <p style={cetakCenter}>STRUK PENJUALAN</p>
            <p style={cetakCenterBold}>No. Nota {noNotaJual}</p>
            <p style={cetakCenter}>Tanggal {tanggalJual}</p>
            <hr />
            {jualsChildData.map((user, index) => (
              <>
                <p style={cetakCenter}> {user.stok.namaStok}</p>
                <p style={cetakCenter}>
                  {user.qtyJualChild.toLocaleString("en-US")} x{" "}
                  {user.hargaJualChild.toLocaleString("en-US")} |{" "}
                  {user.subtotalJualChild.toLocaleString("en-US")}
                </p>
              </>
            ))}
            <p style={cetakCenterBold}>
              Total : Rp {totalJual.toLocaleString("en-US")}
            </p>
          </div>
        </div>
      )}

      <Form>
        <Card>
          <Card.Header>Jual</Card.Header>
          <Card.Body>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    No. Nota :
                  </Form.Label>
                  <Col sm="8">
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
                  <Form.Label column sm="4" style={textRight}>
                    Tgl. Jual :
                  </Form.Label>
                  <Col sm="8">
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
                  <Form.Label column sm="4" style={textRight}>
                    Customer :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodeCustomer} disabled readOnly />
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
                  <Form.Label column sm="4" style={textRight}>
                    Total :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={totalJual.toLocaleString("en-US")}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Form>
      <Box sx={tableContainer}>
        <ShowTableJualChild id={id} currentPosts={currentPosts} />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Container>
  );
};

export default TampilJual;

const buttonModifierContainer = {
  mt: 4,
  mb: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center",
};

const downloadButtons = {
  mt: 4,
  mb: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const cetakContainer = {
  width: "300px",
  fontSize: "16px",
  letterSpacing: "0.01px",
};

const cetakCenter = {
  textAlign: "center",
  marginTop: "0px",
  marginBottom: "0px",
};

const cetakCenterBold = {
  textAlign: "center",
  marginTop: "0px",
  marginBottom: "0px",
  fontWeight: "700",
};
