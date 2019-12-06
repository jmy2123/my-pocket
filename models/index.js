'use strict';
/* jshint node: true */

var mongoose = require('mongoose');

var log = require('../utility/logger').logger('models.index');

require('./consumer');
require('./userarticle');

exports.consumer = mongoose.model('Consumer');
exports.userarticle = mongoose.model('Userarticle');
exports.findAndUpdate = findAndUpdate;
exports.getAllNumber = getAllNumber;

/**
 * 查找并更新
 * @param {Object} module 表对应模型
 * @param {Object} objcondation 查找调节
 * @param {Object} objupdate 更新字段
 */
function findAndUpdate (module, objcondation, objupdate) {
  return module
          .update(objcondation, objupdate, {multi: true})
          .exec();
}

/**
 * 获取数据总数
 * @param {Object} module 表对应模型
 */
function getAllNumber (module) {
  return module.count().exec();
}