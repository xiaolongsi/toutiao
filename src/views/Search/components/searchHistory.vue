<template>
  <div class="content">
    <van-cell title="搜索历史">
      <div v-show="isDelete">
        <span @click="$emit('update-histories', [])">全部删除</span>
        <span @click="isDelete=!isDelete">完成</span>
      </div>
      <van-icon name="delete" v-show="!isDelete" @click="isDelete=!isDelete"></van-icon>
    </van-cell>
    <van-cell :title="searchHistory" v-for="(searchHistory, index) in searchHistories" :key="index"  @click="deleteItem(searchHistory,index)">
      <van-icon :name="isDelete?'close':''"></van-icon>
    </van-cell>
  </div>
</template>

<script>
// import { setItem } from '../../../utils/storage'
export default {
  data () {
    return {
      isDelete: false
    }
  },

  methods: {
    deleteItem (searchHistory, index) {
      if (this.isDelete) {
        this.searchHistories.splice(index, 1)
        // 数据持久化处理
        // 1：修改本地存储的数据
        // 2：请求接口删除线上的数据
        // setItem('search-histories', this.searchHistories)
        return
      }
      this.$emit('search', searchHistory)
    }
  },
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
