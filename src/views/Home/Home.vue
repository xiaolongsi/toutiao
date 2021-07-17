<template>
  <div class="container">
      <van-nav-bar class="app-nav-bar">
        <van-button
        slot="title"
        class="iconfont search-btn"
        icon-prefix="icon"
        icon="sousuo"
        round
        @click="$router.push('/search')"
        >搜索</van-button>
      </van-nav-bar>

      <!-- 文章频道列表 -->
      <van-tabs v-model="active">
        <van-tab :title="channel.name" v-for="(channel, index) in channels" :key="index">
          <Content :channel="channel"></Content>
        </van-tab>
        <!-- 站位最后一个 跟标签一样大 就不会挡住了 -->
        <div slot="nav-right" class="shak"></div>
        <!-- 汉堡标签 -->
      <div slot="nav-right" @click="show=true" class="wap-nav-wrap">
        <van-icon name="wap-nav"></van-icon>
      </div>
      </van-tabs>
<!-- 弹出层不属于任何组件的子元素  所以挂载到body上比较好  get-container="body" -->
      <van-popup
      class="popup"
        v-model="show"
        closeable
        position="bottom"
        get-container="body"
      ><ChannelEdit :userChannels="channels" :active="active" @updataActive="updataActive" @showPopu="show=false"></ChannelEdit></van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '../../api/user.js'
import Content from './Content.vue'
import ChannelEdit from './ChannelEdit.vue'
import { mapState } from 'vuex'
import { getItem } from '../../utils/storage.js'
export default {
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 保存频道数组
      show: false // 弹出层
    }
  },
  created () {
    this.getChannels()
  },
  methods: {
    async getChannels () {
      if (this.user) {
        const { data } = await getUserChannels()
        // console.log(data)
        this.channels = data.data.channels
      } else {
        // 未登录  判断是否有本地存储的频道列表数据
        const localChannels = getItem('user-channels')
        if (localChannels) {
          this.channels = localChannels
        } else {
          // 用户没有登陆 也没有本地存储 获取推荐的列表
          const { data } = await getUserChannels()
          // console.log(data)
          this.channels = data.data.channels
        }
      }
    },
    // 关闭弹出层 并 切换频道
    updataActive (index) {
      this.active = index
    }
  },
  components: {
    Content,
    ChannelEdit
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.container{
  .app-nav-bar{
    /deep/.van-nav-bar__title{
      max-width: unset;
      .search-btn{
        background: #5babfb;
        border: none;
        width: 555px;
        height: 64px;
         color: snow;
        .van-button__icon{
          font-size: 32px;
        }
        .van-button__text{
          font-size: 28px;
        }
      }
    }
  }
  /deep/.van-tab{
    border-right: 1px solid #edeff3;
    &:nth-last-child(1){
      border-right: none;
    }
    border-bottom: 1px solid #edeff3;
  }
  /deep/.van-tabs__line{
    width: 30px;
    height: 6px;
    background-color: #3296fa;
    bottom: 40px;
  }
  .wap-nav-wrap{
    position: fixed;
    right: 0;
    height: 88px;
    background-color: #fff;
    opacity: .9;
    .van-icon-wap-nav{
    top: 40px;
    transform: translateY(-50%);
    }
  }
  .shak{
    width: 44px;
    flex-shrink: 0;
  }
}
.popup{
    height: 100%;
  }
</style>
