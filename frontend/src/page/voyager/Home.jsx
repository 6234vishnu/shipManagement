import React, { useState, useEffect } from "react";
import {
  Ship,
  Anchor,
  MapPin,
  Calendar,
  Users,
  Star,
  Menu,
  X,
  User,
  LogIn,
} from "lucide-react";
import "../../assets/css/voyager/homePage.css";
import VoyagerSidebar from "./voyagerSideBar";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [voyagerId, setVoyagerId] = useState(null);

  useEffect(() => {
    const storedVoyagerId = localStorage.getItem("voyagerId");
    setVoyagerId(storedVoyagerId);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {voyagerId && <VoyagerSidebar />}
      <div className="CruiseShipHome-container">
        {/* Navigation */}
        <nav className="CruiseShipHome-navbar">
          <div className="CruiseShipHome-nav-content">
            <div className="CruiseShipHome-logo">
              <img
                className="CruiseShipHome-logo-icon"
                src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
              />
              <span className="CruiseShipHome-logo-text">Horizon Cruiser</span>
            </div>

            {/* Auth Links */}
            <div className="CruiseShipHome-auth-section">
              {voyagerId ? (
                // Show only Profile if voyager is logged in
                <a
                  href="/profilePage"
                  className="CruiseShipHome-auth-link CruiseShipHome-profile-link"
                >
                  <User size={18} />
                  Profile
                </a>
              ) : (
                // Show login/signup options only if voyager is NOT logged in
                <>
                  <a href="/login" className="CruiseShipHome-auth-link">
                    <LogIn size={18} />
                    Voyager Login
                  </a>
                  <a
                    href="/manager-Login"
                    className="CruiseShipHome-auth-link CruiseShipHome-staff-link"
                  >
                    Manager Login
                  </a>
                  <a
                    href="/headCook-Login"
                    className="CruiseShipHome-auth-link CruiseShipHome-staff-link"
                  >
                    Head-Cook Login
                  </a>
                  <a
                    href="/supervisor-Login"
                    className="CruiseShipHome-auth-link CruiseShipHome-staff-link"
                  >
                    Supervisor Login
                  </a>
                  <a
                    href="/staffs-signUp"
                    className="CruiseShipHome-auth-link CruiseShipHome-staff-link"
                  >
                    Staff Signup
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="CruiseShipHome-menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="CruiseShipHome-mobile-menu">
              <a href="/manager-Login" className="CruiseShipHome-mobile-link">
                Manager Login
              </a>
              <a href="/headCook-Login" className="CruiseShipHome-mobile-link">
                Head-Cook Login
              </a>
              <a
                href="/supervisor-Login"
                className="CruiseShipHome-mobile-link"
              >
                Supervisor Login
              </a>

              <div className="CruiseShipHome-mobile-auth">
                {voyagerId ? (
                  <a
                    href="/profile"
                    className="CruiseShipHome-mobile-auth-link"
                  >
                    <User size={18} />
                    Profile
                  </a>
                ) : (
                  <a href="/login" className="CruiseShipHome-mobile-auth-link">
                    <LogIn size={18} />
                    Voyager Login
                  </a>
                )}
                <a
                  href="/staff-login"
                  className="CruiseShipHome-mobile-auth-link"
                >
                  Staff Login
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="CruiseShipHome-hero">
          <div className="CruiseShipHome-hero-overlay"></div>
          <div className="CruiseShipHome-hero-content">
            <h1
              className="CruiseShipHome-hero-title"
              style={{ color: "black" }}
            >
              Discover Your Next
              <span className="CruiseShipHome-hero-accent"> Adventure</span>
            </h1>
            <p className="CruiseShipHome-hero-subtitle">
              Sail away to paradise with luxury accommodations, world-class
              dining, and unforgettable experiences across the globe.
            </p>
          </div>
        </section>

        <section className="CruiseShipHome-search">
          <div className="CruiseShipHome-search-container">
            <div className="CruiseShipHome-search-grid">
              <div className="CruiseShipHome-search-field">
                <div className="CruiseShipHome-search-icon">
                  <img
                    style={{ width: "450px", height: "250px" }}
                    src="\images\White-Cruise-Ship-PNG-Images-HD.png"
                    alt="Royal Voyager Ship"
                    className="CruiseShipHome-search-select"
                  />
                </div>
              </div>
              <div className="CruiseShipHome-search-field">
                <div className="CruiseShipHome-search-input">
                  <h3
                    style={{
                      color: "#1f2937",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    Horizon Cruiser - Majesty of the Seas
                  </h3>
                  <p
                    style={{
                      color: "#6b7280",
                      lineHeight: "1.6",
                      marginBottom: "1rem",
                    }}
                  >
                    Experience luxury redefined aboard our flagship vessel. With
                    18 decks of pure elegance, the Royal Voyager accommodates
                    4,500 guests in unparalleled comfort and style.
                  </p>
                  <div
                    style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
                  >
                    <div>
                      <strong style={{ color: "#3b82f6" }}>Capacity:</strong>
                      <span style={{ marginLeft: "0.5rem", color: "#4b5563" }}>
                        4,500 Guests
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: "#3b82f6" }}>Decks:</strong>
                      <span style={{ marginLeft: "0.5rem", color: "#4b5563" }}>
                        18 Levels
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: "#3b82f6" }}>Length:</strong>
                      <span style={{ marginLeft: "0.5rem", color: "#4b5563" }}>
                        1,188 ft
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section
          id="destinationsSection"
          className="CruiseShipHome-destinations"
        >
          <div className="CruiseShipHome-section-container">
            <div className="CruiseShipHome-section-header">
              <h2 className="CruiseShipHome-section-title">
                Popular Destinations
              </h2>
              <p className="CruiseShipHome-section-subtitle">
                Explore breathtaking locations around the world
              </p>
            </div>
            <div className="CruiseShipHome-destinations-grid">
              <div className="CruiseShipHome-destination-card CruiseShipHome-destination-large">
                <div className="CruiseShipHome-destination-image CruiseShipHome-caribbean"></div>
                <div className="CruiseShipHome-destination-content">
                  <h3>Caribbean Paradise</h3>
                  <p>7-14 days of tropical bliss</p>
                  <span className="CruiseShipHome-destination-price">
                    From $899
                  </span>
                </div>
              </div>
              <div className="CruiseShipHome-destination-card">
                <div className="CruiseShipHome-destination-image CruiseShipHome-mediterranean"></div>
                <div className="CruiseShipHome-destination-content">
                  <h3>Mediterranean</h3>
                  <p>Historic ports & culture</p>
                  <span className="CruiseShipHome-destination-price">
                    From $1,299
                  </span>
                </div>
              </div>
              <div className="CruiseShipHome-destination-card">
                <div className="CruiseShipHome-destination-image CruiseShipHome-alaska"></div>
                <div className="CruiseShipHome-destination-content">
                  <h3>Alaska Wilderness</h3>
                  <p>Glaciers & wildlife</p>
                  <span className="CruiseShipHome-destination-price">
                    From $1,599
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="CruiseShipHome-features">
          <div className="CruiseShipHome-section-container">
            <div className="CruiseShipHome-section-header">
              <h2 className="CruiseShipHome-section-title">
                Why Choose Royal Voyager
              </h2>
            </div>
            <div className="CruiseShipHome-features-grid">
              <div className="CruiseShipHome-feature-card">
                <div className="CruiseShipHome-feature-icon">🏨</div>
                <h3>Luxury Accommodations</h3>
                <p>
                  From interior staterooms to lavish suites with private
                  balconies
                </p>
              </div>
              <div className="CruiseShipHome-feature-card">
                <div className="CruiseShipHome-feature-icon">🍽️</div>
                <h3>World-Class Dining</h3>
                <p>
                  Multiple restaurants featuring cuisine from around the globe
                </p>
              </div>
              <div className="CruiseShipHome-feature-card">
                <div className="CruiseShipHome-feature-icon">🎭</div>
                <h3>Entertainment</h3>
                <p>Broadway-style shows, live music, and exciting activities</p>
              </div>
              <div className="CruiseShipHome-feature-card">
                <div className="CruiseShipHome-feature-icon">🌊</div>
                <h3>Ocean Adventures</h3>
                <p>
                  Snorkeling, diving, and water sports at stunning destinations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviewsSection" className="CruiseShipHome-testimonials">
          <div className="CruiseShipHome-section-container">
            <div className="CruiseShipHome-section-header">
              <h2 className="CruiseShipHome-section-title">
                What Our Guests Say
              </h2>
            </div>
            <div className="CruiseShipHome-testimonials-grid">
              <div className="CruiseShipHome-testimonial-card">
                <div className="CruiseShipHome-testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="CruiseShipHome-star-filled" />
                  ))}
                </div>
                <p>
                  "An absolutely incredible experience! The service was
                  impeccable and the destinations were breathtaking."
                </p>
                <div className="CruiseShipHome-testimonial-author">
                  - Sarah M.
                </div>
              </div>
              <div className="CruiseShipHome-testimonial-card">
                <div className="CruiseShipHome-testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="CruiseShipHome-star-filled" />
                  ))}
                </div>
                <p>
                  "Perfect family vacation! Something for everyone to enjoy.
                  Can't wait to book our next cruise."
                </p>
                <div className="CruiseShipHome-testimonial-author">
                  - Michael R.
                </div>
              </div>
              <div className="CruiseShipHome-testimonial-card">
                <div className="CruiseShipHome-testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="CruiseShipHome-star-filled" />
                  ))}
                </div>
                <p>
                  "The entertainment and dining exceeded all expectations. Truly
                  a luxury experience at sea."
                </p>
                <div className="CruiseShipHome-testimonial-author">
                  - Jennifer L.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="CruiseShipHome-footer">
          <div className="CruiseShipHome-footer-container">
            <div className="CruiseShipHome-footer-grid">
              <div className="CruiseShipHome-footer-section">
                <div className="CruiseShipHome-footer-logo">
                  <img
                    className="CruiseShipHome-footer-logo-icon"
                    src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
                  />
                  <span>Horizon Cruiser</span>
                </div>
                <p>Creating unforgettable ocean adventures since 1985</p>
              </div>
              <div className="CruiseShipHome-footer-section">
                <h4>Quick Links</h4>
                <ul>
                  <li>
                    <a href="#destinationsSection">Destinations</a>
                  </li>
                  <li>
                    <a href="#reviewsSection">Reviews</a>
                  </li>
                </ul>
              </div>
              <div className="CruiseShipHome-footer-section">
                <h4>Support</h4>
                <ul>
                  <li>
                    <a href="#contact">Contact Us</a>
                  </li>

                  <li>
                    <a href="#booking">Help</a>
                  </li>
                </ul>
              </div>
              <div className="CruiseShipHome-footer-section">
                <h4>Follow Us</h4>
                <div className="CruiseShipHome-social-links">
                  <a href="#" className="CruiseShipHome-social-link">
                    Facebook
                  </a>
                  <a href="#" className="CruiseShipHome-social-link">
                    Instagram
                  </a>
                  <a href="#" className="CruiseShipHome-social-link">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
            <div className="CruiseShipHome-footer-bottom">
              <p>
                &copy; 2025 Horizon Cruiser Cruise Lines. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
