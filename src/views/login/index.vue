<template>
  <div class="login-container">
    <el-form
      class="loginForm"
      label-width="220px"
      ref="loginFormRef"
      :model="loginData"
      :rules="loginRules"
    >
      <h2 style="width: 100%; color: #fff; text-align: center">热烈</h2>
      <el-form-item prop="username">
        <div class="p-2 text-white formicon">
          <svg-icon icon-class="user" />
        </div>
        <el-input v-model="loginData.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="p-2 text-white formicon">
          <svg-icon icon-class="password" /> </span
        ><el-input
          v-model="loginData.password"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item prop="verifyCode">
        <span class="p-2 text-white formicon">
          <svg-icon icon-class="verify_code" /> </span
        ><el-input v-model="loginData.verifyCode" placeholder="请输入验证码" />
        <div class="captcha">
          <img :src="captchaBase64" @click="getCaptcha" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="submitForm"
          >登录</el-button
        >
      </el-form-item>
      <el-form-item>
        <div style="color: #fff">
          <span style="margin-right: 18px">用户名：admin</span>
          <span>密码：123456</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
// API依赖
import { LocationQuery, LocationQueryValue, useRoute } from 'vue-router'
import { getCaptchaApi } from '@/api/auth'
import { LoginData } from '@/api/auth/types'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const route = useRoute()
const loginData = ref<LoginData>({
  username: 'admin',
  password: '123456',
  verifyCode: '',
  verifyCodeKey: ''
})
/**
 * 验证码图片Base64字符串
 */
const captchaBase64 = ref()
/**
 * 登录表单引用
 */
const loginFormRef = ref(ElForm)
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  verifyCode: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }
  ]
}

function submitForm() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      userStore.login(loginData.value).then((res) => {
        console.log(res)
        const query: LocationQuery = route.query
        const redirect = (query.redirect as LocationQueryValue) ?? '/'
        const otherQueryParams = Object.keys(query).reduce(
          (acc: any, cur: string) => {
            if (cur !== 'redirect') {
              acc[cur] = query[cur]
            }
            return acc
          },
          {}
        )

        router.push({ path: redirect, query: otherQueryParams })
      }).catch(()=>{
        getCaptcha()
      }).finally(()=>{
        
      })
    }
  })
}
function getCaptcha() {
  getCaptchaApi().then((res) => {
    console.log(res.data)
    const { verifyCodeBase64, verifyCodeKey } = res.data
    loginData.value.verifyCodeKey = verifyCodeKey
    captchaBase64.value = verifyCodeBase64
  })
}

onMounted(() => {
  getCaptcha()
})
</script>

<style lang="scss" scoped>
html {
  background: #2d3a4b !important;
}
.login-container {
  width: 100%;
  height: 100%;
  background: #2d3a4b;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .loginForm {
    width: 520px;
    ::v-deep(.el-form-item__content) {
      margin: 0px !important;
    }
    .formicon {
      position: absolute;
      top: 0;
      left: 10px;
    }
    .el-input {
      height: 50px;
    }
    ::v-deep(.el-input__wrapper) {
      background-color: #00000017 !important;
      box-shadow: 0 0 0 1px #4d4f53 inset !important;
    }
    ::v-deep(.el-input__inner) {
      padding-left: 25px;
      color: #fff;
    }

    .captcha {
      position: absolute;
      top: 0;
      right: 0;

      img {
        width: 120px;
        height: 48px;
        cursor: pointer;
      }
    }
  }
}
</style>
