<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col><el-button type="primary" @click="showAddCateForm">添加分类</el-button></el-col>
            </el-row>

            <!-- 渲染表格 -->
            <tree-table 
                :data="cateList" 
                :columns="columns" 
                :selection-type="false" 
                :expand-type="false" 
                show-index 
                index-text="#" 
                border 
                :show-row-hover="false"
            >
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.status"></i>
                <i class="el-icon-error" v-else></i>
            </template>

            <template slot="order" slot-scope="scope">
                <el-tag size="mini" type='info' v-if="scope.row.level === 0 ">一级</el-tag>
                <el-tag size="mini" type='success' v-else-if="scope.row.level === 1 ">二级</el-tag>
                <el-tag size="mini" type='warning' v-else>三级</el-tag>
            </template>

            <template slot="opt" slot-scope="scope">
                <el-button type="primary" size="mini" icon='el-icon-edit' @click="editCate(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" icon='el-icon-delete' @click="deleteCate(scope.row)">删除</el-button>
            </template>
            </tree-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        

        <!-- 添加分类Dialog -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCategriesDialogVisible"
        width="50%"
        @close="closeCateForm"
        >
            <el-form :model="addCategoriesForm" :rules="addCategoriesRules" ref="addCategoriesRef">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="addCategoriesForm.name"></el-input>
                </el-form-item>
                 <el-cascader
                    v-model="selectedKeys"
                    :options="catelist2"
                    :props="selectedOptions" 
                    clearable 
                    change-on-select
                    @change="selectedchange">
                    </el-cascader>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCategriesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改分类Dialog -->
        <el-dialog
        title="修改分类"
        :visible.sync="editCategriesDialogVisible"
        width="50%"
        @close="closeeditCateForm"
        >
            <el-form :model="editCategoriesForm" :rules="editCategoriesRules" ref="editCategoriesRef">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="editCategoriesForm.name"></el-input>
                </el-form-item>
                 <el-cascader
                    v-model="selectedKeys"
                    :options="catelist2"
                    :props="selectedOptions" 
                    clearable 
                    @change="editselectedchange">
                    </el-cascader>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCategriesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            addCategriesDialogVisible:false,
            cateList:[],
            catelist2:[],
            total:0,
            columns:[
                {
                    label:'分类名称',
                    prop:'name'
                },
                {
                    label:'是否有效',
                    type: 'template',
                    template: 'isok'
                },
                {
                    label:'排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label:'操作',
                    type: 'template',
                    template: 'opt'
                }
            ],
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            addCategoriesForm:{
                name:'',
                fid: 0,
                level: 0
            },
            addCategoriesRules:{
                name:[
                    {required:true,message:'分类名称不能为空',trigger:'blur'}
                ]
            },
            selectedOptions:{ 
                expandTrigger: 'hover',
                value:'id',
                label:'name',
                children:'children' ,
                checkStrictly:true
            },
            selectedKeys:[],

            //修改分类表单数据
            editCategriesDialogVisible:false,
            editCategoriesForm:{
                id:'',
                name:'',
                fid: 0,
                level: 0
            },
            editCategoriesRules:{
                name:[
                    {required:true,message:'分类名称不能为空',trigger:'blur'}
                ]
            }
        }
    },

    created(){
        this.getCateList()
    },

    methods:{
        handleClose(){
            this.$refs.addCategoriesRef.resetFields()
        },

        closeeditCateForm(){
            // this.$refs.editCategoriesRef.resetFields()
             this.selectedKeys = []
        },
       async  getCateList(){
            const {data:res} = await this.$http.get("cateList",{params:this.queryInfo})
            if(res.msg.status!==200) return this.$message.error("获取分类数据失败")
            this.cateList = res.info.data
            this.total = res.info.total
        },

        addCate(){
            this.$refs.addCategoriesRef.validate(async valid=>{
                if(!valid) return this.$message.error('添加分类失败')
                const {data:res} = await this.$http.post('addCate',this.addCategoriesForm)
                if(res.msg.status!==200) return this.$message.error('添加分类失败')
                this.$message.success('添加成功')
                this.addCategoriesForm = {}
                this.getCateList()
                this.addCategriesDialogVisible = false
            })
        },

        async saveEditCate(){
            console.log(this.editCategoriesForm);
            
            const {data:res} = await this.$http.post('saveEiditCategory',this.editCategoriesForm)
            if(res.msg.status!==200) return this.$message.error('修改失败')
            this.$message.success('修改成功')
            this.editCategriesDialogVisible = false

            this.getCateList()
        },

        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },

        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },

        async showAddCateForm(){
            this.addCategriesDialogVisible  = true;
            const {data:res} = await this.$http.get('cateList',{params:{type:2}})
            if(res.msg.status!=200) return this.$message.error('获取数据失败')
            this.catelist2 = res.info.data
            // console.log(res.info.data)
        },

        closeCateForm(){
            this.addCategoriesForm = {}
        },

        selectedchange(){
           // console.log(this.selectedKeys)
           if(this.selectedKeys.length > 0){
               this.addCategoriesForm.fid = this.selectedKeys[this.selectedKeys.length-1]
               this.addCategoriesForm.level = this.selectedKeys.length
               return
           }else{
               this.addCategoriesForm.fid = 0;
               this.addCategoriesForm.level = 0;
           }
        },

        editselectedchange(){
             // console.log(this.selectedKeys)
           if(this.selectedKeys.length > 0){
               this.editCategoriesForm.fid = this.selectedKeys[this.selectedKeys.length-1]
               this.editCategoriesForm.level = this.selectedKeys.length
               return
           }else{
               this.editCategoriesForm.fid = 0;
               this.editCategoriesForm.level = 0;
           }
        },

        async editCate(row){
            this.editCategriesDialogVisible = true
            //console.log(row.id)
            const {data:ress} = await this.$http.get('cateList',{params:{type:2}})
            if(ress.msg.status!=200) return this.$message.error('获取数据失败')
            this.catelist2 = ress.info.data

            const {data:res} = await this.$http.get('getCatoriesById?id='+row.id)
            if(res.msg.status!==200) return this.$message.error('获取数据失败')
            this.editCategoriesForm = res.info.data
        },

        async deleteCate(row){
            const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            if(res == "confirm"){
                 const {data:result} = await this.$http.get('deleteCate?id='+row.id)
                 if(result.msg.status!==200) return this.$message.error('操作失败')
                 this.$message.success('删除成功')
                 this.getCateList()
            }else{
                return this.$message.info('您取消了操作')
            }
           
        }
    }
}
</script>

<style lang="less" scope>

</style>