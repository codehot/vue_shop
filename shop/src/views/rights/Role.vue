<template>
    <div>
         <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type='primary' @click="roleFormVisible = true">添加角色</el-button>

            <!-- 角色表格列表 -->
             <el-table :data="roleList" border stripe>
                 <el-table-column type="expand">
                     <template slot-scope="scope">
                         <!-- <pre>{{scope.row}}</pre> -->
                         <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
                          :class="['botom',i1==0?'botop':'','vcenter']"
                            >
                             <el-col :span="5">
                                <el-tag>{{item1.name}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                             <el-col :span="19">
                                 <el-row v-for="(item2,i2) in item1.children" :key="item2.id"
                                    :class="[i2!==0?'botop':'','vcenter']"
                                 >
                                     <el-col :span="6"><el-tag type='success'>{{item2.name}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                                     <el-col :span="18">
                                         <el-tag @close='delRights(scope.row,item3.id)' closable v-for="item3 in item2.children" :key="item3.id">{{item3.name}}</el-tag>
                                     </el-col>
                                 </el-row>
                             </el-col>
                         </el-row>
                     </template>
                 </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="discrip" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editRole(scope.row.rid)">编辑</el-button>
                        <el-button  type="danger" icon="el-icon-delete" size="small" @click="deleteRole(scope.row.rid)" >删除</el-button>
                        <el-button type="warning" icon="el-icon-check" size="small" @click="setRights(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    
        <!-- 添加角色表单 -->
        <el-dialog
            title="添加角色"
            :visible.sync="roleFormVisible"
            width="50%" 
            @close="closeRoleForm"
            >
            <el-form :model="roleAddForm" :rules="roleAddRules" ref="roleAddRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleAddForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="roleAddForm.discrip"></el-input>
                </el-form-item>
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改角色表单 -->
        <el-dialog
            title="添加角色"
            :visible.sync="roleEditDialog"
            width="50%" 
            @close="closeEditForm"
            >
            <el-form :model="roleEditForm" :rules="roleEditRules" ref="roleEditRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleEditForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="roleEditForm.discrip"></el-input>
                </el-form-item>
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户权限 -->
        <el-dialog
        title="修改用户权限"
        :visible.sync="setRightsDialogVisible"
        width="50%" 
         @close="closeTrueeForm"
        >
            <el-tree :data="rightList" 
            :props="treeProps" 
            ref="treeRef" 
            show-checkbox 
            default-expand-all 
            node-key="id" 
            :default-checked-keys="defKeys"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            roleFormVisible:false,
            roleEditDialog:false,
            setRightsDialogVisible:false,
            roleList:[],
            roleAddForm:{
                name:'',
                discript:''
            },
            roleAddRules:{
                name:[
                    {required:true,message:'角色名称不能为空',trigger:blur}
                ]
            },
            roleEditForm:{
                name:'',
                rid:'',
                discript:''
            },
            roleEditRules:{
                name:[
                    {required:true,message:'角色名称不能为空',trigger:blur}
                ]
            },
            rightList:[],
            treeProps:{
                label:'name',
                children:'children'
            },
            defKeys:[],
            roleid:''
        }
    },

    created(){
        this.getRoleList()
    },
    
    methods:{
        closeRoleForm(){
            this.$refs.roleAddRef.resetFields()
        },
        addRole(){
            this.$refs.roleAddRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post('addrole',this.roleAddForm)
                if(res.msg.status!=200) return this.$message.error('添加失败')
                this.$message.success("添加成功")
                //这里刷新列表 暂时还没做
                // 关闭表单框
                this.roleFormVisible = false
            })
        },
        async getRoleList(){
            const {data:res} = await this.$http.get('getrolelist')
            if(res.msg.status!==200) return this.$message.error('获取角色列表失败')
            this.roleList = res.info.rolelist
        },
        closeEditForm(){
            this.$refs.roleEditRef.resetFields()
        },
        async editRole(id){
            this.roleEditDialog =  true;
            //console.log(id)
            const {data:res} = await this.$http.get('getrolebyid?rid='+id)
            if(res.msg.status !==200) return
            this.roleEditForm = res.info.roleinfo
        },
        async updateRole(){
            const {data:res} = await this.$http.post('updaterole',this.roleEditForm)
            if(res.msg.status !== 200)  this.$message.error("修改失败")
            this.roleEditDialog = false
            this.$message.success('修改成功')
            this.getRoleList()
        },

        async deleteRole(rid){
            const confirmRresult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            // console.log(confirmRresult)
            if(confirmRresult !== "confirm"){
                return this.$message.info("您取消了删除")
            }
            const {data:res} = await this.$http.get("deleterole?rid="+rid);
            if(res.msg.status!==200){
                this.$message.error("删除失败")
            }else{
                this.$message.success("删除成功")
                this.getRoleList();
            }
        },

        // 修改用户权限
        async setRights(role){
            this.roleid = role.rid
            this.setRightsDialogVisible = true
            this.getleafkeys(role,this.defKeys)

            const {data:res} = await this.$http.get('getRights')
            if(res.msg.status == 200){
                this.rightList = res.info.catelist
            }
        },

        // 获取选中的值
        async allotRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const keyStr = keys.join(',')
            const parmas = {
                rid:this.roleid,
                keystr:keyStr
            }
            const {data:res} = await this.$http.post('setRole',parmas)
            if(res.msg.status !== 200 ) return
            this.$message.success('操作成功')
            this.getRoleList()
            this.setRightsDialogVisible = false
        },

        async delRights(role,id){
            //console.log(id.rid,fid);
            const res = await this.$confirm('此操作将永久删除该权限吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            if(res!=="confirm") return this.$message.info("您取消了删除")
            
            // 发起网络请求
            const {data:roleinfo} = await this.$http.get("delRoleById?rid="+role.rid+"&id="+id)
            if(roleinfo.msg.status!==200) return this.message.error("删除失败")
            role.children = roleinfo.info;
            //console.log(roleinfo)

        },

        getleafkeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>{
                this.getleafkeys(item,arr)
            })
           // console.log(node)
        },

        closeTrueeForm(){
            this.defKeys=[]
        }


   }

}
</script>

<style lang="less" scope>
.el-tag{
    margin:7px;
}
.botop{
    border-top:solid #eee 1px;
}
.botom{
    border-bottom:solid #eee 1px;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>