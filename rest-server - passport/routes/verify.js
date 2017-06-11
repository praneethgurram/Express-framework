//Import User
var User = require('../models/user');
//Import Jsonweb token
var jwt = require('jsonwebtoken');
//Import config
var config = require('../config');

//function to export Token
exports.getToken = function(user){
    return jwt.sign(user, config.secretkey, {
        expiresIn: 3600
    });
};

//function to verify user
exports.verifyOrdinaryUser = function(req,res, next){
    //Check header or Url parameters  or post parameters for token'
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //decode token
    if(token){
        //verifies secret and checks exp
        jwt.verify(token, config.secretkey, function(err, decoded){
            if(err){
                var err= new Error('You are not Authenticated!')
                err.status =401;
                return next(err);
            }
            else{
                //if sucessful, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }
    else{
        //if no token is present
        //return the error
        var err = new Error('No token present!');
        err.status =403;
        return  next(err);

    }

};

//function to export admin
exports.verifyAdmin = function(req,res, next){
    if(req.decoded._doc.admin == true){
        next();
    }
    else{
        var err = new Error('You are not Authorized as an Admin User!');
        err.status = 403;
        return next(err);
    }
};
