const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
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

let Media = mongoose.model("Media", mediaSchema);

module.exports = Media;