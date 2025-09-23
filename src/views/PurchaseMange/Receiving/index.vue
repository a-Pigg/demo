<template>
  <div class="receiving">
    <el-card class="receiving-card">
      <div slot="header" class="receiving-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button size="small" type="primary" @click="newReveivingForm">{{
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
      <div class="receiving-card-content">
        <!-- 高级筛选 -->
        <div class="receiving-filter">
          <el-button class="advanced-filter-btn" type="text" size="small">{{
            $t("h.advancedBtn")
          }}</el-button>
        </div>
        <!-- 单据表格 -->
        <div class="receiving-table">
          <ds-table
            ref="billsTableRef"
            :loading="tableLoading"
            :columns="receivingBillsColumns"
            :tableConfig="receivingBillsConfig"
            :tableData="receivingBills"
            :rowKey="(row) => row.id"
          ></ds-table>
        </div>
        <!-- 分页 -->
        <div class="receiving-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getReceivingBills"
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
      @sbumitForm="sbumitReveivingForm"
    >
      <template slot="form">
        <el-form
          ref="receivingFormRef"
          label-width="100px"
          :model="receivingForm"
          :rules="receivingRules"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('h.deliveryDate')" prop="receiptDate">
                <!-- format="yyyy 年 MM 月 dd 日" -->
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('h.tips4')+$t('h.deliveryDate')"
                  v-model="receivingForm.receiptDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.applicationDate')" prop="date">
                <el-date-picker
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('h.tips4')+$t('h.applicationDate')"
                  v-model="receivingForm.date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.assetAttributes')" prop="goodsId">
                <el-select
                  v-model="receivingForm.goodsId"
                  :placeholder="$t('h.tips4')+$t('h.assetAttributes')"
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
              <el-form-item :label="$t('h.formTips46')" prop="roleRule">
                <el-input
                  class="roleRule-input"
                  disabled
                  v-model="receivingForm.roleRule"
                  clearable
                >
                </el-input>
                <el-button
                  v-if="receivingForm.roleRule == ''"
                  type="primary"
                  @click="changeDialogVisible = true"
                  >{{ $t("h.title150") }}</el-button
                >
                <el-button
                  v-if="receivingForm.roleRule != ''"
                  type="danger"
                  @click="clearSelectBill"
                  >{{ $t("h.title153") }}</el-button
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.supplier')" prop="vendorId">
                <el-select
                  v-model="receivingForm.vendorId"
                  :placeholder="$t('h.tips4')+$t('h.supplier')"
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
              <el-form-item :label="$t('h.creator')" prop="staffId">
                <el-select
                  disabled
                  v-model="receivingForm.staffId"
                  :placeholder="$t('h.tips4')+$t('h.creator')"
                  clearable
                  filterable
                  :filter-method="() => {}"
                  v-load-more="{
                    options: staffData,
                    modelField: '_id',
                    model: receivingForm.staffId,
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
            <el-col :span="24">
              <el-form-item :label="$t('h.changeDescription')" prop="coment">
                <el-input
                  type="textarea"
                  v-model="receivingForm.coment"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template slot="btns">
        <div>
          <span class="title"
            >{{ $t("h.title154") }} - {{ $t("h.title147") }}</span
          >
        </div>
        <div class="btns">
          <el-button
            type="text"
            size="small"
            :disabled="receivingForm.roleRule != ''"
            @click="addReceivingGoods"
            >{{ $t("h.addBtn") }}</el-button
          >
          <el-button type="text" size="small" @click="deleteReceivingGoods">{{
            $t("h.delBtn")
          }}</el-button>
        </div>
      </template>
      <template slot="table">
        <div class="bill-table">
          <ds-table
            :tableConfig="receivingBillsConfig"
            :columns="receivingGoodsColumns"
            :tableData="receivingGoods"
            :rowKey="(row) => row.rowKeyId"
            :sums="sums"
            summary
            @getSummaries="getSummaries"
            @handleSelectionChange="receivingGoodsSelectionChange"
          >
            <template slot="tatolQuantity" slot-scope="{ scope }">
              <span
                ><el-input-number
                  v-model="scope.row.tatolQuantity"
                  :precision="2"
                  :step="1"
                  :min="1"
                  size="mini"
                  @change="
                    (currentValue, oldValue) =>
                      onQuantityChange(currentValue, oldValue, scope.row)
                  "
                ></el-input-number
              ></span>
            </template>
            <template slot="taxRate" slot-scope="{ scope }">
              <span
                ><el-input-number
                  v-model="scope.row.taxRate"
                  :precision="2"
                  :step="1"
                  :min="1"
                  size="mini"
                  @change="
                    (currentValue, oldValue) =>
                      onTaxRateChange(currentValue, oldValue, scope.row)
                  "
                ></el-input-number
              ></span>
            </template>
          </ds-table>
        </div>
      </template>
    </new-bills-dialog>
    <change-goods-dialog
      :changeDialogVisible.sync="changeDialogVisible"
      :requstBillsConfig="requstBillsConfig"
      :requstBillsColumns="requstBillsColumns"
      @select="requstGoodsSelect"
    ></change-goods-dialog>
    <sku-list-dialog
      :skuDialogVisible.sync="skuDialogVisible"
      :updateSkuSelectState="receivingGoods"
      @save="requstGoodsSave"
    ></sku-list-dialog>
  </div>
