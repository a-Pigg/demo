<template>
  <div class="using">
    <el-card class="using-card">
      <div slot="header" class="using-card-header">
        <ds-query-form>
          <!-- 按钮区域 -->
          <ds-query-form-left-panel>
            <el-button
              type="primary"
              size="small"
              @click="newBillsDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editUsingForm">{{
                  $t("h.changeBtn")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="deleteUsingBills">{{
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
      <div class="using-card-content">
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
        <div class="bills-table">
          <ds-table
            ref="billsTableRef"
            :loading="tableLoading"
            :tableConfig="billsTableConfig"
            :columns="billsColums"
            :tableData="usingBills"
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
                    >{{ $t("h.confirmBtn") }}</el-button
                  >
                </div>
                <el-button type="text" size="small" slot="reference">{{
                  $t("h.uploadVouchers")
                }}</el-button>
              </el-popover>
            </template>
          </ds-table>
        </div>
        <div class="bills-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getUsingBills"
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
        <el-form-item :label="$t('h.collectionDepartment')" prop="deptId">
          <ds-select-tree
            v-model="filterForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.collectionDepartment')"
            :multiple="true"
            :checkStrictly="true"
            :treeData="treeDepts"
            :defaultProps="deptTreeProps"
            collapseTags
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.recipient')" prop="staffId">
          <!-- <el-select
            ref="highFilterStaffSelectref"
            v-model="filterForm.staffId"
            multiple
            placeholder="请选择"
            clearable
            filterable
            remote
            :remote-method="staffRemoteMethod"
          >
            <el-option
              v-for="item in staffData"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select> -->
          <el-select
            ref="highFilterStaffSelectref"
            v-model="filterForm.staffId"
            :placeholder="$t('h.tips4') + $t('h.recipient')"
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
        <el-form-item :label="$t('h.auditStatus')" prop="status">
          <el-select
            v-model="filterForm.status"
            multiple
            :placeholder="$t('h.tips4') + $t('h.auditStatus')"
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
        <el-form-item :label="$t('h.placementArea')" prop="warehouseId">
          <!-- <el-select
            ref="highFilterWarehouseSelectref"
            v-model="filterForm.warehouseId"
            multiple
            placeholder="请选择"
            clearable
            filterable
            remote
            :remote-method="wareHouseRemoteMethod"
          >
            <el-option
              v-for="item in wareData"
              :key="item._id"
              :label="item.warehouseName"
              :value="item._id"
            >
            </el-option>
          </el-select> -->
          <el-select
            ref="highFilterWarehouseSelectref"
            :placeholder="$t('h.tips4') + $t('h.placementArea')"
            v-model="filterForm.warehouseId"
            multiple
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: wareData,
              modelField: '_id',
              model: filterForm.warehouseId.join(','),
              searchField: 'andLike',
              func: 'S0003',
              userInfo: userInfo,
            }"
          >
            <el-option
              v-for="item in wareData"
              :key="item._id"
              :label="item.warehouseName"
              :value="item._id"
            >
              <span> {{ item.code }} - {{ item.warehouseName }} </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('h.collectionDate')" prop="receiveData">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filterForm.receiveData"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
          <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
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
      <el-form label-width="110px" ref="exportFormRef" :model="exportForm">
        <el-form-item :label="$t('h.collectionDepartment')" prop="deptId">
          <ds-select-tree
            v-model="exportForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.collectionDepartment')"
            :multiple="true"
            :checkStrictly="true"
            :treeData="treeDepts"
            :defaultProps="deptTreeProps"
            collapseTags
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.recipient')" prop="staffId">
          <!-- <el-select
            ref="highFilterStaffSelectref"
            v-model="exportForm.staffId"
            multiple
            placeholder="请选择"
            clearable
            filterable
            remote
            :remote-method="staffRemoteMethod"
          >
            <el-option
              v-for="item in staffData"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select> -->
          <el-select
            v-model="exportForm.staffId"
            :placeholder="$t('h.tips4') + $t('h.recipient')"
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
        <el-form-item :label="$t('h.auditStatus')" prop="status">
          <el-select
            v-model="exportForm.status"
            multiple
            :placeholder="$t('h.tips4') + $t('h.auditStatus')"
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
        <el-form-item :label="$t('h.placementArea')" prop="warehouseId">
          <!-- <el-select
            ref="highFilterWarehouseSelectref"
            v-model="exportForm.warehouseId"
            multiple
            placeholder="请选择"
            clearable
            filterable
            remote
            :remote-method="wareHouseRemoteMethod"
          >
            <el-option
              v-for="item in wareData"
              :key="item._id"
              :label="item.warehouseName"
              :value="item._id"
            >
            </el-option>
          </el-select> -->
          <el-select
            :placeholder="$t('h.tips4') + $t('h.placementArea')"
            v-model="exportForm.warehouseId"
            multiple
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: wareData,
              modelField: '_id',
              model: exportForm.warehouseId.join(','),
              searchField: 'andLike',
              func: 'S0003',
              userInfo: userInfo,
            }"
          >
            <el-option
              v-for="item in wareData"
              :key="item._id"
              :label="item.warehouseName"
              :value="item._id"
            >
              <span> {{ item.code }} - {{ item.warehouseName }} </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('h.collectionDate')" prop="receiveData">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="exportForm.receiveData"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
          <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
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
      @sbumitForm="sbumitUsingForm"
    >
      <template slot="form">
        <el-form
          ref="usingFormRef"
          label-width="130px"
          :model="usingForm"
          :rules="usingFormRules"
        >
          <el-form-item
            :label="$t('h.recipient')"
            prop="staffId"
            v-if="newBillsDialogVisible"
          >
            <el-select
              v-model="usingForm.staffId"
              :placeholder="$t('h.tips4') + $t('h.recipient')"
              clearable
              filterable
              :filter-method="() => {}"
              @change="staffSelectChange"
              v-load-more="{
                options: staffData,
                modelField: '_id',
                model: usingForm.staffId,
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
          <el-form-item :label="$t('h.collectionDepartment')" prop="deptId">
            <ds-select-tree
              v-model="usingForm.deptId"
              :placeholder="$t('h.tips4') + $t('h.collectionDepartment')"
              :defaultProps="deptTreeProps"
              :treeData="treeDepts"
              @input="deptInput"
            ></ds-select-tree>
          </el-form-item>
          <el-form-item :label="$t('h.collectionDate')" prop="receiveData">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('h.tips4') + $t('h.collectionDate')"
              v-model="usingForm.receiveData"
            >
            <!-- format="yyyy 年 MM 月 dd 日" -->
            </el-date-picker>
          </el-form-item>
          <el-form-item
            :label="$t('h.placementArea')"
            prop="warehouseId"
            v-if="newBillsDialogVisible"
          >
            <!-- <el-select
              v-model="usingForm.warehouseId"
              placeholder="请选择领用后放置区域"
              filterable
              remote
              :remote-method="wareHouseRemoteMethod"
            >
              <el-option
                v-for="item in wareData"
                :key="item._id"
                :label="item.warehouseName"
                :value="item._id"
              >
              </el-option>
            </el-select> -->
            <el-select
              :placeholder="$t('h.tips4') + $t('h.placementArea')"
              v-model="usingForm.warehouseId"
              clearable
              filterable
              :filter-method="() => {}"
              v-load-more="{
                options: wareData,
                modelField: '_id',
                model: usingForm.warehouseId,
                searchField: 'andLike',
                func: 'S0003',
                userInfo: userInfo,
              }"
            >
              <el-option
                v-for="item in wareData"
                :key="item._id"
                :label="item.warehouseName"
                :value="item._id"
              >
                <span> {{ item.code }} - {{ item.warehouseName }} </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('h.comment')" prop="userBeizhu">
            <el-input v-model="usingForm.userBeizhu"></el-input>
          </el-form-item>
        </el-form>
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
            >{{ $t("h.addBtn") }}</el-button
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
      :deptData="depts"
      :deptTreeData="treeDepts"
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
          @pagination="getMatchAssets(billDetaulVal)"
        ></ds-pagination>
      </template>
    </bill-detail-dialog>
    <!-- 删除失败详情 -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <bill-print-template
      ref="vptRef"
      :title="$t('h.title14')"
      :selectId="usingTemplateId"
      :voucherPrintTempList="billPrintTemplate"
      @setVoucherTag="setBillPrintTemplate"
    ></bill-print-template>
    <bill-print-dialog
      ref="vpdRef"
      locationName="usingTemplateId"
      :voucherData="selectUsingBills"
      :userInfo="userInfo"
      :voucherPrintTemplate="billPrintTemplate"
    ></bill-print-dialog>
    <!-- 打印资产标签dialog -->
    <asset-print-dialog
      ref="apdRef"
      :userInfo="userInfo"
      :selectAssetsData="printAssets"
      @refreshAssets="refreshAssets"
    ></asset-print-dialog>
  </div>
</template>
<script>
import AssetPrintDialog from "@/components/ListComponents/AssetPrintDialog";
import BillPrintDialog from "@/components/BillsComponents/BillPrintDialog";
import BillPrintTemplate from "@/components/BillsComponents/BillPrintTemplate";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import DsTable from "@/components/DsTable";
import UploadPhoto from "@/components/ListComponents/NewAssetDialog/UploadPhoto";
import DsFilterTag from "@/components/DsFilterTag";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsSelectTree from "@/components/DsSelectTree";
import DsPagination from "@/components/DsPagination";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import BillDetailDialog from "@/components/BillsComponents/BillDetailDialog";
import BillsExportDialog from "@/components/BillsComponents/BillsExportDialog";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import MatchAssetsDialog from "@/components/BillsComponents/MatchAssetsDialog";
import { deleteData, select, update } from "@/assets/api";
import { mapState } from "vuex";
import {
  clickDownloadLink,
  countTableHeaderWidth,
} from "@/utils/basic-methods";
import {
  usingBillsColumns,
  statusListData,
  usingDetailCell,
  deleteBillsErrorColumns,
} from "@/utils/systemData";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
export default {
  components: {
    AssetPrintDialog,
    BillPrintDialog,
    BillPrintTemplate,
    DsDeleteDetail,
    DsTable,
    UploadPhoto,
    DsSearchBtn,
    DsQueryForm,
    DsFilterTag,
    DsSelectTree,
    DsPagination,
    DsFilterDrawer,
    NewBillsDialog,
    BillDetailDialog,
    MatchAssetsDialog,
    BillsExportDialog,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      tableLoading: false,
      billsTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      billsColums: usingBillsColumns,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      usingBills: [],
      selectUsingBills: [],
      filterDrawerVisible: false,
      filterForm: {
        staffId: [],
        deptId: [],
        status: [],
        warehouseId: [],
        receiveData: [],
      },
      andLike: "",
      statusListData: statusListData,
      wareData: [],
      deptTreeProps: {
        value: "_id",
        label: "deptName",
        children: "children",
      },
      treeDepts: [],
      depts: [],
      staffData: [],
      highFilterTags: [],
      uploadImgLoading: false,
      billPhotoFile: "",
      billsExportDialogVisible: false,
      exportPercentage: 0,
      exportStep: "",
      exportErrorContent: "",
      exportForm: {
        deptId: [],
        staffId: [],
        warehouseId: [],
        receiveData: [],
        status: [],
      },
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
      billDetaulVal: null,
      detailPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      newBillsDialogVisible: false,
      newBillTitle: this.$t("h.title12"),
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      usingForm: {
        _id: "",
        deptId: "",
        staffId: "",
        receiveData: "",
        warehouseId: "",
        userBeizhu: "",
      },
      usingFormRules: {
        deptId: [
          {
            required: true,
            message: this.$t("h.collectionDepartment"),
            trigger: "change",
          },
        ],
        staffId: [
          {
            required: true,
            message: this.$t("h.recipient"),
            trigger: "change",
          },
        ],
        receiveData: [
          {
            required: true,
            message: this.$t("h.collectionDate"),
            trigger: "change",
          },
        ],
        warehouseId: [
          {
            required: true,
            message: this.$t("h.placementArea"),
            trigger: "change",
          },
        ],
      },
      selectBillAssets: [],
      matchAssetsDialogVisible: false,
      billAssetsLoading: false,
      matchState: "0",
      billAssets: [],
      deleteDialogVisible: false,
      deleteColumns: deleteBillsErrorColumns,
      deleteErrorData: [],
      billPrintTemplate: [],
      usingTemplateId: "",
      printAssets: [],
    };
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader", "stateListData"]),
    billAssetsColumns() {
      let columns = [
        {
          prop: "returnWareDate",
          label: this.$t("h.revertDate"),
          width: countTableHeaderWidth(this.$t("h.revertDate")),
          showOverflowTooltip: true,
        },
        {
          prop: "returnWareUser",
          label: this.$t("h.personWhoReturned"),
          width: countTableHeaderWidth(this.$t("h.personWhoReturned")),
          showOverflowTooltip: true,
        },
      ];
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
    getUsingBills() {
      this.tableLoading = true;
      if (this.filterForm.receiveData == null) this.filterForm.receiveData = [];
      if (this.filterForm.deptId == null) this.filterForm.deptId = [];
      select({
        func: "S0014",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          staffId: this.filterForm.staffId.join(","),
          deptId: this.filterForm.deptId.join(","),
          status: this.filterForm.status.join(","),
          warehouseId: this.filterForm.warehouseId.join(","),
          receiveData: this.filterForm.receiveData.join(","),
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code !== 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.usingBills = data.data[1];
          this.usingBills.map((item) => {
            item.company = window.sessionStorage.getItem("loginCompanyName");
            if (item.image)
              item.image = window.$EXCEL_URL + "image/" + item.image;
          });
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    handleSelectionChange(val) {
      this.selectUsingBills = val;
    },

    getMatchAssets(val) {
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
          const jsonDate = val.jsonDate;
          const jsonUser = val.jsonUser;
          for (let key in jsonDate) {
            this.detailAssets.forEach((item) => {
              if (item._id == key) item.returnWareDate = jsonDate[key];
            });
          }
          for (let key in jsonUser) {
            this.detailAssets.forEach((item) => {
              if (item._id == key) item.returnWareUser = jsonUser[key];
            });
          }
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
          type: "LY",
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
    checkBillDetail(val) {
      this.billFormDetail = usingDetailCell(val);
      this.billDetaulVal = val;
      this.detailMatchAssetIds = val.assetIds.split(",");
      if (this.detailMatchAssetIds.length) {
        this.getMatchAssets(val);
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
    refreshAssets() {
      this.$refs["detailTableRef"].$refs["dsTableRef"].clearSelection();
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
          this.$message.error(this.$t("h.tips18"));
        });
    },
    staffRemoteMethod(query) {
      if (!query) {
        this.staffData = [];
        return false;
      }
      select({
        func: "S0005",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          andLike: query,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.staffData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    wareHouseRemoteMethod(query) {
      if (!query) {
        this.wareData = [];
        return false;
      }
      select({
        func: "S0003",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          andLike: query,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.wareData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    mapHighFilterTags() {
      this.highFilterTags = [];
      for (let key in this.filterForm) {
        if (this.filterForm[key] && this.filterForm[key].length) {
          if (key == "staffId") {
            let highFilteritem = {};
            let labels = [];
            this.$refs.highFilterStaffSelectref.selected.forEach((item) => {
              labels.push(item.label);
            });
            highFilteritem.name = this.$t("h.recipient");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "deptId") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let deptName = this.depts.find((deptItem) => {
                return deptItem._id == item;
              }).deptName;
              labels.push(deptName);
            });
            highFilteritem.name = this.$t("h.collectionDepartment");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
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
          } else if (key == "warehouseId") {
            let highFilteritem = {};
            let labels = [];
            this.$refs.highFilterWarehouseSelectref.selected.forEach((item) => {
              labels.push(item.label);
            });
            highFilteritem.name = this.$t("h.placementArea");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "receiveData") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.collectionDate");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join("至");
            this.highFilterTags.push(highFilteritem);
          }
        }
      }
    },
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm[val.keyStr] = [];
      this.paginationForm.currentPage = 1;
      this.getUsingBills();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getUsingBills();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getUsingBills();
    },
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getUsingBills();
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
          this.getUsingBills();
        })
        .catch(() => {
          this.uploadImgLoading = false;
          return this.$message.error(this.$t("h.tips18"));
        });
    },
    billPopAsterLeave() {
      this.billPhotoFile = "";
    },
    submitExportForm() {
      this.exportStep = "loading";
      this.exportPercentage = 50;
      if (this.exportForm.receiveData == null) this.exportForm.receiveData = [];
      if (this.exportForm.deptId == null) this.exportForm.deptId = [];
      update({
        func: "U0030",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          deptId: this.exportForm.deptId.join(","),
          receiveData: this.exportForm.receiveData.join(","),
          warehouseId: this.exportForm.warehouseId.join(","),
          staffId: this.exportForm.staffId.join(","),
          status: this.exportForm.status.join(","),
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
    billsExportDialogVisibleClose() {
      this.$refs.exportFormRef.resetFields();
      this.exportPercentage = 0;
      this.exportStep = "";
      this.exportErrorContent = "";
    },
    newBillsDialogOpened() {
      this.$refs.usingFormRef.clearValidate();
      this.$refs.billAssetsRef.$refs.dsTableRef.clearSelection();
    },
    newBillsDialogClose() {
      this.selectBillAssets = [];
      this.billAssets = [];
      this.usingForm._id = "";
      this.usingForm.deptId = "";
      this.usingForm.staffId = "";
      this.usingForm.receiveData = "";
      this.usingForm.warehouseId = "";
      this.usingForm.warehouseId = "";
      this.newBillTitle = this.$t("h.title12");
      this.$refs.billsTableRef.$refs.dsTableRef.clearSelection();
    },
    sbumitUsingForm() {
      this.$refs.usingFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.billAssets.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips112"),
          });
        }
        const LOADING = this.$loading(this.dialogLoading);
        let permissonId = this.usingForm._id == "" ? 60 : 28;
        let assetIdsArr = [];
        let assetNamesArr = [];
        let assertCodesArr = [];
        let fromStateArr = [];
        this.billAssets.forEach((item) => {
          assetIdsArr.push(item._id);
          assetNamesArr.push(item.name);
          assertCodesArr.push(item.assetCode);
          fromStateArr.push(item.state);
        });
        update({
          func: "U0002",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.usingForm._id,
            assetIds: assetIdsArr.join(","),
            assetNames: assetNamesArr.join(","),
            assertCodes: assertCodesArr.join(","),
            receiveData: this.usingForm.receiveData,
            warehouseId: this.usingForm.warehouseId,
            staffId: this.usingForm.staffId,
            deptId: this.usingForm.deptId,
            userBeizhu: this.usingForm.userBeizhu,
            num: 1,
            receiveOpera: this.userInfo.staffName,
            userState: "1",
            fromState: fromStateArr.join(","),
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getUsingBills();
          })
          .catch(() => {
            LOADING.close();
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    deleteBillSelectAssets() {
      this.selectBillAssets.forEach((item) => {
        this.billAssets.splice(
          this.billAssets.findIndex((sItem) => sItem._id === item._id),
          1
        );
      });
      this.$refs.billAssetsRef.$refs.dsTableRef.clearSelection();
    },
    deptInput(val) {
      if (!val) return false;
      let matchStaffData = this.staffData.filter((item) => item.deptId == val);
      if (matchStaffData.length) {
        let matchStaff = matchStaffData.find(
          (item) => item._id == this.usingForm.staffId
        );
        if (!matchStaff) this.usingForm.staffId = "";
        return;
      } else {
        this.usingForm.staffId = "";
      }
    },
    staffSelectChange(val) {
      if (!val) return false;
      this.usingForm.deptId = this.staffData.find(
        (item) => item._id == val
      ).deptId;
    },
    billAssetsSelectionChange(val) {
      this.selectBillAssets = val;
    },
    savaSelectAssets(val) {
      this.billAssets = val;
      this.matchAssetsDialogVisible = false;
    },
    getMatchEditStaff(_id) {
      select({
        func: "S0005",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: _id,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.staffData = [data.data];
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getMatchEditWare(_id) {
      select({
        func: "S0003",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: _id,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.wareData = [data.data];
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
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
    editUsingForm() {
      if (!this.selectUsingBills.length || this.selectUsingBills.length > 1) {
        return this.$message.error(this.$t("h.tips110"));
      }
      if (this.selectUsingBills[0].status != -1) {
        return this.$message.error(this.$t("h.tips111"));
      }
      // this.getMatchEditStaff(this.selectUsingBills[0].staffId);
      this.getMatchEditAssets(this.selectUsingBills[0].assetIds);
      // this.getMatchEditWare(this.selectUsingBills[0].warehouseId);
      this.usingForm._id = this.selectUsingBills[0]._id;
      this.usingForm.deptId = this.selectUsingBills[0].deptId;
      this.usingForm.staffId = this.selectUsingBills[0].staffId;
      this.usingForm.receiveData = this.selectUsingBills[0].receiveData;
      this.usingForm.userBeizhu = this.selectUsingBills[0].userBeizhu;
      this.usingForm.warehouseId = this.selectUsingBills[0].warehouseId;
      this.newBillTitle = this.$t("h.title13");
      this.newBillsDialogVisible = true;
    },
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    deleteUsingBills() {
      if (this.selectUsingBills.length == 0) {
        return this.$message.error(this.$t("h.tips22"));
      } else {
        for (let i = 0; i < this.selectUsingBills.length; i++) {
          if (this.selectUsingBills[i].status != -1) {
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
          this.multiDeletaBill(0);
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    multiDeletaBill(index) {
      if (index > this.selectUsingBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getUsingBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips118"));
        }
        return;
      }
      deleteData({
        func: "D0014",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectUsingBills[index]._id,
          permissonId: 27,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              roleRule: this.selectUsingBills[index].roleRule,
              assetNames: this.selectUsingBills[index].assetNames,
              reason: data.data,
            });
          }
          this.multiDeletaBill(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            roleRule: this.selectUsingBills[index].roleRule,
            assetNames: this.selectUsingBills[index].assetNames,
            reason: this.$t("h.tips18"),
          });
          this.multiDeletaBill(++index);
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
          type: "LY",
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.billPrintTemplate = data.data;
          this.usingTemplateId = localStorage.getItem("usingTemplateId");
          if (
            !this.billPrintTemplate.some(
              (item) => item._id == this.usingTemplateId
            )
          ) {
            this.usingTemplateId = this.billPrintTemplate[0]._id;
            localStorage.setItem("usingTemplateId", this.usingTemplateId);
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips119"));
        });
    },
    setBillPrintTemplate(id) {
      this.usingTemplateId = id;
      window.localStorage.setItem("usingTemplateId", id);
    },
    goPrintBills() {
      if (this.selectUsingBills.length == 0)
        return this.$message.error(this.$t("h.tips121"));
      if (this.selectUsingBills.length > 10)
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
    this.getUsingBills();
    this.getDepts();
    this.getBillPrintTemplate();
  },
};
</script>
<style lang="scss" scoped>
.using {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .using-card {
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
.using-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.using-card-content {
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
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
.popover-cotent {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
