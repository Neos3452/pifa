/*jslint node:true */

// grab the mongoose module
var mongoose = require('mongoose');

var TeamDesc = new mongoose.Schema({
    score : Number,
    goals : {
        offense : Number,
        defense : Number
    },
    players : {
        offense : { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        defense : { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
    }
});

// sub-doc not saved directly into database
module.exports = new mongoose.Schema({
    game : {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
//    matchNumber : Number, // TODO is it required? It's an array in game schema
    team1 : TeamDesc,
    team2 : TeamDesc,
    table : {type:String, default:"IBC2.2"},
    duration : {type:Number, default:0.0} // in seconds
});
