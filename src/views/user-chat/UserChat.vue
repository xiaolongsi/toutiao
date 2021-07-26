<template>
  <div>
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 消息列表 -->
    <van-cell-group class="message" ref="message-list">
      <van-cell v-for="(message,index) in messages" :key="index" :title="message.msg"></van-cell>
    </van-cell-group>
    <!-- 发送消息 -->
    <van-cell-group class="cell">
      <van-field v-model="message" placeholder="请输入用户名" />
      <van-button size="small" type="primary" class="btn" @click="onSend">发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  created () {
    const socket = io('http://ttapi.research.itcast.cn')
    // socket.emit('message', { msg: 'hello', timestamp: Date.now() })
    this.socket = socket
    socket.on('connect', () => {
      console.log('连接建立成功')
    })
    socket.on('disconnect', () => {
      console.log('连接断开')
    })
    // 监听message消息
    socket.on('message', (data) => {
      // console.log(data)
      // 接收穿回来的数据
      this.messages.push(data)
    })
  },
  data () {
    return {
      message: '',
      socket: null,
      messages: [] // 消息列表
    }
  },
  props: {},
  methods: {
    onSend () {
      // 请求发送数据
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      // 把用户发送出去的消息存储到数组中
      this.messages.push(data)
      this.message = ''
    },
    scrollToBottom () {
      const list = this.$refs['.message-list']
      list.scrollTop = list.scrollHeight
    }
  },
  watch: {
    messages () {
      this.scrollToBottom()
    }
  },
  mounted () {
    this.scrollToBottom()
  }
}
</script>

<style lang="less" scoped>
.cell{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
  // font-size: 14px;
  .btn{
  // font-size: 14px;
  width: 20%;
  }
  .message{
  position: fixed;
  bottom: 88px;
  left: 0;
  right: 0;
  overflow: scroll;
  }
}
</style>
