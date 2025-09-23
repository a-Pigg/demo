<template>
  <div class="order">
    <el-card class="order-card">
      <div slot="header" class="order-card-header">
        <ds-query-form>
          <!-- 按钮区域 -->
          <ds-query-form-left-panel>
            <el-button
              size="small"
              type="primary"
              @click="newRequisitionForm"
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
          <!-- 搜索区域 -->
          <ds-query-form-right-panel>
            <ds-search-btn></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="order-card-content">
        <!-- 高级筛选 -->
        <div class="order-filter">
          <el-button class="advanced-filter-btn" type="text" size="small">{{
            $t("h.advancedBtn")
          }}</el-button>
        </div>
        <!-- 单据表格 -->
        <div class="order-table">
          <ds-table
            ref="billsTableRef"
            :loading="tableLoading"
            :tableData="orderBills"
            :columns="orderBillsColumns"
            :tableConfig="orderBillsConfig"
            :rowKey="(row) => row.id"
          ></ds-table>
        </div>
        <!-- 分页 -->
        <div class="order-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getOrderBills"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <new-bills-dialog
      class="new-bill-dialog"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitOrderForm"
    >
      <template slot="form">
        <el-form
          ref="orderFormRef"
          label-width="100px"
          :model="orderForm"
          :rules="orderFormRules"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips41')" prop="date">
                <el-date-picker
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('h.tips4') + $t('h.formTips41')"
                  v-model="orderForm.date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips42')" prop="staffId">
                <el-select
                  disabled
                  v-model="orderForm.staffId"
                  clearable
                  filterable
                  :filter-method="() => {}"
                  v-load-more="{
                    options: staffData,
                    modelField: '_id',
                    model: orderForm.staffId,
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
              <el-form-item :label="$t('h.assetAttributes')" prop="goodsId">
                <el-select
                  v-model="orderForm.goodsId"
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
                  v-model="orderForm.vendorId"
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
              <el-form-item
                :label="$t('h.receivingInformation')"
                prop="receiveAddress"
              >
                <el-input
                  v-model="orderForm.receiveAddress"
                  :placeholder="$t('h.tips3') + $t('h.receivingInformation')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips43')" prop="desireDate">
                <el-date-picker
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('h.tips4') + $t('h.formTips43')"
                  v-model="orderForm.desireDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('h.formTips44')" prop="coment">
                <el-input type="textarea" v-model="orderForm.coment"></el-input>
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
            @click="requstDialogVisible = true"
            >{{ $t("h.title148") }}</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="skuDialogVisible = true"
            >{{ $t("h.addBtn") }}</el-button
          >
          <el-button type="text" size="small" @click="deleteOrderGoods">{{
            $t("h.delBtn")
          }}</el-button>
        </div>
      </template>
      <template slot="table">
        <div class="bill-table">
          <ds-table
            ref="orderGoodsTableRef"
            summary
            :tableConfig="orderBillsConfig"
            :columns="orderGoodsColumns"
            :tableData="orderGoods"
            :rowKey="(row) => row.id"
            :span-method="objectSpanMethod"
            :sums="sums"
            @getSummaries="getSummaries"
            @handleSelectionChange="orderGoodsSelectionChange"
          >
            <template slot="price" slot-scope="{ scope }">
              <span>
                <!-- <el-input v-model="scope.row.price" size="mini"></el-input> -->
                <el-input-number
                  v-model="scope.row.price"
                  :precision="2"
                  :step="1"
                  :min="1"
                  size="mini"
                  @change="
                    (currentValue, oldValue) =>
                      onPriceChange(currentValue, oldValue, scope.row)
                  "
                ></el-input-number>
              </span>
            </template>
            <template slot="quantity" slot-scope="{ scope }">
              <span>
                <el-input-number
                  v-model="scope.row.quantity"
                  :precision="2"
                  :step="1"
                  :min="1"
                  size="mini"
                  @change="
                    (currentValue, oldValue) =>
                      onQuantityChange(currentValue, oldValue, scope.row)
                  "
                ></el-input-number>
              </span>
            </template>
            <template slot="taxRate" slot-scope="{ scope }">
              <span>
                <el-input-number
                  v-model="scope.row.taxRate"
                  :precision="2"
                  :step="1"
                  :min="0"
                  size="mini"
                  @change="
                    (currentValue, oldValue) =>
                      onTaxRateChange(currentValue, oldValue, scope.row)
                  "
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
                  @change="
                    (currentValue, oldValue) =>
                      onAmountChange(currentValue, oldValue, scope.row)
                  "
                ></el-input-number>
              </span>
            </template>
          </ds-table>
        </div>
      </template>
    </new-bills-dialog>
    <!-- 物品弹框 -->
    <sku-list-dialog
      :skuDialogVisible.sync="skuDialogVisible"
      :updateSkuSelectState="updateSkuSelectState"
      @save="goodsSave"
    ></sku-list-dialog>
    <!-- 采购申请单据弹框，可选申请单下的物品 -->
    <requisition-goods-dialog
      :requstDialogVisible.sync="requstDialogVisible"
      :uodateGoodsSelect="orderGoods.filter((el) => el.roleRule != null)"
      @save="requstGoodsSave"
    ></requisition-goods-dialog>
  </div>
