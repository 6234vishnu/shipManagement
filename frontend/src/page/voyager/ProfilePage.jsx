import  { useState, useEffect } from 'react';
import '../../assets/css/voyager/VoyagerProfile.css';
import VoyagerSidebar from './voyagerSideBar';
import api from '../../services/axiosInstance';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';

const VoyagerProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'voyager',
    userLogo: '',
    shipImage: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage,setErrorMessage]=useState("")
  const [errorModal,setErrorModal]=useState(false)
  const [successMessage,setSuccessMessage]=useState("")
  const [successModal,setSuccessModal]=useState(false)
const voyagerId=localStorage.getItem("voyagerId")
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const response = await api.post(`/voyager/auth/getDetails?voyagerId=${voyagerId}`);
      
      if (response.data.success) {
        setUser(response.data.voyager);
       return setEditData(response.data.voyager);
      }
      setErrorMessage(response.data.message)
      return setErrorModal(true)
    } catch (error) {
      console.error('Error fetching user data:', error);
        setErrorMessage(error?.response?.data?.message)
      return setErrorModal(true)
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({...user});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({...user});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
  
      const response = await api.post('/voyager/auth/Edit-profile',{editData});

      if (response.data.success) {
        setSuccessMessage('Profile Updated Successfully')
        setSuccessModal(true)
        return setTimeout(() => {
            fetchUserData()
        }, 3000);
      } 
      setErrorMessage(response.data.message)
      return setErrorModal(true)

    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error?.response?.data?.message)
      return setErrorModal(true)
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <>
    <VoyagerSidebar/>
    <div className="profile-container">
      <div className="profile-card">
        {/* Ship Image Header */}
        <div className="ship-header">
          <div className="ship-image-container">
           
              <div className="ship-placeholder">
                <div className="ship-icon">
                    <img src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg" alt="Add Ship Image" />
                    </div>
             
              </div>
    
          </div>
        </div>

        {/* Profile Header with User Logo */}
        <div className="profile-header">
          <div className="header-left">
            <div className="user-logo-container">
             
                <div className="user-logo-placeholder">
                  <div className="user-icon">👤</div>
                </div>
            
            </div>
            <div className="header-text">
              <h1>Voyager Profile</h1>
              <p className="profile-subtitle">Navigate your journey</p>
            </div>
          </div>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
               Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          <div className="field-group">
            <label> Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your name"
              />
            ) : (
              <div className="field-value">{user.name || 'Not specified'}</div>
            )}
          </div>

          <div className="field-group">
            <label> Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your email"
              />
            ) : (
              <div className="field-value">{user.email || 'Not specified'}</div>
            )}
          </div>

          <div className="field-group">
            <label> Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="field-value">{user.phone || 'Not specified'}</div>
            )}
          </div>

          <div className="field-group">
            <label> Role</label>
            <div className="field-value role-badge">⚓ {user.role}</div>
          </div>

         
        </div>

        {isEditing && (
          <div className="button-group">
            <button className="save-btn" onClick={handleSave} disabled={loading}>
              {loading ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
               Cancel
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

export default VoyagerProfile;