import React, { useEffect, useState } from 'react';
import { User, Lock } from 'lucide-react';
import '../../assets/css/admin/adminLogin.css';
import api from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);


  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    if (adminId) {
      navigate('/admin-StaffsApproval');
    }
  }, [navigate]);

  
  useEffect(() => {
    if (successModal) {
      const timer = setTimeout(() => setSuccessModal(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [successModal]);


  useEffect(() => {
    if (errorModal) {
      const timer = setTimeout(() => setErrorModal(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [errorModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/admin/auth/login', {
        data: { email, password },
      });

      if (response.data.success) {
        localStorage.setItem('adminId', response.data.id);
        setSuccessMessage(response.data.message);
        setSuccessModal(true);
        setTimeout(() => {
          navigate('/admin-StaffsApproval');
        }, 1500);
      } else {
        setErrorMessage(response.data.message || 'Login failed');
        setErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Something went wrong');
      setErrorModal(true);
    }
  };

  return (
    <>
      <div className="adminLogin-wrapper">
        <div className="adminLogin-container">
          <div className="adminLogin-left">
            <div className="adminLogin-ship-image">
              <div className="adminLogin-overlay"></div>
            </div>
          </div>

          <div className="adminLogin-right">
            <div className="adminLogin-inner">
              <div className="adminLogin-logo">
                <div className="adminLogin-logo-box">
                  <img
                    src="/images/1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
                    alt="logo"
                    style={{ width: '50px', height: '50px', borderRadius: '40px' }}
                  />
                </div>
              </div>

              <h1 className="adminLogin-title">Admin Login</h1>
              <p className="adminLogin-subtitle">Ship Management System</p>

              <form onSubmit={handleSubmit} className="adminLogin-form">
                <div className="adminLogin-input-group">
                  <label htmlFor="email">Email</label>
                  <div className="adminLogin-input-wrapper">
                    <User className="adminLogin-icon" size={16} />
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="adminLogin-input-group">
                  <label htmlFor="password">Password</label>
                  <div className="adminLogin-input-wrapper">
                    <Lock className="adminLogin-icon" size={16} />
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="adminLogin-options">
                  <a href="#" className="adminLogin-forgot">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="adminLogin-button">
                  Login
                </button>
              </form>

              <p className="adminLogin-footer">© 2025 Ship Management System</p>
            </div>
          </div>
        </div>
      </div>

      {errorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorModal(false)}
        />
      )}

      {successModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessModal(false)}
        />
      )}
    </>
  );
};

export default AdminLoginPage;
