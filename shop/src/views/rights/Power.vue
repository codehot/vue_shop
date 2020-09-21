<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜单权限</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
           <el-table :data="menulist" border stripe>
               <el-table-column label="#" type="index" width="100px"></el-table-column>
               <el-table-column label="菜单名称" prop="name"></el-table-column>
               <el-table-column label="菜单路径" prop="path"></el-table-column>
               <el-table-column label="权限等级">
                   <template slot-scope="scope">
                       <el-tag v-if="scope.row.level == 1">一级</el-tag>
                       <el-tag v-else-if="scope.row.level == 2" type="success">二级</el-tag>
                       <el-tag v-else type="warning">三级</el-tag>
                   </template>
               </el-table-column>
           </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            menulist:[]
        }
    },

    created(){
        this.getMenuList()
    },

    methods:{
        async getMenuList(){
           const {data:res} = await this.$http.get("getmenu?type=list")
           if(res.msg.status!=200){
               return this.$message.error("获取列表错误")
           }
           this.menulist = res.info.catelist;
        }
    }
}
</script>

<style scoped>
.el-card{
    margin-top:20px!important;
}
</style>