var express = require('express');
var bodyParser = require('body-parser');
var dishRouter = express.Router();
var bodyParser = require('body-parser');

//import mongoose
var mongoose = require('mongoose');

//import Dishes
var Dishes = require('../models/dishes');

//import Verify
var Verify = require('./verify');


dishRouter.use(bodyParser.json());

dishRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req,res,next){
        //updating with Dishes.find function
        Dishes.find({})
        .populate('comments.postedBy')
        .exec(function(err,dish){
                if(err) throw err;
                res.json(dish);
        });
        
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin ,function(req, res, next){
        //updating with Dishes.create function
        Dishes.create(req.body, function(err,dish){
                if(err) throw err;
                console.log('Dish Created!');
                var id = dish._id;
                res.writeHead(200,{'Content-Type': 'text/plain'});
                res.end('Added the dish with ID: ' + id);
        });
    
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin ,function(req, res, next){
        //updating with Dishes.remove function
        Dishes.remove({}, function(err,resp){
                if(err) throw err;
                res.json(resp);
        });
        
});

//Routing based  on Dish ID

dishRouter.route('/:dishId')


.get(function(req,res,next){
        //Updating with Dishes.find based on Id
        Dishes.find(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function(err, dish){
                if(err) throw err;
                res.json(dish);
        });
        
})

.put(function(req, res, next){
        //Updating with Dishes.findByIdAndUpdate
        Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body},{
               new: true 
        },
        function(err, dish){
                if(err) throw err;
                res.json(dish);
        });
        
})

.delete(function(req, res, next){
        //Updating with Dishes.findByIdAndRemove
        Dishes.findByIdAndRemove(req.params.dishId,function(err,resp){
                if(err) throw err;
                res.json(resp);
        });
        
});

//COMMENTS Management
dishRouter.route('/:dishId/comments')

//verify User is ordinary user
.all(Verify.verifyOrdinaryUser)
.get(function(req,res,next){
        Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function(err,dish){
                if(err) throw err;
                res.json(dish.comments);
        });
})

.post(function(req,res,next){
        Dishes.findById(req.params.dishId, function(err, dish){
                if(err) throw err;
                //Copy the id of the user into the body
                req.body.postedBy= req.decoded._doc._id;

                dish.comments.push(req.body);
                dish.save(function(err, dish){
                        if(err) throw err;
                        console.log('Added Comments');
                        res.json(dish);
                });
        });
})

.delete(Verify.verifyAdmin, function(req,res,next){
        Dishes.findById(req.params.dishId, function(err, dish){
                if(err) throw err;
                //Loop through the dish comments and remove them
                for(var i = (dish.comments.length - 1); i>=0;i--){
                        dish.comments.id(dish.comments[i]._id).remove();
                }
                dish.save(function(err, result){
                        if(err) throw err;
                        res.writeHead(200, {
                                'Content-Type': 'text/palin'
                        });
                        res.end('Deleted all Comments');
                });
        });
});

//Routing by Dish comments id
dishRouter.route('/:dishId/comments/:commentId')
.all(Verify.verifyOrdinaryUser)
.get(function(req,res,next){
        Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function(err, dish){
                if(err) throw err;
                res.json(dish.comments.id(req.params.commentId));
        });
})

.put(function(req,res,next){
        Dishes.findById(req.params.dishId, function(err, dish){
                if(err) throw err;
                //Remove the comment and add the new comment
                dish.comments.id(req.params.commentId).remove();
                //Copy the id of the user into the body
                req.body.postedBy= req.decoded._doc._id;
                // push the new comment
                dish.comments.push(req.body);
                //save the comment
                dish.save(function(err, dish){
                        if(err) throw err;
                        console.log('Updated the Comments for the Dish');
                        res.json(dish);
                });
        });
})

.delete(function(req,res,next){
        Dishes.findById(req.params.dishId, function(err, dish){

         //Check the user credentials of the comment before deleting 
         if (dish.comments.id(req.params.commentId).postedBy
           != req.decoded._doc._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
                dish.comments.id(req.params.commentId).remove();
                dish.save(function(err, result){
                        if(err) throw err;
                        res.json(result);
                });
        });
});

module.exports = dishRouter;