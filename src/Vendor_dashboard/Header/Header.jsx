import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { Bell, Sun } from "lucide-react";
import { notificationService } from "../../services/notificationService";

const Header = () => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const role = sessionStorage.getItem("role") || "vendor";
  const [user, setuser] = useState({
    phone_number: "",
    email: "",
    first_name: "",
    last_name: "",
    avatar: "",
  });

  useEffect(() => {
    setuser(JSON.parse(sessionStorage.getItem("profile") || "null") || {});
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams({ view: "unread_count" });
      const response = await notificationService.get(params);
      setUnreadCount(response.data?.data?.unread_count || 0);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  const LogOut = () => {
    sessionStorage.clear();
    setTimeout(() => {
      window.location.replace("/login");
    }, 500);
  };

  const displayName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.business_name || "User";
  const namePrefix = role === "doctor" ? "Dr. " : "";

  return (
    <div className="header fixed top-0 right-0 z-30 bg-white shadow-sm">
      <div className="welcome-box">
        <div className="welcome-icon">
          <Sun />
        </div>
        <div className="welcome-text">
          <p className="welcome-title">
            Hello <span className="capitalize">{displayName}</span> 👋
          </p>
        </div>
      </div>

      <div className="header-right">
        <div
          className="icon-wrapper"
          onClick={() => navigate(`/${role}/notifications`)}
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
          )}
        </div>

        <div
          className="profile"
          onClick={() => setOpenProfile(!openProfile)}
        >
          {user?.avatar ? (
            <img src={user?.avatar} alt="user" className="avatar" />
          ) : (
            <div className="avatar-placeholder">{user?.first_name?.charAt(0) || "U"}</div>
          )}

          <div className="profile-info">
            <p className="name capitalize">{namePrefix}{displayName}</p>
            <span className="role">{role.toUpperCase()}</span>
          </div>

          {openProfile && (
            <div className="profile-dropdown">
              <div onClick={() => navigate(`/${role}/profile`)}>Profile</div>
              <div onClick={() => navigate(`/${role}/settings`)}>Settings</div>
              <div className="logout" onClick={LogOut}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
