// 引入express框架并创建app
var express = require('express');
var app = express();
// 设置加密秘钥
app.set('superSecret','myjwttest'); 

// 引入SQL模块
var sql = require('../tool/sql');
// 引入json模块
var json = require('../tool/json');
// 引入连接池
var pool = require('../tool/pool');
// 引入jwt依赖
var jwt = require('jsonwebtoken')

// 用户
var user = {
    // 登录
    login: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var param = req.body;
            connection.query(sql.userSelect, param.username, function (err, result) {
                if (result.length == 0) { // 未注册 
                    res.json({
                        code: '0',
                        msg: '该用户名未注册！',
                    });
                } else {
                    var resultArray = result[0]; // 接口返回值
                    if (resultArray.password === param.password) { // 密码正确
                        // 将用户ID、用户名和密码存在token中，获取验证结果后可通过ID获取用户相关信息
                        var token = jwt.sign({id:resultArray.id,...param},app.get('superSecret'),{// 利用jwt生成token
                            expiresIn : 60*60*24 // 24小时有效期
                        })
                        var obj = {
                            username: resultArray.username,
                            role: resultArray.role,
                            token:token
                        }
                        json(res, err, obj);
                    } else { // 密码错误
                        res.json({
                            code: '0',
                            msg: '用户名或密码错误！',
                        });
                    }
                }
                // 释放连接
                connection.release();
            });
        });
    },
    // 注册
    register: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var param = req.body;
            param.id = new Date().getTime();
            connection.query(sql.userSelect, param.username, function (err, result) {
                if (result.length != 0) { // 已经注册
                    res.json({
                        code: '0',
                        msg: '该用户名已被注册！',
                    });
                } else {
                    connection.query(sql.userInsert, [param.username, param.password, 0, new Date(), new Date()], function (err, result) {
                        json(res, err);
                        connection.release();
                    });
                }
            });
        });
    },
    // 获取用户列表(可通过username或者用户角色过滤)
    list: function (req, res, next) {
        let sqlSelect = sql.userList
        if (req.query.username) {
            sqlSelect += " where (username like '%" + req.query.username + "%')"
        }
        if (req.query.role){
            if(req.query.username){
                sqlSelect += " and role = " + req.query.role
            }else{
                sqlSelect += " where role = " + req.query.role
            }
        }
        let index = (req.query.page - 1) * req.query.pageSize // 分页查询索引
        let userSelect = sqlSelect + " limit " + index + ',' + req.query.pageSize
        let count = 0 // 总数
        pool.getConnection(function (err, connection) {
            connection.query(sqlSelect, function (err, result) { // 获取总条数
                count = result.length
                connection.release();
                pool.getConnection(function (err, connection) {
                    connection.query(userSelect, function (err, result) { // 分页查询
                        let obj = {
                            list: result,
                            count: count
                        }
                        json(res, err, obj);
                        connection.release();
                    });
                });
            });
        });
    },
    // 删除
    delete: function (req, res, next) {
        var param = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(sql.userDelete, param.id, function (err, result) {
                json(res, err, null);
                connection.release();
            });
        }); 
    },
    // 更新（设置、移除管理员角色）
    update: function (req, res, next) {
        var param = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(sql.userUpdate, [param.role,new Date(), param.id], function (err, result) {
                json(res, err, null);
                connection.release();
            });
        }); 
    },
};

module.exports = {
    user
}