import React, { useState, useEffect } from "react";
import { Calendar, Clock, Dumbbell } from "lucide-react";
import "../../assets/css/voyager/FitnessBookingPage.css";
import api from "../../services/axiosInstance";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";

const FitnessBookingPage = () => {
  const [items, setItems] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("voyagerId");

  const timeSlots = [
    "06:00 - 07:00",
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
  ];

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await api.get("/voyager/get-fitness-equipment");
        if (response.data.success) {
          console.log(response.data.items);

          setItems(response.data.items);
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

    fetchEquipments();
  }, []);

  const handleBooking = async () => {
    if (!selectedEquipment) {
      setErrorMessage("Please select an equipment");
      setErrorModal(true);
      return;
    }

    if (!selectedTimeSlot) {
      setErrorMessage("Please select a time slot");
      setErrorModal(true);
      return;
    }

    if (!selectedDate) {
      setErrorMessage("Please select a date");
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
      GymName: selectedEquipment,
      price:selectedItem.price,
      timeSlot: selectedTimeSlot,
      date: selectedDate,
    };

    try {
      const response = await api.post(
        `/voyager/fitness-booking/${userId}`,
        payload
      );
      if (response.data.success) {
        setSuccessMessage("Fitness session booked successfully!");
        setSelectedEquipment("");
        setSelectedTimeSlot("");
        setSelectedDate("");
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

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate.toISOString().split("T")[0];
  };
  const selectedItem = items.find(item => item.name === selectedEquipment);


  return (
    <>
      <div className="fitnessBookingPageVoyager-container">
        <div className="fitnessBookingPageVoyager-header">
          <h1 className="fitnessBookingPageVoyager-title">
            Fitness Center Booking
          </h1>
          <p className="fitnessBookingPageVoyager-subtitle">
            Book your workout session
          </p>
        </div>

        <div className="fitnessBookingPageVoyager-main">
          {/* Equipment Selection */}
          <div className="fitnessBookingPageVoyager-equipment-section">
            <h3>Available Gyms</h3>
            <div className="fitnessBookingPageVoyager-equipment-grid">
              {items.map((item, index) => (
                <div
                  key={item.id || item._id || `${item.name}-${index}`}
                  className={`fitnessBookingPageVoyager-equipment-card ${
                    selectedEquipment === item.name ? "selected" : ""
                  }`}
                  onClick={() => setSelectedEquipment(item.name)}
                >
                  <div className="fitnessBookingPageVoyager-equipment-icon">
                    <Dumbbell size={32} />
                  </div>
                  <div className="fitnessBookingPageVoyager-equipment-info">
                    <div className="fitnessBookingPageVoyager-equipment-name">
                      {item.price}
                    </div>
                    {item.equipment &&
                      item.equipment.map((equip, i) => (
                        <div
                          key={i}
                          className="fitnessBookingPageVoyager-equipment-description"
                        >
                          {equip}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Details */}
          <div className="fitnessBookingPageVoyager-booking-section">
            <h3>Booking Details</h3>

            {/* Equipment Display */}
            {selectedEquipment && (
              <div className="fitnessBookingPageVoyager-selected-equipment">
                <h4>Selected Gym: {selectedEquipment}</h4>
              </div>
            )}

            {/* Time Slot Selection */}
            <div className="fitnessBookingPageVoyager-timeslot-selection">
              <label>
                <Clock size={18} />
                Select Time Slot:
              </label>
              <div className="fitnessBookingPageVoyager-timeslot-options">
                {timeSlots.map((timeSlot) => (
                  <button
                    key={timeSlot}
                    className={`fitnessBookingPageVoyager-timeslot-btn ${
                      selectedTimeSlot === timeSlot ? "active" : ""
                    }`}
                    onClick={() => setSelectedTimeSlot(timeSlot)}
                  >
                    {timeSlot}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="fitnessBookingPageVoyager-date-selection">
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
                className="fitnessBookingPageVoyager-date-input"
              />
            </div>

            {/* Booking Summary */}
            {selectedEquipment && selectedTimeSlot && selectedDate && (
              <div className="fitnessBookingPageVoyager-booking-summary">
                <h4>Booking Summary</h4>
                <div className="fitnessBookingPageVoyager-summary-item">
                  <span>Gym:</span>
                  <span>{selectedEquipment}</span>
                </div>
                <div className="fitnessBookingPageVoyager-summary-item">
                  <span>Time Slot:</span>
                  <span>{selectedTimeSlot}</span>
                </div>
                <div className="fitnessBookingPageVoyager-summary-item">
                  <span>Date:</span>
                  <span>{new Date(selectedDate).toLocaleDateString()}</span>
                </div>
                <div className="fitnessBookingPageVoyager-summary-item">
                  <span>Price:</span>
                  <span><strong style={{color:"#1e293b"}}>₹{selectedItem.price}</strong></span>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              className="fitnessBookingPageVoyager-book-btn"
              onClick={handleBooking}
              disabled={
                loading ||
                !selectedEquipment ||
                !selectedTimeSlot ||
                !selectedDate
              }
            >
              {loading ? "Booking..." : "Book Session"}
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

export default FitnessBookingPage;
