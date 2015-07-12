/*jslint jasmine:true, node:true*/
describe('Game', function() {

    var bodyParser = require('body-parser');
    var request = require('supertest');
    var mongoose = require('mongoose');
    var db = require('../../config/db');

    var Game = require('../../server/models/game');
    var gameRoutes = require('../../server/game_api').app;
    var agent = null;

    beforeAll(function(done) {
       mongoose.connect(db.url, {}, done);
    });

    beforeEach(function(){
        agent = request.agent(gameRoutes);
        // should use the same settings as in game route
        gameRoutes.use(bodyParser.json());
        gameRoutes.use(bodyParser.json({ type: 'application/vnd.api+json' }));
        gameRoutes.use(bodyParser.urlencoded({ extended: true }));
    });

    afterEach(function(done) {
        Game.remove({}, done);
    });

    afterAll(function(done) {
       mongoose.disconnect(done);
    });

    describe('creation', function() {
        it('simple game', function(done) {
            agent.post('/')
                .send({
                    season: 100,
                    matches: [],
                    creator: 0
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
