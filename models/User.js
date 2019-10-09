const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  realname: { type: String },
  skills: { type: String },
  morality: { type: String },
  location: { type: String },
  origin: { type: String },
  // media: {type: Schema.Types.ObjectId, ref: 'Media'}

});

let User = mongoose.model("User", userSchema);

module.exports = User;