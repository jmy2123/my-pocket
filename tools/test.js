'use strict';
/* jshint node: true */

/* 测试*/

var Mongoose = require('../models/mongoose'); 
var db = Mongoose();

var pocket = require('../utility/pocket');
var Models = require('../models');
var Consumer = Models.consumer;
var Userarticle = Models.userarticle;
var consumer = new Consumer();
var userarticle = new Userarticle();

var sendMsg = require('./sendMsg');
var log = require('../utility/logger').logger('test');

require('dotenv').config();
var env = process.env;


/**
 * 数据库保存失败的文章处理办法
 */
function saveArticleTo(wechat_name, access_token, url) {
  Userarticle.saveArticle(wechat_name, url, Userarticle, function(err1, data1) {
  	log.info('data1:' + data1);
  	pocket.saveArticeToPocket(access_token, url, function(err2, data2) {
  	  log.info('data2:' + data2);
  	});
  });
}
// 肖云丹_1496241231042
// saveArticleTo('Yuancheng_1495884998490', '19bf6bfd-6820-74b3-2a57-ba59a1', 'https://mp.weixin.qq.com/s?__biz=MzIwMDgxMzc3OQ==&mid=2247488484&idx=1&sn=12e9ccf67c950487b6fca1bd4e8dbf84&chksm=96f62e58a181a74e236329fc9701f9a30d6aa153b3ad44cc7b02960ce219b1f32ea0ad033bea&scene=0&key=4ad62f60730b4051f113022d9735b9b75945625a48d3a85977b1bec57056a8a8af8e0c57d6a1306839e7725a19d60a542bca7e8d97994ffda73624107404cc07da83de2eda237e73b894a7ec8ceb0883&ascene=0&uin=MTYzMTY1NjMyMg%3D%3D&devicetype=iMac+MacBookPro11%2C4+OSX+OSX+10.12.3+build(16D32)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=ZM%2BCRrPNq2kNDQGKXuMskTc3rHY3qL0A7Bkjy89H0%2FdBH1GoSJRc2YTp8b0K3RMU');
// saveArticleTo('刘炯_1497275206288', '33b7ab71-2a1c-a9e4-7c5a-6f7e8e', 'https://m.huxiu.com/article/199614.html');
// saveArticleTo('肖云丹_1496241231042', 'c7b9b103-abf3-02c9-57e0-f1fd71', 'https://mp.weixin.qq.com/s?__biz=MjM5ODM3MzU4Mg==&mid=2653062305&idx=1&sn=bd01622265e6671916d54541986ea141&chksm=bd1d95008a6a1c16af7d2a692b824c4b7822efaa0cfe7d7c3eff0a4120ca2c220b89674053df&mpshare=1&scene=1&srcid=0728HiB2rzrbcY8iVpLm7gAR&key=3d8efa8bcd6863c38164b3bbcc37fbb408a421053bd691471e20bfe6309c49db305e86b5fa11f971b5bd5c1c5158ade6ffb4825543b5ae71a12e1c05f4d0f43a21e8ce65e59b846751664b30fdb54c05&ascene=0&uin=MTYzMTY1NjMyMg%3D%3D&devicetype=iMac+MacBookPro11%2C4+OSX+OSX+10.12.3+build(16D32)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=euRsbDEBynNMwlm%2F5u5XA910TMX9irug9FcX6xzD8T93KqoLksY1F8tqUHW2%2B8f8')
// saveArticleTo('梦2123怡_1495801394009', 'ce6233b8-a645-57de-68b2-2a258e', 'https://mp.weixin.qq.com/s?__biz=MzIwMTk0Mjg3Ng==&mid=2247484091&idx=1&sn=bd61587e22d32c206fc00401a45e2404&chksm=96e77088a190f99e4b92153c4946465faccd4592ce3b8a48575ca1bd43538e2bcac2d87802b5&mpshare=1&scene=1&srcid=0725eDp9zwxvtT6oyf7rYN5W&key=4ad62f60730b40514103b543c1208da6130c6a9785fa3581fa9ada7582976ba55a69020e049cc28622aa60ed8f5556c8df130cfa05f250a7f85481a7b9620889fde3b897038478c1d82da9cd34fb309c&ascene=0&uin=MTYzMTY1NjMyMg%3D%3D&devicetype=iMac+MacBookPro11%2C4+OSX+OSX+10.12.3+build(16D32)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=t0i1AkfK3AmS9RwqOyS94T%2B6tUBSSQzkhJBmrgW%2Fd9MyF1jD%2FiMPlFsE92BVQDtZ');
// saveArticleTo('梦2123怡_1495801394009', 'ce6233b8-a645-57de-68b2-2a258e', '');
// saveArticleTo('肖云丹_1496241231042', 'c7b9b103-abf3-02c9-57e0-f1fd71', 'https://www.douban.com/note/633119646/')
// saveArticleTo('肖云丹_1496241231042', 'c7b9b103-abf3-02c9-57e0-f1fd71', 'https://mp.weixin.qq.com/s/HhKTwWSeTDtzAOrtQeGqKA')
// saveArticleTo('Shens[emoji1f343]_1497261634750', 'b6f64d4e-5575-b278-53de-a89a8b', 'https://mp.weixin.qq.com/s/bVOSdflt4ouCzI5q1gRvGg')
// saveArticleTo('Yuancheng_1495884998490', '19bf6bfd-6820-74b3-2a57-ba59a1', 'https://mp.weixin.qq.com/s/TQqd-PA_v4-IvmdMsgOSPQ')
// saveArticleTo('Yuancheng_1495884998490', '19bf6bfd-6820-74b3-2a57-ba59a1', 'https://mp.weixin.qq.com/s/sXAxR1uEExXBKNpJCipmsg')
// saveArticleTo('Shens[emoji1f343]_1497261634750', 'b6f64d4e-5575-b278-53de-a89a8b', 'https://mp.weixin.qq.com/s/DYI65y8yPK74BFYibFYlJw')
// saveArticleTo('Shens[emoji1f343]_1497261634750', 'b6f64d4e-5575-b278-53de-a89a8b', 'https://mp.weixin.qq.com/s/A6rAKOdeJBgolSJ_uMT60w')
saveArticleTo('Shens[emoji1f343]_1497261634750', 'b6f64d4e-5575-b278-53de-a89a8b', 'https://mp.weixin.qq.com/s/Qq-OCIoWwLTuAztbHNJPVw')

