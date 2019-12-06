'use strict';
/* jshint node: true */

var { Wechaty, Room, Contact } = require('wechaty'); // import Wechaty from 'wechaty'
var QrcodeTerminal = require('qrcode-terminal');
var child_process = require('child_process');
var Mongoose = require('../models/mongoose');
var db = Mongoose();

var send_msg = require('./sendmsg');
var parse_msg = require('../utility/parseMsg');
var replay_msg = require('../utility/replayMsg');
var send_notice = require('../utility/sendnotice');
var log = require('../utility/logger').logger('mybot');

require('dotenv').config();
var env = process.env;

/*{profile: 'my-bot'}*/
var bot = Wechaty.instance();
var mybot = '';

bot
.on('scan', (url, code) => {
  log.info('inter scan...');

  if (!/201|200/.test(String(code))) {
    log.info("url1:" + url);
    send_notice.sendMail(env.EMAIL_RECEIVE_USER, '机器人登录通知1', 'Hi judy,mypocket机器人登录啦!' + url);
  	var loginUrl = url.replace(/\/qrcode\//, '/l/');
  	QrcodeTerminal.generate(loginUrl);
  } else {
    log.info("url2:" + url);
  	log.info(`Scan QR Code to login: ${code}\n${url}`);
    send_notice.sendMail(env.EMAIL_RECEIVE_USER, '机器人登录通知2', 'Hi judy,mypocket机器人登录啦!' + url);
  }
})
.on('login', user => {
  mybot = user;
  log.info(`User ${user} logined`);
  bot.say(new Date() + 'Wechaty login...');
})
.on('logout', user => {
  log.info(`User ${user} logouted`);
  // process.on('exit', function(code) {
  //   log.info('进程退出码是:', code);
  //   child_process.execFile('node', ['--harmony-async-await', './tools/mybot'], (error, stdout, stderr) => {
  //     if (error) {
  //       throw error;
  //     }
  //     console.log(stdout);
  //   });
  // });
  // process.exit();

  // 机器人掉线发送通知
  send_notice.sendMail(env.EMAIL_RECEIVE_USER, '机器人掉线通知', 'Hi judy,mypocket机器人掉线啦!');

  //process.on('exit', function(code) {
  //  log.info('进程退出码是:', code);
    //child_process.fork('./tools/mybot.js');
  //});
  //process.exit();
})
.on('error', e => {
  log.error(`Bot, error: %s, ${e}`);
  send_notice.sendMail(env.EMAIL_RECEIVE_USER, '机器人报错通知', 'Hi judy,mypocket机器人报错啦!');
})
.on('friend', async (contact, request) => {
  if (request) {
    var result = await request.accept();
    log.info(`Contact: ${contact.name()} send request`);
    if (result) {
      log.info('succeed');
    } else {
      log.error('failed');
    }
  }
})
.on('message',  m => {
  // const contact = m.from();
  // const content = m.content();

  if (m.self()) {
    return;
  }

  handleMessage(m);
})
.init();


// 定时通知
if (mybot) {
  send_msg.sendMsg(async function(err, article) {
    log.info('send_msg.sendMsg() article:' + article);
    log.info('send_msg.sendMsg() article.wechat_name:' + article[0].wechat_name);

    var name = article[0].wechat_name.split('_1')[0]; // TODO 昵称中有 "_1" 的情况 获取不到完整的昵称
    log.info('send_msg.sendMsg() name:' + name);
    var c = await Contact.find({name: name});
    c.say('The previous article saved successfully');
  });
}


/**
 * 处理消息
 * @param {Object} m 消息对象
 */
async function handleMessage(m) {
  var room = m.room();
  if (!room) {
    var contact = m.from();
    var msg = parse_msg(m);
    var name = contact.name();

    log.info('handleMessage() msg:' + JSON.stringify(msg));
    log.info('handleMessage() name:' + name);

    var _alias = contact.alias();
    if (_alias === null) {
      log.info('You have not yet set any alias for contact ' + contact.name());
    } else {
      log.info('You have already set an alias for contact ' + contact.name() + ':' + _alias);
    }

    if (!_alias) {
      log.info('handleMessage() set unique alias start...');
      var time = new Date();
      _alias = contact.name() + '_' + time.getTime();
      var ret = await contact.alias(_alias);
      if (ret) {
        console.log(`change ${contact.name()}.s alias successfully!`);
      } else {
        console.error(`failed to change ${contact.name()}.s alias!`);
      }
      log.info('handleMessage() get unique alias：' + _alias);
    } else {
      await contact.alias(_alias);
    }

    log.info('handleMessage() message alias:' + _alias);
    replay_msg(m, msg, _alias);
  }
}
