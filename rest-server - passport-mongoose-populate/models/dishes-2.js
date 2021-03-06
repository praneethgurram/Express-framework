//import the required modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create the comment Schema
var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
     author: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

//Create the dish schema and use the comment schema
var dishSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true

    },
    comments: [commentSchema]
}, {
    timestamps: true
});

var Dishes = mongoose.model('Dish',dishSchema);

module.exports = Dishes;
