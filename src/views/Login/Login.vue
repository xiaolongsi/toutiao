<template>
  <div class="container">
    <van-nav-bar
      class="app-nav-bar"
      title="登录/注册"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- <div class="content">
      <form @submit.prevent="go()">
        <div class="item">
          <i class="iconfont icon-shouji"></i
          ><input type="tel" placeholder="请输入手机号" />
        </div>
        <div class="item">
          <i class="iconfont icon-yanzhengma"></i
          ><input type="" placeholder="请输入验证码" /><span>获取验证码</span>
        </div>
        <input class="submit" type="submit" value="登录" />
      </form>
      <div class="footer">隐私条款</div>
    </div> -->

    <!-- 基于Vant的表单验证
        1：使用vant-form组件包裹所有的表单项van-field
        2:当表单提交的时候会触发submit事件
          只有表单验证通过才会调用submit
        3 使用field的rules属性定义校验规则
     -->
    <van-form @submit="login">
      <van-field
      name="mobile"
      ref="login-form"
        placeholder="请输入手机号"
        class="iconfont"
        icon-prefix="icon"
        left-icon="shouji"
        v-model="mobile"
        :rules="formRules.mobile"
        :show-error='false'
        :validate-first='true'
        validate-trigger='onChange'
      />
      <van-field
      name="code"
        v-model="code"
        class="iconfont"
        icon-prefix="icon"
        left-icon="yanzhengma"
        clearable
        placeholder="请输入验证码"
        :rules="formRules.code"
        :show-error='false'
        :validate-first='true'
        ><template #button>
          <van-button class="send-btn" size="small" round @click.prevent="sendSms"  :disabled="isSend"
            >{{count? `${count}s`:'发送验证码'}}</van-button
          >
        </template></van-field
      >
      <div class="login-btn">
          <van-button class="btn" type="info" native-type="submit" block >登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, code } from '../../api/user'
import { Toast } from 'vant'
// import { mapState } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      mobile: '', // 手机号
      code: '', // 验证码
      formRules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      count: 0,
      isSend: false
    }
  },
  methods: {
    async login () {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        // 值为0是不会关闭
        duration: 0
      })
      try {
        const { data } = await login({ mobile: this.mobile, code: this.code })
        // console.log(data)
        this.$store.commit('setUser', data.data)
        Toast.success('登陆成功')
        // 清除layout的缓存 让他重新渲染
        this.$store.commit('removeCachePage', 'Layout')
        this.$router.replace(this.$route.query.redirect || '/')
      } catch (error) {
        // console.log(error)
        Toast.fail('登录失败')
        // console.log('登陆失败' + error)
      }
    },
    async  sendSms () {
      if (/^1[3|5|7|8|9]\d{9}$/.test(this.mobile)) {
        if (!this.count) {
          clearInterval(this.intervalId)
          try {
            this.isSend = true
            const data = await code(this.mobile)
            console.log(data)
          } catch (error) {
            console.log(error.response)
            if (error && error.response && error.response.status === 429) {
              this.$toast.fail('发送太频繁了，请稍后重试')
              this.isSend = false
              return
            }
          }
          this.count = 60
          this.intervalId = setInterval(() => {
            this.count--
            if (this.count === 0) {
              clearInterval(this.intervalId)
              this.isSend = false
            }
          }, 1000)
        }
      } else {
        this.$toast({
          message: '手机号错误',
          forbidClick: true,
          position: 'top'
        })
      }
    }
  }
}
</script>

<style lang="less">
@import "../../styles/index.less";
body {
  background-color: #f5f7f9;
}
.login-btn {
  padding: 52px 32px;
  .btn {
    background-color: #6db4fb;
    border: none;
    .van-button__text {
      font-size: 28px;
    }
  }
}
.send-btn {
  width: 160px;
  height: 46px;
  background-color: #ededed;
  .van-button__text {
    font-size: 22px;
    color: #666;
  }
}
.van-form {
  .van-field__left-icon {
    font-size: 46px;
  }
}

// position: relative;
//     .item {
//       position: relative;
//       margin-top: 20px;
//       i {
//         font-size: 50px;
//         // margin-top: 30px;
//       }
//       input {
//         width: 80%;
//         // height: 50px;
//         border: none;
//         border-bottom: 1px solid rgb(173, 173, 173);
//         padding: 10px 30px 30px;
//         // margin-top: 10px;
//         font-size: 30px;
//         // line-height: 16px;
//         color: gray;
//       }
//       span {
//         padding: 5px;
//         font-size: 14px;
//         border-radius: 20px;
//         border: 1px solid slategrey;
//         background-color: rgb(198, 204, 211);
//         position: absolute;
//         right: 20px;
//         bottom: 30px;
//       }
//     }
//     .submit {
//       width: 100%;
//       margin-top: 50px;
//       color: snow;
//       background-color: blue;
//       font-size: 30px;
//       border-radius: 10px;
//       height: 80px;
//       margin: 50px auto 0;
//     }
//     .footer {
//       position: absolute;
//       top: 1150px;
//       left: 50%;
//       transform: translateX(-50%);
//       font-size: 30px;
//     }
//   }
// }
</style>
