'use strict';
/* jshint node: true */

var log4js = require('log4js');
require('dotenv').config();
var env = process.env;

log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件保存
      filename: 'logs/access.log',
      maxLogSize:1024*100,
      backups:4 
    }
  ],
  replaceConsole: true 
});

var logInfo = log4js.getLogger("normal");

// log4js的输出级别6个: trace, debug, info, warn, error, fatal
exports.logger = function(name) {
  var logger = log4js.getLogger(name);
  if (env.NODE_ENV === 'development') {
    logger.setLevel('TRACE');
  } else {
    logger.setLevel('INFO');
  }
  
  return logger;
};

// 配合express用的方法
exports.use = function(app) {
  //页面请求日志, level用auto时,默认级别是WARN
  app.use(log4js.connectLogger(logInfo, { level: 'trace', format: ':method :url' }));
};
