<template>
  <div class="right-panel">
    <slot />
  </div>
</template>
<script>
export default {
  name: "DsQueryFormRightPanel",
};
</script>
<style lang="scss" scoped>
.right-panel {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 300px;
}
</style>
