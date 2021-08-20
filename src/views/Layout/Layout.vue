<template>
  <div class="layout-container">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <van-tabbar route v-model="active">
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/wa" icon="comment-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/my" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      active: 0
    }
  },
  mounted () {
    this.$store.commit('addCachePage', 'Layout')
  }
}
</script>

<style lang="less" scoped>
</style>
