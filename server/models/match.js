/*jslint node:true */

// grab the mongoose module
var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');

var TeamDesc = {
    score : Number,
    goals : {
        offense : Number,
        defense : Number
    },
    players : {
        offense : { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
        defense : { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
    }
};

// sub-doc not saved directly into database
var Match = new mongoose.Schema({
    game : {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
    matchNumber : Number,
    team1 : TeamDesc,
    team2 : TeamDesc,
    table : {type:String, default:"IBC2.2"},
    duration : {type:Number, default:0.0} // in seconds
});

Match.plugin(mongooseHistory);

module.exports = mongoose.model('Match', Match);
