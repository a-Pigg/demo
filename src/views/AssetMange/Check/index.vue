<template>
  <div class="check">
    <el-card class="check-card">
      <!-- 卡片头部 -->
      <div slot="header" class="check-card-header">
        <ds-query-form>
          <!-- 按钮区域 -->
          <ds-query-form-left-panel>
            <el-button
              size="small"
              type="primary"
              @click="newDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-button size="small" @click="exprotAllCheckBills">{{
              $t("h.exportBtn")
            }}</el-button>
          </ds-query-form-left-panel>
          <!-- 搜索区域 -->
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="findBillsSearch"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <!-- 卡片主体 -->
      <div class="check-card-content">
        <!-- 高级筛选 -->
        <div class="check-filter">
          <ds-filter-tag
            :filterTagsData="highFilterTags"
            @handleCloseTag="handleCloseFilterTag"
          ></ds-filter-tag>
          <el-button
            class="advanced-filter-btn"
            type="text"
            size="small"
            @click="filterDrawerVisible = true"
            >{{ $t("h.advancedBtn") }}</el-button
          >
        </div>
        <!-- 表格 -->
        <div class="check-table">
          <ds-table
            :loading="tableLoading"
            :tableData="checkBills"
            :columns="checkColumns"
            :tableConfig="checkConfig"
            :rowKey="(row) => row._id"
            @checkTableRowDetail="LookCheckBillDetail"
          >
            <template slot="operation" slot-scope="{ scope }">
              <ul class="table-column-btns">
                <li @click="lookCheckReport(scope.row)" class="item-btn">
                  <img
                    class="btn-icon"
                    src="@/assets/images/icon-repart.png"
                    alt=""
                  />
                  <span class="text">{{ $t("h.viewReport") }}</span>
                </li>
                <li
                  class="borderStyle item-btn"
                  @click="exportCheckBillAssets(scope.row.queryCode)"
                >
                  <img
                    class="btn-icon"
                    src="@/assets/images/icon-export.png"
                    alt=""
                  />
                  <span class="text">{{ $t("h.exportData") }}</span>
                </li>
                <li class="borderStyle item-btn">
                  <el-popover placement="bottom" trigger="click">
                    <div class="off-line">
                      <div class="export">
                        <el-button
                          :loading="btnLoading"
                          type="primary"
                          size="small"
                          @click="offLineExport(scope.row.queryCode)"
                        >
                          {{ $t("h.dataExport") }}
                        </el-button>
                      </div>
                      <div class="import">
                        <el-button
                          type="success"
                          size="small"
                          @click="offLineImport(scope.row)"
                          >{{ $t("h.dataImport") }}</el-button
                        >
                      </div>
                    </div>
                    <span slot="reference">
                      <svg-icon icon-file-name="offLine"></svg-icon>
                      <span style="margin-left: 2px" class="text">{{
                        $t("h.offlineStocktaking")
                      }}</span>
                    </span>
                  </el-popover>
                </li>
                <li
                  class="item-btn"
                  @click="deleteCheckBill(scope.row.queryCode)"
                >
                  <img
                    class="btn-icon"
                    src="@/assets/images/icon-delete.png"
                    alt=""
                  />
                  <span class="text">{{ $t("h.delBtn") }}</span>
                </li>
              </ul>
            </template>
          </ds-table>
        </div>
        <!-- 分页 -->
        <div class="check-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getCheckBills"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <!-- 高级筛选 -->
    <ds-filter-drawer
      :filterDrawerVisible.sync="filterDrawerVisible"
      @submitFilterForm="submitFilterForm"
      @resetFilterForm="resetFilterForm"
    >
      <el-form ref="filterFormRef" label-width="100px" :model="filterForm">
        <el-form-item :label="$t('h.inventoryStatus')" prop="queryState">
          <el-select
            v-model="filterForm.queryState"
            multiple
            :placeholder="$t('h.tips4')"
            clearable
            filterable
          >
            <el-option
              v-for="item in statusListData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('h.creationDate')" prop="createDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filterForm.createDate"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
            <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('h.finishDate')" prop="completeDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filterForm.completeDate"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
            <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('h.stocktakingDepartment')" prop="deptId">
          <ds-select-tree
            v-model="filterForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.department')"
            :multiple="true"
            :checkStrictly="true"
            :treeData="treeDepts"
            :defaultProps="deptTreeProps"
            collapseTags
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.inventoryChecker')" prop="staffId">
          <!-- <el-select
            ref="highFilterStaffSelectref"
            v-model="filterForm.staffId"
            multiple
            placeholder="请选择"
            clearable
            filterable
            remote
            :remote-method="checkStaffRemoteMethod"
          >
            <el-option
              v-for="item in staffData"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            >
              {{ item.deptName }} - {{ item.code }} - {{ item.name }}
            </el-option>
          </el-select> -->
          <el-select
            ref="highFilterStaffSelectref"
            v-model="filterForm.staffId"
            :placeholder="$t('h.tips4')"
            multiple
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: staffData,
              modelField: '_id',
              model: filterForm.staffId.join(','),
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
      </el-form>
    </ds-filter-drawer>
    <!-- 新建弹框 -->
    <new-bills-dialog
      class="new-dialog"
      :title="$t('h.title73')"
      :newBillsDialogVisible.sync="newDialogVisible"
      @sbumitForm="sbumitCheckForm"
      @close="newDialogVisibleClosed"
      @opened="newDialogVisibleOpened"
    >
      <template slot="form">
        <el-form
          label-width="100px"
          ref="checkFormRef"
          :model="checkForm"
          :rules="checkFormRules"
        >
          <el-form-item :label="$t('h.stocktakingSheetName')" prop="queryName">
            <el-input
              :placeholder="$t('h.tips3') + $t('h.stocktakingSheetName')"
              v-model="checkForm.queryName"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('h.inventoryChecker')"
            prop="staffId"
            v-if="newDialogVisible"
          >
            <el-select
              v-model="checkForm.staffId"
              :placeholder="$t('h.tips4') + $t('h.inventoryChecker')"
              clearable
              filterable
              :filter-method="() => {}"
              @change="staffSelectChange"
              v-load-more="{
                options: staffData,
                modelField: '_id',
                model: checkForm.staffId,
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
          <el-form-item :label="$t('h.stocktakingDepartment')" prop="deptId">
            <ds-select-tree
              v-model="checkForm.deptId"
              :placeholder="$t('h.tips4') + $t('h.stocktakingDepartment')"
              :defaultProps="deptTreeProps"
              :treeData="treeDepts"
              @input="checkDeptInput"
            ></ds-select-tree>
          </el-form-item>
          <el-form-item :label="$t('h.creationDate')" prop="createDate">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('h.tips4') + $t('h.creationDate')"
              v-model="checkForm.createDate"
            >
              <!-- format="yyyy 年 MM 月 dd 日" -->
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="tips">
          <span>{{ $t("h.stocktakingScope") }}</span>
          <span class="text">
            (
            <i class="el-icon-info"></i>
            {{ $t("h.tips9") }} )
          </span>
        </div>
        <el-form
          label-width="100px"
          ref="checkFindFormRef"
          :model="checkFindForm"
        >
          <el-form-item :label="$t('h.dateOfPurchase')" prop="inData">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="checkFindForm.inData"
              type="daterange"
              :range-separator="$t('h.to')"
              :start-placeholder="$t('h.startDate')"
              :end-placeholder="$t('h.endDate')"
            >
              <!-- format="yyyy 年 MM 月 dd 日" -->
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('h.assetCategory')" prop="classifyId">
            <ds-select-tree
              v-model="checkFindForm.classifyId"
              :placeholder="$t('h.tips4') + $t('h.assetCategory')"
              :multiple="true"
              :checkStrictly="true"
              :collapseTags="true"
              :defaultProps="assetTypeProps"
              :treeData="assetTypes"
            >
            </ds-select-tree>
          </el-form-item>
          <el-form-item
            :label="$t('h.area')"
            prop="warehouseId"
            v-if="newDialogVisible"
          >
            <!-- <el-select
              v-model="checkFindForm.warehouseId"
              placeholder="请选择区域"
              filterable
              multiple
              clearable
              remote
              :remote-method="checkWareHouseRemoteMethod"
            >
              <el-option
                v-for="(item, i) in wareHouses"
                :key="i"
                :label="item.warehouseName"
                :value="item._id"
              >
                {{ item.code }} - {{ item.warehouseName }}
              </el-option>
            </el-select> -->
            <el-select
              :placeholder="$t('h.tips4') + $t('h.area')"
              v-model="checkFindForm.warehouseId"
              multiple
              clearable
              filterable
              :filter-method="() => {}"
              v-load-more="{
                options: wareHouses,
                modelField: '_id',
                model: checkFindForm.warehouseId.join(','),
                searchField: 'andLike',
                func: 'S0003',
                userInfo: userInfo,
              }"
            >
              <el-option
                v-for="item in wareHouses"
                :key="item._id"
                :label="item.warehouseName"
                :value="item._id"
              >
                <span> {{ item.code }} - {{ item.warehouseName }} </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('h.assetStatus')" prop="state">
            <el-select
              v-model="checkFindForm.state"
              multiple
              clearable
              filterable
              default-first-option
              :placeholder="$t('h.tips4') + $t('h.assetStatus')"
            >
              <el-option
                v-for="item in stateListData"
                :key="item._id"
                :label="item.label"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('h.userDepartment')" prop="deptId">
            <ds-select-tree
              v-model="checkFindForm.deptId"
              :placeholder="$t('h.tips4') + $t('h.department')"
              :multiple="true"
              :checkStrictly="true"
              :defaultProps="deptTreeProps"
              :treeData="treeDepts"
            ></ds-select-tree>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
    <!-- 导出弹框 -->
    <bills-export-dialog
      :billsExportDialogVisible.sync="billsExportDialogVisible"
      :percentage="exportPercentage"
      :step="exportStep"
      :errorContent="exportErrorContent"
      @close="billsExportDialogVisibleClose"
    ></bills-export-dialog>
    <!-- 查看单据详情 -->
    <bill-detail-dialog
      :billDetailDialogVisible.sync="billDetailDialogVisible"
      :billFormDetail="billFormDetail"
      :audit="false"
      @closed="billDetailDialogVisibleClosed"
    >
      <template slot="table">
        <ds-table
          ref="detailTableRef"
          :loading="detailLoading"
          :tableData="detailAssets"
          :columns="detailColumns"
          :tableConfig="detailConfig"
          :rowKey="(row) => row._id"
        ></ds-table>
      </template>
      <template slot="pagination">
        <ds-pagination
          small
          :total="detailTotal"
          :page.sync="detailPaginationForm.currentPage"
          :limit.sync="detailPaginationForm.pageSize"
          @pagination="getMatchAssets"
        ></ds-pagination>
      </template>
    </bill-detail-dialog>
    <!-- 查看单据报告 -->
    <check-report-dialog
      :reportDialogVisible.sync="reportDialogVisible"
      :checkBillReport="checkBillReport"
    >
    </check-report-dialog>
    <!-- 离线盘点导入数据 -->
    <offline-upload-dialog
      class="offline-dialog"
      :offlineUploadDialogVisible.sync="offlineUploadDialogVisible"
      @closed="offlineUoloadClosed"
      @submit="offlineUoloadSubmit"
    >
      <template slot="upload">
        <upload-excel-base64 :value.sync="checkFile"></upload-excel-base64>
      </template>
    </offline-upload-dialog>
  </div>
