const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type: [{type: Schema.Types.ObjectId, ref: 'Post'}]
  }
})

let Post = mongoose.model("Post", postSchema);

module.exports = Post;