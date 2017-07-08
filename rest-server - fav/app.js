var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promorouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var favoriteRouter = require('./routes/favoriteRouter');
// import mongoose
var mongoose = require('mongoose');

//import passport
var passport = require('passport');
//import local strategy
var LocalStrategy = require('passport-local').Strategy;

//import the config
var config = require('./config');

//connect to url
mongoose.connect(config.mongoUrl);

//return of connection event is stored in variable db
var db = mongoose.connection;

//if on error log the error into console
db.on('error', console.error.bind(console, 'connection error:'));

//connected! create the dish and later delete the dish
db.once('open',function(){
    //connected to db
    console.log("Connected to the Server");

});





var app = express();
app.all('*', function(req, res, next){
    if (req.secure){
        return next();
    }
    res.redirect('https://' + req.hostname + ':' + app.get('secPort') + req.url);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Passport Config
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/dishes', dishRouter);
app.use('/promotions', promorouter);
app.use('/leadership', leaderRouter);
app.use('/favorites', favoriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  
  res.json({
    message: err.message,
    error: {}
  })
});

module.exports = app;
