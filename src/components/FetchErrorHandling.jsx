import { Alert, Box } from "@mui/material";

export const FetchErrorHandling = () => {
  return (
    <Box sx={{ width: "500px" }}>
      <Alert severity="error">
        Terjadi Kesalahan saat Pengambilan Data, Harap Refresh Halaman!
      </Alert>
    </Box>
  );
};
