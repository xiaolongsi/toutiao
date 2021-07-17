// 本地存储封装模块

export const getItem = name => {
  return JSON.parse(window.localStorage.getItem(name)) || ''
}

export const setItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  return window.localStorage.setItem(name, value)
}

export const removeItem = (name) => {
  window.localStorage.removeItem(name)
}
