import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableDaftarBeli } from "../../../../components/ShowTable";
import { FetchErrorHandling } from "../../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../../components";
import { Box, Typography, Divider, Pagination } from "@mui/material";

const TampilDaftarBeli = () => {
  const { user } = useContext(AuthContext);
  const { screenSize } = useStateContext();
  const [isFetchError, setIsFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [belisData, setBelisData] = useState([]);
  const kode = null;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = belisData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noNotaBeli.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tanggalBeli.toString().includes(searchTerm) ||
      val.totalBeli == searchTerm
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(belisData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getBelisData();
  }, []);

  const getBelisData = async () => {
    setLoading(true);
    try {
      const allBelis = await axios.post(`${tempUrl}/belis`, {
        tanggalBeli: user.tutupperiode.dariTanggal,
        sampaiTanggal: user.tutupperiode.sampaiTanggal,
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      });
      setBelisData(allBelis.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box>
      <Typography color="#757575">Transaksi</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Beli
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.tutupperiode.namaPeriode}
      </Typography>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={"/"}
          kode={kode}
          addLink={`/daftarBeli/beli/tambahBeli`}
          editLink={`/`}
          deleteUser={"/"}
        />
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarBeli
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
    </Box>
  );
};

export default TampilDaftarBeli;

const subTitleText = {
  fontWeight: "900"
};

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const dividerStyle = {
  pt: 4
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
