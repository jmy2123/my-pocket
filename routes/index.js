'use strict';
/* jshint node: true */

var express = require('express');
var router = express.Router();

var Models = require('../models');
var Consumer = Models.consumer;
var Userarticle = Models.userarticle;

var log = require('../utility/logger').logger('index');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* 检测服务是否可用 */
router.get('/serve-health-check', (req, res) =>
  res.send('OK')
);

/* 数据统计路由 */
router.get('/record', function(req, res) {
  var consumberTotal = 0;
  var articleTotal = 0;
  var resultsConsumner = '';
  var resultsArticle = '';
  Consumer.getConsumerNumber().then(result => {
	  log.info('result:' + result);

    Models.getAllNumber(Consumer).then(count1 => {
      consumberTotal = count1;
      Models.getAllNumber(Userarticle).then(count2 => {
        articleTotal = count2;

        resultsConsumner = JSON.stringify(result);
  
        log.info('resultsConsumner:' + resultsConsumner);
    
        Userarticle.getArticleNumber().then(result => {
          
          resultsArticle = JSON.stringify(result);
  
          res.render('record', { titleConsumer: '用户数据统计', titleArticle: '文章数据统计', consumberTotal: consumberTotal, articleTotal: articleTotal, dataConsumer: resultsConsumner, dataArticle: resultsArticle});
        });
      });
    });
  
  });
});

module.exports = router;
