<template>
  <div class="not-fount">
    <div class="tip">
      <span class="title">404</span>
      <div class="btns">
        <el-button type="primary" size="small" @click="goIndex"
          >返回首页</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goIndex() {
      this.$router.push({ path: "/Home" });
    },
  },
};
</script>
<style lang="scss" scoped>
.not-fount {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  .tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .title {
      font-size: 64px;
      font-weight: bold;
    }
  }
}
</style>
