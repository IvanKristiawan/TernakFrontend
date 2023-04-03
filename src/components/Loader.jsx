import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const Loader = () => {
  return (
    <Box sx={{ p: 4, pt: "40vh" }}>
      <LinearProgress />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography sx={{ fontWeight: "bold", pt: 4 }}>Memuat...</Typography>
      </Box>
    </Box>
  );
};

export default Loader;
