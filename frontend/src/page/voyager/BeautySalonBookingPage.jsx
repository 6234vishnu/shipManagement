import React, { useState, useEffect } from "react";
import { Calendar, Clock, Scissors } from "lucide-react";
import "../../assets/css/voyager/beautySalonBooking.css";
import api from "../../services/axiosInstance";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import VoyagerSidebar from "./voyagerSideBar";

const BeautySalonBookingPage = () => {
  const [items, setItems] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("voyagerId");

  const serviceTypes = ["Haircut", "Facial", "Makeup", "Spa", "Bridal Package"];

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await api.get("/voyager/get-beauty-salons");
        if (response.data.success) {
          const availableSalons = response.data.items.filter(
            (salon) => salon.available
          );
          setItems(availableSalons);
        } else {
          setErrorMessage(response.data.message);
          setErrorModal(true);
        }
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Something went wrong"
        );
        setErrorModal(true);
      }
    };

    fetchSalons();
  }, []);

  const selectedItem = items.find((item) => item.name === selectedSalon);

  const handleBooking = async () => {
    if (
      !selectedSalon ||
      !selectedServiceType ||
      !selectedDate ||
      !selectedTime
    ) {
      setErrorMessage("Please fill all booking details");
      setErrorModal(true);
      return;
    }

    const bookingDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      setErrorMessage("Please select a future date");
      setErrorModal(true);
      return;
    }

    setLoading(true);

    const payload = {
      salonName: selectedSalon,
      serviceType: selectedServiceType,
      date: selectedDate,
      time: selectedTime,
      price: selectedItem?.price,
    };

    try {
      const response = await api.post(
        `/voyager/beauty-salon-booking/${userId}`,
        payload
      );
      if (response.data.success) {
        setSuccessMessage("Salon booked successfully!");
        setSelectedSalon("");
        setSelectedServiceType("");
        setSelectedDate("");
        setSelectedTime("");
        setSuccessModal(true);
      } else {
        setErrorMessage(response.data.message);
        setErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Something went wrong");
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => new Date().toISOString().split("T")[0];

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  return (
    <>
      <VoyagerSidebar />
      <div className="beautySalonBookingPageVoyager-container">
        <div className="beautySalonBookingPageVoyager-header">
          <h1 className="beautySalonBookingPageVoyager-title">
            Beauty Salon Booking
          </h1>
          <p className="beautySalonBookingPageVoyager-subtitle">
            Book your preferred service
          </p>
        </div>

        <div className="beautySalonBookingPageVoyager-main">
          {/* Salon Selection */}
          <div className="beautySalonBookingPageVoyager-salon-section">
            <h3>Available Salons</h3>
            <div className="beautySalonBookingPageVoyager-salon-grid">
              {items.map((item, index) => (
                <div
                  key={item._id || `${item.name}-${index}`}
                  className={`beautySalonBookingPageVoyager-salon-card ${
                    selectedSalon === item.name ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSalon(item.name)}
                >
                  <div className="beautySalonBookingPageVoyager-salon-icon">
                    <Scissors size={32} />
                  </div>
                  <div className="beautySalonBookingPageVoyager-salon-info">
                    <div className="beautySalonBookingPageVoyager-salon-name">
                      {item.name}
                    </div>
                    <div className="beautySalonBookingPageVoyager-salon-price">
                      ₹{item.price}
                    </div>
                    <div className="beautySalonBookingPageVoyager-salon-slots">
                      Total Slots: {item.totalSlots}
                    </div>
                    <div className="beautySalonBookingPageVoyager-salon-availability">
                      {item.available ? "Available" : "Not Available"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Details */}
          <div className="beautySalonBookingPageVoyager-booking-section">
            <h3>Booking Details</h3>

            {selectedSalon && (
              <div className="beautySalonBookingPageVoyager-selected-salon">
                <h4>Selected Salon: {selectedSalon}</h4>
              </div>
            )}

            {/* Service Type Selection */}
            <div className="beautySalonBookingPageVoyager-timeslot-selection">
              <label>
                <Clock size={18} />
                Select Service:
              </label>
              <div className="beautySalonBookingPageVoyager-timeslot-options">
                {serviceTypes.map((type) => (
                  <button
                    key={type}
                    className={`beautySalonBookingPageVoyager-timeslot-btn ${
                      selectedServiceType === type ? "active" : ""
                    }`}
                    onClick={() => setSelectedServiceType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Picker */}
            <div className="beautySalonBookingPageVoyager-date-selection">
              <label>
                <Calendar size={18} />
                Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="beautySalonBookingPageVoyager-date-input"
              />
            </div>

            {/* Time Picker */}
            <div className="beautySalonBookingPageVoyager-date-selection">
              <label>
                <Clock size={18} />
                Enter Time:
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="beautySalonBookingPageVoyager-date-input"
              />
            </div>

            {/* Booking Summary */}
            {selectedSalon &&
              selectedServiceType &&
              selectedDate &&
              selectedTime && (
                <div className="beautySalonBookingPageVoyager-booking-summary">
                  <h4>Booking Summary</h4>
                  <div className="beautySalonBookingPageVoyager-summary-item">
                    <span>Salon:</span>
                    <span>{selectedSalon}</span>
                  </div>
                  <div className="beautySalonBookingPageVoyager-summary-item">
                    <span>Service:</span>
                    <span>{selectedServiceType}</span>
                  </div>
                  <div className="beautySalonBookingPageVoyager-summary-item">
                    <span>Date:</span>
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="beautySalonBookingPageVoyager-summary-item">
                    <span>Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="beautySalonBookingPageVoyager-summary-item">
                    <span>Price:</span>
                    <strong style={{ color: "#1e293b" }}>
                      ₹{selectedItem?.price}
                    </strong>
                  </div>
                </div>
              )}

            <button
              className="beautySalonBookingPageVoyager-book-btn"
              onClick={handleBooking}
              disabled={
                loading ||
                !selectedSalon ||
                !selectedServiceType ||
                !selectedDate ||
                !selectedTime
              }
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
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

export default BeautySalonBookingPage;
