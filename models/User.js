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
  skills: { 
    gen: {
      type: String,
    },
    str: {
      type: String,
    },
    spe: {
      type: String,
    },
    sen: {
      type: String,
    },
    hea: {
      type: String,
    },
    fly: {
      type: String,
    },
    tou: {
      type: String,
    },
    psy: {
      type: String,
    },
    mag: {
      type: String,
    },
    ele: {
      type: String,
    },
   },
  realname: { type: String },
  location: { type: String },
  morality: { type: String },
  origin: { type: String },
  bio: { type: String },
  media: [storySchema],
});

let User = mongoose.model("User", userSchema);

module.exports = User;