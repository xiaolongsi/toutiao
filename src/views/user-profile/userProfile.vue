<template>
  <div class="container">
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <input type="file" hidden ref="file" accept="image/*" @change="onFileChange">
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image
        width="20"
        height="20"
        fit="cover"
        round
        :src="userProfile.photo"
      ></van-image>
    </van-cell>
    <van-cell @click="isEditShow=true" title="昵称" is-link :value="userProfile.name"></van-cell>
    <van-cell @click="isSexShow=true" title="性别" is-link :value="userProfile.gender===0?'男':'女'"></van-cell>
    <van-cell @click="isbirShow=true" title="生日" is-link :value="userProfile.birthday"></van-cell>
    <van-popup
      v-model="isEditShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <van-nav-bar
        left-text="取消"
        right-text="完成"
        title="修改昵称"
        @click-left="isEditShow=false"
        @click-right="onConfirm"
      ></van-nav-bar>
      <van-field
        class="field"
        v-model="name"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入留言"
        show-word-limit
      />
    </van-popup>
    <!-- 修改性别 -->
      <van-popup
      v-model="isSexShow"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-picker
        title="性别"
        show-toolbar
        :columns="columns"
        @confirm="onGood"
        @cancel="isSexShow=false"
      />
    </van-popup>
    <!-- 修改生日 -->
    <van-popup
      v-model="isbirShow"
      position="bottom"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onFirm"
        @cancel="isbirShow=false"
      />
    </van-popup>
    <!-- 修改图片 -->
    <van-popup
      class="updatephoto"
      v-model="isPhotoShow"
      position="bottom"
      style="height:100%"
    >
      <!-- <updatePhoto :file="previewImage" @close='isPhotoShow=false' @update-photo="userProfile.photo = $event"></updatePhoto> -->
      <updatePhoto v-if="isPhotoShow" :file="previewImage" @close='isPhotoShow=false' @update-photo="userProfile.photo = $event"></updatePhoto>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '../../api/user.js'
import updatePhoto from './components/update-photo.vue'
import dayjs from 'dayjs'
export default {
  created () {
    this.loadUserProfile()
  },
  data () {
    return {
      userProfile: {}, // 用户数据
      isEditShow: false, // 修改弹窗
      name: '',
      isSexShow: false,
      columns: ['男', '女'],
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(1990, 0, 1),
      isbirShow: false,
      isPhotoShow: false,
      previewImage: '' // 上传预览图片
    }
  },
  props: {},
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.userProfile = data.data
    },
    async onConfirm () {
      // await updateUserProfile({ name: this.name })
      this.userProfile.name = this.name
      this.isEditShow = false
      this.name = ''
    },
    onGood (value, index) {
      // console.log(index)
      this.userProfile.gender = index
      this.isSexShow = false
    },
    onFirm () {
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      // console.log(date)
      this.userProfile.birthday = date
      this.isbirShow = false
    },
    onFileChange () {
      // 展示弹出层
      this.isPhotoShow = true
      // 在弹出层里面预览图片
      // const blob = window.URL.createObjectURL(this.$refs.file.files[0])
      const file = this.$refs.file.files[0]
      // console.log(blob)
      this.previewImage = file
      // 为了解决相同文件不触发change事件 所以手动清出file的value
      this.$refs.file.value = ''
    }
  },
  components: {
    updatePhoto
  }
}
</script>

<style lang="less" scoped>
.field{
  margin: 20px;
}
.updatephoto{
  background-color: #000;
}
</style>
