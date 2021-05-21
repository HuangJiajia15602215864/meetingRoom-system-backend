var express = require('express');
var router = express.Router();
var app = express();
app.set('superSecret', 'myjwttest');
var jwt = require('jsonwebtoken')

// 首页
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
// 设置拦截，用来验证JWT（跳过预检OPTIONS和登录注册）
router.use(function (req, res, next) {
  if (req.method == 'OPTIONS' || req.originalUrl == '/user/login' || req.originalUrl == '/user/register') {
    next();
  } else {
    var token = req.headers['access-token']
    if (token) {
      jwt.verify(token, app.get('superSecret'), function (err, decoded) {// 解码 token (验证 secret 和检查有效期（exp）)
        if (err) {
          return res.status(401).send({
            success: false,
            msg: 'token不存在，请重新登录！'
          })
        } else {
          req.decoded = decoded;// 如果验证通过，在req中写入解密结果
          next(); //继续下一步路由
        }
      })
    } else {
      return res.status(401).send({
        success: false,
        msg: 'token不存在，请重新登录'
      })
    }
  }
});
module.exports = router;