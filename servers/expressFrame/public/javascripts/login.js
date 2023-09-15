// 导入数据库操作模块
const db = require('../../db/index')
// 导入 bcryptjs 加密包
const bcrypt = require('bcryptjs')
// 导入生成Token的包
const jwt = require('jsonwebtoken')
// 导入全局配置文件（里面有token的密钥）
const config = require('../../config')

/**
 * POST 用户注册
 * @param username  用户名
 * @param password  用户密码
 */
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userInfo = req.body
  // 定义sql语句，查询用户名是否被占用
  let sql = 'select * from ev_users where username=?'
  db.query(sql, [userInfo.username], (error, result) => {
    if (error) {
      return res.cc(error)
    }
    if (result.length > 0) {
      return res.cc('用户名已被占用!')
    }
    // 调用 bcrypt.hashSync() 对密码加密
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    // 定义插入新用户的 SQL 语句
    let sql1 = 'insert into ev_users set ?'
    // 调用 db.query() 执行 sql 语句
    db.query(
      sql1,
      {
        username: userInfo.username,
        password: userInfo.password
      },
      (error, result) => {
        if (error) return res.cc(error)
        // 判断影响行数是否为 1
        if (result.affectedRows !== 1) return res.cc('注册用户失败！')
        return res.cc('注册用户成功', 0, {
          username: userInfo.username
        })
      }
    )
  })
}

/**
 * POST 登录的回调函数
 * @param username  用户名
 * @param password  用户密码
 */
exports.login = (req, res) => {
  console.log('user', req.user)
  // 接收表单的数据
  const userInfo = req.body
  // 定义 SQL 语句
  const sql = 'select * from ev_users where username=?'
  // 执行 SQL 语句，根据用户名查询用户的信息
  db.query(sql, userInfo.username, (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功,但是获取的数据条数不为1 也是失败的
    if (result.length !== 1) return res.cc('登录失败！')
    // 经过上方俩条判断条件，则证明执行 SQL 成功

    // TODO ：判断密码是否正确
    const comRes = bcrypt.compareSync(userInfo.password, result[0].password)
    if (!comRes) return res.cc('登陆失败')
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
      status: 0,
      data: {
        user: user,
        token: 'Bearer ' + tokenStr
      },
      message: '登录成功！！！'
    })
  })
}
