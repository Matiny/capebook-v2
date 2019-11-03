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
      res.render("story/storylist", { stories: user.media })
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

      let format = {
        movie : editArr.format === "Movie" ? "selected" : "",
        game : editArr.format === "Video Game" ? "selected" : "",
        comic : editArr.format === "Comic" ? "selected" : "",
        tv : editArr.format === "TV Show" ? "selected" : "",
        book : editArr.format === "Book" ? "selected" : "",
      }

      res.render("story/editstory", { oneStory: editArr, format });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
});

router.post('/stories', (req, res, next) => {
  let { title, year, format, actor, plot } = req.body;

  if (!title) {
    res.render("story/storylist", { message: "Please Enter a Title" });
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

router.post('/stories/:storyID', (req, res, next)=>{
  let theID = req.params.storyID;
  let { title, year, format, actor, plot } = req.body;
  if (!title) {
    res.render("story/story", { message: "Please Enter a Title" });
    return;
  } else {
    User.findOne({username: req.user.username})
    .then((user) => {
      let newArr = user.media.filter(story => `${story._id}` !== `${theID}`);
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

router.post('/deletestory/:storyID', (req, res, next)=>{
  let theID = req.params.storyID;

  User.findOne({username: req.user.username})
  .then((user) => {
    let newArr = user.media.filter(story => `${story._id}` !== `${theID}`);
    user.media = newArr;
    console.log(newArr);
    user.save();
    res.redirect("/stories");
  })
  .catch((err) => {
    console.log(err);
    next(err);
  })
})

module.exports = router;