import React, { useState, useEffect } from "react";
import { Calendar, Clock, Home } from "lucide-react";
import "../../assets/css/voyager/PartyHallBookingPage.css";
import api from "../../services/axiosInstance";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import VoyagerSidebar from "./voyagerSideBar";

const PartyHallBookingPage = () => {
  const [items, setItems] = useState([]);
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedPartyType, setSelectedPartyType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("voyagerId");

  const partyTypes = [
    "Birthday",
    "Wedding",
    "Engagement",
    "Business",
    "GetTogether",
  ];

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await api.get("/voyager/get-party-halls");
        if (response.data.success) {
          const availableHalls = response.data.items.filter(
            (hall) => hall.available
          );
          setItems(availableHalls);
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

    fetchHalls();
  }, []);

  const selectedItem = items.find((item) => item.name === selectedHall);

  const handleBooking = async () => {
    if (!selectedHall || !selectedPartyType || !selectedDate || !selectedTime) {
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
      partyHallName: selectedHall,
      partyType: selectedPartyType,
      date: selectedDate,
      time: selectedTime,
      price: selectedItem?.price,
    };

    try {
      const response = await api.post(
        `/voyager/party-hall-booking/${userId}`,
        payload
      );
      if (response.data.success) {
        setSuccessMessage("Party hall booked successfully!");
        setSelectedHall("");
        setSelectedPartyType("");
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
      <div className="partyHallBookingPageVoyager-container">
        <div className="partyHallBookingPageVoyager-header">
          <h1 className="partyHallBookingPageVoyager-title">
            Party Hall Booking
          </h1>
          <p className="partyHallBookingPageVoyager-subtitle">
            Reserve your hall for events
          </p>
        </div>

        <div className="partyHallBookingPageVoyager-main">
          {/* Hall Selection */}
          <div className="partyHallBookingPageVoyager-hall-section">
            <h3>Available Halls</h3>
            <div className="partyHallBookingPageVoyager-hall-grid">
              {items.map((item, index) => (
                <div
                  key={item._id || `${item.name}-${index}`}
                  className={`partyHallBookingPageVoyager-hall-card ${
                    selectedHall === item.name ? "selected" : ""
                  }`}
                  onClick={() => setSelectedHall(item.name)}
                >
                  <div className="partyHallBookingPageVoyager-hall-icon">
                    <Home size={32} />
                  </div>
                  <div className="partyHallBookingPageVoyager-hall-info">
                    <div className="partyHallBookingPageVoyager-hall-name">
                      {item.name}
                    </div>
                    <div className="partyHallBookingPageVoyager-hall-price">
                      ₹{item.price}
                    </div>
                    <div className="partyHallBookingPageVoyager-hall-slots">
                      Total Slots: {item.totalSlots}
                    </div>
                    <div className="partyHallBookingPageVoyager-hall-availability">
                      {item.available ? "Available" : "Not Available"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Details */}
          <div className="partyHallBookingPageVoyager-booking-section">
            <h3>Booking Details</h3>

            {selectedHall && (
              <div className="partyHallBookingPageVoyager-selected-hall">
                <h4>Selected Hall: {selectedHall}</h4>
              </div>
            )}

            {/* Party Type Selection */}
            <div className="partyHallBookingPageVoyager-timeslot-selection">
              <label>
                <Clock size={18} />
                Select Party Type:
              </label>
              <div className="partyHallBookingPageVoyager-timeslot-options">
                {partyTypes.map((type) => (
                  <button
                    key={type}
                    className={`partyHallBookingPageVoyager-timeslot-btn ${
                      selectedPartyType === type ? "active" : ""
                    }`}
                    onClick={() => setSelectedPartyType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Picker */}
            <div className="partyHallBookingPageVoyager-date-selection">
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
                className="partyHallBookingPageVoyager-date-input"
              />
            </div>

            {/* Time Picker */}
            <div className="partyHallBookingPageVoyager-date-selection">
              <label>
                <Clock size={18} />
                Enter Time:
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="partyHallBookingPageVoyager-date-input"
              />
            </div>

            {/* Booking Summary */}
            {selectedHall &&
              selectedPartyType &&
              selectedDate &&
              selectedTime && (
                <div className="partyHallBookingPageVoyager-booking-summary">
                  <h4>Booking Summary</h4>
                  <div className="partyHallBookingPageVoyager-summary-item">
                    <span>Hall:</span>
                    <span>{selectedHall}</span>
                  </div>
                  <div className="partyHallBookingPageVoyager-summary-item">
                    <span>Party Type:</span>
                    <span>{selectedPartyType}</span>
                  </div>
                  <div className="partyHallBookingPageVoyager-summary-item">
                    <span>Date:</span>
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="partyHallBookingPageVoyager-summary-item">
                    <span>Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="partyHallBookingPageVoyager-summary-item">
                    <span>Price:</span>
                    <strong style={{ color: "#1e293b" }}>
                      ₹{selectedItem?.price}
                    </strong>
                  </div>
                </div>
              )}

            <button
              className="partyHallBookingPageVoyager-book-btn"
              onClick={handleBooking}
              disabled={
                loading ||
                !selectedHall ||
                !selectedPartyType ||
                !selectedDate ||
                !selectedTime
              }
            >
              {loading ? "Booking..." : "Book Hall"}
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

export default PartyHallBookingPage;
