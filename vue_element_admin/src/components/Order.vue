<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="queryBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input placeholder="订单号" v-model="queryTable.orderID"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="queryTable.orderStatus">
            <el-option :label="s" :value="s" v-for="(s, index) in orderStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateOrderInfo">查询</el-button>
          <el-button type="danger" @click="resetForm">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="orderInfo.list" style="width: 100%" stripe>
        <el-table-column prop="orderid" label="订单号" :min-width="180"> </el-table-column>
        <el-table-column prop="userid" label="用户ID" :min-width="150"> </el-table-column>
        <el-table-column prop="goodid" label="商品ID" :min-width="150"> </el-table-column>
        <el-table-column prop="goodname" label="商品名称" :min-width="150"> </el-table-column>
        <el-table-column prop="buynumber" label="数量" :min-width="80" align="center"> </el-table-column>
        <el-table-column prop="total" label="总价" :min-width="80" align="center"> </el-table-column>
        <el-table-column prop="status" label="订单状态" :min-width="80"> </el-table-column>
        <el-table-column prop="address" label="收获地址" :min-width="300"> </el-table-column>
        <el-table-column prop="tel" label="电话" :min-width="180"> </el-table-column>
        <el-table-column prop="consignee" label="收货人" :min-width="80"> </el-table-column>
        <el-table-column label="操作" :min-width="150">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="showUpdateOrder(scope.row)">修改</el-button>
            <el-button type="danger" round size="mini" @click="shipping(scope.row)" :disabled="scope.row.status === '已支付' ? false : true">发货</el-button>
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
    <el-dialog title="订单修改" :visible.sync="dialogUpdateFormVisible" width="35%">
      <el-form>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input type="number" v-model="updateOrderFormInfo.buynumber"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="updateOrderFormInfo.status">
            <el-option :label="s" :value="s" v-for="(s, index) in orderStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth">
          <el-input v-model="updateOrderFormInfo.address"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="updateOrderFormInfo.tel"></el-input>
        </el-form-item>
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input v-model="updateOrderFormInfo.consignee"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrder">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Order',
  data() {
    return {
      orderStatus: ['未支付', '已支付', '已发货', '已完成', '已退款', '已取消'],
      queryTable: {
        orderID: '',
        orderStatus: ''
      },
      orderInfo: {},
      formLabelWidth: '120px',
      dialogUpdateFormVisible: false,
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
        totalPage: 0
      },
      updateOrderFormInfo: {
        id: '',
        buynumber: 0,
        status: '',
        address: '',
        tel: '',
        consignee: ''
      }
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    shipping(row) {
      console.log(row.status)
      if (row.status === '已支付') {
        row.status = '已发货'
        this.updateOrderFormInfo = row
        this.updateOrder('shipping')
      } else {
        this.$message.error('发货失败')
      }
    },
    updateOrder(msg) {
      this.dialogUpdateFormVisible = false
      const res = this.$http.post('orders/update', this.updateOrderFormInfo)
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          if (msg === 'shipping') {
            this.$message.success('发货成功')
          } else {
            this.$message.success('订单修改成功')
          }

          this.getOrderList()
        } else {
          this.$message.error('订单修改失败')
        }
      })
    },
    showUpdateOrder(row) {
      this.updateOrderFormInfo = row
      this.dialogUpdateFormVisible = true
    },
    updateOrderInfo() {
      this.getOrderList()
    },
    handleSizeChange(size) {
      this.pageInfo.limit = size
      this.getOrderList()
    },
    handleCurrentChange(page) {
      this.pageInfo.page = page
      this.getOrderList()
    },
    resetForm() {
      this.queryTable.orderID = ''
      this.queryTable.orderStatus = ''
    },
    getOrderList() {
      const res = this.$http.get('orders/page', {
        params: {
          page: this.pageInfo.page,
          limit: this.pageInfo.limit,
          orderid: this.queryTable.orderID === '' ? null : this.queryTable.orderID,
          status: this.queryTable.orderStatus === '' ? null : this.queryTable.orderStatus
        }
      })
      Promise.all([res]).then((data) => {
        if (data[0].data.code !== 200) {
          return this.$message.error('获取订单列表失败！')
        }
        this.orderInfo = data[0].data.data
        this.pageInfo.page = this.orderInfo.currPage
        this.pageInfo.limit = this.orderInfo.pageSize
        this.pageInfo.total = this.orderInfo.total
        this.pageInfo.totalPage = this.orderInfo.totalPage
      })
    }
  }
}
</script>

<style>
</style>
