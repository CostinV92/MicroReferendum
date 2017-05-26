var model = require('../models/mref.server.model.js');
var bcrypt = require('bcrypt');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

exports.renderHome = function(req, res) {
    res.render('home');
};

exports.renderPollsList = function(req, res) {
    var region = req.query.id;
    if(typeof region == 'undefined') {
        res.render('pollsList');
        return;
    }

    model.Referendum.find({'region': region}, function(err, polls) {
        if(err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.json(polls);
        }
    });
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
        addPollToDb(poll, req.user._id);
    } else {
        res.status(400).send();
        console.log('Invalid poll: \n' + JSON.stringify(poll));
        return;
    }

    res.send('ok');
};

exports.deletePoll = function(req, res) {
    model.Referendum.remove({ _id: req.body._id }, function(err) {
        if(err)
            console.log(err);
    });
}

exports.vote = function(req, res) {
    var user = req.user;
    var pollId = req.body.poll_id;

    model.User.findById({ _id: user._id }, function(err, user) {
        if(!err) {
            // check if allready voted
            for(it = 0; it < user.votedOn.length; it++) {
                if (user.votedOn[it] == pollId)
                    return;
            }

            model.Referendum.findById({ _id: pollId }, function(err, poll) {
                if(!err) {
                    if(req.body.vote == '1')
                        poll.yesVotes++;
                    else
                        poll.noVotes++;

                    poll.save();
                }
            });

            user.votedOn.push(pollId);
            user.save();
        }
    });

    res.status(200).send();
}

exports.myPolls = function(req, res) {
    res.render('myPolls');
}

exports.getMyPolls = function(req, res) {
    var user = req.user;

    model.Referendum.find({ createdBy: user._id }, function(err, polls) {
        if(!err)
            res.json(polls);
    });
}

exports.registerUser = function(req, res) {
    if(validateUser(req)) {
        res.render('home');
    } else {
        res.status(400).send();
        console.log('Tried to register invalid user!');
    }
}

exports.getUser = function(req, res) {
    if(req.isAuthenticated()) {
        model.User.findById(req.user._id, function(err, user) {
            res.json(user);
        });
    } else {
        res.send('undefined');
    }
}

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

function validateUser(req) {
    // Validate input
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('cnp', 'Cnp is required').notEmpty().isInt();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('userName', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('roleId', 'RoleId is required').notEmpty();

    var errors = req.validationErrors();

    if(errors) {
        console.log(errors);
        return false;
    }

    //Check if user exists
    model.User.find({'firstName': req.body.firstName, 'lastName': req.body.lastName}, function(err, users) {
        if(users.length != 0) {
            console.log('Allready registered! 1');
            return;
        }

        model.User.find({'userName': req.body.userName}, function(err, users) {
            if(users.length != 0) {
                console.log('Allready registered! 2');
                return;
            }
            addUserToDb(req);
        });
    });

    return true;
}

function getPollsByCounty(id, res) {
    model.Referendum.find({'region': id}, function(err, polls) {
        if(err)
            console.log(err);
        else
            res.json(polls);
    });
}

function addPollToDb(poll, userId) {
    Poll = new model.Referendum();
    Poll.subject = poll.title;
    Poll.tags = poll.category;
    Poll.region = poll.county;
    Poll.startDate = new Date();
    Poll.endDate = new Date(poll.endDate);
    Poll.description = poll.desc;
    Poll.public = true;
    Poll.createdBy = userId;

    Poll.save(function(err, poll){
        if(!err)
            model.User.findById(userId, function(err, user){
                if(!err) {
                    user.referendums.push(poll._id);
                    user.save();
                }

            });
    });
}

function addUserToDb(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var cnp = req.body.cnp;
    var email = req.body.email;
    var userName = req.body.userName;
    var password = req.body.password;
    var roleId = req.body.roleId;

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash) {
            password = hash;

            var newUser = new model.User({
                firstName: firstName,
                lastName: lastName,
                cnp: cnp,
                email: email,
                userName: userName,
                password: password,
                roleId: roleId
            });

            newUser.save();
        });
    });
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  model.User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(
    function(username, password, done) {
        model.User.findOne({ userName: username }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            validPassword(password, user.password, function(isMatch) {
                if(isMatch) {
                    return done(null, user);
                }

                return done(null, false, { message: 'Incorrect password.' });
            })
        });
    }
));

function validPassword(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMatch) {
        if(!err)
            callback(isMatch);
    });
}