/*jslint node:true */

// grab the mongoose module
var mongoose = require('mongoose');

var Player = new mongoose.Schema({
    account : { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    name : String,
    originalTeam : { type: String, required: true }
});

module.exports = mongoose.model('Player', Player);
