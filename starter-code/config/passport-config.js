const passport = require("passport");
const LocalStrat = require("passport-local");
const bcrypt = require("bcryptjs");

const User = require("../models/user");


passport.use("signup", new LocalStrat((username, password, done) => {
    console.log("Running");
    User.findOne({ username }).then(user => {
        if (user) {
            console.log(user);
            bcrypt.compare(password, user.passwordHash).then(res => {
                return done(null, user);
            });
        } else {
            bcrypt.hash(password, 10).then(hash => {
                return User.create({
                    username,
                    passHash: hash
                });
            })
            .then(createdUser => {
               done(null, createdUser);
            });
        }
    }).catch(error => {
        return done(error);
    });
}));

passport.use("login", new LocalStrat((username, password, done) => {
    console.log("Running");
    User.findOne({ username }).then(user => {
        if (user) {
            bcrypt.compare(password, user.passwordHash).then(good => {
                if(good) {
                    done(null, user);
                } else {
                    done(new Error("Wrong Password"));
                }
            });
        } else {
            return done(null, false);
        }
    }).catch(error => {
        return done(error);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    User.findOne({_id}).then(user => {
        done(null, user);
    });
});