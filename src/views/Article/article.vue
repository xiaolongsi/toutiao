<template>
  <div class="container">
    <van-nav-bar
        class="app-nav-bar"
        title="文章详情"
        left-arrow
        @click-left="$router.back()"
    ></van-nav-bar>
    <div class="content">
      <h1 class="title">{{article.title}}</h1>
      <van-cell center class="user-info">
        <div slot="title" class="name">{{article.aut_name}}</div>
        <van-image slot="icon" :src="article.aut_photo" class="avatar" round fit="cover"></van-image>
        <div slot="label" class="pubdate">{{article.pubdate | relativeTime}}</div>
        <van-button
          round
          size="small"
          @click="onFollow"
          :icon="article.is_followed?'':'plus'"
          class="btn" :type="article.is_followed?'danger':'info'"
          :loading="isFollowedLoading"
        >{{article.is_followed?'已关注':'关注'}}</van-button>
      </van-cell>
      <div
      class="markdown-body"
      v-html="article.content"
      ref="artical-content"
      >
      </div>
      <!-- 评论区域 -->
      <commitList type="a" @replyClick="replyClick" @update-total-count="totalCommentCount=$event" ref="com" :source="articleId"></commitList>
    </div>
    <!-- 底部区域 -->
    <div class="article_bottm">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="showPopup"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        :badge="totalCommentCount"
        color="#777"
      ></van-icon>
      <van-icon
        :name="article.is_collected?'star':'star-o'"
        :color="article.is_collected?'orange':'#777'"
        @click="onCollect"
      ></van-icon>
      <van-icon
        :name="article.attitude===1?'good-job':'good-job-o'"
        :color="article.attitude===1?'red':'#777'"
        @click="onLike"
      ></van-icon>
      <van-icon
        name="share-o"
        color="#777"
      ></van-icon>
    </div>
    <!-- 发布评论 -->
    <van-popup class="popup" position="bottom" v-model="show">
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
      />
    <van-button class="pupbtn" @click="onPost">发布</van-button>
    </van-popup>
    <!-- 评论回复 -->
    <van-popup position="bottom" v-model="isReplyShow" :style="{ height: '100%' }">
      <commentReply v-if="isReplyShow" type="c" :replyComment="replyComment" @close='isReplyShow=false'></commentReply>
    </van-popup>
  </div>
</template>

<script>
import { getArticalById, addFollow, deleteFollow, addCollect, deleteCollect, addLike, deleteLike } from '../../api/user'
import { ImagePreview } from 'vant'
import commitList from './components/commit-list.vue'
import commentReply from './components/comment-reply.vue'
export default {
  data () {
    return {
      article: {}, // 文章数据对象
      isFollowedLoading: false, // 关注用户按钮请求状态
      show: false, // 评论弹出层显示状态
      message: '', // 输入框内容
      totalCommentCount: 0, // 评论总数量
      isReplyShow: false, // 回复弹出层显示状态
      replyComment: []
    }
  },

  mounted () {
    this.loadArtical()
  },

  methods: {
    async loadArtical () {
      const { data } = await getArticalById(this.articleId)
      // console.log(data)
      this.article = data.data

      // 获取文章内容Dom容器
      const articalContent = this.$refs['artical-content']
      // console.log(articalContent)
      // 得到所有的img标签
      this.$nextTick(function () {
        const imgs = articalContent.querySelectorAll('img')
        // console.log(imgs)
        // 收集图片路径
        const imgPath = []
        // 循环img标签geiimg注册点击事件
        imgs.forEach((img, index) => {
          imgPath.push(img.src)
          img.onclick = function () {
            // 在事件处理函数中调用imagePreview（）预览
            ImagePreview({
              images: imgPath,
              startPosition: index
            })
          }
        })
      })
    },
    async onFollow () {
      if (this.article.is_followed) {
        // 已关注 取消关注
        await deleteFollow(this.article.aut_id)
        this.article.is_followed = false
      } else {
        await addFollow(this.article.aut_id)
        this.article.is_followed = true
      }
      this.isFollowedLoading = false
    },
    async onCollect () {
      this.$toast.loading({
        message: '操作中',
        forbidClick: true
      })
      if (this.article.is_collected) {
        // 已关注 取消关注
        await deleteCollect(this.articleId)
        this.article.is_collected = false
      } else {
        await addCollect(this.articleId)
        this.article.is_collected = true
      }
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    async onLike () {
      this.$toast.loading({
        message: '操作中',
        forbidClick: true
      })
      if (this.article.attitude === 1) {
        // 已关注 取消关注
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    },
    showPopup () {
      this.show = true
    },
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
        this.show = false
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
    },
    replyClick (comment) {
      // 展示回复内容
      this.isReplyShow = true
      this.replyComment = comment
    }
  },
  props: {
    articleId: {
      type: [Object, String, Number],
      required: true
    }
  },
  components: {
    commitList,
    commentReply
  }
}
</script>

<style lang="less" scoped>
@import './github-markdown.css';
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
.title{
  font-size: 40px;
  color: #3a3a3a;
  padding: 28px;
  margin: 0;
  background-color: #fff;
}
.content{
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  overflow: scroll;
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
