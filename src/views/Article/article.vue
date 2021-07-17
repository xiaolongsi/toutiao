<template>
  <div class="container">
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <h1 class="title">还是擦擦</h1>
    <van-cell center class="user-info">
      <div slot="title" class="name">天涯</div>
      <van-image slot="icon" class="avatar" round fit="cover"></van-image>
      <div slot="label" class="pubdate">14小时前</div>
      <van-button round size="small" icon="plus" class="btn" type="info">关注</van-button>
    </van-cell>
    <div class="content">
      <p>da</p>
      <p>dsads</p>
    </div>
  </div>
</template>

<script>
import { getArticalById } from '../../api/user'
export default {
  data () {
    return {}
  },

  mounted () {
    this.loadArtical()
  },

  methods: {
    async loadArtical () {
      const { data } = await getArticalById(this.articleId)
      console.log(data)
    }
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.title{
  font-size: 40px;
  color: #3a3a3a;
  padding: 28px;
  margin: 0;
  background-color: #fff;
}
.content{
  padding: 14px;
  background-color: #fff;
}
.user-info{
  .name{
    font-size: 24px;
    color:#333;
  }
  .pubdate{
    font-size: 22px;
    color: #b4b4b4;
  }
  .avatar{
    width: 70px;
    height: 70px;
    margin-right: 16px;
  }
  .btn{
    width: 170px;
    height: 60px;
  }
}
</style>
