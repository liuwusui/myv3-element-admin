// 导入 express
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// 引入路由模块
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

// 创建服务器实例
var app = express()

app.use(logger('dev'))

// 处理 application/json
app.use(express.json())

// 配置解析表单数据的中间件 处理 x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: false
  })
)
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//token解析中间件 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
//映入解密
const config = require('./expressFrame/config')
// 注册全局中间件  链式调用 unless 方法，接收一个配置对象，path 字段设置一个正则表达式，表示不需要 token 身份认证的路由前缀。
app.use(
  expressJWT({
    // 加密时设置的密钥
    secret: config.jwtSecretKey,
    // 设置算法
    algorithms: ['HS256']
    // 无token请求不进行解析，并且抛出异常
    // credentialsRequired: false
  }).unless({
    path: [
      '/users/add',
      '/users/login',
      {
        url: /^\/public\/.*/,
        methods: ['GET', 'POST']
      }
    ]
    // path: ['/users/login','/users']
  })
)

// 【必须在配置 cors 中间件之前，配置 JSONP 的接口】
app.get('/api/jsonp', (req, res) => {
  // TODO: 定义 JSONP 接口具体的实现过程
  // 1. 得到函数的名称
  const funcName = req.query.callback
  // 2. 定义要发送到客户端的数据对象
  const data = {
    name: 'zs',
    age: 22
  }
  // 3. 拼接出一个函数的调用
  const scriptStr = `${funcName}(${JSON.stringify(data)})`
  // 4. 把拼接的字符串，响应给客户端
  res.send(scriptStr)
})

// 一定要在路由之前，配置 cors 这个中间件，从而解决接口跨域的问题
const cors = require('cors')
app.use(cors())

//定义第一个全局中间件
app.use((req, res, next) => {
  //res用于返回客户端 req客户端的请求参数  next() 提交给下一个中间件
  // 只允许  请求方法
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE,HEAD')
  // 响应头 允许所有的 HTTP 请求方法
  res.setHeader('Access-Control-Allow-Methods', '*')
  // 如果指定了 Access-Control-Allow-Origin 字段的值为通配符 *，表示允许来自任何域的请求
  res.setHeader('Access-Control-Allow-Origin', '*')
  // res.setHeader("Access-Control-Allow-Headers", "content-type,Authorization");
  next()
})

//封装错误处理函数
app.use((req, res, next) => {
  res.cc = function (err, status = 1, data = {}) {
    res.send({
      status,
      data,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 错误中间件 当token失效时 返回信息
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      status: 1,
      data: {},
      message: '身份认证失败！'
    })
  }
})

// 挂载路由
app.use('/', indexRouter)

/* 用户路由 */
app.use('/users', usersRouter)

module.exports = app
