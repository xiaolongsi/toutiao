import axios from 'axios'

import store from '../store/index'

import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '../router/index'

const request = axios.create({
  // 基础路径
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [function (data) {
    try {
      // console.log(JSONbig.parse(data))
      return JSONbig.parse(data)
    } catch (error) {
      // console.log(error)
      return data
    }
  }]
})
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config)
  // 如果有用户信息 就给接口请求加上header的Authorization
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response.status
  if (status === 401) {
    // token无效
    // 没有user
    const { user } = store.state
    if (!user || !user.token) {
      // console.log(1)
      return redirectLogin()
    }
    // 使用refresh_token请求获取新的token
    try {
      const { data } = await refreshTokenReq({
        url: '/app/v1_0/authorizations',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // console.log(data)
      user.token = data.data.token
      store.commit('setUser', user)
      // 将失败的请求发出去
      return request(error.config)
    } catch (error) {
      // 刷新token失败  跳转到登录页
      redirectLogin()
    }
  } else if (status === 403) {
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务器错误
    Toast.fail('服务器异常')
  } else if (status === 400) {
    // 客户端参数错误
    Toast.fail('客户端请求参数异常')
  }
  // 请求响应失败进入 状态码超过2xx
  return Promise.reject(error)
})
function redirectLogin () {
  router.replace({
    name: 'login',
    query: {
      // 数据名是自己起的  router.currentRoute 和 我们在组建中获取的this.$route是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}
export default request
