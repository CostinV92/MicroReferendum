var express = require('express');
var router = express.Router();
var mrefctrl = require('../controllers/mref.server.controller.js');

/* GET home page. */
router.get('/', function(req, res) {
    return mrefctrl.home(req, res);
});

router.get('/pollsList', function(req, res) {
    return mrefctrl.pollsList(req, res);
});

router.post('/login', function(req, res) {
	return res.send('ok');
});

router.get('/addPoll', function(req, res) {
    return mrefctrl.addPoll(req, res);
});

module.exports = router;
