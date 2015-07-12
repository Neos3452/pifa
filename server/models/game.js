/*jslint node:true */

// grab the mongoose module
var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');
var Match = require('./match.js');

var Game = new mongoose.Schema({
    season : { type: Number, required: true }, // TODO change into descriptor for things like leagues, teams and so on
    matches : { type: [Match], required: true },
    creator : { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
});

Game.plugin(mongooseHistory);

module.exports = mongoose.model('Game', Game);
