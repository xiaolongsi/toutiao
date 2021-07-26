import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '../store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/Login.vue'),
    meta: { requiresAuth: false }
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
        component: () => import('../views/Home/Home.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/wa',
        component: () => import('../views/wa/wa.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/video',
        component: () => import('../views/Video/Video.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('../views/My/My.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/search',
    component: () => import('../views/Search/Search.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/article/:articleId',
    component: () => import('../views/Article/article.vue'),
    // 将动态路由参数映射到组件的props中
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/userProfile',
    component: () => import('../views/user-profile/userProfile.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/userChat',
    component: () => import('../views/user-chat/UserChat.vue'),
    meta: { requiresAuth: true }
  }
]
const router = new VueRouter({
  routes
})

// to:要访问的路由页面信息
// from：来自那个页面的路由信息
// next：放行的标记
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.state.user) {
      return next()
    }
    // 校验登录状态
    Dialog.confirm({
      title: '访问提示',
      message: '需要登录权限,是否去登陆'
    })
      .then(() => {
        router.push({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => {
        // 取消     中断导航
        next(false)
      })
  } else {
    // 不需要登录权限的页面直接过去
    next()
  }
})

export default router
