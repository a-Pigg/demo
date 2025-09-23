<template>
  <el-dialog
    :visible.sync="trueProgressDialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="ture_ProgressDialog"
    top="35vh"
    @closed="resultIcon = 'loading'"
  >
    <div class="loading" v-if="resultIcon == 'loading'">
      <span>{{ loadingTitle }}<i class="el-icon-loading"></i></span>
      <el-progress
        :text-inside="true"
        :stroke-width="26"
        :percentage="percentage"
      ></el-progress>
    </div>
    <div v-if="resultIcon == 'success'">
      <i class="el-icon-success"></i>
      <span>{{ successTitle }}}</span>
    </div>
    <div v-if="resultIcon == 'error'">
      <i class="el-icon-error"></i>
      <span>{{ errorTitle }}</span>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      trueProgressDialogVisible: false,
      resultIcon: "loading",
    };
  },
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
    loadingTitle: {
      type: String,
      default: "正在加载中",
    },
    successTitle: {
      type: String,
      default: "成功",
    },
    errorTitle: {
      type: String,
      default: "失败",
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
::v-deep .ture_ProgressDialog {
  width: 350px;
  min-width: 350px;
  height: 200px;
  border-radius: 6px;
  overflow: hidden;
  .el-dialog__body {
    height: calc(100% - 30px);
    padding: 25px 20px 0px 20px;
    box-sizing: border-box;
    text-align: center;
    font-size: 30px;
    .loading {
      margin-top: 10px;
      font-size: 18px;
      .el-progress {
        margin-top: 15px;
      }
    }
  }
}
</style>
