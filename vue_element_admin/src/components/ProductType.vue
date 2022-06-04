<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="queryBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="商品分类">
          <el-input placeholder="商品分类" v-model="queryTable.productType"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateProductTypeInfo">查询</el-button>
          <el-button type="danger" @click="resetForm">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="primary" @click="dialogFormVisible = true">新增分类</el-button>
    </div>
    <div>
      <el-table :data="ProductTypeInfo.list" style="width: 100%" stripe>
        <el-table-column prop="id" label="ID" :min-width="180"> </el-table-column>
        <el-table-column prop="shangpinfenlei" label="分类名称" :min-width="180"> </el-table-column>
        <el-table-column label="操作" :min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="showUpdateProductTypeInfo(scope.row)">修改</el-button>
            <el-button type="danger" round size="mini" @click="deleteProductTypeByID(scope.row.id)">删除</el-button>
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
    <el-dialog title="新增分类" :visible.sync="dialogFormVisible" width="35%">
      <el-form>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-input v-model="addProductTypeFormInfo.shangpinfenlei"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProductType">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改分类" :visible.sync="dialogUpdateFormVisible" width="35%">
      <el-form>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-input v-model="updateProductTypeFormInfo.shangpinfenlei"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateProductType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProductType',
  data() {
    return {
      addProductTypeFormInfo: {
        shangpinfenlei: ''
      },
      updateProductTypeFormInfo: {
        id: '',
        shangpinfenlei: ''
      },
      queryTable: {
        productType: ''
      },
      ProductTypeInfo: {},
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogUpdateFormVisible: false,
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
  },
  methods: {
    handleSizeChange(size) {
      this.pageInfo.limit = size
      this.getProductTypeList()
    },
    handleCurrentChange(page) {
      this.pageInfo.page = page
      this.getProductTypeList()
    },
    deleteProductTypeByID(id) {
      const res = this.$http.get('shangpinfenlei/deleteByID', {
        params: {
          id: id
        }
      })
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          this.$message.success('商品分类删除成功')
          this.getProductTypeList()
        } else {
          this.$message.error('商品分类删除失败')
        }
      })
    },
    updateProductType() {
      this.dialogUpdateFormVisible = false
      const res = this.$http.post('shangpinfenlei/update', this.updateProductTypeFormInfo)
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          this.$message.success('商品分类修改成功')
          this.getProductTypeList()
        } else {
          this.$message.error('商品分类修改失败')
        }
      })
    },
    showUpdateProductTypeInfo(row) {
      this.updateProductTypeFormInfo = row
      this.dialogUpdateFormVisible = true
    },
    addProductType() {
      this.dialogFormVisible = false
      const res = this.$http.post('shangpinfenlei/save', this.addProductTypeFormInfo)
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          this.$message.success('商品分类新增成功')
          this.getProductTypeList()
        } else {
          this.$message.error('商品分类新增失败')
        }
      })
    },
    resetForm() {
      this.queryTable.productType = ''
    },
    updateProductTypeInfo() {
      this.getProductTypeList()
    },
    getProductTypeList() {
      const res = this.$http.get('shangpinfenlei/page', {
        params: {
          page: this.pageInfo.page,
          limit: this.pageInfo.limit,
          shangpinfenlei: this.queryTable.productType === '' ? null : this.queryTable.productType
        }
      })
      Promise.all([res]).then((data) => {
        if (data[0].data.code !== 200) {
          return this.$message.error('获取商品类型列表失败！')
        }
        this.ProductTypeInfo = data[0].data.data
        this.pageInfo.page = this.ProductTypeInfo.currPage
        this.pageInfo.limit = this.ProductTypeInfo.pageSize
        this.pageInfo.total = this.ProductTypeInfo.total
        this.pageInfo.totalPage = this.ProductTypeInfo.totalPage
      })
    }
  }
}
</script>

<style scoped>
</style>
