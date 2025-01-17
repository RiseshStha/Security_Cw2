import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUsers, FaSignOutAlt, FaUserLock, FaUserCheck } from "react-icons/fa";
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    checkAdminAuth();
    fetchUsers();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || !user.isAdmin) {
      navigate("/admin/login");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/all-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  const handleToggleBlock = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/toggle-block/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error toggling user block:", error);
      toast.error("Failed to update user status");
    }
  };

  const getDashboardStats = () => {
    const totalUsers = users.length;
    const blockedUsers = users.filter(user => user.lockUntil && new Date(user.lockUntil) > new Date()).length;
    const activeUsers = totalUsers - blockedUsers;

    return { totalUsers, activeUsers, blockedUsers };
  };

  const stats = getDashboardStats();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <div className="admin-sidebar-menu">
          <button
            className={`sidebar-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers /> Users
          </button>
          <button className="sidebar-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        <div className="admin-header">
          <h2>Dashboard</h2>
        </div>

        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserCheck />
            </div>
            <div className="stat-info">
              <h3>Active Users</h3>
              <p>{stats.activeUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserLock />
            </div>
            <div className="stat-info">
              <h3>Blocked Users</h3>
              <p>{stats.blockedUsers}</p>
            </div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Login Attempts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <span className={`status-badge ${
                      user.lockUntil && new Date(user.lockUntil) > new Date()
                        ? "blocked"
                        : "active"
                    }`}>
                      {user.lockUntil && new Date(user.lockUntil) > new Date()
                        ? "Blocked"
                        : "Active"}
                    </span>
                  </td>
                  <td>{user.loginAttempts}</td>
                  <td>
                    <button
                      className={`action-btn ${
                        user.lockUntil && new Date(user.lockUntil) > new Date()
                          ? "unblock"
                          : "block"
                      }`}
                      onClick={() => handleToggleBlock(user._id)}
                    >
                      {user.lockUntil && new Date(user.lockUntil) > new Date()
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;