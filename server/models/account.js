/*jslint node:true */

// grab the mongoose and auth module
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new mongoose.Schema({
    roles : [String],
    name : String,
    team : { type: String, required: true }
});

Account.method("safeObject", function() {
    "use strict";
    return {username: this.username, name: this.name, team: this.team};
});

// Save as user passport local account
Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
