import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { Colors } from "../constants/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

export function ShowTableUser({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Username
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tipe User
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cabang</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.cabang.id
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.cabang.namaCabang
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarUser/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell>{user.tipeUser}</TableCell>
                <TableCell>
                  {user.cabang.id} - {user.cabang.namaCabang}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableCabang({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Telepon
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>PIC</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaCabang
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.alamatCabang
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.teleponCabang
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.picCabang.toUpperCase().includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/cabang/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.namaCabang}</TableCell>
                <TableCell>{user.alamatCabang}</TableCell>
                <TableCell>{user.teleponCabang}</TableCell>
                <TableCell>{user.picCabang}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableGroupStok({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeGroupStok
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaGroupStok
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/groupStok/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeGroupStok}
                </TableCell>
                <TableCell>{user.namaGroupStok}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableStok({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Qty.
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Group Stok</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeStok.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaStok.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.qtyStok.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.groupstok.kodeGroupStok
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.groupstok.namaGroupStok
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/stok/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeStok}
                </TableCell>
                <TableCell>{user.namaStok}</TableCell>
                <TableCell align="right">{user.qtyStok}</TableCell>
                <TableCell>{`${user.groupstok.kodeGroupStok} - ${user.groupstok.namaGroupStok}`}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTablePerubahan({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodePerubahan
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaPerubahan
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/perubahan/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodePerubahan}
                </TableCell>
                <TableCell>{user.namaPerubahan}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableSupplier({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kota
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Telepon
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Npwp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeSupplier
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaSupplier
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.alamatSupplier
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kotaSupplier
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.teleponSupplier
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.npwpSupplier
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/supplier/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeSupplier}
                </TableCell>
                <TableCell>{user.namaSupplier}</TableCell>
                <TableCell>{user.alamatSupplier}</TableCell>
                <TableCell>{user.kotaSupplier}</TableCell>
                <TableCell>{user.teleponSupplier}</TableCell>
                <TableCell>{user.npwpSupplier}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableCustomer({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kota
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>No. Telp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeCustomer
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaCustomer
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.alamatCustomer
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kotaCustomer
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.noTelpCustomer
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/customer/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeCustomer}
                </TableCell>
                <TableCell>{user.namaCustomer}</TableCell>
                <TableCell>{user.alamatCustomer}</TableCell>
                <TableCell>{user.kotaCustomer}</TableCell>
                <TableCell>{user.noTelpCustomer}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableGantiPeriode({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Dari Tanggal
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Sampai Tanggal
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaPeriode
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.dariTanggal
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.sampaiTanggal
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/gantiPeriode/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaPeriode}
                </TableCell>
                <TableCell>{user.dariTanggal}</TableCell>
                <TableCell>{user.sampaiTanggal}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarBeli({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Nota
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tgl. Beli
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.noNotaBeli
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.tanggalBeli.toString().includes(searchTerm) ||
                val.totalBeli == searchTerm
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarBeli/beli/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.noNotaBeli}
                </TableCell>
                <TableCell>{user.tanggalBeli}</TableCell>
                <TableCell align="right">
                  {user.totalBeli.toLocaleString("en-US")}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableBeliChild({ id, currentPosts }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Stok
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Qty.
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Harga
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((user, index) => {
            return (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarBeli/beli/${id}/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {`${user.stok.kodeStok} - ${user.stok.namaStok}`}
                </TableCell>
                <TableCell align="right">
                  {user.qtyBeliChild.toLocaleString("en-US")}
                </TableCell>
                <TableCell align="right">
                  {user.hargaBeliChild.toLocaleString("en-US")}
                </TableCell>
                <TableCell align="right">
                  {user.subtotalBeliChild.toLocaleString("en-US")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarJual({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Nota
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tgl. Jual
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.noNotaJual
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.tanggalJual.toString().includes(searchTerm) ||
                val.totalJual == searchTerm
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarJual/jual/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.noNotaJual}
                </TableCell>
                <TableCell>{user.tanggalJual}</TableCell>
                <TableCell align="right">
                  {user.totalJual.toLocaleString("en-US")}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableJualChild({ id, currentPosts }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Stok
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Qty.
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Harga
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((user, index) => {
            return (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarJual/jual/${id}/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {`${user.stok.kodeStok} - ${user.stok.namaStok}`}
                </TableCell>
                <TableCell align="right">
                  {user.qtyJualChild.toLocaleString("en-US")}
                </TableCell>
                <TableCell align="right">
                  {user.hargaJualChild.toLocaleString("en-US")}
                </TableCell>
                <TableCell align="right">
                  {user.subtotalJualChild.toLocaleString("en-US")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableKematian({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tanggal
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Qty.
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Stok</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.tanggalKematian.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.qtyKematian.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.stok.kodeStok
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.stok.namaStok
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/kematian/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.tanggalKematian}
                </TableCell>
                <TableCell>{user.qtyKematian}</TableCell>
                <TableCell>{`${user.stok.kodeStok} - ${user.stok.namaStok}`}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}