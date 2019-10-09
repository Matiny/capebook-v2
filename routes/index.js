const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const flash = require("connect-flash");
const ensureLogin = require("connect-ensure-login");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/avatar");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
})

const oneMB = 1024 * 1024;

// Backend image validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// Tells multer what to use
const upload = multer({
  storage,
  limits: {
    fileSize: oneMB * 5
  },
  fileFilter
});

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signin', (req, res, next) => {
  let img = { icon: "img/cb-icon.svg" }
  res.render('auth/signin', { "message": req.flash("error"), img });
});

router.get('/signup', (req, res, next) => {
  let img = { icon: "img/cb-icon.svg" }
  res.render('auth/signup', { img });
});

router.post("/signin", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/signin",
  badRequestMessage: "Please enter both Name and Password",
  failureFlash: true,
  passReqToCallback: true
}));

router.post('/signup', upload.single("avatar"), (req, res, next) => {

  const { username, password, password2, } = req.body;

  if (password !== password2) {
    res.render("auth/signup", { message: "Passwords didn't match" });
    return;
  }

  if (password.length < 4 || password.length > 30) {
    res.render("auth/signup", { message: "Password must be 4 to 30 characters in length" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        avatar: req.file.path
      });

      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error)
    })

  console.log(req.body);

});

//By default it goes to /login, here it goes to /signin
router.get("/dashboard", (req, res) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to view Dashboard')
    res.redirect('/signin')
  }
  res.render("dashboard", { user: req.user });

});

router.get("/signout", (req, res) => {
  req.flash('error', 'You are now logged out!')
  req.logout();
  res.redirect("/signin");
});

module.exports = router;
