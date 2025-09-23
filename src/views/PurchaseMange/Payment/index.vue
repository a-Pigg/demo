<template>
  <div class="payment">
    <el-card class="payment-card">
      <div slot="header" class="payment-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button size="small" type="primary" @click="newPaymentForm">{{
              $t("h.newBtn")
            }}</el-button>
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
      <div class="payment-card-content">
        <div class="payment-filter">
          <el-button class="advanced-filter-btn" type="text" size="small">{{
            $t("h.advancedBtn")
          }}</el-button>
        </div>
        <div class="payment-table">
          <ds-table
            ref="billsTableRef"
            :loading="tableLoading"
            :columns="paymentBillsColumns"
            :tableConfig="paymentBillsConfig"
            :tableData="paymentBills"
            :rowKey="(row) => row.id"
          ></ds-table>
        </div>
        <div class="payment-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getPaymentBills"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <!-- 新建单据 -->
    <new-bills-dialog
      class="new-bill-dialog"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitpaymentForm"
    >
      <template slot="form">
        <el-form
          ref="paymentFormRef"
          label-width="100px"
          :model="paymentForm"
          :rules="paymentRules"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('h.applicationDate')" prop="date">
                <!-- format="yyyy 年 MM 月 dd 日" -->
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('h.tips4') + $t('h.applicationDate')"
                  v-model="paymentForm.date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.assetAttributes')" prop="goodsId">
                <el-select
                  v-model="paymentForm.goodsId"
                  :placeholder="$t('h.tips4') + $t('h.assetAttributes')"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in goodsData"
                    :key="item.goodsqId"
                    :label="item.name"
                    :value="item.goodsqId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.supplier')" prop="vendorId">
                <el-select
                  v-model="paymentForm.vendorId"
                  :placeholder="$t('h.tips4') + $t('h.supplier')"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in vendorData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.receivingBank')" prop="bankName">
                <el-input v-model="paymentForm.bankName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.bankAccount')" prop="bankeAccount">
                <el-input v-model="paymentForm.bankeAccount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.applicant')" prop="staffId">
                <el-select
                  disabled
                  v-model="paymentForm.staffId"
                  :placeholder="$t('h.tips4') + $t('h.applicant')"
                  clearable
                  filterable
                  :filter-method="() => {}"
                  v-load-more="{
                    options: staffData,
                    modelField: '_id',
                    model: paymentForm.staffId,
                    searchField: 'andLike',
                    func: 'S0005',
                    userInfo: userInfo,
                  }"
                >
                  <el-option
                    v-for="item in staffData"
                    :key="item._id"
                    :label="item.name"
                    :value="item._id"
                  >
                    <span
                      >{{ item.name + "(" + item.code + ")" }} -{{
                        item.deptName
                      }}</span
                    >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('h.totalPaymentAmount')"
                prop="totalAmount"
              >
                <el-input disabled v-model="paymentForm.totalAmount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('h.explain')" prop="coment">
                <el-input
                  type="textarea"
                  v-model="paymentForm.coment"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template slot="btns">
        <div>
          <span class="title"
            >{{ $t("h.title146") }} - {{ $t("h.title147") }}</span
          >
        </div>
        <div class="btns">
          <el-button
            type="text"
            size="small"
            @click="changeDialogVisible = true"
            >{{ $t("h.addBtn") }}</el-button
          >
          <el-button type="text" size="small" @click="deletePaymentGoods">{{
            $t("h.delBtn")
          }}</el-button>
        </div>
      </template>
      <template slot="table">
        <div class="bill-table">
          <ds-table
            ref="paymentGoodsTableRef"
            :columns="paymentGoodsColumns"
            :tableConfig="paymentBillsConfig"
            :tableData="paymentGoods"
            :rowKey="(row) => row.purchasingId"
            @handleSelectionChange="paymentGoodsSelectChange"
            :sums="sums"
            summary
            @getSummaries="getSummaries"
          >
            <template slot="amount" slot-scope="{ scope }">
              <span>
                <el-input-number
                  v-model="scope.row.amount"
                  :precision="2"
                  :step="1"
                  :min="1"
                  size="mini"
                  @change="onAmountChange"
                ></el-input-number>
              </span>
            </template>
          </ds-table>
        </div>
      </template>
    </new-bills-dialog>
    <change-goods-dialog
      :changeDialogVisible.sync="changeDialogVisible"
      :requstBillsConfig="requstBillsConfig"
      :requstBillsColumns="requstBillsColumns"
      :updateRequstSelectState="paymentGoods"
      @save="requstGoodsSave"
    ></change-goods-dialog>
  </div>
