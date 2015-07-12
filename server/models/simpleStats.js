/*jslint node:true */

// grab the mongoose module
var mongoose = require('mongoose');

// this could be changed into mixed type for some crazy stats
var SimpleStats = new mongoose.Schema({
    player : { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    season : Number,
    won : Number,
    played : Number,
    wonMatches : Number,
    playedMatches : Number,
});

module.exports = mongoose.model('SimpleStats', SimpleStats);
