const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
})

const upload = multer({ storage });


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signin', (req, res, next) => {
  let img = { icon: "img/cb-icon.svg" }
  res.render('signin', { img });
});

router.get('/signup', (req, res, next) => {
  let img = { icon: "img/cb-icon.svg" }
  res.render('signup', { img });
});

router.post('/signup', upload.single("avatar"), (req, res, next) => {
  
  console.log(req.file);
  
  const { heroname, pass, pass2 } = req.body;

  const salt = bcrypt.genSaltSync(12);
  const hashedPassWord = bcrypt.hashSync(pass, salt);

  User.create({
    name: heroname,
    password: hashedPassWord
  })
    .then(() => {
      console.log('Task complete!');
      res.redirect('/')
    })
    .catch((err) => {
      next(err);
    })

});

module.exports = router;