</template>
<script>
import SkuListDialog from "@/components/BillsComponents/PurchaseMangeComponents/SkuListDialog";
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
  receivingBillsColumns,
  receivingGoodsColumns,
  requisitionBillsColumns,
} from "@/utils/systemData";
import deepCopy from "@/utils/deepCopy";
export default {
  components: {
    SkuListDialog,
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
      receivingBillsColumns: receivingBillsColumns,
      receivingBillsConfig: {
        selection: true,
        reserveSelection: true,
      },
      receivingBills: [],
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      staffData: [],
      vendorData: [],
      goodsData: [],
      newBillsDialogVisible: false,
      receivingForm: {
        deptId: "",
        staffId: "",
        goodsId: "",
        receiptDate: "", //收货日期
        date: "", //申请日期
        coment: "",
        roleRule: "",
        purchasingId: "",
        permissonId: 26,
      },
      receivingRules: {},
      receivingGoodsColumns: receivingGoodsColumns,
      receivingGoods: [],
      selectReceivingGoods: [],
      sums: [],
      changeDialogVisible: false,
      skuDialogVisible: false,
      requstBillsConfig: {
        expand: true,
        expandName: "",
        expandWidth: "50px",
        expandFixed: false,
        soltName: "expand",
      },
      requstBillsColumns: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    getReceivingBills() {
      this.tableLoading = true;
      select({
        func: "S0063",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          console.log(data.data);
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.receivingBills = data.data[1];
          this.receivingBills.forEach((item) => {
            let goodDetails = [];
            item.details.forEach((el) => {
              goodDetails.push(el.skuName);
            });
            item.goodDetails = goodDetails.join("/");
          });
        })
        .catch(() => {
          this.tableLoading = false;
          // 服务器网络错误，请求收货管理单据失败
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
    newReveivingForm() {
      this.newBillsDialogVisible = true;
      this.receivingForm.staffId = this.userInfo._id;
    },
    // 从申请单选择收货物品
    requstGoodsSelect(row) {
      console.log(row);
      this.receivingForm.roleRule = row.roleRule;
      this.receivingForm.purchasingId = row.id;
      this.changeDialogVisible = false;
      this.receivingGoods = row.details.map((el) => {
        return {
          rowKeyId: el.id,
          artclePurchasingId: el.id,
          proId: el.proId,
          skuName: el.skuName,
          skuType: el.skuType,
          skuUnit: el.skuUnit,
          quantity: el.quantity,
          tatolQuantity: el.quantity,
          price: el.price,
          taxRate: el.taxRate,
          taxPrint: el.taxPrint,
          noTaxAmount: el.noTaxAmount,
          amount: el.amount,
        };
      });
    },
    clearSelectBill() {
      this.receivingGoods = [];
      this.receivingForm.roleRule = "";
      this.receivingForm.purchasingId = "";
    },
    onQuantityChange(currentValue, oldValue, row) {
      if (row.price) {
        row.amount = (row.price * row.tatolQuantity).toFixed(2);
        row.taxPrint = (
          (row.amount / (1 + row.taxRate / 100)) *
          (row.taxRate / 100)
        ).toFixed(2);
        row.noTaxAmount = (
          row.amount -
          (row.amount / (1 + row.taxRate / 100)) * (row.taxRate / 100)
        ).toFixed(2);
      }
    },
    onTaxRateChange(currentValue, oldValue, row) {
      row.taxPrint = (
        (row.amount / (1 + row.taxRate / 100)) *
        (row.taxRate / 100)
      ).toFixed(2);
      row.noTaxAmount = (
        row.amount -
        (row.amount / (1 + row.taxRate / 100)) * (row.taxRate / 100)
      ).toFixed(2);
    },
    // 直接添加收货物品
    addReceivingGoods() {
      this.skuDialogVisible = true;
    },
    requstGoodsSave(val) {
      console.log(val);
      this.receivingGoods = val.map((el) => {
        return {
          rowKeyId: el.id,
          proId: el.id,
          skuName: el.assetTemplateName,
          skuType: el.specification,
          skuUnit: el.measureUnit,
          quantity: null,
          tatolQuantity: 1,
          price: el.amount,
          taxRate: 13,
          taxPrint: ((el.amount / (1 + 0.13)) * 0.13).toFixed(2),
          noTaxAmount: (el.amount - (el.amount / (1 + 0.13)) * 0.13).toFixed(2),
          amount: 1 * el.amount,
        };
      });
      this.skuDialogVisible = false;
    },
    receivingGoodsSelectionChange(val) {
      this.selectReceivingGoods = val;
    },
    deleteReceivingGoods() {
      this.selectReceivingGoods.forEach((item) => {
        this.receivingGoods.splice(
          this.receivingGoods.findIndex((el) => el.rowKeyId == item.rowKeyId),
          1
        );
      });
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
      this.$refs.receivingFormRef.clearValidate();
    },
    newBillsDialogClose() {
      this.receivingGoods = [];
      this.selectReceivingGoods = [];
      this.sums = [];
      this.receivingForm.deptId = "";
      this.receivingForm.staffId = "";
      this.receivingForm.goodsId = "";
      this.receivingForm.date = "";
      this.receivingForm.coment = "";
      this.receivingForm.vendorId = "";
      this.receivingForm.purchasingId = "";
      this.receivingForm.roleRule = "";
    },
    sbumitReveivingForm() {
      this.$refs.receivingFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.receivingGoods.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips248"),
          });
        }
        let requireFlag = false;
        for (let i = 0; i < this.receivingGoods.length; i++) {
          if (!this.receivingGoods[i].tatolQuantity) {
            requireFlag = true;
            break;
          }
        }
        if (requireFlag) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips249"),
          });
        }
        const LOADING = this.$loading(this.dialogLoading);
        let deptId = this.staffData.find((item) => {
          return item._id == this.userInfo._id;
        }).deptId;
        update({
          func: "U0068",
          token: this.userInfo.token,
          userId: this.userInfo._id,
          requstData: {
            deptId: deptId,
            staffId: this.receivingForm.staffId,
            goodsId: this.receivingForm.goodsId,
            receiptDate: this.receivingForm.receiptDate,
            date: this.receivingForm.date,
            coment: this.receivingForm.coment,
            vendorId: this.receivingForm.vendorId,
            purchasingId: this.receivingForm.purchasingId,
            details: this.receivingGoods,
            permissonId: this.receivingForm.permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getReceivingBills;
          })
          .catch(() => {
            LOADING.close();
            // 服务器网络错误，新增/编辑单据失败
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
  },
  created() {
    this.getReceivingBills();
    this.getGoods();
    this.getVendors();
    this.requstBillsColumns = deepCopy(requisitionBillsColumns);
    this.requstBillsColumns.unshift({
      label: this.$t("h.title150"),
      slotName: "select",
      width: "100",
    });
  },
};
</script>
<style lang="scss" scoped>
.receiving {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .receiving-card {
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
.receiving-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.receiving-card-content {
  height: 100%;
  .receiving-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .receiving-table {
    height: calc(100% - 75px);
  }
  .receiving-pagination {
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
  .roleRule-input {
    margin-right: 10px;
    width: calc(100% - 80px);
  }
  .bill-table {
    margin-top: 10px;
    height: 540px;
  }
}
</style>
