<template>
  <div class="content">
    <van-cell icon="search" v-for="(option, index) in options" :key="index" @click="$emit('search', option)">
      <div slot="title" v-html="hightLight(option)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestion } from '../../../api/user.js'
import { debounce } from 'lodash'
// const fn = debounce(function () {
//   console.log('hello')
// })
// fn()
export default {
  data () {
    return {
      options: []
    }
  },

  methods: {
    hightLight (option) {
      const reg = new RegExp(this.searchText, 'gi')
      return option.replaceAll(reg, `<span style="color:red">${this.searchText}</span>`)
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  // 当searchText发生变化时监听 触发
  watch: {
    // searchText () {
    //   console.log('c')
    // }
    searchText: {
      // 数据发生变化会执行handler函数
      // async handler (value) {
      //   // console.log(value)
      //   if (value !== '') {
      //     const { data } = await getSuggestion(value)
      //     // console.log(data)
      //     this.options = data.data.options
      //   }
      // }
      // 监听开始时立即调用
      // immediate: true
      handler: debounce(async function (value) {
        if (value !== '') {
          const { data } = await getSuggestion(value)
          // console.log(data)
          this.options = data.data.options
        }
      }, 300),
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
