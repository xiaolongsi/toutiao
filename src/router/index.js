import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login.vue')
  },
  {
    path: '/',
    component: () => import('../views/Layout/Layout.vue'),
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        component: () => import('../views/Home/Home.vue')
      },
      {
        path: '/wa',
        component: () => import('../views/wa/wa.vue')
      },
      {
        path: '/video',
        component: () => import('../views/Video/Video.vue')
      },
      {
        path: '/My',
        component: () => import('../views/My/My.vue')
      }
    ]
  },
  {
    path: '/search',
    component: () => import('../views/Search/Search.vue')
  },
  {
    path: '/article/:articleId',
    component: () => import('../views/Article/article.vue'),
    // 将动态路由参数映射到组件的props中
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
