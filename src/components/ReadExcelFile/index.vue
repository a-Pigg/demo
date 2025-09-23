<template>
  <div>
    <el-dialog
      top="0"
      custom-class="dialog"
      :show-close="false"
      :visible.sync="dialogVisible"
      @opened="dialogVisibleOpened"
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
      <div class="dialog-body" v-show="setp == 'upload'">
        <div class="title">
          <!-- <span>请选择要导入的数据文件（Excel格式）</span> -->
          <span>{{ $t("h.tips1") }}</span>
        </div>
        <div class="content">
          <slot />
        </div>
        <div class="btns">
          <div class="download">
            <el-button
              class="download-btn"
              type="text"
              size="small"
              @click="downloadDefaultTemplate"
              >{{ $t("h.tips2") }}</el-button
            >
          </div>
          <div class="save">
            <el-button size="small" @click="dialogVisible = false">{{
              $t("h.cancelBtn")
            }}</el-button>
            <el-button
              size="small"
              type="primary"
              @click="submitTemplateForm"
              >{{ $t("h.confirmBtn") }}</el-button
            >
          </div>
        </div>
      </div>
      <div class="dialog-body-loading" v-show="setp == 'loading'">
        <span>{{ $t("h.tips8") }}</span>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="percentage"
        ></el-progress>
      </div>
      <div class="dialog-body-result" v-show="setp == 'result'">
        <div class="error" v-if="errorText">
          <i class="el-icon-warning-outline"></i>
          <span>{{ $t("h.importFailure") }}</span>
          <el-button type="text" @click="checkImportError">{{
            $t("h.viewImportErrorDetails")
          }}</el-button>
        </div>
        <div class="success" v-else>
          <i class="el-icon-circle-check"></i>
          <span>{{ $t("h.importSuccessfully") }}</span>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      custom-class="error-dialog"
      :show-close="false"
      :visible.sync="errorDialogVisible"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.importErrorDetails") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="errorDialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <h4>{{ $t("h.reasonForImportError") }}</h4>
        <span>{{ errorText }}</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      errorDialogVisible: false,
    };
  },
  props: {
    readDialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "批量导入",
    },
    setp: {
      type: String,
      default: "upload",
    },
    percentage: {
      type: Number,
      default: 0,
    },
    errorText: {
      type: String,
      default: "",
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.readDialogVisible;
      },
      set(val) {
        this.$emit("update:readDialogVisible", val);
      },
    },
  },
  methods: {
    dialogVisibleOpened() {
      this.$emit("opened");
    },
    dialogVisibleClosed() {
      this.$emit("closed");
    },
    downloadDefaultTemplate() {
      this.$emit("download");
    },
    submitTemplateForm() {
      this.$emit("submit");
    },
    // 查看报错详情
    checkImportError() {
      this.errorDialogVisible = true;
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
  width: 540px;
  height: 300px;
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
    padding: 5px 14px 10px 14px;
    height: 100%;
    box-sizing: border-box;
    .content {
      display: flex;
      align-items: center;
      height: calc(100% - 61px);
    }
    .btns {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      height: 32px;
    }
  }
  .dialog-body-loading {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0 14px;
    height: 100%;
    text-align: center;
    .el-progress {
      margin-top: 10px;
      width: 100%;
    }
  }
  .dialog-body-result {
    height: 100%;
    .success,
    .error {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      font-size: 20px;
      font-weight: bold;
      color: rgb(247, 64, 64);
    }
  }
}
::v-deep .error-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 440px;
  height: 250px;
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
    text-align: center;
    overflow: auto;
  }
}
</style>
