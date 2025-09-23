<template>
  <div class="change">
    <el-card class="change-card">
      <div slot="header" class="change-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button
              size="small"
              type="primary"
              @click="newOrderChangeForm"
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
                <el-dropdown-item>{{ $t("h.tempSetBtn") }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <ds-search-btn></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="change-card-content">
        <!-- 高级筛选 -->
        <div class="change-filter">
          <el-button class="advanced-filter-btn" type="text" size="small">{{
            $t("h.advancedBtn")
          }}</el-button>
        </div>
        <!-- 单据表格 -->
        <div class="change-table">
          <ds-table
            ref="billsTableRef"
            :loading="tableLoading"
            :tableData="orderChangeBills"
            :columns="orderChangeBillsColumns"
            :tableConfig="orderChangeBillsConfig"
            :rowKey="(row) => row.id"
          ></ds-table>
        </div>
        <!-- 分页 -->
        <div class="change-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getOrderChangeBills"
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
      @sbumitForm="sbumitOrderChangeForm"
    >
      <template slot="form">
        <el-form
          ref="orderChangeFormRef"
          label-width="100px"
          :model="orderChangeForm"
          :rules="orderChangeRules"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('h.changeDate')" prop="date">
                <!-- format="yyyy 年 MM 月 dd 日" -->
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('h.tips4') + $t('h.changeDate')"
                  v-model="orderChangeForm.date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.assetAttributes')" prop="goodsId">
                <el-select
                  v-model="orderChangeForm.goodsId"
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
              <el-form-item :label="$t('h.changePerson')" prop="staffId">
                <el-select
                  disabled
                  v-model="orderChangeForm.staffId"
                  :placeholder="$t('h.tips4') + $t('h.changePerson')"
                  clearable
                  filterable
                  :filter-method="() => {}"
                  v-load-more="{
                    options: staffData,
                    modelField: '_id',
                    model: orderChangeForm.staffId,
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
              <el-form-item :label="$t('h.formTips46')" prop="roleRule">
                <el-input
                  class="purchasingId-input"
                  disabled
                  v-model="orderChangeForm.roleRule"
                  clearable
                >
                </el-input>
                <el-button type="primary" @click="changeDialogVisible = true">{{
                  $t("h.title150")
                }}</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.supplier')" prop="vendorId">
                <el-select
                  disabled
                  v-model="orderChangeForm.vendorId"
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
            <el-col :span="24">
              <el-form-item :label="$t('h.changeDescription')" prop="coment">
                <el-input
                  type="textarea"
                  v-model="orderChangeForm.coment"
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
          <el-button type="text" size="small" @click="changeGoodsDelete">{{
            $t("h.delBtn")
          }}</el-button>
        </div>
      </template>
      <template slot="table">
        <div class="bill-table">
          <ds-table
            ref="changeGoodsTableRef"
            :tableConfig="orderChangeBillsConfig"
            :columns="changeGoodsColumns"
            :tableData="changeGoodsData"
            :rowKey="(row) => row.purchasingId"
            :sums="sums"
            summary
            @getSummaries="getSummaries"
            @handleSelectionChange="changeGoodsSelectionChange"
          >
            <template slot="quantity" slot-scope="{ scope }">
              <span>
                <el-input-number
                  v-model="scope.row.quantity"
                  :precision="2"
                  :step="1"
                  :min="1"
                  size="mini"
                ></el-input-number>
              </span>
            </template>
            <template slot="amount" slot-scope="{ scope }">
              <span>
                <el-input-number
                  v-model="scope.row.amount"
                  :precision="2"
                  :step="1"
                  :min="1"
                  size="mini"
                ></el-input-number>
              </span>
            </template>
          </ds-table>
        </div>
      </template>
    </new-bills-dialog>
    <!-- 选择采购订单 -->
    <change-goods-dialog
      :changeDialogVisible.sync="changeDialogVisible"
      :requstBillsConfig="requstBillsConfig"
      :requstBillsColumns="requstBillsColumns"
      @select="requstGoodsSelect"
    ></change-goods-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { select, update } from "@/assets/api";
import {
  orderChangeBillsColumns,
  changeGoodsColumns,
  requisitionBillsColumns,
} from "@/utils/systemData";
import deepCopy from "@/utils/deepCopy";
import ChangeGoodsDialog from "@/components/BillsComponents/PurchaseMangeComponents/ChangeGoodsDialog";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
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
      orderChangeBillsColumns: orderChangeBillsColumns,
      orderChangeBillsConfig: {
        selection: true,
        reserveSelection: true,
      },
      orderChangeBills: [],
      staffData: [],
      goodsData: [],
      vendorData: [],
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      newBillsDialogVisible: false,
      orderChangeForm: {
        deptId: "",
        staffId: "",
        goodsId: "",
        date: "",
        coment: "",
        vendorId: "",
        purchasingId: "",
        roleRule: "",
        permissonId: 26,
      },
      orderChangeRules: {
        goodsId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.assetAttributes"),
            trigger: "change",
          },
        ],
        date: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.changeDate"),
            trigger: "change",
          },
        ],
      },
      changeGoodsColumns: changeGoodsColumns,
      changeGoodsData: [],
      selectChangeGoodsData: [],
      sums: [],
      changeDialogVisible: false,
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
    getOrderChangeBills() {
      this.tableLoading = true;
      select({
        func: "S0065",
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
          this.orderChangeBills = data.data[1];
          this.orderChangeBills.forEach((item) => {
            let goodDetails = [];
            item.details.forEach((el) => {
              goodDetails.push(el.skuName);
            });
            item.goodDetails = goodDetails.join("/");
          });
        })
        .catch(() => {
          this.tableLoading = false;
          // 服务器网络错误，请求变更订单单据失败
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
    newOrderChangeForm() {
      this.newBillsDialogVisible = true;
      this.orderChangeForm.staffId = this.userInfo._id;
    },
    // 选中采购订单
    requstGoodsSelect(row) {
      this.orderChangeForm.roleRule = row.roleRule;
      this.orderChangeForm.purchasingId = row.id;
      this.orderChangeForm.vendorId = row.vendorId;
      this.changeGoodsData = row.details.map((el) => {
        return {
          purchasingId: el.id,
          proId: el.proId,
          skuName: el.skuName,
          skuType: el.skuType,
          skuUnit: el.skuUnit,
          frontQuantity: el.quantity,
          price: el.price,
          frontAmount: el.amount,
          quantity: el.quantity,
          amount: el.amount,
        };
      });
      this.changeDialogVisible = false;
    },
    changeGoodsSelectionChange(val) {
      this.selectChangeGoodsData = val;
    },
    changeGoodsDelete() {
      this.selectChangeGoodsData.forEach((item) => {
        this.changeGoodsData.splice(
          this.changeGoodsData.findIndex(
            (el) => el.purchasingId == item.purchasingId
          ),
          1
        );
      });
      this.$refs.changeGoodsTableRef.$refs.dsTableRef.clearSelection();
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
      this.$refs.orderChangeFormRef.clearValidate();
    },
    newBillsDialogClose() {
      this.changeGoodsData = [];
      this.selectChangeGoodsData = [];
      this.sums = [];
      this.orderChangeForm.deptId = "";
      this.orderChangeForm.staffId = "";
      this.orderChangeForm.goodsId = "";
      this.orderChangeForm.date = "";
      this.orderChangeForm.coment = "";
      this.orderChangeForm.vendorId = "";
      this.orderChangeForm.purchasingId = "";
      this.orderChangeForm.roleRule = "";
    },
    sbumitOrderChangeForm() {
      this.$refs.orderChangeFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.changeGoodsData.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips246"),
          });
        }
        const LOADING = this.$loading(this.dialogLoading);
        let deptId = this.staffData.find((item) => {
          return item._id == this.userInfo._id;
        }).deptId;
        update({
          func: "U0072",
          token: this.userInfo.token,
          userId: this.userInfo._id,
          requstData: {
            deptId: deptId,
            staffId: this.orderChangeForm.staffId,
            goodsId: this.orderChangeForm.goodsId,
            date: this.orderChangeForm.date,
            coment: this.orderChangeForm.coment,
            vendorId: this.orderChangeForm.vendorId,
            purchasingId: this.orderChangeForm.purchasingId,
            amount: this.sums[8],
            orderAmount: this.sums[6],
            details: this.changeGoodsData,
            permissonId: this.orderChangeForm.permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getOrderChangeBills();
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
    this.getOrderChangeBills();
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
.change {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .change-card {
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
.change-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.change-card-content {
  height: 100%;
  .change-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .change-table {
    height: calc(100% - 75px);
  }
  .change-pagination {
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
  .purchasingId-input {
    margin-right: 10px;
    width: calc(100% - 80px);
  }
  .bill-table {
    margin-top: 10px;
    height: 540px;
  }
}
</style>
