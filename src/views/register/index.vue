<template>
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
  
        <div class="title-container">
          <h3 class="title">普通用户注册</h3>
        </div>
  
        <el-form-item prop="userName">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          
          <el-input
            ref="userName"
            v-model="loginForm.userName"
            placeholder="请输入用户名"
            name="userName"
            type="text"
            tabindex="1"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item prop="email">
          <span class="svg-container">
           
            <i class="el-icon-s-promotion"></i>
     
          </span>
          
          <el-input
            ref="email"
            v-model="loginForm.email"
            placeholder="请输入邮箱地址"
            name="email"
            type="text"
            tabindex="1"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item prop="phoneNumber">
          <span class="svg-container">
            <i class="el-icon-phone"></i>
          </span>
          
          <el-input
            ref="phoneNumber"
            v-model="loginForm.phoneNumber"
            placeholder="请输入手机号码"
            name="phoneNumber"
            type="text"
            tabindex="1"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请设置登录密码"
            name="password"
            tabindex="2"
            autocomplete="new-password"
            
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="confirmPassword"
            v-model="loginForm.confirmPassword"
            :type="passwordType"
            placeholder="请再次输入登录密码"
            name="confirmPassword"
            tabindex="2"
            autocomplete="new-password"
            
          />

        </el-form-item>
  
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">注册</el-button>
  

  
      </el-form>
    </div>
  </template>
  
  <script>
  import { validUsername } from '@/utils/validate'
  import {register} from '@/api/user'
  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
       
        if (validUsername(value)) {
          callback()
        } else {
          callback(new Error('用户名不能为空'))
          
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 0) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          userName: '',
          password: '',
          phoneNumber:'',
          email:'',
          confirmPassword:''
        },
        loginRules: {
            userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
            password: [{ required: true, trigger: 'blur', validator: validatePassword }],
            // 其他校验规则
            email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }],
            phoneNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
            confirmPassword: [{ required: true, message: '请再次输入登录密码', trigger: 'blur' }]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          debugger
          if (valid) {
            if (this.loginForm.password !== this.loginForm.confirmPassword) {
              this.$message.error('两次输入密码不一致');
              return;
            }
           
            this.loading = true
            register(this.loginForm).then(() => {
              this.$router.push({ path: '/' })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
  </script>
  
  <style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
  
  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;
  
  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }
  
  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
  
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
  
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
  </style>
  
  <style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  
  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
  
    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }
  
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
  
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
  
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
  
    .title-container {
      position: relative;
  
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
  
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
  </style>
  