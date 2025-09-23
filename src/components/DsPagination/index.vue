<template>
  <div class="ds-pagination">
    <el-pagination
      v-bind="$attrs"
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  name: "DsPagination",
  data() {
    return {};
  },
  props: {
    total: {
      required: true,
      type: Number,
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100];
      },
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    background: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: this.currentPage, limit: val });
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
    },
  },
};
</script>
<style lang="scss" scoped>
.ds-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}
::v-deep .el-input--mini .el-input__icon {
  line-height: 22px;
}
::v-deep .el-input--mini .el-input__inner {
  height: 22px;
  line-height: 22px;
}
</style>
