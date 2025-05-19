import React from 'react'
import '../assets/css/error/errorMsg.css'; 

const ErrorModal = ({ message, onClose }) => {
  return (
   <div className="errorModalBackdrop">
  <div className="errorModal">
    <img src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg" alt="Logo" className="errorModalLogo" />
    <h2>Error:</h2>
    <p>{message}</p>
    <button onClick={onClose}>Close</button>
  </div>
</div>

  )
}

export default ErrorModal
