<template>
    <div class="app-container">
    <h3>账号资料</h3>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户昵称">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input v-model="form.passWord" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">更新个人信息</el-button>
          
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        this.$message('submit!')
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .line{
    text-align: center;
  }
  </style>
  
  