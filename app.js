var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var session = require('express-session')({
                  secret: 'keyboard cat',
                  resave: true,
                  saveUninitialized: true
                });

//MongoDB ODM
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds151070.mlab.com:51070/micro_referendum');


var index = require('./routes/index');

var app = express();

//Render engine
app.engine('html', require('ejs').renderFile)
app.set('views', './views');
app.set('view engine', 'html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

//Static files
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//Bootstrap
app.use('/bootjs', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/bootcss', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));

//JQuery
app.use('/jqjs', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

//Tether
app.use('/tetjs', express.static(path.join(__dirname, 'node_modules/tether/dist/js')));
app.use('/tetcss', express.static(path.join(__dirname, 'node_modules/tether/dist/css')));
//end of static files

//Express session
app.use(session);
//end of express session

//Passport init
app.use(passport.initialize());
app.use(passport.session());
// end of passport init

//Routers
app.use('/', index);
//end of routers
module.exports = app;
