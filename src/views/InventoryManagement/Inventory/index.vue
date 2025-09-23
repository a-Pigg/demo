<template>
  <div class="Inventory">
    <el-card class="box-card">
      <div class="operation-area">
        <!-- 右侧头部 -->
        <div class="right-header">
          <ds-query-form>
            <ds-query-form-left-panel>
              <el-button
                size="small"
                type="primary"
                @click="dialogVisible = true"
                >{{ $t("h.newBtn") }}</el-button
              >
              <el-button size="small" @click="exportFile">{{
                $t("h.exportBtn")
              }}</el-button>
            </ds-query-form-left-panel>
            <ds-query-form-right-panel>
              <ds-search-btn
                :searchValue.sync="andLike"
                @search="search"
              ></ds-search-btn>
            </ds-query-form-right-panel>
          </ds-query-form>
        </div>
        <!-- 筛选区域  -->
        <div class="screen">
          <ds-query-form>
            <ds-query-form-left-panel>
              <ds-filter-tag
                :filterTagsData="highFilterTags"
                @handleCloseTag="handleCloseFilterTag"
              ></ds-filter-tag>
            </ds-query-form-left-panel>
            <ds-query-form-right-panel>
              <span
                class="advancedSearch"
                @click="bodyFilteringVisible = true"
                >{{ $t("h.advancedBtn") }}</span
              >
            </ds-query-form-right-panel>
          </ds-query-form>
        </div>
        <!-- 右侧主体 -->
        <div class="right-body">
          <el-table
            :data="tableDataDisplay"
            header-cell-class-name="table-header"
            cell-class-name="table-content"
            style="width: 100%; height: 100%"
            border
            align="center"
          >
            <el-table-column
              prop="name"
              :label="$t('h.stocktakingSheetName')"
              align="center"
            >
              <template slot-scope="scope">
                <p class="inventory-name" @click="openBillsDialog(scope.row)">
                  {{ scope.row.name }}
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="roleRule"
              :label="$t('h.title176')"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="staffName"
              :label="$t('h.creator')"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="houseName"
              :label="$t('h.title177')"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="createDate"
              :label="$t('h.title178')"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="useDate"
              :label="$t('h.title179')"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="statusName"
              :label="$t('h.state')"
              align="center"
            >
            </el-table-column>
            <el-table-column :label="$t('h.action')" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteInventory(scope.row)"
                  >{{ $t("h.delBtn") }}</el-button
                >
              </template>
            </el-table-column>
            <!-- 空table数据 -->
            <template slot="empty">
              <ds-default-page
                :defaultPageImgUrl="defaultPageImgUrl"
                :defaultPageTips="defaultPageTips"
              ></ds-default-page>
            </template>
          </el-table>
          <!-- 分页区域 -->
          <div class="pagination">
            <ds-pagination
              small
              :total="total"
              :page.sync="paginationForm.currentPage"
              :limit.sync="paginationForm.pageSize"
              @pagination="changeSizePage"
            ></ds-pagination>
          </div>
        </div>
        <!-- 高级筛选 -->
        <ds-filter-drawer
          :filterDrawerVisible.sync="bodyFilteringVisible"
          @resetFilterForm="resetBodyFilterForm"
          @submitFilterForm="submitBodyFilterForm"
          :modal="false"
        >
          <el-form :model="bodyFiltering" ref="body" label-width="100px">
            <el-form-item :label="$t('h.state')" prop="status">
              <el-select
                v-model="bodyFiltering.status"
                :placeholder="$t('h.tips4') + $t('h.state')"
              >
                <el-option :label="$t('h.title135')" value="0"></el-option>
                <el-option :label="$t('h.title180')" value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('h.creationTime')" prop="createDate">
              <el-date-picker
                type="daterange"
                :placeholder="$t('h.tips4') + $t('h.creationTime')"
                v-model="bodyFiltering.createDate"
                style="width: 100%"
                clearable
                :start-placeholder="$t('h.startDate')"
                :end-placeholder="$t('h.endDate')"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('h.title179')" prop="completeDate">
              <el-date-picker
                type="daterange"
                :placeholder="$t('h.tips4') + $t('h.title179')"
                v-model="bodyFiltering.completeDate"
                style="width: 100%"
                clearable
                :start-placeholder="$t('h.startDate')"
                :end-placeholder="$t('h.endDate')"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('h.inventoryChecker')" prop="staffId">
              <el-select
                v-model="bodyFiltering.staffId"
                multiple
                :placeholder="$t('h.tips4')"
              >
                <el-option
                  v-for="item in employeeData"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                >
                </el-option
              ></el-select>
            </el-form-item>
            <el-form-item :label="$t('h.formTips54')" prop="houseId">
              <el-cascader
                :options="superiorWarehouseData"
                :props="{ checkStrictly: true }"
                v-model="bodyFiltering.houseId"
                :show-all-levels="false"
              ></el-cascader>
              <!-- <el-select
                v-model="bodyFiltering.houseId"
                placeholder="请选择仓库"
                filterable
              >
                <el-option
                  v-for="item in houseNameData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item :label="$t('h.fuzzyQuery')" prop="andLike">
              <el-input v-model="bodyFiltering.andLike"></el-input>
            </el-form-item>
          </el-form>
        </ds-filter-drawer>
        <!-- 新建仓库数据填写 -->
        <el-dialog
          :title="$t('h.title181')"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="handleClose"
        >
          <p class="warning" v-if="warning">
            {{ $t("h.formTips54") }}{{ warningTitle }}{{ $t("h.title169") }}
          </p>
          <el-form
            :model="warehouseData"
            :rules="warehouseRules"
            ref="warehouseData"
            label-width="100px"
          >
            <el-form-item :label="$t('h.stocktakingSheetName')" prop="name">
              <el-input v-model="warehouseData.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.title177')" prop="houseId">
              <el-cascader
                :options="superiorWarehouseData"
                :props="{ checkStrictly: true }"
                v-model="warehouseData.houseId"
                :show-all-levels="false"
              ></el-cascader>
              <!-- <el-select
                v-model="warehouseData.houseId"
                placeholder="请选择仓库"
                filterable
              >
                <el-option
                  v-for="item in superiorWarehouseData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item :label="$t('h.title182')" prop="staffId">
              <el-select
                v-model="warehouseData.staffId"
                :placeholder="$t('h.tips4') + $t('h.title182')"
              >
                <el-option
                  v-for="item in employeeData"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('h.creationDate')" prop="createDate">
              <el-date-picker
                disabled
                type="date"
                v-model="warehouseData.createDate"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">{{ $t("h.cancelBtn") }}</el-button>
            <el-button
              type="primary"
              @click="addInventory"
              :disabled="warning"
              >{{ $t("h.confirmBtn") }}</el-button
            >
          </span>
        </el-dialog>
        <!-- 批量导入仓库数据填写 -->
        <el-dialog
          :title="$t('h.title181')"
          :visible.sync="batchVisible"
          fullscreen
        >
        </el-dialog>
        <!-- 盘点结果展示 -->
        <bill-detail-dialog
          :billDetailDialogVisible.sync="newBillsDialogVisible"
          :billFormDetail="billFormDetail"
          :audit="false"
          @closed="bulkBillsDialogClose"
        >
          <template slot="table">
            <div class="bill-table">
              <!-- 头部 -->
              <ds-query-form>
                <ds-query-form-left-panel>
                  <!-- <p>
                    盘点仓库:
                    <span class="title">{{ displayData.houseName }}</span
                    >&nbsp;&nbsp;盘点人:
                    <span class="title">{{ displayData.staffName }}</span>
                  </p> -->
                </ds-query-form-left-panel>
                <ds-query-form-right-panel>
                  <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="inventoryHandleSelect"
                    background-color="#f2f2f2"
                    active-background-color="#fff"
                  >
                    <el-menu-item index="1"
                      >{{ $t("h.title174") }}({{
                        newBillsNumDisplay.all
                      }})</el-menu-item
                    >
                    <el-menu-item index="2"
                      >{{ $t("h.title135") }}({{
                        newBillsNumDisplay.countedAmount
                      }})</el-menu-item
                    >
                    <el-menu-item index="3"
                      >{{ $t("h.title134") }}({{
                        newBillsNumDisplay.unpackedAmount
                      }})</el-menu-item
                    >
                    <el-menu-item index="4"
                      >{{ $t("h.title136") }}({{
                        newBillsNumDisplay.inventoryProfit
                      }})</el-menu-item
                    >
                    <el-menu-item index="5"
                      >{{ $t("h.title175") }}({{
                        newBillsNumDisplay.inventoryAmount
                      }})</el-menu-item
                    >
                    <!-- <el-menu-item index="6"
                      >已标记({{ newBillsNumDisplay.Identified }})</el-menu-item
                    > -->
                  </el-menu>
                </ds-query-form-right-panel>
              </ds-query-form>
              <!-- 筛选区域  -->
              <div class="screen">
                <ds-query-form>
                  <ds-query-form-left-panel>
                    <ds-filter-tag
                      :filterTagsData="articleHighFilterTags"
                      @handleCloseTag="articleHandleCloseFilterTag"
                    ></ds-filter-tag>
                  </ds-query-form-left-panel>
                  <ds-query-form-right-panel>
                    <span
                      class="advancedSearch"
                      @click="newBillsFilteringVisible = true"
                      >{{ $t("h.advancedBtn") }}</span
                    >
                  </ds-query-form-right-panel>
                </ds-query-form>
              </div>
              <!-- 主体  -->
              <div class="table">
                <ds-table
                  ref="assetTableDataDisplay"
                  :tableData="inventoryTableDataDisplay"
                  :tableConfig="inventoryTableConfig"
                  :columns="columns"
                  :rowKey="(row) => row.articleInventoryId"
                  onlyKey="articleInventoryId"
                  @handleSelectionChange="inventorySelete"
                >
                </ds-table>
                <!-- 分页区域 -->
                <div class="pagination">
                  <ds-pagination
                    small
                    :total="inventoryTotal"
                    :page.sync="inventoryPaginationForm.currentPage"
                    :limit.sync="inventoryPaginationForm.pageSize"
                    @pagination="inventoryChangeSizePage"
                  ></ds-pagination>
                </div>
              </div>
            </div>
          </template>
        </bill-detail-dialog>
        <!-- 盘点结果高级筛选 -->
        <ds-filter-drawer
          :filterDrawerVisible.sync="newBillsFilteringVisible"
          @resetFilterForm="resetNewBillsFilterForm"
          @submitFilterForm="submitNewBillsFilterForm"
          :modal="false"
        >
          <el-form :model="newBillsFiltering" ref="newBills" label-width="80px">
            <el-form-item :label="$t('h.state')" prop="status">
              <el-select
                v-model="newBillsFiltering.status"
                :placeholder="$t('h.tips4') + $t('h.state')"
              >
                <el-option :label="$t('h.title135')" value="0"></el-option>
                <el-option :label="$t('h.title180')" value="-1"></el-option>
                <el-option :label="$t('h.title136')" value="1"></el-option>
                <el-option :label="$t('h.title175')" value="-2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('h.title183')" prop="minUnpackedAmount">
              <div class="inp-box">
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.minUnpackedAmount"
                  :placeholder="$t('h.formTips72')"
                  type="number"
                  @change="changeMinUnpackedAmount"
                  min="0"
                ></el-input
                >&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.maxUnpackedAmount"
                  :placeholder="$t('h.formTips73')"
                  type="number"
                  @change="changeMaxUnpackedAmount"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item :label="$t('h.title184')" prop="minUnpackedMoney">
              <div class="inp-box">
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.minUnpackedMoney"
                  :placeholder="$t('h.formTips72')"
                  type="number"
                  @change="changeMinUnpackedMoney"
                  min="0"
                ></el-input
                >&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.maxUnpackedMoney"
                  :placeholder="$t('h.formTips73')"
                  type="number"
                  @change="changeMaxUnpackedMoney"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('h.inventoryLossQuantity')"
              prop="minInventoryAmount"
            >
              <div class="inp-box">
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.minInventoryAmount"
                  :placeholder="$t('h.formTips72')"
                  type="number"
                  @change="changeMinInventoryAmount"
                  min="0"
                ></el-input
                >&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.maxInventoryAmount"
                  :placeholder="$t('h.formTips73')"
                  type="number"
                  @change="changeMaxInventoryAmount"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item :label="$t('h.title185')" prop="minCountedAmount">
              <div class="inp-box">
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.minCountedAmount"
                  :placeholder="$t('h.formTips72')"
                  type="number"
                  @change="changeMinCountedAmount"
                  min="0"
                ></el-input
                >&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.maxCountedAmount"
                  :placeholder="$t('h.formTips73')"
                  type="number"
                  @change="changeMaxCountedAmount"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item :label="$t('h.title186')" prop="minCountedMoney">
              <div class="inp-box">
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.minCountedMoney"
                  :placeholder="$t('h.formTips72')"
                  type="number"
                  @change="changeMinCountedMoney"
                  min="0"
                ></el-input
                >&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;
                <el-input
                  class="input-small"
                  v-model="newBillsFiltering.maxCountedMoney"
                  :placeholder="$t('h.formTips73')"
                  type="number"
                  @change="changeMaxCountedMoney"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item :label="$t('h.fuzzyQuery')" prop="andLike">
              <el-input v-model="newBillsFiltering.andLike"></el-input>
            </el-form-item>
          </el-form>
        </ds-filter-drawer>
      </div>
    </el-card>
  </div>
