<template>
  <fragment>
    <template v-for="item in subMenuList">
      <el-submenu
        v-if="item.children && item.children.length"
        :key="item.path"
        :index="item.path"
      >
        <template slot="title">
          <div class="content">
            <i v-if="item.meta.icon" :class="item.meta.icon + 'menu-icon'"></i>
            <i v-else class="dot"></i>
            <!-- <span class="menu-item-name">{{ item.meta.name }}</span> -->
            <span class="menu-item-name">{{ $t(`h.${item.name}`) }}</span>
          </div>
        </template>
        <sidebar-item :subMenuList="item.children" />
      </el-submenu>
      <el-menu-item v-else :key="item.path" :index="item.path">
        <div class="content">
          <i v-if="item.meta.icon" :class="item.meta.icon + 'menu-icon'"></i>
          <i v-else class="dot"></i>
          <!-- <span class="menu-item-name">{{ item.meta.name }}</span> -->
          <span class="menu-item-name">{{ $t(`h.${item.name}`) }}</span>
        </div>
      </el-menu-item>
    </template>
  </fragment>
</template>
<script>
import sidebarItem from "./sidebarItem";
export default {
  name: "sidebarItem",
  components: { sidebarItem },
  data() {
    return {};
  },
  props: {
    subMenuList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
<style lang="scss">
.el-menu-item.is-active {
  background: linear-gradient(90deg, #5862bf 0%, #141d75 100%);
  .menu-icon {
    color: #dc4b74;
    font-weight: bold;
  }
  .menu-item-name {
    font-weight: bold;
    color: #fefeff;
  }
}
.el-submenu.is-active {
  & > .el-submenu__title {
    .menu-icon {
      color: #dc4b74;
      font-weight: bold;
    }
    .menu-item-name {
      color: #fff;
    }
  }
}
.menu-icon {
  margin-right: 15px;
  font-size: 18px;
  color: #959ab0;
}
.menu-item-name {
  font: 16px Microsoft YaHei;
  color: #959ab0;
}
.dot {
  display: inline-block;
  margin: 0 6px 0 12px;
  width: 4px;
  height: 4px;
  background: #949aaf;
  border-radius: 50%;
}
// 缩小class .el-menu--coll
.el-menu--collapse {
  .el-menu-item.is-active {
    background: rgb(19, 26, 92);
    .menu-icon {
      font-weight: bold;
      color: #dc4b74;
    }
  }
}
</style>
