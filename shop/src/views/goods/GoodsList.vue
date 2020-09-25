<template>
    <div>
         <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="10">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.keywords"  clearable @clear="getlist"> 
                        <el-button slot="append" icon="el-icon-search" @click="getlist()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3" style="margin-left:15px;">
                    <el-button type="primary" @click="goGoodsAdd">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 列表表格区域 -->

            <el-table :data="goodslist" border stripe>
                <el-table-column label="#" type='index'></el-table-column>
                <el-table-column label="商品名称" prop='goods_name'></el-table-column>
                <el-table-column label="商品价格" prop='goods_price'></el-table-column>
                <el-table-column label="商品重量" prop='goods_weight'></el-table-column>
                <el-table-column label="商品数量" prop='goods_num'></el-table-column>
                <el-table-column label="商品数量" prop='addtime'></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="editGoods(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small"  @click="deleteGoods(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            queryInfo:{
                keywords:'',
                pagenum:1,
                pagesize:5
            },
            total : 0,
            goodslist:[]
        }
    },

    created(){
        this.getlist()
    },


    methods:{
        async getlist(){
           const {data:res} = await this.$http.get('getGoodsList',{params:this.queryInfo})
           if(res.msg.status!==200) return this.$message.error('获取数据出错')
           this.goodslist = res.info.data
           this.total = res.info.total
        },
        goGoodsAdd(){
            this.$router.push('goods/add')
        },

        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getlist()
        },

        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getlist()
        },

        editGoods(row){
            this.$router.push({path:'/goods/add',query:{goods_id:row.goods_id}})
        },

        async deleteGoods(row){
            const optres = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)

            if(optres === 'confirm'){
                const {data:res} = await this.$http.get('deleteGoods?goods_id='+row.goods_id)
                if(res.msg.status !== 200) return this.$message.error('删除失败')
                this.$message.success('删除成功');
                this.getlist()
            }else{
                return this.$message.info('您取消了操作')
            }
        }
    }
}
</script>

<style lang="less" scoped>

</style>