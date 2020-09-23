<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert show-icon
                title="警告提示的文案"
                type="warning" 
                :closable="false"
                >
            </el-alert>

            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类</span>
                    <el-cascader
                        v-model="selectedCateKeys"
                        :options="catelist"
                        :props="catepProps"
                        @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>

             <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="用户管理" name="dynamic">
                    <el-button type='primary' :disabled="isdisabled" @click="showAddAttr">动态参数</el-button>
                    <el-table :data="dynamicList" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag @close="handleClose(key,scope.row)" closable v-for="(item,key) in scope.row.attr_vals" :key="key">{{item}}</el-tag>
                                <el-input
                                    class="input-new-tag" 
                                    style="width:120px"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="showEditParams(scope.row)">修改</el-button>
                                <el-button type="danger" size="small" @click="delateParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="配置管理" name="static">
                    <el-button type='primary' :disabled="isdisabled" @click="showAddAttr">静态属性</el-button>
                    <el-table :data="staticList" border stripe>
                         <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag @close="handleClose(key,scope.row)" closable v-for="(item,key) in scope.row.attr_vals" :key="key">{{item}}</el-tag>
                                <el-input
                                    class="input-new-tag" 
                                    style="width:120px"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="showEditParams(scope.row)">修改</el-button>
                                <el-button type="danger" size="small" @click="delateParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!--添加动态和静态数据-->
        <el-dialog
            :title="'添加'+ titleText"
            :visible.sync="addDialogVisble"
            width="30%" 
            @close="addAttrClose"
            >
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="属性名称" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisble = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改动态属性 -->
        <el-dialog
            :title="' 修改'+ titleText"
            :visible.sync="editDialogVisble"
            width="30%" 
            @close="editAttrClose"
            >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="属性名称" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisble = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            catelist:[],
            catepProps:{
                expandTrigger: 'hover',
                value:'id',
                label:'name',
                children:'children' 
            },
            selectedCateKeys:[],
            activeName:'dynamic',
            addDialogVisble:false,
            addForm:{
                attr_name:''
            },
            addFormRules:{
                attr_name:[
                    {required:true,message:'请输入属性名称',trigger:'blur'}
                ]
            },
            dynamicList:[],
            staticList:[],
            editForm:{
                attr_name:''
            },
            editFormRules:{
                attr_name:[
                    {required:true,message:'请输入属性名称',trigger:'blur'}
                ]
            },
            editDialogVisble:false,
            inputVisible:false,
            inputValue:''
        }
    },

    created(){
        this.getcatelist()
    },

    methods:{
        async getcatelist(){
            const {data:res} = await this.$http.get('cateList?type=3')
            if(res.msg.status!==200) return this.$message.error('获取分类数据失败')
            this.catelist = res.info.data
            // console.log(this.catelist)
        },

        handleChange(){
            // console.log(this.selectedCateKeys)
            if(this.selectedCateKeys.length <3 ){
                this.selectedCateKeys = ""
            }
            this.getParams()

        },

        handleTabClick() {
            this.getParams()
        },

        showAddAttr(){
            this.addDialogVisble = true
        },

        addAttrClose(){
            this.$refs.addFormRef.resetFields()
        },

        editAttrClose(){
            this.$refs.editFormRef.resetFields()
        },

        addParams(){
            // this.addDialogVisble = true
            // console.log(this.catId+''+this.activeName)
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post('addParams',{
                    cat_id:this.catId,
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })

                if(res.msg.status!==200) return this.$message.error('添加失败')
                this.$message.success('添加成功')
                this.getParams()
                this.addDialogVisble = false
            })
        },

        async showEditParams(row){
           // console.log(row)
           const {data:res} = await this.$http.get('editParams?attr_id='+row.attr_id)
           if(res.msg.status!==200) return this.$message.error('获取数据失败')
           this.editForm = res.info
           this.editDialogVisble = true
        },
        editParams(){
            console.log(this.editForm.attr_id);
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post('saveParams',{attr_id:this.editForm.attr_id,attr_name:this.editForm.attr_name})
                if(res.msg.status !== 200 ) return this.$message.error('修改失败')
                this.$message.success('修改成功')
                this.editDialogVisble  = false
                this.getParams()
           })
        },

        async getParams(){
            const {data:res} = await this.$http.get('getParams',{params:{cat_id:this.catId,attr_sel:this.activeName}})
            if(res.msg.status !== 200) return this.$message.error('获取数据失败')

            res.info.forEach(item=>{
                item.attr_vals = item.attr_vals?item.attr_vals.split(','):[]
                item.inputVisible = false
                item.inputValue = ''
            })
            // console.log(res.info);
            if(this.activeName === 'dynamic'){
                this.dynamicList = res.info
            }else{
                this.staticList = res.info
            }
            // // console.log(this.paramsList)
        },

        async delateParams(row){
            const optres = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)

            if(optres !== "confirm") return this.$message.info('您取消了删除')
            const {data:res} = await this.$http.get('deleteParams?attr_id='+row.attr_id)
            if(res.msg.status!==200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getParams()
        },
        handleInputConfirm(row){
            if(row.inputValue.trim().length === 0){
                row.inputValue = ""
                row.inputVisible = false
                return
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            // console.log(row.attr_vals)
            this.saveAttrVals(row)
           
        },
        showInput(row){
            row.inputVisible = true
        },

        handleClose(key,row){
            //console.log(key+"----"+row.attr_vals);
            row.attr_vals.splice(key,1)
            this.saveAttrVals(row)
            // console.log(row.attr_vals)
        },

        async saveAttrVals(row){
            let attrStr = row.attr_vals.join(",");
            const {data:res} = await this.$http.post('addAttr',{attr_id:row.attr_id,attr_vals:attrStr})
            if(res.msg.status!==200) return this.$message.error('添加失败')
            this.$message.success('添加成功')
        }
        
    },

    computed:{
        isdisabled(){
            if(this.selectedCateKeys.length !== 3){
                return true
            }else{
                return false
            }
        },
        catId(){
            if(this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2]
            }
            return null
        },

        titleText(){
            if(this.activeName === "dynamic"){
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    }
}
</script>

<style lang="less" scope>
.cat_opt{
    margin:15px  0
}
.input-new-tag{
    width:120px;
}
</style>