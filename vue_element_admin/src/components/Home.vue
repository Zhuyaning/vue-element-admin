<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/sirfuao.jpg" alt="" />
        <span>游戏周边商城后台管理系统</span>
      </div>
      <div class="btn">
        <el-button style="margin-right: 12px" type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" v-for="item in menulist" :key="item.index" :router="true">
          <el-menu-item :index="item.index">
            <i :class="item.icon"></i>
            <span slot="title" style="color: white">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [
        { index: '/proManage', title: '商品管理', icon: 'el-icon-goods' },
        { index: '/orderManage', title: '订单管理', icon: 'el-icon-plus' },
        { index: '/informationManagement', title: '资讯管理', icon: 'el-icon-circle-plus' },
        { index: '/proTypeManage', title: '分类管理', icon: 'el-icon-circle-plus' }
      ],
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  // padding: 15px 0;
  height: 80px !important;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }

  img {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    margin: 15px 0px 15px 15px;
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-menu-item {
  background-color: #333744;
}
</style>
