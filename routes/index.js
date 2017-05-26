var express = require('express');
var router = express.Router();
var mrefctrl = require('../controllers/mref.server.controller.js');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
    return mrefctrl.renderHome(req, res);
});

router.get('/pollsList', function(req, res) {
    return mrefctrl.renderPollsList(req, res);
});

router.get('/addPoll', function(req, res) {
    if(!req.isAuthenticated()) {
        res.status(401).send();
    } else if(req.user.roleId == 3) {
        res.status(403).send();
    } else
        return mrefctrl.renderAddPoll(req, res);
});

router.post('/addPoll', function(req, res) {
    if(!req.isAuthenticated()) {
        res.status(401).send();
    } else if(req.user.roleId == 3) {
        res.status(403).send();
    } else
        return mrefctrl.addPoll(req, res);
});

router.post('/vote', function(req, res) {
    if(!req.isAuthenticated()) {
        res.status(401).send();
    } else {
        return mrefctrl.vote(req, res);
    }
});

router.get('/myPolls', function(req, res) {
    if(!req.isAuthenticated())
        res.status(401).send();
    else
        return mrefctrl.myVotes(req, res);
});

router.post('/register', function(req, res) {
    return mrefctrl.registerUser(req, res);
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.send('ok');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).send();
})

router.post('/getUser', function(req, res) {
    return mrefctrl.getUser(req, res);
});

router.post('/deletePoll', function(req, res) {
    if(!req.isAuthenticated()) {
        res.status(401).send();
    } else if(req.user.roleId != 1) {
        res.status(403).send();
    } else
        return mrefctrl.deletePoll(req, res);
})

module.exports = router;
