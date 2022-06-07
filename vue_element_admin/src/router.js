import Vue from 'vue'
import Router from 'vue-router'

// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

// import Product from './components/Product.vue'
const Product = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/Product.vue')

// import Order from './components/Order.vue'
const Order = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/Order.vue')

// import ProductType from './components/ProductType.vue'
const ProductType = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/ProductType.vue')

// import InformationManagement from './components/Information.vue'
const InformationManagement = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/Information.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/proManage', component: Product },
        { path: '/orderManage', component: Order },
        { path: '/proTypeManage', component: ProductType },
        { path: '/informationManagement', component: InformationManagement }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.localStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
