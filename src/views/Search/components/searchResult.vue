<template>
  <div class="content">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(result, index) in results" :key="index" :title="result.title" />
    </van-list>
  </div>
</template>

<script>
// import { setItem } from '../../../utils/storage'
import { getSearchResult } from '../../../api/user'
export default {
  data () {
    return {
      loading: false,
      finished: false,
      results: [],
      page: 1, // 页码
      perPage: 20 // 煤业数量
    }
  },

  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      const { data } = await getSearchResult({ page: this.page, per_page: this.perPage, q: this.searchText })
      // console.log(data)
      // 将数据添加到results数组中
      this.results.push(...data.data.results)
      // 关闭本次loading
      this.loading = false
      // 判断是否还有数据
      if (data.data.results.length > 0) {
        // 如果有则页数加一
        this.page += 1
      } else {
        // 如果没有则完成
        this.finished = true
      }
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  position: fixed;
  top: 108px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
}
</style>
