import React, { useEffect, useState } from "react";
import moment from "moment";
import "./PostDetailPage.css";
import { createComment, getCommentsApi, getProductById, getSimilarProducts, getUserDetails, replyComment, rateProduct } from "../../apis/Api";
import { Link, useParams } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import Rating from 'react-rating'; // Import react-rating
import 'font-awesome/css/font-awesome.min.css'; // Import font-awesome for star icons

const PostDetailPage = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  const userName = user.fullName;
  const userProfile = user.profileImage;

  const [similarProducts, setSimilarProducts] = useState([]);
  const [userDetail, setUserDetail] = useState({});

  // Product details state
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCondition, setProductCondition] = useState('');
  const [productDelivery, setProductDelivery] = useState('');
  const [productNegotation, setProductNegotation] = useState('');
  const [productCreatedAt, setProductCreatedAt] = useState('');
  const [productCreatedBy, setProductCreatedBy] = useState('');
  const [productLocation, setProductLocation] = useState('');
  const [productImage, setProductImage] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  // Comments
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyVisible, setReplyVisible] = useState({});
  const [repliesVisible, setRepliesVisible] = useState({}); // Track which comments have their replies shown
  const [newReplyText, setNewReplyText] = useState({});
  const [newCommentRating, setNewCommentRating] = useState(0); // New state for comment rating

  const getSingleProduct = async () => {
    try {
      const res = await getProductById(id);
      const productData = res.data.product;
      setProductName(productData.postTitle);
      setProductPrice(productData.price);
      setProductCategory(productData.category);
      setProductDescription(productData.description);
      setProductCondition(productData.condition);
      setProductDelivery(productData.delivery);
      setProductNegotation(productData.negotation);
      setProductCreatedAt(productData.createdAt);
      setProductCreatedBy(productData.createdBy);
      setProductLocation(productData.location);
      setProductImage(productData.productImage);
      setAverageRating(productData.averageRating || 0); // Update average rating
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (createdBy) => {
    try {
      const res = await getUserDetails(createdBy);
      setUserDetail(res.data.userDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarPost = async () => {
    const res = await getProductById(id);
    const productData = res.data.product;
    try {
      const res = await getSimilarProducts(productData.category);
      setSimilarProducts(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getCommentsApi(id);
      setComments(res.data.comment);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newCommentText.trim() === '') return;
    try {
      await createComment({ author: userId, authorName: userName, content: newCommentText, postId: id, rating: newCommentRating , userImage: userProfile});
      setNewCommentText('');
      setNewCommentRating(0); // Reset rating
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReplySubmit = async (parentId) => {
    const replyContent = newReplyText[parentId];
    if (!replyContent || replyContent.trim() === '') return;
  
    try {
      await replyComment({
        author: userId,
        authorName: userName,
        content: replyContent,
        postId: id,
        userImage : userProfile,
      }, parentId);  // passing parentId as id parameter
      setNewReplyText((prev) => ({ ...prev, [parentId]: '' }));
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRatingSubmit = async (rating) => {
    try {
      await rateProduct(id, { rating });
      await getSingleProduct(); // Refresh product details to update the rating
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getSingleProduct();
      await getSimilarPost();
      await fetchComments();
    };
    fetchData();
  }, [id]);

  const toggleReplyBox = (commentId) => {
    setReplyVisible((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const toggleReplies = (commentId) => {
    setRepliesVisible((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  useEffect(() => {
    if (productCreatedBy) {
      getUser(productCreatedBy);
    }
  }, [productCreatedBy]);

  const renderComments = (comments, isReply = false) => {
    if (!comments || comments.length === 0) {
        return null;
    }
  
    // Reverse the comments array to display the most recent ones first
    const orderedComments = [...comments].reverse();
  
    return orderedComments.map((comment) => {
      if (isReply || (!comment.parentId || comment.parentId === null)) {
        return (
          <div key={comment._id} className={`mt-3 post-detail-comment-container ${isReply ? 'reply' : ''}`}>
            <div className="comment">
              <img src={`http://localhost:5000/profiles/${comment.userImage}`} className="comment-avatar" alt="Profile" />
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-username">{comment.authorName}</span>
                  <span className="comment-time">{moment(comment.createdAt).fromNow()}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
                <Rating
                  className="text-warning comment-rating"
                  initialRating={comment.rating}
                  readonly
                  emptySymbol="fa fa-star-o fa-2x"
                  fullSymbol="fa fa-star fa-2x"
                  fractions={2}
                />
                <div className="comment-actions">
                  <span className="comment-like">👍 0</span>
                  <span className="comment-reply" onClick={() => toggleReplyBox(comment._id)}>Reply</span>
                  {comment.replies && comment.replies.length > 0 && !isReply && (
                    <span className="comment-toggle-replies" onClick={() => toggleReplies(comment._id)}>
                      {repliesVisible[comment._id] ? 'Hide replies' : `Show ${comment.replies.length} replies`}
                    </span>
                  )}
                </div>
                {replyVisible[comment._id] && (
                  <div className="comment-reply-box">
                    <textarea
                      className="comment-reply-input"
                      rows="2"
                      placeholder="Write a reply..."
                      value={newReplyText[comment._id] || ''}
                      onChange={(e) => setNewReplyText((prev) => ({ ...prev, [comment._id]: e.target.value }))}
                    ></textarea>
                    <button className="comment-reply-button" onClick={() => handleReplySubmit(comment._id)}>Reply</button>
                  </div>
                )}
                {repliesVisible[comment._id] && (
                  <div className="comment-replies">
                    {renderComments(comments.filter(c => comment.replies.includes(c._id)), true)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div className="post-detail-container text-dark">
      <div className="row">
        <div className="col-lg-8">
          <div className="row">
            <div className="col-md-6 bd-highlight border-end border-2">
              <img src={`http://localhost:5000/products/${productImage}`} alt="Product" className="product-image" />
              <div className="product-info ms-3">
                <p>Rs <strong>{productPrice}</strong></p>
                <p>{productCreatedAt}</p>
              </div>
              <div className="contact-info mb-4">
                <div className="d-flex align-items-center mb-3 ms-3">
                  <img src={`http://localhost:5000/profiles/${userDetail.profileImage}`} alt="Seller Image" className="rounded-circle me-2" style={{ width: 50, height: 50 }} />
                  <div>
                    <p className="mb-0 ms-3">{userDetail.fullName}</p>
                    <p className="mb-0 ms-3">{userDetail.phoneNumber}</p>
                  </div>
                </div>
                <button className="btn btn-primary w-100">Message</button>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <h2>{productName}</h2>
              <p>{productDescription}</p>
              <div className="post-info">
                <p><strong>Post Info</strong></p>
                <p>Category: {productCategory}</p>
                <p>Condition: {productCondition}</p>
                <p>Product Negotation: {productNegotation}</p>
                <p>Location: {productLocation}</p>
                <p>Delivery: {productDelivery}</p>
                <p>Post CreatedAt: {productCreatedAt}</p>
              </div>
              <div className="rating-section">
                <span className="fs-5">Average Rating:</span>
                  <span className="text-warning ms-2 fs-4 fw-bold">{averageRating.toFixed(1)}</span>
                <h3 className="fs-6 mt-3">Rate this Product</h3>
                <div className="rating-section mt-2">
                    <Rating
                    className="text-warning"
                      initialRating={newCommentRating}
                      emptySymbol="fa fa-star-o fa-2x"
                      fullSymbol="fa fa-star fa-2x"
                      fractions={2}
                      onChange={(value) => setNewCommentRating(value)}
                    />
                  </div>
              </div>
              <div className="comments">
                <p className="text-dark"><strong>Comments</strong></p>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  ></textarea>
                  <button className="btn btn-primary mt-2" onClick={handleCommentSubmit}>Submit</button>
                </div>
                <div className="comment-list">
                  {renderComments(comments)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 bd-highlight border-start border-2">
          <h4 className="text-center">Similar Products</h4>
          <div className="similar-products-details d-flex flex-column justify-content-center align-items-center">
            {similarProducts.map((singleProduct) => (
                <Link to={`/post_detail/${singleProduct._id}`} key={singleProduct._id} className="mb-3 shadow p-2 mb-2 bg-light text-dark rounded-4 similar-product ms-3">
                <img src={`http://localhost:5000/products/${singleProduct.productImage}`} alt="image" className="img-fluid" />
                <p className="ms-3">{singleProduct.postTitle}</p>
                <p className="ms-3">Rs.{singleProduct.price}</p>
                <p className="me-3 text-end">{singleProduct.condition}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;