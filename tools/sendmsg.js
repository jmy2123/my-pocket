'use strict';
/* jshint node: true */

/* 定时通知用户 未保存成功的文章已经发送成功*/

var schedule = require('node-schedule');
var Models = require('../models');
var Userarticle = Models.userarticle;

var log = require('../utility/logger').logger('sendmsg');


module.exports = {sendMsg: sendMsg};

function sendMsg(callback) {
  schedule.scheduleJob('30 1 1 * * *', function() {
    // 获取所有send_msg为true的文章
    var obj1 = {send_msg: 1};
    var obj2 = {send_msg: 0};
    Userarticle.findBySendmsgAndUpdate(obj1, obj2, function(err, article) {
      if (err) {
      	callback(err, null);
      	return;
      }
      log.info('sendMsg() article:' + article);
      callback(null, article);
    });
  });	
}

// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'