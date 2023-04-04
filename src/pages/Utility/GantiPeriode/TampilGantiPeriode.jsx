import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableGantiPeriode } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader, usePagination } from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, Pagination, Button, ButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilGantiPeriode = () => {
  const tableRef = useRef(null);
  const { user, dispatch, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [namaPeriode, setNamaPeriode] = useState("");
  const [dariTanggal, setDariTanggal] = useState("");
  const [sampaiTanggal, setSampaiTanggal] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodes, setPeriodes] = useState([]);

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = periodes.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.namaPeriode.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.dariTanggal.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.sampaiTanggal.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(periodes, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getPeriodes();
    id && getPeriodeById();
  }, [id]);

  const getPeriodes = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/tutupPeriodesAsc`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      });
      setPeriodes(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getPeriodeById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/tutupPeriodes/${id}`, {
        _id: user.id,
        token: user.token
      });
      setNamaPeriode(response.data.namaPeriode);
      setDariTanggal(response.data.dariTanggal);
      setSampaiTanggal(response.data.sampaiTanggal);
    }
  };

  const gantiPeriode = async () => {
    try {
      const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      });
      const gantiPeriodeUser = await axios.post(
        `${tempUrl}/updateUserThenLogin/${user.id}`,
        {
          namaPeriode,
          _id: user.id,
          token: user.token,
          kodeCabang: user.cabang.id
        }
      );
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: gantiPeriodeUser.data.details,
        setting: findSetting.data
      });
    } catch (err) {
      setIsFetchError(true);
    }
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
    doc.text(`Daftar Periode`, 90, 30);
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
    doc.save("daftarPeriode.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Periode",
    sheet: "DaftarPeriode"
  });

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "13px"
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Periode</h5>
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
                <th>Nama</th>
                <th>Dari Tanggal</th>
                <th>Sampai Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {periodes.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaPeriode}</td>
                  <td>{user.dariTanggal}</td>
                  <td>{user.sampaiTanggal}</td>
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
                <th>Nama</th>
                <th>Dari Tanggal</th>
                <th>Sampai Tanggal</th>
              </tr>
              {periodes.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaPeriode}</td>
                  <td>{user.dariTanggal}</td>
                  <td>{user.sampaiTanggal}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        {id && (
          <>
            <Button
              variant="contained"
              color="success"
              sx={{ bgcolor: "success.light", textTransform: "none" }}
              startIcon={<ChangeCircleIcon />}
              size="small"
              onClick={() => gantiPeriode()}
            >
              Ganti Periode
            </Button>
          </>
        )}
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Nama Periode :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={namaPeriode} disabled readOnly />
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Dari Tanggal :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={dariTanggal} disabled readOnly />
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Sampai Tanggal :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={sampaiTanggal} disabled readOnly />
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
        <ShowTableGantiPeriode
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

export default TampilGantiPeriode;

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
