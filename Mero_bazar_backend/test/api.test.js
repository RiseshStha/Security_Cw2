//for sending request
const request = require('supertest')

//server main file (index.js)
const app = require('../index')

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');


const userModel = require('../models/userModels');
const commentModel = require('../models/commentModels');
const productModel = require('../models/productModels');


//test collection

describe('Api Test Collection', () => { 

  //get all products
  it('GET /product | Fetch all products', async () =>{
    const response = await request(app).get('/api/product/get_all_products');
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Product fetched successfully!!')
  });


  //create a product
  const jestPr = jest.mock('../models/productModels');
  it('should create a new product and return a success message', async () => {
    const newProduct = {
      _id: 'someProductId',
      postTitle: 'Sample Product',
      createdBy: 'someUserId',
      description: 'Sample Description',
      category: 'Electronics',
      condition: 'New',
      negotation: 'Yes',
      price: 100,
      delivery: 'Yes',
      location: 'Sample Location',
      productImage: 'sampleImage.jpg',
    };

    // Mock the save method to simulate saving a new product
    productModel.prototype.save = jestPr.fn().mockResolvedValue(newProduct);

    // Mock the file upload functionality
    const file = {
      name: 'sampleImage.jpg',
      mv: jestPr.fn().mockResolvedValue(),
    };

    const response = await request(app)
      .post('/api/product/create_product')
      .field('postTitle', 'Sample Product')
      .field('description', 'Sample Description')
      .field('category', 'Electronics')
      .field('condition', 'New')
      .field('negotation', 'Yes')
      .field('price', 100)
      .field('delivery', 'Yes')
      .field('location', 'Sample Location')
      .field('createdBy', 'someUserId')
      .attach('productImage', Buffer.from('sampleImageContent'), 'sampleImage.jpg');

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual('Product Added Successfully!!');
    expect(response.body.data).toMatchObject(newProduct);
  });



//register api(post)
it('POST /api/user/create | Response with message', async () =>{
    const response = await request(app).post('/api/user/create').send({
        "fullName" : "Hy",
        "phoneNumber" : "1237123762093",
        "password" : "123"
    });

    //if already exists
    if(!response.body.success){
        expect(response.body.message).toEqual('User already exists!!!')
    }else{
        // expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('User Created Successfully!!')
    }
  });



  //login

  it('POST /api/user/login | response with message', async () => {
    const password = '123';
    const hashedPassword = await bcrypt.hash(password, 10); // Simulate the hashed password as stored in the database
    const user = {
      phoneNumber: '09876543415623',
      password: hashedPassword
    };
    // Mock the database call to return the user
    jest.spyOn(userModel, 'findOne').mockResolvedValue(user); // Ensure you mock the findUserByPhoneNumber function

    const response = await request(app)
      .post('/api/user/login')
      .send({
        phoneNumber: '09876543415623',
        password: '123'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });

  //Get user Details
  it('Get /api/user/get_user/:id | response with message', async () => {
    const userId = '6673d5dd9dc6735f3bab3a19';
    const response = await request(app).get(`/api/user/get_user/${userId}`)
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('User Data Fetched!')
  });


  //Search
  it('Get /api/product/search | response with message', async () => {
    const searchTerm = 'Iphone';
    const page =1;
    const sort = 'createdAt,asc';
    const response = await (request(app).get(`/api/product/search`)).query({ search: searchTerm, page, limit: 10, sort });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Products fetched successfully')
  });
  //Failed search
  it('Get /api/product/search | response with message', async () => {
    const searchTerm = 'Iphone';
    const page =1;
    const sort = 'createdAt,asc';
    const response = await (request(app).get(`/api/product/search`)).query({ search: searchTerm, page, limit: 10, sort });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Products fetched successfully')
  });

  //Comments 
  it('Get /api/comment/get_comments/:id| response with message', async () => {
    const commentId = '6694cba89a7e8b2a4c7e4737';
    const response = await request(app).get(`/api/comment/get_comments/${commentId}`)
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Comment Fetched Successfully!')
  });

  jest.mock('../models/commentModels');
  it('POST /api/comment/create_comment | response with message', async () => {
    const newComment = {
      _id: 'someCommentId',
      author: '6694cba89a7e8b2a4c7e4737',
      authorName: 'Risesh Shrestha',
      content: 'Hello my name is Risesh!',
      postId: '187t49184t87349thjsdf',
    };
  
    // Mock the save method to simulate saving a new comment
    commentModel.prototype.save = jest.fn().mockResolvedValue(newComment);
  
    const response = await request(app)
      .post('/api/comment/create_comment')
      .send({
        author: '6694cba89a7e8b2a4c7e4737',
        authorName: 'Risesh Shrestha',
        content: 'Hello my name is Risesh!',
        postId: '187t49184t87349thjsdf',
      });
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Comment created Successfully!!');
  });
  //Reply comment
  it('POST /api/comment/reply_comment/:id | response with message', async () => {
    const parentId = '66a5e7cec89ad3af3c5941ac';
    const parentComment = {
      _id: new mongoose.Types.ObjectId(parentId),
      author: 'author_id',
      authorName: 'Parent Author',
      content: 'Parent Comment',
      postId: 'post_id',
      replies: [],
      save: jest.fn().mockResolvedValue(this), // Mock save method
    };
    const newReply = {
      _id: new mongoose.Types.ObjectId(),
      author: '6694cba89a7e8b2a4c7e4737',
      authorName: 'Risesh Shrestha',
      content: 'Reply Comment testing',
      postId: '187t49184t87349thjsdf',
      replies: [],
      save: jest.fn().mockResolvedValue(this), // Mock save method
    };
  
    // Mock the database call to return the parent comment
    commentModel.findById = jest.fn().mockResolvedValue(parentComment);
    // Mock the save method to simulate saving a new reply
    commentModel.prototype.save = jest.fn().mockResolvedValue(newReply);
  
    const response = await request(app)
      .post(`/api/comment/reply_comment/${parentId}`)
      .send({
        author: '6694cba89a7e8b2a4c7e4737',
        authorName: 'Risesh Shrestha',
        content: 'Reply Comment testing',
        postId: '187t49184t87349thjsdf',
      });
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual('Reply created successfully!');
  });
});