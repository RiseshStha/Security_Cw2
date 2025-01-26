import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaSave, FaTimes, FaUpload, FaCamera } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import "../userprofile/UserProfile.css";
import {
  deletePost,
  getAllProductsByUserId,
  getCsrfTokenApi,
  getSimilarProductsApi,
  getUserDetails,
  updatePost,
  updateUserDetails,
  updateUserProfile
} from "../../apis/Api";
import { toast } from "react-toastify";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;

  const [products, setProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [userDetail, setUserDetail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    postTitle: '',
    description: '',
    category: '',
    condition: '',
    negotation: '',
    price: '',
    delivery: '',
    location: '',
    productImage: null
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [updatingImage, setUpdatingImage] = useState(false);
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
    getAllProducts();
    getSimilarProducts();
    getUser();
  }, []);

  const getAllProducts = () => {
    getAllProductsByUserId(userId)
      .then((res) => setProducts(res.data.product))
      .catch((error) => console.log(error));
  };

  const getUser = () => {
    getUserDetails(userId)
      .then((res) => {
        setUserDetail(res.data.userDetails);
        setUserDetails({
          fullName: res.data.userDetails.fullName,
          phoneNumber: res.data.userDetails.phoneNumber,
          address: res.data.userDetails.address,
        });
      })
      .catch((error) => console.log(error));
  };

  const getSimilarProducts = async () => {
    await getSimilarProductsApi(userId)
      .then((res) => setSimilarProducts(res.data.products))
      .catch((error) => console.log(error));
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateUserDetails(userId, userDetails)
      .then((res) => {
        toast.success(res.data.message);
        setEditingProfile(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update user details");
      });
  };
  
  const handleProfileImageUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (profileImage) {
      formData.append("profileImage", profileImage);
      updateUserProfile(userId, formData)
        .then((res) => {
          toast.success(res.data.message);
          setProfileImage(null);
          setUpdatingImage(false);
          getUser(); // Refresh user details
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to update profile image");
        });
    } else {
      toast.error("No profile image selected");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      postTitle: product.postTitle,
      description: product.description,
      category: product.category,
      condition: product.condition,
      negotation: product.negotation,
      price: product.price,
      delivery: product.delivery,
      location: product.location,
      productImage: product.productImage
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditFormData((prevData) => ({
      ...prevData,
      productImage: file
    }));
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm("Are you sure want to delete?");
    if (confirmDialog) {
      deletePost(id)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            getAllProducts();
          } else {
            toast.error("Error in frontend!");
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 500) {
              toast.error(error.response.data.message);
            } else if (error.response.status === 400) {
              toast.error(error.response.data.message);
            } else {
              toast.error("No response!");
            }
          }
        });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("postTitle", editFormData.postTitle);
    formData.append("description", editFormData.description);
    formData.append("category", editFormData.category);
    formData.append("condition", editFormData.condition);
    formData.append("negotation", editFormData.negotation);
    formData.append("price", editFormData.price);
    formData.append("delivery", editFormData.delivery);
    formData.append("location", editFormData.location);
    if (editFormData.productImage instanceof File) {
      formData.append("productImage", editFormData.productImage);
    }

    console.log('Form Data:', Object.fromEntries(formData.entries())); // Log form data for debugging

    updatePost(editingProduct, formData)
      .then((res) => {
        toast.success(res.data.message);
        setEditingProduct(null);
        getAllProducts();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to update product");
      });
  };

  return (
    <>
      <div className="profile-height d-flex flex-wrap text-dark">
        <div className="p-2 flex-fill bd-highlight border-end border-2 shadow-none p-1 bg-light rounded">
          <div className="d-flex flex-column">
            <h2 className="text-center mb-3">Profile</h2>
            <div className="d-flex justify-content-center position-relative">
              <img
                src={profileImage ? URL.createObjectURL(profileImage) : `https://localhost:5000/profiles/${userDetail.profileImage}`}
                alt=""
                className="user-profile rounded-circle mb-3"
                onClick={() => setUpdatingImage(true)}
                style={{ cursor: 'pointer' }}
              />
              <FaCamera 
                className="position-absolute bottom-0 end-0 mb-3 me-3" 
                style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'gray' }} 
                onClick={() => setUpdatingImage(true)}
              />
            </div>
            <h3 className="text-center">{userDetail.fullName}</h3>
            <p className="text-center">{userDetail.phoneNumber}</p>
            {updatingImage ? (
              <form onSubmit={handleProfileImageUpdate} className="text-center">
                <input
                  type="file"
                  onChange={handleImage}
                  className="form-control mb-2"
                />
                <button type="submit" className="btn btn-primary me-2 rounded-5">
                  <FaSave /> Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary rounded-5"
                  onClick={() => setUpdatingImage(false)}
                >
                  <FaTimes /> Cancel
                </button>
              </form>
            ) : null}
            {editingProfile ? (
              <form onSubmit={handleProfileUpdate} className="mt-3">
                <input
                  type="text"
                  name="fullName"
                  value={userDetails.fullName}
                  onChange={handleUserDetailsChange}
                  className="form-control mb-2"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={userDetails.phoneNumber}
                  onChange={handleUserDetailsChange}
                  className="form-control mb-2"
                  placeholder="Phone Number"
                />
                <input
                  type="text"
                  name="address"
                  value={userDetails.address}
                  onChange={handleUserDetailsChange}
                  className="form-control mb-2"
                  placeholder="Address"
                />
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary me-2 rounded-5">
                    <FaSave /> Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary rounded-5"
                    onClick={() => setEditingProfile(false)}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-success btn-outline-primary rounded-pill"
                  onClick={() => setEditingProfile(true)}
                >
                  <FaEdit /> Edit Details
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-2 flex-fill bd-highlight border-end border-2">
          <h2>Post</h2>
          {products.map((singleProduct) => (
            <div className="profile-post-card d-flex shadow p-3 mb-2 bg-light text-dark rounded" key={singleProduct._id}>
              <img
                src={`https://localhost:5000/products/${singleProduct.productImage}`}
                alt=""
                className="rounded-circle me-2"
              />
              {editingProduct === singleProduct._id ? (
                <form onSubmit={handleEditSubmit} className="ms-3 flex-grow-1">
                  <input
                    type="text"
                    name="postTitle"
                    value={editFormData.postTitle}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Post Title"
                  />
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Description"
                  ></textarea>
                  <input
                    type="text"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Category"
                  />
                  <input
                    type="text"
                    name="condition"
                    value={editFormData.condition}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Condition"
                  />
                  <input
                    type="text"
                    name="negotation"
                    value={editFormData.negotation}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Negotiation"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    name="delivery"
                    value={editFormData.delivery}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Delivery"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Location"
                  />
                  <input
                    type="file"
                    name="productImage"
                    onChange={handleEditImageChange}
                    className="form-control mb-2"
                  />
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary me-2">
                      <FaSave /> Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditingProduct(null)}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="d-flex ms-3 flex-column align-self-center profile-post-card-text flex-grow-1">
                    <p>{singleProduct.postTitle}</p>
                    <p className="text-color-primary fw-bold">
                      Rs {singleProduct.price}
                    </p>
                    <p>Condition: {singleProduct.condition}</p>
                  </div>
                  <div className="d-flex flex-column align-self-center ms-auto align-items-end">
                    <button
                      className="mb-2 btn w-100 btn-success rounded-5 btn-responsive"
                      onClick={() => handleEdit(singleProduct)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(singleProduct._id)}
                      className="btn btn-danger rounded-5 btn-responsive"
                    >
                      <FaTimes /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="p-2 flex-fill bd-highlight">
          <h2>Similar Products</h2>
          <div className="mb-3 border-bottom border-2"></div>
          {similarProducts.map((singleProduct) => (
            <Link
              to={`/post_detail/${singleProduct._id}`}
              key={singleProduct._id}
              className="profile-post-card d-flex shadow p-2 mb-2 bg-light text-dark rounded"
            >
              <img
                src={`https://localhost:5000/products/${singleProduct.productImage}`}
                alt=""
                className="rounded-circle me-2"
              />
              <div className="d-flex ms-3 flex-column align-self-center profile-post-card-text">
                <p>{singleProduct.postTitle}</p>
                <p className="text-color-primary fw-bold">
                  Rs {singleProduct.price}
                </p>
                <p>{singleProduct.description}</p>
              </div>
              <p className="ms-auto">Used</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
