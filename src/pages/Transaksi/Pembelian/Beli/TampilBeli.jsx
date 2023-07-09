import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader, usePagination, ButtonModifier } from "../../../../components";
import { ShowTableBeliChild } from "../../../../components/ShowTable";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Pagination } from "@mui/material";

const TampilBeli = () => {
  const { screenSize } = useStateContext();
  const { user, setting } = useContext(AuthContext);
  const [noNotaBeli, setNoNotaBeli] = useState("");
  const [tanggalBeli, setTanggalBeli] = useState("");
  const [tanggalBeliDate, setTanggalBeliDate] = useState();
  const [totalBeli, setTotalBeli] = useState("");
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [isPost, setIsPost] = useState("");

  const [belisChildData, setBelisChildData] = useState([]);
  const navigate = useNavigate();
  let today = new Date();
  let isEditableManager = user.tipeUser !== "ADMIN" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADMIN" &&
    tanggalBeliDate?.getFullYear() === today.getFullYear() &&
    tanggalBeliDate?.getMonth() === today.getMonth() &&
    tanggalBeliDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const currentPosts = belisChildData.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(belisChildData.length / PER_PAGE);
  const _DATA = usePagination(belisChildData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getBeliById();
  }, []);

  const getBeliById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/belis/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setNoNotaBeli(response.data.noNotaBeli);
    let newTanggalBeli = new Date(response.data.tanggalBeli);
    let tempTanggalBeli = `${newTanggalBeli.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}-${(newTanggalBeli.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}-${newTanggalBeli.getFullYear()}`;
    setTanggalBeli(tempTanggalBeli);
    setTanggalBeliDate(new Date(response.data.tanggalBeli));
    setIsPost(response.data.isPost);
    setTotalBeli(response.data.totalBeli);
    setKodeSupplier(
      `${response.data.supplier.kodeSupplier} - ${response.data.supplier.namaSupplier}`
    );
    const response2 = await axios.post(`${tempUrl}/belisChildByBeli`, {
      beliId: response.data.id,
      kodeCabang: user.cabang.id,
      _id: user.id,
      token: user.token,
    });
    setBelisChildData(response2.data);
    setLoading(false);
  };

  const deleteBeli = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteBeli/${id}`, {
        _id: user.id,
        token: user.token,
      });
      navigate("/daftarBeli");
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
      <h5 style={{ fontWeight: 400 }}>Beli</h5>
      <hr />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/daftarBeli")}
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
              addLink={`/daftarBeli/beli/${id}/tambahBeliChild`}
              nameAddButton={"Tambah Barang"}
              editLink={`/daftarBeli/beli/${id}/edit`}
              deleteUser={deleteBeli}
              nameUser={noNotaBeli}
            />
          </>
        )}
      </Box>
      <Form>
        <Card>
          <Card.Header>Beli</Card.Header>
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
                  <Form.Label column sm="4" style={textRight}>
                    Tgl. Beli :
                  </Form.Label>
                  <Col sm="8">
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
                  <Form.Label column sm="4" style={textRight}>
                    Supplier :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodeSupplier} disabled readOnly />
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
                      value={totalBeli.toLocaleString("en-US")}
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
        <ShowTableBeliChild id={id} currentPosts={currentPosts} />
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

export default TampilBeli;

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
