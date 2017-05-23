var express = require('express');
var router = express.Router();
var mrefctrl = require('../controllers/mref.server.controller.js');

/* GET home page. */
router.get('/', function(req, res) {
    return mrefctrl.renderHome(req, res);
});

router.get('/pollsList', function(req, res) {
    return mrefctrl.renderPollsList(req, res);
});

router.get('/addPoll', function(req, res) {
    return mrefctrl.renderAddPoll(req, res);
});

router.post('/register', function(req, res) {
    return mrefctrl.registerUser(req, res);
});

router.post('/login', function(req, res) {
	return res.send('ok');
});

router.post('/addPoll', function(req, res) {
    return mrefctrl.addPoll(req, res);
});

module.exports = router;
