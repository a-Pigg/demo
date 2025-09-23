<template>
  <el-dialog
    top="0"
    custom-class="dialog"
    :show-close="false"
    :visible.sync="dialogVisible"
    @closed="dialogVisibleClosed"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <span>{{ title }}</span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="dialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body">
      <ds-table
        :tableData="deleteErrorData"
        :columns="deleteColumns"
        :tableConfig="errorTableConfig"
      ></ds-table>
    </div>
  </el-dialog>
</template>
<script>
import DsTable from "@/components/DsTable";
export default {
  components: {
    DsTable,
  },
  data() {
    return {
      errorTableConfig: {
        index: true,
      },
    };
  },
  props: {
    deleteDialogVisible: {
      type: Boolean,
      default: false,
    },
    deleteErrorData: {
      type: Array,
      default: () => [],
    },
    deleteColumns: {
      type: Array,
    },
    title: {
      type: String,
      default: "删除失败详情",
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.deleteDialogVisible;
      },
      set(val) {
        this.$emit("update:deleteDialogVisible", val);
      },
    },
  },
  methods: {
    dialogVisibleClosed() {
      this.$emit("closed");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 800px;
  height: 500px;
  border-radius: 6px;
  overflow: hidden;
  .el-dialog__header {
    padding: 0;
  }
  .dialog-header {
    padding: 0 10px 0 20px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    box-sizing: border-box;
    font-size: 17px;
    font-weight: bold;
    .el-icon-close:hover {
      color: #588ab9;
      cursor: pointer;
    }
  }
  .el-dialog__body {
    padding: 0;
    height: calc(100% - 36px);
  }
  .dialog-body {
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
