import React, { useEffect, useState } from 'react';
import {
  Home,
  UserPlus,
  Ticket,
  CreditCard,
  Users,
  Calendar,
  X,
  Menu,
  ClipboardCheck,
  Book,
  
} from 'lucide-react';
import '../../assets/css/admin/sidebar.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosInstance';


const VoyagerSidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [voyagerName, setVoyagerName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const voyagerId = localStorage.getItem('voyagerId');

  useEffect(() => {
    if (!voyagerId) {
      setMessage("Couldn't find any user. Please log in first.");
      return;
    }

    const getAdmintData = async () => {
      try {
        const response = await api.get(`/voyager/auth/getDetails?voyagerId=${voyagerId}`);
        if (response.data.success) {

            setVoyagerName(response.data.voyager?.name);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.log('error in receptionist sidebar', error);
        setMessage('Server error, try again later');
      }
    };

    getAdmintData();
  }, [voyagerId]);

  const handleLogout = async () => {
    const voyagerId = localStorage.getItem('voyagerId');
    try {
      const response = await api.post(`/admin/auth/logout?adminId=${voyagerId}`);
      if (response.data.success) {
        localStorage.removeItem('voyagerId');
        navigate('/admin/login', { replace: true });
        window.location.reload();
        setMessage('');
      }
      setMessage(response.data.message);
    } catch (error) {
      console.log('error in handleLogout adminNav', error);
      setMessage('server error');
    }
  };

  const navItems = [
    { id: 'Food Items', label: 'Food Items', path: '/cateringOrderPage', icon: <Menu /> },
    { id: 'Movies Booking', label: 'Movies Booking', path: '/moviesList', icon: <Book /> },
    { id: 'Gym Booking', label: 'Gym Booking', path: '/fitnessBookingPage', icon: <Ticket /> },
    { id: 'Party Hall Booking', label: 'Party Hall Booking', path: '/partyHallBookingPage', icon: <Ticket /> },
    { id: 'Resort Booking', label: 'Resort Booking', path: '/resortBookingPage', icon: <Home /> },
    { id: 'Stationary items', label: 'Stationary Items', path: '//stationaryOrderPage', icon: <Ticket /> },
  
   
  ];

  return (
    <>
      <button className="adminNavToggleBtn" onClick={() => setIsOpen((prev) => !prev)}>
  {isOpen ? (
    <X size={24} />
  ) : (
    <img src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg" alt="Open Sidebar" className="adminNavImageIcon" />
  )}
</button>
<p style={{color:"white"}}>{message}</p>


      {isOpen && (
        <nav className="adminNavContainer">
          <div className="adminNavLogo">
            <img
              style={{
                width: '60px',
                height: '60px',
                marginLeft: '83px',
                borderRadius: '30px',
              }}
              src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
              alt=""
            />
          </div>

          <ul className="adminNavList">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`adminNavItem ${activeItem === item.label ? 'adminNavItemActive' : ''}`}
                onClick={() => {
                  setActiveItem(item.label);
                  navigate(item.path);
                }}
              >
                <div className="adminNavIconContainer">{item.icon}</div>
                <span className="adminNavLabel">{item.label}</span>
                {activeItem === item.label && <div className="adminNavActiveIndicator" />}
              </li>
            ))}
          </ul>

          <div className="adminNavUserSection">
            <div className="adminNavUserAvatar">
              <span>{adminName.charAt(0)}</span>
            </div>
            <div className="adminNavUserInfo">
              <span className="adminNavUserName">{adminName }</span>
              <span className="adminNavUserRole">Admin</span>
            </div>
          </div>

          <button
            style={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '10px',
              padding: '10px 20px',
              border: '1px solid black',
              margin: '10px',
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
              <button onClick={() => setShowLogoutModal(false)} className="logoutCancelBtn">
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

export default VoyagerSidebar;
