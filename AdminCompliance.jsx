import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCompliance = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('non-compliant');
  const [selectedListing, setSelectedListing] = useState(null);
  const [complianceIssues, setComplianceIssues] = useState([]);
  const [customIssue, setCustomIssue] = useState('');

  const commonIssues = [
    'Expired or near-expiry items',
    'Poor quality images',
    'Incomplete description',
    'Missing allergen information',
    'Incorrect category',
    'Quantity mismatch',
    'Prohibited items'
  ];

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      let url = '/api/admin/listings';
      if (filter === 'non-compliant') {
        url = '/api/admin/listings/non-compliant';
      } else if (filter === 'compliant') {
        url = '/api/admin/listings?compliant=true';
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(response.data.listings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNonCompliant = async (listingId) => {
    if (complianceIssues.length === 0) {
      alert('Please select at least one compliance issue');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `/api/admin/listings/${listingId}/mark-non-compliant`,
        { issues: complianceIssues },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Listing marked as non-compliant');
      fetchListings();
      setSelectedListing(null);
      setComplianceIssues([]);
      setCustomIssue('');
    } catch (error) {
      alert('Failed to mark listing as non-compliant');
    }
  };

  const handleRemoveListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/admin/listings/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Listing removed successfully');
      fetchListings();
    } catch (error) {
      alert('Failed to remove listing');
    }
  };

  const toggleIssue = (issue) => {
    setComplianceIssues(prev =>
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const addCustomIssue = () => {
    if (customIssue.trim()) {
      setComplianceIssues(prev => [...prev, customIssue.trim()]);
      setCustomIssue('');
    }
  };

  return (
    <div className="admin-compliance">
      <div className="page-header">
        <div>
          <h1>Compliance Management</h1>
          <p>Review and enforce listing guidelines (FR-A2)</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={filter === 'non-compliant' ? 'active' : ''}
          onClick={() => setFilter('non-compliant')}
        >
          ⚠️ Non-Compliant
        </button>
        <button 
          className={filter === 'compliant' ? 'active' : ''}
          onClick={() => setFilter('compliant')}
        >
          ✓ Compliant
        </button>
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          👁️ All Listings
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>Loading listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          <h3>No listings found</h3>
          <p>
            {filter === 'non-compliant' 
              ? 'Great! No non-compliant listings at this time.' 
              : 'No listings match the current filter.'}
          </p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => (
            <div key={listing._id} className={`listing-card ${!listing.isCompliant ? 'non-compliant' : ''}`}>
              <div className="listing-image">
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0]} alt={listing.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                {!listing.isCompliant && (
                  <div className="compliance-badge">
                    ⚠️ Non-Compliant
                  </div>
                )}
              </div>

              <div className="listing-content">
                <h3>{listing.title}</h3>
                <p className="merchant-name">{listing.merchantId?.businessName}</p>
                <p className="listing-description">{listing.description}</p>

                <div className="listing-meta">
                  <span className="quantity">Qty: {listing.quantity}</span>
                  <span className={`status ${listing.status}`}>{listing.status}</span>
                </div>

                {listing.complianceIssues && listing.complianceIssues.length > 0 && (
                  <div className="issues-list">
                    <strong>Issues:</strong>
                    <ul>
                      {listing.complianceIssues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="listing-actions">
                  {listing.isCompliant && listing.status === 'active' && (
                    <button 
                      className="mark-btn"
                      onClick={() => setSelectedListing(listing)}
                    >
                      ⚠️ Mark Non-Compliant
                    </button>
                  )}
                  {!listing.isCompliant && listing.status === 'active' && (
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveListing(listing._id)}
                    >
                      🗑️ Remove Listing
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedListing && (
        <div className="modal-overlay" onClick={() => setSelectedListing(null)}>
          <div className="modal-content compliance-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Mark as Non-Compliant</h2>
            <p>Select issues for: <strong>{selectedListing.title}</strong></p>

            <div className="issues-checkboxes">
              {commonIssues.map((issue) => (
                <label key={issue} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={complianceIssues.includes(issue)}
                    onChange={() => toggleIssue(issue)}
                  />
                  <span>{issue}</span>
                </label>
              ))}
            </div>

            <div className="custom-issue">
              <input
                type="text"
                value={customIssue}
                onChange={(e) => setCustomIssue(e.target.value)}
                placeholder="Add custom issue..."
                onKeyPress={(e) => e.key === 'Enter' && addCustomIssue()}
              />
              <button onClick={addCustomIssue}>Add</button>
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setSelectedListing(null);
                  setComplianceIssues([]);
                  setCustomIssue('');
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={() => handleMarkNonCompliant(selectedListing._id)}
                disabled={complianceIssues.length === 0}
              >
                Mark Non-Compliant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompliance;
