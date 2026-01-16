import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  const roles = ['admin', 'merchant', 'customer', 'driver'];

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = roleFilter !== 'all' ? `?role=${roleFilter}` : '';
      const response = await axios.get(`/api/admin/users${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `/api/admin/users/${userId}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert(`User ${action}d successfully`);
      fetchUsers();
    } catch (error) {
      alert(`Failed to ${action} user`);
    }
  };

  const handleUpdateRole = async () => {
    if (!newRole) {
      alert('Please select a role');
      return;
    }

    if (!window.confirm(`Change user's role to ${newRole}?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `/api/admin/users/${selectedUser._id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('User role updated successfully');
      fetchUsers();
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-user-management">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage users and roles across the platform (FR-A3)</p>
        </div>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="role-filters">
          <button 
            className={roleFilter === 'all' ? 'active' : ''}
            onClick={() => setRoleFilter('all')}
          >
            All Users
          </button>
          {roles.map(role => (
            <button
              key={role}
              className={roleFilter === role ? 'active' : ''}
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-indicator ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn edit"
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.role);
                        }}
                        title="Edit Role"
                      >
                        ✏️
                      </button>
                      <button
                        className={`icon-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? '🚫' : '✅'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit User Role</h2>
            <p>Update role for: <strong>{selectedUser.name}</strong></p>
            
            <div className="role-selection">
              {roles.map(role => (
                <label key={role} className="radio-label">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={newRole === role}
                    onChange={(e) => setNewRole(e.target.value)}
                  />
                  <span className={`role-option ${role}`}>{role}</span>
                </label>
              ))}
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setSelectedUser(null);
                  setNewRole('');
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleUpdateRole}
                disabled={!newRole || newRole === selectedUser.role}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
