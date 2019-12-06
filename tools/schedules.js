'use strict';
/* jshint node: true */

/* 定时处理未保存成的文章*/

var schedule = require('node-schedule');
var async = require('async');

var pocket = require('../utility/pocket');
var Models = require('../models');
var Consumer = Models.consumer;
var Userarticle = Models.userarticle;

var log = require('../utility/logger').logger('schedule');

var Mongoose = require('../models/mongoose'); 
var db = Mongoose();


scheduleSaveArticle();


function scheduleSaveArticle () {
  schedule.scheduleJob('30 1 * * * *', function() {
    async.waterfall([
      function (cb) {
        return Userarticle.findArticleState(cb);
      },
      function (data) {
        return saveArticleToDB(data);
      }
      ], function (err, result) {
      if (err) {
        log.error('scheduleSaveArticle() err:' + err);
      } else {
        log.info('scheduleSaveArticle() success...');
      }
    });
  });
}

function saveArticleToDB (data) {
  log.info('saveArticleToDB() start...');
  async.eachSeries(data, function (item, callback) { 
    saveArticleToP(item, function() {
      callback();
    });
  });
}

function saveArticleToP(item, callback) {
  log.info('saveArticleToP() start...');
  async.waterfall([
    function (cb) {
      log.info('item:' + item);
      return Consumer.findConsumer(item.wechat_name).then(result => {
        log.info('result:' + result);
        cb(null, result);
      });
    },
    function (consumer, cb) {
      log.info('saveArticleToP() consumer:' + consumer);
      return pocket.saveArticeToPocket(consumer.access_token, item.article_url, cb);
    },
    function (data1, cb) {
      log.info('saveArticleToP() article_url:' + item.article_url);
      return Userarticle.updateArticle(item._id, function (err, data) {
        if (err) {
          log.error('更新失败~');
          cb(err, null);
        } else {
          log.info('更新成功~');
          cb(null, data);
        } 
      });
    }
    ],
    function(err, result) {
      if (err) {
        log.error('saveArticleToP() err:' + err);
        callback(err, null);
      } else {
        log.info('saveArticleToP() success...');
        callback(null, result);
      }
  });
}
