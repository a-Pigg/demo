<template>
  <div class="requisition">
    <el-card class="requisition-card">
      <div slot="header" class="requisition-card-header">
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
                <el-dropdown-item>{{
                  $t("h.templateSettings")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </ds-query-form-left-panel>
          <!-- 搜索区域 -->
          <ds-query-form-right-panel>
            <ds-search-btn></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="requisition-card-content">
        <!-- 高级筛选 -->
        <div class="requisition-filter">
          <el-button class="advanced-filter-btn" type="text" size="small">{{
            $t("h.advancedBtn")
          }}</el-button>
        </div>
        <!-- 单据表格 -->
        <div class="requisition-table">
          <ds-table
            ref="billsTableRef"
            :loading="tableLoading"
            :tableData="requisitionBills"
            :columns="requisitionBillsColumns"
            :tableConfig="requisitionBillsConfig"
            :rowKey="(row) => row.id"
          >
          </ds-table>
        </div>
        <!-- 分页 -->
        <div class="requisition-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getRequisitionBills"
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
      @sbumitForm="sbumitRequisitionForm"
    >
      <template slot="form">
        <el-form
          ref="requisitonFormRef"
          label-width="100px"
          :model="requisitionForm"
          :rules="requisitionRules"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('h.applicationDate')" prop="date">
                <!-- format="yyyy 年 MM 月 dd 日" -->
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('h.tips4') + $t('h.applicationDate')"
                  v-model="requisitionForm.date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.assetAttributes')" prop="goodsId">
                <el-select
                  v-model="requisitionForm.goodsId"
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
              <el-form-item :label="$t('h.applicant')" prop="staffId">
                <el-select
                  disabled
                  v-model="requisitionForm.staffId"
                  :placeholder="$t('h.tips4') + $t('h.applicant')"
                  clearable
                  filterable
                  :filter-method="() => {}"
                  v-load-more="{
                    options: staffData,
                    modelField: '_id',
                    model: requisitionForm.staffId,
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
              <el-form-item :label="$t('h.supplier')" prop="vendorId">
                <el-select
                  v-model="requisitionForm.vendorId"
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
                  v-model="requisitionForm.receiveAddress"
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
                  v-model="requisitionForm.desireDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('h.formTips44')" prop="coment">
                <el-input
                  type="textarea"
                  v-model="requisitionForm.coment"
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
            @click="skuDialogVisible = true"
            >{{ $t("h.addBtn") }}</el-button
          >
          <el-button type="text" size="small" @click="deleteApplyGoods">{{
            $t("h.delBtn")
          }}</el-button>
        </div>
      </template>
      <template slot="table">
        <div class="bill-table">
          <ds-table
            ref="applyGoodsTableRef"
            :tableConfig="requisitionBillsConfig"
            :columns="applyGoodsColumns"
            :tableData="applyGoods"
            :rowKey="(row) => row.proId"
            :sums="sums"
            summary
            @getSummaries="getSummaries"
            @handleSelectionChange="applyGoodsSelectionChange"
          >
            <template slot="price" slot-scope="{ scope }">
              <span>
                <el-input
                  v-model="scope.row.price"
                  size="mini"
                  @blur="(val) => onPriceChange(val, scope.row)"
                ></el-input>
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
            <template slot="amount" slot-scope="{ scope }">
              <span>
                <el-input
                  v-model="scope.row.amount"
                  size="mini"
                  @blur="(val) => onAmountChange(val, scope.row)"
                ></el-input>
              </span>
            </template>
          </ds-table>
        </div>
      </template>
    </new-bills-dialog>
    <sku-list-dialog
      :skuDialogVisible.sync="skuDialogVisible"
      :updateSkuSelectState="applyGoods"
      @save="skuSelectionChange"
    ></sku-list-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { select, update } from "@/assets/api";
import { requisitionBillsColumns, applyGoodsColumns } from "@/utils/systemData";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import DsSelectTree from "@/components/DsSelectTree";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import SkuListDialog from "@/components/BillsComponents/PurchaseMangeComponents/SkuListDialog";
export default {
  components: {
    DsTable,
    DsSelectTree,
    DsSearchBtn,
    DsQueryForm,
    DsPagination,
    NewBillsDialog,
    SkuListDialog,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      tableLoading: false,
      requisitionBillsConfig: {
        selection: true,
        reserveSelection: true,
      },
      requisitionBillsColumns: requisitionBillsColumns,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      requisitionBills: [],
      deptTreeProps: {
        value: "_id",
        label: "deptName",
        children: "children",
      },
      depts: [],
      treeDepts: [],
      staffData: [],
      goodsData: [],
      vendorData: [],
      newBillsDialogVisible: false,
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      requisitionForm: {
        staffId: "", // 申请人
        goodsId: "", //资产属性
        desireDate: "", //期望到货时间
        date: "", //申请时间
        coment: "", //申请说明
        receiveAddress: "", //收货信息
        vendorId: "", //供应商
        permissonId: 26,
      },
      requisitionRules: {
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
      applyGoodsColumns: applyGoodsColumns,
      applyGoods: [
        // {
        //   id: 1,
        //   assetTemplateName: "挂式空调",
        //   specification: "xEW-09718",
        //   measureUnit: "台",
        //   price: 200,
        //   quantity: 5,
        //   amount: 1000,
        // },
      ],
      selectApplyGoods: [],
      skuDialogVisible: false,
      sums: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector("input").focus();
      },
    },
  },
  methods: {
    // 请求采购申请单据
    getRequisitionBills() {
      this.tableLoading = true;
      select({
        func: "S0059",
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
          this.requisitionBills = data.data[1];
          this.requisitionBills.forEach((item) => {
            let goodDetails = [];
            item.details.forEach((el) => {
              goodDetails.push(el.skuName);
            });
            item.goodDetails = goodDetails.join("/");
          });
        })
        .catch(() => {
          this.tableLoading = false;
          // 服务器网络错误，请求采购申请单据失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getDepts() {
      select({
        func: "S0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.depts = data.data;
          this.treeDepts = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          // 服务器网络异常，查询部门失败
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
    newRequisitionForm() {
      this.newBillsDialogVisible = true;
      this.requisitionForm.staffId = this.userInfo._id;
    },
    newBillsDialogOpened() {
      this.$refs.requisitonFormRef.clearValidate();
    },
    newBillsDialogClose() {
      this.applyGoods = [];
      this.selectApplyGoods = [];
      this.sums = [];
      this.requisitionForm.staffId = "";
      this.requisitionForm.goodsId = "";
      this.requisitionForm.desireDate = "";
      this.requisitionForm.date = "";
      this.requisitionForm.coment = "";
      this.requisitionForm.receiveAddress = "";
      this.requisitionForm.vendorId = "";
    },
    sbumitRequisitionForm() {
      this.$refs.requisitonFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.applyGoods.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips18"),
          });
        }
        let quantityFlag = false;
        for (let i = 0; i < this.applyGoods.length; i++) {
          if (!this.applyGoods[i].quantity) {
            quantityFlag = true;
            break;
          }
        }
        if (quantityFlag) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips3") + this.$t("h.columns29"),
          });
        }
        const LOADING = this.$loading(this.dialogLoading);
        let deptId = this.staffData.find((item) => {
          return item._id == this.userInfo._id;
        }).deptId;
        update({
          func: "U0066",
          token: this.userInfo.token,
          userId: this.userInfo._id,
          requstData: {
            deptId: deptId,
            staffId: this.requisitionForm.staffId,
            goodsId: this.requisitionForm.goodsId,
            desireDate: this.requisitionForm.desireDate,
            date: this.requisitionForm.date,
            coment: this.requisitionForm.coment,
            receiveAddress: this.requisitionForm.receiveAddress,
            vendorId: this.requisitionForm.vendorId,
            details: this.applyGoods,
            permissonId: 95,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getRequisitionBills();
          })
          .catch(() => {
            LOADING.close();
            // 服务器网络错误，新增/编辑单据失败
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    onQuantityChange(currentValue, oldValue, row) {
      if (row.price) {
        this.$set(
          row,
          "amount",
          (row.amount = (row.price * row.quantity).toFixed(2))
        );
      }
    },
    onPriceChange(val, row) {
      let regMoney = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (!regMoney.test(row.price)) {
        row.price = null;
        return this.$message.error(this.$t("h.tips251"));
      }
      if (row.quantity) {
        this.$set(
          row,
          "amount",
          (row.amount = (row.price * row.quantity).toFixed(2))
        );
      }
    },
    onAmountChange(val, row) {
      let regMoney = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (!regMoney.test(row.amount)) {
        row.amount = null;
        return this.$message.error(this.$t("h.tips251"));
      }
      if (row.quantity && row.amount) {
        this.$set(
          row,
          "price",
          (row.price = (row.amount / row.quantity).toFixed(2))
        );
      }
    },
    skuSelectionChange(val) {
      this.applyGoods = val.map((item) => {
        return {
          proId: item.id,
          price: item.amount,
          assetTemplateName: item.assetTemplateName,
          measureUnit: item.measureUnit,
          specification: item.specification,
          amount: null,
        };
      });
      this.skuDialogVisible = false;
    },
    deleteApplyGoods() {
      this.selectApplyGoods.forEach((item) => {
        this.applyGoods.splice(
          this.applyGoods.findIndex((sItem) => sItem.proId === item.proId),
          1
        );
      });
      this.$refs.applyGoodsTableRef.$refs.dsTableRef.clearSelection();
    },
    applyGoodsSelectionChange(val) {
      this.selectApplyGoods = val;
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
          this.sums[index] += ` ${this.$t("h.totalAmount")}`;
        } else {
          this.sums[index] = "N/A";
        }
      });
    },
  },
  created() {
    this.getRequisitionBills();
    this.getDepts();
    this.getGoods();
    this.getVendors();
  },
};
</script>
<style lang="scss" scoped>
.requisition {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .requisition-card {
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
.requisition-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.requisition-card-content {
  height: 100%;
  .requisition-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .requisition-table {
    height: calc(100% - 75px);
  }
  .requisition-pagination {
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
