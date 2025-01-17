import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { loginUserApi } from "../apis/Api";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../pages/admin/Admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.isAdmin) {
        navigate("/admin/dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await loginUserApi({
        phoneNumber,
        password,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      const userData = res.data.userData;
      if (!userData.isAdmin) {
        toast.error("Access denied: Admin rights required");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Login successful!");
      navigate("/admin/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="text-center mb-4">
          <h2 className="admin-title">Admin Login</h2>
          <p className="admin-subtitle">Access your admin dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="input-group mb-4">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span 
              className="input-group-text cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="admin-submit-btn">
            Login as Admin
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;