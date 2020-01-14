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

router.post("/pearl", (req, res, next) => {
  User.findOne({ username: "Black Pearl" })
    .then((pearl) => {
      req.login(pearl, function (err) {
        if (err) {
          console.log(err);
        }
        return res.redirect('/dashboard');
      });
    })

})

router.post("/batman", (req, res, next) => {
  User.findOne({ username: "Batman" })
    .then((batman) => {
      req.login(batman, function (err) {
        if (err) {
          console.log(err);
        }
        return res.redirect('/dashboard');
      });
    })

})

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
          skills: [
            { name: "gen", desc: "Genius IQ", chosen: "" },
            { name: "str", desc: "Super Strength", chosen: "" },
            { name: "spe", desc: "Super Speed", chosen: "" },
            { name: "sen", desc: "Super Senses", chosen: "" },
            { name: "mar", desc: "Martial Arts", chosen: "" },
            { name: "fly", desc: "Flying", chosen: "" },
            { name: "hea", desc: "Healing", chosen: "" },
            { name: "psy", desc: "Psychic", chosen: "" },
            { name: "mag", desc: "Magic", chosen: "" },
            { name: "ele", desc: "Elemental Powers", chosen: "" }
          ],
          morality: "",
          location: "",
          hq: "",
          origin: "",
          bio: "",
        });

        newUser.save((err) => {
          if (err) {
            res.render("auth/signup", { message: "Please try again!" });
            console.log(err);
          } else {
            req.login(newUser, function (err) {
              if (err) {
                console.log(err);
              }
              return res.redirect('/dashboard');
            });
          }
        });
      })
      .catch(error => {
        next(error)
      })
  }

  console.log(req.body);

});

router.get("/signout", (req, res) => {
  req.flash('error', 'You are now logged out!')
  req.logout();
  res.redirect("/signin");
});

/*------------ USER Routes ------------ */


//By default it goes to /login, here it goes to /signin

router.get("/dashboard", (req, res) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to view Dashboard')
    res.redirect('/signin')
  }

  res.render("user/dashboard", { user: req.user });

});


router.get("/update", (req, res) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to update profile')
    res.redirect('/signin')
  }

  let moral = {
    gl: req.user.morality === "Good | Lawful" ? "selected" : "",
    gn: req.user.morality === "Good | Neutral" ? "selected" : "",
    gc: req.user.morality === "Good | Chaotic" ? "selected" : "",
    nl: req.user.morality === "Neutral | Lawful" ? "selected" : "",
    nn: req.user.morality === "True Neutral" ? "selected" : "",
    nc: req.user.morality === "Neutral | Chaotic" ? "selected" : "",
    el: req.user.morality === "Evil | Lawful" ? "selected" : "",
    en: req.user.morality === "Evil | Neutral" ? "selected" : "",
    ec: req.user.morality === "Evil | Chaotic" ? "selected" : "",
  }

  res.render("user/updateuser", { user: req.user, moral });
  console.log(req.user);

});

router.post("/update", upload.single("avatar"), (req, res) => {

  const { realname, location, morality, origin, hq, bio, gen, hea, fly, mag, mar, psy, sen, spe, str, ele } = req.body;

  let skills = [
    { name: "gen", desc: "Genius IQ", chosen: gen },
    { name: "str", desc: "Super Strength", chosen: str },
    { name: "spe", desc: "Super Speed", chosen: spe },
    { name: "sen", desc: "Super Senses", chosen: sen },
    { name: "mar", desc: "Martial Arts", chosen: mar },
    { name: "fly", desc: "Flying", chosen: fly },
    { name: "hea", desc: "Healing", chosen: hea },
    { name: "psy", desc: "Psychic", chosen: psy },
    { name: "mag", desc: "Magic", chosen: mag },
    { name: "ele", desc: "Elemental Powers", chosen: ele }
  ]

  let avatar = req.file ? req.file.filename : req.user.avatar;

  User.findByIdAndUpdate(req.user._id, { realname, avatar, location, skills, morality, hq, origin, bio })
    .then(() => {
      res.redirect('/dashboard')
    })
    .catch((err) => {
      next(err);
    })

});

router.get('/delete', (req, res, next) => {

  if (!req.user) {
    req.flash('error', 'Please sign in to delete profile')
    res.redirect('/signin')
  }

  res.render("user/deleteuser", { user: req.user });

})

router.post('/delete', (req, res, next) => {

  let { password } = req.body;
  let user = req.user;

  if (bcrypt.compareSync(password, user.password)) {

    User.findByIdAndRemove(user._id)
      .then(() => {
        res.redirect('/'); // Add a message that says user deleted successfully!
      })
      .catch((err) => {
        next(err);
      })

  } else {
    res.render("user/deleteuser", { message: "Incorrect Password!" });
  }

})

router.get('/profile/:theUser', (req, res, next) => {

  let whichUser = req.params.theUser;

  User.findOne({ username: whichUser })
    .then((user) => {
      res.render("user/profile", { user });
    })
});

module.exports = router;
