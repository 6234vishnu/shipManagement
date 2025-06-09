import React, { useEffect, useState } from "react";
import { Package, Clock, CheckCircle, User, Calendar,LogOut } from "lucide-react";
import "../../assets/css/headCook/CateringListsHeadCook.css";
import api from "../../services/axiosInstance";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import { useNavigate } from "react-router-dom";

const CateringListsHeadCook = () => {
  const [orders, setOrders] = useState([]);
  const [successMessages, setSuccessMessages] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [logoutModal,setLogOutModal]=useState(false)
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const headCookId=localStorage.getItem('headCookId')
  const navigate=useNavigate()
  const ordersPerPage = 5;
  
  useEffect(()=>{
    if(!headCookId) return navigate('/headCook-Login')
  })

  const getOrders = async () => {
    try {
      const response = await api.get("/headcook/headCook-getOrders");
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
        `/headcook/catering-orders/${orderId}/deliver`
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

  const handleLogout=async()=>{
    try {
      const res=await api.post(`/headcook/auth/logout?headCookId=${headCookId}`)
      if(res.data.success){
        navigate("/headCook-Login")
       return window.location.reload()
      }
      setErrorMessage(res.data.message)
     return setErrorModal(true)
    } catch (error) {
      setErrorMessage(error?.res?.data?.message)
     return setErrorModal(true)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const getStatusIcon = (status) => {
    return status.toLowerCase() === "delivered" ? (
      <CheckCircle className="cateringOrderPage__statusIcon cateringOrderPage__statusIcon--Delivered" />
    ) : (
      <Clock className="cateringOrderPage__statusIcon cateringOrderPage__statusIcon--Pending" />
    );
  };

  const getStatusClass = (status) => {
    return status.toLowerCase() === "delivered"
      ? "cateringOrderPage__status--Delivered"
      : "cateringOrderPage__status--Pending";
  };

  const formatDate = (isoString) => new Date(isoString).toLocaleDateString();
  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <div className="cateringOrderPage">
        <div className="cateringOrderPage__container">
          <header className="cateringOrderPage__header">
            <div className="cateringOrderPage__headerContent">
              <Package className="cateringOrderPage__headerIcon" />
              <h1 className="cateringOrderPage__title">Catering Orders</h1>
              <span onClick={() => setLogOutModal(true)} className="title-icon">
                             <LogOut size={18} />
                          </span>
            </div>
               
            <div className="cateringOrderPage__stats">
              <div className="cateringOrderPage__stat">
                <span className="cateringOrderPage__statNumber">
                  {
                    orders.filter((o) => o.status.toLowerCase() === "pending")
                      .length
                  }
                </span>
                <span className="cateringOrderPage__statLabel">Pending</span>
              </div>
              <div className="cateringOrderPage__stat">
                <span className="cateringOrderPage__statNumber">
                  {
                    orders.filter((o) => o.status.toLowerCase() === "delivered")
                      .length
                  }
                </span>
                <span className="cateringOrderPage__statLabel">Delivered</span>
              </div>
            </div>
          </header>

          <div className="cateringOrderPage__filters">
            {["all", "Pending", "Delivered"].map((status) => (
              <button
                key={status}
                className={`cateringOrderPage__filterBtn ${
                  filter === status
                    ? "cateringOrderPage__filterBtn--active"
                    : ""
                }`}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="cateringOrderPage__ordersList">
            {paginatedOrders.map((order) => (
              <div key={order._id} className="cateringOrderPage__orderCard">
                <div className="cateringOrderPage__orderHeader">
                  <div className="cateringOrderPage__orderInfo">
                    <h3 className="cateringOrderPage__orderId">
                      Order #{order._id.slice(-5)}
                    </h3>
                    <div
                      className={`cateringOrderPage__status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="cateringOrderPage__statusText">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="cateringOrderPage__orderAmount">
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="cateringOrderPage__orderDetails">
                  <div className="cateringOrderPage__voyagerInfo">
                    <User className="cateringOrderPage__detailIcon" />
                    <span className="cateringOrderPage__voyagerName">
                      {order.voyager?.name || "Unknown Voyager"}
                    </span>
                  </div>

                  <div className="cateringOrderPage__orderMeta">
                    <Calendar className="cateringOrderPage__detailIcon" />
                    <span className="cateringOrderPage__orderDate">
                      {formatDate(order.orderedAt)}
                    </span>
                    <Clock className="cateringOrderPage__detailIcon" />
                    <span className="cateringOrderPage__orderTime">
                      {formatTime(order.orderedAt)}
                    </span>
                  </div>

                  <div className="cateringOrderPage__itemsList">
                    <h4 className="cateringOrderPage__itemsTitle">
                      Ordered Items:
                    </h4>
                    <ul className="cateringOrderPage__items">
                      {order.items.map((item, index) => (
                        <li key={index} className="cateringOrderPage__item">
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {order.status.toLowerCase() === "pending" && (
                  <div className="cateringOrderPage__actions">
                    <button
                      className="cateringOrderPage__deliveredBtn"
                      onClick={() => markAsDelivered(order._id)}
                    >
                      <CheckCircle className="cateringOrderPage__btnIcon" />
                      Mark as Delivered
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="cateringOrderPage__emptyState">
              <Package className="cateringOrderPage__emptyIcon" />
              <h3 className="cateringOrderPage__emptyTitle">No orders found</h3>
              <p className="cateringOrderPage__emptyText">
                {filter === "all"
                  ? "No catering orders available."
                  : `No ${filter} orders at the moment.`}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="cateringOrderPage__pagination">
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
       {logoutModal && (
        <div className="logOutModal-Container">
          <p >Are you sure you want to logOut</p>
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

export default CateringListsHeadCook;
