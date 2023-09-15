/**
 * POST 用户注册
 * @param username  用户名
 * @param password  用户密码
 */
router.post('/add', (req, res, next) => {
  // 通过 req.body 获取请求体中包含的 url-encoded 格式的数据
  console.log(req.body)
  const userInfo = req.body
  //【步骤一】对客户端的数据进行校验
  if (userInfo.username == '' || userInfo.password == '') {
    return res.send({
      status: 1,
      msg: '用户名和密码不能为空'
    })
  }
  // 【步骤二】执行定义好的注册函数
  regUser(req, res)
})
