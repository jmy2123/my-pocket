# my-pocket

## 项目基本介绍

使用Wechaty机器人框架 + Express + MongoDB

一个通过添加机器人为好友，分享文章给机器人，自动将文章保存到绑定好的pocket帐号中的项目

## 安装依赖

```
cd 到代码根目录(package.json所在目录)，执行
$ npm install
```

## 环境要求

* NodeJs >= 7.6
* mongoose
* express

## 项目运行

* 环境启动 npm run debug 访问http://localhost:3001
* 机器人启动 npm run robot
* 定时查看服务是否异常掉线 npm run servehealthcheck
* 定时处理未成功保存到pocket的用户文章 npm run schedule
* 测试 npm run test (临时测试)	

**NOTE：** 不要忘记按照.env.example 来设置.env 文件的内容

## 日志文件的介绍

```
使用 Log4j 中间件来记录日志
级别分为： trace, debug, info, warn, error, fatal
日志打印格式： [时间] [级别] 文件名（如果文件名相同，格式为： 上级目录／文件名） - 内容
```
