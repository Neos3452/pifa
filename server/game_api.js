/*jslint node:true */
"use strict";

var bodyParser = require('body-parser');
var log = require('winston');
var when = require('when');

var Account = require ('./models/account');
var Game = require('./models/game');
var uniformResponses = require('./uniform_responses');

module.exports.init = function () {
    return [        // parse application/json
        bodyParser.json(),

        // parse application/vnd.api+json as json
        bodyParser.json({ type: 'application/vnd.api+json' }),

        // parse application/x-www-form-urlencoded
        bodyParser.urlencoded({ extended: true })
    ];
};

module.exports.getGames = function(req, res) {
    if (req.query) {
        // get all matches by query
        Game.find(req.query, function(err, games) {
            if (err) {
                res.json(uniformResponses.createErrorResponse(err, 9001));
            } else {
                res.json(uniformResponses.createSuccessResponse(games));
            }
        });
    } else {
        res.json(uniformResponses.createErrorResponse(undefined, 1001));
    }
};

// TODO
//gameApp.get('/:id', function(req, res) {
//    Game.findById(req.params.id, function(err, games) {
//        if (err) {
//            res.json(uniformResponses.createErrorResponse(err, 9001));
//        } else {
//            res.json(uniformResponses.createSuccessResponse(games));
//        }
//    });
//});

module.exports.createGame = function(req, res) {
    if (req.body) {
        // TODO Validate req.body

        var game = new Game(req.body);
        game.creator = req.user._id;

        // Lookup all the players from the match and find theirs ids
        var promises = [];
        var assignOffense = function(players, username) { players.offense = username; };
        var assignDefense = function (players, username) { players.defense = username; };

        log.info("Nr of matches " + game.matches.length);
        for (var i = 0; i < game.matches.length; ++i) {
            var match = game.matches[i];
            log.info('match ' + i + ' ' + match);
            match.game = game;
            // TODO fail if not found
            promises.push(Account.findOne({name: match.team1.players.offense}).exec()
                            .then(assignOffense.bind(this, match.team1.players)));
            promises.push(Account.findOne({name: match.team1.players.defense}).exec()
                            .then(assignDefense.bind(this, match.team1.players)));
            promises.push(Account.findOne({name: match.team2.players.offense}).exec()
                            .then(assignOffense.bind(this, match.team2.players)));
            promises.push(Account.findOne({name: match.team2.players.defense}).exec()
                            .then(assignDefense.bind(this, match.team2.players)));
        }
        // When we get all the ids, save the game
        when.all(promises)
            .then(game.save.bind(game))
            .then(function() {
                    res.status(201).json(game);
                })
            .catch(function(err) {
                    log.error(err);
                    res.json(uniformResponses.createErrorResponse(err, 9001));
                });
    } else {
        res.status(400).json(uniformResponses.createErrorResponse('Empty request', 1001));
    }
};
