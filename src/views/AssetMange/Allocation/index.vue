<template>
  <div class="allocation">
    <el-card class="allocation-card">
      <!-- 卡片头部 -->
      <div slot="header" class="allocation-card-header">
        <ds-query-form>
          <!-- 按钮区域 -->
          <ds-query-form-left-panel>
            <el-button
              type="primary"
              size="small"
              @click="newAllocationBills"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editAlloctionForm">{{
                  $t("h.changeBtn")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="deleteAllocationBills">{{
                  $t("h.delBtn")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.printBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="goPrintBills">{{
                  $t("h.printDoucmentBtn")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="openPrintSet">{{
                  $t("h.tempSetBtn")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button size="small" @click="billsExportDialogVisible = true">{{
              $t("h.exportBtn")
            }}</el-button>
          </ds-query-form-left-panel>
          <!-- 搜索区域 -->
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="findAssetSearch"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <!-- 卡片主体 -->
      <div class="allocation-card-content">
        <!-- 高级筛选 -->
        <div class="bills-filter">
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
        <!-- 单据表格 -->
        <div class="bills-table">
          <ds-table
            ref="billsTableRef"
            :loading="tableLoading"
            :tableData="alloctionBills"
            :columns="billsColumns"
            :tableConfig="billsTableConfig"
            :rowKey="(row) => row._id"
            @handleSelectionChange="handleSelectionChange"
            @checkTableRowDetail="checkBillDetail"
          >
            <template slot="operation" slot-scope="{ scope }">
              <el-popover
                :ref="`uploadPopoverRef-${scope.row._id}`"
                placement="left"
                width="100"
                @after-leave="billPopAsterLeave"
              >
                <div class="popover-cotent" v-loading="uploadImgLoading">
                  <upload-photo :value.sync="billPhotoFile"></upload-photo>
                  <el-button
                    type="text"
                    size="small"
                    @click="uploadBillPhoto(scope.row)"
                    >{{ $t("h.confirmUpload") }}</el-button
                  >
                </div>
                <el-button type="text" size="small" slot="reference">{{
                  $t("h.uploadVouchers")
                }}</el-button>
              </el-popover>
            </template>
          </ds-table>
        </div>
        <!-- 分页 -->
        <div class="bills-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getAllocationBills"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <!-- 高级筛选抽屉 -->
    <ds-filter-drawer
      :filterDrawerVisible.sync="filterDrawerVisible"
      @submitFilterForm="submitFilterForm"
      @resetFilterForm="resetFilterForm"
    >
      <el-form ref="filterFormRef" label-width="100px" :model="filterForm">
        <el-form-item :label="$t('h.auditStatus')" prop="status">
          <el-select
            v-model="filterForm.status"
            multiple
            :placeholder="$t('h.tips4')"
            clearable
            filterable
          >
            <el-option
              v-for="(item, i) in statusListData"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('h.transferDate')" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filterForm.date"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
            <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('h.transferDepartment')" prop="deptId">
          <ds-select-tree
            v-model="filterForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.department')"
            :multiple="true"
            :checkStrictly="true"
            :treeData="deptTreeData"
            :defaultProps="deptTreeProps"
            collapseTags
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.user')" prop="staffId">
          <!-- <el-select
            ref="highFilterStaffSelectref"
            v-model="filterForm.staffId"
            multiple
            placeholder="请选择"
            clearable
            filterable
            remote
            :remote-method="transferStaffRemoteMethod"
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
    <!-- 单据导出 -->
    <bills-export-dialog
      :billsExportDialogVisible.sync="billsExportDialogVisible"
      :percentage="exportPercentage"
      :step="exportStep"
      :errorContent="exportErrorContent"
      @submitExportForm="submitExportForm"
      @close="billsExportDialogVisibleClose"
    >
      <el-form label-width="100px" ref="exportFormRef" :model="exportForm">
        <el-form-item :label="$t('h.auditStatus')" prop="status">
          <el-select
            v-model="exportForm.status"
            multiple
            :placeholder="$t('h.tips4')"
            clearable
            filterable
          >
            <el-option
              v-for="item in statusListData"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('h.transferDate')" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="exportForm.date"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
            <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('h.transferDepartment')" prop="deptId">
          <ds-select-tree
            v-model="exportForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.department')"
            :multiple="true"
            :checkStrictly="true"
            :treeData="deptTreeData"
            :defaultProps="deptTreeProps"
            collapseTags
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.user')" prop="staffId">
          <!-- <el-select
            v-model="exportForm.staffId"
            multiple
            placeholder="请选择"
            clearable
            filterable
            remote
            :remote-method="transferStaffRemoteMethod"
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
            v-model="exportForm.staffId"
            :placeholder="$t('h.tips4')"
            multiple
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: staffData,
              modelField: '_id',
              model: exportForm.staffId.join(','),
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
    </bills-export-dialog>
    <!-- 新建/编辑 -->
    <new-bills-dialog
      class="new-bill-dialog"
      :title="newBillTitle"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitAllocationForm"
    >
      <template slot="form">
        <el-row class="nav" :gutter="45">
          <el-form
            ref="allocationFormRef"
            inline
            label-width="160px"
            :model="allocationForm"
            :rules="allocationFormRules"
          >
            <el-col :span="12">
              <el-form-item
                :label="$t('h.user')"
                prop="staffId"
                v-if="newBillsDialogVisible"
              >
                <el-select
                  v-model="allocationForm.staffId"
                  :placeholder="$t('h.tips4') + $t('h.user')"
                  clearable
                  filterable
                  :filter-method="() => {}"
                  @change="staffSelectChange"
                  v-load-more="{
                    options: staffData,
                    modelField: '_id',
                    model: allocationForm.staffId,
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
              <el-form-item :label="$t('h.transferDepartment')" prop="deptId">
                <ds-select-tree
                  v-model="allocationForm.deptId"
                  :placeholder="$t('h.tips4') + $t('h.transferDepartment')"
                  :defaultProps="deptTreeProps"
                  :treeData="deptTreeData"
                  @input="deptInput"
                ></ds-select-tree>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('h.transferDate')" prop="date">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="allocationForm.date"
                  :placeholder="$t('h.tips4') + $t('h.transferDate')"
                  style="width: 100%"
                >
                  <!-- format="yyyy 年 MM 月 dd 日" -->
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </template>
      <template slot="btns">
        <div>
          <span class="title">{{ $t("h.selectAsset") }}</span>
        </div>
        <div class="btns">
          <el-button
            type="text"
            size="small"
            @click="matchAssetsDialogVisible = true"
            >{{ $t("h.addAssets") }}</el-button
          >
          <el-button type="text" size="small" @click="deleteBillSelectAssets">{{
            $t("h.delBtn")
          }}</el-button>
        </div>
      </template>
      <template slot="table">
        <div class="bill-table">
          <ds-table
            ref="billAssetsRef"
            :loading="billAssetsLoading"
            :tableData="billAssets"
            :columns="assetsColumns"
            :tableConfig="billsTableConfig"
            :rowKey="(row) => row._id"
            @handleSelectionChange="billAssetsSelectionChange"
          ></ds-table>
        </div>
      </template>
    </new-bills-dialog>
    <match-assets-dialog
      :matchAssetsDialogVisible.sync="matchAssetsDialogVisible"
      :state="matchState"
      :updateSelectBillAssets="billAssets"
      :deptData="deptData"
      :deptTreeData="deptTreeData"
      @save="savaSelectAssets"
    ></match-assets-dialog>
    <!-- 单据详情 -->
    <bill-detail-dialog
      print
      :billDetailDialogVisible.sync="billDetailDialogVisible"
      :billFormDetail="billFormDetail"
      :auditStep="auditStep"
      @closed="billDetailDialogVisibleClosed"
      @print="printBillAssets"
    >
      <template slot="table">
        <ds-table
          ref="detailTableRef"
          :loading="detailLoading"
          :tableData="detailAssets"
          :columns="billAssetsColumns"
          :tableConfig="detailConfig"
          :rowKey="(row) => row._id"
          @handleSelectionChange="selectPrintAssets"
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
    <!-- 打印模版 -->
    <!-- 打印 -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <bill-print-template
      ref="vptRef"
      :title="`${$t('h.title62')}`"
      :selectId="allocationTemplateId"
      :voucherPrintTempList="billPrintTemplate"
      @setVoucherTag="setBillPrintTemplate"
    ></bill-print-template>
    <bill-print-dialog
      ref="vpdRef"
      locationName="allocationTemplateId"
      :voucherData="selectAlloctionBills"
      :userInfo="userInfo"
      :voucherPrintTemplate="billPrintTemplate"
    ></bill-print-dialog>
    <!-- 打印资产标签dialog -->
    <asset-print-dialog
      ref="apdRef"
      :userInfo="userInfo"
      :selectAssetsData="printAssets"
    ></asset-print-dialog>
  </div>
</template>
<script>
import AssetPrintDialog from "@/components/ListComponents/AssetPrintDialog";
import BillPrintDialog from "@/components/BillsComponents/BillPrintDialog";
import BillPrintTemplate from "@/components/BillsComponents/BillPrintTemplate";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import UploadPhoto from "@/components/ListComponents/NewAssetDialog/UploadPhoto";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsFilterTag from "@/components/DsFilterTag";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsSelectTree from "@/components/DsSelectTree";
import BillsExportDialog from "@/components/BillsComponents/BillsExportDialog";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import MatchAssetsDialog from "@/components/BillsComponents/MatchAssetsDialog";
import BillDetailDialog from "@/components/BillsComponents/BillDetailDialog";
import { mapState } from "vuex";
import { deleteData, select, update } from "@/assets/api";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import {
  alloctionBillsColumns,
  statusListData,
  allocationDetailCell,
  deleteBillsErrorColumns,
} from "@/utils/systemData";
import {
  clickDownloadLink,
  getTodayDate,
  countTableHeaderWidth,
} from "@/utils/basic-methods";
export default {
  components: {
    AssetPrintDialog,
    BillPrintDialog,
    BillPrintTemplate,
    DsDeleteDetail,
    UploadPhoto,
    BillDetailDialog,
    NewBillsDialog,
    MatchAssetsDialog,
    BillsExportDialog,
    DsSelectTree,
    DsFilterDrawer,
    DsPagination,
    DsTable,
    DsFilterTag,
    DsSearchBtn,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      filterDrawerVisible: false,
      highFilterTags: [],
      filterForm: {
        staffId: [],
        deptId: [],
        status: [],
        date: [],
      },
      andLike: "",
      tableLoading: false,
      billsTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      billsColumns: alloctionBillsColumns,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      selectAlloctionBills: [],
      alloctionBills: [],
      statusListData: statusListData,
      deptTreeProps: {
        value: "_id",
        label: "deptName",
        children: "children",
      },
      deptData: [],
      deptTreeData: [],
      staffData: [],
      // 导出
      billsExportDialogVisible: false,
      exportPercentage: 0,
      exportStep: "",
      exportErrorContent: "",
      exportForm: {
        status: [],
        date: [],
        deptId: [],
        staffId: [],
      },
      // 新建/编辑
      newBillsDialogVisible: false,
      newBillTitle: this.$t("h.title63"),
      matchAssetsDialogVisible: false,
      matchState: "1",
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      allocationForm: {
        _id: "",
        deptId: "",
        staffId: "",
        date: getTodayDate(),
        num: 1,
      },
      allocationFormRules: {
        deptId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.transferDepartment"),
            trigger: "change",
          },
        ],
        staffId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.user"),
            trigger: "change",
          },
        ],
        date: [
          {
            type: "string",
            required: true,
            message: this.$t("h.tips4") + this.$t("h.transferDate"),
            trigger: "change",
          },
        ],
      },
      billAssetsLoading: false,
      selectBillAssets: [],
      billAssets: [],
      billDetailDialogVisible: false,
      billFormDetail: [],
      auditStep: [],
      detailLoading: false,
      detailAssets: [],
      detailMatchAssetIds: [],
      detailConfig: {
        selection: true,
        reserveSelection: true,
      },
      detailTotal: 0,
      detailPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      uploadImgLoading: false,
      billPhotoFile: "",
      deleteDialogVisible: false,
      deleteColumns: deleteBillsErrorColumns,
      deleteErrorData: [],
      billPrintTemplate: [],
      allocationTemplateId: "",
      billDetaulVal: null,
      printAssets: [],
    };
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader", "stateListData"]),
    billAssetsColumns() {
      let columns = [];
      this.assetTableHeader.forEach((item) => {
        // if (item.attr == "state") {
        //   columns.push({
        //     type: "assetState",
        //     prop: item.attr,
        //     label: item.label,
        //     fixed: item.fixed,
        //     width: countTableHeaderWidth(item.label),
        //     formatter: (row) => {
        //       switch (row[item.attr]) {
        //         case "0":
        //           return "闲置中";
        //         case "1":
        //           return "使用中";
        //         case "2":
        //           return "已借出";
        //         case "3":
        //           return "维修中";
        //         case "4":
        //           return "已报废";
        //         case "5":
        //           return "转移中";
        //         default:
        //           return "错误编码";
        //       }
        //     },
        //   });
        // } else
        if (item.attr == "assetCode") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "type") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "name") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "model") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "assertPosition") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "photo") {
          columns.push({
            type: "image",
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            width: countTableHeaderWidth(item.label),
          });
        }
      });
      return columns;
    },
    assetsColumns() {
      let columns = [];
      this.assetTableHeader.forEach((item) => {
        if (item.attr == "state") {
          columns.push({
            type: "assetState",
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            width: countTableHeaderWidth(item.label),
            formatter: (row) => {
              return this.stateListData.find((e) => {
                return e._id == row[item.attr];
              }).label;
            },
          });
        } else if (item.attr == "assetCode") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "type") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "name") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "model") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "assertPosition") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "photo") {
          columns.push({
            type: "image",
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            width: countTableHeaderWidth(item.label),
          });
        }
      });
      return columns;
    },
  },
  methods: {
    // 获取部门
    getDeptData() {
      select({
        func: "S0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.deptData = data.data;
          this.deptTreeData = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 员工查询
    // transferStaffRemoteMethod(query) {
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
    // 请求转移单据数据
    getAllocationBills() {
      this.tableLoading = true;
      if (this.filterForm.date == null) this.filterForm.date = [];
      select({
        func: "S0016",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          deptId: this.filterForm.deptId.join(","),
          staffId: this.filterForm.staffId.join(","),
          status: this.filterForm.status.join(","),
          date: this.filterForm.date.join(","),
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.alloctionBills = data.data[1];
          this.alloctionBills.forEach((item) => {
            if (item.image)
              item.image = window.$EXCEL_URL + "image/" + item.image;
            item.company = window.sessionStorage.getItem("loginCompanyName");
          });
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 获取选中单据数据
    handleSelectionChange(val) {
      this.selectAlloctionBills = val;
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
          // _id: this.detailMatchAssetIds.join(","),
          item: [
            {
              key: "_id",
              handle: "OIS",
              value: this.detailMatchAssetIds.join(","),
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
    getBillsAuditMessage(val) {
      select({
        func: "S0053",
        token: this.userInfo.token,
        userId: this.userInfo._id,
        requstData: {
          _id: val._id,
          type: "ZY",
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          // 这五个  0代表不需要审批 -1代表未审批 大于1代表审批人的id
          this.auditStep = this.createBillAuditMessage(val, data.data);
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    createBillAuditMessage(bill, hierarchy) {
      let auditStep = [];
      if (bill.examineOne) {
        auditStep.push({
          state: "pedding",
          auditStaffName: this.$t("h.auditStaffName1"),
          auditState: "more",
        });
      }
      if (bill.examineTwo) {
        auditStep.push({
          state: "pedding",
          auditStaffName: this.$t("h.auditStaffName2"),
          auditState: "more",
        });
      }
      if (bill.examineThree) {
        auditStep.push({
          state: "pedding",
          auditStaffName: this.$t("h.auditStaffName3"),
          auditState: "more",
        });
      }
      if (bill.examineFour) {
        auditStep.push({
          state: "pedding",
          auditStaffName: this.$t("h.auditStaffName4"),
          auditState: "more",
        });
      }
      if (bill.examineFive) {
        auditStep.push({
          state: "pedding",
          auditStaffName: this.$t("h.auditStaffName5"),
          auditState: "more",
        });
      }
      auditStep.forEach((item, index) => {
        if (hierarchy[index]) {
          if (hierarchy[index].rejection != undefined) {
            for (let key in hierarchy[index]) {
              if (key != "rejection") {
                item.auditStaffName = hierarchy[index][key];
              }
            }
            item.auditState = "error";
            item.message = hierarchy[index].rejection;
          } else {
            for (let key in hierarchy[index]) {
              if (key != "rejection") {
                item.auditStaffName = hierarchy[index][key];
              }
            }
            item.auditState = "success";
          }
        }
      });
      auditStep.push({ state: "end" });
      return auditStep;
    },
    // 查看单据详情
    checkBillDetail(val) {
      this.billFormDetail = allocationDetailCell(val);
      this.billDetaulVal = val;
      this.detailMatchAssetIds = val.assetIds.split(",");
      if (this.detailMatchAssetIds.length) {
        this.getMatchAssets();
      }
      this.getBillsAuditMessage(val);
      this.billDetailDialogVisible = true;
    },
    billDetailDialogVisibleClosed() {
      this.billDetaulVal = null;
      this.detailAssets = [];
      this.detailTotal = 0;
      this.detailPaginationForm.currentPage = 1;
      this.detailPaginationForm.pageSize = 20;
      this.detailMatchAssetIds = [];
      this.printAssets = [];
      this.$refs["detailTableRef"].$refs["dsTableRef"].clearSelection();
    },
    // 映射高级筛选字段
    mapHighFilterTags() {
      this.highFilterTags = [];
      for (let key in this.filterForm) {
        if (this.filterForm[key] && this.filterForm[key].length) {
          if (key == "date") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.transferDate");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join("至");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "status") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let label = this.statusListData.find((statusItem) => {
                return statusItem.value == item;
              }).label;
              labels.push(label);
            });
            highFilteritem.name = this.$t("h.auditStatus");
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
            highFilteritem.name = this.$t("h.transferDepartment");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "staffId") {
            let highFilteritem = {};
            let labels = [];
            this.$refs.highFilterStaffSelectref.selected.forEach((item) => {
              labels.push(item.label);
            });
            highFilteritem.name = this.$t("h.user");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          }
        }
      }
    },
    // 高级筛选
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAllocationBills();
    },
    // 重置高级筛选
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAllocationBills();
    },
    // 取消筛选
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm[val.keyStr] = [];
      this.paginationForm.currentPage = 1;
      this.getAllocationBills();
    },
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getAllocationBills();
    },
    // 导出
    submitExportForm() {
      this.exportStep = "loading";
      this.exportPercentage = 50;
      if (this.exportForm.date == null) this.exportForm.date = [];
      if (this.exportForm.deptId == null) this.exportForm.deptId = [];
      update({
        func: "U0034",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          staffId: this.exportForm.staffId.join(","),
          deptId: this.exportForm.deptId.join(","),
          status: this.exportForm.status.join(","),
          date: this.exportForm.date.join(","),
          permissonId: 56,
        },
      })
        .then(({ data }) => {
          this.exportPercentage = 100;
          if (data.code != 0) {
            this.exportStep = "error";
            this.exportErrorContent = data.data;
            return;
          }
          this.exportStep = "success";
          clickDownloadLink(window.$EXCEL_URL + data.data);
        })
        .catch(() => {
          this.exportPercentage = 100;
          this.exportStep = "error";
          this.exportErrorContent = this.$t("h.tips18");
        });
    },
    // 导出dialogClose
    billsExportDialogVisibleClose() {
      this.$refs.exportFormRef.resetFields();
      this.exportPercentage = 0;
      this.exportStep = "";
      this.exportErrorContent = "";
    },
    // 新建转移单据
    newAllocationBills() {
      this.newBillsDialogVisible = true;
    },
    // getMatchEditStaff(_id) {
    //   select({
    //     func: "S0005",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       _id: _id,
    //     },
    //   })
    //     .then(({ data }) => {
    //       if (data.code != 0) return this.$message.error(data.data);
    //       this.staffData = [data.data];
    //     })
    //     .catch(() => {
    //       this.$message.error("服务器网络错误，查询员工失败");
    //     });
    // },
    getMatchEditAssets(ids) {
      this.billAssetsLoading = true;
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // _id: ids,
          item: [{ key: "_id", handle: "OIS", value: ids }],
        },
      })
        .then(({ data }) => {
          this.billAssetsLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.billAssets = data.data;
        })
        .catch(() => {
          this.billAssetsLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 编辑转移单据
    editAlloctionForm() {
      if (
        !this.selectAlloctionBills.length ||
        this.selectAlloctionBills.length > 1
      ) {
        return this.$message.error(this.$t("h.tips110"));
      }
      if (this.selectAlloctionBills[0].status != -1) {
        return this.$message.error(this.$t("h.tips111"));
      }
      // this.getMatchEditStaff(this.selectAlloctionBills[0].staffId);
      this.getMatchEditAssets(this.selectAlloctionBills[0].assetIds);
      this.allocationForm._id = this.selectAlloctionBills[0]._id;
      this.allocationForm.deptId = this.selectAlloctionBills[0].deptId;
      this.allocationForm.staffId = this.selectAlloctionBills[0].staffId;
      this.allocationForm.date = this.selectAlloctionBills[0].date;
      this.allocationForm.num = this.selectAlloctionBills[0].num;
      this.newBillTitle = this.$t("h.title64");
      this.newBillsDialogVisible = true;
    },
    // 创建单据中选择部门后
    deptInput(val) {
      if (!val) return false;
      let matchStaffData = this.staffData.filter((item) => item.deptId == val);
      if (matchStaffData.length) {
        let matchStaff = matchStaffData.find(
          (item) => item._id == this.allocationForm.staffId
        );
        if (!matchStaff) this.allocationForm.staffId = "";
        return;
      } else {
        this.allocationForm.staffId = "";
      }
    },
    // 创建单据中选择员工change
    staffSelectChange(val) {
      if (!val) return false;
      this.allocationForm.deptId = this.staffData.find(
        (item) => item._id == val
      ).deptId;
    },
    // 创建当前选中资产保存
    savaSelectAssets(val) {
      this.billAssets = val;
      this.matchAssetsDialogVisible = false;
    },
    // 单据资产表格中选中
    billAssetsSelectionChange(val) {
      this.selectBillAssets = val;
    },
    // 单据资产表格删除选中
    deleteBillSelectAssets() {
      this.selectBillAssets.forEach((item) => {
        this.billAssets.splice(
          this.billAssets.findIndex((sItem) => sItem._id === item._id),
          1
        );
      });
      this.$refs.billAssetsRef.$refs.dsTableRef.clearSelection();
    },
    // 新建单据/编辑单据弹框开启后
    newBillsDialogOpened() {
      this.$refs.allocationFormRef.clearValidate();
      this.$refs.billAssetsRef.$refs.dsTableRef.clearSelection();
    },
    // 新建单据/编辑单据弹框关闭后
    newBillsDialogClose() {
      this.selectBillAssets = [];
      this.billAssets = [];
      this.allocationForm._id = "";
      this.allocationForm.deptId = "";
      this.allocationForm.staffId = "";
      this.allocationForm.date = getTodayDate();
      this.newBillTitle = this.$t("h.title63");

      this.$refs.billsTableRef.$refs.dsTableRef.clearSelection();
    },
    // 新建单据/编辑单据弹框确认
    sbumitAllocationForm() {
      this.$refs.allocationFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.billAssets.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips112"),
          });
        }
        const LOADING = this.$loading(this.dialogLoading);
        let permissonId = this.allocationForm._id == "" ? 34 : 63;
        let assetIdsArr = [];
        let assetNamesArr = [];
        let assertCodesArr = [];
        this.billAssets.forEach((item) => {
          assetIdsArr.push(item._id);
          assetNamesArr.push(item.name);
          assertCodesArr.push(item.assetCode);
        });
        update({
          func: "U0007",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.allocationForm._id,
            assetIds: assetIdsArr.join(","),
            assetNames: assetNamesArr.join(","),
            assertCodes: assertCodesArr.join(","),
            deptId: this.allocationForm.deptId,
            staffId: this.allocationForm.staffId,
            date: this.allocationForm.date,
            num: this.allocationForm.num,
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getAllocationBills();
          })
          .catch(() => {
            LOADING.close();
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    uploadBillPhoto(row) {
      this.uploadImgLoading = true;
      if (!this.billPhotoFile) {
        this.uploadImgLoading = false;
        return this.$message.error(this.$t("h.tips114"));
      }
      if (row.status != 0) {
        this.uploadImgLoading = false;
        return this.$message.error(this.$t("h.tips115"));
      }
      update({
        func: "U0062",
        token: this.userInfo.token,
        userId: this.userInfo._id,
        requstData: {
          id: row._id,
          type: row.roleRule.slice(0, 2),
          image: this.billPhotoFile,
          permissonId: 28,
        },
      })
        .then(({ data }) => {
          this.uploadImgLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.$message.success(data.data);
          this.$refs[`uploadPopoverRef-${row._id}`].doClose();
          this.getAllocationBills();
        })
        .catch(() => {
          this.uploadImgLoading = false;
          return this.$message.error(this.$t("h.tips18"));
        });
    },
    billPopAsterLeave() {
      this.billPhotoFile = "";
    },
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    deleteAllocationBills() {
      if (this.selectAlloctionBills.length == 0) {
        return this.$message.error(this.$t("h.tips22"));
      } else {
        for (let i = 0; i < this.selectAlloctionBills.length; i++) {
          if (this.selectAlloctionBills[i].status != -1) {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message: this.$t("h.tips116"),
            });
          }
        }
      }
      this.$confirm(this.$t("h.tips117"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          this.tableLoading = true;
          this.deleteErrorData = [];
          this.multiDeleteBill(0);
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    multiDeleteBill(index) {
      if (index > this.selectAlloctionBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getAllocationBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips118"));
        }
        return;
      }
      deleteData({
        func: "D0012",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectAlloctionBills[index]._id,
          permissonId: 35,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              roleRule: this.selectAlloctionBills[index].roleRule,
              assetNames: this.selectAlloctionBills[index].assetNames,
              reason: data.data,
            });
          }
          this.multiDeleteBill(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            roleRule: this.selectAlloctionBills[index].roleRule,
            assetNames: this.selectAlloctionBills[index].assetNames,
            reason: this.$t("h.tips18"),
          });
          this.multiDeleteBill(++index);
        });
    },
    openPrintSet() {
      this.$refs["vptRef"].printTempDialogVisible = true;
    },
    getBillPrintTemplate() {
      select({
        func: "S0034",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          type: "ZY",
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.billPrintTemplate = data.data;
          this.allocationTemplateId = localStorage.getItem(
            "allocationTemplateId"
          );
          if (
            !this.billPrintTemplate.some(
              (item) => item._id == this.allocationTemplateId
            )
          ) {
            this.allocationTemplateId = this.billPrintTemplate[0]._id;
            localStorage.setItem(
              "allocationTemplateId",
              this.allocationTemplateId
            );
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips119"));
        });
    },
    setBillPrintTemplate(id) {
      this.allocationTemplateId = id;
      window.localStorage.setItem("allocationTemplateId", id);
    },
    goPrintBills() {
      if (this.selectAlloctionBills.length == 0)
        return this.$message.error(this.$t("h.tips121"));
      if (this.selectAlloctionBills.length > 10)
        return this.$message.error(
          this.$t("h.tips122") + 10 + this.$t("h.tips123")
        );
      this.$refs["vpdRef"].voucherPrintDialogVisible = true;
    },
    selectPrintAssets(val) {
      this.printAssets = val;
    },
    printBillAssets() {
      if (this.billDetaulVal.status != 0) {
        return this.$message.error(this.$t("h.tips115"));
      }
      if (!this.printAssets.length) {
        return this.$message.error(this.$t("h.tips124"));
      }
      this.$refs.apdRef.dialogVisible = true;
    },
  },
  created() {
    this.getAllocationBills();
    this.getDeptData();
    this.getBillPrintTemplate();
  },
};
</script>
<style lang="scss" scoped>
.allocation {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .allocation-card {
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
.allocation-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.allocation-card-content {
  height: 100%;
  .bills-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .bills-table {
    height: calc(100% - 75px);
  }
  .bills-pagination {
    height: 40px;
  }
}
.new-bill-dialog {
  .title {
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #000;
    border-left: 4px solid #588ab9;
  }
  .bill-table {
    margin-top: 10px;
    height: 750px;
  }
}
.popover-cotent {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
