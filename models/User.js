const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  year: {
    type: String
  },
  format: {
    type: String
  },
  actor: {
    type: String
  },
  plot: {
    type: String
  },
})

const userSchema = new Schema({
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
  skills: [],
  realname: { type: String },
  hq: { type: String },
  morality: { type: String },
  origin: { type: String },
  bio: { type: String },
  media: [storySchema],
});

let User = mongoose.model("User", userSchema);

module.exports = User;