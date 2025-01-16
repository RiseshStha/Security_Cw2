const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: String, required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  postId : {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, //remove if throws error
  userImage: {
    type: String,
},
});

// module.exports = mongoose.model('Comment', commentSchema);
const comment = mongoose.model('Comment', commentSchema);
module.exports = comment
