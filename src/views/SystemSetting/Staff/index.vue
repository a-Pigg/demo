<template>
  <div class="staff">
    <el-card class="staff-card">
      <div slot="header" class="staff-card-header">
        <div class="dept-title">
          <h3>{{ $t("h.department") }}</h3>
        </div>
        <div class="staff-header">
          <div class="btns">
            <ds-query-form>
              <ds-query-form-left-panel>
                <el-button
                  size="small"
                  type="primary"
                  @click="newBillsDialogVisible = true"
                  >{{ $t("h.newBtn") }}</el-button
                >
                <el-button size="small" type="primary" @click="showAllStaffs">{{
                  $t("h.showAllStaff")
                }}</el-button>
                <el-dropdown trigger="click">
                  <el-button size="small"
                    >{{ $t("h.editBtn") }}
                    <i class="el-icon-arrow-down el-icon--right"></i
                  ></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editStaffForm">{{
                      $t("h.changeBtn")
                    }}</el-dropdown-item>
                    <el-dropdown-item @click.native="deleteStaffs">{{
                      $t("h.delBtn")
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button size="small" @click="readDialogVisible = true">{{
                  $t("h.bulkBtn")
                }}</el-button>
              </ds-query-form-left-panel>
              <ds-query-form-right-panel>
                <ds-search-btn
                  :searchValue.sync="andLike"
                  @search="findAssetSearch"
                ></ds-search-btn>
              </ds-query-form-right-panel>
            </ds-query-form>
          </div>
        </div>
      </div>
      <div class="staff-card-content">
        <div class="dept-tree">
          <el-tree
            v-loading="deptLoading"
            ref="treeDeptsRef"
            node-key="_id"
            highlight-current
            :expand-on-click-node="false"
            :data="treeDepts"
            :props="treeDeptsProps"
            @node-click="handleDeptNodeClick"
          >
            <span slot-scope="{ node, data }">
              <template v-if="data.subId == null">
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
            </span>
          </el-tree>
        </div>
        <div class="staff-table">
          <div class="bills-table">
            <ds-table
              ref="billsTableRef"
              :loading="staffLoading"
              :tableConfig="billsTableConfig"
              :columns="billsColums"
              :tableData="staffBills"
              :rowKey="(row) => row._id"
              @handleSelectionChange="handleSelectionChange"
            >
              <template slot="operation" slot-scope="{ scope }">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-s-custom"
                  @click="allotAccount(scope.row)"
                  >{{ $t("h.accountAllocation") }}</el-button
                >
              </template>
            </ds-table>
          </div>
          <div class="bills-pagination">
            <ds-pagination
              small
              :total="total"
              :page.sync="paginationForm.currentPage"
              :limit.sync="paginationForm.pageSize"
              @pagination="getStaffBills"
            ></ds-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 新建/编辑员工 -->
    <new-bills-dialog
      class="new-bill-dialog"
      :title="newBillTitle"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @closed="newBillsDialogClosed"
      @sbumitForm="sbumitStaffForm"
    >
      <template slot="form">
        <el-form
          ref="staffFormRef"
          :model="staffForm"
          :rules="staffFormRules"
          label-width="80px"
          label-position="left"
        >
          <el-form-item :label="'*' + $t('h.workNumber')" prop="code">
            <el-input
              v-model="staffForm.code"
              :placeholder="$t('h.tips3') + $t('h.workNumber')"
            ></el-input>
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
          <el-form-item :label="$t('h.employeeName')" prop="name">
            <el-input
              v-model="staffForm.name"
              :placeholder="$t('h.tips3') + $t('h.employeeName')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.userName')" prop="phone">
            <el-input
              v-model="staffForm.phone"
              :placeholder="$t('h.tips3') + $t('h.userName')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.department')" prop="deptId">
            <ds-select-tree
              :placeholder="$t('h.tips4') + $t('h.department')"
              v-model="staffForm.deptId"
              :defaultProps="treeDeptsProps"
              :treeData="treeDepts"
            >
            </ds-select-tree>
          </el-form-item>
          <el-form-item :label="$t('h.positionStatus')" prop="workStatus">
            <el-select v-model="staffForm.workStatus" filterable>
              <el-option
                v-for="(item, i) in staffState"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
    <!-- 删除错误详情 -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <!-- 导入员工 -->
    <read-excel-file
      :readDialogVisible.sync="readDialogVisible"
      :setp="setp"
      :percentage="percentage"
      :errorText="errorText"
      :title="$t('h.bulkBtn')"
      @closed="readDialogVisibleClosed"
      @download="downloadImportFile"
      @submit="readDialogVisibleSubmit"
    >
      <upload-excel-file
        :value.sync="file"
        :loading="readLoading"
      ></upload-excel-file>
    </read-excel-file>
    <!-- 分配角色 -->
    <new-bills-dialog
      class="new-allow-dialog"
      :title="$t('h.accountAllocation')"
      :newBillsDialogVisible.sync="newAllowDialogVisible"
      @opened="newAllowDialogVisibleOpened"
      @closed="newAllowDialogVisibleClosed"
      @sbumitForm="newAllowDialogVisibleSubmit"
    >
      <template slot="form">
        <el-form
          label-position="left"
          label-width="80px"
          ref="allotFormRef"
          :model="allotForm"
          :rules="allotFormRules"
        >
          <el-form-item :label="$t('h.userName')" prop="phone">
            <el-input
              v-model.trim="allotForm.phone"
              :placeholder="$t('h.tips3') + $t('h.userName')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.password')" prop="password">
            <el-input
              type="password"
              v-model.trim="allotForm.password"
              show-password
              :placeholder="$t('h.tips3') + $t('h.password')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.roleName')" prop="roleId">
            <el-select v-model="allotForm.roleId" :placeholder="$t('h.tips4')">
              <el-option
                v-for="item in roles"
                :key="item._id"
                :label="item.roleName"
                :value="item._id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
  </div>
</template>
<script>
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsSelectTree from "@/components/DsSelectTree";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import ReadExcelFile from "@/components/ReadExcelFile";
import UploadExcelFile from "@/components/ReadExcelFile/components/UploadExcelFile.vue";
import { mapState } from "vuex";
import { clickDownloadLink } from "@/utils/basic-methods";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { deleteData, select, update } from "@/assets/api";
import {
  staffBillsColumns,
  deleteStaffErrorColumns,
  staffState,
} from "@/utils/systemData";
import { regEx } from "@/utils/regEx";
import * as XLSX from "xlsx";
export default {
  components: {
    DsTable,
    DsPagination,
    DsSelectTree,
    DsSearchBtn,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    NewBillsDialog,
    DsDeleteDetail,
    ReadExcelFile,
    UploadExcelFile,
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (value) {
        if (regEx.mobile.test(value)) callback();
        callback(new Error(this.$t("h.tips170")));
      }
      callback();
    };
    return {
      deptLoading: false,
      treeDeptsProps: {
        value: "_id",
        label: "deptName",
        children: "children",
      },
      treeDepts: [],
      andLike: "",
      dept_id: null,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      staffLoading: false,
      billsTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      billsColums: staffBillsColumns,
      staffBills: [],
      selectStaffBills: [],
      newBillsDialogVisible: false,
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      staffForm: {
        _id: "",
        name: "",
        phone: "",
        deptId: "",
        workStatus: "",
        code: "",
      },
      staffFormRules: {
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.employeeName"),
            trigger: "blur",
          },
        ],
        // phone: [{ validator: checkPhone, trigger: "blur" }],
        deptId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.department"),
            trigger: "change",
          },
        ],
      },
      staffState: staffState,
      deleteDialogVisible: false,
      deleteColumns: deleteStaffErrorColumns,
      deleteErrorData: [],
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
        "员工编码（必填）": "code",
        "员工名称（必填）": "name",
        "员工所在部门名称（必填）": "deptName",
        手机号码: "phone",
      },
      newAllowDialogVisible: false,
      newBillTitle: this.$t("h.title102"),
      allowLoading: {
        target: ".new-allow-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      allotForm: {
        _id: "",
        phone: "",
        password: "",
        staffId: "",
        roleId: "",
      },
      allotFormRules: {
        phone: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.userName"),
            trigger: "blur",
          },
          // { validator: checkPhone, trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.password"),
            trigger: "blur",
          },
          {
            min: 8,
            max: 16,
            message: this.$t("h.tips171"),
            trigger: "blur",
          },
        ],
        roleId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.roleName"),
            trigger: "change",
          },
        ],
      },
      roles: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
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
          this.treeDepts = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          this.deptLoading = false;
          // "服务器网络异常，查询部门失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getStaffBills() {
      this.staffLoading = true;
      select({
        func: "S0005",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          andLike: this.andLike,
          dept_id: this.dept_id,
        },
      })
        .then(({ data }) => {
          this.staffLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[1];
          this.staffBills = data.data[0];
        })
        .catch(() => {
          this.staffLoading = false;
          // "服务器网络异常，查询员工失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getRoles() {
      select({
        func: "S0002",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.roles = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getStaffBills();
    },
    handleDeptNodeClick(node) {
      this.dept_id = node._id;
      this.paginationForm.currentPage = 1;
      this.getStaffBills();
    },

    handleSelectionChange(val) {
      this.selectStaffBills = val;
    },
    showAllStaffs() {
      this.andLike = "";
      this.paginationForm.currentPage = 1;
      this.dept_id = null;
      this.getStaffBills();
      this.$refs.treeDeptsRef.setCurrentKey(null);
    },
    allotAccount(row) {
      this.allotForm._id = row.userId;
      this.allotForm.staffId = row._id;
      this.allotForm.phone = row.phone;
      this.allotForm.password = "";
      if (row.roleId) this.allotForm.roleId = Number(row.roleId);
      this.newAllowDialogVisible = true;
    },
    editStaffForm() {
      if (this.selectStaffBills.length !== 1) {
        return this.$message.error(this.$t("h.tips22"));
      }
      this.staffForm._id = this.selectStaffBills[0]._id;
      this.staffForm.code = this.selectStaffBills[0].code;
      this.staffForm.deptId = this.selectStaffBills[0].deptId;
      this.staffForm.name = this.selectStaffBills[0].name;
      this.staffForm.phone = this.selectStaffBills[0].phone;
      this.staffForm.workStatus = this.selectStaffBills[0].workStatus;
      this.newBillTitle = this.$t("h.title103");
      this.newBillsDialogVisible = true;
    },
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    async deleteStaffs() {
      if (!this.selectStaffBills.length) {
        return this.$message.error(this.$t("h.tips162"));
      }
      const confirmResult = await this.$confirm(
        this.$t("h.tips172"),
        this.$t("h.title18"),
        {
          confirmButtonText: this.$t("h.confirmBtn"),
          cancelButtonText: this.$t("h.cancelBtn"),
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult === "cancel")
        return this.$message.info(this.$t("h.tips98"));
      this.staffLoading = true;
      this.deleteErrorData = [];
      this.multiDeleteStaff(0);
    },
    multiDeleteStaff(index) {
      if (index > this.selectStaffBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getStaffBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips173"));
        }
        return;
      }
      deleteData({
        func: "D0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectStaffBills[index]._id,
          permissonId: 51,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              code: this.selectStaffBills[index].code,
              name: this.selectStaffBills[index].name,
              reason: data.data,
            });
          }
          this.multiDeleteStaff(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            code: this.selectStaffBills[index].code,
            name: this.selectStaffBills[index].name,
            reason: this.$t("h.tips18"),
          });
          this.multiDeleteStaff(++index);
        });
    },
    newBillsDialogOpened() {
      this.$refs.staffFormRef.clearValidate();
    },
    newBillsDialogClosed() {
      this.staffForm._id = "";
      this.staffForm.code = "";
      this.staffForm.deptId = "";
      this.staffForm.name = "";
      this.staffForm.phone = "";
      this.staffForm.workStatus = "";
      this.staffForm.workStatus = this.staffState[0].value;
      this.newBillTitle = this.$t("h.title102");
      this.$refs.billsTableRef.$refs.dsTableRef.clearSelection();
    },
    sbumitStaffForm() {
      this.$refs.staffFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        let permissonId = this.staffForm._id == "" ? 50 : 52;
        update({
          func: "U0005",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            name: this.staffForm.name,
            phone: this.staffForm.phone,
            deptId: this.staffForm.deptId,
            workStatus: this.staffForm.workStatus,
            _id: this.staffForm._id,
            code: this.staffForm.code,
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newBillsDialogVisible = false;
            this.getStaffBills();
            this.$message.success(data.data);
          })
          .catch(() => {
            LOADING.close();
            // "服务器网络异常，新增/编辑员工失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    readDialogVisibleClosed() {
      this.file.value = "";
      this.file.name = "";
      this.setp = "upload";
      this.percentage = 0;
      this.errorText = "";
    },
    downloadImportFile() {
      clickDownloadLink(
        window.$EXCEL_URL + this.$t("h.assetTemplate5") + ".xlsx"
      );
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
              message: this.$t("h.ttips131itle93"),
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
            func: "U0060",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              staff: crackExcelData,
              permissonId: 50,
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
              this.getStaffBills();
            })
            .catch(() => {
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
    newAllowDialogVisibleOpened() {},
    newAllowDialogVisibleClosed() {
      this.allotForm._id = "";
      this.allotForm.staffId = "";
      this.$refs.allotFormRef.resetFields();
    },
    newAllowDialogVisibleSubmit() {
      this.$refs.allotFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.allowLoading);
        update({
          func: "U0016",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.allotForm._id,
            phone: this.allotForm.phone,
            password: this.allotForm.password,
            roleId: this.allotForm.roleId,
            staffId: this.allotForm.staffId,
            permissonId: 71,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newAllowDialogVisible = false;
            this.$message.success(this.$t("h.tips174"));
            this.getStaffBills();
          })
          .catch(() => {
            LOADING.close();
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
  },
  created() {
    this.getDepts();
    this.getStaffBills();
    this.getRoles();
    let newMapKey = [
      this.$t("h.fileDownload10"),
      this.$t("h.fileDownload11"),
      this.$t("h.fileDownload12"),
      this.$t("h.fileDownload13"),
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
.staff {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  .staff-card {
    padding: 0 15px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    ::v-deep .el-card__header {
      padding: 0;
      height: 60px;
      border: none;
    }
    ::v-deep .el-card__body {
      padding: 0;
      height: calc(100% - 60px);
    }
  }
}
.staff-card-header {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .dept-title {
    display: flex;
    align-items: center;
    min-width: 300px;
    height: 100%;
    width: 25%;
    h3 {
      font-size: 16px;
      font-weight: bold;
      color: #000000;
    }
  }
  .staff-header {
    padding-left: 24px;
    min-width: 580px;
    width: 75%;
    height: 100%;
    box-sizing: border-box;
    .btns {
      width: 100%;
      height: 100%;
      border-bottom: 1px solid #eeeeee;
      box-sizing: border-box;
    }
  }
}
.staff-card-content {
  display: flex;
  height: 100%;
  .dept-tree {
    padding: 0 10px 15px;
    min-width: 300px;
    height: 100%;
    width: 25%;
    border-right: 1px solid #eeeeee;
    overflow: auto;
    box-sizing: border-box;
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
  .staff-table {
    padding-left: 24px;
    min-width: 580px;
    width: 75%;
    height: 100%;
    box-sizing: border-box;
    .bills-table {
      margin-top: 10px;
      height: calc(100% - 50px);
    }
    .bills-pagination {
      height: 40px;
    }
  }
}
.new-bill-dialog,
.new-allow-dialog {
  .el-select {
    width: 100%;
  }
}
</style>
