import React, { useState } from 'react';
import '../../assets/css/manager/ManagerLogin.css'
import api from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../components/ErrorModal';

const ManagerLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage,setErrorMessage]=useState("")
  const [errorModal,setErrorModal]=useState(false)
  const navigate=useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in all fields');
      setErrorModal(true)
      return;
    }

    if (!formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setErrorModal(true)
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api.post('/manager/auth/manager-login',formData);
      if (response.data.success) {
        localStorage.setItem("managerId",response.data.managerId)
        return  navigate('/')
      } else {
        setErrorMessage(response.data.message)
      return setErrorModal(true)
      }
    } catch (err) {
     console.log('error in manager login',err);
     setErrorMessage(err?.response?.data?.message)
      return setErrorModal(true)
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="managerLoginPageContainer">
      <div className="managerLoginPageBackground">
     
        <div className="managerLoginPageBackgroundImage">
        
          <img src="\images\ray-harrington-Y2V0ph_3_qY-unsplash.jpg" alt="Cruise Ship Background" />
        </div>
      </div>

      <div className="managerLoginPageContent">
        <div className="managerLoginPageCard">
    
          <div className="managerLoginPageLogo">
            <div className="managerLoginPageLogoContainer">
            
              <img src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg" alt="Cruise Line Logo" />
            </div>
            <h1 className="managerLoginPageTitle">Manager Portal</h1>
            <p className="managerLoginPageSubtitle">Access your management dashboard</p>
          </div>

          {/* Login Form */}
          <div className="managerLoginPageForm">
          

            <div className="managerLoginPageInputGroup">
              <label className="managerLoginPageLabel" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="managerLoginPageInput"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="managerLoginPageInputGroup">
              <label className="managerLoginPageLabel" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="managerLoginPageInput"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="managerLoginPageOptions">
              
              <a href="#" className="managerLoginPageForgotPassword">
                Forgot Password?
              </a>
            </div>

            <button
              type="button"
              className="managerLoginPageSubmitBtn"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="managerLoginPageFooter">
            <p>Need help? Contact IT Support</p>
          </div>
        </div>
      </div>
    </div>
    {errorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setModalOpen(false)}
        />
      )}

    
    </>
  );
};

export default ManagerLoginPage;