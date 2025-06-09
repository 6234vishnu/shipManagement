import React from "react";
import "../../assets/css/voyager/ContactUs.css";
import VoyagerSidebar from "./voyagerSideBar";

const ContactUs = () => {
  return (
    <>
      <VoyagerSidebar />
      <div className="contactHorizon-container">
        <div className="contactHorizon-content">
          <div className="contactHorizon-text">
            <h2>Contact Horizon Cruiser</h2>
            <p>
              Set sail on a journey of luxury and unforgettable memories with
              Horizon Cruiser. Whether you're planning a dream vacation or have
              any inquiries, we’re just a call away.
            </p>
            <p className="contactHorizon-phone">📞 +91 98765 43210</p>
          </div>
          <div className="contactHorizon-image-container">
            <img
              src="\images\big-luxurious-cruise-ship-docked-nice-harbor-ai-generative_123827-23853.jpg"
              alt="Horizon Cruiser"
              className="contactHorizon-image"
            />
          </div>
        </div>

        <footer className="contactHorizon-footer">
          &copy; {new Date().getFullYear()} Horizon Cruiser. All rights
          reserved.
        </footer>
      </div>
    </>
  );
};

export default ContactUs;
