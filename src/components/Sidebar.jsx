import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent
} from "react-pro-sidebar";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaBook,
  FaUserCog,
  FaSignOutAlt,
  FaDochub,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaExchangeAlt
} from "react-icons/fa";

const Sidebar = ({
  image,
  collapsed,
  toggled,
  handleToggleSidebar,
  handleCollapsedChange
}) => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutButtonHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      onToggle={handleToggleSidebar}
      breakPoint="md"
    >
      {/* Header */}
      <SidebarHeader>
        <Menu iconShape="circle">
          {collapsed ? (
            <MenuItem
              icon={<FaAngleDoubleRight />}
              onClick={handleCollapsedChange}
            ></MenuItem>
          ) : (
            <MenuItem
              suffix={<FaAngleDoubleLeft />}
              onClick={handleCollapsedChange}
            >
              <div
                style={{
                  padding: "9px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 15,
                  letterSpacing: "1px"
                }}
              >
                Gadai TechKu
              </div>
            </MenuItem>
          )}
        </Menu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu title={"Master"} icon={<FaBook />}>
            {user.akses.stok === true && (
              <SubMenu title={"Stok"}>
                <MenuItem>
                  Group Stok <NavLink to="/groupStok" />
                </MenuItem>
                <MenuItem>
                  Stok <NavLink to="/stok" />
                </MenuItem>
              </SubMenu>
            )}
            {user.akses.perubahan === true && (
              <MenuItem>
                Perubahan <NavLink to="/perubahan" />
              </MenuItem>
            )}
            {user.akses.supplier === true && (
              <MenuItem>
                Supplier <NavLink to="/supplier" />
              </MenuItem>
            )}
            {user.akses.customer === true && (
              <MenuItem>
                Customer <NavLink to="/customer" />
              </MenuItem>
            )}
            {user.akses.cabang === true && (
              <MenuItem>
                Cabang <NavLink to="/cabang" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Transaksi"} icon={<FaExchangeAlt />}>
            {user.akses.pembelian === true && (
              <MenuItem>
                Pembelian <NavLink to="/daftarBeli" />
              </MenuItem>
            )}
            {user.akses.penjualan === true && (
              <MenuItem>
                Penjualan <NavLink to="/penjualan" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Laporan"} icon={<FaDochub />}>
            {user.akses.lapPembelian === true && (
              <MenuItem>
                Lap. Pembelian <NavLink to="/laporanPembelian" />
              </MenuItem>
            )}
            {user.akses.lapPenjualan === true && (
              <MenuItem>
                Lap. Penjualan <NavLink to="/laporanPenjualan" />
              </MenuItem>
            )}
            {user.akses.lapStok === true && (
              <MenuItem>
                Lap. Stok <NavLink to="/laporanStok" />
              </MenuItem>
            )}
            {user.akses.lapPerubahanStok === true && (
              <MenuItem>
                Perubahan Stok <NavLink to="/laporanPerubahanStok" />
              </MenuItem>
            )}
            {user.akses.lapLabaRugi === true && (
              <MenuItem>
                Laba Rugi <NavLink to="/laporanLabaRugi" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Utility"} icon={<FaUserCog />}>
            {user.akses.profilUser === true && (
              <MenuItem>
                Profil User <NavLink to="/profilUser" />
              </MenuItem>
            )}
            {user.akses.daftarUser === true && (
              <MenuItem>
                Daftar User <NavLink to="/daftarUser" />
              </MenuItem>
            )}
            {user.akses.tutupPeriode === true && (
              <MenuItem>
                Tutup Periode
                <NavLink to="/tutupPeriode" />
              </MenuItem>
            )}
            {user.akses.gantiPeriode === true && (
              <MenuItem>
                Ganti Periode <NavLink to="/gantiPeriode" />
              </MenuItem>
            )}
            {user.akses.setting === true && (
              <MenuItem>
                Setting <NavLink to="/setting" />
              </MenuItem>
            )}
          </SubMenu>
        </Menu>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", marginTop: "10px" }}>{user.username}</p>
        <p style={{ fontSize: "12px", marginTop: "-10px" }}>
          Cabang : {user.cabang.namaCabang}
        </p>
        <div className="sidebar-btn-wrapper" style={{ paddingBottom: "10px" }}>
          <Link
            className="sidebar-btn"
            style={{ cursor: "pointer" }}
            to="/"
            onClick={logoutButtonHandler}
          >
            <span style={{ marginRight: "6px" }}>Logout</span>
            <FaSignOutAlt />
          </Link>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Sidebar;
