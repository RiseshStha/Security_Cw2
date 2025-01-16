const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema =  new Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    senderName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    senderImage: {
      type: String,
  },
  });
  
  // module.exports = mongoose.model('Comment', commentSchema);
  const message = mongoose.model('message', messageSchema);
  module.exports = message
  