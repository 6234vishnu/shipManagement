import React from 'react';
import '../assets/css/success/success.css';
import { Player } from '@lottiefiles/react-lottie-player';
import lottieAnimtion from '../assets/animations/Animation - 1747637006233.json';

function SuccessModal({ message, onClose }) {
  return (
    <div className="successModalBackdrop">
      <div className="successModal">
        <img
          src="/images/1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
          alt="Logo"
          className="successModalLogo"
        />

        <div className="successAnimationPlaceholder">
          <Player
            autoplay
            loop
            src={lottieAnimtion}
            style={{ height: '100px', width: '100px' }}
          />
        </div>

        <h2>Success</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default SuccessModal;
