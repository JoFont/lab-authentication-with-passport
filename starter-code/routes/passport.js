'use strict';

const router = require('express').Router();
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// Add bcrypt to encrypt passwords

// Add passport
require("../config/passport-config");


router.get("/sign-in", (req, res) => {
  res.render("passport/signin");
});

router.post("/sign-in", passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/auth/sign-in'
}));

router.get("/sign-up", (req, res) => {
  res.render("passport/signup");
});

router.post("/sign-up", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
      if (!user) {
        bcrypt.hash(password, 10).then(hash => {
            console.log(hash);
            return User.create({
                email: email,
                passwordHash: hash
            });
        })
        .then(createdUser => {
          res.locals.user = createdUser;
          res.redirect("/");
        })
        .catch(error => {
            throw new Error(error);
        });
    } else {
      res.locals.user = user;
    }
  })
  .catch(error => {
    throw new Error(error);
  });
});



const ensureLogin = require('connect-ensure-login');

router.get(
  '/private-page',
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const user = req.user;
    res.render('passport/private', {
      user
    });
  }
);

module.exports = router;
