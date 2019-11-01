const User = require('../models/User');

const express = require('express');
const router = express.Router();

router.get('/stories', (req, res, next) => {
  User.find()
    .then((user) => {
      res.render("content/story", { user })
      // console.log(user);
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
      user.media.push({ title, year, format, actor, plot });
      user.save();
      res.redirect("/stories");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
  }
});


module.exports = router;