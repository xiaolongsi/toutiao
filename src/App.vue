<template>
  <div id="app">
    <keep-alive :include="cachePages">
      <router-view></router-view>
    </keep-alive>
  <div></div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import { Button, Cell, CellGroup } from 'vant'
// import Button from 'vant/lib/button'
// import 'vant/lib/button/style'
// import 'vant/lib/cell/style'
// import 'vant/lib/index.css'
// Vue.use(Button)
// Vue.use(Cell)
// Vue.use(CellGroup)
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less" scoped>

</style>
