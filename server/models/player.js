/*jslint node:true */

// grab the mongoose module
var mongoose = require('mongoose');

module.exports = mongoose.model('Player', {
    name : String,
    originalTeam : String
});
