<template>
  <div class="home">
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/logo.png">
          <span>电商后台管理系统</span>
        </div>
        <el-button @click="loginOut">退出</el-button>

      </el-header>
      <el-container>
        <el-aside :width=" isCollapse? '64px':'200px'">
          <div class="toggle-button" @click="toggleMenu">|||</div>
          <el-menu background-color="#545c64" text-color="#fff" 
          active-text-color="#00ffff" 
          :collapse="isCollapse" 
          :collapse-transition=false 
          router 
          default-active="/user" 
          >
            <el-submenu :index="'/'+item.path" v-for="item in catelist" :key="item.id" >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item :index="'/'+items.path" v-for="items in item.children" :key="items.id">
               <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{items.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
data(){
  return {
    catelist:[],
    isCollapse:false
  }
},
 created(){
   this.getCategory()
 },
 methods:{
   loginOut(){
     window.sessionStorage.clear();
     this.$router.push('/login')
   },
   async getCategory(){
     const {data:data} = await this.$http("getCategory")
     this.catelist = data.info.catelist
   },

   toggleMenu(){
     this.isCollapse = !this.isCollapse
   }
 }

}
</script>

<style lang="less" scoped>
  .el-header{
    background:#373b41;
    display: flex;
    justify-content: space-between;
    color:#fff;
    align-items: center;
    font-size:20px;
    img{
      height:50px;
      width:50px;
      border-radius:50%;
      background:#fff;
      margin-right:20px;
    }
    div{
      display:flex;
      align-items: center;
    }
  }
  .el-aside{
    background:#333744;
    .el-menu{
      border-right:0;
    }
  }
  .el-main{
    background: #aeadf1;
  }
  .home-container,.home{
    height:100%;
  }
  .toggle-button{
    height:30px;
    background:#ccc;
    text-align: center;
    line-height:30px;
    color:#fff;
  }
</style>
