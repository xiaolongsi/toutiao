<template>
  <div class="container">
    <!-- 头部信息 -->
    <van-nav-bar :title='`${replyComment.reply_count}条回复`'>
      <van-icon slot="left" name="cross" @click="$emit('close')"></van-icon>
    </van-nav-bar>
  <!-- 当前评论项 -->
    <van-cell center class="comment_item">
      <van-image
        slot="icon"
        round fit="cover"
        :src="replyComment.aut_photo"
        class="avatar"
      ></van-image>
      <div slot="title">
        <div class="title">
          <div class="name">{{replyComment.aut_name}}</div>
          <div class="like">
            <van-icon
              :name="replyComment.is_liking?'good-job':'good-job-o'"
              :class="{
                liked:replyComment.is_liking
              }"
              @click="onCommentLike(replyComment)"
            ></van-icon>
            <span>{{replyComment.like_count}}</span>
          </div>
        </div>
        <div class="content">{{replyComment.content}}</div>
      </div>
      <div slot="label" class="bottom">
      <span class="pubdate">{{replyComment.pubdate | dateTime('MM-DD HH:mm')}}</span>
      <van-button
        round
        size="mini"
        class="btn"
        @click="$emit('replyClick', replyComment)"
      >{{replyComment.reply_count}} 回复</van-button>
      </div>
    </van-cell>
    <!-- 所有评论回复 -->
    <van-cell title="所有回复"></van-cell>
    <commitList ref="com" type='c' :source="replyComment.com_id"></commitList>
    <!-- 写评论 -->
    <div class="article_bottm">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="large"
        @click="isPostShow=true"
      >写评论</van-button>
      <!-- 发布回复 -->
      <van-popup
        v-model="isPostShow"
        position="bottom"
        class="popup"
      >
         <van-field
          v-model="message"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        />
        <van-button class="pupbtn" @click="onPost">发布</van-button>
      </van-popup>
    </div>
  </div>
</template>

<script>
import commitList from '../components/commit-list.vue'
export default {
  data () {
    return {
      isPostShow: false,
      message: ''
    }
  },

  mounted () {

  },

  methods: {
    async onPost () {
      if (this.message.trim().length) {
        this.$toast.loading({
          message: '发布中',
          forbidClick: true
        })
        // const { data } = await addComment({
        //   target: this.articleId.toString(),
        //   content: this.message,
        //   art_id: this.articleId ? this.articleId.toString() : null
        // })
        // console.log(data)
        // console.log(this.$refs.com.list)
        this.$refs.com.list.unshift({
          aut_name: '18656558725',
          aut_photo: 'http://toutiao-img.itheima.net/Fkj6tQi3xJwVXi1u2swCElotfdCi',
          content: this.message,
          is_liking: false,
          is_top: 0,
          like_count: 20,
          reply_count: 5
        })
        this.isPostShow = false
        // 更新评论的总数量
        this.totalCommentCount++
        this.message = ''
        this.$toast.success({
          message: '发布成功',
          forbidClick: true
        })
      } else {
        this.$toast('请输入内容')
      }
    }
  },
  props: {
    replyComment: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'c',
      required: true
    }
  },
  components: {
    commitList
  }
}
</script>

<style lang="less" scoped>
.popup{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  // margin: 14px;
  .pupbtn{
    width: 140px;
    height: 80px;
    margin-right: 28px;
    font-size: 26px;
  }
}
.comment_item{
  .avatar{
    width:72px;
    height:72px;
    margin-right: 26px;
  }

  .content{
    font-size: 32px;
    color: #222;
  }
  .pubdate{
    font-size: 20px;
    margin-right: 10px;
  }
  .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name{
    font-size: 28px;
    color: #406599;
    }
  }
  .bottom{
    display: flex;
    align-items: center;
  }
  .like{
    display: flex;
    align-items: center;
  }
  .liked{
    color: tomato;
  }

}
  .article_bottm{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 80px;
  border-top: 1px solid #b4b4b4;
  background-color: #fff;
  opacity: 0.9;
  .comment-btn{
    width: 340px;
    height: 60px;
    color: #b4b4b4;
    font-size: 30px;
  }
}
</style>
