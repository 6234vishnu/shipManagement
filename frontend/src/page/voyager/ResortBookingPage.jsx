import React, { useState, useEffect } from "react";
import { Calendar, Eye } from "lucide-react";
import "../../assets/css/voyager/ResortBookingPage.css";
import api from "../../services/axiosInstance";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import VoyagerSidebar from "./voyagerSideBar";

const ResortBookingPage = () => {
  const [resorts, setResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState(null);
  const [selectedViewType, setSelectedViewType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const userId = localStorage.getItem("voyagerId");
  const viewTypes = ["Oceanview", "Balcony", "Corridor", "Lounge"];

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await api.get("/voyager/get-Resort");
        if (response.data.success) {
          setResorts(response.data.items);
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

    fetchResorts();
  }, []);

  const handleResortSelect = (resort) => {
    setSelectedResort(resort);
    setSelectedViewType("");
    setSelectedDate("");
  };

  const handleBooking = async () => {
    if (!selectedResort || !selectedViewType || !selectedDate) {
      setErrorMessage("All fields are required");
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
      resortName: selectedResort.name,
      viewType: selectedViewType,
      date: selectedDate,
      totalAmount: selectedResort.price,
    };

    try {
      const response = await api.post(
        `/voyager/resort-booking/${userId}`,
        payload
      );
      if (response.data.success) {
        setSuccessMessage("Resort booking placed successfully!");
        setSelectedResort(null);
        setSelectedViewType("");
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const totalPages = Math.ceil(resorts.length / itemsPerPage);
  const paginatedResorts = resorts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <VoyagerSidebar />
      <div className="resortBookingPageVoyager-container">
        <div className="resortBookingPageVoyager-header">
          <h1 className="resortBookingPageVoyager-title">Resort Booking</h1>
          <p className="resortBookingPageVoyager-subtitle">
            Find your perfect stay
          </p>
        </div>

        <div className="resortBookingPageVoyager-main">
          <div className="resortBookingPageVoyager-menu-section">
            <h3>Available Resorts</h3>
            <div className="resortBookingPageVoyager-items-grid">
              {paginatedResorts.map((resort, index) => (
                <div
                  key={resort._id || `${resort.name}-${index}`}
                  className={`resortBookingPageVoyager-item-card ${
                    selectedResort?.name === resort.name ? "selected" : ""
                  }`}
                  onClick={() => handleResortSelect(resort)}
                >
                  <div className="resortBookingPageVoyager-item-image">🏨</div>
                  <div className="resortBookingPageVoyager-item-info">
                    <div className="resortBookingPageVoyager-item-name">
                      {resort.name}
                    </div>
                    <div className="resortBookingPageVoyager-item-price">
                      ${resort.price}/night
                    </div>
                    {resort.description && (
                      <div className="resortBookingPageVoyager-item-description">
                        {resort.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="resortBookingPageVoyager-pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          {/* Booking Section */}
          {selectedResort && (
            <div className="resortBookingPageVoyager-booking-section">
              <h3>Booking Details</h3>
              <div className="resortBookingPageVoyager-selected-resort">
                <h4>Selected Resort: {selectedResort.name}</h4>
                <p>Price: ${selectedResort.price}/night</p>
              </div>

              <div className="resortBookingPageVoyager-view-selection">
                <label>
                  <Eye size={18} /> Select View Type:
                </label>
                <div className="resortBookingPageVoyager-view-options">
                  {viewTypes.map((viewType) => (
                    <button
                      key={viewType}
                      className={`resortBookingPageVoyager-view-btn ${
                        selectedViewType === viewType ? "active" : ""
                      }`}
                      onClick={() => setSelectedViewType(viewType)}
                    >
                      {viewType}
                    </button>
                  ))}
                </div>
              </div>

              <div className="resortBookingPageVoyager-date-selection">
                <label>
                  <Calendar size={18} /> Select Check-in Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  className="resortBookingPageVoyager-date-input"
                />
              </div>

              {selectedViewType && selectedDate && (
                <div className="resortBookingPageVoyager-booking-summary">
                  <h4>Booking Summary</h4>
                  <div className="resortBookingPageVoyager-summary-item">
                    <span>Resort:</span>
                    <span>{selectedResort.name}</span>
                  </div>
                  <div className="resortBookingPageVoyager-summary-item">
                    <span>View Type:</span>
                    <span>{selectedViewType}</span>
                  </div>
                  <div className="resortBookingPageVoyager-summary-item">
                    <span>Check-in Date:</span>
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="resortBookingPageVoyager-summary-item total">
                    <span>Total Amount:</span>
                    <span>${selectedResort.price}</span>
                  </div>
                </div>
              )}

              <button
                className="resortBookingPageVoyager-placeorder-btn"
                onClick={handleBooking}
                disabled={loading || !selectedViewType || !selectedDate}
              >
                {loading ? "Booking..." : "Book Resort"}
              </button>
            </div>
          )}
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

export default ResortBookingPage;
