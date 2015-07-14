/*jslint node:true */
"use strict";

var account = require('./account_routes');
var game = require('./game_api');

module.exports = function(app) {

    // server routes ===========================================================

    // all account routes - register, login, logout etc.
    app.use('/api', account.init());
    app.get('/api/account/:user?',
            account.ensureAuthentication,
            // inject username from path, query, param and username
            function (req, res, next) {
                if (!req.body.username) {
                    if (req.query.username) { req.body.username = req.query.username; }
                    else if (req.params.user) { req.body.username = req.params.user; }
                    else if (req.user) {
                        res.redirect('/api/account/' + req.user.username);
                        return;
                    }
                }
                next();
            },
            account.getUserInfo);
    app.post('/api/account', account.register);
    app.post('/api/login', account.login);
    app.get('/api/logged', account.loginStatus);
    app.post('/api/logout', account.logout);

    // apis which require authentication to be viewed
    app.all('/api/player', account.ensureAuthentication);
    app.post('/api/game', account.ensureAuthentication);
    app.put('/api/game', account.ensureAuthentication);
    app.delete('/api/game', account.ensureAuthentication);

    // other routes
    app.use('/api/game', game.app);

    // frontend routes =========================================================

    // route to handle all angular requests
    app.get('*', function(req, res) {
        // load public/index.html file
        res.sendFile(global.rootPath + '/public/views/index.html');
    });

};
