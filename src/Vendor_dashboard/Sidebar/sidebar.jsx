

import React, { useEffect, useState } from "react";
import "./sidebar.css";
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
import { ArrowLeftToLine, ArrowRightFromLine, Clock3 } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [itsverify, setitsverify] = useState(false)

  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/vendor/dashboard" },
    { name: "Inventory", icon: <InventoryIcon />, path: "/vendor/inventory" },
    { name: "Order Management", icon: <OrderIcon />, path: "/vendor/orders" },
    { name: "Finance", icon: <FinanceIcon />, path: "/vendor/finance" },
    { name: "Ratings", icon: <RatingIcon />, path: "/vendor/ratings" },
  ];

  const generalItems = [
    { name: "Help & Support", icon: <HelpIcons />, path: "/vendor/help-support" },
    { name: "Settings", icon: <SettingIcon />, path: "/vendor/settings" },
  ];

  useEffect(() => {
    setitsverify(JSON.parse(sessionStorage.getItem("profile"))?.verify)
  }, [])

  const renderMenu = (items) =>
    items.map((item) => {
      const isActive = location.pathname === item.path;

      return (
        <div
          key={item.name}
          className={`menu-item ${isActive ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <span className="icon">{item.icon}</span>

          {!collapsed && <span className="label">{item.name}</span>}
        </div>
      );
    });

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* 🔹 Logo */}
      <div className="logo">
        <img src={logo} alt="Ayurmuni-logo" />
        {/* <div className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ArrowRightFromLine size={19} color="#0D614E" /> : <ArrowLeftToLine size={19} color="#0D614E" />}
        </div> */}
      </div>


      {/* 🔹 Menu */}
      {
        itsverify ?
          <div className="menu">
            <p className="menu-title">MENU</p>
            {renderMenu(menuItems)}

            <p className="menu-title">GENERAL</p>
            {renderMenu(generalItems)}
          </div>
          :
          <div className="mt-8 rounded-3xl border border-amber-200 m-2 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-2 shadow-sm">

            {/* Icon */}
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
              <Clock3 size={38} />
            </div>

            {/* Content */}
            {!collapsed && (
              <>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    Verification Pending
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Your profile is currently under review by the
                    AyurMuni verification team.
                  </p>
                </div>

                {/* Time Card */}
                <div className="mt-5 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
                  <div className="">
                    <span className="text-sm font-medium text-gray-500">
                      Estimated Approval Time
                    </span>
                    <br />
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      12 - 24 Hours
                    </span>
                  </div>

                  {/* <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                  </div> */}
                </div>

                {/* Status List */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                    <p className="text-sm text-gray-600">
                      Verification process in progress
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0D614E] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#094c3d] hover:shadow-lg"
                  onClick={() => navigate("/vendor/help-support")}
                >
                  Contact Support
                </button>
              </>
            )}
          </div>
      }
    </div>
  );
};

export default Sidebar;