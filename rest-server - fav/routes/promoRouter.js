
  var express = require('express');
  var promoRouter =  express.Router();
  var bodyParser = require('body-parser');
//import mongoose
var mongoose = require('mongoose');

//import Promotions
var Promotions = require('../models/promotions');

//import Verify
var Verify = require('./verify');
promoRouter.use(bodyParser.json());

promoRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req,res,next){
        //updating with Promotions.find function
        Promotions.find({},function(err,promotion){
                if(err) throw err;
                res.json(promotion);
        });
        
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin ,function(req, res, next){
        //updating with Promotions.create function
        Promotions.create(req.body, function(err,promotion){
                if(err) throw err;
                console.log('Promotion Created!');
                var id = promotion._id;
                res.writeHead(200,{'Content-Type': 'text/plain'});
                res.end('Added the promotion with ID: ' + id);
        });
    
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin ,function(req, res, next){
        //updating with Promotions.remove function
        Promotions.remove({}, function(err,resp){
                if(err) throw err;
                res.json(resp);
        });
        
});

//Routing based  on promotion ID

promoRouter.route('/:promotionId')


.get(Verify.verifyOrdinaryUser, function(req,res,next){
        //Updating with Promotions.find based on Id
        Promotions.find(req.params.promotionId, function(err, promotion){
                if(err) throw err;
                res.json(promotion);
        });
        
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        //Updating with Promotions.findByIdAndUpdate
        Promotions.findByIdAndUpdate(req.params.promotionId, {$set: req.body},{
               new: true 
        },
        function(err, promotion){
                if(err) throw err;
                res.json(promotion);
        });
        
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        //Updating with Promotions.findByIdAndRemove
        Promotions.findByIdAndRemove(req.params.promotionId,function(err,resp){
                if(err) throw err;
                res.json(resp);
        });
        
});
module.exports = promoRouter;