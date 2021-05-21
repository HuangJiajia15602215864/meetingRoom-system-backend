// 引入SQL模块
var sql = require('../tool/sql');
// 引入json模块
var json = require('../tool/json');
// 引入连接池
var pool = require('../tool/pool');

// 会议室
var building = {
    // 获取建筑楼列表
    list: function (req, res, next) {
        let sqlSelect = sql.buildingList
        pool.getConnection(function (err, connection) {
            connection.query(sqlSelect, function (err, result) { // 获取总条数
                json(res, err, result);
                connection.release();
            });
        });
    }
};

module.exports = {
    building
}