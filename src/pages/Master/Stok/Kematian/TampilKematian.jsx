import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableKematian } from "../../../../components/ShowTable";
import { FetchErrorHandling } from "../../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Pagination,
  Button,
  ButtonGroup,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilKematian = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [tanggalKematian, setTanggalKematian] = useState("");
  const [qtyKematian, setQtyKematian] = useState("");
  const [stok, setStok] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [kematians, setKematians] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = kematians.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.tanggalKematian.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.qtyKematian.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.stok.kodeStok.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.stok.namaStok.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(kematians, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getKematians();
    id && getKematianById();
  }, [id]);

  const getKematians = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/kematians`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      });
      setKematians(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getKematianById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/kematians/${id}`, {
        _id: user.id,
        token: user.token
      });
      let newTanggalKematian = new Date(response.data.tanggalKematian);
      let tempTanggalKematian = `${newTanggalKematian.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${(newTanggalKematian.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${newTanggalKematian.getFullYear()}`;
      setTanggalKematian(tempTanggalKematian);
      setQtyKematian(response.data.qtyKematian);
      setStok(
        `${response.data.stok.kodeStok} - ${response.data.stok.namaStok}`
      );
    }
  };

  const deleteKematian = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteKematian/${id}`, {
        _id: user.id,
        token: user.token
      });
      getKematians();
      setTanggalKematian("");
      setQtyKematian("");
      setStok("");
      navigate("/kematian");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${tanggalKematian} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const downloadPdf = () => {
    var date = new Date();
    var current_date =
      date.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      (date.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      date.getFullYear();
    var current_time =
      date.getHours().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      ":" +
      date.getMinutes().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      ":" +
      date.getSeconds().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.alamatPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar Kematian`, 90, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.autoTable({
      html: "#table",
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save("daftarKematian.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Kematian",
    sheet: "DaftarKematian"
  });

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Kematian</h5>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewPdf(!previewPdf);
              setPreviewExcel(false);
            }}
          >
            PDF
          </Button>
          <Button
            color="secondary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewExcel(!previewExcel);
              setPreviewPdf(false);
            }}
          >
            Excel
          </Button>
        </ButtonGroup>
      </Box>
      {previewPdf && (
        <div>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => downloadPdf()}
          >
            CETAK
          </Button>
          <table class="table" id="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kuantitas</th>
                <th>Stok</th>
              </tr>
            </thead>
            <tbody>
              {kematians.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.tanggalKematian}</td>
                  <td>{user.qtyKematian}</td>
                  <td>{`${user.stok.kodeStok} - ${user.stok.namaStok}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        {previewExcel && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
          >
            EXCEL
          </Button>
        )}
        <table ref={tableRef}>
          {previewExcel && (
            <tbody>
              <tr>
                <th>Tanggal</th>
                <th>Kuantitas</th>
                <th>Stok</th>
              </tr>
              {kematians.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.tanggalKematian}</td>
                  <td>{user.qtyKematian}</td>
                  <td>{`${user.stok.kodeStok} - ${user.stok.namaStok}`}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/kematian/tambahKematian`}
          editLink={`/kematian/${id}/edit`}
          deleteUser={deleteKematian}
          nameUser={tanggalKematian}
        />
      </Box>
      {id && (
        <Container>
          <hr />
          <Form>
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
                    <Form.Control value={tanggalKematian} disabled readOnly />
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
                    Qty :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={qtyKematian} disabled readOnly />
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
                    <Form.Control value={stok} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableKematian
          currentPosts={currentPosts}
          searchTerm={searchTerm}
        />
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

export default TampilKematian;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center"
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};

const subTitleText = {
  fontWeight: "900"
};
