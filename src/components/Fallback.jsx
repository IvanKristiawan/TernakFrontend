import { Alert, Box } from "@mui/material";

export const Fallback = () => {
  return (
    <Box sx={{ width: "500px" }}>
      <Alert severity="error">Terjadi Kesalahan di Program!</Alert>
    </Box>
  );
};
