var express = require('express');
var router = express.Router();

//import passport
var passport = require('passport');
//import user Schema
var User = require('../models/user');
//import Verify for Verifying the user
var Verify = require('./verify');

/* GET users listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {

  User.find({}, function(err, user){
    if(err) throw err;
    res.json(user);
  });
 
});


//POST request function for registering the user
router.post('/register', function(req, res){
  User.register(new User({
    username: req.body.username
  }),req.body.password, function(err, user){
    if(err){
      return res.status(401).json({err: err});
    }
    //Check whether the body has firstname or not
    
    if(req.body.firstname) {
            user.firstname = req.body.firstname;
    }
    //Check whether the body has lastname or not
    if(req.body.lastname) {
            user.lastname = req.body.lastname;
    }

    //Check whether the user is succesffuly registered or not
    user.save(function(err,user){
    passport.authenticate('local')(req,res,function(){
      return res.status(200).json({status: 'Registration Successful!'});
    });
    });
  });
});

//POST login function for login in the user
router.post('/login', function(req,res,next){
  passport.authenticate('local', function(err, user, info){
    if(err){
      return next(err);
    }
    if(!user){
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err){
      if(err){
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      var token = Verify.getToken(user);
      res.status(200).json({
        status: 'Login Succesful!',
        sucess: true,
        token: token
      });
    });

  })(req,res,next);
});

//GET logout function for logging out User
router.get('/logout', function(req, res){
  req.logout();
  res.status(200).json({
    status: 'Logged Out!!'
  });
});


module.exports = router;
