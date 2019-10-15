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
  // media: {type: Schema.Types.ObjectId, ref: 'Media'}

});

let User = mongoose.model("User", userSchema);

module.exports = User;