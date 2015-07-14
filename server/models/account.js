/*jslint node:true */

// grab the mongoose and auth module
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new mongoose.Schema({
    username : String,
    password : String,
    roles : [String]
});

// Save as user passport local account
Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
