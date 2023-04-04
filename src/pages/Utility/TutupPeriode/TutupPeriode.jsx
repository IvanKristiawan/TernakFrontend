import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import {
  Box,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import { Container } from "react-bootstrap";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const TutupPeriode = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [periode, setPeriode] = useState("");
  const [periodeSelanjutnya, setPeriodeSelanjutnya] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [vertical] = useState("bottom");
  const [horizontal] = useState("center");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getPeriode();
  }, []);

  const getPeriode = async () => {
    setLoading(true);
    let tempDateName;
    let tempDateNameSelanjutnya;
    try {
      const periode = await axios.post(
        `${tempUrl}/lastTutupPeriodeNoFormatDate`,
        {
          _id: user.id,
          token: user.token,
          kodeCabang: user.cabang.id
        }
      );
      let tempTgl = new Date(periode.data.dariTanggal);

      switch (tempTgl.getMonth() + 1) {
        case 1:
          tempDateName = "JANUARI";
          break;
        case 2:
          tempDateName = "FEBRUARI";
          break;
        case 3:
          tempDateName = "MARET";
          break;
        case 4:
          tempDateName = "APRIL";
          break;
        case 5:
          tempDateName = "MEI";
          break;
        case 6:
          tempDateName = "JUNI";
          break;
        case 7:
          tempDateName = "JULI";
          break;
        case 8:
          tempDateName = "AGUSTUS";
          break;
        case 9:
          tempDateName = "SEPTEMBER";
          break;
        case 10:
          tempDateName = "OKTOBER";
          break;
        case 11:
          tempDateName = "NOVEMBER";
          break;
        case 12:
          tempDateName = "DESEMBER";
          break;
        default:
          break;
      }
      let nextDateMonth = new Date(tempTgl.setMonth(tempTgl.getMonth() + 1));

      switch (nextDateMonth.getMonth() + 1) {
        case 1:
          tempDateNameSelanjutnya = "JANUARI";
          break;
        case 2:
          tempDateNameSelanjutnya = "FEBRUARI";
          break;
        case 3:
          tempDateNameSelanjutnya = "MARET";
          break;
        case 4:
          tempDateNameSelanjutnya = "APRIL";
          break;
        case 5:
          tempDateNameSelanjutnya = "MEI";
          break;
        case 6:
          tempDateNameSelanjutnya = "JUNI";
          break;
        case 7:
          tempDateNameSelanjutnya = "JULI";
          break;
        case 8:
          tempDateNameSelanjutnya = "AGUSTUS";
          break;
        case 9:
          tempDateNameSelanjutnya = "SEPTEMBER";
          break;
        case 10:
          tempDateNameSelanjutnya = "OKTOBER";
          break;
        case 11:
          tempDateNameSelanjutnya = "NOVEMBER";
          break;
        case 12:
          tempDateNameSelanjutnya = "DESEMBER";
          break;
        default:
          break;
      }
      let tempPeriode = tempDateName + " " + tempTgl.getFullYear();
      let tempPeriodeSelanjutnya =
        tempDateNameSelanjutnya + " " + nextDateMonth.getFullYear();

      setPeriode(tempPeriode);
      setPeriodeSelanjutnya(tempPeriodeSelanjutnya);
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  const tutupPeriode = async () => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/saveLastTutupPeriode`, {
        userIdInput: user.id,
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      });

      // Ganti Periode
      const periode = await axios.post(`${tempUrl}/lastTutupPeriode`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      });
      const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      });
      const gantiPeriodeUser = await axios.post(
        `${tempUrl}/updateUserThenLogin/${user.id}`,
        {
          periodeId: periode.data.id,
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
      setOpen(true);
      getPeriode();
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Accounting</h3>
      <h5 style={{ fontWeight: 400 }}>Tutup Periode</h5>
      <Typography sx={subTitleText}>
        Periode : {user.tutupperiode.namaPeriode}
      </Typography>
      <hr />
      <Box sx={showDataWrapper}>
        <Typography sx={[labelInput, spacingTop]}>
          Periode Sekarang : {periode}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Typography sx={[labelInput]}>Ke Periode</Typography>
          <Typography sx={[labelInput, { ml: 7 }]}>
            : {periodeSelanjutnya}
          </Typography>
        </Box>
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<DriveFileRenameOutlineIcon />}
          onClick={() => tutupPeriode()}
        >
          TUTUP PERIODE
        </Button>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Periode Berhasil Ditutup!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TutupPeriode;

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
};

const spacingTop = {
  mt: 4,
  mb: 2
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};
