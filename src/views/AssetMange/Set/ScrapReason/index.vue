<template>
  <!-- ScrapReason（报废原因设置） -->
  <div class="reason">
    <el-card class="reason-card">
      <div slot="header" class="reason-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button
              type="primary"
              size="small"
              @click="reasonBillsDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-button type="danger" size="small" @click="deleteReasons">{{
              $t("h.delBtn")
            }}</el-button>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <ds-search size="small" :value.sync="andLike"></ds-search>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="reason-card-content">
        <div class="bills-table">
          <ds-table
            ref="billsTableRef"
            :loading="loading"
            :columns="columns"
            :tableConfig="tableConfig"
            :rowKey="(row) => row._id"
            :tableData="scrapTables"
            @handleSelectionChange="handleSelectionChange"
          >
            <template slot="operation" slot-scope="{ scope }">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="editReason(scope.row)"
                >{{ $t("h.editBtn") }}</el-button
              >
              <span class="line"></span>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click="deleteReason(scope.row)"
                >{{ $t("h.delBtn") }}</el-button
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
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <!-- 新建报废原因弹窗 -->
    <new-bills-dialog
      class="new-bill-dialog"
      :title="$t('h.newBtn') + $t('h.scrapReason')"
      :newBillsDialogVisible.sync="reasonBillsDialogVisible"
      @opened="reasonBillsDialogOpened"
      @close="reasonBillsDialogClose"
      @sbumitForm="sbumitReasonForm"
    >
      <template slot="form">
        <el-form
          ref="reasonFormRef"
          label-width="130px"
          :model="reasonForm"
          :rules="reasonFormRules"
        >
          <el-form-item
            :label="$t('h.scrapReason')"
            prop="code"
            label-width="120px"
          >
            <el-input
              v-model="reasonForm.scrapResult"
              :placeholder="$t('h.tips3') + $t('h.scrapReason')"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
    <!-- 删除错误弹窗 -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
  </div>
</template>
<script>
import DsDeleteDetail from "@/components/DsDeleteDetail";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsSearch from "@/components/DsSearch";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { mapState } from "vuex";
import {
  deleteReasonErrorColumns,
  scrapReasonBillsColumns,
} from "@/utils/systemData";
import { deleteData, select, update } from "@/assets/api";
export default {
  components: {
    DsDeleteDetail,
    NewBillsDialog,
    DsTable,
    DsPagination,
    DsSearch,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      loading: false,
      columns: scrapReasonBillsColumns,
      tableConfig: {
        selection: true,
        reserveSelection: true,
      },
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      scrapReasonBills: [],
      selectScrapReasonBills: [],
      andLike: "",
      reasonBillsDialogVisible: false,
      reasonLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      reasonForm: {
        _id: "",
        scrapResult: "",
      },
      reasonFormRules: {
        scrapResult: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.scrapReason"),
            trigger: "blur",
          },
        ],
      },
      deleteDialogVisible: false,
      deleteColumns: deleteReasonErrorColumns,
      deleteErrorData: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    scrapTables() {
      const search = this.andLike;
      if (search) {
        return this.scrapReasonBills.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search) > -1;
          });
        });
      }
      return this.scrapReasonBills;
    },
  },
  methods: {
    // 获取报废原因
    getScrapReasons() {
      this.loaidng = false;
      select({
        func: "S0012",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data.length;
          this.scrapReasonBills = data.data;
        })
        .catch(() => {
          this.loading = false;
          // "服务器网络错误，请求报废原因失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 表格选中项
    handleSelectionChange(val) {
      this.selectScrapReasonBills = val;
    },
    // 编辑报废原因
    editReason(row) {
      this.reasonForm._id = row._id;
      this.reasonForm.scrapResult = row.scrapResult;
      this.reasonBillsDialogVisible = true;
    },
    // 删除报废原因（单项）
    deleteReason(row) {
      this.$confirm(this.$t("h.tips158"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          deleteData({
            func: "D0015",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              _id: row._id,
              permissonId: 22,
            },
          })
            .then(({ data }) => {
              this.loading = false;
              if (data.code != 0) return this.$message.error(data.data);
              this.getScrapReasons();
            })
            .catch(() => {
              this.loading = false;
              // "服务器网络错误，删除报废原因失败"
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    // 删除报废原因（多项）
    deleteReasons() {
      if (!this.selectScrapReasonBills.length) {
        return this.$message.error(this.$t("h.tips159"));
      }
      this.$confirm(this.$t("h.tips158"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          this.deleteErrorData = [];
          this.multiDeleteReason(0);
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    // 删除报废原因（多项）逻辑
    multiDeleteReason(index) {
      if (index > this.selectScrapReasonBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getScrapReasons();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips160"));
        }
      }
      deleteData()
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              scrapResult: this.selectScrapReasonBills[index].scrapResult,
              reason: data.data,
            });
          }
          this.multiDeleteReason(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            scrapResult: this.selectScrapReasonBills[index].scrapResult,
            reason: this.$t("h.tips18"),
          });
          this.multiDeleteReason(++index);
        });
    },
    // 删除错误弹窗关闭
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    // 新建/编辑报废弹窗开启
    reasonBillsDialogOpened() {
      this.$refs.reasonFormRef.clearValidate();
    },
    // 新建/编辑报废弹窗关闭
    reasonBillsDialogClose() {
      this.reasonForm._id = "";
      this.reasonForm.scrapResult = "";
    },
    // 提交新建/编辑报废原因
    sbumitReasonForm() {
      this.$refs.reasonFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.reasonLoading);
        let permissonId = this.reasonForm._id == "" ? 20 : 21;
        update({
          func: "U0015",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.reasonForm._id,
            scrapResult: this.reasonForm.scrapResult,
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.reasonBillsDialogVisible = false;
            this.getScrapReasons();
            this.$message.success(data.data);
          })
          .catch(() => {
            LOADING.close();
            // "服务器网络错误，新增编辑报废原因失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
  },
  created() {
    this.getScrapReasons();
  },
};
</script>
<style lang="scss" scoped>
.reason {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .reason-card {
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
.reason-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.reason-card-content {
  height: 100%;
  .bills-table {
    margin-top: 10px;
    height: calc(100% - 50px);
    .line {
      vertical-align: middle;
      margin: 0 10px;
      border-right: 2px solid #000;
    }
  }
  .bills-pagination {
    height: 40px;
  }
}
</style>
