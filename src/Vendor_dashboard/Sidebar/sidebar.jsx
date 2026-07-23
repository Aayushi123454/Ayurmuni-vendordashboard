
import React, { useEffect, useState } from "react";
import "./sidebar.css";
import "../components/shared/vendor-shared.css";
import logo from "../../Assests/logo/logo.svg";
import { useNavigate, useLocation } from "react-router-dom";

import {
  DashboardIcon,
  InventoryIcon,
  OrderIcon,
  FinanceIcon,
  RatingIcon,
  HelpIcons,
  SettingIcon,
} from "./Icons";
import { Clock3, Bell, Layers, Image, BookOpen } from "lucide-react";

const MENU_ITEMS = [
  { name: "Dashboard", icon: <DashboardIcon />, path: "/vendor/dashboard" },
  { name: "Products", icon: <InventoryIcon />, path: "/vendor/products", match: ["/vendor/products", "/vendor/new-product", "/vendor/edit-product"] },
  { name: "Stock Management", icon: <Layers size={18} color="#727783" />, path: "/vendor/stock" },
  { name: "Banners", icon: <Image size={18} color="#727783" />, path: "/vendor/banners" },
  { name: "Catalog", icon: <BookOpen size={18} color="#727783" />, path: "/vendor/catalog" },
  { name: "Orders", icon: <OrderIcon />, path: "/vendor/orders", soon: true },
  { name: "Finance", icon: <FinanceIcon />, path: "/vendor/finance", soon: true },
  { name: "Ratings", icon: <RatingIcon />, path: "/vendor/ratings", soon: true },
];

const GENERAL_ITEMS = [
  { name: "Notifications", icon: <Bell size={18} color="#727783" />, path: "/vendor/notifications" },
  { name: "Help & Support", icon: <HelpIcons />, path: "/vendor/help-support" },
  { name: "Settings", icon: <SettingIcon />, path: "/vendor/settings" },
];

function isItemActive(location, item) {
  if (item.match) {
    return item.match.some((prefix) => location.pathname.startsWith(prefix));
  }
  return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
}

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [itsverify, setitsverify] = useState(false);
  const [collapsed] = useState(false);

  useEffect(() => {
    setitsverify(JSON.parse(sessionStorage.getItem("profile"))?.verify);
  }, []);

  const renderMenu = (items) =>
    items.map((item) => {
      const isActive = isItemActive(location, item);

      return (
        <div
          key={item.name}
          className={`menu-item ${isActive ? "active" : ""}`}
          onClick={() => navigate(item.path)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate(item.path)}
        >
          <span className="icon">{item.icon}</span>
          {!collapsed && (
            <span className="label">
              {item.name}
              {item.soon && <span className="menu-soon-badge">Soon</span>}
            </span>
          )}
        </div>
      );
    });

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} aria-label="Vendor navigation">
      <div className="logo">
        <img src={logo} alt="Ayurmuni logo" />
      </div>

      {itsverify ? (
        <nav className="menu">
          <p className="menu-title">MENU</p>
          {renderMenu(MENU_ITEMS)}

          <p className="menu-title">GENERAL</p>
          {renderMenu(GENERAL_ITEMS)}
        </nav>
      ) : (
        <div className="mt-8 rounded-3xl border border-amber-200 m-2 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-2 shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
            <Clock3 size={38} />
          </div>

          {!collapsed && (
            <>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800">Verification Pending</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Your profile is currently under review by the AyurMuni verification team.
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
                <span className="text-sm font-medium text-gray-500">Estimated Approval Time</span>
                <br />
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  12 - 24 Hours
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                  <p className="text-sm text-gray-600">Verification process in progress</p>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0D614E] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#094c3d] hover:shadow-lg"
                onClick={() => navigate("/vendor/help-support")}
              >
                Contact Support
              </button>
            </>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
