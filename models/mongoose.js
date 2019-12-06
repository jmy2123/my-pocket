'use strict';
/* jshint node: true */

var mongoose = require('mongoose');
var log = require('../utility/logger').logger('mongoose');

require('dotenv').config();
var env = process.env;

module.exports = function() {
  mongoose.Promise = require('bluebird');
  let mongodb_uri = `mongodb://${env.MONGO_DB_USER}:${env.MONGO_DB_PWD}@${env.MONGO_DB_HOSTS}/${env.MONGO_DB_DATABASE}`;
  let db = mongoose.connect(mongodb_uri, function(err) {
  	if (err) {
  	  log.error('connection error:', err);
  	} else {
  	  log.info('connection successful');
      log.debug('mongodb_uri:' + mongodb_uri);
  	}
  });
  return db;
};
