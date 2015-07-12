/*jslint node:true */

// grab the mongoose module
var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');
var Match = require('./match.js');

var Game = new mongoose.Schema({
    season : Number, // TODO change into descriptor for things like leagues, teams and so on
    matches : [Match],
    nrOfChanges : Number,
    creator : { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
});

Game.plugins(mongooseHistory);

module.exports = mongoose.model('Game', Game);
