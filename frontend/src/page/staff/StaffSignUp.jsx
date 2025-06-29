import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/voyager/signup.css";
import api from "../../services/axiosInstance";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import { useNavigate } from "react-router-dom";

function StaffSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otpFromBackend, setOtpFromBackend] = useState(null);
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/staff/auth/signUp", formData);
      if (response.data.success) {
        setOtpFromBackend(response.data.otp);
        return setOtpModal(true);
      } else {
        setErrorMessage(response.data.message);
        return setModalOpen(true);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Signup failed.");
      setModalOpen(true);
    }
  };

  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleotpSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setErrorMessage("Enter correct OTP");
      return setModalOpen(true);
    }
    if (otpFromBackend !== code) {
      setErrorMessage("Entered OTP is incorrect");
      return setModalOpen(true);
    }

    try {
      const res = await api.post(`/staff/auth/verifyOtp`, { formData, code });
      if (res.data.success) {
        setSuccessMessage(
          "Staff registered successfully. Awaiting admin approval."
        );
        setOtpModal(false);
        setSuccessModalOpen(true);
        return setTimeout(() => {
          window.location.reload();
        }, 3500);
      }
      setErrorMessage(res.data.message);
      setModalOpen(true);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "OTP verification failed"
      );
      setModalOpen(true);
    }
  };

  return (
    <div className="videoSignupContainer">
      <video autoPlay muted loop playsInline className="backgroundVideo">
        <source
          src="/videos/15366340-uhd_3840_2160_24fps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="signupOverlay">
        <img
          src="/images/1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
          alt="logo"
          className="logoTopLeft"
        />
        <div className="signupForm">
          <h2>Staff Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />

            <select
              style={{
                color: "black",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: "12px",
                borderRadius: "5px",
              }}
              name="role"
              required
              value={formData.role || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="supervisor">Supervisor</option>
              <option value="head-cook">Head Cook</option>
              <option value="manager">Manager</option>
            </select>

            <button type="submit">Register</button>
          </form>
        </div>
      </div>

      {modalOpen && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setModalOpen(false)}
        />
      )}

      {successModalOpen && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessModalOpen(false)}
        />
      )}

      {otpModal && (
        <div className="otpModal-overlay">
          <div className="otpModal-content">
            <button
              className="otpModal-close"
              onClick={() => setOtpModal(false)}
            >
              ×
            </button>
            <h2 className="otpModal-title">Enter OTP</h2>
            <div className="otpModal-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="otpModal-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>
            <button className="otpModal-submit" onClick={handleotpSubmit}>
              Verify
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffSignUp;
