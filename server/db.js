// 导入 mysql 模块
const mysql = require('mysql')
// 建立与 MySQL 数据库的连接
const db = mysql.createPool({
  host: '127.0.0.1', // 数据库的IP地址
  port: 3306, //数据库端口号
  user: 'root', // 登录数据库的账号
  password: 'LYMLZLHK', // 登录数据库的密码
  database: 'mynode' // 指定要操作哪个数据库
})

// 检测数据库是否连接成功
db.query('select 1', (err, results) => {
  if (err) return console.log(err)
  console.log(results, '数据库链接成功')
})

module.exports = db
