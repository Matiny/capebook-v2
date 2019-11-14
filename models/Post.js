const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
  message: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  likes: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  edited: Boolean,
})

const postSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  likes: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  replies: {
    type: [replySchema]
  },
  edited: Boolean,
})

let Post = mongoose.model("Post", postSchema);

module.exports = Post;