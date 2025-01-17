// Registerpage.jsx
import React, { useState } from "react";
import { registerUserApi } from "../../apis/Api";
import "toastify-js/src/toastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Registerpage.css';
import ReCAPTCHA from "react-google-recaptcha";


const PasswordInput = ({ 
  value, 
  onChange, 
  label = "Password",
  placeholder = "Enter your password",
  error,
  autoComplete
}) => {
  const [isVisible, setIsVisible] = useState(false);


  const getStrengthData = (password) => {
    if (!password) return { width: '0%', color: '#e0e0e0', text: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (true) {
      case strength <= 2:
        return { 
          width: '33%', 
          color: '#ff4444', 
          text: 'Weak',
          bgColor: '#ffe5e5'
        };
      case strength <= 4:
        return { 
          width: '66%', 
          color: '#ffa700', 
          text: 'Medium',
          bgColor: '#fff3e0'
        };
      default:
        return { 
          width: '100%', 
          color: '#00C851', 
          text: 'Strong',
          bgColor: '#e8f5e9'
        };
    }
  };

  const strengthData = getStrengthData(value);

  return (
    <div className="password-field-container">
      <label className="form-label mt-1 mb-0 fs-5">{label}</label>
      
      <div className="position-relative">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="form-control form-control-lg"
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="password-toggle-btn"
        >
          {isVisible ? 
            <EyeOff className="password-icon" /> : 
            <Eye className="password-icon" />
          }
        </button>
      </div>

      {value && (
        <div className="password-strength-container">
          <div className="password-strength-meter">
            <div
              className="strength-meter-fill"
              style={{
                width: strengthData.width,
                backgroundColor: strengthData.color
              }}
            />
          </div>
          
          <div
            className="strength-meter-text"
            style={{
              backgroundColor: strengthData.bgColor,
              color: strengthData.color
            }}
          >
            {strengthData.text}
          </div>
        </div>
      )}

      {error && <p className="text-danger mt-0 mb-0">{error}</p>}
    </div>
  );
};

const Registerpage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const [fullNameError, setFullNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    setCaptchaError("");
  }

  const handleFullName = (e) => {
    setFullName(e.target.value);
    setFullNameError("");
  };

  const handlePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
    setPhoneNumberError("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  const validatePasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const isLengthValid = password.length >= 8;

    if (!isLengthValid || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
    }
    return '';
  };

  const validate = () => {
    let isValid = true;
    const passwordError = validatePasswordStrength(password);

    if (fullName.trim() === '') {
      setFullNameError("Please enter full name");
      isValid = false;
    }
    if (phoneNumber.trim() === '') {
      setPhoneNumberError("Please enter Phone Number");
      isValid = false;
    }
    if (password.trim() === '') {
      setPasswordError('Please enter password');
      isValid = false;
    } else if (passwordError) {
      setPasswordError(passwordError);
      isValid = false;
    }
    if (confirmPassword.trim() === '') {
      setConfirmPasswordError('Please enter confirm password');
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Password does not match');
      isValid = false;
    }
    if (passwordError) {
      toast.error(passwordError);
      return false;
    }
    if (!captchaValue) {
      setCaptchaError('Please complete the CAPTCHA');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      "fullName": fullName,
      "phoneNumber": phoneNumber,
      "password": password,
      'captchaToken': captchaValue
    };

    registerUserApi(data).then((res) => {
      if (res.data.success === false) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        navigate('/login');
      }
    });
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 full-height-bg">
        <div className="card mt-5 login-card position-absolute top-50 start-50 translate-middle ps-3 pe-3 pt-1 pb-1 rounded-4">
          <div className="text-center mt-3">
            <h1 className="fw-bold">Sign Up</h1>
            <div className="underline"></div>
          </div>
          
          <div className="mt-1">
            <label className="form-label fs-5 mb-0">Full Name</label>
            <input
              onChange={handleFullName}
              type="text"
              className="form-control form-control-lg"
              placeholder="full name"
            />
            {fullNameError && <p className="text-danger mt-0 mb-0">{fullNameError}</p>}
          </div>

          <div className="mt-2">
            <label className="form-label fs-5 mb-0">Number</label>
            <input
              onChange={handlePhoneNumber}
              type="number"
              className="form-control form-control-lg"
              placeholder="number"
            />
            {phoneNumberError && <p className="text-danger mt-0 mb-0">{phoneNumberError}</p>}
          </div>

          <div className="mt-1">
          <PasswordInput
            value={password}
            onChange={handlePassword}
            label="Password"
            placeholder="Enter password"
            autoComplete="new-password"
          />
          </div>

          <div>
            
          </div>
          

          <PasswordInput
            value={confirmPassword}
            onChange={handleConfirmPassword}
            label="Confirm Password"
            placeholder="Confirm password"
            error={confirmPasswordError}
            autoComplete="new-password"
          />
          <div className="mt-1 d-flex justify-content-center">
            <ReCAPTCHA
              sitekey="6LeHWLkqAAAAAMusqcr3Ose4uxIEtBxob9wwyrI6"
              onChange={handleCaptchaChange}
            />
          </div>
          {captchaError && <p className="text-danger text-center mt-1">{captchaError}</p>}

          <div className="mt-2">
            <button 
              onClick={handleSubmit} 
              className="btn-register btn btn-color w-100 btn-lg rounded-2"
            >
              Create Account
            </button>
          </div>

          <div className="mt-1 d-flex mb-1">
            <span className="align-self-center me-2">Already have an account?</span>
            <button 
              onClick={() => navigate('/login')} 
              type="button" 
              className="text-btn align-self-center"
            >
              Sign In
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Registerpage;