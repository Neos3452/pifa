/*jslint jasmine:true, node:true*/
describe('Game', function() {

    var request = require('supertest');
    var express = require('express');
    var mongoose = require('mongoose');
    var db = require('../../config/test_db');

    var Account = require('../../server/models/account');
    var Match = require('../../server/models/match');
    var Game = require('../../server/models/game');
    var gameRoutes = require('../../server/game_api');
    var agent = null;

    var gameApp = express();
    gameApp.use(gameRoutes.init());
    gameApp.get('/', gameRoutes.getGames);
    gameApp.post('/', function(req, res, next) {
            req.user = {_id: new Account({})._id};
            next();
        }, gameRoutes.createGame);

    beforeAll(function(done) {
       mongoose.connect(db.url, {}, done);
    });

    beforeEach(function(){
        agent = request.agent(gameApp);
    });

    afterEach(function(done) {
        Game.remove({}, done);
    });

    afterAll(function(done) {
       mongoose.disconnect(done);
    });

    describe('creation', function() {
        it('simple game', function(done) {
            var matches = [];
            agent.post('/')
                .send({
                    season: 100,
                    matches: matches,
                })
                .end(function(err, res){
                    expect(err).toBeNull();
                    expect(res.status).toBe(200);
                    expect(res.body.result).toBe('success');
                    expect(res.body.errorObject).not.toBeDefined();
                    agent.get('/')
                        .send({})
                        .end(function(err, res){
                            expect(err).toBeNull();
                            expect(res.status).toBe(200);
                            expect(res.body.result).toBe('success');
                            expect(res.body.errorObject).not.toBeDefined();
                            expect(res.body.data.length).toBe(1);
                            done();
                        });
                });
        });

        it('game with a match', function(done) {
            var dummyAcc = new Account({});
            var matches = [new Match({
                matchNumber: 1,
                team1: {
                    score: 2,
                },
                team2: {
                    score: 3,
                }
            })];
            agent.post('/')
                .send({
                    season: 100,
                    matches: matches,
                    creator: dummyAcc._id
                })
                .end(function(err, res){
                    expect(err).toBeNull();
                    expect(res.status).toBe(200);
                    expect(res.body.result).toBe('success');
                    expect(res.body.errorObject).not.toBeDefined();
                    agent.get('/')
                        .send({})
                        .end(function(err, res){
                            expect(err).toBeNull();
                            expect(res.status).toBe(200);
                            expect(res.body.result).toBe('success');
                            expect(res.body.errorObject).not.toBeDefined();
                            expect(res.body.data.length).toBe(1);
                            done();
                        });
                });
        });
    });
});
