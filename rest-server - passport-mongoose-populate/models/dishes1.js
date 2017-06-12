//import mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//create a schema
var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
    }, {
        timestamps: true
    
});
//Model is required to use the above schema
var Dishes = mongoose.model('Dish',dishSchema);
//.model creates a dishes(plural of DISH) model by taking the created schema as second variable

module.exports = Dishes;