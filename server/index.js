/* 引入express框架 */
const express = require('express');
const app = express();
 
/* 引入cors */
const cors = require('cors');
app.use(cors());
 
/* 引入body-parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
/* 引入mysql */
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LYMLZLHK',
    database: 'mynode',
    multipleStatements: true
})
conn.connect();
 
/* 监听端口 */
app.listen(3000, () => {
    console.log('——————————服务已启动——————————');
})
 
app.get('/', (req, res) => {
    res.send('<p style="color:red">服务已启动</p>');
})
 
app.get('/api/getanalysis', (req, res) => {
    const sqlStr = 'SELECT * FROM analysis'
    conn.query(sqlStr, (error, results) => {
        if (error) return res.json({ code: 10001, data: error})
        res.json({ code: 10000, data: results})
    })
})
app.get('/api/getUserList', (req, res) => {
    const sqlStr = 'SELECT * FROM userlist'
    conn.query(sqlStr, (error, results) => {
        if (error) return res.json({ code: 10001, data: error})
        res.json({ code: 10000, data: results})
    })
})
// 登录接口
app.get('/api/v1/auth/login', (req, res) => {
    const sqlStr = 'SELECT * FROM userlist'
    conn.query(sqlStr, (error, results) => {
        if (error) return res.json({ code: 10001, data: error})
        res.json({ code: 10000, data: results})
    })
})