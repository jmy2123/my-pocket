'use strict';
/* jshint node: true */

var request = require('request-promise');

var log = require('../utility/logger').logger('serve-health-check');
var send_notice = require('../utility/sendnotice');

require('dotenv').config();
var env = process.env;


healthCheck();

function healthCheck() {
  setInterval(function() {
  	request({url: env.HOST + '/serve-health-check',method : 'GET'}).then(function() {
      log.info('OK');
  	}).catch(function(err) {
  	  log.error('healthCheck() err:' + err);
  	  send_notice.sendMail(env.EMAIL_RECEIVE_USER, '服务掉线了', 'Hi judy,mypocket服务掉线了');
  	});
  }, 60000);
}