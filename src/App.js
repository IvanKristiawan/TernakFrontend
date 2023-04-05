import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar, Footer, ScrollToTop } from "./components";
import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";
import "./styles.scss";
import {
  Login,
  ProfilUser,
  UbahProfilUser,
  DaftarUser,
  TambahUser,
  UbahUser,
  TampilSetting,
  UbahSetting,
  TutupPeriode,
  TampilGantiPeriode,
  TampilCabang,
  TambahCabang,
  UbahCabang,
  TampilGroupStok,
  TambahGroupStok,
  UbahGroupStok,
  TampilStok,
  TambahStok,
  UbahStok,
  TampilPerubahan,
  TambahPerubahan,
  UbahPerubahan,
  TampilSupplier,
  TambahSupplier,
  UbahSupplier,
  TampilCustomer,
  TambahCustomer,
  UbahCustomer,
  TampilDaftarBeli,
  TambahBeli,
  TampilBeli,
  UbahBeli,
  TambahBeliChild,
  TampilBeliChild,
  UbahBeliChild,
  TampilDaftarJual,
  TambahJual,
  TampilJual,
  UbahJual,
  TambahJualChild,
  TampilJualChild,
  UbahJualChild,
  LaporanPembelian,
  LaporanPenjualan,
  LaporanLabaRugi
} from "./pages/index";
import { FaBars } from "react-icons/fa";

