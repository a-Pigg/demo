<template>
  <div class="ds-query-form">
    <slot />
  </div>
</template>
<script>
export default {
  name: "DsQueryForm",
};
</script>
<style lang="scss" scoped>
.ds-query-form {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
