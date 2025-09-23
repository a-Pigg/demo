<template>
  <div class="left-panel">
    <slot />
  </div>
</template>
<script>
export default {
  name: "DsQueryFormLeftPanel",
};
</script>
<style lang="scss" scoped>
.left-panel {
  flex: 1;
  display: flex;
  align-items: center;
}
::v-deep .el-button {
  margin-right: 10px;
}
</style>
