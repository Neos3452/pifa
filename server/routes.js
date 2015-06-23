/*jslint node:true */
"use strict";

// grab the nerd model we just created
var Player = require('./models/player');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
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

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile(global.rootPath + '/public/views/index.html'); // load our public/index.html file
    });

};
