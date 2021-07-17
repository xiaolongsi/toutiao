import request from '../utils/request'
// import store from '../store/index'

export const login = (data = {}) => {
  return request({
    method: 'POST',
    url: 'app/v1_0/authorizations',
    data
  })
}

export const code = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

export const userInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
// 获取频道内容
export const getContent = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取全部频道内容
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 添加指定用户频道内容
export const addUserChannel = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 删除指定用户频道内容
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 实现自动补全
export const getSuggestion = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: { q }
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取搜索内容
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取搜索历史
export const getSearchHistory = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories'
  })
}

// 获取文章详情
export const getArticalById = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}
