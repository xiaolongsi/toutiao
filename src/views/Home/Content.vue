<template>
  <div class="content">
    <van-pull-refresh v-model="isPullDownLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
      <!-- <van-cell v-for="(content, index) in contents" :key="index" :title="content.title" /> -->
      <ContentItem v-for="(content, index) in contents" :key="index" :content="content"></ContentItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getContent } from '../../api/user.js'
import ContentItem from '../../components/content-item/content-item.vue'
export default {
  data () {
    return {
      contents: [],
      loading: false,
      finished: false,
      timestamp: null, // 获取下页的时间戳
      isPullDownLoading: false // 下拉刷新的loading状态
    }
  },

  mounted () {

  },

  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      const { data } = await getContent({ channel_id: this.channel.id, timestamp: this.timestamp || Date.now(), with_top: 1 })
      // console.log(data)
      // for (let i = 0; i < data.data.results.length; i++) {
      //   this.list.push(data.data.results[i])
      // }
      const { results } = data.data
      this.contents.push(...results)
      this.loading = false
      if (!results.length) {
        // 如果没有数据则结束
        this.finished = true
      } else {
        // 获取下一页
        this.timestamp = data.data.pre_timestamp
      }
      // setTimeout(() => {
      //   // 开始会触发 onLoad
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束   本次加载结束  如果10 没铺满整个 再次调用onLoad    滑动触底时会触发 onLoad
      //   this.loading = false
      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     // 数据加载结束 不在触发加载更多
      //     this.finished = true
      //   }
      // }, 1000)
    },
    async onRefresh () {
      // 请求最新的时间戳  不一样的数据
      const { data } = await getContent({ channel_id: this.channel.id, timestamp: Date.now(), with_top: 1 })
      const { results } = data.data
      // 追加到contents的前面
      this.contents.unshift(...results)
      this.$toast(`更新${results.length}条数据`)
      // 把下拉状态调成false
      this.isPullDownLoading = false
    }
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ContentItem
  }
}
</script>

<style lang="less" scoped>
.content{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 100px;
  top: 180px;
  overflow: scroll;
  /deep/.van-cell__title{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
