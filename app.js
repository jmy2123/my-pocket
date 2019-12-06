'use strict';
/* jshint node: true */

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Raven = require('raven');

var index = require('./routes/index');
var pocket = require('./routes/pocket');
var logger = require('./utility/logger');
var log = logger.logger('app');

require('dotenv').config();
var env = process.env;

var app = express();
if (env.NODE_ENV !== 'development') {
  Raven.config(env.SENTRY_DNS).install();
  app.use(Raven.requestHandler());
}
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


logger.use(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/pocket', pocket);

app.use(Raven.errorHandler());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
