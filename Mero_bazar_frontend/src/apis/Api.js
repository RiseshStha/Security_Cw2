import axios from "axios";

const Api = axios.create({
    baseURL : "http://localhost:5000",
    withCredentials : true,
    headers : {
        "Content-Type" : "multipart/form-data"
    }
});


// const config = {
//     headers : {
//         'authorization': `Bearer ${localStorage.getItem("token")}`
//     }
// }
// console.log('tokkken', localStorage.getItem("token"))

Api.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('token', token)
      }
      return config;
    },
    error => Promise.reject(error)
  );

export const testApi = () => Api.get('/test')

export const registerUserApi = (data) => Api.post('/api/user/create', data)

export const loginUserApi = (data) => Api.post('/api/user/login', data);

export const createProductApi = (data) => Api.post('/api/product/create',data);

//fetching all products 
export const getAllProductsApi = () => Api.get('/api/product/get_all_products')

//fetching all product using pagination
export const paginationApi = (pageNo) => Api.get('/api/product/pagination', { params: { _page: pageNo } });

export const getAllProductsByUserId = (id) => Api.get(`/api/product/get_all_product_by_userid/${id}`)

//fetch similar products
export const getSimilarProductsApi = (id) => Api.get(`/api/product/get_similar_products_profile/${id}`)

//fetch similar product for postdetail page
export const getSimilarProducts = (category) => Api.get(`/api/product/get_similar_products/${category}`)

//getUserDeatails
export const getUserDetails = (id) => Api.get(`/api/user/get_user/${id}`)

//update user
export const updateUserDetails = (id, data) => Api.put(`/api/user/update_user/${id}`,data)

//update profile image
export const updateUserProfile = (id, file) => Api.put(`/api/user/update_user_image/${id}`,file)

//delete single product
export const deletePost = (productId) => Api.delete(`/api/product/delete_product/${productId}`)

//update product
export const updatePost = (productId, data) => Api.put(`/api/product/update_product/${productId}`, data)

//get single product by id
export const getProductById = (productId) => Api.get(`/api/product/get_product/${productId}`)

//forgot password api
export const forgotPasswordApi = (data) => Api.post('/api/user/forgot_password', data);
//verify otp
export const verifyOtp = (data) => Api.post('/api/user/verify_otp', data)

//create comment
export const createComment = (data) => Api.post('/api/comment/create_comment', data)

//reply comment
// export const replyComment = (data) => Api.post(`/api/comment/reply_comment/`,data)
//OR
export const replyComment = (data, id) => Api.post(`/api/comment/reply_comment/${id}`,data)

//get comments
export const getCommentsApi = (postId) => Api.get(`/api/comment/get_comments/${postId}`)

//get replies
export const getReplies = (ids) => Api.post(`/api/comment/get_replies/`, { ids})

//search api
export const searchApi = (params) => Api.get(`/api/product/search`,params)

//
export const getProducts = (pageNo = 1, category = '') => Api.get('/api/product/pagination', {
      params: {
          _page: pageNo,
          category
      }
  });

//rating
export const rateProduct = (postId, commentId, rating) => Api.get('/api/product/pagination', {postId, commentId, rating});

//message
export const send = (data) => Api.post('api/message/send', data);

export const getComment = (data) => Api.get('api/message/conversation', data)

// Admin API endpoints
// Admin API functions
export const getAllUsersApi = async () => {
  try {
      const response = await Api.get(`api/user/get-users`);
      return response;
  } catch (error) {
      throw error;
  }
};

export const toggleUserBlockApi = async (userId) => {
  try {
      const response = await Api.put(`api/user/toggle-block/${userId}`, {},);
      return response;
  } catch (error) {
      throw error;
  }
};

// Admin Authentication Check
export const checkAdminAuth = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  
  return {
    isAuthenticated: !!token,
    isAdmin: user.isAdmin === true,
  };
};