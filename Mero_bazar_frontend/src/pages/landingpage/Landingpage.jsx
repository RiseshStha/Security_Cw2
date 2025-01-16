import React from 'react'
import '../landingpage/Landingpage.css'
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';

const Landingpage = () => {
    const navigate = useNavigate(); 
    const handleGetStarted =(e) =>{
      navigate('/login');
    }
  return (
    <>
    {/* <nav class="navbar navbar-expand-lg bg-white sticky-top bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img src={logo} className="rounded-circle" alt="" />
      <span className='ms-2'>BargainBazzar</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#top">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " aria-current="page" href="#about">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " aria-current="page" href="#contact">Contact</a>
        </li>
      </ul>
      <button onClick={handleLogin} className="btn btn-brand ms-lg-3 me-1 rounded-4" type="submit">Login</button>
      <button onClick={handleRegister} className="btn btn-brand ms-lg-3 rounded-4" type="submit">SignUp</button>
    </div>
    </div>
    </nav> */}
    {/* Home */}
    <section id='top' className='min-vh-100 d-flex align-items-center text-center'>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className='text-uppercase fw-semibold display-1'>Welcome to BargainBazzar</h1>
            <h5>We are here to ease the buying and selling of products</h5>
            <button onClick={handleGetStarted} className='btn btn-brand me-3'>Get Started</button>
            <button className='btn btn-light text-black'>Contact Us</button>
          </div>
        </div>
      </div>
    </section>
    {/* About */}
    <section id='about' className='section-padding'>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <div className="section-title">
              <h1 className='display-4 fw-semibold'>About us</h1>
              <div className="line"></div>
               <p>We are here to improve the buying and selling products through online</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 about-img">
            <img src={logo} alt="" />
          </div>
          <div className="col-lg-5">
            <h1>About BargainBazzar</h1>
            <p>BargainBazzar is a platform designed to facilitate the trading of both new and used products. With a focus of convenience, affordability, and user-friendly design, BargainBazzar will improve online marketplace experience.  User can list their products as well as contact to other user for the listed products in the platform for trading the products. </p>
            <div>
              <div className="iconbox">
              <i class="ri-mail-send-line"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Contact */}
    <section className='section-padding bg-dark' id='contact'>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <div className="section-title">
              <h1 className='display-4 text-white fw-semibold'>Get in touch</h1>
              <div className="line bg-white"></div>
              <p className='text-white'>Contact no: 987654321</p>
              <p className='text-white'>Email : bargainbazzar@gmail.com</p>
              <p className='text-white'>Location : Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default Landingpage