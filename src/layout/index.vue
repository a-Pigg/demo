<template>
  <el-container>
    <!-- <el-aside width="auto"> </el-aside> -->
    <aside>
      <sidebar class="sidebar-container"> </sidebar>
    </aside>
    <el-container>
      <el-header height="60px">
        <header-temp></header-temp>
      </el-header>
      <el-main>
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import headerTemp from "./headerTemp";
import appMain from "./appMain";
import sidebar from "./sideBar";
export default {
  components: { headerTemp, appMain, sidebar },
  data() {
    return {};
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  padding: 0px;
}
.el-main {
  padding: 0;
}
</style>
