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


nconf.file('ultraresult.conf');

const database_name       = nconf.get('database:name');
const database_host       = nconf.get('database:host');
const database_port       = nconf.get('database:port');
const database_sslcafile  = nconf.get('database:sslcafile');
const database_sslkeyfile = nconf.get('database:sslkeyfile');
const database_authdb     = nconf.get('database:authdb');
const database_username   = nconf.get('database:username');
const database_password   = nconf.get('database:password');

const db_conn_uri = 'mongodb://' + database_host + ':' + database_port + '/' + database_name
      + '?tls=true&tlsCAFile=' + database_sslcafile + '&tlsCertificateKeyFile='
      + database_sslkeyfile + '&username=' + database_username + '&password='
      + database_password + '&authenticationDatabase=' + database_authdb;

console.log('database uri:  ' + db_conn_uri);

var db = monk(db_conn_uri, function(err, db) {
    if (err) {
	console.error("error: not connected to database:", err.message);
    } else {
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


var routes  = require('./routes/index');
var runners = require('./routes/runners');
var duv     = require('./routes/duv');

var app = express();
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/runners', runners);
app.use('/duv', duv);

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
	res.status(err.status || 500);
	res.render('error', {
	    message: err.message,
	    error: err
	});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
	message: err.message,
	error: {}
    });
});


module.exports = app;
