import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { forgotPasswordApi, verifyOtp } from "../../apis/Api";
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPasswordApi({ phoneNumber });
      if (res.status === 200) {
        toast.success(res.data.message);
        setIsSent(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const data = { phoneNumber, otp, password };
    try {
      const res = await verifyOtp(data);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="forgot-password-container d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow rounded-3" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form>
          <div className="form-group mb-3">
            <label htmlFor="phone">
              Enter your phone number and we'll send you a verification code
              to reset your password
            </label>
            <input
              type="text"
              className="form-control mt-2"
              id="phone"
              placeholder="Enter your phone number"
              disabled={isSent}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          {isSent && (
            <>
              <span className="text-success d-block mb-3">
                OTP has been sent to {phoneNumber} ✅
              </span>
              <div className="form-group mb-3">
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  type="number"
                  className="form-control"
                  placeholder="Enter OTP"
                />
              </div>
              <div className="form-group mb-3">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control"
                  placeholder="Set New Password"
                />
              </div>
              <button
                onClick={handleVerify}
                className="btn btn-primary w-100"
              >
                Verify OTP & Set Password
              </button>
            </>
          )}
          {!isSent && (
            <button
              onClick={handleForgotPassword}
              className="btn btn-primary w-100"
            >
              Submit
            </button>
          )}
        </form>
        <a href="/login" className="d-block text-center mt-3">
          Back to Login
        </a>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
