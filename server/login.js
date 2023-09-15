const express = require('express') //引入express模块
const app = express() //创建一个express实例

// 导入 bcryptjs 加密包
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//post参数解析需要的模块以及转码工具
const bodyParser = require('body-parser')
// 导入全局配置文件（里面有token的密钥）
const config = require('./config')
app.use(
  bodyParser.urlencoded({
    extended: false
  })
  //封装错误处理函数
  // app.use()
  // (req, res, next) => {
  //   res.cc = function (err, code = 1, data = {}) {
  //     res.send({
  //       code,
  //       data,
  //       msg: err instanceof Error ? err.message : err
  //     })
  //   }
  //   next()
  // }
)
// 这个中间件会在每次验证失败时被调用
function isRevoked(err, payload) {
  // 如果payload包含“revoked”字段，并且其值为true，那么这个token就被撤销了
  if (payload && payload.hasOwnProperty('revoked')) {
    return true
  }

  return false
}
//加载mysql模块并连接数据库
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'LYMLZLHK', // 改成你自己的密码
  database: 'mynode' // 改成你的数据库名称
})

connection.connect()

// 下面是解决跨域请求问题
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

//以一个注册接口为例
// 注册用户
app.get('/user/register', function (req, res) {
  //address为api名称
  //req.query来获取get传入的参数，类似php中的$_GET
  const username = req.query.username
  const password = req.query.password
  const nickname = req.query.nickname
  const phone = req.query.phone
  //sql语句 此处为查询是否存在
  const sql = `select count(*) from  ev_users where username = "${username}"`
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message)
      return
    }
    //此处建议先console.log(result)
    console.log(result, 100000)
    if (result[0]['count(*)']) {
      let result = {
        code: 0,
        msg: '用户名已存在'
      }
      res.json(result)
    } else {
      const sql = `insert  INTO  ev_users(username,password,nickname,phone)  values ('${username}','${password}','${nickname}','${phone}')`
      connection.query(sql, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message)
          return
        }
        if (result.affectedRows) {
          let result = {
            code: 1,
            msg: '注册成功'
          }
          res.json(result)
        } else {
          let result = {
            code: 0,
            msg: '注册失败'
          }
          res.json(result)
        }
      })
    }
    // result内放的就是返回的数据，res是api传数据
    // 返回的数据需要转换成JSON格式
    // res.json(result);
  })
})

app.post('/user/login', function (req, res) {
  // const userInfo = req.body
  // // 定义 SQL 语句
  // const sql = 'select * from ev_users where username= ? '

  // if (userInfo.username == '' || userInfo.password == '') {
  //   return res.send({
  //     status: 1,
  //     msg: '用户名和密码不能为空'
  //   })
  // }
  // console.log(req.body) //req.body 拿到前台post请求传过来的数据
  // get请求 用 req.query 拿到

  // 执行 SQL 语句，根据用户名查询用户的信息
  connection.query(
    `select * from ev_users where  username = "${req.body.username}"  and password = "${req.body.password}"`,
    (err, result) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)
      // 执行 SQL 语句成功,但是获取的数据条数不为1 也是失败的
      // if (result.length !== 1) return res.cc('登录失败！')
      // 经过上方俩条判断条件，则证明执行 SQL 成功

      // TODO ：判断密码是否正确
      // const comRes = bcrypt.compareSync(userInfo.password, result[0].password)
      // if (!comRes) return res.cc('登陆失败，密码不对？')

      // 在服务器端生成 Token 字符串
      const user = {
        ...result[0], // 解构用户信息
        password: '' //密码等敏感信息置空
      }
      // 对用户的信息进行加密，生成 token 字符串
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: config.expiresIn //tonken 有效期
      })
      // 调用 res.send 将Token响应给客户端
      res.send({
        code: '00000',
        data: {
          user: user,
          Token: 'Bearer ' + tokenStr
        },
        msg: '登录成功！！！'
      })
    }
  )

  // 5.然后进行sql语句查询

  //  connection.query('select * from ev_users where `password` ='+req.body.password + ' and `username` ='+req.body.username, function (error, results, fields) {
  // connection.query(
  //   `select * from ev_users where username = "${req.body.username}"  and password = ${req.body.password}`,
  //   function (error, results, fields) {
  //     if (error) throw error

  //     res.send(results) // 把结果发回给前端
  //   }
  // )
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  console.log(username)

  const sql =
    'SELECT id, username, nickname, phone, user_pic, userId, avatar, roles, perms, email FROM ev_users WHERE username = ? AND password = ?'

  connection.query(sql, [username, password], (error, results, fields) => {
    if (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' })
      return
    }

    const user = results[0]
    console.log(user)
    res.json(user)
  })
})

// 获取用户信息
app.get('/user/me', (req, res) => {
  // const sqlStr = `select * from ev_users where username = "${req.body.username}"  and password = "${req.body.password}"`
  // const sqlStr = `select id, username, nickname, email, user_pic from ev_users where id=?`
  // const sqlStr =
  //   'select id, username, nickname, phone, user_pic, userId, avatar, roles, perms, email from ev_users where username=?'
  const sqlStr = `select * from ev_users where username ='admin'`
  console.log(req, 909090)
  connection.query(sqlStr, req.user, (error, results) => {
    console.log(results, 123123)
    if (error) return res.json({ code: 10001, data: error })
    // res.json({ code: '00000', data: results[0] })
    res.send({
      code: '00000',
      data: results[0],
      msg: '获取用户信息成功！'
    })
  })
})
// app.get('/user/me', (req, res) => {
//   // const sqlStr =
//   //   'select id, username, nickname, phone, user_pic, userId, avatar, roles, perms, email from ev_users where username = ?'
//   const sqlStr =
//     'select id, username, nickname, phone, user_pic, userId, avatar, roles, perms, email from ev_users where username=?'
//   console.log(req.body.username, 11111, req.body.id)
//   connection.query(sqlStr, [req.body.username], (error, results) => {
//     console.log(results, 123123)
//     if (error) return res.json({ code: 10001, data: error })
//     res.send({
//       code: '00000',
//       data: results[0],
//       msg: '获取用户信息成功！'
//     })
//   })
// })

var server = app.listen(8888, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('——————————服务已启动——————————')
  // console.log('地址为 http://%s:%s', host, port)
})
