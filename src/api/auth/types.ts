/**
 * ResultLoginResult
 */

/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  username: string
  /**
   * 密码
   */
  password: string
  verifyCodeKey?: string
  verifyCode?: string
}

/**
 * LoginResult，登录响应对象
 */

export interface LoginResult {
  /**
   * 访问token
   */
  accessToken?: string
  /**
   * 过期时间(单位：毫秒)
   */
  expires?: number | null
  /**
   * 刷新token
   */
  refreshToken?: null | string
  /**
   * token 类型
   */
  tokenType?: string
}
