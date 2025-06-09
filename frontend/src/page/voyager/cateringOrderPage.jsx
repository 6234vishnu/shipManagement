import React, { useState, useEffect } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import "../../assets/css/voyager/CateringOrderPage.css";
import api from "../../services/axiosInstance";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import VoyagerSidebar from "./voyagerSideBar";

const CateringOrderPage = () => {
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [successMessage, setSuccessMessage] = useState("");
  const userId = localStorage.getItem("voyagerId");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get("/voyager/get-FoodItems");

        if (response.data.success) {
          const items = response.data.items;

          const groupedItems = items.reduce((acc, item) => {
            const category = item.category || "Uncategorized";
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
          }, {});

          setMenuItems(groupedItems);

          const firstCategory = Object.keys(groupedItems)[0];
          setActiveCategory(firstCategory);

          return;
        }

        setErrorMessage(response.data.message);
        setErrorModal(true);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setErrorMessage(
          error?.response?.data?.message || "Something went wrong"
        );
        setErrorModal(true);
      }
    };

    fetchMenuItems();
  }, []);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find((item) => (item.id || item._id) === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const addToCart = (item) => {
    const itemId = item.id || item._id;
    const existingItemIndex = cart.findIndex(
      (cartItem) => (cartItem.id || cartItem._id) === itemId
    );

    if (existingItemIndex >= 0) {
      // Item already exists, increase quantity
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      // New item, add to cart
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (item, change) => {
    const itemId = item.id || item._id;
    const currentQuantity = getItemQuantity(itemId);
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      // Remove item from cart
      setCart(
        cart.filter((cartItem) => (cartItem.id || cartItem._id) !== itemId)
      );
    } else {
      const existingItemIndex = cart.findIndex(
        (cartItem) => (cartItem.id || cartItem._id) === itemId
      );
      if (existingItemIndex >= 0) {
        const newCart = [...cart];
        newCart[existingItemIndex].quantity = newQuantity;
        setCart(newCart);
      } else {
        // This shouldn't happen, but just in case
        setCart([...cart, { ...item, quantity: newQuantity }]);
      }
    }
  };

  const removeFromCart = (itemId) => {
    setCart(
      cart.filter((cartItem) => (cartItem.id || cartItem._id) !== itemId)
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Please add items to your cart before placing an order.");
      return;
    }

    const orderPayload = {
      items: cart.map((item) => ({
        itemId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: parseFloat(getTotalPrice()),
    };

    try {
      const response = await api.post(
        `/voyager/catering-orderBooking/${userId}`,
        orderPayload
      );

      if (response.data.success) {
        setSuccessMessage("Order placed successfully!");
        setCart([]);
        return setSuccessModal(true);
      } else {
        setErrorMessage(response.data.message);
        return setErrorModal(true);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Something went wrong while placing the order."
      );
      return setErrorModal(true);
    }
  };

  const getPaginatedItems = () => {
    const items = menuItems[activeCategory] || [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    (menuItems[activeCategory]?.length || 0) / itemsPerPage
  );

  return (
    <>
      <VoyagerSidebar />
      <div className="cateringOrderPageVoyager-container">
        <div className="cateringOrderPageVoyager-header">
          <h1 className="cateringOrderPageVoyager-title">Voyager Catering</h1>
          <p className="cateringOrderPageVoyager-subtitle">
            Delicious meals for every occasion
          </p>
        </div>

        <div className="cateringOrderPageVoyager-main">
          <div className="cateringOrderPageVoyager-menu-section">
            <div className="cateringOrderPageVoyager-categories">
              {Object.keys(menuItems).map((category) => (
                <button
                  key={category}
                  className={`cateringOrderPageVoyager-category-btn ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="cateringOrderPageVoyager-items-grid">
              {getPaginatedItems().map((item, index) => (
                <div
                  key={item.id || item._id || `${item.name}-${index}`}
                  className="cateringOrderPageVoyager-item-card"
                >
                  <div className="cateringOrderPageVoyager-item-image">🍽️</div>
                  <div className="cateringOrderPageVoyager-item-info">
                    <div className="cateringOrderPageVoyager-item-name">
                      {item.name}
                    </div>
                    <div className="cateringOrderPageVoyager-item-price">
                      ${item.price}
                    </div>
                  </div>
                  <div className="cateringOrderPageVoyager-item-actions">
                    <button
                      className="cateringOrderPageVoyager-add-btn"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                    {getItemQuantity(item.id || item._id) > 0 && (
                      <div className="cateringOrderPageVoyager-quantity-controls">
                        <button
                          className="cateringOrderPageVoyager-qty-btn"
                          onClick={() => updateQuantity(item, -1)}
                        >
                          −
                        </button>
                        <span className="cateringOrderPageVoyager-quantity">
                          {getItemQuantity(item.id || item._id)}
                        </span>
                        <button
                          className="cateringOrderPageVoyager-qty-btn"
                          onClick={() => updateQuantity(item, 1)}
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
              <div className="cateringOrderPageVoyager-pagination">
                <button
                  className="cateringOrderPageVoyager-page-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`cateringOrderPageVoyager-page-btn ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="cateringOrderPageVoyager-page-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="cateringOrderPageVoyager-cart">
            <div className="cateringOrderPageVoyager-cart-header">
              <ShoppingCart size={24} />
              Cart ({getTotalItems()})
            </div>

            {cart.length === 0 ? (
              <div className="cateringOrderPageVoyager-cart-empty">
                Your cart is empty
              </div>
            ) : (
              <React.Fragment>
                {cart.map((item, index) => (
                  <div
                    key={item.id || item._id || `${item.name}-${index}`}
                    className="cateringOrderPageVoyager-cart-item"
                  >
                    <div className="cateringOrderPageVoyager-cart-item-info">
                      <div className="cateringOrderPageVoyager-cart-item-name">
                        {item.name}
                      </div>
                      <div className="cateringOrderPageVoyager-cart-item-details">
                        Quantity: {item.quantity} × ${item.price} = $
                        {(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                    <button
                      className="cateringOrderPageVoyager-remove-btn"
                      onClick={() => removeFromCart(item.id || item._id)}
                      title="Remove from cart"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <div className="cateringOrderPageVoyager-cart-summary">
                  <div className="cateringOrderPageVoyager-summary-row">
                    <span>Total Items:</span>
                    <span>{getTotalItems()}</span>
                  </div>
                  <div className="cateringOrderPageVoyager-summary-row">
                    <span>Unique Items:</span>
                    <span>{cart.length}</span>
                  </div>
                  <div className="cateringOrderPageVoyager-total-row">
                    <span>Total Amount:</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                </div>
              </React.Fragment>
            )}

            <button
              className="cateringOrderPageVoyager-order-btn"
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
            >
              Place Order
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

export default CateringOrderPage;
