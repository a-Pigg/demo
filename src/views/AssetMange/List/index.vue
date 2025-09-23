<template>
  <div class="asset-list">
    <el-card class="asset-list-card">
      <!-- 卡片头部 -->
      <div slot="header" class="asset-card-header">
        <ds-query-form>
          <!-- 按钮区域 -->
          <ds-query-form-left-panel>
            <el-button type="primary" size="small" @click="newAssetForm">{{
              $t("h.newBtn")
            }}</el-button>
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editAssetForm">
                  {{ $t("h.changeBtn") }}</el-dropdown-item
                >
                <el-dropdown-item @click.native="batchEditAssets">{{
                  $t("h.batchChangeBtn")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="deleteAssets">{{
                  $t("h.delBtn")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.importAndExportBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openBulkImportDialog">
                  {{ $t("h.batchImportBtn") }}</el-dropdown-item
                >
                <el-dropdown-item @click.native="openCheckImportDialog">
                  {{ $t("h.importHistory") }}</el-dropdown-item
                >
                <el-dropdown-item @click.native="openExportAssetDialog">
                  {{ $t("h.exportAssetsBtn") }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.printBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="printAssetLabels">
                  {{ $t("h.printLabelBtn") }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="info" size="small" @click="checkPrintDetail">{{
              $t("h.printDetailsBtn")
            }}</el-button>
            <!-- <el-button @click="printDialogVisible = true">1231</el-button> -->
            <!-- <el-button @click="staffDialogVisible = true">测试</el-button> -->
          </ds-query-form-left-panel>
          <!-- 搜索区域 -->
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="findAssetSearch"
            ></ds-search-btn>
            <!-- <search :value.sync="andLike" @search="findAssetSearch"></search> -->
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <!-- 卡片主体 -->
      <div class="asset-card-content">
        <!-- 筛选区域 -->
        <div class="asset-filter">
          <ds-filter-tag
            :filterTagsData="highFilterTags"
            @handleCloseTag="handleCloseFilterTag"
          ></ds-filter-tag>
          <div class="check-scrap">
            <el-checkbox
              v-model="scrapValue"
              true-label="0,1,2,3,5"
              false-label="0,1,2,3,4,5"
              @change="onChangeAssets"
              >{{ $t("h.hideScrapBtn") }}</el-checkbox
            >
          </div>
          <ds-form-head-drawer
            @updateTable="updateTable"
            @updateHighFilter="updateHighFilter"
          ></ds-form-head-drawer>
          <ds-card-management-btn
            @updateTable="updateTable"
          ></ds-card-management-btn>
          <el-button
            class="advanced-filter-btn"
            type="text"
            size="small"
            @click="filterDrawerVisible = true"
            >{{ $t("h.advancedBtn") }}</el-button
          >
        </div>
        <!-- 表格主体 -->
        <div class="asset-table">
          <ds-table
            ref="tableRef"
            :loading="tableLoading"
            :tableData="assetTableData"
            :columns="columns"
            :tableConfig="assetTableConfig"
            :rowKey="(row) => row._id"
            @handleSelectionChange="handleSelectionChange"
            @checkTableRowDetail="checkTableRowDetail"
          >
            <template slot="file" slot-scope="{ scope }">
              <el-popover
                v-if="scope.row.file != null && scope.row.file.length != 0"
                placement="top-start"
              >
                <div
                  class="file_download"
                  v-for="(item, index) in scope.row.file"
                  :key="index"
                >
                  <a :href="item.base64" :download="item.name">{{
                    item.name
                  }}</a>
                </div>
                <el-button slot="reference" size="mini" type="text">{{
                  $t("h.viewAttachments")
                }}</el-button>
              </el-popover>
              <span v-else>{{ $t("h.tableTips2") }}</span>
            </template>
          </ds-table>
        </div>
        <!-- 分页区域 -->
        <div class="asset-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getAssetData"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <!-- 筛选抽屉 -->
    <ds-filter-drawer
      :filterDrawerVisible.sync="filterDrawerVisible"
      @submitFilterForm="submitFilterForm"
      @resetFilterForm="resetFilterForm"
    >
      <el-form ref="filterFormRef" label-width="105px" label-position="left">
        <el-form-item
          v-for="item in highFilterArr"
          :key="item.id"
          :label="item.label"
          :prop="item.attr"
        >
          <el-select
            v-if="
              item.attr == 'assetCode' ||
              item.attr == 'name' ||
              item.attr == 'model' ||
              item.attr == 'snNumber' ||
              item.attr == 'unit' ||
              item.attr == 'money' ||
              item.attr == 'printSize'
            "
            v-model="filterForm[item.index].handle"
            style="width: 120px"
            :placeholder="$t('h.tips4') + $t('h.criteria')"
            clearable
            filterable
          >
            <el-option
              v-for="item in filterCondtionData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            style="margin-left: 5px; width: 274px"
            v-if="
              item.attr == 'assetCode' ||
              item.attr == 'name' ||
              item.attr == 'model' ||
              item.attr == 'snNumber' ||
              item.attr == 'unit' ||
              item.attr == 'money' ||
              item.attr == 'printSize'
            "
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips3') + item.label"
          ></el-input>
          <el-select
            v-if="item.attr == 'state'"
            v-model="filterForm[item.index].value"
            multiple
            :placeholder="$t('h.tips4')"
            clearable
            filterable
            collapse-tags
          >
            <el-option
              v-for="item in stateListData"
              :key="item._id"
              :label="item.label"
              :value="item._id"
            ></el-option>
          </el-select>
          <el-select
            v-if="item.attr == 'source'"
            v-model="filterForm[item.index].value"
            multiple
            :placeholder="$t('h.tips4')"
            clearable
            filterable
            collapse-tags
          >
            <el-option
              v-for="item in sourceListData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <ds-select-tree
            v-if="item.attr == 'deptId'"
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips4') + item.label"
            :treeData="deptTreeData"
            :defaultProps="{
              children: 'children',
              label: 'deptName',
              value: '_id',
            }"
            :checkStrictly="true"
            :multiple="true"
            collapseTags
          >
          </ds-select-tree>
          <ds-select-tree
            v-if="item.attr == 'classifyId'"
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips4') + item.label"
            :treeData="assetTypeData"
            :defaultProps="{
              children: 'children',
              label: 'classifyName',
              value: '_id',
            }"
            :collapseTags="true"
            :checkStrictly="true"
            :multiple="true"
          >
          </ds-select-tree>
          <el-date-picker
            v-if="
              item.attr == 'inData' ||
              item.attr == 'useDate' ||
              item.attr == 'maintainLast'
            "
            value-format="yyyy-MM-dd"
            v-model="filterForm[item.index].value"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
          <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
          <el-select
            v-if="item.attr == 'goodsId'"
            v-model="filterForm[item.index].value"
            multiple
            :placeholder="$t('h.tips4') + item.label"
            clearable
            filterable
          >
            <el-option
              v-for="(item, i) in assetAttrData"
              :key="i"
              :label="item.name"
              :value="item.goodsqId"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.attr == 'warehouseId'"
            ref="filterWareSelectRef"
            v-model="filterForm[item.index].value"
            multiple
            :placeholder="$t('h.tips4') + item.label"
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: assetAreaData,
              modelField: '_id',
              searchField: 'andLike',
              func: 'S0003',
              userInfo: userInfo,
            }"
          >
            <!-- model: filterForm[item.index].value, -->
            <el-option
              v-for="item in assetAreaData"
              :key="item._id"
              :label="item.warehouseName"
              :value="item._id"
            >
              <span>{{ item.code }} - {{ item.warehouseName }}</span>
            </el-option>
          </el-select>
          <el-select
            v-if="item.attr == 'responsibleId' || item.attr == 'staffId'"
            :ref="'filter' + item.attr + 'SelectRef'"
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips4') + item.label"
            clearable
            multiple
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: staffData,
              modelField: '_id',
              searchField: 'andLike',
              func: 'S0005',
              userInfo: userInfo,
            }"
          >
            <!-- model: filterForm[item.index].value, -->
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
          <el-input
            v-if="
              item.attr != 'responsibleId' &&
              item.attr != 'staffId' &&
              item.attr != 'deptId' &&
              item.attr != 'classifyId' &&
              item.attr != 'warehouseId' &&
              item.attr != 'inData' &&
              item.attr != 'source' &&
              item.attr != 'state' &&
              item.attr != 'useDate' &&
              item.attr != 'goodsId' &&
              item.attr != 'assetCode' &&
              item.attr != 'name' &&
              item.attr != 'model' &&
              item.attr != 'snNumber' &&
              item.attr != 'unit' &&
              item.attr != 'money' &&
              item.attr != 'printSize' &&
              item.attr != 'maintainLast'
            "
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips3') + item.label"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-popover
        placement="left-end"
        trigger="click"
        slot="set"
        ref="highSetPopverRef"
      >
        <div class="dropdown-menu">
          <span class="title">{{ $t("h.title03") }}</span>
          <div class="dropdown-menu-item">
            <el-switch
              v-for="item in listFilterSetData"
              :key="item.id"
              :active-text="item.label"
              v-model="item.hightFilter"
              active-color="#78A1C7"
              inactive-color="#C0CCDA"
            ></el-switch>
          </div>
          <div class="btn">
            <el-button
              class="svae-btn"
              type="primary"
              size="small"
              @click="saveHightFilter"
              >{{ $t("h.saveBtn") }}</el-button
            >
          </div>
        </div>
        <el-button
          slot="reference"
          type="text"
          size="small"
          style="margin-right: 10px"
          >{{ $t("h.setBtn") }}</el-button
        >
      </el-popover>
    </ds-filter-drawer>
    <!-- 选择员工弹框 -->
    <!-- <ds-select-staff-dialog
      :staffDialogVisible.sync="staffDialogVisible"
      :deptTreeData="deptTreeData"
      multiple
    ></ds-select-staff-dialog> -->
    <!-- 新增/编码资产 -->
    <new-asset-dialog
      :newDialogVisible.sync="newDialogVisible"
      :title="newDialogTitle"
      :typeData="assetTypeData"
      :attrData="assetAttrData"
      :deptData="deptTreeData"
      :selectAssetForm="selectAssetsData[0]"
      @refreshAssets="refreshAssets"
    ></new-asset-dialog>
    <!-- 删除资产失败 -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <!-- 资产详情 -->
    <asset-detail-dialog
      :detailDialogVisible.sync="detailDialogVisible"
      :assetDetailData="assetDetailData"
    ></asset-detail-dialog>
    <!-- 批量导入资产 -->
    <bulk-import-assets
      :bulkDialogVisible.sync="bulkDialogVisible"
      @updataAsset="importEndUpdate"
    ></bulk-import-assets>
    <!-- 查看导入记录 -->
    <check-import-history
      :checkImportDialogVisible.sync="checkImportDialogVisible"
      :columns="columns"
      @refreshAssets="resetAssetImport"
    ></check-import-history>
    <!-- 导出资产 -->
    <asset-export-dialog
      :exportDialogVisible.sync="exportDialogVisible"
      :typeData="assetTypeData"
    ></asset-export-dialog>
    <!-- 查看打印详情 -->
    <asset-print-detail
      :printDetailDialogVisible.sync="printDetailDialogVisible"
    ></asset-print-detail>
    <!-- 打印 -->
    <asset-print-dialog
      ref="apdRef"
      :userInfo="userInfo"
      :selectAssetsData="selectAssetsData"
      @refreshAssets="getAssetData"
    ></asset-print-dialog>
    <!-- 打印2 -->
    <!-- <asset-print-dialog2
      :visible.sync="printDialogVisible"
    ></asset-print-dialog2> -->
    <!-- 批量修改资产信息 -->
    <new-bills-dialog
      class="batch-edit-dialog" 
      contentWidth="95%"
      :title="$t('h.title11')"
      destroyOnClose
      :newBillsDialogVisible.sync="batchEditDialogVisible"
      @opened="batchEditDialogVisibleOpened"
      @close="batchEditDialogVisibleClose"
      @sbumitForm="sbumitAssets"
    >
      <template slot="btns">
        <div>
          <span class="title">{{ $t("h.title17") }}</span>
        </div>
      </template>
      <template slot="table">
        <div class="bill-table">
          <batch-edit-assets
            :columns="editColumns"
            :data="editAssets"
            :treeDepts="deptTreeData"
            :depts="deptData"
            :treeAssetTypes="assetTypeData"
            :assetTypes="typeData"
            :attrData="assetAttrData"
          ></batch-edit-assets>
        </div>
      </template>
    </new-bills-dialog>
  </div>
</template>
<script>
import { select, printGet, deleteData, update } from "@/assets/api";
import { mapState } from "vuex";
import {
  sourceListData,
  deleteAssetErrorColumns,
  filterCondtionData,
} from "@/utils/systemData";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import {
  clickDownloadLink,
  countTableHeaderWidth,
} from "@/utils/basic-methods";
import AssetPrintDialog from "@/components/ListComponents/AssetPrintDialog";
// import AssetPrintDialog2 from "@/components/ListComponents/AssetPrintDialog2";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import DsSelectTree from "@/components/DsSelectTree";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsCardManagementBtn from "@/components/DsCardManagementBtn";
import DsFormHeadDrawer from "@/components/DsFormHeadDrawer";
import DsFilterDrawer from "@/components/DsFilterDrawer";
// import DsSelectStaffDialog from "@/components/DsSelectStaffDialog";
import DsFilterTag from "@/components/DsFilterTag";
import NewAssetDialog from "@/components/ListComponents/NewAssetDialog";
import AssetDetailDialog from "@/components/ListComponents/AssetDetailDialog";
import AssetPrintDetail from "@/components/ListComponents/AssetPrintDetail";
import CheckImportHistory from "@/components/ListComponents/CheckImportHistory";
import AssetExportDialog from "@/components/ListComponents/AssetExportDialog";
import BulkImportAssets from "@/components/ListComponents/BulkImportAssets";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import BatchEditAssets from "@/components/ListComponents/BatchEditAssets";
import Search from "@/components/ListComponents/Search";
import deepCopy from "@/utils/deepCopy";
export default {
  components: {
    // AssetPrintDialog2,
    Search,
    NewBillsDialog,
    BatchEditAssets,
    AssetPrintDialog,
    DsDeleteDetail,
    BulkImportAssets,
    AssetExportDialog,
    CheckImportHistory,
    AssetPrintDetail,
    NewAssetDialog,
    AssetDetailDialog,
    DsSelectTree,
    DsTable,
    DsPagination,
    DsSearchBtn,
    DsQueryForm,
    DsCardManagementBtn,
    DsFormHeadDrawer,
    DsFilterDrawer,
    DsFilterTag,
    // DsSelectStaffDialog,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      tableLoading: false,
      assetTableData: [],
      selectAssetsData: [],
      assetTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      andLike: "",
      maintainLast: false,
      filterDrawerVisible: false,
      filterForm: [
        // { key: "responsibleId", handle: "OIS", value: null },
        // { key: "staffId", handle: "OIS", value: null },
        // { key: "deptId", handle: "OIS", value: null },
        // { key: "classifyId", handle: "OIS", value: null },
        // { key: "warehouseId", handle: "OIS", value: null },
        // { key: "inData", handle: "OIS", value: null },
        // { key: "source", handle: "OIS", value: null },
        // { key: "state", handle: "OIS", value: null },
        // { key: "useDate", handle: "OIS", value: null },
        // { key: "goodsId", handle: "OIS", value: null },
        // { key: "assetCode", handle: "ANDLIKE", value: null },
        // { key: "name", handle: "ANDLIKE", value: null },
        // { key: "model", handle: "ANDLIKE", value: null },
        // { key: "snNumber", handle: "ANDLIKE", value: null },
        // { key: "unit", handle: "ANDLIKE", value: null },
        // { key: "money", handle: "ANDLIKE", value: null },
      ],
      scrapValue: "0,1,2,3,5",
      highFilterTags: [],
      sourceListData: sourceListData,
      assetTypeData: [],
      typeData: [],
      assetAttrData: [],
      assetAreaData: [],
      deptTreeData: [],
      deptData: [],
      staffData: [],
      // staffDialogVisible: false,
      selectLoading: false,
      newDialogVisible: false,
      newDialogTitle: this.$t("h.title10"),
      detailDialogVisible: false,
      assetDetailData: null,
      printDetailDialogVisible: false,
      checkImportDialogVisible: false,
      exportDialogVisible: false,
      bulkDialogVisible: false,
      deleteDialogVisible: false,
      deleteColumns: deleteAssetErrorColumns,
      deleteErrorData: [],
      batchEditDialogVisible: false,
      editAssets: [],
      batchEditLoading: {
        target: ".batch-edit-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      filterCondtionData: filterCondtionData,
      printDialogVisible: false,
      // printDialogVisible: false,
      // 测试数据
      // areas: [],
      listFilterSetData: [], // 高级筛选列渲染
    };
  },
  computed: {
    ...mapState([
      "userInfo",
      "maxLimit",
      "assetTableHeader",
      "assetFormHeader",
      "stateListData",
    ]),
    columns() {
      let columns = [];
      this.assetTableHeader.forEach((item) => {
        if (item.show) {
          if (item.attr == "photo") {
            columns.push({
              type: "image",
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
            });
          } else if (item.attr == "goalQuota") {
            columns.push({
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
              showOverflowTooltip: true,
              formatter: (row) => {
                return row[item.attr] * 100 + "%";
              },
            });
          } else if (item.attr == "file") {
            columns.push({
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
              slotName: "file",
            });
          } else if (item.attr == "assetCode") {
            columns.push({
              type: "detail",
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
              showOverflowTooltip: true,
            });
          } else if (item.attr == "state") {
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
          } else {
            columns.push({
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
              showOverflowTooltip: true,
            });
          }
        }
      });
      columns.push({
        prop: "printSize",
        label: this.$t("h.title57"),
        fixed: "right",
        showOverflowTooltip: true,
        width: countTableHeaderWidth(this.$t("h.title57")),
      });
      return columns;
    },
    editColumns() {
      let notNullColumns = [];
      let columns = [];
      this.assetFormHeader.forEach((item) => {
        if (
          item.dbDataName != "state" &&
          item.dbDataName != "remainLift" &&
          item.dbDataName != "workLife" &&
          item.dbDataName != "netValue" &&
          item.dbDataName != "depreciationMoney" &&
          item.dbDataName != "accuDepreciation" &&
          item.dbDataName != "num" &&
          item.dbDataName != "operator"
        ) {
          if (item.notNull && item.dbDataName != "assetCode") {
            if (
              item.dbDataName == "inData" ||
              item.dbDataName == "useDate" ||
              item.dbDataName == "maintainLast"
            ) {
              notNullColumns.push({
                label: "*" + item.nameShow,
                prop: item.dbDataName,
                minWidth: countTableHeaderWidth(item.nameShow),
                width: "245px",
                class: "notNull",
              });
            } else {
              notNullColumns.push({
                label: "*" + item.nameShow,
                prop: item.dbDataName,
                width: countTableHeaderWidth(item.nameShow),
                class: "notNull",
              });
            }
          } else {
            if (
              item.dbDataName == "inData" ||
              item.dbDataName == "useDate" ||
              item.dbDataName == "inData"
            ) {
              columns.push({
                label: item.nameShow,
                prop: item.dbDataName,
                minWidth: countTableHeaderWidth(item.nameShow),
                width: "245px",
              });
            } else if (item.dbDataName == "file") {
              columns.push({
                label: item.nameShow,
                prop: item.dbDataName,
                minWidth: countTableHeaderWidth(item.nameShow),
                width: "240px",
              });
            } else {
              columns.push({
                label: item.nameShow,
                prop: item.dbDataName,
                width: countTableHeaderWidth(item.nameShow),
              });
            }
          }
        }
      });
      return [...notNullColumns, ...columns];
    },
    filterFormHead() {
      let tempArray = [];
      this.assetFormHeader.forEach((item) => {
        let tempObj = {};
        if (item.dbDataName == "responsible") {
          tempObj.prop = "responsibleId";
          tempObj.label = item.nameShow;
          tempObj.index = 0;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "operator") {
          tempObj.prop = "staffId";
          tempObj.label = item.nameShow;
          tempObj.index = 1;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "useDept") {
          tempObj.prop = "deptId";
          tempObj.label = item.nameShow;
          tempObj.index = 2;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "type") {
          tempObj.prop = "classifyId";
          tempObj.label = item.nameShow;
          tempObj.index = 3;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "assertPosition") {
          tempObj.prop = "warehouseId";
          tempObj.label = item.nameShow;
          tempObj.index = 4;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "inData") {
          tempObj.prop = "inData";
          tempObj.label = item.nameShow;
          tempObj.index = 5;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "source") {
          tempObj.prop = "source";
          tempObj.label = item.nameShow;
          tempObj.index = 6;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "state") {
          tempObj.prop = "state";
          tempObj.label = item.nameShow;
          tempObj.index = 7;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "useDate") {
          tempObj.prop = "useDate";
          tempObj.label = item.nameShow;
          tempObj.index = 8;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "goodsName") {
          tempObj.prop = "goodsId";
          tempObj.label = item.nameShow;
          tempObj.index = 9;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "assetCode") {
          tempObj.prop = "assetCode";
          tempObj.label = item.nameShow;
          tempObj.index = 10;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "name") {
          tempObj.prop = "name";
          tempObj.label = item.nameShow;
          tempObj.index = 11;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "model") {
          tempObj.prop = "model";
          tempObj.label = item.nameShow;
          tempObj.index = 12;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "snNumber") {
          tempObj.prop = "snNumber";
          tempObj.label = item.nameShow;
          tempObj.index = 13;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "unit") {
          tempObj.prop = "unit";
          tempObj.label = item.nameShow;
          tempObj.index = 14;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "money") {
          tempObj.prop = "money";
          tempObj.label = item.nameShow;
          tempObj.index = 15;
          tempArray.push(tempObj);
        }
      });
      return tempArray;
    },
    highFilterArr() {
      //form渲染
      let arr = this.listFilterSetData.filter((e) => {
        return e.hightFilter;
      });
      this.filterForm = [];
      arr.forEach((e, index) => {
        e.index = index;
        // 状态 类别 购入日期 来源方式 放置区域 资产属性 使用日期 使用人 操办人 使用部门
        if (
          e.attr == "state" ||
          e.attr == "classifyId" ||
          // e.attr == "inData" ||
          e.attr == "source" ||
          e.attr == "warehouseId" ||
          e.attr == "goodsId" ||
          // e.attr == "useDate" ||
          e.attr == "responsibleId" ||
          e.attr == "staffId" ||
          e.attr == "deptId"
          // e.attr == "money"
        ) {
          this.filterForm.push({
            key: e.attr,
            handle: "OIS",
            value: null,
          });
        } else if (
          e.attr == "assetCode" ||
          e.attr == "name" ||
          e.attr == "model" ||
          e.attr == "snNumber" ||
          e.attr == "unit" ||
          e.attr == "money" ||
          e.attr == "printSize"
        ) {
          this.filterForm.push({
            key: e.attr,
            handle: "IS",
            value: null,
          });
        } else if (e.attr.length == 32) {
          this.filterForm.push({
            key: e.attr,
            handle: "ANDLIKE",
            value: null,
          });
        } else {
          this.filterForm.push({
            key: e.attr,
            handle: "IS",
            value: null,
          });
        }
      });
      return arr;
    },
  },
  methods: {
    // 获取资产分类
    async getAssetType() {
      const { data: res } = await select({
        func: "S0006",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      });
      if (res.code != 0) return this.$message.error(res.data);
      this.assetTypeData = transListDataToTreeData(res.data, null);
      this.typeData = res.data;
      // this.areas = transListDataToTreeData(areaData, null);
      // console.log("this.areas>>>>", this.areas);
    },
    // 搜索获取资产区域
    // async wareRemoteMethod(andLike) {
    //   if (!andLike) {
    //     this.assetAreaData = [];
    //     return;
    //   }
    //   const { data: res } = await select({
    //     func: "S0003",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       andLike: andLike,
    //     },
    //   });
    //   if (res.code != 0) return this.$message.error(res.data);
    //   this.assetAreaData = res.data;
    // },
    // 获取资产属性
    async getAssetAttr() {
      const { data: res } = await select({
        func: "S0022",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      });
      if (res.code != 0) return this.$message.error(res.data);
      this.assetAttrData = res.data;
    },
    // 获取部门
    async getDeptData() {
      const { data: res } = await select({
        func: "S0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      });
      if (res.code != 0) return this.$message.error(res.data);
      this.deptData = res.data;
      this.deptTreeData = transListDataToTreeData(res.data, null);
    },
    // 获取资产数据
    getAssetData() {
      this.tableLoading = true;
      let tempFilterArr = deepCopy(this.filterForm);
      let item = tempFilterArr.filter((e) => {
        let eType = typeof e.value;
        if (eType == "string" && e.value) {
          return e;
        } else if (e.value != null && eType == "object" && e.value.length) {
          return e;
        }
      });
      let dateDel = [];
      let dateAdd = [];
      item.forEach((e, index) => {
        if (e.key.length == 32) {
          e.key = "jsons." + e.key;
        }
        if (
          typeof e.value == "object" &&
          e.key != "inData" &&
          e.key != "maintainLast" &&
          e.key != "useDate"
        ) {
          e.value = e.value.join(",");
        }
        if (
          e.key == "inData" ||
          e.key == "maintainLast" ||
          e.key == "useDate"
        ) {
          dateAdd.push({
            handle: "ANDGTE",
            key: e.key,
            value: e.value[0],
          });
          dateAdd.push({
            handle: "ANDLTE",
            key: e.key,
            value: e.value[1],
          });
          dateDel.unshift(index);
        }
      });
      if (dateDel.length) {
        dateDel.forEach((e) => {
          item.splice(e, 1);
        });
        item = [...item, ...dateAdd];
      }
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // 分页条件
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          // 搜索框条件
          andLike: this.andLike,
          //部门可见 这个要 但是只要有这个就ok了
          deptFalg: true,
          // 高级筛选条件
          item: item,
          state: this.scrapValue,
          //查询维保到期资产
          maintainLast: this.maintainLast == true ? 1 : "",
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.assetTableData = this.setTableCostomKey(data.data[1]);
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 是否显示报废资产
    onChangeAssets() {
      this.paginationForm.currentPage = 1;
      this.getAssetData();
    },
    // 获取驱动版本
    getRfidVersion() {
      return new Promise((resolve, reject) => {
        printGet({ code: 4, param: 4 })
          .then(({ data }) => {
            let { service_version } = data;
            service_version = service_version.split(".", 3);
            service_version[1] =
              service_version[1] < 10
                ? "0" + service_version[1]
                : service_version[1];
            service_version[2] =
              service_version[2] < 10
                ? "0" + service_version[2]
                : service_version[2];
            resolve(Number(service_version.join("")));
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    refreshAssets() {
      this.$refs["tableRef"].$refs["dsTableRef"].clearSelection();
      this.getAssetData();
    },
    // 模糊查询
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getAssetData();
    },
    // 映射高级筛选字段
    mapHighFilterTags() {
      this.highFilterTags = [];
      let tempFilterArr = deepCopy(this.filterForm);
      let item = tempFilterArr.filter((e) => {
        let eType = typeof e.value;
        if (eType == "string" && e.value) {
          return e;
        } else if (e.value != null && eType == "object" && e.value.length) {
          return e;
        }
      });
      item.forEach((e) => {
        if (e.key == "warehouseId") {
          let highFilteritem = {};
          let labels = [];
          this.$refs.filterWareSelectRef[0].selected.forEach((item) => {
            labels.push(item.label);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "assertPosition"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "responsibleId") {
          let highFilteritem = {};
          let labels = [];
          this.$refs.filterresponsibleIdSelectRef[0].selected.forEach(
            (item) => {
              labels.push(item.label);
            }
          );
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "responsible"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "staffId") {
          let highFilteritem = {};
          let labels = [];
          this.$refs.filterstaffIdSelectRef[0].selected.forEach((item) => {
            labels.push(item.label);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "operator"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "deptId") {
          let highFilteritem = {};
          let labels = [];
          e.value.forEach((item) => {
            let deptName = this.deptData.find((deptItem) => {
              return deptItem._id == item;
            }).deptName;
            labels.push(deptName);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "useDept"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "source") {
          let highFilteritem = {};
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "source"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "goodsId") {
          let highFilteritem = {};
          let labels = [];
          e.value.forEach((item) => {
            let goodName = this.assetAttrData.find((goodItem) => {
              return goodItem.goodsqId == item;
            }).name;
            labels.push(goodName);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "goodsName"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "classifyId") {
          let highFilteritem = {};
          let labels = [];
          e.value.forEach((item) => {
            let typeName = this.typeData.find((typeItem) => {
              return typeItem._id == item;
            }).classifyName;
            labels.push(typeName);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "type"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "inData") {
          let highFilteritem = {};
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "inData"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value.join(this.$t('h.to'));
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "useDate") {
          let highFilteritem = {};
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "useDate"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value.join(this.$t('h.to'));
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "state") {
          let highFilteritem = {};
          let labels = [];
          e.value.forEach((item) => {
            let stateName = this.stateListData.find((stateItem) => {
              return stateItem._id == item;
            }).label;
            labels.push(stateName);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "state"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "printSize") {
          let highFilteritem = {};
          highFilteritem.name = this.$t("h.title57");
          highFilteritem.keyStr = e.key;
          let handle = this.filterCondtionData.find((el) => {
            return el.value == e.handle;
          }).label;
          highFilteritem.value = handle + e.value;
          this.highFilterTags.push(highFilteritem);
        } else {
          let highFilteritem = {};
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == e.key
          ).nameShow;
          highFilteritem.keyStr = e.key;
          let handle = this.filterCondtionData.find((el) => {
            return el.value == e.handle;
          }).label;
          highFilteritem.value = handle + e.value;
          this.highFilterTags.push(highFilteritem);
        }
      });
      if (this.maintainLast) {
        let highFilteritem = {};
        highFilteritem.name = this.$t("h.maintenanceExpiredAssets");
        highFilteritem.keyStr = "maintainLastFlag";
        // highFilteritem.value = "是";
        highFilteritem.value = this.$t("h.tips73");
        this.highFilterTags.push(highFilteritem);
      }
    },
    // 高级筛选点击tag
    handleCloseFilterTag(val) {
      console.log(val);
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      if (val.keyStr == "maintainLastFlag") {
        this.maintainLast = false;
      } else {
        this.filterForm.forEach((e) => {
          if (e.key == val.keyStr) e.value = null;
        });
      }
      this.paginationForm.currentPage = 1;
      this.getAssetData();
    },
    // 高级筛选
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAssetData();
    },
    // 重置高级筛选
    resetFilterForm() {
      this.filterForm.forEach((e) => {
        e.value = null;
        if (
          e.key == "state" ||
          e.key == "classifyId" ||
          e.key == "source" ||
          e.key == "warehouseId" ||
          e.key == "goodsId" ||
          e.key == "responsibleId" ||
          e.key == "staffId" ||
          e.key == "deptId"
        ) {
          e.handle = "OIS";
        } else if (
          e.key == "assetCode" ||
          e.key == "name" ||
          e.key == "model" ||
          e.key == "snNumber" ||
          e.key == "unit" ||
          e.key == "money" ||
          e.key == "printSize"
        ) {
          e.handle = "IS";
        } else if (e.key.length == 32) {
          e.handle = "ANDLIKE";
        } else {
          e.handle = "IS";
        }
      });
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAssetData();
    },
    // // 员工搜索框模糊搜索
    // async staffRemoteMethod(query) {
    //   if (!query) {
    //     this.staffData = [];
    //     return;
    //   }
    //   this.selectLoading = true;
    //   const { data: res } = await select({
    //     func: "S0005",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       andLike: query,
    //     },
    //   });
    //   this.selectLoading = false;
    //   if (res.code != 0) return this.$message.error(res.data);
    //   this.staffData = res.data;
    // },
    // 资产表格选中
    handleSelectionChange(val) {
      this.selectAssetsData = val;
    },
    newAssetForm() {
      this.newDialogTitle = this.$t("h.title09");
      this.newDialogVisible = true;
    },
    editAssetForm() {
      if (!this.selectAssetsData.length || this.selectAssetsData.length > 1) {
        return this.$message.error(this.$t("h.tips22"));
      }
      this.newDialogTitle = this.$t("h.title10");
      this.newDialogVisible = true;
    },
    // 处理表头自定义字段
    setTableCostomKey(array) {
      array.forEach((item) => {
        for (let key in item["jsons"]) {
          item[key] = item["jsons"][key];
        }
        item.company = window.sessionStorage.getItem("loginCompanyName");
      });
      return array;
    },
    // 查看资产详情
    checkTableRowDetail(val) {
      this.assetDetailData = val;
      this.detailDialogVisible = true;
    },
    // 查看打印详情
    checkPrintDetail() {
      this.printDetailDialogVisible = true;
    },
    // 查看导入历史记录
    openCheckImportDialog() {
      this.checkImportDialogVisible = true;
    },
    //撤销导入之前重新拉取资产
    resetAssetImport() {
      this.paginationForm.currentPage = 1;
      this.getAssetData();
    },
    // 打开导出资产弹窗
    openExportAssetDialog() {
      this.getRfidVersion()
        .then(async (res) => {
          if (res < 20101) {
            const driveURL =
              `https://asset.dascomyun.com/websocket/upload/${this.$t("h.assetTemplate6")}.msi`;
            const result = await this.$confirm(
              this.$t("h.tips31"),
              this.$t("h.title18"),
              {
                confirmButtonText: this.$t("h.confirmBtn"),
                cancelButtonText: this.$t("h.cancelBtn"),
                type: "warning",
              }
            );
            if (result != "confirm")
              return this.$message.info(this.$t("h.tips32"));
            else clickDownloadLink(driveURL, `${this.$t("h.assetTemplate6")}.msi`);
          } else {
            this.exportDialogVisible = true;
          }
        })
        .catch(async () => {
          const driveURL =
            `https://asset.dascomyun.com/websocket/upload/${this.$t("h.assetTemplate6")}.msi`;
          const result = await this.$confirm(
            this.$t("h.tips33"),
            this.$t("h.title18"),
            {
              confirmButtonText: this.$t("h.confirmBtn"),
              cancelButtonText: this.$t("h.cancelBtn"),
              type: "warning",
            }
          ).catch((err) => err);
          if (result != "confirm")
            return this.$message.info(this.$t("h.tips32"));
          else clickDownloadLink(driveURL, `${this.$t("h.assetTemplate6")}.msi`);
        });
    },
    // 打开批量导入
    openBulkImportDialog() {
      this.getRfidVersion()
        .then(async (res) => {
          if (res < 20101) {
            const driveURL =
              `https://asset.dascomyun.com/websocket/upload/${this.$t("h.assetTemplate6")}.msi`;
            const result = await this.$confirm(
              this.$t("h.tips31"),
              this.$t("h.title18"),
              {
                confirmButtonText: this.$t("h.confirmBtn"),
                cancelButtonText: this.$t("h.cancelBtn"),
                type: "warning",
              }
            );
            if (result != "confirm")
              return this.$message.info(this.$t("h.tips32"));
            else clickDownloadLink(driveURL, `${this.$t("h.assetTemplate6")}.msi`);
          } else {
            this.bulkDialogVisible = true;
          }
        })
        .catch(async () => {
          const driveURL =
            `https://asset.dascomyun.com/websocket/upload/${this.$t("h.assetTemplate6")}.msi`;
          const result = await this.$confirm(
            this.$t("h.tips33"),
            this.$t("h.title18"),
            {
              confirmButtonText: this.$t("h.confirmBtn"),
              cancelButtonText: this.$t("h.cancelBtn"),
              type: "warning",
            }
          ).catch((err) => err);
          if (result != "confirm")
            return this.$message.info(this.$t("h.tips32"));
          else clickDownloadLink(driveURL, `${this.$t("h.assetTemplate6")}.msi`);
        });
    },
    importEndUpdate() {
      this.paginationForm.currentPage = 1;
      this.getAssetData();
    },
    // 删除资产
    async deleteAssets() {
      if (!this.selectAssetsData.length) {
        return this.$message.error(this.$t("h.tips22"));
      }
      const confirmResult = await this.$confirm(
        `${this.$t("h.tips27")}${this.selectAssetsData.length}${this.$t(
          "h.tips28"
        )}`,
        this.$t("h.title18"),
        {
          confirmButtonText: this.$t("h.confirmBtn"),
          cancelButtonText: this.$t("h.cancelBtn"),
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info(this.$t("h.tips98"));
      this.tableLoading = true;
      this.deleteErrorData = [];
      this.multipleDeleteAsset(0);
    },
    multipleDeleteAsset(index) {
      if (index > this.selectAssetsData.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getAssetData();
        this.$refs["tableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips30"));
        }
        return;
      }
      deleteData({
        func: "D0006",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectAssetsData[index]._id,
          permissonId: 24,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              code: this.selectAssetsData[index].assetCode,
              name: this.selectAssetsData[index].name,
              reason: data.data,
            });
          }
          this.multipleDeleteAsset(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            code: this.selectAssetsData[index].assetCode,
            name: this.selectAssetsData[index].name,
            reason: this.$t("h.tips18"),
          });
          this.multipleDeleteAsset(++index);
        });
    },
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    // 打印资产标签
    printAssetLabels() {
      if (this.selectAssetsData.length == 0) {
        return this.$message.error(this.$t("h.tips22"));
      } else if (this.maxLimit.assetLabelPrint) {
        if (this.selectAssetsData.length > this.maxLimit.assetLabelPrint)
          return this.$message.error(
            `${this.$t("h.tips44")}${this.maxLimit.assetLabelPrint}${this.$t(
              "h.tips45"
            )}`
          );
      }
      this.$refs.apdRef.dialogVisible = true;
    },
    // 批量修改资产
    batchEditAssets() {
      if (!this.selectAssetsData.length) {
        return this.$message.error(this.$t("h.tips22"));
      }
      this.editAssets = deepCopy(this.selectAssetsData);
      this.editAssets.forEach((item) => {
        if (item["jsons"]) delete item["jsons"];
        if (item["goalQuota"]) item["goalQuota"] = item["goalQuota"] * 100;
      });
      this.batchEditDialogVisible = true;
    },
    batchEditDialogVisibleOpened() {},
    batchEditDialogVisibleClose() {
      this.editAssets = [];
      this.$refs["tableRef"].$refs["dsTableRef"].clearSelection();
    },
    sbumitAssets() {
      // 资产填报未保存
      for (let i = 0; i < this.editAssets.length; i++) {
        if (this.editAssets[i].isSet) {
          return this.$notify.error({
            title: "error",
            message: this.$t("h.tips101"),
          });
        }
      }
      const LOADING = this.$loading(this.batchEditLoading);
      LOADING.close();
      let asset = deepCopy(this.editAssets);
      asset.forEach((el) => {
        delete el.isSet;
        delete el.assertPosition;
        delete el.hierarchy;
        delete el.type;
        delete el.responsible;
        delete el.useDept;
        delete el.goodsName;
        delete el.useDept;
        delete el.operator;
        el.staffId = this.userInfo._id;
        // 自定义字段
        let obj = {};
        for (let key in el) {
          if (key.length == 32 && el[key] != "") {
            obj[key] = el[key];
            delete el[key];
          }
        }
        el["jsons"] = obj;
        // 残值率
        if (el.goalQuota) el.goalQuota = el.goalQuota / 100;
        // 有使用信息
        if (el.deptId) el.state = "1";
      });
      update({
        func: "U0075",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          asset: asset,
          permissonId: 25,
        },
      })
        .then(({ data }) => {
          LOADING.close();
          if (data.code != 0) return this.$message.error(data.data);
          this.batchEditDialogVisible = false;
          this.getAssetData();
          this.$message.success(data.data);
        })
        .catch(() => {
          LOADING.close();
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 更新表格，解决表头改变之后错乱的问题
    updateTable() {
      this.$refs.tableRef.$refs.dsTableRef.doLayout();
    },
    updateHighFilter() {
      let highKey =
        sessionStorage.getItem("loginCompanyName") + this.userInfo._id;
      this.listFilterSetData = JSON.parse(localStorage.getItem(highKey));
    },
    // 保存高级筛选设置
    saveHightFilter() {
      let highKey =
        sessionStorage.getItem("loginCompanyName") + this.userInfo._id;
      localStorage.setItem(highKey, JSON.stringify(this.listFilterSetData));
      this.$refs.highSetPopverRef.doClose();
      this.$message.success(this.$t("h.tips102"));
    },
  },
  created() {
    // 维保到期资产
    if (this.$route.query.expired) this.maintainLast = true;
    // 资产状态资产
    this.updateHighFilter();
    if (this.$route.query.state) {
      let stateIndex = this.highFilterArr.findIndex((e) => {
        return e.attr == "state";
      });
      this.filterForm[stateIndex].value = [this.$route.query.state];
    }
    this.mapHighFilterTags();
    this.getAssetData();
    this.getAssetType();
    this.getAssetAttr();
    this.getDeptData();
  },
};
</script>
<style lang="scss" scoped>
.asset-list {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .asset-list-card {
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
.asset-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.asset-card-content {
  height: 100%;
  .asset-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
    .check-scrap {
      padding: 0 5px;
      height: 35px;
      line-height: 33px;
    }
  }
  .asset-table {
    height: calc(100% - 75px);
  }
  .asset-pagination {
    height: 40px;
  }
}
.batch-edit-dialog {
  .title {
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #000;
    border-left: 4px solid #588ab9;
  }
  .bill-table {
    margin-top: 10px;
  }
}
.dropdown-menu {
  text-align: center;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .dropdown-menu-item {
    max-height: 450px;
    overflow-y: auto;
    text-align: left;
    .el-switch {
      margin-top: 10px;
      display: block;
    }
  }
  .svae-btn {
    margin-top: 10px;
  }
}
</style>