// saveArticleTo('Yuancheng_1495884998490', '19bf6bfd-6820-74b3-2a57-ba59a1', 'https://share.iclient.ifeng.com/shareNews?fromType=vampire&forward=1&aid=sub_28975171&token=__QYzQDOzUDZ1YGMjRmYwQzMxUjY4gzNzUmYxUTMkVGZiR2MhRzNwMWO&aman=aG348F35d85f0Ucdbg043A15bK88733ebP151SdedJbd3Ka47A0c9#backhead')
// saveArticleTo('梦2123怡_1495801394009', 'ce6233b8-a645-57de-68b2-2a258e', 'https://git-scm.com/book/zh/v1/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%9A%84%E6%96%B0%E5%BB%BA%E4%B8%8E%E5%90%88%E5%B9%B6');
// a();

// function a() {
//   log.info("aaaaaa:" + encodeURI(env.HOST + '/isauthorize?wechat_name=蒋梦怡'));
//   process.exit(0);
// }

// db.consumer2.update({}, {$set: {"updatedAt" : ISODate("2017-06-12T10:10:27.796Z"), "createdAt" : ISODate("2017-06-12T10:10:27.796Z")}}, {multi: 1})

// 绑定用户

// consumer.bindConsumer('judy02', 'judy01', '010101asd', function() {});

// 查找用户
// Consumer.findConsumer('梦2123怡_1495801124332').then(result => {log.info('result:' + result);});
 