</template>
<script>
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsPagination from "@/components/DsPagination";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsTable from "@/components/DsTable";
import DsFilterTag from "@/components/DsFilterTag";
import DsDefaultPage from "@/components/DsDefaultPage";
import BillDetailDialog from "@/components/BillsComponents/BillDetailDialog";
import { warehouseOperate, select } from "@/assets/api";
import { getTodayDate, clickDownloadLink } from "@/utils/basic-methods";
import { inventoryResultsColumns } from "@/utils/systemData";
export default {
  components: {
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    DsSearchBtn,
    DsPagination,
    DsTable,
    DsFilterDrawer,
    DsFilterTag,
    DsDefaultPage,
    BillDetailDialog,
  },
  data() {
    return {
      //用户
      userId: "",
      token: "",
      //员工数据
      employeeData: [],
      //仓库正在盘点警告
      warning: false,
      warningTitle: "",
      //盘点结果
      newBillsDialogVisible: false,
      inventoryTableData: [],
      inventoryTableConfig: {},
      columns: inventoryResultsColumns,
      displayData: {
        houseName: "",
        staffName: "",
      },
      newBillsFilteringVisible: false,
      newBillsFiltering: {
        status: "",
        andLike: "",
        houseId: "",
        minUnpackedAmount: "", //待盘数量
        maxUnpackedAmount: "", //待盘数量
        minUnpackedMoney: "", //待盘金额
        maxUnpackedMoney: "", //待盘金额
        minInventoryAmount: "", //盘亏数量
        maxInventoryAmount: "", //盘亏数量
        minCountedAmount: "", //以盘数量
        maxCountedAmount: "", //以盘数量
        minCountedMoney: "", //以盘金额
        maxCountedMoney: "", //以盘金额
      },
      newBillsNumDisplay: {
        all: 0,
        countedAmount: 0,
        unpackedAmount: 0,
        inventoryProfit: 0,
        inventoryAmount: 0,
        Identified: 0,
      },
      inventoryPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      articleHighFilterTags: [],
      billFormDetail: [],
      //主体表格
      andLike: "",
      tableData: [],
      warehouseData: {
        name: "",
        staffId: "",
        createDate: getTodayDate(),
        houseId: [],
      },
      warehouseRules: {
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.stocktakingSheetName"),
            trigger: ["blur", "change"],
          },
        ],
        staffId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.inventoryChecker"),
            trigger: "change",
          },
        ],
        houseId: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips54"),
            trigger: "change",
          },
        ],
      },
      bodyFilteringVisible: false,
      bodyFiltering: {
        andLike: "",
        status: "",
        createDate: "",
        staffId: "",
        houseId: [],
        completeDate: "",
      },
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      highFilterTags: [],
      houseNameData: [], //主体表格仓库名字数据
      //盘点导航栏
      activeIndex: "1",
      //仓库数据
      superiorWarehouseData: [],
      dialogVisible: false,
      batchVisible: false,
      houseId: "",
      defaultPageImgUrl: "",
      defaultPageTips: "",
    };
  },
  computed: {
    total() {
      return this.tableData.length;
    },
    tableDataDisplay() {
      let arr = [];
      let start = 0;
      let end = this.paginationForm.pageSize - 1;
      //   当页数不等于1从start=end*this.paginationForm.currentPage - 1开始到所设置的数据条数
      if (this.paginationForm.currentPage == 1) {
        for (let i = start; i < end; i++) {
          if (this.tableData[i]) {
            arr.push(this.tableData[i]);
          }
        }
      } else {
        for (
          let i = end * (this.paginationForm.currentPage - 1);
          i < end * this.paginationForm.currentPage;
          i++
        ) {
          if (this.tableData[i]) {
            arr.push(this.tableData[i]);
          }
        }
      }
      return arr;
    },
    inventoryTotal() {
      return this.inventoryTableData.length;
    },
    inventoryTableDataDisplay() {
      let arr = [];
      let start = 0;
      let end = this.inventoryPaginationForm.pageSize - 1;
      //   当页数不等于1从start=end*this.inventoryPaginationForm.currentPage - 1开始到所设置的数据条数
      if (this.inventoryPaginationForm.currentPage == 1) {
        for (let i = start; i < end; i++) {
          if (this.inventoryTableData[i]) {
            arr.push(this.inventoryTableData[i]);
          }
        }
      } else {
        for (
          let i = end * (this.inventoryPaginationForm.currentPage - 1);
          i < end * this.inventoryPaginationForm.currentPage;
          i++
        ) {
          if (this.inventoryTableData[i]) {
            arr.push(this.inventoryTableData[i]);
          }
        }
      }
      return arr;
    },
  },
  methods: {
    //删除用户高级筛选填写数据
    articleHandleCloseFilterTag(val) {
      switch (val.keyStr) {
        case "status":
          this.newBillsFiltering.status = "";
          break;
        case "andLike":
          this.newBillsFiltering.andLike = "";
          break;
        case "unpackedAmount":
          this.newBillsFiltering.minUnpackedAmount = "";
          this.newBillsFiltering.maxUnpackedAmount = "";
          break;
        case "unpackedMoney":
          this.newBillsFiltering.minUnpackedMoney = "";
          this.newBillsFiltering.maxUnpackedMoney = "";
          break;
        case "inventoryAmount":
          this.newBillsFiltering.minInventoryAmount = "";
          this.newBillsFiltering.maxInventoryAmount = "";
          break;
        case "countedAmount":
          this.newBillsFiltering.minCountedAmount = "";
          this.newBillsFiltering.maxCountedAmount = "";
          break;
        default:
          this.newBillsFiltering.minCountedMoney = "";
          this.newBillsFiltering.maxCountedMoney = "";
      }
      this.articleHighFilterTags.splice(
        this.articleHighFilterTags.indexOf(val),
        1
      );
      let requstData = {
        inventoryId: this.displayData.inventoryId,
        status: "",
        andLike: "",
        unpackedAmount: "",
        unpackedMoney: "",
        inventoryAmount: "",
        countedAmount: "",
        countedMoney: "",
      };
      this.articleHighFilterTags.forEach((item) => {
        for (let key in requstData) {
          if (item.keyStr == key) {
            if (key == "status") {
              requstData[key] = item.uploadValue;
            } else {
              requstData[key] = item.value;
            }
          }
        }
      });
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "AT0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.inventoryTableData = data.data;
          let countedAmount = 0; //已盘数量
          let unpackedAmount = 0; //未盘数量
          let inventoryProfit = 0; //盘盈数量
          let inventoryAmount = 0; //盘亏数量
          this.inventoryTableData.forEach((item) => {
            if (item.status && item.status == "-1") {
              item.statusName = this.$t("h.title180");
              unpackedAmount += 1;
            } else if (item.status && item.status == "0") {
              item.statusName = this.$t("h.title135");
              countedAmount += 1;
            } else if (item.status && item.status == "1") {
              item.statusName = this.$t("h.title136");
              inventoryProfit += 1;
            } else if (item.status && item.status == "-2") {
              item.statusName = this.$t("h.title175");
              inventoryAmount += 1;
            }
          });
          this.newBillsNumDisplay = {
            all: this.inventoryTableData.length,
            countedAmount,
            unpackedAmount,
            inventoryProfit,
            inventoryAmount,
            Identified: 0,
          };
          this.inventoryTableData.forEach((item) => {
            if (item.image) {
              item.image = window.$EXCEL_URL + "image/" + item.image;
              item.prop = item.image;
            }
          });
          if (!this.inventoryTableData || this.inventoryTableData.length == 0) {
            this.inventoryTableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    handleCloseFilterTag(val) {
      switch (val.keyStr) {
        case "andLike":
          this.bodyFiltering.andLike = "";
          break;
        case "status":
          this.bodyFiltering.status = "";
          break;
        case "createDate":
          this.bodyFiltering.createDate = "";
          break;
        case "staffId":
          this.bodyFiltering.staffId = "";
          break;
        case "houseId":
          this.bodyFiltering.houseId = [];
          break;
        default:
          this.bodyFiltering.completeDate = "";
      }
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      let requstData = {
        inventoryId: "",
        status: "",
        createDate: "",
        completeDate: "",
        staffId: "",
        houseId: "",
        andLike: "",
      };
      this.highFilterTags.forEach((item) => {
        for (let key in requstData) {
          if (item.keyStr == key) {
            if (key == "status" || key == "staffId" || key == "houseId") {
              requstData[key] = item.uploadValue;
            } else {
              requstData[key] = item.value;
            }
          }
        }
      });
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "IT0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.tableData = data.data;
          if (!this.tableData || this.tableData.length == 0) {
            this.tableData = [];
          }
          this.tableData.forEach((item) => {
            if (item.status == "-1") {
              item.statusName = this.$t("h.title180");
            } else {
              item.statusName = this.$t("h.title135");
            }
          });
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //物品高级筛选最大最小数限制
    changeMaxCountedMoney() {
      if (
        this.newBillsFiltering.maxCountedMoney.trim() == "" ||
        Number(this.newBillsFiltering.maxCountedMoney) <=
          Number(this.newBillsFiltering.minCountedMoney)
      ) {
        this.newBillsFiltering.maxCountedMoney = (
          this.newBillsFiltering.minCountedMoney * 1 +
          1
        ).toString();
      }
    },
    changeMinCountedMoney(val) {
      if (
        this.newBillsFiltering.maxCountedMoney.trim() == "" ||
        Number(this.newBillsFiltering.maxCountedMoney) < Number(val)
      ) {
        this.newBillsFiltering.maxCountedMoney = (val * 1 + 1).toString();
      }
    },
    changeMaxCountedAmount(val) {
      if (this.newBillsFiltering.minCountedAmount.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.newBillsFiltering.maxCountedAmount = (
          this.newBillsFiltering.minCountedAmount * 1 +
          1
        ).toString();
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.newBillsFiltering.maxCountedAmount.trim() == "" ||
        Number(this.newBillsFiltering.maxCountedAmount) <=
          Number(this.newBillsFiltering.minCountedAmount)
      ) {
        this.newBillsFiltering.maxCountedAmount = (
          this.newBillsFiltering.minCountedAmount * 1 +
          1
        ).toString();
      }
    },
    changeMinCountedAmount(val) {
      if (this.newBillsFiltering.maxCountedAmount.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.newBillsFiltering.minCountedAmount = "0";
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.newBillsFiltering.maxCountedAmount.trim() == "" ||
        Number(this.newBillsFiltering.maxCountedAmount) < Number(val)
      ) {
        this.newBillsFiltering.maxCountedAmount = (val * 1 + 1).toString();
      }
    },
    changeMaxInventoryAmount(val) {
      if (this.newBillsFiltering.minInventoryAmount.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.newBillsFiltering.maxInventoryAmount = (
          this.newBillsFiltering.minInventoryAmount * 1 +
          1
        ).toString();
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.newBillsFiltering.maxInventoryAmount.trim() == "" ||
        Number(this.newBillsFiltering.maxInventoryAmount) <=
          Number(this.newBillsFiltering.minInventoryAmount)
      ) {
        this.newBillsFiltering.maxInventoryAmount = (
          this.newBillsFiltering.minInventoryAmount * 1 +
          1
        ).toString();
      }
    },
    changeMinInventoryAmount(val) {
      if (this.newBillsFiltering.maxInventoryAmount.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.newBillsFiltering.minInventoryAmount = "0";
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.newBillsFiltering.maxInventoryAmount.trim() == "" ||
        Number(this.newBillsFiltering.maxInventoryAmount) < Number(val)
      ) {
        this.newBillsFiltering.maxInventoryAmount = (val * 1 + 1).toString();
      }
    },
    changeMaxUnpackedMoney() {
      if (
        this.newBillsFiltering.maxUnpackedMoney.trim() == "" ||
        Number(this.newBillsFiltering.maxUnpackedMoney) <=
          Number(this.newBillsFiltering.minUnpackedMoney)
      ) {
        this.newBillsFiltering.maxUnpackedMoney = (
          this.newBillsFiltering.minUnpackedMoney * 1 +
          1
        ).toString();
      }
    },
    changeMinUnpackedMoney(val) {
      if (
        this.newBillsFiltering.maxUnpackedMoney.trim() == "" ||
        Number(this.newBillsFiltering.maxUnpackedMoney) < Number(val)
      ) {
        this.newBillsFiltering.maxUnpackedMoney = (val * 1 + 1).toString();
      }
    },
    changeMaxUnpackedAmount(val) {
      if (this.newBillsFiltering.minUnpackedAmount.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.newBillsFiltering.maxUnpackedAmount = (
          this.newBillsFiltering.minUnpackedAmount * 1 +
          1
        ).toString();
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.newBillsFiltering.maxUnpackedAmount.trim() == "" ||
        Number(this.newBillsFiltering.maxUnpackedAmount) <=
          Number(this.newBillsFiltering.minUnpackedAmount)
      ) {
        this.newBillsFiltering.maxUnpackedAmount = (
          this.newBillsFiltering.minUnpackedAmount * 1 +
          1
        ).toString();
      }
    },
    changeMinUnpackedAmount(val) {
      if (this.newBillsFiltering.maxUnpackedAmount.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.newBillsFiltering.minUnpackedAmount = "0";
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.newBillsFiltering.maxUnpackedAmount.trim() == "" ||
        Number(this.newBillsFiltering.maxUnpackedAmount) < Number(val)
      ) {
        this.newBillsFiltering.maxUnpackedAmount = (val * 1 + 1).toString();
      }
    },
    // 分页功能
    // 设置条数 页数
    changeSizePage(val) {
      this.paginationForm.currentPage = val.page;
      this.paginationForm.pageSize = val.limit;
    },
    inventoryChangeSizePage(val) {
      this.inventoryPaginationForm.currentPage = val.page;
      this.inventoryPaginationForm.pageSize = val.limit;
    },
    //导出
    exportFile() {
      warehouseOperate({
        func: "IT0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          pull: 1,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          clickDownloadLink(window.$EXCEL_URL + data.data);
          this.$message.success(this.$t("h.exportSuccessful"));
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //获取员工数据
    getEmployeeData() {
      select({
        func: "S0005",
        userId: this.userId,
        token: this.token,
        requstData: {
          _id: "",
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.employeeData = data.data;
          } else {
            this.employeeData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //获取仓库数据
    getWarehouseData() {
      warehouseOperate({
        func: "ST0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            let arr = [];
            data.data.forEach((item) => {
              if (!item.disabled && item.state == "0") {
                arr.push({
                  name: item.name,
                  label: item.name,
                  value: item.houseId,
                  state: item.state,
                  subId: item.subId,
                });
              }
              this.houseNameData.push({
                name: item.name,
                value: item.houseId,
                state: item.state,
              });
            });
            this.superiorWarehouseData = this.tree(arr, "-");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //dialog关闭
    handleClose() {
      this.$refs["warehouseData"].resetFields();
      this.dialogVisible = false;
      this.warning = false;
    },
    //树状图生成
    tree(list, subId) {
      const arr = [];
      // 1.遍历
      list.forEach((item) => {
        // 2.首次传入空字符串  判断list的pid是否为空 如果为空就是一级节点
        if (item.subId == subId) {
          // 找到之后就要去找item下面有没有子节点  以 item.id 作为 父 id, 接着往下找
          const children = this.tree(list, item.value);
          if (children.length > 0) {
            // 如果children的长度大于0,说明找到了子节点
            item.children = children;
          }
          // 将item项, 追加到arr数组中
          arr.push(item);
        }
      });
      return arr;
    },
    closeDialog() {
      this.$refs["warehouseData"].resetFields();
      this.dialogVisible = false;
      this.warning = false;
    },
    //新增盘点
    addInventory() {
      this.$refs["warehouseData"].validate((valid) => {
        if (!valid) return false;
        warehouseOperate({
          func: "IT0002",
          userId: this.userId,
          token: this.token,
          requstData: {
            name: this.warehouseData.name,
            staffId: this.warehouseData.staffId,
            createDate: this.warehouseData.createDate,
            houseId:
              this.warehouseData.houseId.length > 1
                ? this.warehouseData.houseId[
                    this.warehouseData.houseId.length - 1
                  ]
                : this.warehouseData.houseId.join(),
          },
        })
          .then(({ data }) => {
            if (data.code == "-1") return this.$message.error(data.data);
            this.$message.success(data.data);
            //获取盘点单据
            this.getData();
          })
          .catch((error) => this.$message.error(error));
        this.dialogVisible = false;
      });
    },
    //获取盘点单据
    getData() {
      warehouseOperate({
        func: "IT0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.data) {
            this.tableData = data.data;
            this.tableData.forEach((item) => {
              if (item.status == "-1") {
                item.statusName = this.$t("h.title180");
              } else {
                item.statusName = this.$t("h.title135");
              }
            });
          } else {
            this.tableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //获取盘点结果单据
    getInventoryData(inventoryId) {
      warehouseOperate({
        func: "AT0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          inventoryId, // 盘点单据id  必填
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.inventoryTableData = data.data;
            let countedAmount = 0; //已盘数量
            let unpackedAmount = 0; //未盘数量
            let inventoryProfit = 0; //盘盈数量
            let inventoryAmount = 0; //盘亏数量
            this.inventoryTableData.forEach((item) => {
              if (item.status && item.status == "-1") {
                item.statusName = this.$t("h.title180");
                unpackedAmount += 1;
              } else if (item.status && item.status == "0") {
                item.statusName = this.$t("h.title135");
                countedAmount += 1;
              } else if (item.status && item.status == "1") {
                item.statusName = this.$t("h.title136");
                inventoryProfit += 1;
              } else if (item.status && item.status == "-2") {
                item.statusName = this.$t("h.title175");
                inventoryAmount += 1;
              }
            });
            this.newBillsNumDisplay = {
              all: this.inventoryTableData.length,
              countedAmount,
              unpackedAmount,
              inventoryProfit,
              inventoryAmount,
              Identified: 0,
            };
            this.inventoryTableData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
            });
          } else {
            this.inventoryTableData = [];
            this.newBillsNumDisplay = {
              all: 0,
              countedAmount: 0,
              unpackedAmount: 0,
              inventoryProfit: 0,
              inventoryAmount: 0,
              Identified: 0,
            };
          }
        })
        .catch((error) => this.$message.error(error));
    },
    //删除盘点单据
    deleteInventory(row) {
      this.$confirm(this.$t("h.tips260"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
        type: "warning",
      })
        .then(() => {
          warehouseOperate({
            func: "IT0004",
            userId: this.userId,
            token: this.token,
            requstData: {
              inventoryId: row.inventoryId, //盘点单据id
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message.success(data.data);
              this.getData();
            })
            .catch((error) => this.$message.error(error));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("h.tips98"),
          });
        });
    },
    //搜索
    search() {
      warehouseOperate({
        func: "IT0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.tableData = data.data;
          if (!this.tableData || this.tableData.length == 0) {
            this.tableData = [];
          }
          this.tableData.forEach((item) => {
            if (item.status == "-1") {
              item.statusName = this.$t("h.title180");
            } else {
              item.statusName = this.$t("h.title135");
            }
          });
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //打开NewBillsDialog
    openBillsDialog(row) {
      this.newBillsDialogVisible = true;
      this.displayData = {
        houseName: row.houseName,
        staffName: row.staffName,
        inventoryId: row.inventoryId,
      };
      this.billFormDetail = [
        { span: 3, class: "col-title", val: this.$t("h.title177") },
        { span: 5, class: "col-content", val: row.houseName },
        { span: 3, class: "col-title", val: this.$t("h.inventoryChecker") },
        { span: 5, class: "col-content", val: row.staffName },
      ];
      this.getInventoryData(row.inventoryId);
    },
    //关闭NewBillsDialog
    bulkBillsDialogClose() {},
    //盘点导航栏选择事件
    inventoryHandleSelect(key) {
      if (key == "1") {
        warehouseOperate({
          func: "AT0001",
          userId: this.userId,
          token: this.token,
          requstData: {
            inventoryId: this.displayData.inventoryId,
          },
        })
          .then(({ data }) => {
            if (data.code == "-1") return this.$message.error(data.data);
            this.inventoryTableData = data.data;
            if (
              !this.inventoryTableData ||
              this.inventoryTableData.length == 0
            ) {
              this.inventoryTableData = [];
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
      } else if (key == "2") {
        warehouseOperate({
          func: "AT0001",
          userId: this.userId,
          token: this.token,
          requstData: {
            inventoryId: this.displayData.inventoryId,
            status: 0,
          },
        })
          .then(({ data }) => {
            if (data.code == "-1") return this.$message.error(data.data);
            this.inventoryTableData = data.data;
            if (
              !this.inventoryTableData ||
              this.inventoryTableData.length == 0
            ) {
              this.inventoryTableData = [];
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
      } else if (key == "3") {
        warehouseOperate({
          func: "AT0001",
          userId: this.userId,
          token: this.token,
          requstData: {
            inventoryId: this.displayData.inventoryId,
            status: -1,
          },
        })
          .then(({ data }) => {
            if (data.code == "-1") return this.$message.error(data.data);
            this.inventoryTableData = data.data;
            if (
              !this.inventoryTableData ||
              this.inventoryTableData.length == 0
            ) {
              this.inventoryTableData = [];
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
      } else if (key == "4") {
        warehouseOperate({
          func: "AT0001",
          userId: this.userId,
          token: this.token,
          requstData: {
            inventoryId: this.displayData.inventoryId,
            status: 1,
          },
        })
          .then(({ data }) => {
            if (data.code == "-1") return this.$message.error(data.data);
            this.inventoryTableData = data.data;
            if (
              !this.inventoryTableData ||
              this.inventoryTableData.length == 0
            ) {
              this.inventoryTableData = [];
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
      } else if (key == "5") {
        warehouseOperate({
          func: "AT0001",
          userId: this.userId,
          token: this.token,
          requstData: {
            inventoryId: this.displayData.inventoryId,
            status: -2,
          },
        })
          .then(({ data }) => {
            if (data.code == "-1") return this.$message.error(data.data);
            this.inventoryTableData = data.data;
            if (
              !this.inventoryTableData ||
              this.inventoryTableData.length == 0
            ) {
              this.inventoryTableData = [];
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
      } else if (key == "6") {
        this.inventoryTableData = [];
      }
    },
    //盘点表格选择事件
    inventorySelete() {},
    //重置NewBills高级筛选
    resetNewBillsFilterForm() {
      this.articleHighFilterTags = [];
      this.$refs["newBills"].resetFields();
      this.newBillsFiltering.maxUnpackedAmount = "";
      this.newBillsFiltering.maxUnpackedMoney = "";
      this.newBillsFiltering.maxInventoryAmount = "";
      this.newBillsFiltering.maxCountedAmount = "";
      this.newBillsFiltering.maxCountedMoney = "";
      warehouseOperate({
        func: "AT0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.inventoryTableData = data.data;
          if (!this.inventoryTableData || this.inventoryTableData.length == 0) {
            this.inventoryTableData = [];
          }
          this.inventoryTableData.forEach((item) => {
            if (item.status && item.status == "-1") {
              item.statusName = this.$t("h.title180");
              unpackedAmount += 1;
            } else if (item.status && item.status == "0") {
              item.statusName = this.$t("h.title135");
              countedAmount += 1;
            } else if (item.status && item.status == "1") {
              item.statusName = this.$t("h.title136");
              inventoryProfit += 1;
            } else if (item.status && item.status == "-2") {
              item.statusName = this.$t("h.title175");
              inventoryAmount += 1;
            }
          });
          this.inventoryTableData.forEach((item) => {
            if (item.image) {
              item.image = window.$EXCEL_URL + "image/" + item.image;
              item.prop = item.image;
            }
          });
          this.newBillsFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //NewBills高级筛选
    submitNewBillsFilterForm() {
      if (
        (this.newBillsFiltering.minUnpackedAmount.trim() != "" &&
          this.newBillsFiltering.maxUnpackedAmount.trim() == "") ||
        (this.newBillsFiltering.minUnpackedAmount.trim() == "" &&
          this.newBillsFiltering.maxUnpackedAmount.trim() != "")
      )
        return this.$message.error(this.$t("h.tips259"));
      if (
        (this.newBillsFiltering.minUnpackedMoney.trim() != "" &&
          this.newBillsFiltering.maxUnpackedMoney.trim() == "") ||
        (this.newBillsFiltering.minUnpackedMoney.trim() == "" &&
          this.newBillsFiltering.maxUnpackedMoney.trim() != "")
      )
        return this.$message.error(this.$t("h.tips259"));
      if (
        (this.newBillsFiltering.minInventoryAmount.trim() != "" &&
          this.newBillsFiltering.maxInventoryAmount.trim() == "") ||
        (this.newBillsFiltering.minInventoryAmount.trim() == "" &&
          this.newBillsFiltering.maxInventoryAmount.trim() != "")
      )
        return this.$message.error(this.$t("h.tips259"));
      if (
        (this.newBillsFiltering.minCountedAmount.trim() != "" &&
          this.newBillsFiltering.maxCountedAmount.trim() == "") ||
        (this.newBillsFiltering.minCountedAmount.trim() == "" &&
          this.newBillsFiltering.maxCountedAmount.trim() != "")
      )
        return this.$message.error(this.$t("h.tips259"));
      if (
        (this.newBillsFiltering.minCountedMoney.trim() != "" &&
          this.newBillsFiltering.maxCountedMoney.trim() == "") ||
        (this.newBillsFiltering.minCountedMoney.trim() == "" &&
          this.newBillsFiltering.maxCountedMoney.trim() != "")
      )
        return this.$message.error(this.$t("h.tips259"));
      let requstData = {
        inventoryId: this.displayData.inventoryId,
        status: this.newBillsFiltering.status,
        andLike: this.newBillsFiltering.andLike,
        unpackedAmount:
          this.newBillsFiltering.minUnpackedAmount +
          "," +
          this.newBillsFiltering.maxUnpackedAmount,
        unpackedMoney:
          this.newBillsFiltering.minUnpackedMoney +
          "," +
          this.newBillsFiltering.maxUnpackedMoney,
        inventoryAmount:
          this.newBillsFiltering.minInventoryAmount +
          "," +
          this.newBillsFiltering.maxInventoryAmount,
        countedAmount:
          this.newBillsFiltering.minCountedAmount +
          "," +
          this.newBillsFiltering.maxCountedAmount,
        countedMoney:
          this.newBillsFiltering.minCountedMoney +
          "," +
          this.newBillsFiltering.maxCountedMoney,
      };
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "AT0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          this.articleHighFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          this.inventoryTableData = data.data;
          if (!this.inventoryTableData || this.inventoryTableData.length == 0) {
            this.inventoryTableData = [];
          }
          this.inventoryTableData.forEach((item) => {
            if (item.status && item.status == "-1") {
              item.statusName = this.$t("h.title180");
              unpackedAmount += 1;
            } else if (item.status && item.status == "0") {
              item.statusName = this.$t("h.title135");
              countedAmount += 1;
            } else if (item.status && item.status == "1") {
              item.statusName = this.$t("h.title136");
              inventoryProfit += 1;
            } else if (item.status && item.status == "-2") {
              item.statusName = this.$t("h.title175");
              inventoryAmount += 1;
            }
          });
          this.inventoryTableData.forEach((item) => {
            if (item.image) {
              item.image = window.$EXCEL_URL + "image/" + item.image;
              item.prop = item.image;
            }
          });
          for (let key in requstData) {
            if (key == "status") {
              let statusName = "";
              if (requstData[key] == "0") {
                statusName = this.$t("h.title135");
              } else if (requstData[key] == "-1") {
                statusName = this.$t("h.title180");
              } else if (requstData[key] == "1") {
                statusName = this.$t("h.title136");
              } else {
                statusName = this.$t("h.title175");
              }
              this.articleHighFilterTags.push({
                name: this.$t("h.state"),
                value: statusName,
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "andLike") {
              this.articleHighFilterTags.push({
                name: this.$t("h.fuzzyQuery"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "unpackedAmount") {
              this.articleHighFilterTags.push({
                name: this.$t("h.title183"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "unpackedMoney") {
              this.articleHighFilterTags.push({
                name: this.$t("h.title184"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "inventoryAmount") {
              this.articleHighFilterTags.push({
                name: this.$t("h.inventoryLossQuantity"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "countedAmount") {
              this.articleHighFilterTags.push({
                name: this.$t("h.title185"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "countedMoney") {
              this.articleHighFilterTags.push({
                name: this.$t("h.title186"),
                value: requstData[key],
                keyStr: key,
              });
            }
          }
          // this.$refs["newBills"].resetFields();
          // this.newBillsFiltering.maxUnpackedAmount = "";
          // this.newBillsFiltering.maxUnpackedMoney = "";
          // this.newBillsFiltering.maxInventoryAmount = "";
          // this.newBillsFiltering.maxCountedAmount = "";
          // this.newBillsFiltering.maxCountedMoney = "";
          this.newBillsFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //重置body高级筛选
    resetBodyFilterForm() {
      this.highFilterTags = [];
      this.$refs["body"].resetFields();
      warehouseOperate({
        func: "IT0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.tableData = data.data;
          if (!this.tableData || this.tableData.length == 0) {
            this.tableData = [];
          }
          this.tableData.forEach((item) => {
            if (item.status == "-1") {
              item.statusName = this.$t("h.title180");
            } else {
              item.statusName = this.$t("h.title135");
            }
          });
          this.$refs["body"].resetFields();
          this.bodyFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //body高级筛选
    submitBodyFilterForm() {
      let requstData = {
        inventoryId: this.displayData.inventoryId,
        status: this.bodyFiltering.status,
        createDate: this.bodyFiltering.createDate
          ? this.bodyFiltering.createDate.join()
          : "",
        completeDate: this.bodyFiltering.completeDate
          ? this.bodyFiltering.completeDate.join()
          : "",
        staffId: this.bodyFiltering.staffId.join(),
        houseId:
          this.bodyFiltering.houseId.length > 1
            ? this.bodyFiltering.houseId[this.bodyFiltering.houseId.length - 1]
            : this.bodyFiltering.houseId.join(),
        andLike: this.bodyFiltering.andLike,
      };
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "IT0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          this.highFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          this.tableData = data.data;
          if (!this.tableData || this.tableData.length == 0) {
            this.tableData = [];
          }
          this.tableData.forEach((item) => {
            if (item.status == "-1") {
              item.statusName = this.$t("h.title180");
            } else {
              item.statusName = this.$t("h.title135");
            }
          });
          for (let key in requstData) {
            if (key == "andLike") {
              this.highFilterTags.push({
                name: this.$t("h.fuzzyQuery"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "status") {
              let statusName = "";
              if (requstData[key] == "0") {
                statusName = this.$t("h.title135");
              } else {
                statusName = this.$t("h.title180");
              }
              this.highFilterTags.push({
                name: this.$t("h.state"),
                value: statusName,
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "createDate") {
              this.highFilterTags.push({
                name: this.$t("h.creationTime"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "staffId") {
              let name = "";
              this.employeeData.forEach((children) => {
                if (children._id == requstData[key]) {
                  name = children.name;
                }
              });
              this.highFilterTags.push({
                name: this.$t("h.inventoryChecker"),
                value: name,
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "houseId") {
              let houseName = "";
              this.houseNameData.forEach((children) => {
                if (children.value == requstData[key]) {
                  houseName = children.name;
                }
              });
              this.highFilterTags.push({
                name: this.$t("h.formTips54"),
                value: houseName,
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "completeDate") {
              this.highFilterTags.push({
                name: this.$t("h.title179"),
                value: requstData[key],
                keyStr: key,
              });
            }
          }
          // this.$refs["body"].resetFields();
          this.bodyFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
  },
  created() {
    this.userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
    this.token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
    this.getData(this.userId, this.token);
    this.getEmployeeData();
    this.getWarehouseData();
  },
  watch: {
    "warehouseData.houseId": function (val) {
      for (let i = 0; i < this.houseNameData.length; i++) {
        if (
          this.houseNameData[i].value == val &&
          this.houseNameData[i].state == "-1"
        ) {
          this.warning = true;
          this.warningTitle = this.houseNameData[i].name;
          return;
        } else if (this.houseNameData.length - 1 == i) {
          this.warning = false;
          this.warningTitle = "";
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-card__body {
  display: flex;
  height: 96.2%;
  padding: 20px;
  padding-top: 10px;
}
::v-deep .table-header {
  padding: 0;
  height: 41px;
  font-size: 13px;
  color: #000;
  background-color: #f2f6ff !important;
  border-color: #eeeeee;
}
::v-deep .table-content {
  padding: 0;
  height: 42px;
  color: #333;
  font-size: 13px;
  border-color: #eeeeee;
}
::v-deep .el-menu-item {
  height: 40px;
  line-height: 40px;
  &.is-active {
    background: #fff !important;
    border-bottom: none !important;
  }
}
/* ::v-deep .el-table__body-wrapper {
  height: calc(100% - 41px);
} */
.Inventory {
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  .box-card {
    height: 100%;
    box-sizing: border-box;
  }
  .operation-area {
    width: 100%;
    height: 100%;
    .screen {
      height: 28px;
      margin-top: 5px;
      margin-bottom: 5px;
      .advancedSearch {
        font-size: 14px;
        margin-left: 5px;
        cursor: pointer;
        color: #798cfb;
      }
    }
    .right-body {
      height: 88%;
      margin-top: 10px;
      .pagination {
        height: 40px;
      }
    }
    .warning {
      position: fixed;
      top: 164px;
      left: 50%;
      transform: translateX((-50%));
      color: #f56c6c;
    }
    .inventory-name {
      color: #6a83fb;
      cursor: pointer;
    }
    .right-panel {
      width: 100%;
    }
    .search {
      display: flex;
      height: 20px;
      margin-top: 10px;
      margin-bottom: 10px;
      justify-content: flex-end;
    }
    .table {
      height: 700px;
    }
    .pagination {
      height: 40px;
    }
    .title {
      font-size: 18px;
    }
    .inp-box {
      display: flex;
      height: 40px;
    }
    .input-small {
      width: 45%;
    }
  }
}
</style>
