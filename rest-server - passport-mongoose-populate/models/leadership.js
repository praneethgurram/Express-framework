//import the required modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Create the leadership schema 
var leaderSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: true
    },
   designation:{
       type: String,
       required: true
   },
    abbr:{
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true

    }
    
}, {
    timestamps: true
});

var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;
