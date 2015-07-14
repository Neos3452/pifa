/*jslint jasmine:true, node:true*/
describe('Account', function() {

    var request = require('supertest');
    var mongoose = require('mongoose');
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
        var agent = null;

        beforeEach(function(){
            agent = request.agent(accountApp);
        });

        afterEach(function(done) {
            Account.remove({}, done);
        });

        it('is possible', function(done) {
            agent.post('/create')
                .send({username: 'dummy', password: 'even dummier'})
                .end(function(err, res){
                    expect(err).toBeNull();
                    expect(res.status).toBe(200);
                    expect(res.body.result).toBe('success');
                    expect(res.body.errorObject).not.toBeDefined();
                    done();
                });
        });

        it('logs in automatically', function(done) {
            agent.post('/create')
                .send({username: 'dummy', password: 'even dummier'})
                .end(function(err, res){
                    expect(err).toBeNull();
                    expect(res.status).toBe(200);
                    expect(res.body.result).toBe('success');
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
                .send({username: 'dummy', password: 'even dummier'})
                .end(function(err, res){
                    expect(err).toBeNull();
                    expect(res.status).toBe(200);
                    expect(res.body.result).toBe('success');
                    expect(res.body.errorObject).not.toBeDefined();

                    agent.post('/create')
                        .send({username: 'dummy', password: 'even dummier'})
                        .end(function(err, res){
                            expect(err).toBeNull();
                            expect(res.status).toBe(200);
                            expect(res.body.result).toBe('failure');
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
