/*jslint node:true */
"use strict";

var bodyParser = require('body-parser');

// authentication
var passport            = require('passport');
var cookieParser        = require('cookie-parser');
var cookieSession       = require('cookie-session');

var morgan = require('morgan'); // TODO replace morgan with unified winston logging
var log = require('winston');

var Account = require('./models/account');
var uniformResponses = require('./uniform_responses');

function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        log.warn('Unauthorized access, body: ', req.body);
        res.sendStatus(401);
    }
}

module.exports.configureForAuthentication = function (path, app, registrationCb) {
// Remove a forward slash / at the end of the string
path = path.replace(/\/$/, '');

// set up morgan logging
app.use(morgan('dev'));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// User session
app.use(cookieParser());
app.use(cookieSession({
    keys: [
        'T3SbXbzj8hZ6SKmDSb7zBzd7',
        'x2sMyRYGaggUydULVtcqpP4c',
        'B8fN64RTbf7UtBTFuhuJQqq4'
    ]
}));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure local authentication
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.get(path + '/', ensureAuthentication, function(req, res) {
    if (req.user.username) {
        // get user account information
        Account.findByUsername(req.user.username, function(err, accounts) {
            if (err) {
                res.json(uniformResponses.createErrorResponse(err, 9001));
            } else {
                res.json(uniformResponses.createSuccessResponse(accounts));
            }
        });
    } else {
        // TODO remove this or restrict access with roles
        // get all accounts from the database
        Account.find(function(err, accounts) {
            if (err) {
                res.json(uniformResponses.createErrorResponse(err, 9001));
            } else {
                res.json(uniformResponses.createSuccessResponse(accounts));
            }
        });
    }
});

app.post(path + '/create', function(req, res) {
    // register user locally
    var user = new Account({username : req.body.username});
    Account.register(user, req.body.password, function(err) {
        if (err) {
            log.warn('error during singup:\n', err);
            return res.json(uniformResponses.createErrorResponse(err, 9001));
        }
        req.login(user, function(err) {
            if (err) {
                log.warn('error during singup login:\n', err);
                if (registrationCb) {
                    setTimeout(registrationCb, 0);
                }
                // TODO fix error message and code
                return res.json(uniformResponses.createErrorResponse(err, 9001));
            }
            return res.json(uniformResponses.createSuccessResponse());
        });
    });
});

// route to log in
app.post(path + '/login',
                passport.authenticate('local'),
                function(req, res) { res.sendStatus(200); }
               );

// route to check if logged in
app.get(path + '/logged',
                ensureAuthentication,
                function(req, res) { res.sendStatus(200); }
               );

// route to log out
app.post(path + '/logout',
                function(req, res) { req.logOut(); res.sendStatus(200); }
               );

};

module.exports.ensureAuthentication = ensureAuthentication;
