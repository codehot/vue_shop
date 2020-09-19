<template>
  <div class="login_container">
    <div class="login_box">
      <div class="logo">
        <img src="../assets/logo.png">
      </div>
      <div class="form_box">
        <el-form class="login_form" ref="loginForm" :model="loginForm" :rules="rules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
           <el-form-item label="用户名" prop="password"> 
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
           <el-form-item class="login_btn">
            <el-button type="primary" @click="submitForm">登陆</el-button>
            <el-button type="info" @click="resetForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"Login",
  data(){
    return {
      loginForm:{
        username:"admin",
        password:"123123"
      },
      rules:{
        username:[
           { required: true, message: '请输入活动名称', trigger: 'blur' },
           { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
             { required: true, message: '请输入活动名称', trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    submitForm(){
      this.$refs.loginForm.validate(async vlid=>{
        if(vlid){
          //console.log(vlid)
          const {data:data} = await  this.$http.post("checkLogin",this.loginForm);
          if(data.msg.status === 200){
            this.$message.success("登陆成功");
            window.sessionStorage.setItem("token",data.info.token);
            this.$router.push("/home")
          }else{
            this.$message.error("登陆失败");
            this.$router.push("/login")
          }
        }
      })
    },
    resetForm(){
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  height:100%;
  width: 100%;
  background:#2b4b6b;
  .login_box{
    height:400px;
    width:500px;
    background:#fff;
    border-radius:5px;
    position:absolute;
    top:50%;  
    left:50%;
    transform: translate(-50%,-50%);
    .logo{
      height:130px;
      width:130px;
      border:solid #ccc 1px;
      border-radius:50%;
      padding:10px;
      box-shadow:0 0 10px #fff;
      position:absolute;
      left:50%;
      transform: translate(-50%,-50%);
      img{
        height:100%;
        width:100%;
        border-radius:50%;
        background:#ccc
      }
    }
    .form_box{
      padding:0 30px;
      position:absolute;
      bottom:0;
      width:100%;
      box-sizing: border-box;
      .login_btn{
        display:flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>