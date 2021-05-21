var express = require('express');
var router = express.Router();
var {
  user
} = require('../modules/user');

// 登录
router.post('/login', function(req, res, next) {
  user.login(req, res, next);
});
// 注册
router.post('/register', function(req, res, next) {
  user.register(req, res, next);
});
// 获取用户列表(可通过username或者用户角色过滤)
router.get('/list', function (req, res, next) {
  user.list(req, res, next);
});
// 删除
router.delete('/delete', function (req, res, next) {
  user.delete(req, res, next);
});
// 更新（设置、移除管理员角色）
router.post('/update', function(req, res, next) {
  user.update(req, res, next);
});


module.exports = router;
