<template>
  <div class="record">
    <el-card class="record-card">
      <div slot="header" class="record-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button
              size="small"
              type="primary"
              @click="newBillsDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>{{ $t("h.changeBtn") }}</el-dropdown-item>
                <el-dropdown-item>{{ $t("h.delBtn") }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.formTips5")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>{{
                  $t("h.printDoucmentBtn")
                }}</el-dropdown-item>
                <el-dropdown-item>{{
                  $t("h.templateSettings")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <ds-search-btn></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="record-card-content">
        <!-- 高级筛选 -->
        <div class="record-filter">
          <el-button class="advanced-filter-btn" type="text" size="small">{{
            $t("h.advancedBtn")
          }}</el-button>
        </div>
        <!-- 单据表格 -->
        <div class="record-table">
          <ds-table
            :columns="paymentRecordBillsColumns"
            :tableConfig="paymentRecordBillsColfing"
            :tableData="paymentRecordBills"
          ></ds-table>
        </div>
        <!-- 分页 -->
        <div class="record-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getPaymentRecordBills"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <new-bills-dialog
      class="new-bill-dialog"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitPaymentRecordForm"
    >
      <template slot="form">
        <el-form
          ref="paymentRecordFormRef"
          label-width="110px"
          :model="paymentRecordForm"
          :rules="paymentRecordRules"
        >
          <el-form-item :label="$t('h.paymentDate')" prop="paidDate">
            <!-- format="yyyy 年 MM 月 dd 日" -->
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('h.tips4') + $t('h.paymentDate')"
              v-model="paymentRecordForm.paidDate"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot="btns">
        <div>
          <span class="title"
            >{{ $t("h.title151") }} - {{ $t("h.title152") }}</span
          >
        </div>
        <div class="btns">
          <el-button
            type="text"
            size="small"
            @click="paymentOrderDialogVisible = true"
            >{{ $t("h.addBtn") }}</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="deletePaymentRecordGoods"
            >{{ $t("h.delBtn") }}</el-button
          >
        </div>
      </template>
      <template slot="table">
        <div class="bill-table">
          <ds-table
            ref="paymentRecordTableRef"
            :columns="paymentRecordGoodsColumns"
            :tableConfig="paymentRecordBillsColfing"
            :tableData="paymentRecordGoods"
            @handleSelectionChange="paymentRecordGoodsSelectionChange"
          ></ds-table>
        </div>
      </template>
    </new-bills-dialog>
    <payment-order-dialog
      :paymentOrderDialogVisible.sync="paymentOrderDialogVisible"
      :updatePaymentSelectState="paymentRecordGoods"
      @save="peymentOrderSave"
    ></payment-order-dialog>
  </div>
</template>
<script>
import PaymentOrderDialog from "@/components/BillsComponents/PurchaseMangeComponents/PaymentOrderDialog";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { select, update } from "@/assets/api";
import { mapState } from "vuex";
import {
  paymentRecordBillsColumns,
  paymentRecordGoodsColumns,
} from "@/utils/systemData";
export default {
  components: {
    PaymentOrderDialog,
    NewBillsDialog,
    DsSearchBtn,
    DsTable,
    DsPagination,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      tableLoading: false,
      paymentRecordBillsColumns: paymentRecordBillsColumns,
      paymentRecordBillsColfing: {
        selection: true,
        reserveSelection: true,
      },
      paymentRecordBills: [],
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      newBillsDialogVisible: false,
      paymentRecordForm: {
        paidDate: "",
      },
      paymentRecordRules: {},
      paymentRecordGoodsColumns: paymentRecordGoodsColumns,
      paymentRecordGoods: [],
      selectPaymentRecordGoods: [],
      paymentOrderDialogVisible: false,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    getPaymentRecordBills() {
      this.tableLoading = true;
      select({
        func: "S0064",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          isPaid: 0,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.paymentRecordBills = data.data[1];
        })
        .catch(() => {
          this.tableLoading = false;
          // 服务器网络错误，请求付款登记单据失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    peymentOrderSave(val) {
      this.paymentRecordGoods = val.map((el) => {
        return {
          id: el.id,
          roleRule: el.roleRule,
          totalAmount: el.totalAmount,
          paidAmount: el.paidAmount,
        };
      });
      this.paymentOrderDialogVisible = false;
    },
    paymentRecordGoodsSelectionChange(val) {
      this.selectPaymentRecordGoods = val;
    },
    deletePaymentRecordGoods() {
      this.selectPaymentRecordGoods.forEach((item) => {
        this.paymentRecordGoods.splice(
          this.paymentRecordGoods.findIndex((el) => el.id == item.id),
          1
        );
      });
      this.$refs.paymentRecordTableRef.$refs.dsTableRef.clearSelection();
    },
    newBillsDialogOpened() {
      this.$refs.paymentRecordFormRef.clearValidate();
    },
    newBillsDialogClose() {
      this.paymentRecordGoods = [];
      this.selectPaymentRecordGoods = [];
      this.paymentRecordForm.paidDate = "";
    },
    sbumitPaymentRecordForm() {
      this.$refs.paymentRecordFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.paymentRecordGoods.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips247"),
          });
        }
        const LOADING = this.$loading(this.dialogLoading);
        let ids = [];
        this.paymentRecordGoods.forEach((el) => {
          ids.push(el.id);
        });
        update({
          func: "U0071",
          token: this.userInfo.token,
          userId: this.userInfo._id,
          requstData: {
            paidDate: this.paymentRecordForm.paidDate,
            ids: ids.join(","),
            permissonId: 26,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getPaymentRecordBills();
          })
          .catch(() => {
            LOADING.close();
            // "服务器网络错误，新增/编辑单据失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
  },
  created() {
    this.getPaymentRecordBills();
  },
};
</script>
<style lang="scss" scoped>
.record {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .record-card {
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
.record-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.record-card-content {
  height: 100%;
  .record-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .record-table {
    height: calc(100% - 75px);
  }
  .record-pagination {
    height: 40px;
  }
}
.new-bill-dialog {
  .el-date-editor {
    width: 100%;
  }
  .bill-table {
    margin-top: 10px;
    height: 740px;
  }
}
</style>
