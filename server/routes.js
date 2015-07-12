/*jslint node:true */
"use strict";

var account = require('./account_routes');
var game = require('./game_api');

module.exports = function(app) {

    // server routes ===========================================================

    // all account routes - register, login, logout etc.
    app.use('/api/account', account.app);

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
