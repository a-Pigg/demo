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
          <span>{{ $t("h.batchImportBtn") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="dialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body" v-show="setp == 'upload'">
        <div class="title">
          <span>{{ $t("h.tips1") }}</span>
        </div>
        <div class="content">
          <div class="upload-excel">
            <upload-excel-base64 :value.sync="file"></upload-excel-base64>
          </div>
          <div class="settings">
            <div class="tips">
              <span
                >{{ $t("h.tips5") }}{{ $t("h.tips6")
                }}<el-button type="text" @click="goCreateTemplate">{{
                  $t("h.newBtn")
                }}</el-button>
              </span>
            </div>
            <el-form ref="tempFormRef" :model="tempForm" :rules="tempFormRules">
              <el-form-item prop="name" :label="$t('h.importTemplate')">
                <el-select
                  v-model="tempForm.name"
                  value-key="name"
                  class="select-prefix"
                >
                  <el-option
                    v-for="(item, i) in excelTemplateData"
                    :key="i"
                    :value="item"
                    :label="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="fig" :label="$t('h.selfAdd')">
                <el-switch
                  @change="switchChange"
                  v-model="tempForm.fig"
                ></el-switch>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="btns">
          <div class="download">
            <el-button
              class="download-btn"
              type="text"
              size="small"
              @click="downloadDefaultTemplate"
              >{{ $t("h.tips7") }}</el-button
            >
          </div>
          <div class="save">
            <el-button size="small" @click="dialogVisible = false">{{
              $t("h.cancelBtn")
            }}</el-button>
            <el-button size="small" type="primary" @click="sumitTemplateForm">{{
              $t("h.confirmBtn")
            }}</el-button>
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
          <span>{{ $t("h.detailsAboutTheBatchAssetImportError") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="errorDialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <h4>{{ errorTitle }}</h4>
        <span>{{ errorText }}</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { select, update, printPost } from "@/assets/api";
import { mapState } from "vuex";
import { base64Encode, clickDownloadLink } from "@/utils/basic-methods";
import UploadExcelBase64 from "@/components/UploadExcelBase64";
export default {
  components: {
    UploadExcelBase64,
  },
  data() {
    return {
      errorDialogVisible: false,
      excelTemplateData: [],
      setp: "upload",
      percentage: 0,
      errorText: "",
      errorTitle: this.$t("h.title19"),
      file: {
        value: "",
        name: "",
      },
      tempForm: {
        name: "",
        fig: false,
      },
      tempFormRules: {
        name: [
          { required: true, message: this.$t("h.tips34"), trigger: "change" },
        ],
      },
    };
  },
  props: {
    bulkDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["userInfo", "maxLimit"]),
    dialogVisible: {
      get() {
        return this.bulkDialogVisible;
      },
      set(val) {
        this.$emit("update:bulkDialogVisible", val);
      },
    },
  },
  methods: {
    getExcelTempalte() {
      select({
        func: "S0045",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          for (let key in data.data) {
            if (!data.data[key]) continue;
            this.excelTemplateData.push(JSON.parse(data.data[key]));
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    downloadDefaultTemplate() {
      clickDownloadLink(window.$EXCEL_URL + this.$t("h.assetTemplate1") + ".xlsx");
    },
    switchChange(val) {
      if (val) {
        this.$confirm(this.$t("h.tips35"), this.$t("h.title18"), {
          confirmButtonText: this.$t("h.confirmBtn"),
          cancelButtonText: this.$t("h.cancelBtn"),
          type: "warning",
        })
          .then(() => {})
          .catch(() => {
            this.tempForm.fig = false;
          });
      }
    },
    goCreateTemplate() {
      this.$router.push("/AssetMange/Set/ExcelInfo");
    },
    checkImportError() {
      this.errorDialogVisible = true;
    },
    sumitTemplateForm() {
      if (!this.file.value) {
        return this.$notify.error({
          title: this.$t("h.title27"),
          message: this.$t("h.title28"),
        });
      }
      this.$refs.tempFormRef.validate((valid) => {
        if (!valid) return false;
      });
      this.setp = "loading";
      this.percentage = 20;
      printPost(
        "post",
        { sendCode: 2, param: 2 },
        {
          inputType: "fileBase64",
          excelFile: this.file.value.split(",")[1],
          fileName: this.file.name,
          templateFile: base64Encode(JSON.stringify(this.tempForm.name)),
          templateName: this.tempForm.name.name,
        }
      )
        .then(({ data }) => {
          this.percentage = 50;
          if (data.code != 0) {
            this.percentage = 100;
            this.setp = "result";
            if (data.code == -1) this.errorTitle = this.$t("h.title20");
            else if (data.code == -2) this.errorTitle = this.$t("h.title21");
            else if (data.code == -3) this.errorTitle = this.$t("h.title22");
            else if (data.code == -4) this.errorTitle = this.$t("h.title23");
            else if (data.code == -5) {
              if (data.message.indexOf("原因是出现以下错误: 80040154")) {
                this.errorTitle = this.$t("h.title24");
                // "该功能需要安装Microsoft Office Excel,请先完成安装再使用";
              } else if (data.message.indexOf("文件名称或路径不存在")) {
                this.errorTitle = this.$t("h.title25");
              } else {
                this.errorTitle = this.$t("h.title26");
              }
            }
            this.errorText = data.message;
            return;
          }
          let assetParam = JSON.parse(data.message);
          assetParam.permissonId = 59;
          assetParam.fig = this.tempForm.fig;
          if (
            this.maxLimit.assetExcelSize &&
            assetParam.rows > this.maxLimit.assetExcelSize
          ) {
            this.$confirm(this.$t("h.tips36"), this.$t("h.title18"), {
              confirmButtonText: this.$t("h.confirmBtn"),
              cancelButtonText: this.$t("h.cancelBtn"),
              type: "warning",
            })
              .then(() => {
                assetParam.itemVal = assetParam.itemVal.slice(
                  0,
                  this.maxLimit.assetExcelSize * assetParam.cols
                );
                assetParam.rows = this.maxLimit.assetExcelSize;
                assetParam.fileName = this.file.name;
                update({
                  func: "U0020",
                  userId: this.userInfo._id,
                  token: this.userInfo.token,
                  requstData: assetParam,
                })
                  .then(({ data }) => {
                    this.percentage = 100;
                    if (data.code != 0) {
                      this.setp = "result";
                      if (!data.data) this.errorText = "null";
                      else this.errorText = data.data;
                      return;
                    }
                    this.setp = "result";
                    this.$emit("updataAsset");
                  })
                  .catch(() => {
                    this.percentage = 100;
                    this.setp = "result";
                    this.errorText = this.$t("h.tips18");
                  });
              })
              .catch(() => {
                this.percentage = 100;
                this.setp = "result";
                this.errorText = this.$t("h.title29");
              });
          } else {
            assetParam.fileName = this.file.name;
            update({
              func: "U0020",
              userId: this.userInfo._id,
              token: this.userInfo.token,
              requstData: assetParam,
            })
              .then(({ data }) => {
                this.percentage = 100;
                if (data.code != 0) {
                  if (!data.data) this.errorText = "null";
                  else this.errorText = data.data;
                  this.setp = "result";
                  return;
                }
                this.setp = "result";
                this.$emit("updataAsset");
              })
              .catch(() => {
                this.percentage = 100;
                this.setp = "result";
                this.errorText = this.$t("h.tips18");
              });
          }
        })
        .catch(() => {
          this.percentage = 100;
          this.setp = "result";
          this.errorText = this.$t("h.title26");
        });
    },
    dialogVisibleOpened() {
      this.getExcelTempalte();
    },
    dialogVisibleClosed() {
      this.excelTemplateData = [];
      this.file.value = "";
      this.file.name = "";
      this.setp = "upload";
      this.percentage = 0;
      this.errorText = "";
      this.errorTitle = this.$t("h.title19");
      this.$refs.tempFormRef.resetFields();
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
.settings {
  padding-top: 20px;
  margin-left: 50px;
  flex: 1;
  height: 100%;
  box-sizing: border-box;
}
</style>
