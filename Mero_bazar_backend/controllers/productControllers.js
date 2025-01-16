const path = require("path");
const productModel = require('../models/productModels');
const fs = require("fs");

const createProduct = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    const {postTitle, description, category, condition, negotation, price, delivery, location, createdBy} = req.body;

    if(!postTitle || !description || !category || !condition || !negotation || !price || !delivery || !location || !createdBy){
        return res.status(400).json({
            "success": false,
            "message": "Please enter all fields"
        });
    }

    //checking product image
    if(!req.files || !req.files.productImage){
        return res.status(400).json({
            success: false,
            message : "Image Not Found!"
        });
    }

    const { productImage } = req.files;

    const imageName = `${Date.now()}-${productImage.name}`;

    const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
    );

    try{

        await productImage.mv(imageUploadPath);

        const newProduct = new productModel({
            postTitle : postTitle,
            createdBy : createdBy,
            description : description,
            category : category,
            condition : condition,
            negotation : negotation,
            price : price,
            delivery : delivery,
            location : location,
            productImage : imageName,
        });

        const product = await newProduct.save()
        
        res.status(201).json({
            "success" : true,
            "message" : "Product Added Successfully!!",
            data: product,
        });

    }
    catch(e){
        console.log(e)
        res.json({
            "success": false,
            "message": "Internal server error!!",
            error: e,
        });
    }
};


const getAllProducts = async (req, res) => {
    try{
        const products = await productModel.find({});

        res.status(201).json({
            success: true,
            message : "Product fetched successfully!!",
            products: products,
        });
    } catch(e){
        console.log(e)
        res.json({
            "success": false,
            "message": "Internal server error!!",
            error: e,
        });
    }
}

//Single Product
const getProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        
        const product = await productModel.findById(productId);

        res.status(201).json({
            success: true,
            message: "Product Fetched!",
            product: product,
        });

    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: "Server Error!",
        });
      }
    };

    const getAllProductsByUserId = async (req, res) =>{
      const userId =  req.params.id;

      try{
        const product = await productModel.find({createdBy: userId}).exec();
        if(!product){
          console.log(product);
        }
        res.status(201).json({
          success: true,
          message: "Product Fetched!",
          product: product,
      });

      } catch(e){
        console.log(e);
        res.json({
          success: false,
          message: "Server Error!",
        });
      }
    }
    const getSimilarProducts = async (req, res) =>{
      const category =  req.params.category;
      const userId = req.params.userId;
      try{
        const product = await productModel.find({ category: category, createdBy: { $ne: userId } }).exec();
        // const product = await productModel.find({category: category}).exec();
        if(!product){
          console.log(product);
        }
        res.status(201).json({
          success: true,
          message: "Product Fetched!",
          product: product,
      });

      } catch(e){
        console.log(e);
        res.json({
          success: false,
          message: "Server Error!",
        });
      }
    }
    const getSimilarProductsProfile = async (req, res) =>{
      const userId =  req.params.id;

      try{
        const latestPost = await productModel.findOne({createdBy:userId}).sort({ createdAt: -1 }).limit(1).exec();
        if (!latestPost) {
          console.log('No posts found for the user', userId);
          return res.status(404).json({ success: false, message: 'No posts found for the user' });
        }
        const products = await productModel.find({ category: latestPost.category, createdBy: { $ne: userId } }).exec();
        res.status(200).json({
          success: true,
          message: "Similar Product Fetched!",
          products: products,
      });

      } catch(e){
        console.log(e);
        res.json({
          success: false,
          message: "Server Error!",
        });
      }
    }

    const deleteProduct = async (req, res) => {
        //get product id
        const productId = req.params.id;
      
        try {
          //deleting image
          const existingProduct = await productModel.findById(req.params.id);
      
            //search that image in directory
            
              const oldImagePath = path.join(
                  __dirname,
                  `../public/products/${existingProduct.productImage}`
                );
                //delete from file system
                fs.unlinkSync(oldImagePath)
                
          await productModel.findByIdAndDelete(productId);
      
          //fetch products
      
          res.status(201).json({
            success: true,
            message: "Product Deleted!!",
            //updatedProductList
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
      };

      
      const updateProduct = async (req, res) => {
        try {
          const updateFields = {
            postTitle: req.body.postTitle,
            description: req.body.description,
            category: req.body.category,
            condition: req.body.condition,
            negotation: req.body.negotation,
            price: req.body.price,
            delivery: req.body.delivery,
            location: req.body.location
          };
      
          if (req.files && req.files.productImage) {
            // Destructure file
            const { productImage } = req.files;
            const imageName = `${Date.now()}-${productImage.name}`;
            const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`);
            
            // Move to folder
            await productImage.mv(imageUploadPath);
            updateFields.productImage = imageName;
      
            const existingProduct = await productModel.findById(req.params.id);
            if (existingProduct.productImage) {
              const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`);
              fs.unlinkSync(oldImagePath);
            }
          }
      
          const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, updateFields, { new: true });
      
          if (!updatedProduct) {
            return res.status(404).json({
              success: false,
              message: "Product not found!"
            });
          }
      
          res.status(200).json({
            success: true,
            message: "Product Updated Successfully!!",
            updatedProduct: updatedProduct
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error,
          });
        }
      };
      

      
     //Pagination
