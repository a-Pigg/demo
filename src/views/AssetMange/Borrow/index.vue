<template>
  <div class="borrow-and-return">
    <el-card class="b-a-r-card">
      <div slot="header" class="b-a-r-card-header">
        <ds-query-form>
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
                <el-dropdown-item @click.native="editBorrowForm">{{
                  $t("h.changeBtn")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="deleteBorrowBills">{{
                  $t("h.delBtn")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" style="margin-left: 0px">
              <el-button size="small"
                >{{ $t("h.printBtn") }}
                <i class="el-icon-arrow-down el-icon--right"></i
              ></el-button>
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
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="findAssetSearch"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="b-a-r-card-content">
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
            :tableData="borrowAndReturngBills"
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
              <span class="line"></span>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.status != 0 || scope.row.borrowState == 0"
                @click="assertsReturn(scope.row)"
                >{{ $t("h.returnBtn") }}</el-button
              >
            </template>
          </ds-table>
        </div>
        <div class="bills-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getBorrowAndRetureBills"
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
      <el-form ref="filterFormRef" label-width="110px" :model="filterForm">
        <el-form-item :label="$t('h.borrowingDepartment')" prop="deptId">
          <ds-select-tree
            v-model="filterForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.borrowingDepartment')"
            :multiple="true"
            :checkStrictly="true"
            collapseTags
            :treeData="treeDepts"
            :defaultProps="deptTreeProps"
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.borrower')" prop="staffId">
          <el-select
            ref="highFilterStaffSelectref"
            v-model="filterForm.staffId"
            :placeholder="$t('h.tips4') + $t('h.borrower')"
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
        <el-form-item :label="$t('h.borrowingDate')" prop="borrowData">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filterForm.borrowData"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
            <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('h.estimatedReturnDate')"
          prop="borrowBackData"
        >
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filterForm.borrowBackData"
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
    <!-- 查看详情 -->
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
    <!-- 导出单据 -->
    <bills-export-dialog
      :billsExportDialogVisible.sync="billsExportDialogVisible"
      :percentage="exportPercentage"
      :step="exportStep"
      :errorContent="exportErrorContent"
      @submitExportForm="submitExportForm"
      @close="billsExportDialogVisibleClose"
    >
      <el-form label-width="110px" ref="exportFormRef" :model="exportForm">
        <el-form-item :label="$t('h.borrowingDepartment')" prop="deptId">
          <ds-select-tree
            v-model="exportForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.borrowingDepartment')"
            :multiple="true"
            :checkStrictly="true"
            :treeData="treeDepts"
            :defaultProps="deptTreeProps"
            collapseTags
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.borrower')" prop="staffId">
          <el-select
            v-model="exportForm.staffId"
            :placeholder="$t('h.tips4') + $t('h.borrower')"
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
        <el-form-item :label="$t('h.borrowingDate')" prop="borrowData">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="exportForm.borrowData"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
            <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('h.estimatedReturnDate')"
          prop="borrowBackData"
        >
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="exportForm.borrowBackData"
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
      @sbumitForm="sbumitBorrowForm"
    >
      <template slot="form">
        <el-form
          ref="borrowFormRef"
          label-width="130px"
          :model="borrowForm"
          :rules="borrowFormRules"
        >
          <el-form-item
            :label="$t('h.borrower')"
            prop="staffId"
            v-if="newBillsDialogVisible"
          >
            <el-select
              v-model="borrowForm.staffId"
              :placeholder="$t('h.tips4') + $t('h.borrower')"
              clearable
              filterable
              :filter-method="() => {}"
              @change="staffSelectChange"
              v-load-more="{
                options: staffData,
                modelField: '_id',
                model: borrowForm.staffId,
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
          <el-form-item :label="$t('h.borrowingDepartment')" prop="deptId">
            <ds-select-tree
              v-model="borrowForm.deptId"
              :placeholder="$t('h.tips4') + $t('h.borrowingDepartment')"
              :defaultProps="deptTreeProps"
              :treeData="treeDepts"
              @input="deptInput"
            ></ds-select-tree>
          </el-form-item>
          <el-form-item :label="$t('h.borrowingDate')" prop="borrowData">
            <el-date-picker
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('h.tips4') + $t('h.borrowingDate')"
              v-model="borrowForm.borrowData"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            :label="$t('h.estimatedReturnDate')"
            prop="borrowBackData"
          >
            <el-date-picker
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('h.tips4') + $t('h.estimatedReturnDate')"
              v-model="borrowForm.borrowBackData"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('h.comment')" prop="borrowBeizhu">
            <el-input
              v-model="borrowForm.borrowBeizhu"
              :placeholder="$t('h.tips3') + $t('h.comment')"
            ></el-input>
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
          >
          </ds-table>
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
    <!-- 删除详情  -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <!-- 打印 -->
    <bill-print-template
      ref="vptRef"
      :title="$t('h.title14')"
      :selectId="borrowTemplateId"
      :voucherPrintTempList="billPrintTemplate"
      @setVoucherTag="setBillPrintTemplate"
    ></bill-print-template>
    <bill-print-dialog
      ref="vpdRef"
      locationName="borrowTemplateId"
      :voucherData="selectBorrowBills"
      :userInfo="userInfo"
      :voucherPrintTemplate="billPrintTemplate"
    ></bill-print-dialog>
    <!-- 归还 -->
    <el-drawer
      :title="$t('h.return1')"
      direction="rtl"
      :visible.sync="returnDrawer"
      :before-close="returnDrawerHandleClose"
      custom-class="return-drawer"
      size="80%"
    >
      <el-form
        ref="returnFormRef"
        label-width="130px"
        :model="returnForm"
        :rules="returnFormRules"
        :inline="true"
      >
        <el-form-item :label="$t('h.personWhoReturnAsset')" prop="staffId">
          <el-select
            v-model="returnForm.staffId"
            :placeholder="$t('h.tips4') + $t('h.personWhoReturnAsset')"
            clearable
            filterable
            :filter-method="() => {}"
            @change="returnStaffSelectChange"
            v-load-more="{
              options: staffData,
              modelField: '_id',
              model: returnForm.staffId,
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
        <el-form-item :label="$t('h.returnDepartment')" prop="deptId">
          <ds-select-tree
            v-model="returnForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.returnDepartment')"
            :defaultProps="deptTreeProps"
            :treeData="treeDepts"
            @input="returnDeptInput"
          ></ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.returnDate')" prop="date">
          <el-date-picker
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            type="date"
            :placeholder="$t('h.tips4') + $t('h.returnDate')"
            v-model="returnForm.date"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="title">
        <span>{{ $t("h.selectAsset") }}</span>
      </div>
      <div class="table">
        <div class="top">
          <ds-table
            ref="returnDetailTableRef"
            :loading="detailLoading"
            :tableData="returnDetailAssets"
            :columns="assetsColumns"
            :tableConfig="billsTableConfig"
            :rowKey="(row) => row._id"
            @handleSelectionChange="handleSelectionChangeAssets"
          >
          </ds-table>
        </div>
        <div class="bottom">
          <ds-pagination
            small
            :total="returnDetailTotal"
            :page.sync="returnDetailPaginationForm.currentPage"
            :limit.sync="returnDetailPaginationForm.pageSize"
            @pagination="getReturnMatchAssets"
          ></ds-pagination>
        </div>
      </div>
      <div class="button">
        <el-button @click="returnDrawerHandleClose">{{
          $t("h.tips29")
        }}</el-button>
        <el-button type="primary" @click="sbumitReturnForm">{{
          $t("h.confirmBtn")
        }}</el-button>
      </div>
    </el-drawer>
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
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsFilterTag from "@/components/DsFilterTag";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import UploadPhoto from "@/components/ListComponents/NewAssetDialog/UploadPhoto";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsSelectTree from "@/components/DsSelectTree";
import BillDetailDialog from "@/components/BillsComponents/BillDetailDialog";
import BillsExportDialog from "@/components/BillsComponents/BillsExportDialog";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import MatchAssetsDialog from "@/components/BillsComponents/MatchAssetsDialog";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { mapState } from "vuex";
import {
  borrowAndReturnBillsColumns,
  statusListData,
  borrowDetailCell,
  deleteBillsErrorColumns,
} from "@/utils/systemData";
import { deleteData, select, update } from "@/assets/api";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import {
  countTableHeaderWidth,
  clickDownloadLink,
  getTodayDate,
} from "@/utils/basic-methods";
export default {
  components: {
    AssetPrintDialog,
    BillPrintDialog,
    BillPrintTemplate,
    DsDeleteDetail,
    DsTable,
    DsPagination,
    DsFilterTag,
    DsFilterDrawer,
    UploadPhoto,
    DsSelectTree,
    DsSearchBtn,
    NewBillsDialog,
    MatchAssetsDialog,
    BillDetailDialog,
    BillsExportDialog,
    DsQueryForm,
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
      billsColums: borrowAndReturnBillsColumns,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      borrowAndReturngBills: [],
      selectBorrowBills: [],
      uploadImgLoading: false,
      billPhotoFile: "",
      filterDrawerVisible: false,
      filterForm: {
        deptId: [],
        staffId: [],
        status: [],
        borrowData: [],
        borrowBackData: [],
      },
      andLike: "",
      deptTreeProps: {
        value: "_id",
        label: "deptName",
        children: "children",
      },
      depts: [],
      treeDepts: [],
      staffData: [],
      statusListData: statusListData,
      highFilterTags: [],
      billsExportDialogVisible: false,
      exportPercentage: 0,
      exportStep: "",
      exportErrorContent: "",
      exportForm: {
        deptId: [],
        staffId: [],
        status: [],
        borrowBackData: [],
        borrowData: [],
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
      borrowForm: {
        _id: "",
        deptId: "",
        staffId: "", //员工
        borrowData: getTodayDate(), // 借用日期
        borrowBackData: "", //预计归还时间
        borrowBeizhu: "", //备注
      },
      borrowFormRules: {
        staffId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.borrower"),
            trigger: "change",
          },
        ],
        borrowData: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.date"),
            trigger: "change",
          },
        ],
        borrowBackData: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.returnDate"),
            trigger: "change",
          },
        ],
      },
      selectBillAssets: [],
      matchAssetsDialogVisible: false,
      billAssetsLoading: false,
      matchState: "0,1",
      billAssets: [],
      assetIdsState: [],
      deleteDialogVisible: false,
      deleteColumns: deleteBillsErrorColumns,
      deleteErrorData: [],
      billPrintTemplate: [],
      borrowTemplateId: "",
      // 归还
      returnDrawer: false,
      returnDetailTotal: 0,
      returnDetailPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      returnLoading: false,
      returnDetailAssets: [],
      returnAssets: [],
      borrowAssetIds: null,
      returnForm: {
        revertId: "",
        deptId: "",
        staffId: "", //员工
        date: getTodayDate(),
      },
      returnFormRules: {
        staffId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.personWhoReturnAsset"),
            trigger: "change",
          },
        ],
        deptId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.returnDepartment"),
            trigger: "change",
          },
        ],
        date: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.returnDate"),
            trigger: "change",
          },
        ],
      },
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
    getBorrowAndRetureBills() {
      this.tableLoading = true;
      if (this.filterForm.borrowBackData == null)
        this.filterForm.borrowBackData = [];
      if (this.filterForm.borrowData == null) this.filterForm.borrowData = [];
      if (this.filterForm.deptId == null) this.filterForm.deptId = [];
      select({
        func: "S0008",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          staffId: this.filterForm.staffId.join(","),
          deptId: this.filterForm.deptId.join(","),
          status: this.filterForm.status.join(","),
          borrowData: this.filterForm.borrowData.join(","),
          borrowBackData: this.filterForm.borrowBackData.join(","),
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.borrowAndReturngBills = data.data[1];
          this.borrowAndReturngBills.forEach((item) => {
            if (item.image) {
              item.image = window.$EXCEL_URL + "image/" + item.image;
            }
            item.company = window.sessionStorage.getItem("loginCompanyName");
          });
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getDetps() {
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
    handleSelectionChange(val) {
      this.selectBorrowBills = val;
    },
    billPopAsterLeave() {
      this.billPhotoFile = "";
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
          this.getBorrowAndRetureBills();
        })
        .catch(() => {
          this.uploadImgLoading = false;
          return this.$message.error(this.$t("h.tips18"));
        });
    },
    // 高级筛选
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
            highFilteritem.name = this.$t("h.borrower");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "deptId") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let deptName = this.depts.find((el) => {
                return el._id == item;
              }).deptName;
              labels.push(deptName);
            });
            highFilteritem.name = this.$t("h.borrowingDepartment");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "status") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let label = this.statusListData.find((el) => {
                return el.value == item;
              }).label;
              labels.push(label);
            });
            highFilteritem.name = this.$t("h.auditStatus");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "borrowData") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.borrowingDate");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join("至");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "borrowBackData") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.estimatedReturnDate");
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
      this.getBorrowAndRetureBills();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getBorrowAndRetureBills();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getBorrowAndRetureBills();
    },
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getBorrowAndRetureBills();
    },
    // 导出单据
    billsExportDialogVisibleClose() {
      this.$refs.exportFormRef.resetFields();
      this.exportPercentage = 0;
      this.exportStep = "";
      this.exportErrorContent = "";
    },
    submitExportForm() {
      this.exportStep = "loading";
      this.exportPercentage = 50;
      if (this.exportForm.borrowBackData == null)
        this.exportForm.borrowBackData = [];
      if (this.exportForm.borrowData == null) this.exportForm.borrowData = [];
      if (this.exportForm.deptId == null) this.exportForm.deptId = [];
      update({
        func: "U0032",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          borrowData: this.exportForm.borrowData.join(","),
          borrowBackData: this.exportForm.borrowBackData.join(","),
          deptId: this.exportForm.deptId.join(","),
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
    // 查看详情
    checkBillDetail(val) {
      this.billFormDetail = borrowDetailCell(val);
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
    getBillsAuditMessage(val) {
      select({
        func: "S0053",
        token: this.userInfo.token,
        userId: this.userInfo._id,
        requstData: {
          _id: val._id,
          type: "JY",
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
    // 新建/编辑
    newBillsDialogOpened() {
      this.$refs.borrowFormRef.clearValidate();
      this.$refs.billAssetsRef.$refs.dsTableRef.clearSelection();
    },
    newBillsDialogClose() {
      this.selectBillAssets = [];
      this.billAssets = [];
      this.assetIdsState = [];
      this.borrowForm._id = "";
      this.borrowForm.deptId = "";
      this.borrowForm.staffId = "";
      this.borrowForm.borrowData = "";
      this.borrowForm.borrowBackData = "";
      this.borrowForm.borrowBeizhu = "";
      this.newBillTitle = this.$t("h.title12");
      this.$refs.billsTableRef.$refs.dsTableRef.clearSelection();
    },
    sbumitBorrowForm() {
      this.$refs.borrowFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.billAssets.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips112"),
          });
        }
        const LOADING = this.$loading(this.dialogLoading);
        let permissonId = this.borrowForm._id == "" ? 31 : 62;
        let assetIdsArr = [];
        let assetNamesArr = [];
        let assertCodesArr = [];
        let fromStateArr = [];
        this.billAssets.forEach((item) => {
          let as = this.assetIdsState.find((el) => el._id == item._id);
          if (as) fromStateArr.push(as.state);
          else fromStateArr.push(item.state);
          assetIdsArr.push(item._id);
          assetNamesArr.push(item.name);
          assertCodesArr.push(item.assetCode);
        });
        update({
          func: "U0009",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.borrowForm._id,
            assetIds: assetIdsArr.join(","),
            assetNames: assetNamesArr.join(","),
            assertCodes: assertCodesArr.join(","),
            deptId: this.borrowForm.deptId,
            staffId: this.borrowForm.staffId,
            borrowData: this.borrowForm.borrowData,
            borrowBackData: this.borrowForm.borrowBackData,
            borrowBeizhu: this.borrowForm.borrowBeizhu,
            borrowTel: this.userInfo.phone,
            borrowOpera: this.userInfo.staffName,
            borrowState: "2",
            fromState: fromStateArr.join(","),
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getBorrowAndRetureBills();
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
    savaSelectAssets(val) {
      this.billAssets = val;
      this.matchAssetsDialogVisible = false;
    },
    billAssetsSelectionChange(val) {
      this.selectBillAssets = val;
    },
    deptInput(val) {
      if (!val) return false;
      let matchStaffData = this.staffData.filter((item) => item.deptId == val);
      if (matchStaffData.length) {
        let matchStaff = matchStaffData.find(
          (item) => item._id == this.borrowForm.staffId
        );
        if (!matchStaff) this.borrowForm.staffId = "";
        return;
      } else {
        this.borrowForm.staffId = "";
      }
    },
    staffSelectChange(val) {
      if (!val) return false;
      this.borrowForm.deptId = this.staffData.find(
        (item) => item._id == val
      ).deptId;
    },
    editBorrowForm() {
      if (!this.selectBorrowBills.length || this.selectBorrowBills.length > 1) {
        return this.$message.error(this.$t("h.tips110"));
      }
      if (this.selectBorrowBills[0].status != -1) {
        return this.$message.error(this.$t("h.tips111"));
      }
      // this.getMatchEditStaff(this.selectBorrowBills[0].staffId);
      this.getMatchEditAssets(this.selectBorrowBills[0].assetIds);
      this.borrowForm._id = this.selectBorrowBills[0]._id;
      this.borrowForm.deptId = this.selectBorrowBills[0].deptId;
      this.borrowForm.staffId = this.selectBorrowBills[0].staffId;
      this.borrowForm.borrowData = this.selectBorrowBills[0].borrowData;
      this.borrowForm.borrowBackData = this.selectBorrowBills[0].borrowBackData;
      this.borrowForm.borrowBeizhu = this.selectBorrowBills[0].borrowBeizhu;
      // 记录之前资产状态的逻辑
      let assetIdsArr = this.selectBorrowBills[0].assetIds.split(",");
      let stateArr = this.selectBorrowBills[0].fromState.split(",");
      assetIdsArr.forEach((item, index) => {
        this.assetIdsState.push({
          _id: assetIdsArr[index],
          state: stateArr[index],
        });
      });
      this.newBillTitle = this.$t("h.title13");
      this.newBillsDialogVisible = true;
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
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    deleteBorrowBills() {
      if (this.selectBorrowBills.length == 0) {
        return this.$message.error(this.$t("h.tips22"));
      } else {
        for (let i = 0; i < this.selectBorrowBills.length; i++) {
          if (this.selectBorrowBills[i].status != -1) {
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
      if (index > this.selectBorrowBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getBorrowAndRetureBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips118"));
        }
        return;
      }
      deleteData({
        func: "D0008",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectBorrowBills[index]._id,
          permissonId: 32,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              roleRule: this.selectBorrowBills[index].roleRule,
              assetNames: this.selectBorrowBills[index].assetNames,
              reason: data.data,
            });
          }
          this.multiDeleteBill(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            roleRule: this.selectBorrowBills[index].roleRule,
            assetNames: this.selectBorrowBills[index].assetNames,
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
          type: "JY",
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.billPrintTemplate = data.data;
          this.borrowTemplateId = localStorage.getItem("borrowTemplateId");
          if (
            !this.billPrintTemplate.some(
              (item) => item._id == this.borrowTemplateId
            )
          ) {
            this.borrowTemplateId = this.billPrintTemplate[0]._id;
            localStorage.setItem("borrowTemplateId", this.borrowTemplateId);
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips119"));
        });
    },
    setBillPrintTemplate(id) {
      this.borrowTemplateId = id;
      window.localStorage.setItem("borrowTemplateId", id);
    },
    goPrintBills() {
      if (this.selectBorrowBills.length == 0)
        return this.$message.error(this.$t("h.tips121"));
      if (this.selectBorrowBills.length > 10)
        return this.$message.error(
          this.$t("h.tips122") + 10 + this.$t("h.tips123")
        );
      this.$refs["vpdRef"].voucherPrintDialogVisible = true;
    },
    // 资产归还
    assertsReturn(val) {
      this.returnDrawer = true;
      this.borrowAssetIds = val.assetIds;
      this.getReturnMatchAssets();
    },
    getReturnMatchAssets() {
      this.returnLoading = true;
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          item: [
            { key: "_id", handle: "OIS", value: this.borrowAssetIds },
            { key: "stauss", handle: "OIS", value: 0 },
            { key: "state", handle: "OIS", value: 2 },
          ],
          page: this.returnDetailPaginationForm.pageSize,
          index: this.returnDetailPaginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          this.returnLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.returnDetailTotal = data.data[0];
          this.returnDetailAssets = data.data[1];
        })
        .catch(() => {
          this.returnLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    returnDrawerHandleClose() {
      this.returnDrawer = false;
      this.returnDetailAssets = [];
      this.borrowAssetIds = null;
      this.$refs.returnFormRef.resetFields();
    },
    returnStaffSelectChange(val) {
      if (!val) return false;
      this.returnForm.deptId = this.staffData.find(
        (item) => item._id == val
      ).deptId;
    },
    returnDeptInput(val) {
      if (!val) return false;
      let matchStaffData = this.staffData.filter((item) => item.deptId == val);
      if (matchStaffData.length) {
        let matchStaff = matchStaffData.find(
          (item) => item._id == this.returnForm.staffId
        );
        if (!matchStaff) this.returnForm.staffId = "";
        return;
      } else {
        this.returnForm.staffId = "";
      }
    },
    handleSelectionChangeAssets(val) {
      this.returnAssets = val;
    },
    sbumitReturnForm() {
      this.$refs.returnFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.returnAssets.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips112"),
          });
        }
        const LOADING = this.$loading(this.dialogLoading);
        let assetIdsArr = [];
        let assetNamesArr = [];
        let assertCodesArr = [];
        this.returnAssets.forEach((item) => {
          assetIdsArr.push(item._id);
          assetNamesArr.push(item.name);
          assertCodesArr.push(item.assetCode);
        });
        update({
          func: "U0073",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            revertId: this.returnForm.revertId,
            deptId: this.returnForm.deptId,
            staffId: this.returnForm.staffId,
            date: this.returnForm.date,
            assetIds: assetIdsArr.join(","),
            assetNames: assetNamesArr.join(","),
            assertCodes: assertCodesArr.join(","),
            permissonId: 87,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.returnDrawer = false;
            this.paginationForm.currentPage = 1;
            this.$message.success(data.data);
            this.getBorrowAndRetureBills();
          })
          .catch(() => {
            LOADING.close();
            this.$message.error(this.$t("h.tips18"));
          });
      });
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
    this.getBorrowAndRetureBills();
    this.getDetps();
    this.getBillPrintTemplate();
  },
};
</script>
<style lang="scss" scoped>
.borrow-and-return {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .b-a-r-card {
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
.b-a-r-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.b-a-r-card-content {
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
::v-deep .return-drawer {
  font-size: 12px;
  .el-drawer__header {
    font-size: 18px;
  }
  .title {
    padding-left: 20px;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .table {
    height: calc(100% - 200px);
    padding: 0 20px;
    .top {
      height: 95%;
    }
    .bottom {
      height: 5%;
    }
    .delete {
      cursor: pointer;
    }
  }
  .button {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}
.line {
  vertical-align: middle;
  margin: 0 10px;
  border-right: 2px solid #000;
}
</style>
