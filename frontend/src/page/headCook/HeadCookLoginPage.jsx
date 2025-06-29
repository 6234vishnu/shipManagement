import React, { useState, useEffect } from "react";
import "../../assets/css/headCook/HeadCookLogin.css";
import api from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../components/ErrorModal";

const HeadCookLoginPage = () => {
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
    const getId = localStorage.getItem("headCookId");
    if (getId) {
      navigate("/headCook-CateringLists");
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
        "/headcook/auth/headCook-login",
        formData
      );
      if (response.data.success) {
        localStorage.setItem("headCookId", response.data.headCookId);
        return navigate("/");
      } else {
        setErrorMessage(response.data.message);
        return setErrorModal(true);
      }
    } catch (err) {
      console.log("error in head cook login", err);
      setErrorMessage(err?.response?.data?.message || "Something went wrong");
      return setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="headCookLoginPageContainer">
        <div className="headCookLoginPageBackground">
          <div className="headCookLoginPageBackgroundImage">
            <img
              src="\images\ray-harrington-Y2V0ph_3_qY-unsplash.jpg"
              alt="Kitchen Background"
            />
          </div>
        </div>

        <div className="headCookLoginPageContent">
          <div className="headCookLoginPageCard">
            <div className="headCookLoginPageLogo">
              <div className="headCookLoginPageLogoContainer">
                <img
                  src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
                  alt="Head Cook Logo"
                />
              </div>
              <h1 className="headCookLoginPageTitle">Head Cook Portal</h1>
              <p className="headCookLoginPageSubtitle">
                Access your kitchen dashboard
              </p>
              <p>{error}</p>
            </div>

            {/* Login Form */}
            <div className="headCookLoginPageForm">
              <div className="headCookLoginPageInputGroup">
                <label className="headCookLoginPageLabel" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="headCookLoginPageInput"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="headCookLoginPageInputGroup">
                <label className="headCookLoginPageLabel" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="headCookLoginPageInput"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="headCookLoginPageOptions">
                <a href="#" className="headCookLoginPageForgotPassword">
                  Forgot Password?
                </a>
              </div>

              <button
                type="button"
                className="headCookLoginPageSubmitBtn"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <div className="headCookLoginPageFooter">
              <p>Need help? Contact Kitchen IT Support</p>
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

export default HeadCookLoginPage;
