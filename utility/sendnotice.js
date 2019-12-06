'use strict';
/* jshint node: true */

var nodemailer = require('nodemailer');
var log = require('../utility/logger').logger('sendmail');

require('dotenv').config();
var env = process.env;


module.exports = {sendMail: sendMails};


/**
 * @Description 邮件发送 
 * 调用方法:sendMail('123@qq.com','这是测试邮件', 'Hi judy,这是一封测试邮件');
 */
var smtpTransport = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
});

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
function sendMails(recipient, subject, html) {
  smtpTransport.sendMail({
    from: env.EMAIL_USER,
    to: recipient,
    subject: subject,
    html: html
  
  }, function (err, response) {
    if (err) {
      log.error('sendMails() err:' + err);
      return;
    }
    log.info('sendMails() from"' + env.EMAIL_USER + '"to"' + recipient +  '" subject is：' + subject + '的邮件发送成功');
  });
}
