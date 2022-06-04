<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="queryBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="资讯标题">
          <el-input placeholder="资讯标题" v-model="queryTable.infoTitle"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateInfomationList">查询</el-button>
          <el-button type="danger" @click="resetForm">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="primary" @click="dialogFormVisible = true">新增资讯</el-button>
    </div>
    <div>
      <el-table :data="information.list" style="width: 100%" stripe>
        <el-table-column prop="title" label="新闻标题" :min-width="180"> </el-table-column>
        <el-table-column prop="introduction" label="简介" :min-width="180"> </el-table-column>
        <el-table-column label="操作" :min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="showinfo(scope.row)">查看</el-button>
            <el-button type="primary" round size="mini" @click="showUpdateInformation(scope.row)">修改</el-button>
            <el-button type="danger" round size="mini" @click="deleteInformationByID(scope.row.id)">删除</el-button>
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
    <el-dialog title="新增资讯" :visible.sync="dialogFormVisible" width="50%">
      <el-form>
        <el-form-item label="资讯标题" :label-width="formLabelWidth">
          <el-input v-model="addInformationFormInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="资讯简介" :label-width="formLabelWidth">
          <el-input v-model="addInformationFormInfo.introduction"></el-input>
        </el-form-item>
        <el-form-item label="资讯封面" :label-width="formLabelWidth">
          <el-input v-model="addInformationFormInfo.picture"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <quill-editor v-model="addInformationFormInfo.content"> </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addInformation">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="资讯修改" :visible.sync="dialogupdateFormVisible" width="50%">
      <el-form>
        <el-form-item label="资讯标题" :label-width="formLabelWidth">
          <el-input v-model="updateInformationFormInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="资讯简介" :label-width="formLabelWidth">
          <el-input v-model="updateInformationFormInfo.introduction"></el-input>
        </el-form-item>
        <el-form-item label="资讯封面" :label-width="formLabelWidth">
          <el-input v-model="updateInformationFormInfo.picture"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <quill-editor v-model="updateInformationFormInfo.content"> </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogupdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateInformation">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="资讯查看" :visible.sync="show1" width="50%">
      <el-form>
        <el-form-item label="资讯标题" :label-width="formLabelWidth">
          <el-input disabled v-model="show.title"></el-input>
        </el-form-item>
        <el-form-item label="资讯简介" :label-width="formLabelWidth">
          <el-input disabled v-model="show.introduction"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input disabled v-model="show.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show1 = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InformationManagement',

  data() {
    return {
      show1: false,
      show: {},
      addInformationFormInfo: {
        title: '',
        introduction: '',
        picture: '',
        content: ''
      },
      updateInformationFormInfo: {
        id: '',
        title: '',
        introduction: '',
        picture: '',
        content: ''
      },
      dialogFormVisible: false,
      dialogupdateFormVisible: false,
      information: {},
      queryTable: {
        infoTitle: ''
      },
      formLabelWidth: '120px',
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
        totalPage: 0
      }
    }
  },

  mounted() {
    this.getInfomationList()
  },

  methods: {
    deleteInformationByID(id) {
      const res = this.$http.get('news/deleteByID', {
        params: {
          id: id
        }
      })
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          this.$message.success('资讯删除成功')
          this.getInfomationList()
        } else {
          this.$message.error('资讯删除失败')
        }
      })
    },
    showinfo(row) {
      this.show = row
      this.show1 = true
    },
    updateInformation() {
      this.dialogupdateFormVisible = false
      const res = this.$http.post('news/update', this.updateInformationFormInfo)
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          this.$message.success('资讯修改成功')
          this.getInfomationList()
        } else {
          this.$message.error('资讯修改失败')
        }
      })
    },
    handleSizeChange(size) {
      this.pageInfo.limit = size
      this.getInfomationList()
    },
    handleCurrentChange(page) {
      this.pageInfo.page = page
      this.getInfomationList()
    },
    showUpdateInformation(row) {
      this.updateInformationFormInfo = row
      this.dialogupdateFormVisible = true
    },
    addInformation() {
      this.dialogFormVisible = false
      const res = this.$http.post('news/save', this.addInformationFormInfo)
      Promise.all([res]).then((data) => {
        if (data[0].data.code === 200) {
          this.$message.success('资讯新增成功')
          this.getInfomationList()
        } else {
          this.$message.error('资讯新增失败')
        }
      })
    },
    updateInfomationList() {
      this.getInfomationList()
      this.queryTable.infoTitle = ''
    },
    getInfomationList() {
      const res = this.$http.get('news/page', {
        params: {
          page: this.pageInfo.page,
          limit: this.pageInfo.limit,
          title: this.queryTable.infoTitle === '' ? null : this.queryTable.infoTitle
        }
      })
      Promise.all([res]).then((data) => {
        if (data[0].data.code !== 200) {
          return this.$message.error('获取资讯列表失败！')
        }
        this.information = data[0].data.data
        this.pageInfo.page = this.information.currPage
        this.pageInfo.limit = this.information.pageSize
        this.pageInfo.total = this.information.total
        this.pageInfo.totalPage = this.information.totalPage
      })
    },
    resetForm() {
      this.queryTable.infoTitle = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
