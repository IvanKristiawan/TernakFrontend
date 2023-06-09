import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { Container, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";

const LaporanKematian = () => {
  const { screenSize } = useStateContext();
  const { user, setting } = useContext(AuthContext);
  const reportTemplateRef = useRef(null);
  let nowDate = new Date();
  let [dariTanggal, setDariTanggal] = useState(new Date());
  let [sampaiTanggal, setSampaiTanggal] = useState(new Date());
  const [kodeCabang, setKodeCabang] = useState(user.cabang.id);
  const [stokId, setStokId] = useState("");
  const [grouping, setGrouping] = useState("STOK");

  const [stoks, setStoks] = useState([]);
  const [cabangs, setCabangs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lapKematiansData, setLapKematiansData] = useState([]);
  const [previewPdf, setPreviewPdf] = useState(false);

  const handleChangeGrouping = (event) => {
    setGrouping(event.target.value);
    setPreviewPdf(false);
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });
    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("LaporanKematian");
      },
      html2canvas: { scale: 0.44 },
    });
  };

  const tampilPdf = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      let lapPembelians = await axios.post(`${tempUrl}/laporanKematian`, {
        kodeStok: stokId.split(" -", 1)[0],
        grouping,
        dariTanggal,
        sampaiTanggal,
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id,
      });
      setLapKematiansData(lapPembelians.data);
      setPreviewPdf(!previewPdf);
    }
  };

  useEffect(() => {
    getStoksData();
    getCabangsData();
  }, []);

  const getStoksData = async () => {
    setStokId("");
    const response = await axios.post(`${tempUrl}/stoks`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id,
    });
    setStoks(response.data);
  };

  const getCabangsData = async () => {
    const response = await axios.post(`${tempUrl}/cabangs`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id,
    });
    setCabangs(response.data);
  };

  const tableText = {
    letterSpacing: "0.01px",
  };

  const textTableRight = {
    letterSpacing: "0.01px",
    textAlign: "right",
  };

  const tableLastText = {
    borderTop: "1px solid black",
    letterSpacing: "0.01px",
  };

  const list = [];

  let keys = Object.keys(lapKematiansData);
  let totalQty = 0;

  if (grouping === "STOK") {
    for (let i = 0; i < Object.keys(lapKematiansData).length; i++) {
      list.push(
        <tr style={tableText}>
          <td style={{ fontWeight: 700 }} colspan="3">
            {lapKematiansData[keys[i]][0].groupStok} :
          </td>
        </tr>
      );
      let groupBy = lapKematiansData[keys[i]].reduce((group, pengajuan) => {
        const { groupStok } = pengajuan;
        group[groupStok] = group[groupStok] ?? [];
        group[groupStok].push(pengajuan);
        return group;
      }, {});
      let keysSubGroup = Object.keys(groupBy);

      for (let j = 0; j < Object.keys(keysSubGroup).length; j++) {
        for (let k = 0; k < groupBy[keysSubGroup[j]].length; k++) {
          totalQty += groupBy[keysSubGroup[j]][k].qtyKematian;
          list.push(
            <tr style={tableText}>
              <td style={{ paddingLeft: "15px" }}>
                {groupBy[keysSubGroup[j]][k].tanggalKematian}
              </td>
              <td>{`${groupBy[keysSubGroup[j]][k].stok.kodeStok} - ${
                groupBy[keysSubGroup[j]][k].stok.namaStok
              }`}</td>
              <td style={textTableRight}>
                {groupBy[keysSubGroup[j]][k].qtyKematian.toLocaleString(
                  "en-US"
                )}
              </td>
            </tr>
          );
        }
        list.push(
          <tr style={tableLastText}>
            <td style={{ fontWeight: 700 }} colspan="2">
              Total {lapKematiansData[keys[i]][0].groupStok} :
            </td>
            <td style={textTableRight}>{totalQty.toLocaleString("en-US")}</td>
          </tr>
        );
        totalQty = 0;
      }
    }
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Laporan</h3>
      <h5 style={{ fontWeight: 400 }}>Laporan Kematian</h5>
      <hr />
      <Box sx={spacingTop}>
        <Form onSubmit={tampilPdf}>
          <Row>
            <FormControl sx={{ marginTop: 1 }}>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Grouping
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                defaultValue="STOK"
                value={grouping}
                onChange={handleChangeGrouping}
              >
                <FormControlLabel
                  value="STOK"
                  control={<Radio />}
                  label="Stok"
                />
              </RadioGroup>
            </FormControl>
          </Row>
          <hr />
          <Row>
            <Col sm={6}>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="4" style={textRight}>
                  Cabang :
                </Form.Label>
                <Col sm="8">
                  <Form.Select
                    required
                    value={kodeCabang}
                    onChange={(e) => {
                      setKodeCabang(e.target.value);
                      setPreviewPdf(false);
                    }}
                  >
                    {cabangs.map((cabang, index) => (
                      <option value={cabang.id}>
                        {cabang.id} - {cabang.namaCabang}
                      </option>
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
                <Form.Label column sm="4" style={textRight}>
                  Dari :
                </Form.Label>
                <Col sm="8">
                  <DatePicker
                    required
                    dateFormat="dd/MM/yyyy"
                    selected={dariTanggal}
                    customInput={<Form.Control required />}
                    onChange={(date) => {
                      setDariTanggal(date);
                      setPreviewPdf(false);
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
                <Form.Label column sm="4" style={textRight}>
                  Sampai :
                </Form.Label>
                <Col sm="8">
                  <DatePicker
                    required
                    dateFormat="dd/MM/yyyy"
                    selected={sampaiTanggal}
                    customInput={<Form.Control required />}
                    onChange={(date) => {
                      setSampaiTanggal(date);
                      setPreviewPdf(false);
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
                <Form.Label column sm="4" style={textRight}>
                  Stok :
                </Form.Label>
                <Col sm="8">
                  <Form.Select
                    required
                    value={stokId}
                    onChange={(e) => {
                      if (e.target.value === "SEMUA") {
                        setStokId("");
                      } else {
                        setStokId(e.target.value);
                      }
                      setPreviewPdf(false);
                    }}
                  >
                    <option value={null}>SEMUA</option>
                    {stoks.map((stok, index) => (
                      <option value={`${stok.kodeStok} - ${stok.namaStok}`}>
                        {stok.kodeStok} - {stok.namaStok}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            type="submit"
            style={{ marginTop: "20px" }}
          >
            LIHAT
          </Button>
        </Form>
      </Box>

      {previewPdf && (
        <div style={{ marginTop: "10px" }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handleGeneratePdf}
          >
            CETAK
          </Button>
          <div ref={reportTemplateRef} id="content" style={pdfContainer}>
            <p>
              {setting.namaPerusahaan} - {setting.alamatPerusahaan}
            </p>
            <p>({setting.kotaPerusahaan})</p>
            <p>{setting.provinsiPerusahaan}</p>
            <p>NO. TELP. {setting.teleponPerusahaan}</p>
            <p>
              Dicetak Oleh: {user.username} | Tanggal:
              {` ${nowDate.getDate().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}-${(nowDate.getMonth() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}-${nowDate.getFullYear()} `}{" "}
              | Jam:{" "}
              {` ${nowDate.getHours().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}-${(nowDate.getMinutes() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}-${nowDate.getSeconds()} `}
            </p>
            <h5 style={{ textAlign: "center", fontWeight: "700" }}>
              Laporan Kematian
            </h5>
            <p>
              Dari Tanggal :
              {` ${dariTanggal.getDate().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}-${(dariTanggal.getMonth() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}-${dariTanggal.getFullYear()}`}
            </p>
            <p>
              Sampai Tanggal :
              {` ${sampaiTanggal.getDate().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}-${(sampaiTanggal.getMonth() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}-${sampaiTanggal.getFullYear()}`}
            </p>
            <p>Stok : {stokId}</p>
            <p>Grouping : {grouping}</p>
            <p></p>
            <table style={{ width: "1000px" }}>
              <tbody>
                <tr>
                  <th style={tableTitle}>Tgl.</th>
                  <th style={tableTitle}>Stok</th>
                  <th style={tableTitleRight}>Qty.</th>
                </tr>
                {list}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Container>
  );
};

export default LaporanKematian;

const spacingTop = {
  mt: 4,
};

const pdfContainer = {
  padding: "10px",
  letterSpacing: "0.01px",
};

const tableTitle = {
  border: "1px solid black",
  padding: "10px",
};

const tableTitleRight = {
  border: "1px solid black",
  padding: "10px",
  textAlign: "right",
};
