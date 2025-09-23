<template>
  <el-dialog
    top="0"
    custom-class="dialog"
    :show-close="false"
    :visible.sync="dialogVisible"
    @opened="dialogVisibleOpened"
    @close="dialogVisibleClose"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <span>{{ $t("h.title08") }}</span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="dialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body" v-if="!isExportLoading">
      <el-alert
        :title="$t('h.tips9')"
        type="info"
        effect="dark"
        :closable="false"
      >
      </el-alert>
      <div class="form">
        <el-form
          label-width="100px"
          ref="exportFormRef"
          :rules="exportFormRules"
          :model="exportForm"
        >
          <el-form-item :label="$t('h.derivedPath')" prop="exportURL">
            <el-input
              v-model="exportForm.exportURL"
              :placeholder="$t('h.tips40')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.derivedTableName')" prop="excelName">
            <el-input
              v-model="exportForm.excelName"
              :placeholder="$t('h.tips41')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.templateName')" prop="fileJSON">
            <el-select
              v-model="exportForm.fileJSON"
              value-key="name"
              class="select-prefix"
              filterable
              clearable
              :placeholder="$t('h.tips10')"
            >
              <el-option
                v-for="(item, index) in excelTempalteData"
                :key="index"
                :value="item"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="exportLabels.inData" prop="inData">
            <el-date-picker
              v-model="exportForm.inData"
              type="daterange"
              value-format="yyyy-MM-dd"
              :range-separator="$t('h.to')"
              :start-placeholder="$t('h.startDate')"
              :end-placeholder="$t('h.endDate')"
            >
            <!-- format="yyyy 年 MM 月 dd 日" -->
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="exportLabels.type" prop="classifyId">
            <ds-select-tree
              v-model="exportForm.classifyId"
              :placeholder="$t('h.tips4') + exportLabels.type"
              :treeData="typeData"
              :defaultProps="typeProps"
              collapseTags
              checkStrictly
              multiple
            ></ds-select-tree>
          </el-form-item>
          <el-form-item
            :label="exportLabels.assertPosition"
            prop="assertPosition"
          >
            <el-select
              v-model="exportForm.assertPosition"
              multiple
              collapse-tags
              :placeholder="$t('h.tips4') + exportLabels.assertPosition"
              clearable
              filterable
              remote
              :remote-method="wareRemoteMethod"
            >
              <el-option
                v-for="item in wareData"
                :key="item._id"
                :label="item.warehouseName"
                :value="item._id"
              >
                {{ item.code }}-{{ item.warehouseName }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="exportLabels.source" prop="source">
            <el-select
              v-model="exportForm.source"
              multiple
              collapse-tags
              :placeholder="$t('h.tips4') + exportLabels.source"
              clearable
              filterable
            >
              <el-option
                v-for="item in sourceData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="btns">
        <el-button @click="cancelExportForm" size="small">{{
          $t("h.cancelBtn")
        }}</el-button>
        <el-button @click="sumbitExprotForm" type="primary" size="small">{{
          $t("h.confirmBtn")
        }}</el-button>
      </div>
    </div>
    <div class="result" v-else>
      <div class="loading" v-if="setp == 'loading'">
        <div class="tips">
          <span>{{ $t("h.title30") }}<i class="el-icon-loading"></i></span>
        </div>
        <el-progress
          :percentage="progress"
          :show-text="false"
          :stroke-width="10"
        ></el-progress>
      </div>
      <div class="result-success" v-else-if="setp == 'success'">
        <div class="text">
          <span
            ><i class="el-icon-success"></i>{{ $t("h.exportSuccessful") }}</span
          >
        </div>
        <div>
          <span>{{ $t("h.title31") }}</span>
        </div>
      </div>
      <div class="result-error" v-else-if="setp == 'error'">
        <div class="text">
          <span><i class="el-icon-error"></i>{{ $t("h.title32") }}</span>
        </div>
        <div>
          <span>{{ $t("h.title33") }}{{ errorText }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { select, printPost } from "@/assets/api";
import { mapState } from "vuex";
import { sourceListData } from "@/utils/systemData";
import { base64Encode } from "@/utils/basic-methods";
import DsSelectTree from "@/components/DsSelectTree";
export default {
  components: {
    DsSelectTree,
  },
  data() {
    return {
      progress: 0,
      excelTempalteData: [],
      wareData: [],
      sourceData: sourceListData,
      typeProps: {
        children: "children",
        label: "classifyName",
        value: "_id",
      },
      exportForm: {
        exportURL: this.$t("h.tips39"),
        excelName: "Sheet1",
        fileJSON: {},
        inData: [],
        classifyId: [],
        assertPosition: [],
        source: [],
      },
      exportFormRules: {
        exportURL: [
          { required: true, message: this.$t("h.tips42"), trigger: "blur" },
        ],
        excelName: [
          { required: true, message: this.$t("h.tips43"), trigger: "blur" },
        ],
      },
      isExportLoading: false,
      setp: "loading",
      errorText: "",
    };
  },
  props: {
    exportDialogVisible: {
      type: Boolean,
      default: false,
    },
    typeData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["userInfo", "assetFormHeader"]),
    dialogVisible: {
      get() {
        return this.exportDialogVisible;
      },
      set(val) {
        this.$emit("update:exportDialogVisible", val);
      },
    },
    exportLabels() {
      let obj = {};
      this.assetFormHeader.forEach((item) => {
        if (
          item.dbDataName == "inData" ||
          item.dbDataName == "type" ||
          item.dbDataName == "assertPosition" ||
          item.dbDataName == "source"
        )
          obj[item.dbDataName] = item.nameShow;
      });
      return obj;
    },
  },
  methods: {
    // 获取模版
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
            this.excelTempalteData.push(JSON.parse(data.data[key]));
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    wareRemoteMethod(query) {
      if (!query) {
        this.wareData = [];
        return;
      }
      select({
        func: "S0003",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          andLike: query,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.wareData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    dialogVisibleOpened() {
      this.getExcelTempalte();
    },
    dialogVisibleClose() {
      this.isExportLoading = false;
      this.exportForm.exportURL = this.$t("h.tips39");
      this.exportForm.excelName = "Sheet1";
      this.exportForm.fileJSON = {};
      this.exportForm.inData = [];
      this.exportForm.classifyId = [];
      this.exportForm.assertPosition = [];
      this.exportForm.source = [];
      this.excelTempalteData = [];

      this.progress = 0;
      this.setp = "loading";
      this.errorText = "";
    },
    sumbitExprotForm() {
      this.$refs.exportFormRef.validate((valid) => {
        if (!valid) return false;
        if (this.exportForm.inData == null) this.exportForm.inData = [];
        this.isExportLoading = true;
        select({
          func: "S0050",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            fileName: this.exportForm.fileJSON.name,
            inData: this.exportForm.inData.join(","),
            classifyId: this.exportForm.classifyId.join(","),
            warehouseId: this.exportForm.assertPosition.join(","),
            source: this.exportForm.source.join(","),
            permissonId: 56,
          },
        })
          .then(({ data }) => {
            this.progress = 50;
            if (data.code != 0) {
              this.progress = 100;
              this.setp = "error";
              this.errorText = data.data;
              return false;
            }
            if (Object.keys(this.exportForm.fileJSON).length) {
              printPost(
                "post",
                { sendCode: 2, param: 3 },
                {
                  inputType: "fileBase64",
                  dbFile: base64Encode(JSON.stringify(data.data)),
                  templateFile: base64Encode(
                    JSON.stringify(this.exportForm.fileJSON)
                  ),
                  outPath: this.exportForm.exportURL,
                  sheetName: this.exportForm.excelName,
                }
              )
                .then(({ data }) => {
                  this.progress = 100;
                  if (data.code != 0) {
                    this.setp = "error";
                    this.errorText = data.data;
                    return;
                  }
                  this.setp = "success";
                })
                .catch(() => {
                  this.progress = 100;
                  this.setp = "error";
                  this.errorText = this.$t("h.title26");
                });
            } else {
              printPost(
                "post",
                { sendCode: 2, param: 3 },
                {
                  inputType: "fileBase64",
                  dbFile: base64Encode(JSON.stringify(data.data)),
                  templateFile: base64Encode(
                    JSON.stringify(data.data.template)
                  ),
                  outPath: this.exportForm.exportURL,
                  sheetName: this.exportForm.excelName,
                }
              )
                .then(({ data }) => {
                  this.progress = 100;
                  if (data.code != 0) {
                    this.setp = "error";
                    this.errorText = data.message;
                    return false;
                  }
                  this.setp = "success";
                })
                .catch(() => {
                  this.progress = 100;
                  this.setp = "error";
                  this.errorText = this.$t("h.title26");
                });
            }
          })
          .catch(() => {
            this.progress = 100;
            this.setp = "error";
            this.errorText = this.$t("h.title26");
          });
      });
    },
    cancelExportForm() {
      this.dialogVisible = false;
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
  //   height: 590px;
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
    height: 554px;
    box-sizing: border-box;
  }
  .form {
    margin-top: 14px;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .btns {
    text-align: center;
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
.result {
  padding: 14px;
  display: flex;
  align-items: center;
  height: 300px;
  overflow: auto;
  .loading {
    width: 100%;
    text-align: center;
  }
  .result-success {
    width: 100%;
    text-align: center;
    .text {
      font-size: 20px;
    }
    i {
      color: #67c23a;
    }
  }
  .result-error {
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
</style>