</template>
<script>
import RequisitionGoodsDialog from "@/components/BillsComponents/PurchaseMangeComponents/RequisitionGoodsDialog";
import SkuListDialog from "@/components/BillsComponents/PurchaseMangeComponents/SkuListDialog";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { select, update } from "@/assets/api";
import { mapState } from "vuex";
import { orderBillsColumns, orderGoodsColumns } from "@/utils/systemData";
export default {
  components: {
    RequisitionGoodsDialog,
    SkuListDialog,
    NewBillsDialog,
    DsTable,
    DsPagination,
    DsSearchBtn,
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
      orderBillsColumns: orderBillsColumns,
      orderBillsConfig: {
        selection: true,
        reserveSelection: true,
      },
      orderBills: [],
      newBillsDialogVisible: false,
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      orderForm: {
        date: "",
        staffId: "",
        goodsId: "",
        vendorId: "",
        receiveAddress: "",
        desireDate: "",
        coment: "",
        permissonId: 26,
      },
      orderFormRules: {
        goodsId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.assetAttributes"),
            trigger: "change",
          },
        ],
        vendorId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.supplier"),
            trigger: "change",
          },
        ],
      },
      staffData: [],
      vendorData: [],
      goodsData: [],
      orderGoodsColumns: orderGoodsColumns,
      orderGoods: [],
      selectOrderGoods: [],
      sums: [],
      skuDialogVisible: false,
      requstDialogVisible: false,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    updateSkuSelectState() {
      return this.orderGoods.filter((el) => {
        return el.roleRule == null;
      });
    },
  },
  methods: {
    // 获取采购单据
    getOrderBills() {
      this.tableLoading = true;
      select({
        func: "S0062",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          // console.log("采购单据===>", data.data);
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.orderBills = data.data[1];
          this.orderBills.forEach((item) => {
            let goodDetails = [];
            item.details.forEach((el) => {
              goodDetails.push(el.skuName);
            });
            item.goodDetails = goodDetails.join("/");
          });
        })
        .catch(() => {
          this.tableLoading = false;
          // 服务器网络错误，请求采购单据失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 获取审批属性
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
    // 获取供应商
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
    // 新建采购单据
    newRequisitionForm() {
      this.orderForm.staffId = this.userInfo._id;
      this.newBillsDialogVisible = true;
    },
    // 直接从物品添加
    goodsSave(val) {
      console.log("直接从物品添加>>", val);
      let tempOrderGoods = [];
      tempOrderGoods = val.map((el) => {
        return {
          id: el.id, //proId
          artcleProcureId: null,
          proId: el.id,
          assetTemplateName: el.assetTemplateName,
          specification: el.specification,
          measureUnit: el.measureUnit,
          price: el.amount,
          requisitionQuantity: el.quantity,
          quantity: 1,
          taxRate: 13,
          noTaxAmount: (el.amount - (el.amount / (1 + 0.13)) * 0.13).toFixed(2), // 不含税金额
          amount: 1 * el.amount,
          taxPrint: ((el.amount / (1 + 0.13)) * 0.13).toFixed(2), //税额
          roleRule: null, //单号
        };
      });
      let matchArr = this.orderGoods.filter((item) => item.roleRule == null);
      matchArr.forEach(() => {
        this.orderGoods.splice(
          this.orderGoods.findIndex((el) => el.roleRule == null),
          1
        );
      });
      if (this.orderGoods.length) {
        this.orderGoods = [...this.orderGoods, ...tempOrderGoods].sort(
          (a, b) => {
            if (a["proId"] != b["proId"]) {
              return a["proId"].localeCompare(b["proId"]);
            }
          }
        );
      } else {
        this.orderGoods = tempOrderGoods.sort((a, b) => {
          if (a["proId"] != b["proId"]) {
            return a["proId"].localeCompare(b["proId"]);
          }
        });
      }
      this.skuDialogVisible = false;
    },
    // 申请单添加
    requstGoodsSave(val) {
      console.log("申请单中选中===>", val);
      let tempOrderGoods = [];
      tempOrderGoods = val.map((el) => {
        return {
          id: el.id,
          artcleProcureId: el.procureId,
          proId: el.proId,
          assetTemplateName: el.skuName,
          specification: el.skuType,
          measureUnit: el.skuUnit,
          price: el.price,
          requisitionQuantity: el.quantity,
          quantity: 1,
          taxRate: 13,
          noTaxAmount: (el.amount - (el.amount / (1 + 0.13)) * 0.13).toFixed(2), // 不含税金额
          amount: el.amount,
          taxPrint: ((el.amount / (1 + 0.13)) * 0.13).toFixed(2), //税额
          roleRule: el.roleRule, //单号
        };
      });
      let matchArr = this.orderGoods.filter((item) => item.roleRule != null);
      matchArr.forEach(() => {
        this.orderGoods.splice(
          this.orderGoods.findIndex((el) => el.roleRule != null),
          1
        );
      });
      if (this.orderGoods.length) {
        this.orderGoods = [...this.orderGoods, ...tempOrderGoods].sort(
          (a, b) => {
            if (a["proId"] != b["proId"]) {
              return a["proId"].localeCompare(b["proId"]);
            }
          }
        );
      } else {
        this.orderGoods = tempOrderGoods.sort((a, b) => {
          if (a["proId"] != b["proId"]) {
            return a["proId"].localeCompare(b["proId"]);
          }
        });
      }
      console.log(this.orderGoods);
      this.requstDialogVisible = false;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        /*
          表格数据：this.tableList
          判断合并行数：this.mergeColumn()
          */
        const _row = this.mergeColumn(this.orderGoods).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    //判断合并行数
    mergeColumn(data) {
      const spanOneArr = [];
      let concatOne = 0;
      data.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          //name 修改
          if (item.proId === data[index - 1].proId) {
            //第一列需合并相同内容的字段
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return {
        one: spanOneArr,
      };
    },
    orderGoodsSelectionChange(val) {
      this.selectOrderGoods = val;
    },
    deleteOrderGoods() {
      this.selectOrderGoods.forEach((item) => {
        this.orderGoods.splice(
          this.orderGoods.findIndex((el) => el.id == item.id),
          1
        );
      });
      this.$refs.orderGoodsTableRef.$refs.dsTableRef.clearSelection();
    },
    // 计算
    onPriceChange(currentValue, oldValue, row) {
      if (row.quantity) {
        row.amount = (row.quantity * row.price).toFixed(2);
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
    // 计算
    onQuantityChange(currentValue, oldValue, row) {
      if (row.price) {
        row.amount = (row.price * row.quantity).toFixed(2);
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
    // 计算
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
    // 计算
    onAmountChange(currentValue, oldValue, row) {
      if (row.quantity) {
        row.price = (row.amount / row.quantity).toFixed(2);
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
    // 申请表格表尾合计行
    getSummaries(param) {
      const { columns, data } = param;
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = /*"总价"*/this.$t("h.totalAmount");
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          this.sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0)
            .toFixed(2);
          this.sums[index] = parseFloat(this.sums[index]);
        } else {
          this.sums[index] = "N/A";
        }
      });
    },
    // 新建采购单据弹框开启完成
    newBillsDialogOpened() {
      this.$refs.orderFormRef.clearValidate();
    },
    // 新建采购单据弹框关闭
    newBillsDialogClose() {
      this.sums = [];
      this.orderGoods = [];
      this.selectOrderGoods = [];
      this.orderForm.date = "";
      this.orderForm.staffId = "";
      this.orderForm.goodsId = "";
      this.orderForm.vendorId = "";
      this.orderForm.receiveAddress = "";
      this.orderForm.desireDate = "";
      this.orderForm.coment = "";
    },
    // 提交采购单据资料
    sbumitOrderForm() {
      this.$refs.orderFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        let deptId = this.staffData.find((item) => {
          return item._id == this.userInfo._id;
        }).deptId;
        update({
          func: "U0067",
          token: this.userInfo.token,
          userId: this.userInfo._id,
          requstData: {
            deptId: deptId,
            staffId: this.orderForm.staffId,
            goodsId: this.orderForm.goodsId,
            desireDate: this.orderForm.desireDate,
            date: this.orderForm.date,
            coment: this.orderForm.coment,
            receiveAddress: this.orderForm.receiveAddress,
            vendorId: this.orderForm.vendorId,
            totalOrderQuantity: this.sums[6],
            amount: this.sums[9],
            totalNoTaxAmount: this.sums[8],
            details: this.orderGoods,
            permissonId: this.orderForm.permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getOrderBills;
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
    this.getOrderBills();
    this.getGoods();
    this.getVendors();
  },
};
</script>
<style lang="scss" scoped>
.order {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .order-card {
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
.order-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.order-card-content {
  height: 100%;
  .order-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .order-table {
    height: calc(100% - 75px);
  }
  .order-pagination {
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
    height: 520px;
  }
}
</style>
