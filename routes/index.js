const User = require('../models/User');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require("connect-flash");
const multer = require('multer');
const ensureLogin = require("connect-ensure-login");

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

/*------------ AUTH Routes ------------ */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signin', (req, res, next) => {
  let img = { icon: "img/cb-icon.svg" }
  res.render('auth/signin', { "message": req.flash("error"), img });
});

router.get('/signup', (req, res, next) => {
  let img = { icon: "img/cb-icon.svg" }
  res.render('auth/signup', { "message": req.flash("error"), img });
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

  // console.log(req.file);
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Please enter both Name and Password" });
    return;
  }

  if (password !== password2) {
    res.render("auth/signup", { message: "Passwords didn't match" });
    return;
  }

  if (password.length < 4 || password.length > 30) {
    res.render("auth/signup", { message: "Password must be 4 to 30 characters in length" });
    return;
  }

  else {
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
          avatar: req.file.filename,
          realname: "",
          skills: "",
          morality: "",
          location: "",
          origin: ""
        });

        newUser.save((err) => {
          if (err) {
            res.render("auth/signup", { message: "Please try again!" });
            console.log(err);
          } else {
            res.redirect("/signin");
          }
        });
      })
      .catch(error => {
        next(error)
      })
  }

  console.log(req.body);

});


/*------------ USER Routes ------------ */

let imgpath = "img/avatar/";

//By default it goes to /login, here it goes to /signin
router.get("/dashboard", (req, res) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to view Dashboard')
    res.redirect('/signin')
  }
  res.render("user/dashboard", { user: req.user, imgpath });

});

router.get("/signout", (req, res) => {
  req.flash('error', 'You are now logged out!')
  req.logout();
  res.redirect("/signin");
});

router.get("/update-user", (req, res) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to update profile')
    res.redirect('/signin')
  }
  let skills = req.user.skills.split(",");

  res.render("user/updateuser", { user: req.user, imgpath, skills });
  console.log(skills);

});

router.post("/update-user", (req, res) => {

  const { realname, location, morality, origin, bio, option1, option2, option3, option4, option5, option6, option7, option8, option9, option10 } = req.body;

  let skills = [option1, option2, option3, option4, option5, option6, option7, option8, option9, option10];

  skills = skills.filter(item => item !== undefined).join(",");

  console.log(skills);
  
  User.findByIdAndUpdate(req.user._id, { realname, skills })
    .then(() => {
      res.redirect('dashboard')
    })
    .catch((err) => {
      next(err);
    })

});

module.exports = router;
