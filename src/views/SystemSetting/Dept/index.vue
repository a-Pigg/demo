<template>
  <div class="dept">
    <el-card class="dept-card">
      <div slot="header" class="dept-card-header">
        <el-input
          size="small"
          :placeholder="$t('h.title98')"
          suffix-icon="el-icon-search"
          v-model="value"
        >
        </el-input>
      </div>
      <div class="dept-card-content">
        <div class="title">
          <span>{{ $t("h.department") }}</span>
        </div>
        <div class="content">
          <el-tree
            v-loading="deptLoading"
            ref="deptTreeRef"
            highlight-current
            :data="treeDepts"
            :props="treeDeptsProps"
            :filter-node-method="deptFilterNode"
            :expand-on-click-node="false"
            @node-click="handleDeptNode"
          >
            <div slot-scope="{ node, data }">
              <template v-if="!data.subId">
                <img
                  class="tree-top-icon"
                  src="@/assets/images/icon-dept-top.png"
                />
              </template>
              <template v-else>
                <img
                  class="tree-second-icon"
                  src="@/assets/images/icon-dept-second.png"
                />
              </template>
              <span class="text">
                {{ data.code + "-" + node.label }}
              </span>
            </div>
          </el-tree>
        </div>
      </div>
    </el-card>
    <el-card class="detail-card">
      <div slot="header" class="detail-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <h5 class="companyName">
              {{ companyName }}
            </h5>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <el-dropdown trigger="click" size="small">
              <el-button type="primary" size="mini"
                >{{ $t("h.newBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="newPeerDept">{{
                  $t("h.peer")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="newSubDept">{{
                  $t("h.child")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              class="improt-btn"
              size="mini"
              @click="readDialogVisible = true"
              >{{ $t("h.bulkBtn") }}</el-button
            >
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="detail-card-content">
        <el-form
          ref="detailFormRef"
          :model="detailForm"
          :rules="detailFormRules"
          label-width="198px"
          label-position="left"
          class="detail-form"
        >
          <el-form-item :label="$t('h.departmentCode')" prop="code">
            <el-input
              v-model="detailForm.code"
              :placeholder="$t('h.tips3') + $t('h.departmentCode')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.departmentName')" prop="deptName">
            <el-input
              v-model="detailForm.deptName"
              :placeholder="$t('h.tips3') + $t('h.departmentName')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.departmentPhoneNumber')" prop="deptTel">
            <el-input
              v-model="detailForm.deptTel"
              :placeholder="$t('h.tips3') + $t('h.departmentPhoneNumber')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.superiorDepartment')" prop="subId">
            <ds-select-tree
              ref="deptTreeSelectRef"
              :placeholder="$t('h.tips4') + $t('h.superiorDepartment')"
              v-model="detailForm.subId"
              :defaultProps="treeDeptsProps"
              :treeData="selectTreeDepts"
            >
            </ds-select-tree>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button size="small" @click="deleteDetailForm">{{
            $t("h.delBtn")
          }}</el-button>
          <el-button size="small" type="primary" @click="submitDetailForm">{{
            $t("h.saveBtn")
          }}</el-button>
        </div>
      </div>
    </el-card>
    <new-bills-dialog
      class="new-bill-dialog"
      :title="$t('h.title99')"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitDeptForm"
    >
      <template slot="form">
        <el-form
          ref="deptFormRef"
          label-width="198px"
          :model="deptForm"
          :rules="deptFormRules"
        >
          <el-form-item :label="'*' + $t('h.departmentCode')" prop="code">
            <el-input v-model="deptForm.code"></el-input>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('h.tips17')"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="
                  font-size: 20px;
                  color: #473bb4;
                  position: absolute;
                  top: 10px;
                  right: -20px;
                "
              ></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('h.departmentName')" prop="deptName">
            <el-input v-model="deptForm.deptName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.departmentPhoneNumber')" prop="deptTel">
            <el-input v-model="deptForm.deptTel"></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.superiorDepartment')">
            <ds-select-tree
              :placeholder="$t('h.tips4') + $t('h.superiorDepartment')"
              v-model="deptForm.subId"
              disabled
              :treeData="treeDepts"
              :defaultProps="treeDeptsProps"
            >
            </ds-select-tree>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
    <read-excel-file
      :readDialogVisible.sync="readDialogVisible"
      :setp="setp"
      :percentage="percentage"
      :errorText="errorText"
      :title="$t('h.bulkBtn')"
      @download="downloadImportFile"
      @closed="readDialogVisibleClosed"
      @submit="readDialogVisibleSubmit"
    >
      <upload-excel-file
        :value.sync="file"
        :loading="readLoading"
      ></upload-excel-file>
    </read-excel-file>
  </div>
</template>
<script>
import ReadExcelFile from "@/components/ReadExcelFile";
import UploadExcelFile from "@/components/ReadExcelFile/components/UploadExcelFile.vue";
import DsSelectTree from "@/components/DsSelectTree";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import deepCopy from "@/utils/deepCopy";
import * as XLSX from "xlsx";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { deleteData, select, update } from "@/assets/api";
import { mapState } from "vuex";
import { clickDownloadLink } from "@/utils/basic-methods";
export default {
  components: {
    ReadExcelFile,
    UploadExcelFile,
    DsSelectTree,
    NewBillsDialog,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      companyName: "",
      value: "", // 树状搜索值
      deptLoading: false,
      depts: [],
      treeDepts: [],
      selectTreeDepts: [],
      treeDeptsProps: {
        value: "_id",
        label: "deptName",
        children: "children",
      },
      detailForm: {
        _id: "",
        subId: "",
        code: "",
        deptName: "",
        deptTel: "",
      },
      detailFormRules: {
        deptName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.departmentName"),
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.departmentCode"),
            trigger: "blur",
          },
        ],
      },
      newBillsDialogVisible: false,
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      deptForm: {
        subId: "",
        code: "",
        deptName: "",
        deptTel: "",
      },
      deptFormRules: {
        deptName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.departmentName"),
            trigger: "blur",
          },
        ],
      },
      readDialogVisible: false,
      file: {
        value: "",
        name: "",
      },
      setp: "upload",
      percentage: 0,
      errorText: "",
      readLoading: false,
      mapKey: {
        "部门编码（必填）": "code",
        "部门名称（必填）": "deptName",
        上级部门编码: "subCode",
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  watch: {
    treeDepts(val) {
      if (val) {
        this.$nextTick(() => {
          document.querySelector(".el-tree-node__content").click();
        });
      }
    },
    value(val) {
      this.$refs.deptTreeRef.filter(val);
    },
  },
  methods: {
    getDepts() {
      this.deptLoading = true;
      select({
        func: "S0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.deptLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.depts = data.data;
          this.treeDepts = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          this.deptLoading = false;
          // "服务器网络异常，请求部门失败"
          return this.$message.error(this.$t("h.tips18"));
        });
    },
    // 树状部门搜索
    deptFilterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    // 点击部门
    handleDeptNode(data) {
      this.$refs.detailFormRef.clearValidate();
      this.selectTreeDepts = deepCopy(this.treeDepts);
      if (data) {
        this.$nextTick(() => {
          this.$refs.deptTreeSelectRef.removeNode(data);
        });
        this.detailForm._id = data._id;
        this.detailForm.code = data.code;
        this.detailForm.deptTel = data.deptTel;
        this.detailForm.deptName = data.deptName;
        this.detailForm.subId = data.subId;
      }
    },
    newPeerDept() {
      this.deptForm.subId = this.detailForm.subId;
      this.newBillsDialogVisible = true;
    },
    newSubDept() {
      this.deptForm.subId = this.detailForm._id;
      this.newBillsDialogVisible = true;
    },
    submitDetailForm() {
      this.$refs.detailFormRef.validate((valid) => {
        if (!valid) return false;
        this.deptLoading = true;
        update({
          func: "U0004",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.detailForm._id,
            code: this.detailForm.code,
            deptName: this.detailForm.deptName,
            deptTel: this.detailForm.deptTel,
            subId: this.detailForm.subId,
            permissonId: 48,
          },
        })
          .then(({ data }) => {
            if (data.code != 0) {
              this.deptLoading = false;
              return this.$message.error(data.data);
            }
            this.getDepts();
            this.$message.success(this.$t("h.tips102"));
          })
          .catch(() => {
            this.deptLoading = false;
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    deleteDetailForm() {
      this.$confirm(this.$t("h.tips165"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          if (this.detailForm._id == 1) {
            return this.$message.error(this.$t("h.tips166"));
          }
          this.deptLoading = true;
          deleteData({
            func: "D0003",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              _id: this.detailForm._id,
              permissonId: 47,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) {
                this.deptLoading = false;
                return this.$message.error(data.data);
              }
              this.getDepts();
              this.$message.success(this.$t("h.tips128"));
            })
            .catch(() => {
              this.deptLoading = false;
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message.info({ message: this.$t("h.tips98") });
        });
    },
    newBillsDialogOpened() {
      this.$refs.deptFormRef.clearValidate();
    },
    newBillsDialogClose() {
      // this.$refs.deptFormRef.resetFields();
      this.deptForm.subId = "";
      this.deptForm.code = "";
      this.deptForm.deptTel = "";
      this.deptForm.deptName = "";
    },
    sbumitDeptForm() {
      this.$refs.deptFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        update({
          func: "U0004",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            deptId: "",
            code: this.deptForm.code,
            deptName: this.deptForm.deptName,
            deptTel: this.deptForm.deptTel,
            subId: this.deptForm.subId,
            permissonId: 46,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newBillsDialogVisible = false;
            this.getDepts();
            this.$message.success(data.data);
          })
          .catch(() => {
            LOADING.close();
            // "服务器网络异常，新建部门失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    downloadImportFile() {
      clickDownloadLink(
        window.$EXCEL_URL + this.$t("h.assetTemplate4") + ".xlsx"
      );
    },
    readDialogVisibleClosed() {
      this.file.value = "";
      this.file.name = "";
      this.setp = "upload";
      this.percentage = 0;
      this.errorText = "";
    },
    readDialogVisibleSubmit() {
      if (!this.file.value)
        return this.$notify.error({
          title: this.$t("h.title18"),
          message: this.$t("h.title93"),
        });
      this.readExcel();
    },
    readExcel() {
      this.readLoading = true;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
            cellDates: false,
          });
          const wsname = workbook.SheetNames[0];
          // 解析为json,打印ws 就可以看到读取出的表格数据
          const ws = XLSX.utils
            .sheet_to_json(workbook.Sheets[wsname])
            .splice(1);
          if (!ws.length) {
            this.readLoading = false;
            return this.$notify.error({
              title: this.$t("h.title27"),
              message: this.$t("h.tips131"),
            });
          }
          let crackExcelData = [];
          for (let i = 0; i < ws.length; i++) {
            let ExecekRow = {};
            for (let key in ws[i]) ExecekRow[this.mapKey[key]] = ws[i][key];
            crackExcelData.push(ExecekRow);
          }
          this.readLoading = false;
          this.setp = "loading";
          this.percentage = 50;
          update({
            func: "U0054",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              dept: crackExcelData,
              permissonId: 49,
            },
          })
            .then(({ data }) => {
              this.percentage = 100;
              if (data.code != 0) {
                this.setp = "result";
                this.errorText = data.data;
                return;
              }
              this.setp = "result";
              this.getDepts();
            })
            .catch((err) => {
              console.log(err);
              this.percentage = 100;
              this.setp = "result";
              this.errorText = this.$t("h.tips18");
            });
        } catch (error) {
          this.readLoading = false;
          this.$notify({
            title: this.$t("h.title27"),
            message: this.$t("h.tips156"),
          });
        }
      };
      fileReader.readAsBinaryString(this.file.value);
    },
  },
  created() {
    this.getDepts();
    this.companyName = window.sessionStorage.getItem("loginCompanyName");
    let newMapKey = [
      this.$t("h.fileDownload1"),
      this.$t("h.fileDownload2"),
      this.$t("h.fileDownload3"),
    ];
    const keys = [];
    for (var key in this.mapKey) {
      keys.push(key);
    }
    let str1 = JSON.stringify(this.mapKey);
    //tarKeys的数组长度和this.mapKey的key值长度一致，不一致也没影响，无论谁多谁少
    for (let i = 0; i < newMapKey.length; i++) {
      str1 = str1.replace(keys[i], newMapKey[i]);
    }
    this.mapKey = JSON.parse(str1);
  },
};
</script>
<style lang="scss" scoped>
.dept {
  display: flex;
  padding: 15px;
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
::v-deep .dept-card {
  padding: 0px 24px 24px 24px;
  min-width: 300px;
  width: 32%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  .el-card__header {
    padding: 0;
    height: 60px;
    border: none;
  }
  .el-card__body {
    padding: 24px 0 0 0;
    height: calc(100% - 60px);
    box-sizing: border-box;
  }
  .dept-card-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
  }
  .dept-card-content {
    min-width: 250px;
    height: 100%;
    overflow: hidden;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #000000;
    }
    .content {
      margin-top: 16px;
      height: calc(100% - 37px);
      overflow: auto;
    }
    .tree-top-icon {
      vertical-align: middle;
      width: 20px;
      height: 20px;
    }
    .tree-second-icon {
      vertical-align: middle;
      width: 16px;
      height: 16px;
    }
    .text {
      font-size: 14px;
      vertical-align: middle;
    }
    .is-current {
      font-weight: bold;
    }
  }
}
::v-deep .detail-card {
  padding: 0 15px;
  margin-left: 16px;
  min-width: 580px;
  width: 68%;
  height: 100%;
  box-sizing: border-box;
  .el-card__header {
    padding: 0;
    height: 60px;
    border: none;
  }
  .el-card__body {
    padding: 0;
    height: calc(100% - 60px);
  }
  .detail-card-header {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    .companyName {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #000000;
    }
    .improt-btn {
      margin-left: 10px;
    }
  }
  .detail-card-content {
    padding: 20px 0;
    height: 100%;
    box-sizing: border-box;
    .detail-form {
      margin-left: 24px;
      max-width: 550px;
    }
    .btns {
      margin-top: 50px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
