/*jslint jasmine:true, node:true*/
describe('Account', function() {

    var request = require('supertest');
    var mongoose = require('mongoose');
    var when = require('when');
    var db = require('../../config/test_db');

    var Account = require('../../server/models/account');
    var express = require('express');
    var accountRoutes = require('../../server/account_routes');

    var accountApp = express();
    accountApp.use('/', accountRoutes.init());
    accountApp.get('/get', accountRoutes.getUserInfo);
    accountApp.post('/create', accountRoutes.register);
    accountApp.post('/login', accountRoutes.login);
    accountApp.get('/logged', accountRoutes.loginStatus);
    accountApp.post('/logout', accountRoutes.logout);

    beforeAll(function(done) {
        mongoose.connect(db.url, {}, done);
    });

    afterAll(function(done) {
        mongoose.disconnect(done);
    });

    describe('registration', function() {
        let agent = null;

        beforeEach(function(){
            agent = request.agent(accountApp);
        });

        afterEach(function(done) {
            when.all([
                    Account.remove({}).exec()
                ]).then(function() {
                    delete mongoose.models.Account;
                    delete mongoose.modelSchemas.Account;
                }).then(done);
        });

        it('is possible', function(done) {
            const username = 'dummy';
            const team = 'sample team';
            agent.post('/create')
                .send({username: username, password: 'even dummier', team: team})
                .end(function(err, res){
                    expect(err).toBeNull();
                    expect(res.status).toBe(201);
                    expect(res.body).toEqual({username: username, name: username, team: team});
                    expect(res.body.errorObject).not.toBeDefined();
                    done();
                });
        });

        it('logs in automatically', function(done) {
            agent.post('/create')
                .send({username: 'dummy', password: 'even dummier', team: 'sample team'})
                .end(function(err, res){
                    expect(err).toBeNull();
                    expect(res.status).toBe(201);
                    // expect(res.body.result).toBe('success');
                    expect(res.body.errorObject).not.toBeDefined();
                    agent.get('/logged')
                        .end(function(err, res){
                            expect(err).toBeNull();
                            expect(res.status).toBe(200);
                            done();
                        });
                });
        });

        it('forbids multiple registrations', function(done) {
            agent.post('/create')
                .send({username: 'dummy', password: 'even dummier', team: 'team'})
                .end(function(err, res){
                    expect(err).toBeNull();
                    expect(res.status).toBe(201);
                    expect(res.body.errorObject).not.toBeDefined();

                    agent.post('/create')
                        .send({username: 'dummy', password: 'even dummier', team: 'team'})
                        .end(function(err, res){
                            expect(err).toBeNull();
                            expect(res.status).toBe(409);
                            done();
                        });
                });
        });
    });

    describe('log in process', function() {
        beforeAll(function(done) {
            request.agent(accountRoutes).post('/create')
                .send({username: 'dummy', password: 'even dummier'})
                .end(function(err, res){
                    expect(err).toBeNull();
                    expect(res.status).toBe(200);
                    expect(res.body.result).toBe('success');
                    expect(res.body.errorObject).not.toBeDefined();
                    done();
                });
        });

        afterAll(function(done) {
            Account.remove({}, done);
        });

        var agent = null;

        beforeEach(function(){
            agent = request.agent(accountApp);
        });
    });

});
