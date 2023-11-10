const express = require('express') //引入express模块
const app = express() //创建一个express实例
const moment = require('moment')
// 导入 bcryptjs 加密包
const bcrypt = require('bcryptjs')
// 定义加密密码计算强度
const saltRounds = 10
const jwt = require('jsonwebtoken')
//post参数解析需要的模块以及转码工具
const bodyParser = require('body-parser')
// 导入全局配置文件（里面有token的密钥）
const config = require('./config')
// app.use(
//   bodyParser.urlencoded({
//     extended: true
//   })
//   //封装错误处理函数
//   // app.use()
//   // (req, res, next) => {
//   //   res.cc = function (err, code = 1, data = {}) {
//   //     res.send({
//   //       code,
//   //       data,
//   //       msg: err instanceof Error ? err.message : err
//   //     })
//   //   }
//   //   next()
//   // }
// )
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
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
  database: 'mynode', // 改成你的数据库名称
  multipleStatements: true //执行多条？
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
      // console.log('[SELECT ERROR] - ', err.message)
      return
    }
    //此处建议先console.log(result)
    // console.log(result, 100000)
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
          // console.log('[SELECT ERROR] - ', err.message)
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

app.post('/api/v1/auth/login', function (req, res) {
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
  // console.log(username)

  const sql =
    'SELECT id, username, nickname, phone, user_pic, userId, avatar, roles, perms, email FROM ev_users WHERE username = ? AND password = ?'

  connection.query(sql, [username, password], (error, results, fields) => {
    if (error) {
      console.error(error)
      res.status(500).json({
        error: 'Internal Server Error'
      })
      return
    }

    if (results.length === 0) {
      res.status(401).json({
        error: 'Invalid username or password'
      })
      return
    }

    const user = results[0]
    // console.log(user)
    res.json(user)
  })
})

