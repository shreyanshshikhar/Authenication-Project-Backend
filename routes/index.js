var express = require('express');
var router = express.Router();
const passport = require("passport");
const userModel = require("./users");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});
router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile');
});
router.post("/register", function(req, res) {
    var userdata = new userModel({
        username: req.body.username,
        secret: req.body.secret
    });
    userModel.register(userdata, req.body.password).then(function(registereduser) {
        passport.authenticate("local")(req, res, function() {
            res.redirect("/profile");
        })
    })
});
router.post("/login", passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/"
    }), function(req, res) {}) //fun par pahuchanay sai pehlay hi daboch lengay isliya login kai just badh passport.authenticate likha hai

router.get("/logout", function(req, res, next) {
    req.logOut(function(err) {
        if (err) { return next(err); }
        res.redirect('/')
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/"); ///ye tab kam aaiga for eg /profile pr direct without login kai janay kai koshish kr diya toh
};
module.exports = router;