import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMerchantVerification = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchMerchants();
  }, [filter]);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/api/admin/merchants?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMerchants(response.data.merchants);
    } catch (error) {
      console.error('Failed to fetch merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (merchantId) => {
    if (!window.confirm('Are you sure you want to approve this merchant?')) return;
    
    setProcessing(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`/api/admin/merchants/${merchantId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Merchant approved successfully!');
      fetchMerchants();
      setSelectedMerchant(null);
    } catch (error) {
      alert('Failed to approve merchant');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (merchantId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    if (!window.confirm('Are you sure you want to reject this merchant?')) return;
    
    setProcessing(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`/api/admin/merchants/${merchantId}/reject`, 
        { reason: rejectionReason },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Merchant rejected');
      fetchMerchants();
      setSelectedMerchant(null);
      setRejectionReason('');
    } catch (error) {
      alert('Failed to reject merchant');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="admin-merchant-verification">
      <div className="page-header">
        <div>
          <h1>Merchant Verification</h1>
          <p>Review and approve merchant applications (FR-A1)</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'approved' ? 'active' : ''}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>Loading merchants...</p>
        </div>
      ) : merchants.length === 0 ? (
        <div className="empty-state">
          <h3>No merchants found</h3>
          <p>There are no {filter} merchants at this time.</p>
        </div>
      ) : (
        <div className="merchants-grid">
          {merchants.map((merchant) => (
            <div key={merchant._id} className="merchant-card">
              <div className="merchant-header">
                <div>
                  <h3>{merchant.businessName}</h3>
                  <p className="merchant-type">{merchant.businessType}</p>
                </div>
                <span className={`status-badge ${merchant.verificationStatus}`}>
                  {merchant.verificationStatus}
                </span>
              </div>

              <div className="merchant-details">
                <div className="detail-row">
                  <span>📧</span>
                  <span>{merchant.userId.email}</span>
                </div>
                <div className="detail-row">
                  <span>📞</span>
                  <span>{merchant.userId.phone || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span>🏢</span>
                  <span>{merchant.businessAddress}</span>
                </div>
              </div>

              {merchant.verificationStatus === 'pending' && (
                <div className="merchant-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => handleApprove(merchant._id)}
                    disabled={processing}
                  >
                    ✓ Approve
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => setSelectedMerchant(merchant)}
                    disabled={processing}
                  >
                    ✗ Reject
                  </button>
                </div>
              )}

              {merchant.rejectionReason && (
                <div className="rejection-reason">
                  <strong>Rejection Reason:</strong>
                  <p>{merchant.rejectionReason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedMerchant && (
        <div className="modal-overlay" onClick={() => setSelectedMerchant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Merchant</h2>
            <p>Provide reason for rejecting <strong>{selectedMerchant.businessName}</strong></p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
            />

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setSelectedMerchant(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
              <button 
                className="reject-confirm-btn"
                onClick={() => handleReject(selectedMerchant._id)}
                disabled={processing || !rejectionReason.trim()}
              >
                {processing ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMerchantVerification;
