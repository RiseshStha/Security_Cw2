import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { getProducts, paginationApi } from "../../apis/Api"; // Updated API import
import logo from "../../assets/images/logo.png";
import onlineImg from "../../assets/images/onlineshop.jpg";
import "../homepage/homepage.css";

const Homepage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const searchResults = location.state?.searchResults || [];

  const fetchProducts = (pageNo = 1, category = "") => {
    getProducts(pageNo, category)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
          setTotalPages(Math.ceil(res.data.totalProducts / 4)); // Adjust if necessary
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchProducts(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to the first page when a new category is selected
  };

  return (
    <>
      <div className="container-fluid d-flex"></div>
      <div className="container-fluid d-flex flex-column homepage-content">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner rounded-4">
            <div className="carousel-item active">
              <div className="home-banner-1">
                <div className="home-banner-text">
                  <h1 className="text-white">Shoes</h1>
                  <h2 className="text-white">50% Discount for this Season</h2>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="home-banner-2">
                <div className="home-banner-text">
                  <h1 className="text-white">BargainBazzar</h1>
                  <h2 className="text-white">50% Discount for this Season</h2>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="home-banner-3">
                <div className="home-banner-text">
                  <h1 className="text-white">BargainBazzar</h1>
                  <h2 className="text-white">50% Discount for this Season</h2>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <div className="d-flex flex-wrap ps-2 container-fluid category-card border p-1 mt-1">
          <div className="d-flex flex-row overflow-auto no-scrollbar">
            <div
              className="category-item ms-3 me-2 text-dark"
              onClick={() => handleCategoryClick("mobiles")}
            >
              Mobile Phones & Accessories
            </div>
            <div
              className="category-item me-2 text-dark"
              onClick={() => handleCategoryClick("vehicles")}
            >
              Vehicles
            </div>
            <div
              className="category-item me-2 text-dark"
              onClick={() => handleCategoryClick("Real Estate")}
            >
              Real Estate
            </div>
            <div
              className="category-item me-2 text-dark"
              onClick={() => handleCategoryClick("gadgets")}
            >
              Gadgets
            </div>
            <div
              className="category-item me-2 text-dark"
              onClick={() => handleCategoryClick("accessories")}
            >
              Accessories
            </div>
            <div
              className="category-item me-2 text-dark"
              onClick={() => handleCategoryClick("clothes")}
            >
              Clothes
            </div>
            {/* Add more categories here */}
          </div>
        </div>
        <div className="mt-4 mb-2 text-dark text-center">
          <h3 className="">Latest Uploads</h3>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="product-grid text-dark">
              {searchResults.length > 0
                ? searchResults.map((product) => (
                    <Link
                      to={`/post_detail/${product._id}`}
                      className="product-card-link"
                      key={product._id}
                    >
                      <div className="product-card ps-2">
                        <p className="condition">{product.condition}</p>
                        <img
                          src={`http://localhost:5000/products/${product.productImage}`}
                          alt={product.productTitle}
                          className="img-fluid"
                        />
                        <h3 className="fw-bold">{product.postTitle}</h3>
                        <p className="text-primary fw-bold">
                          NPR {product.price}
                        </p>
                        <p>{product.description}</p>
                      </div>
                    </Link>
                  ))
                : products.length > 0 &&
                  products.map((product) => (
                    <Link
                      to={`/post_detail/${product._id}`}
                      className="product-card-link"
                      key={product._id}
                    >
                      <div className="product-card ps-2">
                        <p className="condition">{product.condition}</p>
                        <img
                          src={`http://localhost:5000/products/${product.productImage}`}
                          alt={product.productTitle}
                          className="img-fluid"
                        />
                        <h3 className="fw-bold">{product.postTitle}</h3>
                        <p className="text-primary fw-bold">
                          NPR {product.price}
                        </p>
                        <p>{product.description}</p>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
          <div className="pagination-controls text-center mt-4 mb-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn rounded-5 pagination-btn me-2"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn rounded-5 pagination-btn ms-2"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