// 获取用户信息
app.get('/api/v1/users/me', (req, res) => {
  // const sqlStr = `select * from ev_users where username = "${req.body.username}"  and password = "${req.body.password}"`
  // const sqlStr = `select id, username, nickname, email, user_pic from ev_users where id=?`
  // const sqlStr =
  //   'select id, username, nickname, phone, user_pic, userId, avatar, roles, perms, email from ev_users where username=?'
  const sqlStr = `select * from ev_users where username ='admin'`
  // console.log(req, 909090)
  connection.query(sqlStr, req.user, (error, results) => {
    if (error)
      return res.json({
        code: 10001,
        data: error
      })
    // res.json({ code: '00000', data: results[0] })
    res.send({
      code: '00000',
      data: {
        ...results[0],
        roles: JSON.parse(JSON.stringify(results[0].roles))
      },
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

app.get('/api/getUserList', (req, res) => {
  const sqlStr =
    'select sys_user.id,sys_user.username,sys_user.nickname,sys_user.mobile,sys_user.avatar,sys_user.email,sys_user.`status`,sys_user.create_time as createTime,sys_dict.`name` as genderLabel,sys_dept.`name` as deptName from sys_user, sys_dict,sys_dept where sys_user.gender=sys_dict.`value` and sys_user.dept_id=sys_dept.id ORDER BY sys_user.id'

  connection.query(sqlStr, (error, results) => {
    //pagesize一页展示多条数据  pagesize前端传来的可选参数，如果没传给个默认值5。传来的是字符串需要parseInt()函数转化
    // const pagesize = parseInt(req.query.pagesize) || 5
    //pagenum当前第几页  pagenum前端传来的可选参数，如果没传给个默认值1。传来的是字符串需要parseInt()函数转化
    // const pagenum = Number(req.query.pagenum) //当前页，前端传的页码
    // let totalPage = Math.ceil(results.length / pagesize) //返一个总页码
    if (error)
      return res.json({
        code: 10001,
        data: error
      })
    res.json({
      code: '00000',
      data: {
        list: results,
        total: results.length
      }
    })
  })
})
app.get('/api/v1/roles/options', (req, res) => {
  const sqlStr =
    'SELECT sys_role.id as value,sys_role.`name` AS label FROM sys_role'
  connection.query(sqlStr, (error, results) => {
    if (error)
      return res.json({
        code: 10001,
        data: error
      })
    res.json({
      code: '00000',
      data: results,
      message: '获取用户下拉列表成功！'
    })
  })
})
app.get('/api/v1/dept', (req, res) => {
  const sqlStr = 'SELECT * FROM sys_dept'
  connection.query(sqlStr, (error, results) => {
    if (error)
      return res.json({
        code: 10001,
        data: error
      })
    const treeData = buildTree(results)
    res.json({
      code: '00000',
      data: treeData,
      message: '获取用户下拉列表成功！'
    })
  })
})
app.get('/api/v1/dept/options', (req, res) => {
  const sqlStr =
    'SELECT sys_dept.id,sys_dept.parent_id as parentId,sys_dept.`name`,sys_dept.sort,sys_dept.`status`  FROM `sys_dept`'
  connection.query(sqlStr, (error, results) => {
    if (error)
      return res.json({
        code: 10001,
        data: error
      })
    const aaa = toTree(results, 0)
    res.json({
      code: '00000',
      data: aaa,
      message: '获取用户下拉列表成功！'
    })
  })
})
app.post('/api/v1/users', (req, res) => {
  console.log(req.body)
  const username = req.body.username
  const nickname = req.body.nickname
  const deptId = req.body.deptId
  const gender = req.body.gender || 0
  const status = req.body.status
  const mobile = req.body.mobile || ''
  const email = req.body.email || ''
  const roleIds = JSON.stringify(req.body.roleIds)
  const defaultPassword = '123456'
  // bcrypt.hash(defaultPassword, saltRounds, function (err, hash) {
  // 数据库存入hash
  const sqlStr = `insert INTO sys_user(username,nickname,gender,mobile,status,email,dept_id,password,create_time)  
    values ('${username}','${nickname}','${gender}','${mobile}','${status}','${email}','${deptId}','${defaultPassword}',
    '${moment().format('YYYY-MM-DD HH:mm:ss')}');
    insert INTO sys_user_role(user_id,role_id)  values (LAST_INSERT_ID(),'${roleIds}')`
  connection.query(sqlStr, (error, results) => {
    if (error)
      return res.json({
        code: 10001,
        data: error
      })
    res.json({
      code: '00000',
      data: results,
      message: '新增用户成功！'
    })
  })
  // })
})
app.delete('/api/v1/del/users', (req, res) => {
  // console.log(req.query.ids, 66666)
  const sqlStr = `DELETE FROM sys_user where sys_user.id=${req.query.ids}`
  /*   SET @auto_id = 0;
UPDATE sys_user SET id = (@auto_id := @auto_id + 1);
ALTER TABLE sys_user AUTO_INCREMENT = 0; */
  connection.query(sqlStr, (error, results) => {
    if (error)
      return res.json({
        code: 10001,
        data: error
      })
    res.json({
      code: '00000',
      data: results,
      message: '删除用户成功！'
    })
  })
})

// 编辑 用户信息回显
app.get(`/api/v1/users/:id/form`, (req, res) => {
  const userId = req.params.id // 获取请求URL中的用户ID
  const sqlStr = `SELECT * FROM sys_user JOIN sys_user_role ON sys_user.id = sys_user_role.user_id WHERE sys_user.id =${userId}`
  connection.query(sqlStr, (error, results) => {
    if (error)
      return res.json({
        code: 10001,
        data: error
      })
    delete results[0].password
    delete results[0].deleted
    delete results[0].update_time
    results[0].deptId = results[0].dept_id
    delete results[0].dept_id
    delete results[0].create_time
    delete results[0].user_id
    results[0].roleIds = JSON.parse(results[0].role_id)
    delete results[0].role_id
    // console.log(results[0])
    res.json({
      code: '00000',
      data: results[0],
      message: '获取用户信息成功！'
    })
  })
})
// 修改用户信息
app.put(`api/v1/users/:userId`, (req, res) => {
  console.log(req.body)
  // const userId = req.params.id // 获取请求URL中的用户ID
  // const username = req.body.username
  // const nickname = req.body.nickname
  // const deptId = req.body.deptId
  // const gender = req.body.gender || 0
  // const status = req.body.status
  // const mobile = req.body.mobile || ''
  // const email = req.body.email || ''
  // const roleIds = JSON.stringify(req.body.roleIds)
  // console.log(req.params.id)
  // console.log(req.body, 9999)
  // const sqlStr = `update sys_user set username=${username},nickname=${nickname},dept_id=${deptId},gender=${gender},mobile=${mobile},status=${status},email=${email} where id=${userId};`
  // connection.query(sqlStr, (error, results) => {
  //   if (error)
  //     return res.json({
  //       code: 10001,
  //       data: error
  //     })
  //   console.log(results[0])
  //   res.json({
  //     code: '00000',
  //     data: results[0],
  //     message: '修改用户信息成功！'
  //   })
  // })
})

function buildTree(data) {
  const tree = []
  const lookup = {}

  data.forEach((item) => {
    item.children = []

    lookup[item.id] = item
  })

  data.forEach((item) => {
    if (item.parent_id === 0) {
      tree.push(item)
    } else {
      // debugger
      lookup[item.parent_id].children.push(item)
    }
  })

  return tree
}

function toTree(data, node) {
  let arr = []
  data.forEach((item) => {
    if (item.parentId == node) {
      let children = toTree(data, item.id)
      if (children.length > 0) {
        item.children = children
      }
      arr.push(item)
    }
  })
  return arr
}

var server = app.listen(8888, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('——————————服务已启动——————————')
  // console.log('地址为 http://%s:%s', host, port)
})
