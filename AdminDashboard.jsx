import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/admin/analytics/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Listings',
      value: analytics?.totalListings || 0,
      icon: 'package',
      color: 'blue',
      subtitle: 'Food items listed'
    },
    {
      title: 'Completed Transactions',
      value: analytics?.completedTransactions || 0,
      icon: 'check-circle',
      color: 'green',
      subtitle: 'Successfully delivered'
    },
    {
      title: 'Donations',
      value: analytics?.donations || 0,
      icon: 'trending-up',
      color: 'purple',
      subtitle: 'Items donated'
    },
    {
      title: 'Purchases',
      value: analytics?.purchases || 0,
      icon: 'dollar-sign',
      color: 'orange',
      subtitle: 'Items purchased'
    },
    {
      title: 'Active Users',
      value: analytics?.activeUsers || 0,
      icon: 'users',
      color: 'pink',
      subtitle: `of ${analytics?.totalUsers || 0} total`
    },
    {
      title: 'Pickup Rate',
      value: analytics?.pickupCompletionRate || '0%',
      icon: 'activity',
      color: 'teal',
      subtitle: 'Completion rate'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Overview of platform activity and performance</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className={`admin-stat-card ${stat.color}`}>
            <div className="admin-stat-icon">
              {stat.icon === 'package' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              )}
              {stat.icon === 'check-circle' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              {stat.icon === 'trending-up' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              )}
              {stat.icon === 'dollar-sign' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              )}
              {stat.icon === 'users' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              )}
              {stat.icon === 'activity' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              )}
            </div>
            <div className="admin-stat-content">
              <p className="admin-stat-title">{stat.title}</p>
              <h2 className="admin-stat-value">{stat.value}</h2>
              <p className="admin-stat-subtitle">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-card">
          <h3>Users by Role</h3>
          <div className="role-breakdown">
            {analytics?.usersByRole?.map((role) => (
              <div key={role._id} className="role-item">
                <div className="role-info">
                  <span className="role-name">{role._id}</span>
                  <span className="role-count">{role.count}</span>
                </div>
                <div className="role-bar">
                  <div 
                    className="role-bar-fill"
                    style={{ 
                      width: `${(role.count / analytics.totalUsers * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-dashboard-card">
          <h3>Listings by Status</h3>
          <div className="status-breakdown">
            {analytics?.listingsByStatus?.map((status) => (
              <div key={status._id} className="status-item">
                <span className={`status-badge ${status._id}`}>
                  {status._id}
                </span>
                <span className="status-count">{status.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-dashboard-card recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {analytics?.recentActivity?.slice(0, 5).map((transaction) => (
            <div key={transaction._id} className="activity-item">
              <div className="activity-icon">
                {transaction.type === 'donation' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                )}
              </div>
              <div className="activity-content">
                <p className="activity-text">
                  <strong>{transaction.customerId?.name}</strong>
                  {' '}{transaction.type === 'donation' ? 'received donation from' : 'purchased from'}{' '}
                  <strong>{transaction.merchantId?.businessName}</strong>
                </p>
                <p className="activity-time">
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`activity-status ${transaction.pickupStatus}`}>
                {transaction.pickupStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
