const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'LYMLZLHK', // 改成你自己的密码
  database: 'mynode' // 改成你的数据库名称
})

// 处理JSON格式的请求体
app.use(bodyParser.json())

// 处理登录请求
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

// 处理注册请求
app.post('/register', (req, res) => {
  const {
    username,
    password,
    nickname,
    phone,
    user_pic,
    userId,
    avatar,
    roles,
    perms,
    email
  } = req.body

  const sql =
    'INSERT INTO ev_users (username, password, nickname, phone, user_pic, userId, avatar, roles, perms, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

  connection.query(
    sql,
    [
      username,
      password,
      nickname,
      phone,
      user_pic,
      userId,
      avatar,
      roles,
      perms,
      email
    ],
    (error, results, fields) => {
      if (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }

      res.json({ message: 'User registered successfully' })
    }
  )
})

// 处理获取用户信息请求
app.get('/users/:username', (req, res) => {
  const { username } = req.params

  const sql =
    'SELECT id, username, nickname, phone, user_pic, userId, avatar, roles, perms, email FROM ev_users WHERE username = ?'

  connection.query(sql, [username], (error, results, fields) => {
    if (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const user = results[0]
    res.json(user)
  })
})
// 检测数据库是否连接成功
connection.query('select 1', (err, results) => {
  if (err) return console.log(err)
  console.log(results, '数据库链接成功')
})
// 启动服务器监听指定端口
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
