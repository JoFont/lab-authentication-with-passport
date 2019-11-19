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

router.post("/sign-in", passport.authenticate("signin", {
  successRedirect: '/',
  failureRedirect: '/auth/sign-in'
}));

router.get("/sign-up", (req, res) => {
  res.render("passport/signup");
});

router.post("/sign-up", passport.authenticate("signup", {
  successRedirect: '/',
  failureRedirect: '/auth/sign-up'
}));



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