// const productPagination = async (req, res) =>{

//   //Result per page
//   const resultPerPage = 4;

//   //page no (received from user)
//   const pageNo = req.query._page;

//   console.log(pageNo)
//   try{ 
//     const totalProducts = await productModel.countDocuments({});
//     const products =  await productModel.find({})
//     .skip((pageNo-1) * resultPerPage)
//     .limit(resultPerPage)

//     //if there is no product
//     if(products.length === 0){
//       return res.status(400).json({
//         'success': false,
//         'message': "No Product Found!"
//       })
//     }
//     res.status(201).json({
//       'success': true,
//       'message': "Product Fetched!",
//       'products': products,
//       totalProducts: totalProducts,
//     })

//   }catch(e){
//     console.log(e)
//     res.status(500).json({
//       'success': true,
//       'message': "Server Error"
//     })
//   }
// } 
const productPagination = async (req, res) => {
  const resultPerPage = 4;
  const pageNo = parseInt(req.query._page) || 1;
  const category = req.query.category || ''; // Get category from query parameters
  console.log(category)

  try {
      // Construct the query object
      let query = {};
      if (category) {
          query.category = category;
      }

      // Get the total number of products matching the query
      const totalProducts = await productModel.countDocuments(query);

      // Fetch products matching the query with pagination
      const products = await productModel.find(query)
          .skip((pageNo - 1) * resultPerPage)
          .limit(resultPerPage);

      if (products.length === 0) {
          return res.status(400).json({
              success: false,
              message: "No Product Found!",
              hasMore: false,
              totalProducts,
              resultPerPage
          });
      }

      res.status(201).json({
          success: true,
          message: "Products Fetched",
          products,
          hasMore: products.length === resultPerPage,
          totalProducts,
          resultPerPage
      });

  } catch (error) {
      console.log(error);
      res.status(500).json({
          success: false,
          message: "Server Error!",
          totalProducts,
          resultPerPage
      });
  }
};

//Search Query
// Backend search function (Node.js/Express example)
const searchProducts = async (req, res) => {
  const { search, page, limit, sort } = req.query;
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10; // Default page size
  const sortBy = sort || "createdAt"; // Default sort field (use your preferred default)

  try {
    let query = {};
    
    // Construct the search query
    if (search) {
      query.postTitle = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Sorting
    const sortOptions = {};
    if (sortBy) {
      const [field, order] = sortBy.split(","); // e.g., "createdAt,desc"
      sortOptions[field] = order || "asc"; // Default to ascending order if not specified
    }

    // Fetch products with pagination and sorting
    const products = await productModel.find(query)
      .sort(sortOptions)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Count total documents matching the query
    const totalProducts = await productModel.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      totalPages: Math.ceil(totalProducts / pageSize),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};



module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    getAllProductsByUserId,
    getSimilarProducts,
    getSimilarProductsProfile,
    productPagination,
    searchProducts,
}
