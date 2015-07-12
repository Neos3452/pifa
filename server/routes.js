/*jslint node:true */
"use strict";

var Player = require('./models/player');

module.exports = function(app) {

    // server routes ===========================================================

    // all account routes - register, login, logout etc.
    app.use('/api/account', require('./account/account_routes').app);

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

    // frontend routes =========================================================

    // route to handle all angular requests
    app.get('*', function(req, res) {
        // load public/index.html file
        res.sendFile(global.rootPath + '/public/views/index.html');
    });

};
