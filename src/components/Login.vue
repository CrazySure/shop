<template>
  <div class="login_container">
    <div class="login_box">
      <!-- form表单 -->
      <el-form class="form_box" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //表单绑定数据
      loginForm: {
        username: "admin",
        password: '123456'
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    }
  },
  methods:{
      //重置表单
     resetForm(){
         this.$refs.loginFormRef.resetFields();
     } ,
    //  登录
    login(){
        this.$refs.loginFormRef.validate(valid=>{
            if(!valid) return ;
            this.$axios.post('login',this.loginForm)               
                .then((res)=>{
                    if(res.data.meta.status !== 200) return this.$message.error('登录失败');
                    this.$message.success('登录成功');

                    window.sessionStorage.setItem('token',res.data.data.token);
                    this.$router.push('/home')
                    // window.console.log(res.data)                   
                })
                
        })
    }
  }
};
</script>
<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 450px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 10px;
  .form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>