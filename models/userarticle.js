'use strict';
/* jshint node: true */

var mongoose = require('mongoose');

var log = require('../utility/logger').logger('userarticle');

var Schema = mongoose.Schema;
var articleSchema = new Schema({
  wechat_name: String,
  article_url: String,
  state: String,
  number: Number,
  send_msg: Boolean,
  create_at: Date,
  update_at: Date
}, {
  timestamps: true
});

/**
 * Methods
 */
articleSchema.method({
  
});

/**
 * Statics
 */
articleSchema.statics = {
  /**
   * 向数据库保存一篇文章
   * @param {String} wechat_name 微信用户唯一标识
   * @param {String} article_url 文章链接
   */
  saveArticle(wechat_name, article_url, module, callback) {
    log.info('saveArticle inter...');
    // create a new user
    var article = new module({
      wechat_name : wechat_name,
      article_url : article_url,
      state : '-1',
      number : 0,
      send_msg : 0
    });
    
    // save the user
    article
      .save()
      .then(function(result) { 
        callback(null, result);
        log.info('saveArticle() result: ' + result);
        log.info('Userarticle created!');
      })
      .catch(err => {
        log.error('err:' + err);
        callback(err, null);
      });
  },
  
  /**
   * 通过id 查找文章 修改文章保存状态 和 number值
   * @param {String} wechat_name
   * @param {Function} callback 
   */
  updateArticle(article_id, callback) {
    log.info('updateArticleState inter...');
    var that = this;
  
    this.findArticle({_id: article_id}, function(err, article) {
      if (err) {
        log.error('updateArticle() err:' + err);
        callback(err, null);
        return;
      }
      var _num = parseInt(article[0].number + 1);
      that
      .update({_id: article_id}, {state: '1', number: _num}, {multi: true})
      .exec()
      .then((result) => {
        log.info('updateArticle() result:' + JSON.stringify(result) );
        callback(null, article);
      });
    });
  },
  
  /**
   * 从数据库中找出状态为-1 的文章
   */
  findArticleState(callback) { 
    log.info('findArticleByState() start...');
  
    this
      .find({ state: '-1' })
      .exec()
      .then(article => {
        log.info('findArticleState() article:' + article);
        callback(null, article);
      })
      .catch(err => {
        log.error('findArticleState() err:' + err);
        callback(err, null);
      });
  },
  
  /**
   * 找出send_msg状态为1 的文章 改为0
   * @param {Object} objcondation 查找条件
   * @param {Object} objupdate 修改字段
   */
  findBySendmsgAndUpdate (objcondation, objupdate, callback) {
    var that = this;
    this.findArticle(objcondation, function (err, article) {
      that
      .update(objcondation, objupdate, {multi: true})
      .exec()
      .then((result) => {
        log.info('findBySendmsgAndUpdate() result:' + JSON.stringify(result));
        callback(null, article);
      })
      .catch(err => {
        log.error('findBySendmsgAndUpdate() err:' + err);
        callback(err, null);
      });
    });
  },
  
  /**
   * 通过条件查询文章
   * @param {Object} condition 查找条件
   */
  findArticle(condition, callback) {
    log.info('findArticle() start...');
  
     this
      .find(condition)
      .exec()
      .then((article) => {
        log.info('findArticle() article:' + article);
  
        if (article.length === 0) {
          log.info('findArticle() there are no more article of send failed');
          return;
        }
        callback(null, article);
      })
      .catch(err => {
        log.error('findArticle() err:' + err);
        callback(err, err);
      });
  },

  /**
   * 获取文章数
   */
  getArticleNumber() {
    // return this.count().exec();
    return this.aggregate([  
      {$group: {  
        _id: "$createdAt",   
        pv: {$sum: 1}}  
      },  
      {$sort: {"_id": -1}}  
    ]).exec();
  }
};

module.exports = mongoose.model('Userarticle', articleSchema);
