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
  UbahPerubahan
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
        </Routes>
        <Footer />
      </main>
    </div>
  );
};

export default App;
