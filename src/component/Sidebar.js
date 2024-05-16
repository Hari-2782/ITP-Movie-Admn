import React from "react";
import "./sidebar.css";
import { TiThMenu } from "react-icons/ti";
// import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ theme }) {
  const navigate = useNavigate();

  const clickDashboard = () => {
    navigate("/");
  
  };

  const clickPackageManagement = () => {
    navigate("/Package");

  };

  const clickServiceManagement = () => {
    navigate("/screen");
  
  };

  const clickFinanceManagement = () => {
    navigate("/payments");
 
  };

  const clickScheduleManagement = () => {
    navigate("/schedule");

  };

  const clickAttendanceManagement = () => {
    navigate("/food");
 
  };

  const clickInventoryManagement = () => {
    navigate("/movie");
   
  };

  const clickAppointmentManagement = () => {
    navigate("/celeb");

  };

  const clickSupplierManagement = () => {
    navigate("/feedback");

  };
  const clickbooking = () => {
    navigate("/booking");
  
  };
  const clickEmployeeManagement = () => {
    window.open('http://localhost:3000/');

  };
  const clickUpManagement = () => {
    navigate('/up');

  };

  function showSidebar() {
    const sidebar = document.querySelector(".sidebar-layer");
    sidebar.style.display = "none";
  }

  // function hideSidebar() {
  //   const sidebar = document.querySelector(".sidebar-layer");
  //   sidebar.style.display = "none";
  // }

  return (
    <div className="side-bar">
      <button onClick={showSidebar} className={`sidebar-menu-button ${theme}`}>
        <TiThMenu size={29} />
      </button>
      <div className="sidebar-layer">
        <div className="side-bar-display">
          {/* <button onClick={hideSidebar} className="sidebar-close-button">
            <IoClose size={29} />
          </button> */}
          <div onClick={clickDashboard} className="dashboard-item">
            Dashboard
          </div>
          <div onClick={clickPackageManagement} className="dashboard-item">
            Package Management
          </div>
          <div onClick={clickServiceManagement} className="dashboard-item">
            Screen Management
          </div>
          <div onClick={clickFinanceManagement} className="dashboard-item">
            Payment Management
          </div>
          <div onClick={clickScheduleManagement} className="dashboard-item">
            Schedule Management
          </div>
          <div onClick={clickAttendanceManagement} className="dashboard-item">
            Food Management
          </div>
          <div onClick={clickInventoryManagement} className="dashboard-item">
            Movie Management
          </div>
          <div onClick={clickAppointmentManagement} className="dashboard-item">
            Add celebirty
          </div>
          <div onClick={clickSupplierManagement} className="dashboard-item">
            Feedback Management
          </div>
          <div onClick={clickbooking} className="dashboard-item">
            Booking Management
          </div>
          <div onClick={clickEmployeeManagement} className="dashboard-item">
            Employee Management
          </div>
          <div onClick={clickUpManagement} className="dashboard-item">
           Upcoming movie
          </div>
        </div>
      </div>
    </div>
  );
}
