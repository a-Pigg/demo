<template>
  <div class="ds-default-page">
    <div class="page-content">
      <img src="@/assets/images/empty.png" alt="" />
      <p>{{ defaultPageTips }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "DsDefaultPage",
  props: {
    defaultPageImgUrl: {
      type: String,
      default: "@/assets/images/empty.png",
    },
    defaultPageTips: {
      type: String,
      default: "暂无数据",
    },
  },
};
</script>

<style lang="scss" scoped>
.ds-default-page {
  width: 100%;
  height: 100%;
  position: relative;
  .page-content {
    width: 100%;
    height: 100%;
    text-align: center;
    img {
      height: 100%;
      vertical-align: middle;
    }
    p {
      position: absolute;
      bottom: 10px;
      left: 51%;
      transform: translateX(-50%);
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
