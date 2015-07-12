/*jslint node:true */
"use strict";

var express = require('express');
var bodyParser = require('body-parser');

// authentication
var passport = require('passport');
var cookieParser        = require('cookie-parser');
var cookieSession       = require('cookie-session');

var morgan = require('morgan'); // TODO replace morgan with unified winston logging
var log = require('winston');

var Account = require('../models/account');
var uniformResponses = require('../uniform_responses');

var accountApp = express();

// set up morgan logging
accountApp.use(morgan('dev'));

// parse application/json
accountApp.use(bodyParser.json());

// parse application/vnd.api+json as json
accountApp.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
accountApp.use(bodyParser.urlencoded({ extended: true }));

// User session
accountApp.use(cookieParser());
accountApp.use(cookieSession({
    keys: [
        'T3SbXbzj8hZ6SKmDSb7zBzd7',
        'x2sMyRYGaggUydULVtcqpP4c',
        'B8fN64RTbf7UtBTFuhuJQqq4'
    ]
}));

// Configure passport middleware
accountApp.use(passport.initialize());
accountApp.use(passport.session());

// Configure local authentication
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        log.warn('Unauthorized access body: ', req.body);
        res.sendStatus(401);
    }
}

accountApp.get('/', ensureAuthentication, function(req, res) {
    if (req.query.username) {
        // get user account information
        Account.findByUsername(req.user.username, function(err, accounts) {
            if (err) {
                res.json(uniformResponses.createFailureResponse(err, 9001));
            } else {
                res.json(uniformResponses.createSuccessResponse(accounts));
            }
        });
    } else {
        // TODO remove this or restrict access with roles
        // get all accounts from the database
        Account.find(function(err, accounts) {
            if (err) {
                res.json(uniformResponses.createFailureResponse(err, 9001));
            } else {
                res.json(uniformResponses.createSuccessResponse(accounts));
            }
        });
    }
});

accountApp.post('/', function(req, res) {
    // register user locally
    var user = new Account({username : req.body.username});
    Account.register(user, req.body.password, function(err) {
        if (err) {
            log.warn('error during singup:\n', err);
            return res.json({result:'failure', error:err});
        }
        req.login(user, function(err) {
            if (err) {
                log.warn('error during singup login:\n', err);
                return res.json({result:'failure', error:err});
            }
            return res.json({result:'success'});
        });
    });
});

// route to log in
accountApp.post('/login',
                passport.authenticate('local'),
                function(req, res) { res.sendStatus(200); }
               );

// route to check if logged in
accountApp.get('/logged',
                ensureAuthentication,
                function(req, res) { res.sendStatus(200); }
               );

// route to log out
accountApp.post('/logout',
                function(req, res) { req.logOut(); res.sendStatus(200); }
               );

module.exports.app = accountApp;
module.exports.ensureAuthentication = ensureAuthentication;
