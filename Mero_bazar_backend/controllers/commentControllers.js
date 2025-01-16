const commentModels = require("../models/commentModels");
const mongoose = require('mongoose')
const productModel = require('../models/productModels');
// Create a new comment
// const createComment = async (req, res) =>{

//     const {author, content, replies, createdAt, postId, authorName, rating} = req.body;

//     if(!author || !content || !postId || !authorName){
//         return res.status(400).json({
//             'success': false,
//             'message': "Please Write a comment!!"
//         });
//     }

//     try{

//         const newComment = new commentModels({
//             author : author,
//             authorName : authorName,
//             content : content,
//             createdAt : createdAt,
//             postId : postId,
//             replies : [],
//             rating : rating,
//         });

//         const comment = await newComment.save();

//         const product = await productModel.findById(postId);

//         // Update the average rating and number of reviews
//         product.numberOfReviews += 1;
//         product.averageRating = ((product.averageRating * (product.numberOfReviews - 1)) + rating) / product.numberOfReviews;

//         await product.save();

//         res.status(201).json({
//             "success" : true,
//             "message": "Comment created Successfully!!",
//             comment: comment,
//         });


//     } catch(e){
//         res.json({
//             'success': false,
//             'message': "Internal Server Error!!"
//         })
//     }

// }

const rating = async (req, res) => {
  const { rating, postId, commentId } = req.body;

  try {
    const product = await productModel.findById(postId);
    const comment = await commentModels.findById(commentId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    comment.rating = rating;
    product.totalRating += rating;
    product.ratings += 1;

    await comment.save();
    await product.save();

    res.status(200).json({ success: true, message: 'Rating submitted', product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


const createComment = async (req, res) =>{

    const {author, content, replies, createdAt, postId, authorName, rating, userImage} = req.body;

    if(!author || !content || !postId || !authorName){
        return res.status(400).json({
            'success': false,
            'message': "Please Write a comment!!"
        });
    }

    try{

        const newComment = new commentModels({
            author : author,
            authorName : authorName,
            content : content,
            createdAt : createdAt,
            postId : postId,
            replies : [],
            rating : rating,
            userImage : userImage
        });

        const comment = await newComment.save();

        const product = await productModel.findById(postId);

        // Update the average rating and number of reviews
        product.numberOfReviews += 1;
        product.averageRating = ((product.averageRating * (product.numberOfReviews - 1)) + rating) / product.numberOfReviews;

        await product.save();

        res.status(201).json({
            "success" : true,
            "message": "Comment created Successfully!!",
            comment: comment,
        });


    } catch(e){
        res.json({
            'success': false,
            'message': "Internal Server Error!!"
        })
    }

}


//Reply on existing comment
const createReply = async (req, res) => {
  const { author, authorName, content, postId, userImage } = req.body;
  const { id: parentId } = req.params; // Extracting parentId from params

  console.log('Author:', author);
  console.log('Author Name:', authorName);
  console.log('Content:', content);
  console.log('Post ID:', postId);
  console.log('Parent ID:', parentId);
  console.log('Image:', userImage);

  if (!author || !authorName || !content || !postId || !parentId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields!",
    });
  }

  try {
    const parentComment = await commentModels.findById(parentId);

    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: "Parent comment not found!",
      });
    }

    const newReply = new commentModels({
      author: author,
      authorName: authorName,
      content: content,
      postId: postId,
      replies: [],
      parentId: parentId,
      userImage : userImage
    });

    const reply = await newReply.save();

    parentComment.replies.push(reply._id);
    await parentComment.save();

    res.status(201).json({
      success: true,
      message: "Reply created successfully!",
      reply: reply,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};


  const getAllComments = async(req, res) =>{

    const postId = req.params.id;

    console.log('Post Id : ',postId)

    if(!postId){
        return res.status(400).json({
            'success' : false,
            'message' : 'Please provide postId'
        });
    }

    try{

        const comment = await commentModels.find({postId : postId}).exec();

        if(!comment){
            console.log(comment)
        }

        res.status(201).json({
            'success' : true,
            'message' : "Comment Fetched Successfully!",
            comment : comment,
        })

    }catch(e){
        res.json({
            'success' : false,
            'message' : 'Internal Server Error'
        });
    }

  }
  

  // Function to get replies by comment IDs
const getRepliesByIds = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid list of comment IDs',
    });
  }

  try {
    // Fetch replies based on IDs
    const replies = await commentModels.find({
      _id: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) },
    }).exec();

    res.status(201).json({
      success: true,
      message: 'Replies fetched successfully!',
      data: replies,
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


const getProductReviews = async (req, res) => {
  const productId = req.params.id;

  try {
      const reviews = await commentModels.find({ productId: productId }).populate('userId', 'fullName');

      res.status(200).json({
          success: true,
          message: "Reviews fetched successfully",
          reviews
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          success: false,
          message: "Internal server error",
          error
      });
  }
};

module.exports = {
    createComment,
    createReply,
    getAllComments,
    getRepliesByIds,
    rating,
}