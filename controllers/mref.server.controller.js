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

exports.addPoll = function(req, res) {
    var poll = {};
    poll.title = req.body.title;
    poll.desc = req.body.desc;
    poll.endDate = req.body.endDate;
    poll.category = req.body.category;
    poll.county = req.body.county;

    // debug
    console.log(poll);

    if(validatePoll(poll)) {
        addPollToDb(poll);
    } else {
        console.log('Invalid poll: \n' + poll)
    }

    res.send('ok');
};

function validatePoll() {
    return true;
}

function addPollToDb(poll){

}
