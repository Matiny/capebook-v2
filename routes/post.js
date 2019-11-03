const User = require('../models/User');
const Post = require('../models/Post');

const express = require('express');
const router = express.Router();

router.get('/posts', (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to view Post Area')
    res.redirect('/signin')
  }
  Post.find()
    .then((allPosts) => {
      res.render("posts/addpost", { author: req.user._id, allPosts })
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
});

router.post('/posts', (req, res, next) => {
  let { message } = req.body;

  if (!message) {
    res.render("posts/addpost", { message: "Please Enter Text" });
    return;
  } else {
    Post.create({
      message: req.body.message,
      author: req.user._id,
    })
    .then(() => {
      console.log("Text is..." + message);
      res.redirect("/posts");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
  }
});


module.exports = router;