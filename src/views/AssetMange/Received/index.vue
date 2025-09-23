<template>
  <div class="received">
    <el-card class="received-card">
      <div slot="header" class="received-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-dropdown trigger="click">
              <el-button type="primary" size="small">
                {{ $t("h.newBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="newReceivedBill">{{
                  $t("h.newEnterWareBtn")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="bulkReceivedBill">{{
                  $t("h.bulkBtn")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editReceivedBill">{{
                  $t("h.changeBtn")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="deleteReceivedBills">{{
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
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="findAssetSearch"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="received-card-content">
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
            :tableData="receivedBills"
            :columns="receivedBillsColumns"
            :tableConfig="receivedTableConfig"
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
        <div class="bills-pagination" :loading="tableLoading">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getReceivedBills"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <!-- receivedForm弹框 页面编辑形式-->
    <new-bills-dialog
      class="new-bill-dialog"
      contentWidth="95%"
      :title="newBillTitle"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitReceivedForm"
    >
      <template slot="form">
        <el-row :gutter="45"></el-row>
        <el-form
          ref="receivedFormRef"
          label-width="80px"
          :model="receivedForm"
          :rules="receivedFormRules"
        >
          <el-col :span="8">
            <el-form-item :label="$t('h.enteringWarehouseDate')" prop="date">
              <el-date-picker
                type="date"
                :placeholder="$t('h.tips4') + $t('h.enteringWarehouseDate')"
                v-model="receivedForm.date"
                clearable
                value-format="yyyy-MM-dd"
              >
                <!-- format="yyyy 年 MM 月 dd 日" -->
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.creationDate')" prop="estaDate">
              <el-date-picker
                disabled
                type="date"
                v-model="receivedForm.estaDate"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.creator')" prop="staffName">
              <el-input v-model="receivedForm.staffName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.source')" prop="source">
              <el-select
                v-model="receivedForm.source"
                :placeholder="$t('h.tips4') + $t('h.source')"
                clearable
                filterable
              >
                <el-option
                  v-for="item in sourceListData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.assetAttributes')" prop="goodsId">
              <el-select
                v-model="receivedForm.goodsId"
                :placeholder="$t('h.tips4') + $t('h.assetAttributes')"
                clearable
                filterable
              >
                <el-option
                  v-for="item in goodsListData"
                  :key="item.goodsqId"
                  :label="item.name"
                  :value="item.goodsqId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.comment')" prop="assertBeizhu">
              <el-input
                v-model="receivedForm.assertBeizhu"
                type="textarea"
                rows="3"
                :placeholder="$t('h.tips3') + $t('h.comment')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </template>
      <template slot="btns">
        <div>
          <span class="title">{{ $t("h.title17") }}</span>
        </div>
      </template>
      <template slot="table">
        <div class="bill-table">
          <edit-table
            :columns="editColumns"
            :data="receivedAssets"
            :depts="depts"
          ></edit-table>
        </div>
      </template>
    </new-bills-dialog>
    <!-- receivedForm弹框 批量导入形式  -->
    <new-bills-dialog
      class="bulk-bill-dialog"
      :newBillsDialogVisible.sync="bulkBillsDialogVisible"
      @opened="bulkBillsDialogOpened"
      @close="bulkBillsDialogClose"
      @sbumitForm="sbumitBulkReceivedForm"
    >
      <template slot="form">
        <el-row :gutter="45"></el-row>
        <el-form
          ref="bulkReceivedFormRef"
          label-width="80px"
          :model="receivedForm"
          :rules="receivedFormRules"
        >
          <el-col :span="8">
            <el-form-item :label="$t('h.enteringWarehouseDate')" prop="date">
              <el-date-picker
                type="date"
                :placeholder="$t('h.tips4') + $t('h.enteringWarehouseDate')"
                v-model="receivedForm.date"
                style="width: 100%"
                clearable
                value-format="yyyy-MM-dd"
              >
                <!-- format="yyyy 年 MM 月 dd 日" -->
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.creationDate')" prop="estaDate">
              <el-date-picker
                disabled
                type="date"
                v-model="receivedForm.estaDate"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.creator')" prop="staffName">
              <el-input v-model="receivedForm.staffName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.source')" prop="source">
              <el-select
                v-model="receivedForm.source"
                :placeholder="$t('h.tips4') + $t('h.source')"
                clearable
                filterable
              >
                <el-option
                  v-for="item in sourceListData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.assetAttributes')" prop="goodsId">
              <el-select
                v-model="receivedForm.goodsId"
                :placeholder="$t('h.tips4') + $t('h.assetAttributes')"
                clearable
                filterable
              >
                <el-option
                  v-for="item in goodsListData"
                  :key="item.goodsqId"
                  :label="item.name"
                  :value="item.goodsqId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.comment')" prop="assertBeizhu">
              <el-input
                v-model="receivedForm.assertBeizhu"
                :placeholder="$t('h.tips3') + $t('h.comment')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('h.assetFiles')">
              <upload-excel-base64 :value.sync="file"></upload-excel-base64>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="text" size="small" @click="downloadImportFile">{{
              $t("h.tips11")
            }}</el-button>
          </el-col>
        </el-form>
      </template>
    </new-bills-dialog>
    <!-- 高级筛选 -->
    <ds-filter-drawer
      :filterDrawerVisible.sync="filterDrawerVisible"
      @submitFilterForm="submitFilterForm"
      @resetFilterForm="resetFilterForm"
    >
      <el-form ref="filterFormRef" label-width="100px" :model="filterForm">
        <el-form-item :label="$t('h.enteringWarehouseDate')" prop="date">
          <el-date-picker
            v-model="filterForm.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
          </el-date-picker>
        </el-form-item>
        <!-- format="yyyy 年 MM 月 dd 日" -->
        <el-form-item :label="$t('h.assetAttributes')" prop="goodsId">
          <el-select
            v-model="filterForm.goodsId"
            multiple
            :placeholder="$t('h.tips4') + $t('h.assetAttributes')"
            clearable
            filterable
          >
            <el-option
              v-for="item in goodsListData"
              :key="item.goodsqId"
              :label="item.name"
              :value="item.goodsqId"
            ></el-option>
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
              v-for="item in statusListData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('h.createDepartment')" prop="deptId">
          <ds-select-tree
            v-model="filterForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.createDepartment')"
            collapseTags
            :multiple="true"
            :checkStrictly="true"
            :treeData="depts"
            :defaultProps="deptTreeProps"
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.creator')" prop="staffId">
          <!-- <el-select
            ref="highFilterStaffSelectref"
            v-model="filterForm.staffId"
            multiple
            placeholder="请选择员工"
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
            >
            </el-option>
          </el-select> -->
          <el-select
            ref="highFilterStaffSelectref"
            v-model="filterForm.staffId"
            :placeholder="$t('h.tips4') + $t('h.creator')"
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
        <el-form-item :label="$t('h.enteringWarehouseDate')" prop="date">
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
        <el-form-item :label="$t('h.assetAttributes')" prop="goodsId">
          <el-select
            v-model="exportForm.goodsId"
            multiple
            :placeholder="$t('h.tips4') + $t('h.assetAttributes')"
            clearable
            filterable
          >
            <el-option
              v-for="item in goodsListData"
              :key="item.goodsqId"
              :label="item.name"
              :value="item.goodsqId"
            ></el-option>
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
              v-for="item in statusListData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('h.createDepartment')" prop="deptId">
          <ds-select-tree
            v-model="exportForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.createDepartment')"
            :multiple="true"
            :checkStrictly="true"
            :treeData="depts"
            :defaultProps="deptTreeProps"
            collapseTags
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.creator')" prop="staffId">
          <!-- <el-select
            v-model="exportForm.staffId"
            multiple
            placeholder="请选择创建人"
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
            >
              {{ item.deptName }} - {{ item.code }} - {{ item.name }}
            </el-option>
          </el-select> -->
          <el-select
            v-model="exportForm.staffId"
            :placeholder="$t('h.tips4') + $t('h.creator')"
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
    <!-- 单据详情 -->
    <bill-detail-dialog
      :billDetailDialogVisible.sync="billDetailDialogVisible"
      :billFormDetail="billFormDetail"
      :auditStep="auditStep"
      @closed="billDetailDialogVisibleClosed"
    >
      <template slot="table">
        <ds-table
          ref="detailTableRef"
          :loading="detailLoading"
          :tableData="detailAssets"
          :columns="billAssetsColumns"
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
          @pagination="detailPagination"
        ></ds-pagination>
      </template>
    </bill-detail-dialog>
    <!-- 批量导入 -->
    <!-- <read-excel-file
      :readDialogVisible.sync="readDialogVisible"
      :setp="setp"
      :percentage="percentage"
      :errorText="errorText"
      @download="downloadImportFile"
      @closed="readDialogVisibleClosed"
      @submit="readDialogVisibleSubmit"
    >
      <upload-excel-base64
        :value.sync="file"
        :loading="readLoading"
      ></upload-excel-base64>
    </read-excel-file> -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <bill-print-template
      ref="vptRef"
      :title="$t('h.title14')"
      :selectId="receivedTemplateId"
      :voucherPrintTempList="billPrintTemplate"
      @setVoucherTag="setBillPrintTemplate"
    ></bill-print-template>
    <bill-print-dialog
      ref="vpdRef"
      locationName="receivedTemplateId"
      :userInfo="userInfo"
      :voucherData="selectReceivedBills"
      :voucherPrintTemplate="billPrintTemplate"
    ></bill-print-dialog>
  </div>
</template>
<script>
import { deleteData, select, update } from "@/assets/api";
import { mapState } from "vuex";
import {
  receivedBillsColumns,
  sourceListData,
  statusListData,
  receivedDetailCell,
  deleteBillsErrorColumns,
} from "@/utils/systemData";
import {
  getTodayDate,
  countTableHeaderWidth,
  clickDownloadLink,
} from "@/utils/basic-methods";
import deepCopy from "@/utils/deepCopy";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import BillPrintDialog from "@/components/BillsComponents/BillPrintDialog";
import BillPrintTemplate from "@/components/BillsComponents/BillPrintTemplate";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import DsTable from "@/components/DsTable";
import EditTable from "@/components/BillsComponents/AssetMangeComponents/Received/EditTable";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsFilterTag from "@/components/DsFilterTag";
import DsQueryForm from "@/components/DsQueryForm";
import DsSelectTree from "@/components/DsSelectTree";
import DsPagination from "@/components/DsPagination";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import BillDetailDialog from "@/components/BillsComponents/BillDetailDialog";
import BillsExportDialog from "@/components/BillsComponents/BillsExportDialog";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
// import ReadExcelFile from "@/components/ReadExcelFile";
import UploadExcelBase64 from "@/components/UploadExcelBase64";
import UploadPhoto from "@/components/ListComponents/NewAssetDialog/UploadPhoto";
export default {
  components: {
    BillPrintDialog,
    BillPrintTemplate,
    DsDeleteDetail,
    DsTable,
    EditTable,
    DsFilterTag,
    DsSearchBtn,
    DsQueryForm,
    DsSelectTree,
    DsPagination,
    NewBillsDialog,
    DsFilterDrawer,
    BillDetailDialog,
    BillsExportDialog,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    // ReadExcelFile,
    UploadExcelBase64,
    UploadPhoto,
  },
  data() {
    return {
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      tableLoading: false,
      receivedBillsColumns: receivedBillsColumns,
      receivedTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      receivedBills: [],
      selectReceivedBills: [],
      filterDrawerVisible: false,
      deptTreeProps: {
        value: "_id",
        label: "deptName",
        children: "children",
      },
      depts: [],
      deptListData: [],
      highFilterTags: [],
      filterForm: {
        staffId: [],
        deptId: [],
        status: [],
        date: [],
        goodsId: [],
      },
      andLike: "",
      newBillsDialogVisible: false,
      newBillTitle: this.$t("h.title12"),
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      sourceListData: sourceListData,
      statusListData: statusListData,
      goodsListData: [],
      staffData: [],
      receivedForm: {
        _id: null,
        date: "",
        estaDate: getTodayDate(),
        staffName: "",
        deptId: "",
        assertBeizhu: "",
        source: "",
        goodsId: "",
      },
      receivedFormRules: {
        date: [
          {
            required: true,
            message:
              this.$t("h.tips4") + " " + this.$t("h.enteringWarehouseDate"),
            trigger: "change",
          },
        ],
        source: [
          {
            required: true,
            message: this.$t("h.tips4") + " " + this.$t("h.source"),
            trigger: "change",
          },
        ],
        goodsId: [
          {
            required: true,
            message: this.$t("h.tips4") + " " + this.$t("h.assetAttributes"),
            trigger: "change",
          },
        ],
      },
      receivedAssets: [],
      billsExportDialogVisible: false,
      exportPercentage: 0,
      exportStep: "",
      exportErrorContent: "",
      exportForm: {
        date: [],
        goodsId: [],
        status: [],
        deptId: [],
        staffId: [],
      },
      billDetailDialogVisible: false,
      billFormDetail: [],
      auditStep: [],
      detailLoading: false,
      detailMatchAssets: [],
      detailAssets: [],
      detailConfig: {},
      detailTotal: 0,
      detailPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      // readDialogVisible: false,
      file: {
        value: "",
        name: "",
      },
      // setp: "upload",
      // percentage: 0,
      // errorText: "",
      // readLoading: false,
      uploadImgLoading: false,
      billPhotoFile: "",
      deleteDialogVisible: false,
      deleteColumns: deleteBillsErrorColumns,
      deleteErrorData: [],
      billPrintTemplate: [],
      receivedTemplateId: "",
      bulkBillsDialogVisible: false,
      bulkLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
    };
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader", "assetFormHeader"]),
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
          item.dbDataName != "goodsName" &&
          item.dbDataName != "source" &&
          item.dbDataName != "num" &&
          item.dbDataName != "useDate" &&
          item.dbDataName != "useState" &&
          item.dbDataName != "useType" &&
          item.dbDataName != "deptCode" &&
          item.dbDataName != "useDept" &&
          item.dbDataName != "responsible"
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
        //           return "无状态值";
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
  },
  methods: {
    // 获取入库单据
    getReceivedBills() {
      this.tableLoading = true;
      if (this.filterForm.deptId == null) this.filterForm.deptId = [];
      if (this.filterForm.date == null) this.filterForm.date = [];
      select({
        func: "S0013",
        token: this.userInfo.token,
        userId: this.userInfo._id,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          staffId: this.filterForm.staffId.join(","),
          deptId: this.filterForm.deptId.join(","),
          status: this.filterForm.status.join(","),
          date: this.filterForm.date.join(","),
          goodsId: this.filterForm.goodsId.join(","),
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.receivedBills = data.data[1] || [];
          this.receivedBills.forEach((item) => {
            item.company = sessionStorage.getItem("loginCompanyName");
            if (item.image)
              item.image = window.$EXCEL_URL + "image/" + item.image;
          });
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getGoodsAttributeListData() {
      select({
        func: "S0022",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.goodsListData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getDeptData() {
      select({
        func: "S0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.deptListData = data.data;
          this.depts = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // staffRemoteMethod(query) {
    //   if (!query) {
    //     this.staffData = [];
    //     return;
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
    // 选中入库单据
    handleSelectionChange(val) {
      this.selectReceivedBills = val;
    },
    getBillsAuditMessage(val) {
      select({
        func: "S0053",
        token: this.userInfo.token,
        userId: this.userInfo._id,
        requstData: {
          _id: val._id,
          type: "RK",
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
    detailPagination() {
      this.detailLoading = true;
      this.detailAssets = this.detailMatchAssets.slice(
        (this.detailPaginationForm.currentPage - 1) *
          this.detailPaginationForm.pageSize,
        this.detailPaginationForm.currentPage *
          this.detailPaginationForm.pageSize
      );
      this.detailLoading = false;
    },
    // 点击查看入库单据详情
    checkBillDetail(val) {
      this.billFormDetail = receivedDetailCell(val);
      this.detailTotal = val.asset.length;
      this.detailMatchAssets = val.asset;
      this.detailPagination();
      this.getBillsAuditMessage(val);
      this.billDetailDialogVisible = true;
    },
    billDetailDialogVisibleClosed() {
      this.detailAssets = [];
      this.detailTotal = 0;
      this.detailPaginationForm.currentPage = 1;
      this.detailPaginationForm.pageSize = 20;
      this.detailMatchAssets = [];
    },
    // 新建入库单据
    newReceivedBill() {
      select({
        func: "S0005",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.userInfo.staffId,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.receivedForm.staffName = this.userInfo.staffName;
          this.receivedForm.deptId = data.data.deptId;
          this.receivedForm.estaDate = getTodayDate();
          this.newBillsDialogVisible = true;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    bulkReceivedBill() {
      select({
        func: "S0005",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.userInfo.staffId,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.receivedForm.staffName = this.userInfo.staffName;
          this.receivedForm.deptId = data.data.deptId;
          this.receivedForm.estaDate = getTodayDate();
          this.bulkBillsDialogVisible = true;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 修改入库单据
    editReceivedBill() {
      if (
        !this.selectReceivedBills.length ||
        this.selectReceivedBills.length > 1
      ) {
        return this.$message.error(this.$t("h.tips110"));
      }
      if (this.selectReceivedBills[0].status != -1) {
        return this.$message.error(this.$t("h.tips111"));
      }
      select({
        func: "S0005",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.userInfo._id,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.receivedForm.staffName = this.userInfo.staffName;
          this.receivedForm.deptId = data.data.deptId;
          this.receivedForm.estaDate = getTodayDate();
          this.receivedForm._id = this.selectReceivedBills[0]._id;
          this.receivedForm.assertBeizhu =
            this.selectReceivedBills[0].assertBeizhu;
          this.receivedForm.date = this.selectReceivedBills[0].date;
          this.receivedForm.estaDate = this.selectReceivedBills[0].estaDate;
          this.receivedForm.goodsId = this.selectReceivedBills[0].goodsId;
          this.receivedForm.source = this.selectReceivedBills[0].source;
          this.selectReceivedBills[0].asset.forEach((item) => {
            if (item["jsons"]) {
              for (let key in item["jsons"]) {
                item[key] = item["jsons"][key];
              }
              delete item["jsons"];
            }
            item.isSet = false;
            if (item["goalQuota"]) item["goalQuota"] = item["goalQuota"] * 100;
          });
          this.receivedAssets = deepCopy(this.selectReceivedBills[0].asset);
          this.newBillTitle = this.$t("h.title13");
          this.newBillsDialogVisible = true;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 新建单据弹框开启钩子
    newBillsDialogOpened() {
      this.$refs.receivedFormRef.clearValidate();
    },
    // 新建单据弹框关闭钩子
    newBillsDialogClose() {
      this.receivedAssets = [];
      this.receivedForm._id = null;
      this.receivedForm.assertBeizhu = "";
      this.receivedForm.date = "";
      this.receivedForm.deptId = "";
      this.receivedForm.estaDate = "";
      this.receivedForm.goodsId = "";
      this.receivedForm.source = "";
      this.receivedForm.staffName = "";
      this.newBillTitle = this.$t("h.title12");
      this.$refs.billsTableRef.$refs.dsTableRef.clearSelection();
    },
    // 发送新入库单据Form到服务器
    sbumitReceivedForm() {
      this.$refs.receivedFormRef.validate((valid) => {
        if (!valid) return false;
        // 资产填报为0
        if (!this.receivedAssets.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips112"),
          });
        }
        // 资产填报未保存
        for (let i = 0; i < this.receivedAssets.length; i++) {
          if (this.receivedAssets[i].isSet) {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message: this.$t("h.tips113"),
            });
          }
        }
        const LOADING = this.$loading(this.dialogLoading);
        // 权限
        let permissonId = 79;
        if (this.receivedForm._id) permissonId = 81;
        // 填报的资产里面含有自定义资产
        this.receivedAssets.forEach((item) => {
          let obj = {};
          for (let key in item) {
            if (key.length == 32 && item[key] != "") {
              obj[key] = item[key];
              delete item[key];
            }
          }
          item["jsons"] = obj;
          if (item.goalQuota) item.goalQuota = item.goalQuota / 100;
        });
        update({
          func: "U0058",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.receivedForm._id,
            date: this.receivedForm.date,
            estaDate: this.receivedForm.estaDate,
            goodsId: this.receivedForm.goodsId,
            deptId: this.receivedForm.deptId,
            staffId: this.userInfo._id,
            source: this.receivedForm.source,
            assertBeizhu: this.receivedForm.assertBeizhu,
            asset: this.receivedAssets,
            num: 1,
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newBillsDialogVisible = false;
            this.getReceivedBills();
            this.$message.success(data.data);
          })
          .catch(() => {
            this.receivedAssets.forEach((item) => {
              if (item["json"]) {
                for (let key in item["json"]) {
                  item[key] = item["json"][key];
                }
                delete item["json"];
              }
              if (item["goalQuota"])
                item["goalQuota"] = item["goalQuota"] * 100;
            });
            LOADING.close();
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // 高级筛选
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getReceivedBills();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getReceivedBills();
    },
    // 映射高级筛选字段
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
            highFilteritem.name = this.$t("h.creator");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "deptId") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let deptName = this.deptListData.find((deptItem) => {
                return deptItem._id == item;
              }).deptName;
              labels.push(deptName);
            });
            highFilteritem.name = this.$t("h.createDepartment");
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
          } else if (key == "date") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.enteringWarehouseDate");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join("至");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "goodsId") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let goodName = this.goodsListData.find((goodItem) => {
                return goodItem.goodsqId == item;
              }).name;
              labels.push(goodName);
            });
            highFilteritem.name = this.$t("h.assetAttributes");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          }
        }
      }
    },
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm[val.keyStr] = [];
      this.paginationForm.currentPage = 1;
      this.getReceivedBills();
    },
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getReceivedBills();
    },
    // 导出单据弹框关闭
    billsExportDialogVisibleClose() {
      this.$refs.exportFormRef.resetFields();
      this.exportPercentage = 0;
      this.exportStep = "";
      this.exportErrorContent = "";
    },
    // 确认导出单据
    submitExportForm() {
      this.exportStep = "loading";
      this.exportPercentage = 50;
      if (this.exportForm.date == null) this.exportForm.date = [];
      if (this.exportForm.deptId == null) this.exportForm.deptId = [];
      update({
        func: "U0050",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          deptId: this.exportForm.deptId.join(","),
          staffId: this.exportForm.staffId.join(","),
          status: this.exportForm.status.join(","),
          date: this.exportForm.date.join(","),
          goodsId: this.exportForm.goodsId.join(","),
          permissonId: 79,
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
    // downloadImportFile() {
    //   clickDownloadLink(window.$EXCEL_URL + "固定资产资产导入模板.xlsx");
    // },
    // readDialogVisibleClosed() {
    //   this.setp = "upload";
    //   this.percentage = 0;
    //   this.errorText = "";
    // },
    // readDialogVisibleSubmit() {
    //   this.readDialogVisible = false;
    // },
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
          permissonId: 81,
        },
      })
        .then(({ data }) => {
          this.uploadImgLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.$message.success(data.data);
          this.$refs[`uploadPopoverRef-${row._id}`].doClose();
          this.getReceivedBills();
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
    deleteReceivedBills() {
      if (this.selectReceivedBills.length == 0) {
        return this.$message.error(this.$t("h.tips22"));
      } else {
        for (let i = 0; i < this.selectReceivedBills.length; i++) {
          if (this.selectReceivedBills[i].status != -1) {
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
      if (index > this.selectReceivedBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getReceivedBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips118"));
        }
        return;
      }
      deleteData({
        func: "D0013",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectReceivedBills[index]._id,
          permissonId: 80,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            let assetNames = [];
            this.selectReceivedBills[index].asset.forEach((el) =>
              assetNames.push(el.name)
            );
            this.deleteErrorData.push({
              roleRule: this.selectReceivedBills[index].roleRule,
              assetNames: assetNames.join(","),
              reason: data.data,
            });
          }
          this.multiDeleteBill(++index);
        })
        .catch(() => {
          let assetNames = [];
          this.selectReceivedBills[index].asset.forEach((el) =>
            assetNames.push(el.name)
          );
          this.deleteErrorData.push({
            roleRule: this.selectReceivedBills[index].roleRule,
            assetNames: assetNames.join(","),
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
          type: "RK",
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.billPrintTemplate = data.data;
          this.receivedTemplateId = localStorage.getItem("receivedTemplateId");
          if (
            !this.billPrintTemplate.some(
              (item) => item._id == this.receivedTemplateId
            )
          ) {
            this.receivedTemplateId = this.billPrintTemplate[0]._id;
            localStorage.setItem("receivedTemplateId", this.receivedTemplateId);
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips119"));
        });
    },
    setBillPrintTemplate(id) {
      this.receivedTemplateId = id;
      window.localStorage.setItem("receivedTemplateId", id);
    },
    goPrintBills() {
      if (this.selectReceivedBills.length == 0)
        return this.$message.error(this.$t("h.tips22"));
      if (this.selectReceivedBills.length > 10)
        return this.$message.error(
          this.$t("h.tips44") + "10" + this.$t("h.tips45")
        );
      this.$refs["vpdRef"].voucherPrintDialogVisible = true;
    },
    bulkBillsDialogOpened() {
      this.$refs.bulkReceivedFormRef.clearValidate();
    },
    bulkBillsDialogClose() {
      this.receivedAssets = [];
      this.receivedForm._id = null;
      this.receivedForm.assertBeizhu = "";
      this.receivedForm.date = "";
      this.receivedForm.deptId = "";
      this.receivedForm.estaDate = "";
      this.receivedForm.goodsId = "";
      this.receivedForm.source = "";
      this.receivedForm.staffName = "";
      this.file.name = "";
      this.file.value = "";
      this.$refs.billsTableRef.$refs.dsTableRef.clearSelection();
    },
    sbumitBulkReceivedForm() {
      this.$refs.bulkReceivedFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.file.value) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips120"),
          });
        }
        const LOADING = this.$loading(this.bulkLoading);
        update({
          func: "U0058",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.receivedForm._id,
            date: this.receivedForm.date,
            estaDate: this.receivedForm.estaDate,
            goodsId: this.receivedForm.goodsId,
            deptId: this.receivedForm.deptId,
            staffId: this.userInfo._id,
            source: this.receivedForm.source,
            assertBeizhu: this.receivedForm.assertBeizhu,
            Base64: this.file.value,
            num: 1,
            permissonId: 79,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.bulkBillsDialogVisible = false;
            this.getReceivedBills();
            this.$message.success(data.data);
          })
          .catch(() => {
            LOADING.close();
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    downloadImportFile() {
      const LOADING = this.$loading(this.bulkLoading);
      select({
        func: "S0068",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          LOADING.close();
          if (data.code != 0) return this.$message.error(data.data);
          clickDownloadLink(window.$EXCEL_URL + data.data);
        })
        .catch(() => {
          LOADING.close();
        });
    },
  },
  created() {
    this.getReceivedBills();
    this.getGoodsAttributeListData();
    this.getDeptData();
    this.getBillPrintTemplate();
  },
};
</script>
<style lang="scss" scoped>
.received {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .received-card {
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
.received-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.received-card-content {
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
    height: 650px;
  }
}
.popover-cotent {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
