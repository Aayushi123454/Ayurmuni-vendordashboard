import React, { useState } from "react";
import "./sidebar.css";
import logo from "../../Assests/Aurmunilogo.png";
import { useNavigate } from "react-router-dom";

import {
  DashboardIcon,
  InventoryIcon,
  OrderIcon,
  FinanceIcon,
  RatingIcon,
  HelpIcons,
  SettingIcon,
} from "./Icons";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
    const navigate = useNavigate();

 const menuItems = [
  { name: "Dashboard", icon: <DashboardIcon />, path: "/Dashboard" },
  { name: "Inventory", icon: <InventoryIcon />, path: "/inventory" },
  { name: "Order Management", icon: <OrderIcon />, path: "/orders" },
  { name: "Finance", icon: <FinanceIcon />, path: "/finance" },
  { name: "Ratings", icon: <RatingIcon />, path: "/ratings" },
];

  const generalItems = [
    { name: "Help & Support", icon: <HelpIcons />,path:"/Helpsupport" },
    { name: "Settings", icon: <SettingIcon /> ,path :"/setting" },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Ayurmuni-logo" />
      </div>

      <div className="menu">
        <p className="menu-title">MENU</p>

        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`menu-item ${
              activeMenu === item.name ? "active" : ""
            }`}
           onClick={() => {
              setActiveMenu(item.name);
              navigate(item.path); 
            }}
          >
            {item.icon}
            <span className="items">{item.name}</span>
          </div>
        ))}

        <p className="menu-title">GENERAL</p>

        {generalItems.map((item) => (
          <div
            key={item.name}
            className={`menu-item ${
              activeMenu === item.name ? "active" : ""
            }`}
               onClick={() => {
              setActiveMenu(item.name);
              navigate(item.path); 
            }}
           
          >
            {item.icon}
            <span className="items">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;