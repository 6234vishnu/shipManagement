import React, { useEffect, useState } from "react";
import { Package, Clock, CheckCircle, User, Calendar } from "lucide-react";
import "../../assets/css/supervisor/StationaryOrdersSupervisor.css";
import api from "../../services/axiosInstance";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

const StationaryOrdersSupervisor = () => {
  const [orders, setOrders] = useState([]);
  const [successMessages, setSuccessMessages] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const getOrders = async () => {
    try {
      const response = await api.get("/supervisor/stationary-orders");
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setErrorMessage(response.data.message);
        setErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Something went wrong."
      );
      setErrorModal(true);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const markAsDelivered = async (orderId) => {
    try {
      const res = await api.patch(
        `/supervisor/stationary-orders/${orderId}/deliver`
      );
      if (res.data.success) {
        setSuccessMessages(res.data.message);
        setSuccessModal(true);
        getOrders();
      } else {
        setErrorMessage(res.data.message);
        setErrorModal(true);
      }
    } catch (error) {
      setErrorMessage("Failed to mark as Delivered.");
      setErrorModal(true);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const getStatusIcon = (status) =>
    status.toLowerCase() === "delivered" ? (
      <CheckCircle className="stationaryOrderPage__statusIcon stationaryOrderPage__statusIcon--Delivered" />
    ) : (
      <Clock className="stationaryOrderPage__statusIcon stationaryOrderPage__statusIcon--Pending" />
    );

  const getStatusClass = (status) =>
    status.toLowerCase() === "delivered"
      ? "stationaryOrderPage__status--Delivered"
      : "stationaryOrderPage__status--Pending";

  const formatDate = (isoString) => new Date(isoString).toLocaleDateString();
  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <div className="stationaryOrderPage">
        <div className="stationaryOrderPage__container">
          <header className="stationaryOrderPage__header">
            <div className="stationaryOrderPage__headerContent">
              <Package className="stationaryOrderPage__headerIcon" />
              <h1 className="stationaryOrderPage__title">Stationary Orders</h1>
            </div>
            <div className="stationaryOrderPage__stats">
              <div className="stationaryOrderPage__stat">
                <span className="stationaryOrderPage__statNumber">
                  {
                    orders.filter((o) => o.status.toLowerCase() === "pending")
                      .length
                  }
                </span>
                <span className="stationaryOrderPage__statLabel">Pending</span>
              </div>
              <div className="stationaryOrderPage__stat">
                <span className="stationaryOrderPage__statNumber">
                  {
                    orders.filter((o) => o.status.toLowerCase() === "delivered")
                      .length
                  }
                </span>
                <span className="stationaryOrderPage__statLabel">
                  Delivered
                </span>
              </div>
            </div>
          </header>

          <div className="stationaryOrderPage__filters">
            {["all", "Pending", "Delivered"].map((status) => (
              <button
                key={status}
                className={`stationaryOrderPage__filterBtn ${
                  filter === status
                    ? "stationaryOrderPage__filterBtn--active"
                    : ""
                }`}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="stationaryOrderPage__ordersList">
            {paginatedOrders.map((order) => (
              <div key={order._id} className="stationaryOrderPage__orderCard">
                <div className="stationaryOrderPage__orderHeader">
                  <div className="stationaryOrderPage__orderInfo">
                    <h3 className="stationaryOrderPage__orderId">
                      Order #{order._id.slice(-5)}
                    </h3>
                    <div
                      className={`stationaryOrderPage__status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="stationaryOrderPage__statusText">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="stationaryOrderPage__orderAmount">
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="stationaryOrderPage__orderDetails">
                  <div className="stationaryOrderPage__voyagerInfo">
                    <User className="stationaryOrderPage__detailIcon" />
                    <span className="stationaryOrderPage__voyagerName">
                      {order.supervisor?.name || "Unknown Supervisor"}
                    </span>
                  </div>

                  <div className="stationaryOrderPage__orderMeta">
                    <Calendar className="stationaryOrderPage__detailIcon" />
                    <span className="stationaryOrderPage__orderDate">
                      {formatDate(order.orderedAt)}
                    </span>
                    <Clock className="stationaryOrderPage__detailIcon" />
                    <span className="stationaryOrderPage__orderTime">
                      {formatTime(order.orderedAt)}
                    </span>
                  </div>

                  <div className="stationaryOrderPage__itemsList">
                    <h4 className="stationaryOrderPage__itemsTitle">
                      Ordered Items:
                    </h4>
                    <ul className="stationaryOrderPage__items">
                      {order.items.map((item, index) => (
                        <li key={index} className="stationaryOrderPage__item">
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {order.status.toLowerCase() === "pending" && (
                  <div className="stationaryOrderPage__actions">
                    <button
                      className="stationaryOrderPage__deliveredBtn"
                      onClick={() => markAsDelivered(order._id)}
                    >
                      <CheckCircle className="stationaryOrderPage__btnIcon" />
                      Mark as Delivered
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="stationaryOrderPage__emptyState">
              <Package className="stationaryOrderPage__emptyIcon" />
              <h3 className="stationaryOrderPage__emptyTitle">
                No orders found
              </h3>
              <p className="stationaryOrderPage__emptyText">
                {filter === "all"
                  ? "No stationary orders available."
                  : `No ${filter} orders at the moment.`}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="stationaryOrderPage__pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
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
          message={successMessages}
          onClose={() => setSuccessModal(false)}
        />
      )}
    </>
  );
};

export default StationaryOrdersSupervisor;
