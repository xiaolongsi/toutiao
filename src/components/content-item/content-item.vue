<template>
  <div>
     <van-cell
     class="content-item"
     :to="{
       path: `/article/${content.art_id}`
       }">
       <div slot="title" class="title van-multi-ellipsis--l3">{{content.title}}</div>
       <div slot="label">
         <div class="label-images-wrap" v-if="content.cover.type === 3">
           <div class="label-image">
             <van-image
             fit="cover"
             v-for="(image, index) in content.cover.images" :key="index"
             :src="image"
            />
           </div>
         </div>
         <div class="label-wrap">
          <span>{{content.aut_name}}</span>
          <span>{{content.comm_count}}评论</span>
          <span>{{content.pubdate|relativeTime}}</span>
         </div>
       </div>
       <van-image
        fit="cover"
        v-if="content.cover.type === 1"
        :src="content.cover.images[0]"
       />
     </van-cell>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },

  mounted () {

  },

  methods: {

  },
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
 /deep/.content-item{
  .title{
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value{
    flex: unset;
    width: 220px;
    height: 146px;
    margin-left: 24px;
  }
  .van-cell__title{
    .label-image{
      padding: 15px 0;
      img{
        width: 220px;
        height: 146px;
        &:nth-last-child(1){
          padding-right: 8px;
        }
      }
    }
  }
  .label-wrap span{
    margin-right: 22px;
  }
}
</style>
