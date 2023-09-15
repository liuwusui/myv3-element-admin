​
// 1. 导入 mysql 模块
const mysql = require('mysql')
var bodyParser = require('body-parser');
// 2. 建立与 MySQL 数据库的连接关系
const db = mysql.createPool({
  host: 'localhost', // 数据库的 IP 地址
  port: 3306, //数据库端口号
  user: 'root', // 登录数据库的账号
  password: 'LYMLZLHK', // 登录数据库的密码
  database: 'mynode' // 指定要操作哪个数据库
})
 
// 引入express
const express = require('express')
//创建一个app实例对象
const app = express()
 
// 中间件定义post传递的格式
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));//Context-Type 为application/x-www-form-urlencoded 时 返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.json());//用于解析json 会自动选择最为适宜的解析方式
 
 
app.get('/getlist',(req,res)=>{
    const sqlStr = 'select * from ev_users'
    db.query(sqlStr, (err, results) => {
    // 失败
    if (err) {
        return console.log(err.message)
    } 
    // /配置请求的域名，*代表任意
    res.header("Access-Control-Allow-Origin", "*");   
    // 支持跨域请求类型
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    //配置请求头信息，包含字符集等等 
    res.header("Content-Type", "application/json;charset=utf-8");  
    res.send({
        code: 200,
        msg: '获取数据成功',
        data: results
    })
})
}) 
 
app.post('/search', (req, res) => {
    // /配置请求的域名，*代表任意
    res.header("Access-Control-Allow-Origin", "*");   
    // 支持跨域请求类型
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    //配置请求头信息，包含字符集等等 
    res.header("Content-Type", "application/json;charset=utf-8");  
    // 获取到客户端通过查询字符串，发送到服务器的数据
    const body = req.body
    const sqlStr2 = `select * from ev_users where username like '%${body.username}%';`
    db.query(sqlStr2, (err, results) => {
    // 失败
    if (err) {
        return console.log(err.message)
    } 
    res.send({
        status: 200,
        msg: '查询数据成功',
        data: results
    })
    })
})
 
 
app.post('/add', (req, res) => {
    // /配置请求的域名，*代表任意
    res.header("Access-Control-Allow-Origin", "*");   
    // 支持跨域请求类型
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    //配置请求头信息，包含字符集等等 
    res.header("Content-Type", "application/json;charset=utf-8");  
    // 获取到客户端通过查询字符串，发送到服务器的数据
    const body = req.body
    const sqlStr3 = `INSERT INTO liaotian VALUES ('${body.text}');`
    db.query(sqlStr3, (err, results) => {
    // 失败
    if (err) {
        return console.log(err.message)
    } 
    res.send({
        status: 200,
        msg: '添加数据成功',
        data: results
    })
    })
})
 
// listen()端口监听
app.listen(8080,(err)=>{
    if(!err){
        console.log('服务器启动成功了')
    }
})
 
 
 
​