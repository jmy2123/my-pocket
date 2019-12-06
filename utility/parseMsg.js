'use strict';
/* jshint node: true */

var log = require('./logger').logger('parseMsg');

module.exports = parseMsg;

const APP = 49;
const TEXT = 1;

/**
 * 解析message
 * @param  {Object} msg 用户发送的消息对象
 * @return {Object} message 
 */
function parseMsg(msg) {
  const contact = msg.from();
  const content = msg.content();
  const room = msg.room();
  let message = {
  	type: 'other',
    text: '其他'
  };

  if (room) {
  	log.debug(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`);
  } else {
  	log.debug(`Contact: ${contact.name()}: ${content}`);
    log.debug('typeApp():' + msg.typeApp());

  	if (msg.type() === APP) {
      let url = msg.get('url');
      Object.assign(message, {
        type: 'app',
        text: url
      });
    } else if (msg.type() === TEXT) {
      log.info('msg.type() is 1');

      var reg = new RegExp("(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]");
      if (reg.test(content)) {
        log.debug('content is url');

        var urlText = content.split('">')[1];
        urlText = urlText.split('</a>')[0] + (urlText.split('</a>')[1]);
        Object.assign(message, {
          type: 'url',
          text: urlText
        });
      } else {
        Object.assign(message, {
          type: 'text',
          text: content
        });
      }
    } else {
      Object.assign(message, {
        type: 'other',
        text: '其他'
      });
    }
  }
  
  return message;
}