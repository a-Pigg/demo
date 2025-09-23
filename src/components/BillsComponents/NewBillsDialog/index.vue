<template>
  <el-dialog
    top="0"
    custom-class="dialog"
    fullscreen
    :visible.sync="dialogVisible"
    :show-close="false"
    @opened="dialogVisibleOpened"
    @close="dialogVisibleClose"
    @closed="dialogVisibleClosed"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          circle
          @click="dialogVisible = false"
        ></el-button>
        <span class="title">{{ title }}</span>
      </div>
      <div class="right">
        <el-button size="small" @click="cancalFrom">{{
          $t("h.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="sbumitForm">{{
          $t("h.confirmBtn")
        }}</el-button>
      </div>
    </div>
    <div class="dialog-body" ref="dialogbodyRef">
      <div class="content" :style="'width:' + contentWidth">
        <div class="form-label">
          <slot name="form" />
        </div>
        <div class="table-label">
          <div class="table-label-head">
            <slot name="btns" />
          </div>
          <div class="table-label-content">
            <slot name="table" />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { i18n } from "@/i18n/index";
export default {
  data() {
    return {};
  },
  props: {
    // 弹框标题
    title: {
      type: String,
      default: i18n.t('h.title12'),
    },
    // 弹框flag
    newBillsDialogVisible: {
      type: Boolean,
      default: false,
    },
    contentWidth: {
      type: String,
      default: "950px",
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.newBillsDialogVisible;
      },
      set(val) {
        this.$emit("update:newBillsDialogVisible", val);
      },
    },
  },
  methods: {
    cancalFrom() {
      this.dialogVisible = false;
    },
    sbumitForm() {
      this.$emit("sbumitForm");
    },
    dialogVisibleClose() {
      this.$emit("close");
      this.$refs.dialogbodyRef.scrollTop = 0;
    },
    dialogVisibleClosed() {
      this.$emit("closed");
    },
    dialogVisibleOpened() {
      this.$emit("opened");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
  border-radius: 0px;
  overflow: hidden;
  .el-dialog__header {
    padding: 0;
  }
  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 54px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    .el-button.is-circle {
      padding: 8px;
      vertical-align: middle;
    }
    .title {
      margin-left: 30px;
      font-size: 18px;
      vertical-align: middle;
    }
  }
  .el-dialog__body {
    padding: 0;
    height: calc(100% - 54px);
  }
  .dialog-body {
    position: relative;
    height: 100%;
    overflow: auto;
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
.content {
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin: 10px auto !important;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  .table-label {
    flex: 1;
    height: 100%;
  }
  .table-label-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
