import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Mail, Search, Sun } from "lucide-react";
import { doctorService } from "../../services/doctorService";
import toast from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0)
  const [user, setuser] = useState({
    phone_number: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "Medical Prsctitioner",
    avatar: "",
    notifications: 3,
  })

  useEffect(() => {
    setuser(JSON.parse(sessionStorage.getItem("profile")))
    fetchNotifications()
  }, [])


  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams({
        view: "unread_count",
      });

      const response = await doctorService?.notificationget(params);
      const data = response.data.data;
      setUnreadCount(data.unread_count);
    } catch (error) {
      toast.error("Failed to load notifications");
      console.error("Notification fetch error:", error);
    }
  }

  const LogOut = () => {
    sessionStorage.clear();
    setTimeout(() => {
      window.location.replace('/login')
    }, 500);
  }

  return (
    <div className="header fixed top-0  right-0 z-30 bg-white shadow-sm">

      {/* 🔹 LEFT: SEARCH */}
      <div className="welcome-box">
        <div className="welcome-icon">
          <Sun />
        </div>

        <div className="welcome-text">
          <p className="welcome-title">
            Hello <span className="capitalize">{(user?.first_name ? user?.first_name : "") + " " + (user?.last_name ? user?.last_name : "")}</span> 👋
          </p>
        </div>
      </div>

      {/* <div className="header-left">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search here..."
            className="search-input"
          />
        </div>
      </div> */}

      {/* 🔹 RIGHT SECTION */}
      <div className="header-right">

        {/* 🔔 Notifications */}
        <div
          className="icon-wrapper"
          onClick={() => navigate("/doctor/notifications")}
        >

          <Bell />
          {unreadCount >= 0 && (
            <span className="badge">{unreadCount}</span>
          )}
        </div>

        {/* 💬 Messages */}
        {/* <div className="icon-wrapper">
          <Mail />
        </div> */}

        {/* 👤 Profile */}
        <div
          className="profile"
          onClick={() => setOpenProfile(!openProfile)}
        >
          {
            user?.avatar ? <img src={user?.avatar} alt="user" className="avatar" /> : <div className="avatar-placeholder">{user?.first_name?.charAt(0)}</div>
          }
          {/* <img src={avatar} alt="user" /> */}

          <div className="profile-info">
            <p className="name capitalize">Dr. {(user?.first_name ? user?.first_name : "") + " " + (user?.last_name ? user?.last_name : "")}</p>
            <span className="role">{sessionStorage.getItem("role").toUpperCase()}</span>
          </div>

          {/* <ChevronDown className="dropdown-icon" fontSize={14} /> */}

          {/* 🔽 Dropdown */}
          {openProfile && (
            <div className="profile-dropdown">
              <div onClick={() => navigate(`/${sessionStorage.getItem("role")}/profile`)}>Profile</div>
              <div onClick={() => navigate("/settings")}>Settings</div>
              <div className="logout" onClick={e => LogOut()}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;