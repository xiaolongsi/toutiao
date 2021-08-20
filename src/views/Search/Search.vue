<template>
  <div class="content">
    <!-- action不为空 在输入法中显示搜索按钮 -->
    <form action="/">
      <van-search
        class="app-nav-bar"
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow=false"
      />
    </form>

    <!-- 历史记录 -->
    <searchHistory @update-histories="searchHistories=$event" v-if="searchText.trim().length===0" @search="onSearch" :searchHistories="searchHistories"></searchHistory>

    <!-- 结果 -->
    <searchResult :searchText="searchText" v-else-if="isResultShow"></searchResult>

    <!-- 联想建议 -->
    <searchSuggestion v-else  :searchText="searchText" @search="onSearch"></searchSuggestion>
  </div>
</template>

<script>
import searchSuggestion from './components/searchSuggestion.vue'
import searchHistory from './components/searchHistory.vue'
import searchResult from './components/searchResult.vue'
import { getItem, setItem } from '../../utils/storage'
// import { getSearchHistory } from '../../api/user'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索框显示状态
      searchHistories: getItem('search-histories') || [] // 搜索历史数据
    }
  },
  async created () {
    // if (this.user) {
    //   const { data } = await getSearchHistory()
    //   // console.log(data)
    //   this.searchHistories = data.data.keywords
    // }
  },
  watch: {
    searchHistories () {
      // 监视searchHistories的变化就持久化处理
      setItem('search-histories', this.searchHistories)
    }
  },
  methods: {
    onSearch (searchText) {
      // 把输入框设置为要搜索的文本
      this.searchText = searchText
      // 判断是否存在多余的
      const index = this.searchHistories.indexOf(searchText)
      // 如果找到了
      if (index !== -1) {
        // 移除该项
        this.searchHistories.splice(index, 1)
      }
      if (searchText.trim().length !== 0) {
        // 记录搜索历史记录
        this.searchHistories.unshift(searchText)
        // 如果用户一登录 则把搜索历史存储到线上   登录状态下调用 接口 后端会自动帮我们存
        // 如果没有登陆 则把搜索记录存储到本地
        // setItem('search-histories', this.searchHistories)
        // 展示搜索结果
        this.isResultShow = true
      } else {
        this.searchText = ''
      }
    }
  },
  components: {
    searchSuggestion,
    searchHistory,
    searchResult
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/index.less';
.van-search__action{
  color: #fff;
}
</style>
