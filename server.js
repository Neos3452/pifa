/*jslint node: true */
"use strict";

// modules =================================================
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var mongoose        = require('mongoose');
//var favicon         = require('serve-favicon');
var logger          = require('morgan');

// authentication
var cookieParser        = require('cookie-parser');
var cookieSession       = require('cookie-session');
var passport            = require('passport');

// configuration ===========================================

// root directory
global.rootPath = __dirname;

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// set up morgan logging
app.use(logger('dev'));

// connect to our mongoDB database
// (uncomment after entering credentials in config/db.js)
mongoose.connect(db.url);
mongoose.connection.on('error', function(error) {
    console.error('' + error);
    process.exit(1);
});

mongoose.connection.once('open', function() {
    // get all data/stuff of the body (POST) parameters
    // parse application/json
    app.use(bodyParser.json());

    // parse application/vnd.api+json as json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

    // User session
    app.use(cookieParser());
    app.use(cookieSession({
        keys: [
            'T3SbXbzj8hZ6SKmDSb7zBzd7',
            'x2sMyRYGaggUydULVtcqpP4c',
            'B8fN64RTbf7UtBTFuhuJQqq4'
        ]
    }));

    // set the static files location /public/img will be /img for users
    app.use(express.static(global.rootPath + '/public'));
    // set favicon
//    app.use(favicon(__dirname + '/public/favicon.ico'));


    // Configure passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure local authentication
    var Account = require('./server/models/account');
    passport.use(Account.createStrategy());
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());

    // routes ==================================================
    require('./server/routes')(app); // configure our routes

    // start app ===============================================
    app.listen(port);

    // shoutout to the user
    console.log('Application started on :' + port);

    // expose app
    exports = module.exports = app;
});
