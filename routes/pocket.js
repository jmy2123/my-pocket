'use strict';
/* jshint node: true */

var express = require('express');
var router = express.Router();
var async = require('async');

var pocket = require('../utility/pocket');
var Models = require('../models');
var Consumer = Models.consumer;
var consumer = new Consumer();

var log = require('../utility/logger').logger('routes/pocket');

require('dotenv').config();
var env = process.env;

/* 授权 */
router.get('/isauthorize', function(req, res, next) {
  log.info('wechat_name:' + req.query.wechat_name);

  var wechat_name = req.query.wechat_name;
  pocket.getCode(function(err, code) {
  	log.info('/isauthorize callback() start...');

    if (!err) {
      log.info('pocket.getCode() code:' + code + '/req.query.wechat_name:' + wechat_name);
      if (wechat_name) {
        pocket.redirectUrl(res, code, wechat_name);
      }
    } else {
      log.error('/isauthorize err:' + err);
      return next(err);
    }
  });
});

/* 完成授权 */
router.get('/authorizefinish', function(req, res, next) {
  log.info('req:' + JSON.stringify(req.query));

  var name = req.query.name;
  var ind= name && name.indexOf('*');

  if(ind) {
    var request_token = name.slice(0, ind); 
    var wechat_name = name.slice(ind+1);
    log.info('/authorizefinish request_token=' + request_token + 'wechat_name=' + wechat_name);
  }
  
  async.waterfall([
    function (cb) {
      // 获取token
      pocket.getAccessToken(request_token, function(err, token, username) {
        log.info('pocket.getaccesstoken() callback() start...');
        cb(err, token, username);
      });
    },
    function (token, username, cb) {
      // 判断是否绑定
      Consumer.findConsumer(wechat_name).then(data => {
        log.info('data:' + data + '／token:' + token);
        if (data !== null && data.access_token === token ) {
          log.info('Consumer.findConsumer() callback===...');
          // 跳转到绑定成功页面
          res.render('authorizefinish', { title: 'success', text: '成功' });
          return;
        }
        if (data !== null && data.access_token !== token ) {
          log.info('Consumer.findConsumer() callback!==...');
          // 修改数据库中用户access_token字段
          var obj1 = {wechat_name: wechat_name};
          var obj2 = {access_token: token};
          Models.findAndUpdate(Consumer, obj1, obj2)
                .then(function() {
                  log.info('Models.findAndUpdate() callback() start...');
                  res.render('authorizefinish', { title: 'success', text: '成功' });
                });
          return;
        }
        cb(null, token, username);
      });
    },
    function (token, username, cb) {
      // 把pocket账号和微信账号存入数据库
      consumer.bindConsumer(wechat_name, username, token).then(consumer => {
        log.info('consumer.bindConsumer() callback() start...');
        // 跳转到绑定成功页面
        res.render('authorizefinish', { title: 'success', text: '成功' });
      });
      cb(null);
    }
    ], function (err, result) {
        if (err) {
          log.error('err:' + err);
          res.render('authorizefinish', { title: 'failed', text: '失败' });
        } else {
          log.info('success result:' + result);
        }
    });
});

module.exports = router;
