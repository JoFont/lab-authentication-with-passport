const passport = require("passport");
const LocalStrat = require("passport-local");
const bcrypt = require("bcryptjs");

const User = require("../models/user");


passport.use(new LocalStrat({usernameField: "email"}, (email, password, done) => {
    console.log("Running");
    User.findOne({ email }).then(user => {
        if (user) {
            console.log(user);
            bcrypt.compare(password, user.passwordHash).then(res => {
                return done(null, user);
            });
        } else {
            return done(null, false);
        }
    }).catch(error => {
        return done(error);
    });
}));

// passport.use("sign-up", new LocalStrat({usernameField: "email"}, (email, password, done) => {
    
// }));