</template>
<script>
import ChangeGoodsDialog from "@/components/BillsComponents/PurchaseMangeComponents/ChangeGoodsDialog";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { mapState } from "vuex";
import { select, update } from "@/assets/api";
import {
  paymentBillsColumns,
  paymentGoodsColumns,
  requisitionBillsColumns,
} from "@/utils/systemData";
export default {
  components: {
    ChangeGoodsDialog,
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
      paymentBillsColumns: paymentBillsColumns,
      paymentBillsConfig: {
        selection: true,
        reserveSelection: true,
      },
      paymentBills: [],
      newBillsDialogVisible: false,
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      staffData: [],
      goodsData: [],
      vendorData: [],
      paymentForm: {
        deptId: "",
        staffId: "",
        goodsId: "",
        date: "",
        coment: "",
        vendorId: "",
        totalAmount: "",
        bankName: "",
        bankeAccount: "",
        permissonId: 26,
      },
      paymentRules: {
        vendorId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.supplier"),
            trigger: "change",
          },
        ],
        goodsId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.assetAttributes"),
            trigger: "change",
          },
        ],
      },
      paymentGoodsColumns: paymentGoodsColumns,
      paymentGoods: [],
      selectPaymentGoods: [],
      sums: [],
      changeDialogVisible: false,
      requstBillsConfig: {
        expand: true,
        expandName: "",
        expandWidth: "50px",
        expandFixed: false,
        soltName: "expand",
        selection: true,
        reserveSelection: true,
      },
      requstBillsColumns: requisitionBillsColumns,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    getPaymentBills() {
      this.tableLoading = true;
      select({
        func: "S0064",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.paymentBills = data.data[1];
        })
        .catch(() => {
          this.tableLoading = false;
          // 服务器网络错误，请求付款申请单据失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getGoods() {
      select({
        func: "S0022",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.goodsData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getVendors() {
      select({
        func: "S0061",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.vendorData = data.data[1];
        })
        .catch(() => {
          // 服务器网络错误，请求供应商失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    newPaymentForm() {
      this.newBillsDialogVisible = true;
      this.paymentForm.staffId = this.userInfo._id;
    },
    requstGoodsSave(row) {
      this.paymentGoods = row.map((el) => {
        return {
          purchasingId: el.id,
          roleRule: el.roleRule,
          totalAmount: el.amount,
          arrivalAmount: el.arrivalAmount,
          noArrivalAmount: el.noArrivalAmount,
          paidAmount: el.paidAmount,
          amount: el.amount,
        };
      });
      this.changeDialogVisible = false;
      this.$nextTick(() => {
        this.paymentForm.totalAmount = this.sums[6];
      });
    },
    paymentGoodsSelectChange(val) {
      this.selectPaymentGoods = val;
    },
    onAmountChange() {
      this.$nextTick(() => {
        this.paymentForm.totalAmount = this.sums[6];
      });
    },
    deletePaymentGoods() {
      console.log(123);
      console.log(this.selectPaymentGoods);
      this.selectPaymentGoods.forEach((item) => {
        this.paymentGoods.splice(
          this.paymentGoods.findIndex(
            (el) => el.purchasingId == item.purchasingId
          ),
          1
        );
      });
      this.$refs.paymentGoodsTableRef.$refs.dsTableRef.clearSelection();
    },
    getSummaries(param) {
      const { columns, data } = param;
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = /*"总价"*/this.$t("h.totalAmount");
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          this.sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          this.sums[index] = "N/A";
        }
      });
    },
    newBillsDialogOpened() {
      this.$refs.paymentFormRef.clearValidate();
    },
    newBillsDialogClose() {
      this.paymentGoods = [];
      this.selectPaymentGoods = [];
      this.sums = [];
      this.paymentForm.deptId = "";
      this.paymentForm.deptId = "";
      this.paymentForm.deptId = "";
      this.paymentForm.deptId = "";
      this.paymentForm.deptId = "";
      this.paymentForm.deptId = "";
    },
    sbumitpaymentForm() {
      this.$refs.paymentFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        let deptId = this.staffData.find((item) => {
          return item._id == this.userInfo._id;
        }).deptId;
        update({
          func: "U0070",
          token: this.userInfo.token,
          userId: this.userInfo._id,
          requstData: {
            deptId: deptId,
            staffId: this.paymentForm.staffId,
            goodsId: this.paymentForm.goodsId,
            date: this.paymentForm.date,
            coment: this.paymentForm.coment,
            vendorId: this.paymentForm.vendorId,
            totalAmount: this.paymentForm.totalAmount,
            bankName: this.paymentForm.bankName,
            bankeAccount: this.paymentForm.bankeAccount,
            details: this.paymentGoods,
            permissonId: this.paymentForm.permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getPaymentBills();
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
    this.getPaymentBills();
    this.getGoods();
    this.getVendors();
  },
};
</script>
<style lang="scss" scoped>
.payment {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .payment-card {
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
.payment-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.payment-card-content {
  height: 100%;
  .payment-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .payment-table {
    height: calc(100% - 75px);
  }
  .payment-pagination {
    height: 40px;
  }
}
.new-bill-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
  .title {
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #000;
    border-left: 4px solid #588ab9;
  }
  .bill-table {
    margin-top: 10px;
    height: 480px;
  }
}
</style>
