/*jslint node:true */

// grab the mongoose module
var mongoose = require('mongoose');
//var mongooseHistory = require('mongoose-history');

var TeamDesc = {
    score : Number,
    goals : {
        offense : Number,
        defense : Number
    },
    players : {
        offense : { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        defense : { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
    }
};

// sub-doc not saved directly into database
var Match = new mongoose.Schema({
    matchNumber : Number,
    team1 : TeamDesc,
    team2 : TeamDesc,
    table : {type:String, default:"IBC1.2"},
    duration : {type:Number, default:0.0} // in seconds
});

//Match.plugin(mongooseHistory);

module.exports = mongoose.model('Match', Match);
