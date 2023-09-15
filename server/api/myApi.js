// 引入数据库连接配置
var models = require('../db.js');
// impoet models from '../db.js'
// 引入express包
var express = require('express');
 
//创建路由器对象
var router = express.Router();
// 引入mysql包
var mysql = require('mysql');
 
// Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件
var multer = require('multer');
 
// 格式化时间模块Silly-datetime
var datetime = require('silly-datetime');
 
var fs = require('fs');
var path = require('path')
var UUID = require('uuid')
 
// multer 自定义存储的方式
var storage = multer.diskStorage({  
    // 保存路径
    destination: function (req, file, cb) {
        // 注意这里的文件路径,不是相对路径，直接填写从项目根路径开始写就行了
        cb(null, 'static/public/uploads')  
    },  
    // 保存在 destination 中的文件名
    filename: function (req, file, cb) {  
        var str = file.originalname.split('.');  
        cb(null, UUID.v1() + '.' + str[1]);  
    }  
})
 
var upload = multer({storage: storage})
 
// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();
 
// 设置返回response
var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        console.log('ret', ret)
        res.json(ret);
    }
};
 
 
// 下面是api路由的代码
router.get('/xxx', (req, res) => {
    // ...
})
 
router.post('/xxx', (req, res) => {
    // ...
})
 
// 导出路由对象
module.exports = router;