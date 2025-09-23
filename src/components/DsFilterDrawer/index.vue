<template>
  <div class="filter-drawer">
    <el-drawer
      :title="$t('h.advancedBtn')"
      :size="550"
      direction="rtl"
      :visible.sync="drawer"
    >
      <div class="filter-form">
        <slot />
      </div>
      <div class="filter-btn">
        <slot name="set" />
        <el-button type="primary" size="small" @click="submitFilterForm">{{
          $t("h.saveBtn")
        }}</el-button>
        <el-button size="small" @click="resetFilterForm">{{
          $t("h.resetBtn")
        }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "DsFilterDrawer",
  data() {
    return {};
  },
  props: {
    filterDrawerVisible: {
      type: Boolean,
    },
  },
  computed: {
    drawer: {
      get() {
        return this.filterDrawerVisible;
      },
      set(val) {
        this.$emit("update:filterDrawerVisible", val);
      },
    },
  },
  methods: {
    submitFilterForm() {
      this.$emit("submitFilterForm");
    },
    resetFilterForm() {
      this.$emit("resetFilterForm");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-drawer {
  .el-drawer__header {
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
  .el-form-item__label {
    // max-width: 100px; /* 你可以根据需要设置最大宽度 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-form-item__label:hover {
    white-space: normal;
    overflow: visible;
    text-overflow: inherit;
  }
}
.filter-form {
  padding: 0 10px 0 30px;
  height: calc(100% - 52px);
  overflow: auto;
  box-sizing: border-box;
}
.filter-btn {
  height: 52px;
  line-height: 52px;
  text-align: center;
}
</style>