const App = () => {
  const { screenSize, setScreenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const PROFILUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.profilUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DAFTARUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.daftarUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const SETTINGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.setting) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const TUTUPPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.tutupPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const GANTIPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.gantiPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const CABANGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.cabang) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const STOKRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.stok) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const PERUBAHANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.perubahan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const SUPPLIERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.supplier) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const CUSTOMERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.customer) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const BELIRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.pembelian) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const JUALRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.penjualan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LAPPEMBELIANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.lapPembelian) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LAPPENJUALANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.lapPenjualan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LAPLABARUGIRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.lapLabaRugi) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`app ${toggled ? "toggled" : ""}`}>
      {user && (
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
        />
      )}

      <main>
        <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
          <FaBars />
        </div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* Profil User */}
          <Route
            path="/profilUser"
            element={
              <PROFILUSERRoute>
                <ProfilUser />
              </PROFILUSERRoute>
            }
          />
          <Route
            path="/profilUser/:id/edit"
            element={
              <PROFILUSERRoute>
                <UbahProfilUser />
              </PROFILUSERRoute>
            }
          />
          {/* Daftar User */}
          <Route
            path="/daftarUser"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id/edit"
            element={
              <DAFTARUSERRoute>
                <UbahUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/tambahUser"
            element={
              <DAFTARUSERRoute>
                <TambahUser />
              </DAFTARUSERRoute>
            }
          />
          {/* Setting */}
          <Route
            path="/setting"
            element={
              <SETTINGRoute>
                <TampilSetting />
              </SETTINGRoute>
            }
          />
          <Route
            path="/setting/:id/edit"
            element={
              <SETTINGRoute>
                <UbahSetting />
              </SETTINGRoute>
            }
          />
          {/* Ganti Periode */}
          <Route
            path="/gantiPeriode"
            element={
              <GANTIPERIODERoute>
                <TampilGantiPeriode />
              </GANTIPERIODERoute>
            }
          />
          <Route
            path="/gantiPeriode/:id"
            element={
              <GANTIPERIODERoute>
                <TampilGantiPeriode />
              </GANTIPERIODERoute>
            }
          />
          <Route
            path="/tutupPeriode"
            element={
              <TUTUPPERIODERoute>
                <TutupPeriode />
              </TUTUPPERIODERoute>
            }
          />
          {/*  Cabang */}
          <Route
            path="/cabang"
            element={
              <CABANGRoute>
                <TampilCabang />
              </CABANGRoute>
            }
          />
          <Route
            path="/cabang/:id"
            element={
              <CABANGRoute>
                <TampilCabang />
              </CABANGRoute>
            }
          />
          <Route
            path="/cabang/:id/edit"
            element={
              <CABANGRoute>
                <UbahCabang />
              </CABANGRoute>
            }
          />
          <Route
            path="/cabang/tambahCabang"
            element={
              <CABANGRoute>
                <TambahCabang />
              </CABANGRoute>
            }
          />
          {/*  Group Stok */}
          <Route
            path="/groupStok"
            element={
              <STOKRoute>
                <TampilGroupStok />
              </STOKRoute>
            }
          />
          <Route
            path="/groupStok/:id"
            element={
              <STOKRoute>
                <TampilGroupStok />
              </STOKRoute>
            }
          />
          <Route
            path="/groupStok/:id/edit"
            element={
              <STOKRoute>
                <UbahGroupStok />
              </STOKRoute>
            }
          />
          <Route
            path="/groupStok/tambahGroupStok"
            element={
              <STOKRoute>
                <TambahGroupStok />
              </STOKRoute>
            }
          />
          {/*  Stok */}
          <Route
            path="/stok"
            element={
              <STOKRoute>
                <TampilStok />
              </STOKRoute>
            }
          />
          <Route
            path="/stok/:id"
            element={
              <STOKRoute>
                <TampilStok />
              </STOKRoute>
            }
          />
          <Route
            path="/stok/:id/edit"
            element={
              <STOKRoute>
                <UbahStok />
              </STOKRoute>
            }
          />
          <Route
            path="/stok/tambahStok"
            element={
              <STOKRoute>
                <TambahStok />
              </STOKRoute>
            }
          />
          {/* Perubahan */}
          <Route
            path="/perubahan"
            element={
              <PERUBAHANRoute>
                <TampilPerubahan />
              </PERUBAHANRoute>
            }
          />
          <Route
            path="/perubahan/:id"
            element={
              <PERUBAHANRoute>
                <TampilPerubahan />
              </PERUBAHANRoute>
            }
          />
          <Route
            path="/perubahan/:id/edit"
            element={
              <PERUBAHANRoute>
                <UbahPerubahan />
              </PERUBAHANRoute>
            }
          />
          <Route
            path="/perubahan/tambahPerubahan"
            element={
              <PERUBAHANRoute>
                <TambahPerubahan />
              </PERUBAHANRoute>
            }
          />
          {/* Supplier */}
          <Route
            path="/supplier"
            element={
              <SUPPLIERRoute>
                <TampilSupplier />
              </SUPPLIERRoute>
            }
          />
          <Route
            path="/supplier/:id"
            element={
              <SUPPLIERRoute>
                <TampilSupplier />
              </SUPPLIERRoute>
            }
          />
          <Route
            path="/supplier/:id/edit"
            element={
              <SUPPLIERRoute>
                <UbahSupplier />
              </SUPPLIERRoute>
            }
          />
          <Route
            path="/supplier/tambahSupplier"
            element={
              <SUPPLIERRoute>
                <TambahSupplier />
              </SUPPLIERRoute>
            }
          />
          {/* Customer */}
          <Route
            path="/customer"
            element={
              <CUSTOMERRoute>
                <TampilCustomer />
              </CUSTOMERRoute>
            }
          />
          <Route
            path="/customer/:id"
            element={
              <CUSTOMERRoute>
                <TampilCustomer />
              </CUSTOMERRoute>
            }
          />
          <Route
            path="/customer/:id/edit"
            element={
              <CUSTOMERRoute>
                <UbahCustomer />
              </CUSTOMERRoute>
            }
          />
          <Route
            path="/customer/tambahCustomer"
            element={
              <CUSTOMERRoute>
                <TambahCustomer />
              </CUSTOMERRoute>
            }
          />
          {/* TRANSAKSI */}
          {/* Beli */}
          <Route
            path="/daftarBeli"
            element={
              <BELIRoute>
                <TampilDaftarBeli />
              </BELIRoute>
            }
          />
          <Route
            path="/daftarBeli/beli/tambahBeli"
            element={
              <BELIRoute>
                <TambahBeli />
              </BELIRoute>
            }
          />
          <Route
            path="/daftarBeli/beli/:id"
            element={
              <BELIRoute>
                <TampilBeli />
              </BELIRoute>
            }
          />
          <Route
            path="/daftarBeli/beli/:id/edit"
            element={
              <BELIRoute>
                <UbahBeli />
              </BELIRoute>
            }
          />
          <Route
            path="/daftarBeli/beli/:id/tambahBeliChild"
            element={
              <BELIRoute>
                <TambahBeliChild />
              </BELIRoute>
            }
          />
          <Route
            path="/daftarBeli/beli/:id/:idBeliChild"
            element={
              <BELIRoute>
                <TampilBeliChild />
              </BELIRoute>
            }
          />
          <Route
            path="/daftarBeli/beli/:id/:idBeliChild/edit"
            element={
              <BELIRoute>
                <UbahBeliChild />
              </BELIRoute>
            }
          />
          {/* Jual */}
          <Route
            path="/daftarJual"
            element={
              <JUALRoute>
                <TampilDaftarJual />
              </JUALRoute>
            }
          />
          <Route
            path="/daftarJual/jual/tambahJual"
            element={
              <JUALRoute>
                <TambahJual />
              </JUALRoute>
            }
          />
          <Route
            path="/daftarJual/jual/:id"
            element={
              <JUALRoute>
                <TampilJual />
              </JUALRoute>
            }
          />
          <Route
            path="/daftarJual/jual/:id/edit"
            element={
              <JUALRoute>
                <UbahJual />
              </JUALRoute>
            }
          />
          <Route
            path="/daftarJual/jual/:id/tambahJualChild"
            element={
              <JUALRoute>
                <TambahJualChild />
              </JUALRoute>
            }
          />
          <Route
            path="/daftarJual/jual/:id/:idJualChild"
            element={
              <JUALRoute>
                <TampilJualChild />
              </JUALRoute>
            }
          />
          <Route
            path="/daftarJual/jual/:id/:idJualChild/edit"
            element={
              <JUALRoute>
                <UbahJualChild />
              </JUALRoute>
            }
          />
          {/* Laporan */}
          <Route
            path="/laporanPembelian"
            element={
              <LAPPEMBELIANRoute>
                <LaporanPembelian />
              </LAPPEMBELIANRoute>
            }
          />
          <Route
            path="/laporanPenjualan"
            element={
              <LAPPENJUALANRoute>
                <LaporanPenjualan />
              </LAPPENJUALANRoute>
            }
          />
          <Route
            path="/laporanLabaRugi"
            element={
              <LAPLABARUGIRoute>
                <LaporanLabaRugi />
              </LAPLABARUGIRoute>
            }
          />
        </Routes>
        <Footer />
      </main>
    </div>
  );
};

export default App;
