import React, { useState, useEffect } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import "../../assets/css/voyager/StationaryOrderPage.css";
import api from "../../services/axiosInstance";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import VoyagerSidebar from "./voyagerSideBar";

const StationaryOrderPage = () => {
  const [cart, setCart] = useState([]);
  const [items, setItems] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  const [successMessage, setSuccessMessage] = useState("");

  const userId = localStorage.getItem("voyagerId");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get("/voyager/get-StationaryItems");
        if (response.data.success) {
          const items = response.data.items;
          const groupedItems = items.reduce((acc, item) => {
            const category = item.category || "Uncategorized";
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
          }, {});
          setItems(groupedItems);
          setActiveCategory(Object.keys(groupedItems)[0]);
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

    fetchItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const getItemQuantity = (itemId) => {
    const item = cart.find((i) => (i.id || i._id) === itemId);
    return item ? item.quantity : 0;
  };

  const addToCart = (item) => {
    const itemId = item.id || item._id;
    const index = cart.findIndex((i) => (i.id || i._id) === itemId);
    if (index >= 0) {
      const newCart = [...cart];
      newCart[index].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (item, change) => {
    const itemId = item.id || item._id;
    const currentQuantity = getItemQuantity(itemId);
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      setCart(cart.filter((i) => (i.id || i._id) !== itemId));
    } else {
      const index = cart.findIndex((i) => (i.id || i._id) === itemId);
      if (index >= 0) {
        const newCart = [...cart];
        newCart[index].quantity = newQuantity;
        setCart(newCart);
      } else {
        setCart([...cart, { ...item, quantity: newQuantity }]);
      }
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((i) => (i.id || i._id) !== itemId));
  };

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Please add items to cart.");
    const payload = {
      items: cart.map((i) => ({
        itemId: i._id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      totalAmount: parseFloat(getTotalPrice()),
    };

    try {
      const response = await api.post(
        `/voyager/stationary-orderBooking/${userId}`,
        payload
      );
      if (response.data.success) {
        setSuccessMessage("Order placed successfully!");
        setCart([]);
        setSuccessModal(true);
      } else {
        setErrorMessage(response.data.message);
        setErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Something went wrong");
      setErrorModal(true);
    }
  };

  const getPaginatedItems = () => {
    const list = items[activeCategory] || [];
    const start = (currentPage - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(
    (items[activeCategory]?.length || 0) / itemsPerPage
  );

  return (
    <>
      <VoyagerSidebar />
      <div className="stationaryOrderPageVoyager-container">
        <div className="stationaryOrderPageVoyager-header">
          <h1 className="stationaryOrderPageVoyager-title">
            Voyager Stationary
          </h1>
          <p className="stationaryOrderPageVoyager-subtitle">
            Essential supplies at your fingertips
          </p>
        </div>

        <div className="stationaryOrderPageVoyager-main">
          <div className="stationaryOrderPageVoyager-menu-section">
            <div className="stationaryOrderPageVoyager-categories">
              {Object.keys(items).map((category) => (
                <button
                  key={category}
                  className={`stationaryOrderPageVoyager-category-btn ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="stationaryOrderPageVoyager-items-grid">
              {getPaginatedItems().map((item, index) => (
                <div
                  key={item.id || item._id || `${item.name}-${index}`}
                  className="stationaryOrderPageVoyager-item-card"
                >
                  <div className="stationaryOrderPageVoyager-item-image">
                    🖊️
                  </div>
                  <div className="stationaryOrderPageVoyager-item-info">
                    <div className="stationaryOrderPageVoyager-item-name">
                      {item.name}
                    </div>
                    <div className="stationaryOrderPageVoyager-item-price">
                      ${item.price}
                    </div>
                  </div>
                  <div className="stationaryOrderPageVoyager-item-actions">
                    <button
                      onClick={() => addToCart(item)}
                      className="stationaryOrderPageVoyager-add-btn"
                    >
                      Add to Cart
                    </button>
                    {getItemQuantity(item.id || item._id) > 0 && (
                      <div className="stationaryOrderPageVoyager-quantity-controls">
                        <button
                          onClick={() => updateQuantity(item, -1)}
                          className="stationaryOrderPageVoyager-qty-btn"
                        >
                          −
                        </button>
                        <span>{getItemQuantity(item.id || item._id)}</span>
                        <button
                          onClick={() => updateQuantity(item, 1)}
                          className="stationaryOrderPageVoyager-qty-btn"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="stationaryOrderPageVoyager-pagination">
                <button
                  style={{ marginLeft: "5px" }}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="stationaryOrderPageVoyager-cart">
            <div className="stationaryOrderPageVoyager-cart-header">
              <ShoppingCart size={20} /> Cart ({getTotalItems()})
            </div>

            {cart.length === 0 ? (
              <div className="stationaryOrderPageVoyager-cart-empty">
                Your cart is empty
              </div>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div
                    key={item.id || item._id || `${item.name}-${index}`}
                    className="stationaryOrderPageVoyager-cart-item"
                  >
                    <div className="stationaryOrderPageVoyager-cart-item-info">
                      <div className="stationaryOrderPageVoyager-cart-item-name">
                        {item.name}
                      </div>
                      <div>
                        Qty: {item.quantity} × ${item.price} = $
                        {(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id || item._id)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="stationaryOrderPageVoyager-cart-summary">
                  <div>Total Items: {getTotalItems()}</div>
                  <div>Unique Items: {cart.length}</div>
                  <div>Total: ${getTotalPrice()}</div>
                </div>
                <button
                  className="stationaryOrderPageVoyager-placeorder-btn"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </>
            )}
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

export default StationaryOrderPage;
