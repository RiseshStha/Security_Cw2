import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import onlineImg from "../../assets/images/onlineshop.jpg";
import "../homepage/homepage.css";
import { getAllProductsApi } from "../../apis/Api";
import { Link } from "react-router-dom";

const Searchpage = () => {
  const [products, setProducts] = useState([]);

  const getProducts = () => {
    getAllProductsApi()
      .then((res) => {
        //success, message, list of products(products)
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getProducts();
  }, []);
  console.log(products);

  return (
    <>
      <div className="container-fluid d-flex">{/* <Navbar /> */}</div>
      <div className="container-fluid d-flex flex-column homepage-content">
        <div className="d-flex flex-wrap ps-2 container-fluid category-card border p-1 mt-1">
          <span className="me-2 text-light">Top Categories :</span>
          <ul className="d-flex flex-row list-group justify-content-center">
            <li className="align-items-center card ps-1 pe-1 me-2">Mobiles</li>
            <li className="align-items-center card ps-1 pe-1 me-2">
              Real Estate
            </li>
            <li className="align-items-center card ps-1 pe-1 me-2">Vehicles</li>
            <li className="align-items-center card ps-1 pe-1 me-2">
              Accesories
            </li>
          </ul>
        </div>
        <div className="mt-4 mb-2 text-dark text-center">
          <h3 className="">Latest Uploads</h3>
        </div>
        <div className="container-fluid">

          <div className="row">
            <div className="product-grid text-dark">
                        {products.map(product => (
                            // <div key={product._id} className="product-card ps-2">
                            //   <p className="condition"> {product.condition}</p>
                            //     <img src={`http://localhost:5000/products/${product.productImage}`} alt={product.productTitle} />
                            //     <h3 className="fw-bold">{product.postTitle}</h3>
                            //     <p className="text-primary fw-bold">NPR {product.price}</p>
                            //     <p>{product.description}</p>
                            // </div>
                            <Link to={`http://localhost:3000/post_detail/${product._id}`} className="product-card-link">
                            <div key={product._id} className="product-card ps-2">
                              <p className="condition"> {product.condition}</p>
                                <img src={`http://localhost:5000/products/${product.productImage}`} alt={product.productTitle} className="img-fluid" />
                                <h3 className="fw-bold">{product.postTitle}</h3>
                                <p className="text-primary fw-bold">NPR {product.price}</p>
                                <p>{product.description}</p>
                            </div>
                          </Link>
                        ))}
                    </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Searchpage;
