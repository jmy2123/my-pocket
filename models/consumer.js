'use strict';
/* jshint node: true */

var Promise = require('bluebird');
var mongoose = require('mongoose');

var log = require('../utility/logger').logger('consumer');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  wechat_name: String,
  pocket_name: String,
  access_token: String,
  create_at: Date,
  update_at: Date
}, {
  timestamps: true
});

/**
 * Methods
 */
userSchema.method({
  /**
   * 绑定一个用户
   * @param {String} wechat_name 微信用户唯一标识
   * @param {String} pocket_name pocket用户唯一标识
   */
  bindConsumer(wechat_name, pocket_name, access_token, callback) {
    log.info('bindConsumer() start...');
    // create a new user
    this.wechat_name = wechat_name;
    this.pocket_name = pocket_name;
    this.access_token = access_token;
    // save the user
    return this.save();
  }
});

/**
 * Statics
 */
userSchema.statics = {
  /**
   * 查找用户
   * @param {String} wechat_name 微信用户唯一标识 
   */
  findConsumer(wechat_name) {
    log.info('findConsumer() wechat_name:' + wechat_name);
  
    if (!wechat_name) {
      log.info('findconsumer() wechat_name is null');
      Promise.reject(new Error('wechat_name is null'));
      return;
    }
    
    var query = this.where({ wechat_name: wechat_name});
    return query.findOne()
                .exec();
  },

  /**
   * 获取用户数
   */
  getConsumerNumber() {
    // return this.count().exec();
    return this.aggregate([  
      {$group: {  
        _id: "$createdAt",   
        uv: {$sum: 1}}  
      },  
      {$sort: {"_id": -1}}  
    ]).exec();
  }
};



mongoose.model('Consumer', userSchema);
