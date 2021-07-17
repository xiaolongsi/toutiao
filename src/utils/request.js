import axios from 'axios'

import store from '../store/index'

import JSONbig from 'json-bigint'

const request = axios.create({
  // 基础路径
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (error) {
      console.log(error)
      return data
    }
  }]
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
// 相应拦截器

export default request
