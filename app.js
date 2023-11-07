var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require("express-session");
const passport = require("passport");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressSession({ //1-session create kiya   ,yeh allow kr rha ki session bn pai
    resave: false,
    saveUninitialized: false,
    secret: "helo baye baye"
}));
app.use(passport.initialize()); //2-passport shuru ho jao authentication aur autherization krnay kai liya
app.use(passport.session()); //3-password ka session wala module on ho rha jissay ki passport apnay session ko save kr paiga,aur yeh session bna dega
passport.serializeUser(usersRouter.serializeUser()); //encrypt
passport.deserializeUser(usersRouter.deserializeUser()); //decrypt
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;