const User = require('../models/User');
const Post = require('../models/Post');

const express = require('express');
const router = express.Router();

router.get('/posts', (req, res, next) => {
  if (!req.user) { // Remove this later
    req.flash('error', 'Please sign in to view Post Area')
    res.redirect('/signin')
  }
  Post.find().populate('author')
    .then((allPosts) => {
      if (req.user) {
        allPosts.forEach((eachPost) => {
          if (eachPost.author._id.equals(req.user._id)) {
            eachPost.owned = true;
          }
        })
      }

      res.render("posts/postlist", { allPosts })
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
});

router.post('/posts', (req, res, next) => {
  let { message } = req.body;

  if (!message) {
    res.render("posts/postlist", { message: "Please Enter Text" });
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

router.post('/deletepost/:idOfPost', (req, res, next)=>{
  Post.findByIdAndRemove(req.params.idOfPost)
  .then(()=>{
      // req.flash('error', 'POST SUCCESSFULLY DELETED!')
      res.redirect('/posts')
  })
  .catch((err)=>{
      next(err)
  })

})


module.exports = router;