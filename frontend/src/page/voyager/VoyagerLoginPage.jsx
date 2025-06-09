import React, { useEffect, useState } from "react";
import { User, Lock } from "lucide-react";
import "../../assets/css/voyager/voyagerLogin.css";
import api from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

const VoyagerLoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [otpFromBackend, setOtpFromBackend] = useState(0);
  const [voyagerid, setVoyagerId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const voyagerId = localStorage.getItem("voyagerId");
    if (voyagerId) navigate("/voyager/home");
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
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return setErrorModal(true);
    }

    try {
      const response = await api.post("/voyager/auth/login", {
        data: { email, password },
      });

      if (response.data.success) {
        localStorage.setItem("voyagerId", response.data.voyagerId);
        setSuccessMessage(response.data.message);
        setSuccessModal(true);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setErrorMessage(response.data.message || "Login failed");
        setErrorModal(true);
      }
    } catch (error) {
      console.log("error in login", error);
      setErrorMessage(error?.response?.data?.message || "Something went wrong");
      setErrorModal(true);
    }
  };

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp !== String(otpFromBackend)) {
      setErrorMessage("OTP is not matched");
      return setErrorModal(true);
    }
    setOtpModal(false);
    setChangePasswordModal(true);
  };

  const sentForgotPasswordOtp = async () => {
    if (!email) {
      setErrorMessage("Please enter your email");
      return setErrorModal(true);
    }

    try {
      const response = await api.post("/voyager/auth/forgotPassword-getOtp", {
        email,
      });
      if (response.data.success) {
        setOtpModal(true);
        setVoyagerId(response.data.id);
        setOtpFromBackend(response.data.otp);
      } else {
        setErrorMessage(response.data.message);
        setErrorModal(true);
      }
    } catch (error) {
      console.log("error in sentForgotPasswordOtp", error);
      setErrorMessage(error?.response?.data?.message || "Something went wrong");
      setErrorModal(true);
    }
  };

  const handleNewPasswordChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const NewPasswordSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      const res = await api.post(
        "/voyager/auth/forgotPassword-changePassword",
        {
          password: form.password,
          voyagerId: voyagerid,
        }
      );

      if (res.data.success) {
        setChangePasswordModal(false);
        localStorage.setItem("voyagerId", res.data.voyagerId);
        setSuccessMessage(res.data.message);
        setSuccessModal(true);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setErrorMessage(res.data.message || "Password change failed");
        setErrorModal(true);
      }
    } catch (error) {
      console.error("Error in NewPasswordSubmit:", error);
      setErrorMessage(error?.response?.data?.message || "Something went wrong");
      setErrorModal(true);
    }
  };

  return (
    <>
      <div className="voyagerLogin-wrapper">
        <div className="voyagerLogin-container">
          <div className="voyagerLogin-left">
            <div className="voyagerLogin-ship-image">
              <div className="voyagerLogin-overlay" />
            </div>
          </div>

          <div className="voyagerLogin-right">
            <div className="voyagerLogin-inner">
              <div className="voyagerLogin-logo">
                <div className="voyagerLogin-logo-box">
                  <img
                    src="/images/1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
                    alt="logo"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "40px",
                    }}
                  />
                </div>
              </div>

              <h1 className="voyagerLogin-title">Voyager Login</h1>
              <p className="voyagerLogin-subtitle">Ship Management System</p>

              <form onSubmit={handleSubmit} className="voyagerLogin-form">
                <div className="voyagerLogin-input-group">
                  <label htmlFor="email">Email</label>
                  <div className="voyagerLogin-input-wrapper">
                    <User className="voyagerLogin-icon" size={16} />
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

                <div className="voyagerLogin-input-group">
                  <label htmlFor="password">Password</label>
                  <div className="voyagerLogin-input-wrapper">
                    <Lock className="voyagerLogin-icon" size={16} />
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

                <div className="voyagerLogin-options">
                  <a
                    className="voyagerLogin-forgot"
                    onClick={sentForgotPasswordOtp}
                  >
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="voyagerLogin-button">
                  Login
                </button>
              </form>

              <p className="voyagerLogin-footer">
                © 2025 Ship Management System
              </p>
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

      {otpModal && (
        <div className="otpModal__overlay">
          <div className="otpModal__container">
            <h2 className="otpModal__title">Enter OTP</h2>
            <p className="otpModal__subtitle">
              We’ve sent a 6-digit code to your email
            </p>
            <div className="otpModal__inputs">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength="1"
                  className="otpModal__input"
                  value={digit}
                  onChange={(e) => handleChange(e.target, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                />
              ))}
            </div>
            <div className="otpModal__buttons">
              <button
                className="otpModal__button verify"
                onClick={handleOtpSubmit}
              >
                Verify
              </button>
              <button
                className="otpModal__button cancel"
                onClick={() => setOtpModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {changePasswordModal && (
        <div className="newPasswordModal__overlay">
          <div className="newPasswordModal__container">
            <h2 className="newPasswordModal__title">Set New Password</h2>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleNewPasswordChange}
              className="newPasswordModal__input"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleNewPasswordChange}
              className="newPasswordModal__input"
            />
            {error && <p className="newPasswordModal__error">{error}</p>}
            <div className="newPasswordModal__buttons">
              <button
                className="newPasswordModal__button submit"
                onClick={NewPasswordSubmit}
              >
                Submit
              </button>
              <button
                className="newPasswordModal__button cancel"
                onClick={() => setChangePasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoyagerLoginPage;
