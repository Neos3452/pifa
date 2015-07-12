/*jslint jasmine:true, node:true*/
describe('Account', function() {

    var bodyParser = require('body-parser');
    var request = require('supertest');
    var mongoose = require('mongoose');
    var db = require('../../config/db');

    var Account = require('../../server/models/account');
    var accountRoutes = require('../../server/account_routes').app;
    var agent = null;

    beforeAll(function(done) {
       mongoose.connect(db.url, {}, done);
    });

    beforeEach(function(){
        agent = request.agent(accountRoutes);
        // should use the same settings as in account route
        accountRoutes.use(bodyParser.json());
        accountRoutes.use(bodyParser.json({ type: 'application/vnd.api+json' }));
        accountRoutes.use(bodyParser.urlencoded({ extended: true }));
    });

    afterEach(function(done) {
        Account.remove({}, done);
    });

    afterAll(function(done) {
       mongoose.disconnect(done);
    });

    it('can register', function(done) {
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

    it('should be logged in after registration', function(done) {
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

    it('cannot register user twice', function(done) {
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
