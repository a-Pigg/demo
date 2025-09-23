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
        <span>{{ $t("h.title15") }}</span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="dialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body">
      <el-alert
        :title="$t('h.tips130')"
        type="warning"
        effect="dark"
        :closable="false"
      >
      </el-alert>
      <slot name="upload" />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">{{ $t("h.cancelBtn") }}</el-button>
      <el-button type="primary" size="small" @click="dialogVisibleSubmit"
        >{{ $t("h.confirmBtn") }}</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    offlineUploadDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.offlineUploadDialogVisible;
      },
      set(val) {
        this.$emit("update:offlineUploadDialogVisible", val);
      },
    },
  },
  methods: {
    dialogVisibleClosed() {
      this.$emit("closed");
    },
    dialogVisibleSubmit() {
      this.$emit("submit");
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
  width: 450px;
  border-radius: 6px;
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
  }
  .dialog-body {
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
    .el-alert {
      margin-bottom: 10px;
    }
  }
  .el-dialog__footer {
    padding: 14px 14px 10px 14px;
  }
}
</style>
