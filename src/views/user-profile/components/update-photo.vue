<template>
  <div>
    <img :src="image" ref="image" class="img">
    <van-nav-bar
      left-text="取消"
      right-text="确认"
      class="toolbar"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    >
    </van-nav-bar>
  </div>
</template>

<script>
// import { getPhoto } from '../../../api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: '' // 裁切器实例
    }
  },
  mounted () {
    // 获取需要裁切的图片  Dom
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      background: false,
      aspectRatio: 16 / 9,
      crop (event) {
        console.log(event.detail.x)
        console.log(event.detail.y)
        console.log(event.detail.width)
        console.log(event.detail.height)
        console.log(event.detail.rotate)
        console.log(event.detail.scaleX)
        console.log(event.detail.scaleY)
      }
    })
    console.log(this.cropper)
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      // const { data } = await getPhoto(fd)
      // console.log(data)
      // 关闭弹出层
      this.$emit('close')
      // 更新父组件的用户头像
      this.$emit('update-photo', window.URL.createObjectURL(file))
      this.$toast.success('保存成功')
    }
  },
  props: {
    file: {
      // type: [String, Object, Number],
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.toolbar{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
}
.img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
