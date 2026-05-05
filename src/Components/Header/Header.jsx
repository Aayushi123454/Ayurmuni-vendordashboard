import React from "react";
import "./Header.css";
import searchIcon from "../../Assests/search.png"; 
import Notification from"../../Assests/notification.png"
import { useNavigate } from "react-router-dom";
const Header = () => {
  const Navigate =useNavigate();
  return (
    <div className="header">

     
      <div className="header-left">
        <div className="search-box">
              <img src={searchIcon} alt="search" className="search-icon" />
          <input
            type="text"
            placeholder="Search here"
            className="search-input"
          />
        </div>
      </div>

   
      <div className="header-right">

        <div className="icon-wrapper"
         onClick={() => Navigate("/notifications")}
        >
            <img src={Notification} alt="notification" />
          
        
        </div>

        <div className="icon-wrapper">💬</div>

        <div className="profile">
          <img
            src="https://via.placeholder.com/40"
            alt="user"
          />
          <div>
            <p className="name">Dr. Alex Rivera</p>
            <span className="role">Medical Practitioner</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;