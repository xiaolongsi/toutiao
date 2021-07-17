<template>
  <div class="content">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button size="mini" type="danger" plain round @click="isEdit=!isEdit">{{!this.isEdit?'编辑':'完成'}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item :class="{active:index===active}" class="grid-item" :icon="(isEdit && index!=0)?'clear':''"  @click="userChannelClick(channel, index)" v-for="(channel,index) in userChannels" :key="index" :text="channel.name" />
    </van-grid>
    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item @click="onAdd(channel)" class="grid-item" v-for="(channel,index) in recommendChannels" :key="index" :text="channel.name" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '../../api/user'
import { mapState } from 'vuex'
import { setItem } from '../../utils/storage'
export default {
  data () {
    return {
      allChannels: [], // 所有频道数据列表
      isEdit: false // 控制编辑显示状态
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐的频道列表
    recommendChannels () {
      // 所有频道减去我的频道=剩下的频道
      return this.allChannels.filter(e => {
        return !this.userChannels.find(c => { return e.id === c.id })
      })
    }
  },
  created () {
    this.mapAllChannels()
  },
  methods: {
    async mapAllChannels () {
      const { data } = await getAllChannels()
      // console.log(data)
      this.allChannels = data.data.channels
    },
    async onAdd (channel) {
      this.userChannels.push(channel)
      // 数据持久化
      if (this.user) {
        // 登陆了  数据存储到线上
        await addUserChannel({ channels: [{ id: channel.id, seq: this.userChannels.length }] })
      } else {
        // 没登录 数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    async userChannelClick (channel, index) {
      // 编辑状态，删除频道
      // 非编辑状态，切换频道
      if (this.isEdit && index !== 0) {
        // 如果删除的是当前激活频道之前的频道
        if (index <= this.active) {
          this.$emit('updataActive', this.active - 1)
        }
        this.userChannels.splice(index, 1)
        // 数据持久化
        if (this.user) {
          await deleteUserChannel(channel.id)
        } else {
          setItem('user-channels', this.userChannels)
        }
      } else {
        // 分发给父组件  使其关闭弹出层 并且切换频道
        this.$emit('showPopu')
        this.$emit('updataActive', index)
      }
    }
  },
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  padding-top: 108px;
  .channel-title{
    font-size: 32px;
    color: #333;
  }
  .grid-item{
    width: 160px;
    height: 86px;
   /deep/ .van-grid-item__content{
      background-color: #f4f5f6;
      .van-grid-item__text{
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon{
      position: absolute;
      right: -16px;
      top: -10px;
      font-size: 40px;
      color: #ccc;
    }
  }
  /deep/.active{
    .van-grid-item__text{
      color: tomato !important;
    }
  }
}
</style>
