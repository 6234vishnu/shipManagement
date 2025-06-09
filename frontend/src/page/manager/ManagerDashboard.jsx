import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Clock,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Download,
  LogOut,
} from "lucide-react";
import "../../assets/css/manager/managerDashboard.css";
import api from "../../services/axiosInstance";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    voyager: "",
    bookingType: "",
    status: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [erroMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [logOutModal, setLogOutModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const managerId = localStorage.getItem("managerId");

  useEffect(() => {
    if (!managerId) return navigate("/manager-Login");
  }, []);

  useEffect(() => {
    if (!successModal) return;

    const timer = setTimeout(() => {
      setSuccessModal(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [successModal]);

  useEffect(() => {
    if (!errorModal) return;

    const timer = setTimeout(() => {
      setErrorModal(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [errorModal]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await api.post("/manager/status-Update", {
        id,
        newStatus,
      });
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setSuccessModal(true);
        return setBookings((prev) =>
          prev.map((booking) =>
            booking.id === id ? { ...booking, status: newStatus } : booking
          )
        );
      }
      setErrorMessage(response.data.message);
      return setErrorModal(true);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message);
      setErrorModal(true);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/manager/Manager-Logout?managerId=${managerId}`
      );
      if (response.data.success) {
        localStorage.removeItem("managerId");
        return navigate("/manager-Login");
      }
      setErrorMessage(response.data.message);
      return setErrorModal(true);
    } catch (error) {
      console.log("error in manager logout");

      setErrorMessage(error?.response?.data?.message);
      setErrorModal(true);
    }
  };

  useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await api.get("/manager/get-manager-dashboardData");
        if (response.data.success) {
          const {
            movies = [],
            fitness = [],
            partyHall = [],
          } = response.data.items;

          const transformedMovies = movies.map((item) => ({
            id: item._id,
            userName: item.voyager?.name || "Unknown",
            voyagerName: item.voyager?.voyagerName || "Unknown",
            bookingType: "Movie Tickets",
            orderDate: item.date?.split("T")[0] || "N/A",
            status: item.status || "pending",
            details: item.movieName || "N/A",
            amount: `$${item.amount || 0}`,
          }));

          const transformedFitness = fitness.map((item) => ({
            id: item._id,
            userName: item.voyager?.name || "Unknown",
            voyagerName: item.voyager?.voyagerName || "Unknown",
            bookingType: "Fitness Center",
            orderDate: item.date?.split("T")[0] || "N/A",
            status: item.status || "pending",
            details: `${item.GymName} - ${item.timeSlot}`,
            amount: `$${item.amount || 0}`,
          }));

          const transformedParty = partyHall.map((item) => ({
            id: item._id,
            userName: item.voyager?.name || "Unknown",
            voyagerName: item.voyager?.voyagerName || "Unknown",
            bookingType: "Party Hall",
            orderDate: item.date?.split("T")[0] || "N/A",
            status: item.status || "pending",
            details: `${item.partyType} - ${item.partyHallName}`,
            amount: `$${item.amount || 0}`,
          }));

          const allBookings = [
            ...transformedMovies,
            ...transformedFitness,
            ...transformedParty,
          ];
          setBookings(allBookings);
        } else {
          setErrorMessage(response.data.message);
          setErrorModal(true);
        }
      } catch (error) {
        console.error("error in manager dashboard", error);
        setErrorMessage(
          error?.response?.data?.message || "Something went wrong"
        );
        setErrorModal(true);
      }
    };

    getDatas();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.voyagerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !filters.date || booking.orderDate === filters.date;
    const matchesVoyager =
      !filters.voyager || booking.voyagerName === filters.voyager;
    const matchesType =
      !filters.bookingType || booking.bookingType === filters.bookingType;
    const matchesStatus = !filters.status || booking.status === filters.status;

    return (
      matchesSearch &&
      matchesDate &&
      matchesVoyager &&
      matchesType &&
      matchesStatus
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Rejected":
        return "status-rejected";
      case "Pending":
        return "status-pending";
      default:
        return "status-pending";
    }
  };

  const getBookingIcon = (type) => {
    switch (type) {
      case "Movie Tickets":
        return "🎬";
      case "Fitness Center":
        return "💪";
      case "Party Hall":
        return "🎉";
      default:
        return "📋";
    }
  };

  const uniqueVoyagers = [...new Set(bookings.map((b) => b.voyagerName))];
  const bookingTypes = ["Movie Tickets", "Fitness Center", "Party Hall"];

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Manager Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage all booking requests efficiently
            </p>
            <span onClick={() => setLogOutModal(true)} className="title-icon">
              Logout <LogOut size={18} />
            </span>
          </div>

          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">
                {bookings.filter((b) => b.status === "pending").length}
              </div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "white" }}>
                {bookings.filter((b) => b.status === "approved").length}
              </div>
              <div className="stat-label">Approved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "white" }}>
                {bookings.length}
              </div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="controls-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by user, voyager, or booking type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <button
              className={`filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
            </button>
            <button className="export-btn">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Voyager</label>
                <select
                  value={filters.voyager}
                  onChange={(e) =>
                    setFilters({ ...filters, voyager: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="">All Voyagers</option>
                  {uniqueVoyagers.map((voyager) => (
                    <option key={voyager} value={voyager}>
                      {voyager}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Booking Type</label>
                <select
                  value={filters.bookingType}
                  onChange={(e) =>
                    setFilters({ ...filters, bookingType: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  {bookingTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <button
              className="clear-filters"
              onClick={() =>
                setFilters({
                  date: "",
                  voyager: "",
                  bookingType: "",
                  status: "",
                })
              }
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Bookings Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Booking Items</th>
                  <th>Order Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <tr key={booking.id} className="table-row">
                    <td className="user-cell">
                      <div className="user-info">
                        <div className="user-avatar">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="user-name">{booking.userName}</div>
                          <div className="voyager-name">
                            {booking.voyagerName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="booking-cell">
                      <div className="booking-info">
                        <div className="booking-type">
                          <span className="booking-icon">
                            {getBookingIcon(booking.bookingType)}
                          </span>
                          {booking.bookingType}
                        </div>
                        <div className="booking-details">{booking.details}</div>
                      </div>
                    </td>

                    <td className="date-cell">
                      <div className="date-info">
                        <Calendar size={16} />
                        {new Date(booking.orderDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </td>

                    <td className="amount-cell">
                      <span className="amount">{booking.amount}</span>
                    </td>

                    <td className="status-cell">
                      <span
                        className={`status-badge ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>

                    <td className="action-cell">
                      {booking.status === "Pending" && (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "Approved")
                            }
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "Rejected")
                            }
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No bookings found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`pagination-number ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </span>

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {errorModal && (
        <ErrorModal
          message={erroMessage}
          onClose={() => setErrorModal(false)}
        />
      )}

      {successModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessModal(false)}
        />
      )}

      {logOutModal && (
        <div className="logOutModal-Container">
          <p>Are you sure you want to logOut</p>
          <div className="logOutModal-subContainer">
            <button className="logOutModal-logOutButton" onClick={handleLogout}>
              Logout
            </button>
            <button
              className="logOutModal-cancelButton"
              onClick={() => setLogOutModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerDashboard;
