/*jslint jasmine:true, node:true*/
describe('Game', function() {

    var request = require('supertest');
    var mongoose = require('mongoose');
    var db = require('../../config/test_db');

    var Account = require('../../server/models/account');
    var Match = require('../../server/models/match');
    var Game = require('../../server/models/game');
    var gameRoutes = require('../../server/game_api').app;
    var agent = null;

    beforeAll(function(done) {
       mongoose.connect(db.url, {}, done);
    });

    beforeEach(function(){
        agent = request.agent(gameRoutes);
    });

    afterEach(function(done) {
        Game.remove({}, done);
    });

    afterAll(function(done) {
       mongoose.disconnect(done);
    });

    describe('creation', function() {
        it('simple game', function(done) {
            var dummyAcc = new Account({});
            var matches = [new Match({})];
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
                        .send({season: 100})
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
//
//    it('can register', function(done) {
//        agent.post('/')
//            .send({username: 'dummy', password: 'even dummier'})
//            .end(function(err, res){
//                expect(err).toBeNull();
//                expect(res.status).toBe(200);
//                expect(res.body.result).toBe('success');
//                done();
//            });
//    });
//
//    it('should be logged in after registration', function(done) {
//        agent.post('/')
//            .send({username: 'dummy', password: 'even dummier'})
//            .end(function(err, res){
//                expect(err).toBeNull();
//                expect(res.status).toBe(200);
//                expect(res.body.result).toBe('success');
//                agent.get('/logged')
//                    .end(function(err, res){
//                        expect(err).toBeNull();
//                        expect(res.status).toBe(200);
//                        done();
//                    });
//            });
//    });
//
//    it('cannot register user twice', function(done) {
//        agent.post('/')
//            .send({username: 'dummy', password: 'even dummier'})
//            .end(function(err, res){
//                expect(err).toBeNull();
//                expect(res.status).toBe(200);
//                expect(res.body.result).toBe('success');
//
//                agent.post('/')
//                    .send({username: 'dummy', password: 'even dummier'})
//                    .end(function(err, res){
//                        expect(err).toBeNull();
//                        expect(res.status).toBe(200);
//                        expect(res.body.result).toBe('failure');
//                        done();
//                    });
//            });
//    });
});