// 查找文章
   // dao_userarticle.findArticleByState(function() {});
   // dao_userarticle.findArticle({ state: '-1' }, function(err, data) {
   // 	if (err) {
   // 		log.error('err:' + err);
   // 		process.exit(1);
   // 	}
   // 	process.exit(0);
   // });
/**
 * 数据库保存失败的文章处理办法
 */
// 保存文章Yuancheng_1495884998490 梦2123怡_1495801124332 56880c5f-a7b7-1e38-dbe5-afd3be 19bf6bfd-6820-74b3-2a57-ba59a1
// Shens[emoji1f343]_1497261634750
// Userarticle.saveArticle('梦2123怡_1495801124332', Userarticle, 'https://mp.weixin.qq.com/s?__biz=MjM5OTkzODQ0Mg==&mid=2652381551&idx=3&sn=2cc6b74c670f34092ab17a6a4252f75b&chksm=bcdf518a8ba8d89c58109b24a488016387a60503e739f97b7f7b012f3404e94b3f407e7d2c7f&mpshare=1&scene=1&srcid=0611UTlYVZh1kq0KP0n5VEHM&key=9a3712a458ed054cc4de6ae88ac26a7f79ed8f000b5387d0f8f88aab2588a73e4ede6dfb397f57364c60cffda6d887c3ec800fddc5b64f35544acc008b5d1f5f2d744cbe4f92d7276d2d21f390280817&ascene=0&uin=MTYzMTY1NjMyMg%3D%3D&devicetype=iMac+MacBookPro11%2C4+OSX+OSX+10.12.3+build(16D32)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=sdcNhG5vDF4r%2Be0ngQfrVVOFcyL9nu4Bm8TQ7YvbuseAvfr%2FwTwNJL9YiIjSQzeD', function(err, result) {log.info('result:' + result);});
// b6f64d4e-5575-b278-53de-a89a8b 
// pocket.saveArticeToPocket('668a45a1-31a3-49f6-abd4-0b3499', 'https://mp.weixin.qq.com/s?__biz=MjM5OTkzODQ0Mg==&mid=2652381551&idx=3&sn=2cc6b74c670f34092ab17a6a4252f75b&chksm=bcdf518a8ba8d89c58109b24a488016387a60503e739f97b7f7b012f3404e94b3f407e7d2c7f&mpshare=1&scene=1&srcid=0611UTlYVZh1kq0KP0n5VEHM&key=9a3712a458ed054cc4de6ae88ac26a7f79ed8f000b5387d0f8f88aab2588a73e4ede6dfb397f57364c60cffda6d887c3ec800fddc5b64f35544acc008b5d1f5f2d744cbe4f92d7276d2d21f390280817&ascene=0&uin=MTYzMTY1NjMyMg%3D%3D&devicetype=iMac+MacBookPro11%2C4+OSX+OSX+10.12.3+build(16D32)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=sdcNhG5vDF4r%2Be0ngQfrVVOFcyL9nu4Bm8TQ7YvbuseAvfr%2FwTwNJL9YiIjSQzeD', function(err, data) {log.info('data:' + data);});

// Userarticle.updateArticleState('59290beb1d8c390010867dcf', function(err, article) {log.info('article:' + article);});

// sendMsg.sendMsg(function() {});


// Userarticle.updateArticle('5937ec3d3e2166092f8364d2', function(err, result) {log.info('result:' + result);});

// var obj1 = {wechat_name: '123_1496818825490'};
// var obj2 = {access_token: '668a45a1-31a3-49f6-abd4-0b3499'};
// Models.findAndUpdate(Consumer, obj1, obj2)
//     .then(function() {
//       log.info('Models.findAndUpdate() callback() start...');
//     });

// Consumer.findConsumerNumber().then(count => {
//   log.info('count:' + count);
// });

// Models.getAllNumber(Consumer).then(count => {
//   log.info('count:' + count);
// });
// Models.getAllNumber(Userarticle).then(count => {
//   log.info('count:' + count);
// });

// Consumer.findConsumerNumber().then(result => {log.info('result:' + JSON.stringify(result));});

