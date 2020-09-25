<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="添加商品页面" type="info" class="el-icon-info" center> </el-alert>
            <el-steps :space="200" :active="activeIndex-0" finish-status="success"  align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>    
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRuleForm" label-width="100px" label-position="top">
                <el-tabs tab-position="left" 
                v-model="activeIndex" 
                style="margin-top: 20px;" 
                :before-leave="beforeTabLeave" 
                @tab-click="tabClicked"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_num">
                            <el-input v-model="addForm.goods_num" type="number"></el-input>
                        </el-form-item>

                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="catelist"
                                :props="props" 
                                @change="handleChange"
                                ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in dynamicData" :key="item.attr_id" :label="item.attr_name">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border v-for="(cb,i) in item.attr_vals" :key="i" :label="cb"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item  v-for="item in staticData" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            :action="uploadUrl"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture" 
                            :file-list="fileList"
                            :headers="headerObj" 
                            :on-success="handleSuccess"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>

                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_content"></quill-editor>
                         <el-button type='primary' @click="add">提交</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

            <!-- 展示图片 -->
            <el-dialog
                title="图片预览"
                :visible.sync="previewDialogVisible"
                width="50%" style="text-align:center">
                <img :src="previewPic" />
            </el-dialog>

           
        </el-card>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data(){
        return {
            activeIndex:0,
            addForm:{
                goods_id:'',
                goods_name:1,
                goods_price:1,
                goods_weight:1,
                goods_num:1,
                goods_cat:[],
                goods_vals:[],
                pic:[],
                goods_content:'' 
            },
            fileList :[],
            addFormRules:{

                goods_name:[{required:true,message:"商品名称不能为空",trigger:'blur'}],
                goods_price:[{required:true,message:"商品价格不能为空",trigger:'blur'}],
                goods_weight:[{required:true,message:"商品重量不能为空",trigger:'blur'}],
                goods_num:[{required:true,message:"商品数量不能为空",trigger:'blur'}],
                goods_cat:[{required:true,message:"商品分类不能为空",trigger:'blur'}]
            },
            catelist:[],
            props:{ 
                expandTrigger: 'hover',
                value:"id",
                label:"name",
                children:"children"
            },
            dynamicData:[],
            staticData:[],
            uploadUrl:'http://www.v2.com/index.php/api/upload',
            headerObj:{
                Authorization: window.sessionStorage.getItem("token")
            },
            previewPic:'',
            previewDialogVisible:false
        }
    },

    created(){
        this.getCateList()
        this.getGoodsId()
    },
    

    methods:{
        async getGoodsId(){
            if(this.$route.query.goods_id){
                const goods_id = this.$route.query.goods_id;
                const {data:res} = await this.$http.get('getGoodsById?goods_id='+goods_id)
                if(res.msg.status!==200) return this.$message.error('获取数据失败')
                this.addForm = res.info
                const goods_cat_int = []
                res.info.goods_cat.split(",").forEach(data=>{
                     goods_cat_int.push(+data)
                })
                this.addForm.goods_cat = goods_cat_int
                const filelistPic = []
                const addFormPic = []
                JSON.parse(res.info.pic).forEach(item=>{
                    let pic1= {url:item.pic}
                    filelistPic.push(pic1)

                    let pic2= {tmp_path:item.pic}
                    addFormPic.push(pic2)
                })
                this.fileList = filelistPic
                this.addForm.pic = addFormPic
            }else{
                this.goods_id = '';
            }
        },
        async getCateList(){
            const {data:res} = await this.$http.get('cateList?type=3')
            if(res.msg.status !== 200 ) return this.$message.error('获取分类数据失败')
            this.catelist = res.info.data
        },
        handleChange(){
            console.log(this.addForm.goods_cat)
        },

        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName === '0' && this.addForm.goods_cat.length!==3){
                this.$message.error('商品分类选择出错');
                return false
            }
        },

        async tabClicked(){
            if(this.activeIndex === '1'){
                const {data:res} = await this.$http.get('getDynamic?cat_id='+this.catId+"&sel=dynamic")
                if(res.msg.status !== 200 ) return
                res.info.forEach(item => {
                    item.attr_vals = item.attr_vals?item.attr_vals.split(","):[]
                });
                this.dynamicData = res.info
            }else if(this.activeIndex === '2'){
                const {data:res} = await this.$http.get('getDynamic?cat_id='+this.catId+"&sel=static")
                if(res.msg.status !== 200 ) return
                this.staticData = res.info
            }
        },

        handlePreview(file){
            this.previewPic = file.response.url
            this.previewDialogVisible = true
        },
        handleRemove(file){
            // console.log(file)
            if(file.response){
                const filepath = file.response.tmp_path 
            }else{
                const filepath = file.url
            }
            const i = this.addForm.pic.findIndex(x=>x.filepath)
            this.addForm.pic.splice(i,1)
            console.log(this.addForm.pic)
        },
        handleSuccess(response){
            const picInfo = {pic:response.tmp_path}
            this.addForm.pic.push(picInfo);
            console.log(this.addForm.pic)
        },

        add(){
            this.$refs.addFormRuleForm.validate(async valid=>{
                if(!valid) return this.$message.error('参数出错')
                const form = _.cloneDeep(this.addForm)
               form.goods_cat = form.goods_cat.join()
            //    console.log(this.addForm.goods_vals)
                const {data:res} = await this.$http.post("proadd",form)
                if(res.msg.status !== 200 ) return this.$message.error('添加失败')
                this.$message.success('添加成功')
            })
        }

    },

    computed:{
        catId(){
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style lang="less" scoped>
.el-steps{
    margin-top:15px; font-size:14px;
}
.el-step__title {
    font-size: 14px!important;
    line-height: 38px;
}
</style>