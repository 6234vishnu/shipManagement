import React, { useState, useEffect } from 'react';
import { Check, X, User, Shield, ChefHat, Users, Clock, Search } from 'lucide-react';
import '../../assets/css/admin/AdminStaffApproval.css';
import api from '../../services/axiosInstance';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import Sidebar from './sidebar';

const ITEMS_PER_PAGE = 3;

const AdminStaffApproval = () => {
  const [staffRequests, setStaffRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [errormodal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const getRequest = async () => {
    try {
      const response = await api.get('/admin/get-Staffs-SignUpRequest');
      if (response.data.success) {
        setStaffRequests(response.data.requests);
        return setLoading(false);
      }
      setErrorMessage(response.data.message);
      return setErrorModal(true);
    } catch (error) {
      console.log('error in get request admin side staffs signup approval', error);
      setErrorMessage(error?.response?.data?.message);
      return setErrorModal(true);
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  const handleApprove = async (staffId) => {
    try {
      // await approveStaff(staffId);
      setStaffRequests((prev) => prev.filter((staff) => staff._id !== staffId));
    } catch (error) {
      console.error('Error approving staff:', error);
    }
  };

  const handleReject = async (staffId) => {
    try {
      // await rejectStaff(staffId);
      setStaffRequests((prev) => prev.filter((staff) => staff._id !== staffId));
    } catch (error) {
      console.error('Error rejecting staff:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'manager':
        return <Shield className="role-icon" />;
      case 'head-cook':
        return <ChefHat className="role-icon" />;
      case 'supervisor':
        return <Users className="role-icon" />;
      default:
        return <User className="role-icon" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRequests = staffRequests.filter((staff) => {
    const matchesSearch = staff.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || staff.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading staff requests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">
            <Shield className="title-icon" />
            Staff Approval Dashboard
          </h1>
          <p className="admin-subtitle">Review and approve pending staff signup requests</p>
        </div>

        <div className="filters-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="manager">Manager</option>
            <option value="head-cook">Head Cook</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <Clock className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{filteredRequests.length}</span>
              <span className="stat-label">Pending Requests</span>
            </div>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-icon" />
            <h3>No pending requests</h3>
            <p>All staff signup requests have been processed.</p>
          </div>
        ) : (
          <>
            <div className="requests-grid">
              {paginatedRequests.map((staff) => (
                <div key={staff._id} className="request-card">
                  <div className="card-header">
                    <div className="user-info">
                      {getRoleIcon(staff.role)}
                      <div className="user-details">
                        <h3 className="username">{staff.username}</h3>
                        <span className={`role-badge role-${staff.role}`}>
                          {staff.role.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="request-date">
                      <Clock className="date-icon" />
                      <span>{formatDate(staff.createdAt)}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      onClick={() => handleApprove(staff._id)}
                      className="action-btn approve-btn"
                    >
                      <Check className="btn-icon" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(staff._id)}
                      className="action-btn reject-btn"
                    >
                      <X className="btn-icon" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="pagination-btn"
              >
                &laquo; Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="pagination-btn"
              >
                Next &raquo;
              </button>
            </div>
          </>
        )}
      </div>

      {errormodal && (
        <ErrorModal message={errorMessage} onClose={() => setErrorModal(false)} />
      )}
      {successModalOpen && (
        <SuccessModal message={successMessage} onClose={() => setSuccessModalOpen(false)} />
      )}
    </>
  );
};

export default AdminStaffApproval;
