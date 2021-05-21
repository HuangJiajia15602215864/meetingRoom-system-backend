//json.js
//封装接送模块
var json = function(res,err,result) {
    if(!err){
        res.json({
            code: 1,
            msg: '成功',
            data: result
        });
    }else{
        res.json({
            code: 0,
            msg: err.sqlMessage,
            data: result
        });    
    }
  };
  module.exports = json;