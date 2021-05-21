// 引入mysql
var mysql = require('mysql');
// 引入mysql连接配置
var mysqlconfig = require('../config/mysql');
// 引入连接池配置
var poolextend = require('./poolextend');
// 使用连接池，提升性能
var pool = mysql.createPool(poolextend({}, mysqlconfig));

module.exports = pool