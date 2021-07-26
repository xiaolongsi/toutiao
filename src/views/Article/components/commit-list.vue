<template>
  <div class="commit-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(comment, index) in list" :key="index" center class="comment_item">
        <van-image
          slot="icon"
          round fit="cover"
          :src="comment.aut_photo"
          class="avatar"
        ></van-image>
        <div slot="title">
          <div class="title">
            <div class="name">{{comment.aut_name}}</div>
            <div class="like">
              <van-icon
                :name="comment.is_liking?'good-job':'good-job-o'"
                :class="{
                  liked:comment.is_liking
                }"
                @click="onCommentLike(comment)"
              ></van-icon>
              <span>{{comment.like_count}}</span>
            </div>
          </div>
          <div class="content">{{comment.content}}</div>
        </div>
        <div slot="label" class="bottom">
          <span class="pubdate">{{comment.pubdate | dateTime('MM-DD HH:mm')}}</span>
          <van-button
            round
            size="mini"
            class="btn"
            @click="$emit('replyClick', comment)"
          >{{comment.reply_count}} 回复</van-button>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getComment, deleteCommentLike, addCommentLike } from '../../../api/user'
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      limit: 10, // 每页个数
      offset: null // 获取下页数据的页码
    }
  },

  mounted () {

  },

  methods: {
    async onLoad () {
      const { data } = await getComment({
        type: this.type, // 评论类型 a 对文章的评论 c 对评论的回复
        source: this.source.toString(), // 文章ID或评论ID
        offset: this.offset,
        limit: this.limit
      })
      this.$emit('update-total-count', data.data.total_count)
      // console.log(data)
      // 把数据放到列表里
      const { results } = data.data
      this.list.push(...results)
      // 将本次loading关闭
      this.loading = false
      // 第二次 如果有把last_id传过去 若没有则完成
      if (!results.length) {
        this.finished = true
      } else {
        this.offset = data.data.last_id
      }
    },
    async onCommentLike (comment) {
      // console.log(comment)
      const commentId = comment.com_id.toString()
      // console.log(commentId)
      if (comment.is_liking) {
        await deleteCommentLike(commentId)
        comment.like_count--
      } else {
        // console.log(typeof commentId)
        await addCommentLike(commentId)
        comment.like_count++
      }
      comment.is_liking = !comment.is_liking
    }

  },
  props: ['source', 'type']
}
</script>

<style lang="less" scoped>
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
</style>
