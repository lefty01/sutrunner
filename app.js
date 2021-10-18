const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongo = require('mongodb');
const monk = require('monk');
const mongoose = require('mongoose');
const assert = require('assert');
const fs = require('fs');
const nconf = require('nconf');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const debug_app = require('debug')('sutrunner:app');
const app = express();

nconf.file('ultraresult.conf');

const database_name       = nconf.get('database:name');
const database_host       = nconf.get('database:host');
const database_port       = nconf.get('database:port');
const database_sslcafile  = nconf.get('database:sslcafile');
const database_sslkeyfile = nconf.get('database:sslkeyfile');
const database_authdb     = nconf.get('database:authdb');
const database_username   = nconf.get('database:username');
const database_password   = nconf.get('database:password');

const session_secret = nconf.get('aidauth:session_secret');
const session_key    = nconf.get('aidauth:session_key');
const salt           = nconf.get('aidauth:salt');
app.set('aid_secret', process.env.UR_SESSION_SECRET || session_secret);
app.set('aid_key', process.env.UR_SESSION_KEY || session_key);
app.set('salty', process.env.UR_SALT || salt);

const db_conn_uri = 'mongodb://' + database_host + ':' + database_port + '/' + database_name +
      '?tls=true&tlsCAFile=' + database_sslcafile + '&tlsCertificateKeyFile=' +
      database_sslkeyfile + '&username=' + database_username + '&password=' +
      database_password + '&authenticationDatabase=' + database_authdb;

debug_app('database uri:  ' + db_conn_uri);
debug_app('session secret: ' + app.get('aid_secret') + ', key: ' + app.get('aid_key'));


const db = monk(db_conn_uri, function(err, db) {
    if (err) {
	console.error("error: not connected to database:", err.message);
    }
    else {
	console.log("connected to database");
    }
});

//var Schema = mongoose.Schema;
//var appSchema = new Schema({ .. });
//var maxYear = [currentYear-18, 'Invalid year `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'];
//var minYear = [1900, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'];
//(NAME FIRSTNAME YEAR CAT PLACE CLUB NAT EMAIL DUVID PHONE MONEY TSIZE SLEEP PACER WAITLIST);
// todo: currently unused!!!
var runnerSchema = mongoose.Schema({
    startnum: Number,
    lastname: String,
    firstname: String,
    duvid: Number,
    year: Number,
    birthday: Date,
    category: String,
    place: String,
    club: String,
    nationality: String,
    residence: String,
    mobile: String,
    phone: String,
    email: String,
    flags: {
	tsize:    String,
        tsizeS:   { type: Boolean, default: false },
        tsizeM:   { type: Boolean, default: false },
        tsizeL:   { type: Boolean, default: false },
        tsizeXL:  { type: Boolean, default: false },
	paid:     { type: Boolean, default: false },
	sleep:    { type: Boolean, default: false },
	pacer:    { type: Boolean, default: false },
	waitlist: { type: Boolean, default: false }
    },
    sendsms:  { type: Boolean, default: false },
    lastSeen: {type: Date, default: Date.now}
});


const routes  = require('./routes/index');
const runners = require('./routes/runners');
const duv     = require('./routes/duv');

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src-elem": ["'self'", "https://cdn.jsdelivr.net", "https://maxcdn.bootstrapcdn.com", "https://code.jquery.com"],
      "style-src":       ["'self'", "https://cdn.jsdelivr.net", "https://maxcdn.bootstrapcdn.com"],
    },
  })
);


app.use(cors());
app.use(morgan('combined'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    key: app.get('aid_key'),
    secret: app.get('aid_secret'),
    resave: false,
    saveUninitialized: false,
    name: 'sutrunner_session',
    cookie: {
	maxAge: 172800000, // 48h
	sameSite: 'strict'
    }
}));


// Make our db accessible to our router
app.use(function(req, res, next) {
    req.db = db;
    next();
});


app.post('/auth', (req, res, next) => {
    var db = req.db;
    var collection = db.get('users');
    var reUser = /^\w{2,32}$/;
    var rePass = /^.{4,32}$/;
    var user = '';
    var pass = '';
    var hash = '';

    if (reUser.test(req.body.username)) {
	user = req.body.username;
    }
    if (rePass.test(req.body.password)) {
	pass = req.body.password;
    }

    // lookup user
    collection.findOne({user: user}).then((doc) => {
	if (doc === null)
	    return res.sendStatus(401);

	//debug_app('compare pass: ' + pass + ' with hash: ' + doc.pass);
	if (bcrypt.compareSync(pass, doc.pass)) {
	    if ('admin' === doc.user) {
		req.session.isAdmin = true;
	    }
	    debug_app("OK ... authenticated!");
	    next();
	}
	else {
	    return res.sendStatus(401);
	}
    });

}, (req, res) => {
    req.session.loggedIn = true;

    if (true === req.session.isAdmin)
	debug_app('admin session:');
    debug_app(req.session);

    //aid_url = req.session.aidurl || '/';
    //debug_app("auth aid_url: " + aid_url);

    return res.redirect('/');
});

app.get('/login', (req, res) => {
    if (req.session.loggedIn) {
	return res.send('already logged in!');
    }
    return res.render('login');
});


app.get('/logout',(req,res) => {
    req.session.destroy((err) => {});
    return res.redirect('/');
});


// app.use(function(req, res, next) {
//     if (req.session.loggedIn && req.session.isAdmin) {
// 	debug_app('admin is logged in');
// 	next();
//     }
//     return res.render('login');
// });


app.use('/',        routes);
app.use('/runners', runners);
app.use('/duv',     duv);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
	//res.status(err.status || 500);
	return res.render('error', {
	    message: err.message,
	    error: err
	});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    //res.status(err.status || 500);
    return res.render('error', {
	message: err.message,
	error: {}
    });
});


module.exports = app;
