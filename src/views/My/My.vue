<template>
  <div class="container">
    <van-cell-group class="my-info" v-if="user">
      <van-cell title="单元格" value="内容" center class="base-info" :border="false">
        <van-image
        class="avater"
          round
          :src="useInfo.photo"
          slot="icon"
          fit="cover"
        />
        <div slot="title" class="name">{{useInfo.name}}</div>
        <van-button
        class="updata-btn"
         size="small"
         round
        >编辑资料</van-button>
      </van-cell>
    <van-grid :border="false" class="data-info">
      <van-grid-item text="头条" class="info-item" ><span slot="icon">{{useInfo.art_count}}</span></van-grid-item>
      <van-grid-item text="关注" class="info-item"><span slot="icon">{{useInfo.follow_count}}</span></van-grid-item>
      <van-grid-item text="粉丝" class="info-item"><span slot="icon">{{useInfo.fans_count}}</span></van-grid-item>
      <van-grid-item text="获赞" class="info-item"><span slot="icon">{{useInfo.like_count}}</span></van-grid-item>
    </van-grid>
  </van-cell-group>
  <div class="not-login" v-else @click="$router.push('/login')">
    <div>
      <img class="mobile" src="./touxiang.png" alt="">
    </div>
    <div class="text">
      登录/注册
    </div>
  </div>
    <van-grid :column-num="2" class="nav-grid mb-8">
      <van-grid-item class="iconfont nav-grid-item" icon-prefix="icon" icon="shoucang" text="收藏"/>
      <van-grid-item class="iconfont nav-grid-item" icon-prefix="icon" icon="lishi" text="历史" />
    </van-grid>
    <van-cell title="消息通知" is-link v-if="user"  to=""/>
    <van-cell title="小智同学" class="mb-8" is-link  to=""/>
    <van-button type="danger" size="large" v-if="user" @click="layout">退出登录</van-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Dialog } from 'vant'
import { userInfo } from '../../api/user'
export default {
  data () {
    return {
      useInfo: {}
    }
  },
  computed: {
    ...mapState(['user', 'userInfo'])
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    layout () {
      Dialog.confirm({
        title: '退出登录',
        message: '您确认退出吗?'
      })
        .then(() => {
          this.$store.commit('setUser', '')
          this.$router.replace('/login')
          // on confirm
        })
    },
    async getUserInfo () {
      const { data } = await userInfo()
      this.useInfo = data.data
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  .my-info{
    background: url("./banner.png") no-repeat;
    background-size: cover;
    .base-info{
      padding: 76px auto  22px;
      box-sizing: border-box;
      height: 230px;
      background-color: unset;
      .avater{
      box-sizing: border-box;
        width: 132px;
        height: 132px;
        border: 1px solid #fff;
        margin-right: 22px;
      }
      .name{
        color: snow;
        font-size: 30px;
      }
      .updata-btn{
        height: 32px;
        font-size: 10px;
        color: #666;
      }
    }
    .data-info{
      .info-item{
      height: 130px;
      color: #fff;
      font-size: 36px;
      /deep/.van-grid-item__text{
        color:#fff;
        font-size: 22px;
      }
      }
    }
   /deep/ .van-grid-item__content{
      background-color: unset;
    }
  }
  .not-login{
    height: 360px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile{
      width: 132px;
      height: 132px;
    }
    .text{
      color: snow;
      font-size: 28px;
    }
  }
  /deep/.nav-grid{
      .nav-grid-item{
        height: 140px;
        .icon{
          font-size: 44px;
        }
        .icon-shoucang{
            color: #eb5253;
          }
        .icon-lishi{
          color: #ff9d1d;
        }
        .van-grid-item__text{
          font-size: 28px;
          color: #333;
        }
      }
    }
  .van-button--large{
      width: 90%;
     transform: translateX(5%);
    //  height: 100%;
    margin-top: 80px;
    }
    .mb-8{
      margin-bottom: 8px;
    }
}
</style>