</template>
<script>
import { select, update, deleteData } from "@/assets/api";
import { mapState } from "vuex";
import { checkColumns, checkStatusListData } from "@/utils/systemData";
import {
  clickDownloadLink,
  countTableHeaderWidth,
} from "@/utils/basic-methods";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import DsTable from "@/components/DsTable";
import DsFilterTag from "@/components/DsFilterTag";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsSelectTree from "@/components/DsSelectTree";
import DsPagination from "@/components/DsPagination";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import UploadExcelBase64 from "@/components/UploadExcelBase64";
import BillDetailDialog from "@/components/BillsComponents/BillDetailDialog";
import BillsExportDialog from "@/components/BillsComponents/BillsExportDialog";
import CheckReportDialog from "@/components/BillsComponents/AssetMangeComponents/Check/CheckReportDialog";
import OfflineUploadDialog from "@/components/BillsComponents/AssetMangeComponents/Check/OfflineUploadDialog";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
export default {
  components: {
    DsTable,
    DsFilterTag,
    DsSearchBtn,
    DsQueryForm,
    DsSelectTree,
    DsPagination,
    NewBillsDialog,
    DsFilterDrawer,
    UploadExcelBase64,
    BillDetailDialog,
    BillsExportDialog,
    CheckReportDialog,
    OfflineUploadDialog,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      newDialogVisible: false,
      dialogLoading: {
        target: ".new-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      deptTreeProps: {
        value: "_id",
        label: "deptName",
        children: "children",
      },
      assetTypeProps: {
        children: "children",
        label: "classifyName",
        value: "_id",
      },
      assetTypes: [],
      deptData: [],
      treeDepts: [],
      staffData: [],
      wareHouses: [],
      checkForm: {
        queryName: "",
        deptId: "",
        staffId: "",
        createDate: "",
      },
      checkFindForm: {
        inData: [],
        classifyId: [],
        warehouseId: [],
        state: [],
        deptId: [],
      },
      checkFormRules: {
        queryName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.stocktakingSheetName"),
            trigger: "blur",
          },
        ],
        staffId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.inventoryChecker"),
            trigger: "change",
          },
        ],
        deptId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.stocktakingDepartment"),
            trigger: "change",
          },
        ],
        createDate: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.creationDate"),
            trigger: "change",
          },
        ],
      },
      btnLoading: false,
      tableLoading: false,
      checkColumns: checkColumns,
      checkConfig: {
        index: true,
      },
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      checkBills: [],
      filterDrawerVisible: false,
      statusListData: checkStatusListData,
      highFilterTags: [],
      andLike: "",
      filterForm: {
        deptId: [],
        staffId: [],
        createDate: [],
        completeDate: [],
        queryState: [],
      },
      billsExportDialogVisible: false,
      exportPercentage: 0,
      exportStep: "loading",
      exportErrorContent: "",
      reportDialogVisible: false,
      checkBillReport: {},
      billDetailDialogVisible: false,
      billFormDetail: [],
      detailTotal: 0,
      detailPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      detailLoading: false,
      detailMatchCode: [],
      detailAssets: [],
      detailConfig: {},
      offlineUploadDialogVisible: false,
      checkFile: {
        value: "",
        name: "",
      },
      offlineQueryInfo: {
        queryCode: "",
        roleRule: "",
      },
    };
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader", "stateListData"]),
    detailColumns() {
      let columns = [];
      this.assetTableHeader.forEach((item) => {
        if (item.attr == "photo") {
          columns.push({
            type: "image",
            prop: item.attr,
            label: item.label,
            width: countTableHeaderWidth(item.label),
          });
        } else if (item.attr == "assetCode") {
          columns.push({
            type: "detail",
            prop: item.attr,
            label: item.label,
            width: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "state") {
          columns.push({
            type: "assetState",
            prop: item.attr,
            label: item.label,
            width: countTableHeaderWidth(item.label),
            formatter: (row) => {
              return this.stateListData.find((e) => {
                return e._id == row[item.attr];
              }).label;
            },
          });
        } else if (
          item.attr == "name" ||
          item.attr == "type" ||
          item.attr == "model" ||
          item.attr == "assertPosition"
        ) {
          columns.push({
            prop: item.attr,
            label: item.label,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        }
      });

      return columns;
    },
  },
  methods: {
    // 获取部门
    getDepts() {
      select({
        func: "S0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.treeDepts = transListDataToTreeData(data.data, null);
          this.deptData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getAssetTypes() {
      select({
        func: "S0006",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.assetTypes = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 区域筛选
    // checkWareHouseRemoteMethod(query) {
    //   if (!query) {
    //     this.wareHouses = [];
    //     return false;
    //   }
    //   select({
    //     func: "S0003",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       andLike: query,
    //     },
    //   })
    //     .then(({ data }) => {
    //       if (data.code != 0) return this.$message.error(data.data);
    //       this.wareHouses = data.data;
    //     })
    //     .catch(() => {
    //       this.$message.error("服务器网络错误，查询存放地点失败");
    //     });
    // },
    // 员工筛选
    // checkStaffRemoteMethod(query) {
    //   if (!query) {
    //     this.staffData = [];
    //     return false;
    //   }
    //   select({
    //     func: "S0005",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       andLike: query,
    //     },
    //   })
    //     .then(({ data }) => {
    //       if (data.code != 0) return this.$message.error(data.data);
    //       this.staffData = data.data;
    //     })
    //     .catch(() => {
    //       this.$message.error("服务器网络错误，查询员工失败");
    //     });
    // },
    // 员工change方法
    staffSelectChange(val) {
      if (!val) return false;
      this.checkForm.deptId = this.staffData.find(
        (item) => item._id == val
      ).deptId;
    },
    checkDeptInput(val) {
      if (!val) return false;
      let matchStaffData = this.staffData.filter((item) => item.deptId == val);
      if (matchStaffData.length) {
        let matchStaff = matchStaffData.find(
          (item) => item._id == this.checkForm.staffId
        );
        if (!matchStaff) this.checkForm.staffId = "";
      } else {
        this.checkForm.staffId = "";
      }
    },
    // 获取盘点单据
    getCheckBills() {
      this.tableLoading = true;
      if (this.filterForm.completeDate == null)
        this.filterForm.completeDate = [];
      if (this.filterForm.createDate == null) this.filterForm.createDate = [];
      if (this.filterForm.deptId == null) this.filterForm.deptId = [];
      select({
        func: "S0017",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          andLike: this.andLike,
          queryState: this.filterForm.queryState.join(","),
          createDate: this.filterForm.createDate.join(","),
          completeDate: this.filterForm.completeDate.join(","),
          deptId: this.filterForm.deptId.join(","),
          staffId: this.filterForm.staffId.join(","),
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.checkBills = data.data[1] || [];
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getMatchAssets() {
      this.detailLoading = true;
      this.$nextTick(() => {
        this.$refs.detailTableRef.$refs.dsTableRef.bodyWrapper.scrollTop = 0;
      });
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // code: this.detailMatchCode.join(","),
          item: [
            {
              key: "code",
              handle: "OIS",
              value: this.detailMatchCode.join(","),
            },
          ],
          page: this.detailPaginationForm.pageSize,
          index: this.detailPaginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          this.detailLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.detailTotal = data.data[0];
          this.detailAssets = data.data[1];
        })
        .catch(() => {
          this.detailLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 查看盘点单据详情
    LookCheckBillDetail(val) {
      this.billFormDetail = [
        { span: 3, class: "col-title", val: this.$t("h.inventoryNumber") },
        { span: 5, class: "col-content", val: val.roleRule },
        { span: 3, class: "col-title", val: this.$t("h.stocktakingSheetName") },
        { span: 5, class: "col-content", val: val.queryName },
        {
          span: 3,
          class: "col-title",
          val: this.$t("h.stocktakingDepartment"),
        },
        { span: 5, class: "col-content", val: val.deptName },
        { span: 3, class: "col-title", val: this.$t("h.inventoryChecker") },
        { span: 5, class: "col-content", val: val.queryCreater },
        { span: 3, class: "col-title", val: this.$t("h.creationTime") },
        { span: 5, class: "col-content", val: val.createDate },
        { span: 3, class: "col-title", val: this.$t("h.completionTime") },
        { span: 5, class: "col-content", val: val.completeDate },
      ];
      if (val.hadQueryedCodes != null) {
        this.detailMatchCode = [
          ...this.detailMatchCode,
          ...val.hadQueryedCodes.split(";"),
        ];
      }
      if (val.notQueryedCodes != null) {
        this.detailMatchCode = [
          ...this.detailMatchCode,
          ...val.notQueryedCodes.split(","),
        ];
      }
      if (this.detailMatchCode.length) {
        this.getMatchAssets();
      }
      this.billDetailDialogVisible = true;
    },
    billDetailDialogVisibleClosed() {
      this.detailAssets = [];
      this.detailTotal = 0;
      this.detailPaginationForm.currentPage = 1;
      this.detailPaginationForm.pageSize = 20;
      this.detailMatchCode = [];
    },
    // 查看盘点报告
    lookCheckReport(val) {
      this.checkBillReport = val;
      this.reportDialogVisible = true;
    },
    // 导出盘点单据资产
    exportCheckBillAssets(queryCode) {
      this.tableLoading = true;
      update({
        func: "U0029",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          check_id: queryCode,
          permissonId: 56,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          clickDownloadLink(window.$EXCEL_URL + data.data);
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 离线导入盘点好数据
    offLineImport(row) {
      this.offlineQueryInfo.queryCode = row.queryCode;
      this.offlineQueryInfo.roleRule = row.roleRule;
      this.offlineUploadDialogVisible = true;
    },
    offlineUoloadClosed() {
      this.checkFile.name = "";
      this.checkFile.value = "";
      this.offlineQueryInfo.queryCode = "";
      this.offlineQueryInfo.roleRule = "";
    },
    offlineUoloadSubmit() {
      // if (this.checkFile.name.indexOf(this.offlineQueryInfo.roleRule) == -1) {
      //   return this.$message.error("当前盘点文件与盘点单据不匹配，请重新上传");
      // }
      if (this.checkFile.value == "data:") {
        return this.$message.error(this.$t("h.tips131"));
      }
      const LOADING = this.$loading({
        target: ".offline-dialog",
      });
      select({
        func: "S0058",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          id: this.offlineQueryInfo.queryCode,
          base64: this.checkFile.value,
        },
      })
        .then(({ data }) => {
          LOADING.close();
          if (data.code != 0) return this.$message.error(data.data);
          this.$message.success(data.data);
          this.offlineUploadDialogVisible = false;
          this.getCheckBills();
        })
        .catch(() => {
          LOADING.close();
          // "服务器网络错误，上传离线盘点结果失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 离线导出需盘点数据
    offLineExport(queryCode) {
      this.btnLoading = true;
      update({
        func: "U0029",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          isTrue: "0",
          check_id: queryCode,
          permissonId: 56,
        },
      })
        .then(({ data }) => {
          this.btnLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          clickDownloadLink(window.$EXCEL_URL + data.data);
        })
        .catch(() => {
          this.btnLoading = false;
          // "服务器网络错误，导出需盘点单据失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 删除盘点单据
    deleteCheckBill(queryCode) {
      this.$confirm(this.$t("h.tips132"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          deleteData({
            func: "D0017",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              queryCode: queryCode,
              permissonId: 45,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) return this.$message.error(data.data);
              this.$message.success(data.data);
              let totalPage = Math.ceil(
                (this.total - 1) / this.paginationForm.pageSize
              );
              let currentPage =
                this.paginationForm.currentPage > totalPage
                  ? totalPage
                  : this.paginationForm.currentPage;
              this.paginationForm.currentPage =
                currentPage < 1 ? 1 : currentPage;
              this.getCheckBills();
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    // 确认添加盘点单据
    sbumitCheckForm() {
      this.$refs.checkFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        if (this.checkFindForm.inData == null) this.checkFindForm.inData = [];
        if (this.checkFindForm.deptId == null) this.checkFindForm.deptId = [];
        if (this.checkFindForm.classifyId == null)
          this.checkFindForm.classifyId = [];
        let queryWheres = [];
        let queryValues = [];
        for (let key in this.checkFindForm) {
          if (this.checkFindForm[key].length) {
            if (key == "inData") {
              queryWheres.push("beginData", "endDate");
              queryValues.push(
                this.checkFindForm[key][0],
                this.checkFindForm[key][1]
              );
            } else {
              queryWheres.push(key);
              queryValues.push(this.checkFindForm[key].join(","));
            }
          }
        }
        update({
          func: "U0051",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            staffId: this.checkForm.staffId,
            deptId: this.checkForm.deptId,
            queryName: this.checkForm.queryName,
            createDate: this.checkForm.createDate,
            queryState: "0",
            queryWheres: queryWheres.join(";"),
            queryValues: queryValues.join(";"),
            permissonId: 44,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newDialogVisible = false;
            this.getCheckBills();
            this.$message.success(this.$t("h.tips133"));
          })
          .catch(() => {
            LOADING.close();
            // "服务器网络异常，创建盘点单据失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // 新建弹框开会后
    newDialogVisibleOpened() {
      this.$refs.checkFormRef.clearValidate();
    },
    // 新建弹框关闭时
    newDialogVisibleClosed() {
      this.checkForm.queryName = "";
      this.checkForm.deptId = "";
      this.checkForm.staffId = "";
      this.checkForm.createDate = "";
      this.checkFindForm.inData = [];
      this.checkFindForm.classifyId = [];
      this.checkFindForm.warehouseId = [];
      this.checkFindForm.state = [];
      this.checkFindForm.deptId = [];
    },
    // 导出全部盘点单据
    exprotAllCheckBills() {
      this.billsExportDialogVisible = true;
      this.exportPercentage = 50;
      update({
        func: "U0036",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          permissonId: 56,
        },
      })
        .then(({ data }) => {
          this.exportPercentage = 100;
          if (data.code != 0) {
            this.exportStep = "error";
            this.exportErrorContent = data.data;
            return false;
          }
          this.exportStep = "success";
          clickDownloadLink(window.$EXCEL_URL + data.data);
        })
        .catch(() => {
          this.exportPercentage = 100;
          this.exportStep = "error";
          // "服务器网络错误，转移单据导出失败"
          this.exportErrorContent = this.$t("h.tips18");
        });
    },
    // 导出弹框关闭时
    billsExportDialogVisibleClose() {
      this.exportPercentage = 0;
      this.exportStep = "loading";
      this.exportErrorContent = "";
    },
    // 高级筛选
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getCheckBills();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getCheckBills();
    },
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm[val.keyStr] = [];
      this.paginationForm.currentPage = 1;
      this.getCheckBills();
    },
    // 映射高级筛选字段
    mapHighFilterTags() {
      this.highFilterTags = [];
      for (let key in this.filterForm) {
        if (this.filterForm[key] && this.filterForm[key].length) {
          if (key == "createDate") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.creationDate");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join(this.$t("h.to"));
            this.highFilterTags.push(highFilteritem);
          } else if (key == "completeDate") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.finishDate");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join(this.$t("h.to"));
            this.highFilterTags.push(highFilteritem);
          } else if (key == "queryState") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let label = this.statusListData.find((statusItem) => {
                return statusItem.value == item;
              }).label;
              labels.push(label);
            });
            highFilteritem.name = this.$t("h.inventoryStatus");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "deptId") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let deptName = this.deptData.find((deptItem) => {
                return deptItem._id == item;
              }).deptName;
              labels.push(deptName);
            });
            highFilteritem.name = this.$t("h.stocktakingDepartment");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "staffId") {
            let highFilteritem = {};
            let labels = [];
            this.$refs.highFilterStaffSelectref.selected.forEach((item) => {
              labels.push(item.label);
            });
            highFilteritem.name = this.$t("h.inventoryChecker");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          }
        }
      }
    },
    findBillsSearch() {
      this.paginationForm.currentPage = 1;
      this.getCheckBills();
    },
  },
  created() {
    this.getCheckBills();
    this.getDepts();
    this.getAssetTypes();
  },
};
</script>
<style lang="scss" scoped>
.check {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .check-card {
    padding: 0 15px;
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
.check-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.check-card-content {
  height: 100%;
  .check-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .check-table {
    height: calc(100% - 75px);
  }
  .check-pagination {
    height: 40px;
  }
}
.table-column-btns {
  display: flex;
  .item-btn {
    padding: 0 8px;
    cursor: pointer;
    .btn-icon {
      vertical-align: middle;
      margin-right: 3px;
      width: 14px;
      height: 14px;
    }
    .text {
      font-size: 12px;
      color: #588ab9;
    }
  }
}
.borderStyle {
  position: relative;
  &::after {
    position: absolute;
    top: 6px;
    left: -1px;
    content: "";
    width: 2px;
    height: 14px;
    background: #000;
  }
  &::before {
    position: absolute;
    top: 6px;
    right: -1px;
    content: "";
    width: 2px;
    height: 14px;
    background: #000;
  }
}
.off-line {
  .export,
  .import {
    text-align: center;
  }
  .import {
    margin-top: 10px;
  }
}
.new-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
  .tips {
    font-size: 18px;
    vertical-align: middle;
    color: #588ab9;
    .text {
      font-size: 14px;
      vertical-align: middle;
    }
    .el-icon-info {
      vertical-align: middle;
      font-size: 20px;
    }
  }
}
</style>
