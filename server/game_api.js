/*jslint node:true */
"use strict";

var express = require('express');
var bodyParser = require('body-parser');

var morgan = require('morgan'); // TODO replace morgan with unified winston logging
var log = require('winston');

var Game = require('./models/game');
var uniformResponses = require('./uniform_responses');

var gameApp = express();

// set up morgan logging
gameApp.use(morgan('dev'));

// parse application/json
gameApp.use(bodyParser.json());

// parse application/vnd.api+json as json
gameApp.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
gameApp.use(bodyParser.urlencoded({ extended: true }));

gameApp.get('/', function(req, res) {
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
});

gameApp.get('/:id', function(req, res) {
    Game.findById(req.params.id, function(err, games) {
        if (err) {
            res.json(uniformResponses.createErrorResponse(err, 9001));
        } else {
            res.json(uniformResponses.createSuccessResponse(games));
        }
    });
});

gameApp.post('/', function(req, res) {
    log.info(req.body);
    if (req.body) {
        log.info('ok');
        var game = new Game(req.body);
        game.save(function(err) {
            if (err) {
                log.error(err);
                res.json(uniformResponses.createErrorResponse(err, 9001));
            } else {
                res.json(uniformResponses.createSuccessResponse());
            }
        });
    } else {
        res.json(uniformResponses.createErrorResponse(undefined, 1001));
    }
});

module.exports.app = gameApp;
