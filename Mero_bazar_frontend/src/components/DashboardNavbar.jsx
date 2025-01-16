import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/images/logo.png";
import "../components/DashboardNavbar.css";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Postpage from "../pages/postpage/Postpage";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import { searchApi } from "../apis/Api";
// Adjust the import path as necessary

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  // const userId = user._id;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('createdAt,asc');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const profilePage = () => {
    navigate("/profile");
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBargain = (e) =>{
    window.location.href = '/home';
  }
  const handleMessage = (e) =>{
    navigate("/Chat");
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await searchApi({params: {
        search: searchTerm,
        page,
        limit: 10, // Adjust as needed
        sort // Format: "field,order"
      }});
    //   if (response.data.success) {
    //     setSearchResults(response.data.products);
    //   }
    // } catch (error) {
    //   console.error("Error fetching search results:", error);
    // }
    if (response.data.success) {
      navigate("/home", { state: { searchResults: response.data.products } });
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-2">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" onClick={handleBargain}>
            <img
              src={logo}
              alt="Logo"
              height="40"
              width="40"
              className="rounded-circle me-2"
            />
            <span className="brand-text">BargainBazar</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <form
              className="d-flex mx-auto my-2 my-lg-0 search-form"
              role="search"
              onSubmit={handleSearchSubmit}
            >
              <input
                className="ps-3 form-control me-2 search-input rounded-5"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <button
                className="btn btn-outline-success btn-brand rounded-5"
                type="submit"
              >
                Search
              </button>
            </form>
            <ul className=" nav-ul mb-1 mb-lg-0 d-flex justify-content-evenly align-items-center">
              <li className="nav-item mx-3">
                <a className="nav-link" href="#">
                  <AiOutlineQuestionCircle className="nav-icon" />
                </a>
              </li>
              <li className="nav-item mx-3">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary bg-dark btn-outline-dark dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <IoPersonCircleOutline className="nav-icon" />
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to={`/profile`} className="dropdown-item">
                        <FaUser className="me-2"/>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={handleMessage}>
                        <IoMdSettings className="me-2"/>
                        Settings
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item"
                        href="#"
                      >
                        <RiLogoutBoxLine className="me-2"/>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="nav-item mx-3">
                <button
                  className="btn btn-primary d-flex align-items-center btn-brand rounded-5"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  <CiSquarePlus className="icon me-2" />
                  Post
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Postpage />
    </>
  );
};

export default DashboardNavbar;
