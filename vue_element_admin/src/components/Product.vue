<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="queryBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="商品分类">
          <el-select placeholder="商品分类" v-model="queryTable.type">
            <el-option :label="item.shangpinfenlei" :value="item.shangpinfenlei" v-for="item in productTypeList.list" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input placeholder="商品名称" v-model="queryTable.productName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateProductList">查询</el-button>
          <el-button type="danger" @click="resetForm">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="primary" @click="dialogFormVisible = true">新增商品</el-button>
    </div>
    <div>
      <el-table :data="productInfo.list" style="width: 100%" stripe>
        <el-table-column prop="shangpinbianhao" label="商品编号" :min-width="180"> </el-table-column>
        <el-table-column prop="shangpinfenlei" label="商品分类" :min-width="180"> </el-table-column>
        <el-table-column prop="shangpinmingcheng" label="商品名称" :min-width="180"> </el-table-column>
        <el-table-column prop="price" label="价格" :min-width="180"> </el-table-column>
        <el-table-column label="操作" :min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="showUpdateProductInfo(scope.row)">修改</el-button>
            <el-button type="danger" round size="mini" @click="deleteProductConfirm(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>
    <!-- Form -->
    <el-dialog title="商品新增" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="商品编号" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="addProductFormInfo.shangpinbianhao"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="addProductFormInfo.shangpinmingcheng"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-select placeholder="商品分类" v-model="addProductFormInfo.shangpinfenlei">
            <el-option :label="item.shangpinfenlei" :value="item.shangpinfenlei" v-for="item in productTypeList.list" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品品牌" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="addProductFormInfo.pinpai"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="addProductFormInfo.guige"></el-input>
        </el-form-item>
        <el-form-item label="商品详情" :label-width="formLabelWidth">
          <quill-editor v-model="addProductFormInfo.xiangqing"></quill-editor>
        </el-form-item>
        <el-form-item label="商品封面" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="addProductFormInfo.fengmian"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input type="number" v-model="addProductFormInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="商品单限" :label-width="formLabelWidth">
          <el-input type="number" v-model="addProductFormInfo.onelimittimes"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" :label-width="formLabelWidth">
          <el-input type="number" v-model="addProductFormInfo.alllimittimes"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProduct">确 定</el-button>
      </div>
    </el-dialog>
    <!-- Form -->
    <el-dialog title="商品修改" :visible.sync="dialogUpdateProductFormVisible">
      <el-form>
        <el-form-item label="商品编号" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="updateProductFormInfo.shangpinbianhao"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="updateProductFormInfo.shangpinmingcheng"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-select placeholder="商品分类" v-model="updateProductFormInfo.shangpinfenlei">
            <el-option :label="item.shangpinfenlei" :value="item.shangpinfenlei" v-for="item in productTypeList.list" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品品牌" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="updateProductFormInfo.pinpai"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="updateProductFormInfo.guige"></el-input>
        </el-form-item>
        <el-form-item label="商品详情" :label-width="formLabelWidth">
          <quill-editor v-model="updateProductFormInfo.xiangqing"></quill-editor>
        </el-form-item>
        <el-form-item label="商品封面" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="updateProductFormInfo.fengmian"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input type="number" v-model="updateProductFormInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="商品单限" :label-width="formLabelWidth">
          <el-input type="number" v-model="updateProductFormInfo.onelimittimes"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" :label-width="formLabelWidth">
          <el-input type="number" v-model="updateProductFormInfo.alllimittimes"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateProductFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateProductByID">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Product',
  data() {
    return {
      addProductFormInfo: {
        shangpinbianhao: '', // 商品编号
        shangpinmingcheng: '', // 商品名称
        shangpinfenlei: '', // 商品分类
        pinpai: '', // 商品品牌
        guige: '', // 商品规格
        xiangqing: '', // 商品详情
        fengmian: '', // 商品封面
        price: '', // 商品价格
        onelimittimes: '', // 商品单限
        alllimittimes: '' // 商品库存
      },
      updateProductFormInfo: {
        id: '', // 商品id
        shangpinbianhao: '', // 商品编号
        shangpinmingcheng: '', // 商品名称
        shangpinfenlei: '', // 商品分类
        pinpai: '', // 商品品牌
        guige: '', // 商品规格
        xiangqing: '', // 商品详情
        fengmian: '', // 商品封面
        price: '', // 商品价格
        onelimittimes: '', // 商品单限
        alllimittimes: ''// 商品库存
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogUpdateProductFormVisible: false,
      productInfo: {},
      productTypeList: {},
      queryTable: {
        type: '',
        productName: ''
      },
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
        totalPage: 0
      }
    }
  },
  mounted() {
    this.getProductTypeList()
    this.getProductList()
  },

  methods: {
    handleSizeChange(size) {
      this.pageInfo.limit = size
      this.getProductList()
    },
    handleCurrentChange(page) {
      this.pageInfo.page = page
      this.getProductList()
    },
    deleteProductByID(id) {
      const res = this.$http.get('shangpinxinxi/deleteByID', {
        params: {
          id: id
        }
      })
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          this.$message.success('商品删除成功')
          this.getProductList()
        } else {
          this.$message.error('商品删除失败')
        }
      })
    },
    updateProductByID() {
      this.dialogUpdateProductFormVisible = false
      const res = this.$http.post('shangpinxinxi/update', this.updateProductFormInfo)
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          this.$message.success('商品修改成功')
          this.getProductList()
        } else {
          this.$message.error('商品修改失败')
        }
      })
    },
    showUpdateProductInfo(row) {
      this.updateProductFormInfo = row
      this.dialogUpdateProductFormVisible = true
    },
    addProduct() {
      this.dialogFormVisible = false
      const res = this.$http.post('shangpinxinxi/save', this.addProductFormInfo)
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          this.$message.success('商品新增成功')
          this.getProductList()
        } else {
          this.$message.error('商品新增失败')
        }
      })
    },
    resetForm() {
      this.queryTable.type = ''
      this.queryTable.productName = ''
    },
    updateProductList() {
      this.getProductList()
    },
    getProductList() {
      const res = this.$http.get('shangpinxinxi/page', {
        params: {
          page: this.pageInfo.page,
          limit: this.pageInfo.limit,
          shangpinfenlei: this.queryTable.type === '' ? null : this.queryTable.type,
          shangpinmingcheng: this.queryTable.productName === '' ? null : this.queryTable.productName
        }
      })
      Promise.all([res]).then((data) => {
        if (data[0].data.code !== 200) {
          return this.$message.error('获取商品列表失败！')
        }
        this.productInfo = data[0].data.productList
        this.pageInfo.page = this.productInfo.currPage
        this.pageInfo.limit = this.productInfo.pageSize
        this.pageInfo.total = this.productInfo.total
        this.pageInfo.totalPage = this.productInfo.totalPage
      })
    },
    getProductTypeList() {
      const res = this.$http.get('shangpinfenlei/page', {
        params: {
          page: 1,
          size: 10000
        }
      })

      Promise.all([res]).then((data) => {
        if (data[0].data.code !== 200) {
          return this.$message.error('获取商品类型列表失败！')
        }
        this.productTypeList = data[0].data.data
      })
    },
    deleteProductConfirm(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteProductByID(id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
