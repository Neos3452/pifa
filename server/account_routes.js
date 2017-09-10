/*jslint node:true */
"use strict";

var bodyParser = require('body-parser');

// authentication
var passport            = require('passport');
var cookieParser        = require('cookie-parser');
var cookieSession       = require('cookie-session');

//var morgan = require('morgan'); // TODO replace morgan with unified winston logging
var log = require('winston');

var Account = require('./models/account');
var uniformResponses = require('./uniform_responses');

var ensureAuthentication = module.exports.ensureAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        log.warn('Unauthorized access, body: ', req.body);
        res.sendStatus(401);
    }
};

module.exports.init = function () {

    var middlewares = [
        // parse application/json
        bodyParser.json(),

        // parse application/vnd.api+json as json
        bodyParser.json({ type: 'application/vnd.api+json' }),

        // parse application/x-www-form-urlencoded
        bodyParser.urlencoded({ extended: true }),

        // User session
        cookieParser(),
        cookieSession({
            keys: [
                'T3SbXbzj8hZ6SKmDSb7zBzd7',
                'x2sMyRYGaggUydULVtcqpP4c',
                'B8fN64RTbf7UtBTFuhuJQqq4'
            ]
        }),

        // Configure passport middleware
        passport.initialize(),
        passport.session(),
    ];

    // Configure local authentication
    passport.use(Account.createStrategy());
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());

    return middlewares;
};

module.exports.getUserInfo = function(req, res) {
    if (req.body.username) {
        // get user account information
        Account.findByUsername(req.body.username, function(err, accounts) {
            if (err) {
                res.json(uniformResponses.createErrorResponse(err, 9001));
            } else {
                if (!accounts) {
                    accounts = {};
                }
                res.status(404).json(accounts.map((a) => a.safeObject()));
            }
        });
    } else {
        // res.sendStatus(/*BAD_REQUEST*/);
        // TODO remove this or restrict access with roles
        // get all accounts from the database
        Account.find(function(err, accounts) {
            if (err) {
                res.json(uniformResponses.createErrorResponse(err, 9001));
            } else {
                res.json(accounts.map((a) => a.safeObject()));
            }
        });
    }
};

module.exports.register = function(req, res) {

    // TODO validate req.body

    log.info("username:" + req.body.username);

    // register user locally
    const user = new Account({username: req.body.username, name: req.body.username, team:req.body.team});
    Account.register(user, req.body.password, function(err) {
        if (err) {
            log.warn('error during signup:\n', err);
            return res.status(500).json(uniformResponses.createErrorResponse(err, 9001));
        } else {
            req.login(user, function (err) {
                if (err) {
                    log.warn('error during singup login:\n', err);
                    // TODO fix error message and code, until then we assume registration went ok
                    //return res.status(500).json(uniformResponses.createErrorResponse(err, 9001));
                }
//              if (registrationCb) {
//                  setTimeout(registrationCb, 0);
//              }
                return res.json(user.safeObject());
            });
        }
    });

};

// route to log in
module.exports.login = [
    passport.authenticate('local'),
    function(req, res) { res.json(req.user.safeObject()); }
];

// route to check if logged in
module.exports.loginStatus = [
    ensureAuthentication,
    function(req, res) { res.json(req.user.safeObject()); }
];

// route to log out
module.exports.logout = function(req, res) { req.logOut(); res.sendStatus(200); };
