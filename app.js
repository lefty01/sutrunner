var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
var mongoose = require('mongoose');
var assert = require('assert');

//var db = monk('localhost:27017/sutrunners1');

var db = monk('localhost:9999/sutrunners1');
// this requires ssh port forwarding ...
// ssh -fN -l user  -L 9999:localhost:54321 server.com


// FIXME check if connected ... but how -> db object? or switch to mongoose already
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server.");
//   db.close();
// });

// could do this ... or like below without the Schema var.
//var Schema = mongoose.Schema;
//var appSchema = new Schema({ .. });

//var maxYear = [currentYear-18, 'Invalid year `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'];
//var minYear = [1900, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'];


//(NAME FIRSTNAME YEAR CAT PLACE CLUB NAT EMAIL DUVID PHONE MONEY TSIZE SLEEP PACER WAITLIST);
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


var routes = require('./routes/index');
var runners = require('./routes/runners');
var duv = require('./routes/duv');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


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
