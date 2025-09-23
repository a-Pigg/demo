<template>
  <div class="backup">
    <el-card class="backup-card">
      <div slot="header" class="backup-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button
              size="small"
              type="primary"
              @click="newBillsDialogVisible = true"
              >{{ $t("h.addBackup") }}</el-button
            >
          </ds-query-form-left-panel>
        </ds-query-form>
      </div>
      <div class="backup-card-content">
        <div class="bills-table">
          <ds-table
            :loading="tableLoading"
            :tableData="
              backupBills.slice(
                (paginationForm.currentPage - 1) * paginationForm.pageSize,
                paginationForm.currentPage * paginationForm.pageSize
              )
            "
            :columns="backupBillsColumns"
            :tableConfig="backupBillsConfig"
            :rowKey="(row) => row._id"
          >
            <template slot="operation" slot-scope="{ scope }">
              <ul class="btns">
                <li @click="recoverData(scope.row.name)">
                  <img src="@/assets/images/icon-backup.png" alt="" />
                  <span>{{ $t("h.recoverDatabase") }}</span>
                </li>
                <li class="borderStyle" @click="deleteBackUp(scope.row.name)">
                  <i class="el-icon-delete"></i>
                  <span class="text">{{ $t("h.deleteBackup") }}</span>
                </li>
              </ul>
            </template>
          </ds-table>
        </div>
        <div class="bills-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <new-bills-dialog
      class="new-vendor-dialog"
      :title="$t('h.newBtn') + $t('h.backups')"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @sbumitForm="sbumitBackUpForm"
      @close="newDialogVisibleClose"
    >
      <template slot="form">
        <el-form ref="backUpFormRef" label-width="90px" :model="backUpForm">
          <el-form-item :label="$t('h.comment')" prop="alias">
            <el-input
              type="textarea"
              v-model.trim="backUpForm.alias"
              :placeholder="$t('h.tips3') + $t('h.comment')"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
  </div>
</template>
<script>
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import { backupTableColumns } from "@/utils/systemData";
import { sync } from "@/assets/api";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    DsTable,
    DsPagination,
    NewBillsDialog,
    DsQueryForm,
    DsQueryFormLeftPanel,
  },
  data() {
    return {
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      dbClassName: "",
      tableLoading: false,
      backupBillsConfig: { index: true },
      backupBillsColumns: backupTableColumns,
      backupBills: [],
      newBillsDialogVisible: false,
      dialogLoading: {
        target: ".new-vendor-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      backUpForm: {
        alias: "",
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    ...mapActions(["GET_ASSETFORMHEADER", "GET_ASSETTABLEHEADER"]),
    getBackupBills() {
      this.tableLoading = true;
      sync({
        func: "C0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          dbClassName: this.dbClassName,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          this.backupBills = [];
          if (data.code != 0) return this.$message.error(data.data);
          data.data.split(",").forEach((item, index) => {
            this.backupBills.push({
              _id: index,
              name: item,
            });
          });
          this.total = this.backupBills.length;
        })
        .catch(() => {
          this.tableLoading = false;
          // "络异常，请求备份数据失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    recoverData(name) {
      this.$confirm(this.$t("h.tips182"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          this.tableLoading = true;
          sync({
            func: "C0005",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              dbClassName: this.dbClassName,
              chooseVersion: name,
              permissonId: 74,
            },
          })
            .then(async ({ data }) => {
              this.tableLoading = false;
              if (data.code != 0) return this.$message.error(data.data);
              this.$message.error(data.data);
              await this.GET_ASSETFORMHEADER(); //请求资产表头
              await this.GET_ASSETTABLEHEADER(); //请求资产表头
            })
            .catch(() => {
              this.tableLoading = false;
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: this.$t("h.tips183") });
        });
    },
    deleteBackUp(name) {
      this.$confirm(this.$t("h.tips184"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          this.tableLoading = true;
          sync({
            func: "C0008",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              dbClassName: this.dbClassName,
              versionName: name,
              permissonId: 72,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) {
                this.tableLoading = false;
                return this.$message.error(data.data);
              }
              this.$message.success(data.data);
              let timer = setTimeout(() => {
                clearTimeout(timer);
                this.getBackupBills();
              }, 1000);
            })
            .catch(() => {
              this.tableLoading = false;
              // "服务器网络出错，删除备份失败"
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: this.$t("h.tips183") });
        });
    },
    newDialogVisibleClose() {
      this.backUpForm.alias = "";
    },
    sbumitBackUpForm() {
      const LOADING = this.$loading(this.dialogLoading);
      sync({
        func: "C0003",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          dbClassName: this.dbClassName,
          alias: this.backUpForm.alias,
          permissonId: 72,
        },
      })
        .then(async ({ data }) => {
          LOADING.close();
          if (data.data != "ok") return this.$message.error(data.data);
          this.newBillsDialogVisible = false;
          this.$message.success(this.$t("h.tips185"));
          this.getBackupBills();
        })
        .catch(() => {
          LOADING.close();
          // "服务器网络出错，备份失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
  },
  created() {
    this.dbClassName = window.sessionStorage.getItem("loginCompanyName");
    this.getBackupBills();
  },
};
</script>
<style lang="scss" scoped>
.backup {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .backup-card {
    padding: 0 15px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
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
.backup-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.backup-card-content {
  height: 100%;
  .bills-table {
    margin-top: 10px;
    height: calc(100% - 50px);
  }
  .bills-pagination {
    height: 40px;
  }
}
.btns {
  display: flex;
  li {
    padding: 0 8px;
    cursor: pointer;
    color: #588ab9;
    img {
      vertical-align: middle;
      margin-right: 3px;
      width: 14px;
      height: 14px;
    }
    span {
      font-size: 12px;
    }
  }
}
.borderStyle {
  position: relative;
  &::after {
    position: absolute;
    top: 6px;
    left: 0px;
    content: "";
    width: 2px;
    height: 14px;
    background: #000;
  }
  .el-icon-delete {
    margin-right: 2px;
    font-size: 16px;
  }
}
</style>
