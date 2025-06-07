import React, { useEffect, useState } from "react";
import {
  Home,
  Ticket,
  X,
  Menu,
  Book,
} from "lucide-react";
import "../../assets/css/admin/sidebar.css";
import { useNavigate } from "react-router-dom";
import api from "../../services/axiosInstance";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [adminName, setAdminName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage("");
  }, 3500);

  return () => clearTimeout(timer);
}, [message]);

  useEffect(() => {
    if (!adminId) {
      setMessage("Couldn't find Admin. Please log in first.");
      return;
    }

    const getAdmintData = async () => {
      try {
        const response = await api.post(
          `/admin/role/getDetails?adminId=${adminId}`
        );
        if (response.data.success) {
          localStorage.setItem("adminId", response.data.admin?._id);
        return  setAdminName(response.data.admin?.name);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.log("error in Admin sidebar", error);
        setMessage("Server error, try again later");
      }
    };

    getAdmintData();
  }, [adminId]);

  const handleLogout = async () => {
    const adminId = localStorage.getItem("adminId");
    try {
      const response = await api.post(`/admin/auth/logout?adminId=${adminId}`);
      if (response.data.success) {
        localStorage.removeItem("adminId");
      }
      navigate("/admin-login", { replace: true });
      window.location.reload();
    } catch (error) {
      console.log("error in handleLogout adminNav", error);
      setMessage("server error");
    }
  };

  const navItems = [
    {
      id: "Catering List",
      label: "Catering List",
      path: "/admin-cateringList",
      icon: <Menu />,
    },
    {
      id: "Movies List",
      label: "Movies List",
      path: "/admin-moviesList",
      icon: <Book />,
    },
    {
      id: "Fitness List",
      label: "Fitness List",
      path: "/admin-fitnessList",
      icon: <Ticket />,
    },
    {
      id: "Party Hall List",
      label: "Party Hall List",
      path: "/admin-partyHall",
      icon: <Ticket />,
    },
    {
      id: "Resort List",
      label: "Resort List",
      path: "/admin-resortList",
      icon: <Home />,
    },
    {
      id: "Stationary List",
      label: "Stationary List",
      path: "/admin-stationaryList",
      icon: <Ticket />,
    },
    {
      id: "Staffs Approval List",
      label: "Staffs Approval List",
      path: "/admin-StaffsApproval",
      icon: <Ticket />,
    },
  ];

  return (
    <>
      <button
        className="adminNavToggleBtn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <img
            src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
            alt="Open Sidebar"
            className="adminNavImageIcon"
          />
        )}
      </button>
      <p style={{ color: "white" }}>{message}</p>

      {isOpen && (
        <nav className="adminNavContainer">
          <div className="adminNavLogo">
            <img
              style={{
                width: "60px",
                height: "60px",
                marginLeft: "83px",
                borderRadius: "30px",
              }}
              src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
              alt=""
            />
          </div>

          <ul className="adminNavList">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`adminNavItem ${
                  activeItem === item.label ? "adminNavItemActive" : ""
                }`}
                onClick={() => {
                  setActiveItem(item.label);
                  navigate(item.path);
                }}
              >
                <div className="adminNavIconContainer">{item.icon}</div>
                <span className="adminNavLabel">{item.label}</span>
                {activeItem === item.label && (
                  <div className="adminNavActiveIndicator" />
                )}
              </li>
            ))}
          </ul>

          <div className="adminNavUserSection">
            
            <div className="adminNavUserInfo">
              <span className="adminNavUserName">{adminName}</span>
              <span className="adminNavUserRole">Admin</span>
            </div>
          </div>

          <button
            style={{
              backgroundColor: "white",
              color: "black",
              borderRadius: "10px",
              padding: "10px 20px",
              border: "1px solid black",
              margin: "10px",
            }}
            onClick={() => setShowLogoutModal(true)}
          >
            LogOut
          </button>
        </nav>
      )}

      {showLogoutModal && (
        <div className="logoutModalOverlay">
          <div className="logoutModalBox">
            <h5>Are you sure you want to logout?</h5>
            <div className="logoutModalButtons">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="logoutCancelBtn"
              >
                Cancel
              </button>
              <button onClick={handleLogout} className="logoutConfirmBtn">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
