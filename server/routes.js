/*jslint node:true */
"use strict";

var passport = require('passport');
var Player = require('./models/player');
var Account = require('./models/account');

module.exports = function(app) {

    function ensureAuthentication(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.sendStatus(401);
        }
    }

    // server routes ===========================================================

    app.get('/api/player', function(req, res) {
        // use mongoose to get all players in the database
        Player.find(function(err, players) {

            // if there is an error retrieving, send the error.
                            // nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }

            res.json(players); // return all players in JSON format
        });
    });

    app.get('/api/account', ensureAuthentication, function(req, res) {
        if (req.query.username) {
            Account.findByUsername(req.query.username, function(err, accounts) {
                if (err) {
                    res.send(err);
                }

                res.json({result:accounts}); // return all players in JSON format
            });
        } else {
            // use mongoose to get all players in the database
            Account.find(function(err, accounts) {
                if (err) {
                    // if there is an error retrieving, send the error.
                    res.send(err);
                } else {
                    // return all players in JSON format
                    res.json({result:accounts});
                }
            });
        }
    });

    app.post('/api/account', function(req, res) {
        // register user locally
        Account.register(new Account({username : req.body.username}), req.body.password, function(err) {
            if (err) {
                return res.json({result:'failure', error:err});
            }
            return res.json({result:'success'});
        });
    });

    // route to log in
    app.post('/login', passport.authenticate('local'), function(req, res){ res.sendStatus(200); });
    // route to check if logged in
    app.post('/logged', ensureAuthentication, function(req, res){ res.sendStatus(200); });
    // route to log out
    app.post('/logout', function(req, res){ req.logOut(); res.sendStatus(200); });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile(global.rootPath + '/public/views/index.html'); // load our public/index.html file
    });

};
