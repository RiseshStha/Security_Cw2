import React, { useState, useRef } from "react";
import {
  createProductApi,
  getAllProductsApi,
} from "../../apis/Api";
import { toast } from "react-toastify";
import '../postpage/Postpage.css';

const Postpage = () => {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  var userId = user ? user._id : null;

  const [postTitle, setPostTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [negotation, setNegotation] = useState("");
  const [delivery, setDelivery] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Ref for the modal element
  const modalRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setProductImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    const formData = new FormData();
    formData.append("postTitle", postTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("delivery", delivery);
    formData.append("location", location);
    formData.append("negotation", negotation);
    formData.append("condition", condition);
    formData.append("productImage", productImage);
    formData.append("createdBy", userId);

    createProductApi(formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          // Close the modal after a successful submission
          const modalElement = modalRef.current;
          const bootstrapModal = window.bootstrap.Modal.getInstance(modalElement);
          bootstrapModal.hide();
          // Optionally refresh product list or do any other post-submission tasks
          // getProducts();
        } else {
          toast.error("Something went wrong in frontend!");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 500) {
            toast.error("Internal server error!");
          } else {
            toast.error("No response!");
          }
        }
      });
  };

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={modalRef} // Attach the ref to the modal
      >
        <div className="modal-dialog">
          <div className="modal-content p-2 modal-bg rounded-3">
            <div className="modal-header bg-dark">
              <h5 className="modal-title text-light" id="exampleModalLabel">
                Post
              </h5>
              <button
                type="button"
                className="btn-close bg-light"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body rounded-3 shadow-sm">
              <div className="mb-1">
                <label htmlFor="exampleFormControlInput1" className="form-label">
                  Post Title
                </label>
                <input
                  onChange={(e) => setPostTitle(e.target.value)}
                  type="text"
                  className="form-control shadow"
                  id="exampleFormControlInput1"
                />
              </div>
              <div className="mb-1">
                <label htmlFor="exampleFormControlInput1" className="form-label">
                  Price
                </label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  className="form-control shadow"
                />
              </div>
              <div className="mb-1">
                <label htmlFor="exampleFormControlInput1" className="form-label">
                  Location
                </label>
                <input
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  className="form-control shadow"
                />
              </div>
              <div className="mb-1">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">
                  Description
                </label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control shadow"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>
              <div className="mt-1">
                <label>Select Category</label>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control shadow"
                >
                  <option value="vehicles">Vehicles</option>
                  <option value="mobiles">Mobiles</option>
                  <option value="realestate">Real Estate</option>
                  <option value="gadgets">Gadgets</option>
                  <option value="clothes">Clothes</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div className="mt-1">
                <label>Condition</label>
                <select
                  onChange={(e) => setCondition(e.target.value)}
                  className="form-control shadow"
                >
                  <option value="new">New</option>
                  <option value="old">Old</option>
                </select>
              </div>
              <div className="mt-1">
                <label>Delivery</label>
                <select
                  onChange={(e) => setDelivery(e.target.value)}
                  className="form-control shadow"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="mt-1">
                <label>Negotation</label>
                <select
                  onChange={(e) => setNegotation(e.target.value)}
                  className="form-control shadow"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="formFileDisabled" className="form-label">
                  Choose Photo
                </label>
                <input
                  onChange={handleImageUpload}
                  className="form-control shadow"
                  type="file"
                  id="formFileDisabled"
                />
                {previewImage && (
                  <div className="">
                    <img
                      src={previewImage}
                      alt="preview image"
                      className="img-fluid rounded object-fit-cover mt-3"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="custom-modal-footer">
            <button
                    type="button"
                    className="btn custom-btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Close
                </button>
              <button onClick={handleSubmit} type="button" className="btn custom-btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Postpage;
