/*jslint node: true */
"use strict";

// modules =================================================
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var mongoose        = require('mongoose');
//var favicon         = require('serve-favicon');
var morgan          = require('morgan'); // TODO replace morgan with unified winston logging
var log             = require('winston');

// expose app for circular dependencies
exports = module.exports = app;

// configuration ===========================================

// root directory
global.rootPath = __dirname;

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// set up morgan logging
app.use(morgan('dev'));

// connect to our mongoDB database
// (uncomment after entering credentials in config/db.js)
mongoose.connect(db.url);
mongoose.connection.on('error', function(error) {
    log.error('' + error);
    process.exit(1);
});

mongoose.connection.once('open', function() {
    // TODO route specific setting should be moved into routes, these are app settings
    // get all data/stuff of the body (POST) parameters
    // parse application/json
    app.use(bodyParser.json());

    // parse application/vnd.api+json as json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

    // set the static files location /public/img will be /img for users
    app.use(express.static(global.rootPath + '/public'));
    // set favicon
//    app.use(favicon(__dirname + '/public/favicon.ico'));

    // routes ==================================================
    require('./server/routes')(app); // configure our routes

    // start app ===============================================
    app.listen(port);

    // shout out to the user
    log.info('Application started on :' + port);
});
