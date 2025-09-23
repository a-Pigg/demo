<template>
  <el-dialog
    top="0"
    custom-class="dialog"
    :show-close="false"
    :visible.sync="dialogVisible"
    @close="dialogVisibleClose"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <span>{{ $t("h.documentExport") }}</span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="dialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body" v-show="step == ''">
      <div class="form">
        <slot />
      </div>
      <div class="btns">
        <el-button type="primary" size="small" @click="submitExportForm">{{
          $t("h.exportBtn")
        }}</el-button>
        <el-button size="small" @click="resetExportForm">{{
          $t("h.cancelBtn")
        }}</el-button>
      </div>
    </div>
    <div class="result-body" v-show="step">
      <div class="loading" v-if="step == 'loading'">
        <div class="tips">
          <span>{{ $t("h.title30") }}<i class="el-icon-loading"></i></span>
        </div>
        <el-progress
          :percentage="percentage"
          :show-text="false"
          :stroke-width="10"
        ></el-progress>
      </div>
      <div class="success" v-else-if="step == 'success'">
        <div class="text">
          <span
            ><i class="el-icon-success"></i>{{ $t("h.exportSuccessful") }}</span
          >
        </div>
      </div>
      <div class="error" v-else-if="step == 'error'">
        <div class="text">
          <span><i class="el-icon-error"></i>{{ $t("h.title32") }}</span>
        </div>
        <div>
          <span>{{ $t("h.title33") }}{{ errorContent }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    billsExportDialogVisible: {
      type: Boolean,
      default: false,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    step: {
      type: String,
      default: "",
    },
    errorContent: {
      type: String,
      default: "",
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.billsExportDialogVisible;
      },
      set(val) {
        this.$emit("update:billsExportDialogVisible", val);
      },
    },
  },
  methods: {
    dialogVisibleClose() {
      this.$emit("close");
    },
    resetExportForm() {
      this.dialogVisible = false;
      this.$emit("resetExportForm");
    },
    submitExportForm() {
      this.$emit("submitExportForm");
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
  width: 580px;
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
  }
  .dialog-body {
    padding: 14px;
    max-height: 500px;
    box-sizing: border-box;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .el-form-item__label {
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
.result-body {
  padding: 14px;
  display: flex;
  align-items: center;
  height: 300px;
  overflow: auto;
  .loading {
    width: 100%;
    text-align: center;
  }
  .success {
    width: 100%;
    width: 100%;
    text-align: center;
    .text {
      font-size: 20px;
    }
    i {
      color: #67c23a;
    }
  }
  .error {
    width: 100%;
    text-align: center;
    .text {
      font-size: 20px;
    }
    i {
      color: #f56c6c;
    }
  }
}
.btns {
  text-align: center;
}
</style>
