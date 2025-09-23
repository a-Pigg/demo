<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.app-main {
  width: 100%;
  height: 100%;
  background-color: #f5f5f8;
  > div {
    width: 100%;
    height: 100%;
  }
}
</style>
