<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/userlist' }">用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-row :gutter="20" class="mt15">
            <el-col :span="7">
                <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="userFormVisble = true">添加账户</el-button>
            </el-col>
        </el-row>

        

        <el-card class="box-card">
            <template>
                <el-table
                :data="userlist"
                style="width: 100%" 
                border 
                stripe
                >
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="电话" prop="tel"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="角色" prop="rolename"></el-table-column>
                <el-table-column label="添加时间" prop="addtime"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="userStatusChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250px">
                      <template slot-scope="scope">
                        <el-button icon="el-icon-edit"  type="primary" size="small" @click="editUser(scope.row.id)"></el-button>
                        <el-button icon="el-icon-delete"  type="danger" size="small" @click="deleteUser(scope.row.id)"></el-button>
                        <el-button icon="el-icon-message"  type="warning" size="small" @click="setRights(scope.row)">分配权限</el-button>
                      </template>
                </el-table-column>
                
                </el-table>
            </template>

             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
             </el-pagination>
        </el-card>
        <!-- 添加用户信息 -->
        <el-dialog
            title="添加用户"
            :visible.sync="userFormVisble"
            width="50%" 
            @close="closeUserForm"
            >
            <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="70px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="userForm.tel"></el-input>
                </el-form-item>
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="userFormVisble = false">取 消</el-button>
                <el-button type="primary" @click="addUserSubmit">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 修改用户信息 -->
        <el-dialog
            title="修改用户"
            :visible.sync="userEditFormVisble"
            width="50%" 
            @close="closeEditForm"
            >
            <el-form :model="userEditForm" :rules="userEditFormRules" ref="userEditFormRef" label-width="70px" class="demo-ruleForm">
                <el-form-item label="用户名">
                    <el-input v-model="userEditForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userEditForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="userEditForm.tel"></el-input>
                </el-form-item>
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="userEditFormVisble = false">取 消</el-button>
                <el-button type="primary" @click="editUserSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色面板 -->
        <el-dialog
        title="分配角色"
        :visible.sync="roledialogVisible"
        width="30%"
        @close="closeRole">
            <div style="line-height:30px">
                用户名：{{userinfo.username}}<br />
                用户角色：{{userinfo.rolename}}<br />
                <div style="margin-top:20px">
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                        v-for="item in rolelist"
                        :key="item.rid"
                        :label="item.name"
                        :value="item.rid">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roledialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        var validateEmail = (rule,value,callback) => {
            var Regx = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
            if(Regx.test(value)){
                callback()
            }else{
                callback(new Error('邮箱格式不正确'))
            }
        }
        var validateTel = (rule,value,callback) => {
            var Regx = /^1[3456789]\d{9}$/
            if(Regx.test(value)){
                callback()
            }else{
                callback(new Error('手机格式不正确'))
            }
        }
        return{
            userlist:[],
            queryInfo:{
                query:'',
                pagenum: 1,
                pagesize: 10 
            },
            total:0,
            userFormVisble: false,
            userEditFormVisble: false,
            userForm:{
                username:'',
                password:'',
                email:'',
                tel:''
            },
            userFormRules:{
                username:[
                    {required:true,message:"用户名必须填写",trigger:'blur'},
                    {min:2,max:20,message:'长度是3-6之间',trigger:'blur'}
                ],
                password:[
                    {required:true,message:"密码不能为空",trigger:'blur'},
                    {min:6,max:18,message:'长度是6-18之间',trigger:'blur'}
                ],
                email:[
                    {required:true,message:"邮箱必须填写",trigger:'blur'},
                    {validator:validateEmail,trigger:'blur'}    
                ],
                tel:[
                    {required:true,message:"电话必须填写",trigger:'blur'},
                    {validator:validateTel,trigger:'blur'}    
                ]
            },
            roledialogVisible: false,
            selectedRoleId:'',
            rolelist:[],
            userinfo:{},
            userEditForm:{
                id:'',
                username:'',
                email:'',
                tel:''
            },
            userEditFormRules:{
                email:[
                    {required:true,message:"邮箱必须填写",trigger:'blur'},
                    {validator:validateEmail,trigger:'blur'}    
                ],
                tel:[
                    {required:true,message:"电话必须填写",trigger:'blur'},
                    {validator:validateTel,trigger:'blur'}    
                ]
            }
        }
    },

    created(){
        this.getUserList()
    },

    methods:{
        async getUserList(){
            const {data:res} = await this.$http.get("getUserList",{params:this.queryInfo});
            if(res.msg.status !==200 ){
                return this.$message.error('请求失败')
            }
            this.userlist = res.info.userlist
            this.total = res.info.total
        },
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize
            this.getUserList()
        },
        handleCurrentChange(newpage){
            this.queryInfo.pagenum = newpage
            this.getUserList()
        },
        async userStatusChange(userinfo){
           // console.log(scope.row.status);
           // return
           // console.log(userinfo);
            const par = {
                userid:userinfo.id,
                status: userinfo.status
            }
            const {data:res} = await this.$http.put("/changestatus",par);
            if(res.msg.status !== 200){
                userinfo.status != userinfo.status
                this.$message.error("网络超时");
            }else{
                this.$message.success("操作成功");
            }
        },
        closeUserForm(){
            this.$refs.userFormRef.resetFields()
        },
        addUserSubmit(){
            this.$refs.userFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post("adduser",this.userForm)
                if(res.msg.status == 200){
                    this.userFormVisble = false;
                    this.$message.success("添加成功");
                    this.getUserList();
                }else{
                    this.$message.error("添加失败");
                }
            })
        },
        async editUser(id){
            this.userEditFormVisble = true
            const {data:res} = await this.$http.get('edituser?id='+id)
            if(res.msg.status!==200) return
            console.log(res);
            this.userEditForm = res.info.userinfo
        },
        closeEditForm(){
            this.$refs.userEditFormRef.resetFields()
        },
        editUserSubmit(){
            this.$refs.userEditFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.put('updateuser',this.userEditForm)
                if(res.msg.status!==200) this.$message.error("修改失败")
                this.userEditFormVisble = false;
                this.$message.success("修改成功")
                this.getUserList()

            })
        },

       async deleteUser(id){
            const confirmRresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            // console.log(confirmRresult)
            if(confirmRresult !== "confirm"){
                return this.$message.info("您取消了删除")
            }
            const {data:res} = await this.$http.get("deleteuser?id="+id);
            if(res.msg.status!==200){
                this.$message.error("删除失败")
            }else{
                this.$message.success("删除成功")
                this.getUserList();
            }
        },
        async setRights(userinfo){
            // console.log(userinfo);
            this.roledialogVisible = true
            this.userinfo = userinfo
            const {data:res} = await this.$http.get('getrole')
            if(res.msg.status!=200) return this.$message.error('获取权限列表失败')
            this.rolelist = res.info.rolelist
        },

        async saveRole(){
            // console.log(this.selectedRoleId)
           // console.log(this.userinfo.id)
           if(!this.selectedRoleId){
               return this.$message.error("请选择需要分配的权限")
           }
            const parmas = {
                userid:this.userinfo.id,
                roleid:this.selectedRoleId
            }
            const {data:res} = await this.$http.put('saveRole',parmas)
            if(res.msg.status !== 200) return this.$message.error("发生错误")
            this.$message.success('操作成功')
            this.roledialogVisible = false
            this.getUserList()
        },

        closeRole(){
            this.selectedRoleId = ''
            this.userinfo={}
        }
    }
}
</script>

<style scoped>
.mt15{ 
    margin:15px 0;
}
</style>