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
        addPollToDb(poll, res);
    } else {
        res.status(400).send();
        console.log('Invalid poll: \n' + JSON.stringify(poll));
        return;
    }

    res.send('ok');
};

function validatePoll(poll) {
    if(!poll.title
        || !poll.desc
            || !poll.endDate
                || poll.category.length == 0
                    || poll.county.length == 0) {
        return false
    }

    return true;
}

function addPollToDb(poll, res){
    Poll = new model.Referendum();
    Poll.subject = poll.title;
    Poll.tags = poll.category;
    Poll.region = poll.county;
    Poll.startDate = new Date();
    Poll.endDate = new Date(poll.endDate);
    Poll.description = poll.desc;
    Poll.public = true;
    
    Poll.save();
}
