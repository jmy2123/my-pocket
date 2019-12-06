'use strict';
/* jshint node: true */

var async = require('async');

var Models = require('../models');
var Consumber = Models.consumer;
var Userarticle = Models.userarticle;

var pocket = require('../utility/pocket');
var log = require('./logger').logger('replayMsg');

require('dotenv').config();
var env = process.env;

module.exports = replayMsg;

var handler = {
  app: function (m, text, username) {
    handleUrl(m, text, username);
  },
  url: function (m, text, username) {
    handleUrl(m, text, username);
  },
  text: function (m, text, username) {
    log.info('text() start...');
    if (text === 'H' || text === 'h' || text === '？' || text === '?') {
      log.debug('text is "H/h/?/？"');
      // m.say('使用帮助：1.打开您需要保存的文章，点击右上角的“...”按钮 2.在弹出的窗口中点击“分享给朋友” 3.收到“保存成功”字样说明文章已成功保存到Pocket');
      m.say('使用帮助：1.绑定Pocket账号 2.绑定成功后分享您需要保存的文章给我 3.收到“真棒，保存成功！”字样后说明文章已成功保存到Pocket //////常见问题：如果文章发送后无响应，可能是国内访问Pocket速度比较慢，请重新发送；如果多次重试不行，可能是绑定账号授权失效，请重新发送“a”绑定Pocket账号；如果还是不行，可能是机器人服务问题，我们会尽快修复，望谅解~');
    } else if (text === 'a') {
      log.debug('text is "a"');
      m.say('点击链接绑定账号啦~绑定成功后就放心把文章分享给我吧~' + encodeURI(env.HOST + '/pocket/isauthorize?wechat_name=' + username));
    } else {
      log.debug('text is other');
      Consumber.findConsumer(username).then((data) => {
        if (!data) {
          log.info('text() findConsumer() null');
          m.say('点击链接绑定账号啦~绑定成功后就放心把文章分享给我吧~' + encodeURI(env.HOST + '/pocket/isauthorize?wechat_name=' + username));
        }
        if (data) {
          log.info('text() findConsumer() ok');
          m.say('哈喽，分享一篇文章给我吧~');
        }
      });
    }
  },
  other: function (m, text, username) {
    log.info('text:' + text);
    log.info('username:' + username);
    // m.say('绑定账号啦~' + env.HOST + '?wechat_name=' + username);
    m.say('欢迎来到“savePocket”, 回复“a”绑定Pocket账号。回复“h”或“?”获取帮助。');
  }
};


/**
 * 处理文章／url
 * @param {Object} m 消息对象
 * @param {String} text url
 * @param {String} username 唯一标识
 */
function handleUrl(m, text, username) {
  //return text;
  async.waterfall([
    function (cb) {
      // 查找用户
      Consumber.findConsumer(username).then((data) => {
        log.debug('findConsumer() data:' + data);
        if (!data) {
          log.info('findConsumer() null');
          m.say('点击链接绑定账号啦~绑定成功后就放心把文章分享给我吧~' + encodeURI(env.HOST + '/pocket/isauthorize?wechat_name=' + username));
          return;
        }
        cb(null, data);
      });
    },
    function (data, cb) {
      log.debug('data:' + data);
      // 保存文章
      Userarticle.saveArticle(username, text, Userarticle, function(err, result) {
        log.debug('Userarticle.saveArticle() result:' + result);
        cb(err, data, result);
      });
    },
    function (data, result, cb) {
      // 保存文章到pocket
      pocket.saveArticeToPocket(data.access_token, text, function(err) {
        m.say('真棒，保存成功！');
        cb(err, result);
      });
    },
    function (result, cb) {
      // 更新文章保存状态
      Userarticle.updateArticle(result._id, function(err, data) {
        if (err) {
          log.error('Userarticle.updateArticle() 更新失败~');
        } else {
          log.info('Userarticle.updateArticle() 更新成功~');
        }
        cb(err, data);
      });
    }
    ], function (err, result) {
        if (err) {
          log.error('err:' + err);
        } else {
          log.info('success result:' + result);
        }
    });
}


/**
 * @param {Object} m 消息对象
 * @param {String} msg 解析后的消息对象
 * @param {String} username 
 */
function replayMsg(m, msg, username) {
  log.info('msg:' + msg);
  log.info('username:' + username);

  var handlerFun = handler[msg.type];
  handlerFun(m, msg.text, username);
}	