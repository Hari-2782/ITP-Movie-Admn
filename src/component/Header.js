import React from "react";
import "./header.css";

import { FaCircleUser } from "react-icons/fa6";
// import logo from './logo.ico';
import { useNavigate } from "react-router-dom";

export default function Header({ theme }) {
  const navigate = useNavigate();

  const logoutclick = () => {
    navigate("/LoginPage");
  };

  return (
    <div className={`header ${theme}`}>
      <div className="header-logo">
        {/* <img src={logo} className="logo-image" /> */}
      </div>
      <div className="header-searchbar">
       
        {/* <h2>Hello Niron &#128526;, Have A Great Day!!! </h2> */}
      </div>
      <div className="header-left">
        <div className="header-logout">
          <button onClick={logoutclick} className="logout-button">
            Logout
          </button>
        </div>
        <div className={`header-profile ${theme}`}>
          <FaCircleUser size={40} className="profile-icon" />
        </div>
      </div>
    </div>
  );
}
