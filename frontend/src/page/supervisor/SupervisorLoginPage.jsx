import React, { useState, useEffect } from "react";
import "../../assets/css/supervisor/SupervisorLogin.css";
import api from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../components/ErrorModal";

const SupervisorLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getId = localStorage.getItem("supervisorId");
    if (getId) {
      navigate("/supervisor-StationaryLists");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/supervisor/auth/supervisor-login",
        formData
      );
      if (response.data.success) {
        localStorage.setItem("supervisorId", response.data.supervisorId);
        return navigate("/");
      } else {
        setErrorMessage(response.data.message);
        return setErrorModal(true);
      }
    } catch (err) {
      console.log("error in supervisor login", err);
      setErrorMessage(err?.response?.data?.message);
      return setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="supervisorLoginPageContainer">
        <div className="supervisorLoginPageBackground">
          <div className="supervisorLoginPageBackgroundImage">
            <img
              src="/images/ray-harrington-Y2V0ph_3_qY-unsplash.jpg"
              alt="Cruise Ship Background"
            />
          </div>
        </div>

        <div className="supervisorLoginPageContent">
          <div className="supervisorLoginPageCard">
            <div className="supervisorLoginPageLogo">
              <div className="supervisorLoginPageLogoContainer">
                <img
                  src="/images/1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
                  alt="Cruise Line Logo"
                />
              </div>
              <h1 className="supervisorLoginPageTitle">Supervisor Login</h1>
              <p className="supervisorLoginPageSubtitle">
                Access your supervisor dashboard
              </p>
              <p>{error}</p>
            </div>

            {/* Login Form */}
            <div className="supervisorLoginPageForm">
              <div className="supervisorLoginPageInputGroup">
                <label className="supervisorLoginPageLabel" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="supervisorLoginPageInput"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="supervisorLoginPageInputGroup">
                <label className="supervisorLoginPageLabel" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="supervisorLoginPageInput"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="supervisorLoginPageOptions">
                <a href="#" className="supervisorLoginPageForgotPassword">
                  Forgot Password?
                </a>
              </div>

              <button
                type="button"
                className="supervisorLoginPageSubmitBtn"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <div className="supervisorLoginPageFooter">
              <p>Need help? Contact IT Support</p>
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
    </>
  );
};

export default SupervisorLoginPage;
