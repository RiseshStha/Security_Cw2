import React, { useState, useEffect } from "react";
import { getCsrfTokenApi, loginUserApi } from "../../apis/Api";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";
import logo from "../../assets/images/logo.png";
import fb from "../../assets/images/fbicon.png";
import google from "../../assets/images/googleicon.png";
import "toastify-js/src/toastify.css";
import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/Navbar";
import ReCAPTCHA from "react-google-recaptcha";

const Loginpage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  //csrf 
  const getCsrfToken = async () => {
    try {
        const response = await getCsrfTokenApi();
        localStorage.setItem('csrfToken', response.data.csrfToken);
        // console.log('CSRF Token:', response.data.csrfToken);
        console.log(response.data.csrfToken)
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
  };
  useEffect(() => {
    getCsrfToken();
}, []);
  
  

   const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    setCaptchaError("");
  }

  const validate = () => {
    let isValid = true;
    
    if (phoneNumber.trim() === "") {
      setPhoneNumberError("Phone number is empty or invalid");
      isValid = false;
    }
    if (password.trim() === "") {
      setPasswordError("Please enter password");
      isValid = false;
    }
    if (!captchaValue) {
      setCaptchaError('Please complete the CAPTCHA');
      isValid = false;
    }
    return isValid;
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) {
  //     return;
  //   }
  //   const data = {
  //     phoneNumber: phoneNumber,
  //     password: password,
  //   };

  //   try {
  //     await loginUserApi(data).then((res) => {
  //       if (!res.data.success) {
  //         toast.error(res.data.message);
  //       } else {
  //         toast.success(res.data.message);
  //         localStorage.setItem("token", res.data.token);
  //         localStorage.setItem("user", JSON.stringify(res.data.userData));
  //         navigate("/home");
  //       }
  //     });
  //   } catch (error) {
  //     if (error.response) {
  //       if (error.response.status === 400) {
  //         toast.error("Invalid credentials or missing fields.");
  //       } else {
  //         toast.error(error.response.data.message || "An error occurred. Please try again later.");
  //       }
  //     } else {
  //       toast.error("An error occurred. Please try again later.");
  //     }
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    getCsrfToken();
    
    // Clear any existing errors
    setPhoneNumberError("");
    setPasswordError("");
    
    // Validate inputs
    if (!validate()) {
        return;
    }

    const data = {
        phoneNumber: phoneNumber.trim(),
        password: password,
        captchaToken: captchaValue
    };

    try {
        const res = await loginUserApi(data);
        
        // Check response status and success flag
        if (!res.data.success) {
            // Handle specific error messages
            if (res.data.message.toLowerCase().includes('password')) {
                setPasswordError(res.data.message);
            } else if (res.data.message.toLowerCase().includes('user')) {
                setPhoneNumberError(res.data.message);
            } else {
                toast.error(res.data.message);
            }
            return;
        }

        // Success case
        toast.success("Login successful!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.userData));
        navigate("/home");

    } catch (error) {
        console.error("Login error:", error);
        
        // Handle different types of errors
        if (error.response) {
            const errorMessage = error.response.data?.message || "Invalid credentials";
            toast.error(errorMessage);
        } else if (error.request) {
            toast.error("Network error. Please check your connection.");
        } else {
            toast.error("An error occurred. Please try again.");
        }
    }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleForgotPassword = () => {
    navigate("/forgot_password");
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 full-height-bg">
        <div className="card p-4 shadow login-card rounded-4">
          <div className="text-center">
            <img
              height={"100px"}
              width={"100px"}
              src={logo}
              alt=""
              className="img-fluid rounded-circle mt-3"
            />
          </div>
          <div className="text-center mt-1">
            <h1 className="fw-bold">Login</h1>
            <div className="underline"></div>
          </div>
          <div data-mdb-input-init className="mt-1 input-group form-outline">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="number"
              value={phoneNumber}
              className="form-control form-control-lg"
              placeholder="number"
              required
            />
          </div>
          {phoneNumberError && (
            <p className="text-danger mb-0">{phoneNumberError}</p>
          )}
          <div className="position-relative mt-2 input-group form-outline">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="form-control form-control-lg"
              value={password}
              placeholder="password"
              required
            />
            <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && <p className="text-danger mb-0">{passwordError}</p>}
          <div className="mt-2 d-flex flex-row justify-content-between ps-3 pe-3">
            <button onClick={handleForgotPassword} className="text-btn">Forget Password?</button>
            <button onClick={handleSignUp} className="text-btn">
              Sign Up
            </button>
          </div>
          <div className="mt-3 d-flex justify-content-center">
            <ReCAPTCHA
              sitekey="6LeHWLkqAAAAAMusqcr3Ose4uxIEtBxob9wwyrI6"
              onChange={handleCaptchaChange}
            />
          </div>
          {captchaError && <p className="text-danger text-center mt-2">{captchaError}</p>}
          <div className="mb-4">
            <button
              onClick={handleLogin}
              className="btn btn-primary mt-4 w-100 btn-lg rounded-2 btn-color"
            >
              Login
            </button>
          </div>
          <div className="flex flex-row text-center">
            <button className="image-button me-4">
              <img src={fb} alt="" className="img-fluid rounded-circle" />
            </button>
            <button className="image-button">
              <img src={google} alt="" className="img-fluid rounded-circle" />
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Loginpage;
