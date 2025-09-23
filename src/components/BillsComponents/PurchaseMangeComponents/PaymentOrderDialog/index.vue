<template>
  <el-dialog
    top="0"
    custom-class="paymentOrderDialog"
    :show-close="false"
    :visible.sync="dialogVisible"
    @opened="dialogVisibleOpened"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <span>{{ $t("h.title150") }} {{ $t("h.paymentRequestOrder") }}</span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="dialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body">
      <div class="payment-order-filter">
        <el-button class="advanced-filter-btn" type="text" size="small">{{
          $t("h.advancedBtn")
        }}</el-button>
      </div>
      <div class="payment-order-table">
        <ds-table
          ref="paymentOrderTableRef"
          :loading="loading"
          :columns="paymentBillsColumns"
          :tableConfig="paymentBillsConfig"
          :tableData="paymentBills"
          :rowKey="(row) => row.id"
          @handleSelectionChange="handleSelectionChange"
        ></ds-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <ds-pagination
        small
        :total="total"
        :page.sync="paginationForm.currentPage"
        :limit.sync="paginationForm.pageSize"
        @pagination="getPaymentBills"
      ></ds-pagination>
      <div class="btns">
        <el-button size="mini" @click="dialogVisible = false">{{
          $t("h.cancelBtn")
        }}</el-button>
        <el-button type="primary" size="mini" @click="save">{{
          $t("h.confirmBtn")
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { paymentBillsColumns } from "@/utils/systemData";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import { select } from "@/assets/api";
export default {
  components: {
    DsTable,
    DsPagination,
  },
  data() {
    return {
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      loading: false,
      paymentBillsColumns: paymentBillsColumns,
      paymentBillsConfig: {
        selection: true,
        reserveSelection: true,
      },
      paymentBills: [],
      selectPaymentBills: [],
    };
  },
  props: {
    paymentOrderDialogVisible: {
      type: Boolean,
      default: false,
    },
    updatePaymentSelectState: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    dialogVisible: {
      get() {
        return this.paymentOrderDialogVisible;
      },
      set(val) {
        this.$emit("update:paymentOrderDialogVisible", val);
      },
    },
  },
  methods: {
    getPaymentBills() {
      this.loading = true;
      select({
        func: "S0064",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          status: 0,
        },
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.paymentBills = data.data[1];
        })
        .catch(() => {
          this.loading = false;
          // 服务器网络错误，请求付款申请单据失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    dialogVisibleOpened() {
      this.$refs.paymentOrderTableRef.$refs.dsTableRef.clearSelection();
      this.updatePaymentSelectState.forEach((item) => {
        let paymentItem = this.paymentBills.find((el) => el.id == item.id);
        this.$refs.paymentOrderTableRef.$refs.dsTableRef.toggleRowSelection(
          paymentItem,
          true
        );
      });
      this.getPaymentBills();
    },
    handleSelectionChange(val) {
      this.selectPaymentBills = val;
    },
    save() {
      this.$emit("save", this.selectPaymentBills);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .paymentOrderDialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: calc(100% - 60px);
  height: calc(100% - 60px);
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
    padding: 0 14px 0 14px;
    height: calc(100% - 76px);
    box-sizing: border-box;
  }
  .dialog-body {
    height: 100%;
  }
  .el-dialog__footer {
    padding: 0;
    height: 40px;
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;
    height: 100%;
    box-sizing: border-box;
  }
}
.payment-order-filter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 35px;
  .advanced-filter-btn {
    margin-right: 15px;
  }
}
.payment-order-table {
  height: calc(100% - 35px);
}
</style>
