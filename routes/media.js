const User = require('../models/User');

const express = require('express');
const router = express.Router();

router.get('/stories', (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to view Story List')
    res.redirect('/signin')
  }
  User.findOne({username: req.user.username})
    .then((user) => {
      res.render("content/storylist", { stories: user.media })
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
});

router.get('/stories/:storyID', (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to edit a Story')
    res.redirect('/signin')
  }
  let theID = req.params.storyID;
  User.findOne({username: req.user.username})
    .then((user) => {
      let editArr = user.media.find(story => `${story._id}` === `${theID}`);
      res.render("content/editstory", { oneStory: editArr });

    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
});

router.post('/stories', (req, res, next) => {
  let { title, year, format, actor, plot } = req.body;

  if (!title) {
    res.render("content/story", { message: "Please Enter a Title" });
    return;
  } else {
    User.findOne({username: req.user.username})
    .then((user) => {
      user.media.unshift({ title, year, format, actor, plot });
      user.save();
      res.redirect("/stories");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
  }
});

router.put('/stories/:storyID', (req, res, next)=>{
  let theID = req.params.storyID;

  if (!title) {
    res.render("content/story", { message: "Please Enter a Title" });
    return;
  } else {
    User.findOne({username: req.user.username})
    .then((user) => {
      let newArr = user.media.filter(story => story._id !== theID);
      user.media = newArr;
      user.media.unshift({ title, year, format, actor, plot });
      user.save();
      res.redirect("/stories");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
  }
})


module.exports = router;