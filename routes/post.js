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
          eachPost.loggedIn = true;
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
      edited: false,
      reply: false
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

router.get('/posts/:postID', (req, res, next) => {
  Post.findById(req.params.postID)
    .then((thePost) => {
      console.log(thePost);

      res.render('posts/editpost', { thePost })
    })
    .catch((err) => {
      next(err);
    })
})


router.post("/posts/:postID", (req, res) => {

  let { message } = req.body;

  Post.findByIdAndUpdate(req.params.postID, { message, edited: true })
    .then(() => {
      res.redirect('/posts')
    })
    .catch((err) => {
      next(err);
    })

});


router.post('/deletepost/:idOfPost', (req, res, next) => {
  Post.findByIdAndRemove(req.params.idOfPost)
    .then(() => {
      // req.flash('error', 'POST SUCCESSFULLY DELETED!')
      res.redirect('/posts')
    })
    .catch((err) => {
      next(err)
    })

})

router.get('/posts/:postID/reply', (req, res, next) => {
  Post.findById(req.params.postID)
    .then((thePost) => {
      console.log(thePost);
      if (req.user) {
        thePost.replies.forEach((eachPost) => {
          eachPost.parentID = thePost._id
          eachPost.loggedIn = true;
          if (eachPost.author._id.equals(req.user._id)) {
            eachPost.owned = true;
          }
        })
      }
      res.render('posts/reply', { thePost, allReplies: thePost.replies })
    })
    .catch((err) => {
      next(err);
    })
})

router.post('/posts/:postID/reply', (req, res, next) => {
  let { message } = req.body;

  if (!message) {
    res.render("posts/:postID/reply", { message: "Please Enter Text" });
    return;
  } else {
    Post.findById(req.params.postID)
      .then((thePost) => {
        thePost.replies.unshift({
          message: req.body.message,
          author: req.user._id,
          edited: false,
        })
        thePost.save();
        res.redirect("/posts");
      })
      .catch((err) => {
        console.log(err);
        next(err);
      })
  }
});

router.post('/deletereply/:postID/:replyID', (req, res, next) => {
  let postID = req.params.postID;
  let replyID = req.params.replyID;

  Post.findById(postID)
    .then((chosenPost) => {
      let newArr = chosenPost.replies.filter(reply => `${reply._id}` !== `${replyID}`);
      chosenPost.replies = newArr;
      chosenPost.save();
      res.redirect('/posts')
    })
    .catch((err) => {
      next(err)
    })

})



module.exports = router;