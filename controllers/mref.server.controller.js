var model = require('../models/mref.server.model.js')

exports.renderHome = function(req, res) {
    res.render('home');
};

exports.renderPollsList = function(req, res) {
    res.render('pollsList');
};

exports.renderAddPoll = function(req, res) {
    res.render('addPoll');
};
