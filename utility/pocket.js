'use strict';
/* jshint node: true */

var request = require('request-promise');
var log = require('./logger').logger('utility/pocket');

require('dotenv').config();
var env = process.env;

var request_code = '';
const HEADER = {
      'User-Agent': 'Request-Promise',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    };
const PATH = 'https://getpocket.com';

module.exports = {
  getCode: getCode,
  redirectUrl: redirectUrl,
  getAccessToken: getAccessToken,
  saveArticeToPocket: saveArticeToPocket
};

function request_post(uri, form) {
  var options = {
    method: 'POST',
    uri: PATH + uri,
    headers: HEADER,
    form: form
  };
  return request(options);
}



/**
 * 获取请求令牌 request_token
 * @param {Function} callback
 */
function getCode(callback) {
  var uri = '/v3/oauth/request';
  var form = {
       "consumer_key": env.CONSUMER_KEY,
       "redirect_uri": env.HOST + "/authorizefinish"
    };
  request_post(uri, form)
    .then(function(data) {
      // POST succeeded...
      log.info('getCode() data:' + data);

      var request_data = JSON.parse(data);
      request_code = request_data.code;
      log.info('getCode() request_code:' + request_code);
      
      callback(null, request_code);
    })
    .catch(function(err) {
      // POST failed...
      log.error('getCode() err:' + err);

      callback(err, null);
    });
}

/**
 * 将用户重定向到Pocket以继续授权
 */
function redirectUrl(res, code, wechat_name) {
  log.debug('redirectUrl() start...');
  res.redirect(`${PATH}/auth/authorize?request_token=${code}&redirect_uri=${env.HOST}/pocket/authorizefinish?name=${code}*${wechat_name}`);
}


/**
 * 将请求令牌转换为Pocket访问令牌
 * @param {String} request_code 获取请求令牌
 * @param {Function} callback
 */
function getAccessToken(request_code, callback) {
  var uri = '/v3/oauth/authorize';
  var form = {
      "consumer_key": env.CONSUMER_KEY,
      "code": request_code
    };
  request_post(uri, form)
    .then(function(data) {
      // POST succeeded...
      log.info('getAccessToken() data:' + data);

      var request_data = JSON.parse(data);
      var access_token = request_data.access_token;
      var username = request_data.username;
      log.info('getAccessToken() access_token:' + access_token + 'username:' + username);

      callback(null, access_token, username);
    })
    .catch(function(err) {
      // POST failed...
      log.error('getAccessToken() err:' + err);

      callback(err, null);
    });
}

/**
 * 保存文章到Pocket
 * @param {String} token
 * @param {String} article_url 
 * @param {Function} callback
 */
function saveArticeToPocket(token, article_url, callback) {
  var uri = '/v3/add';
  var form = {
      "url": article_url,
      "title": "",
      "time": (new Date()).getTime(),
      "consumer_key": env.CONSUMER_KEY,
      "access_token": token
    };
  request_post(uri, form)
    .then(function(data) {
      // POST succeeded...
      log.info('saveArticeToPocket() data:' + data);

      callback(null, data);
    })
    .catch(function(err) {
      // POST failed...
      log.error('saveArticeToPocket() err:' + err);

      callback(err, null);
    });
}





