import React from "react";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import "../components/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    navigate("/login");
  };
  const handleRegister = (e) => {
    navigate("/register");
  };
  const handleGetStarted = (e) => {
    navigate("/login");
  };
  //get user data
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-white sticky-top bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src={logo} className="rounded-circle" alt="" />
            <span className="ms-2">MeroBazzar</span>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#top">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link " aria-current="page" href="#about">
                  About
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link " aria-current="page" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
            <button
              onClick={handleLogin}
              className="btn btn-brand ms-lg-3 me-1 rounded-4"
              type="submit"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="btn btn-brand ms-lg-3 rounded-4"
              type="submit"
            >
              SignUp
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
