<template>
  <div class="scrap">
    <el-card class="scrap-card">
      <div slot="header" class="scarp-card-header">
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
                <el-dropdown-item @click.native="editScrapForm">{{
                  $t("h.changeBtn")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="deleteScrapBills">{{
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
            <el-button
              size="small"
              :disabled="isDisabled"
              @click="regainScrapAssets()"
              >{{ $t("h.restoreBtn") }}</el-button
            >
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
      <div class="scarp-card-content">
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
            :tableData="scraptBills"
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
        <div class="bills-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getScrapBills"
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
        <el-form-item :label="$t('h.responsiblePerson')" prop="staffId">
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
        <el-form-item :label="$t('h.liquidationDepartment')" prop="deptId">
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
        <el-form-item :label="$t('h.liquidationDate')" prop="destroyData">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filterForm.destroyData"
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
        <el-form-item :label="$t('h.responsiblePerson')" prop="staffId">
          <!-- <el-select
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
        <el-form-item :label="$t('h.liquidationDepartment')" prop="deptId">
          <ds-select-tree
            v-model="exportForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.department')"
            :multiple="true"
            :checkStrictly="true"
            :treeData="treeDepts"
            :defaultProps="deptTreeProps"
            collapseTags
          >
          </ds-select-tree>
        </el-form-item>
        <el-form-item :label="$t('h.auditStatus')" prop="status">
          <el-select
            v-model="exportForm.status"
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
        <el-form-item :label="$t('h.liquidationDate')" prop="destroyData">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="exportForm.destroyData"
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
      @sbumitForm="sbumitScrapForm"
    >
      <template slot="form">
        <el-form
          ref="scrapFormRef"
          label-width="130px"
          :model="scrapForm"
          :rules="scrapFormRules"
        >
          <el-form-item
            :label="$t('h.responsiblePerson')"
            prop="staffId"
            v-if="newBillsDialogVisible"
          >
            <el-select
              ref="staffSelectRef"
              v-model="scrapForm.staffId"
              :placeholder="$t('h.tips4') + $t('h.responsiblePerson')"
              clearable
              filterable
              :filter-method="() => {}"
              @change="staffSelectChange"
              v-load-more="{
                options: staffData,
                modelField: '_id',
                model: scrapForm.staffId,
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
          <el-form-item :label="$t('h.liquidationDepartment')" prop="deptId">
            <ds-select-tree
              v-model="scrapForm.deptId"
              :placeholder="$t('h.tips4') + $t('h.liquidationDepartment')"
              :defaultProps="deptTreeProps"
              :treeData="treeDepts"
              @input="deptInput"
            >
            </ds-select-tree>
          </el-form-item>
          <el-form-item :label="$t('h.liquidationDate')" prop="destroyData">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="scrapForm.destroyData"
              :placeholder="$t('h.tips4') + $t('h.liquidationDate')"
            >
            <!-- format="yyyy 年 MM 月 dd 日" -->
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('h.scrapReason')" prop="scrapId">
            <el-select
              v-model="scrapForm.scrapId"
              :placeholder="$t('h.tips4') + $t('h.scrapReason')"
              ref="scrapReasonRef"
              filterable
            >
              <el-option
                v-for="item in scrapReasonData"
                :key="item._id"
                :label="item.scrapResult"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('h.comment')" prop="destroyBeizhu">
            <el-input v-model="scrapForm.destroyBeizhu"></el-input>
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
      :deptData="depts"
      :deptTreeData="treeDepts"
      @save="savaSelectAssets"
    ></match-assets-dialog>
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <ds-delete-detail
      :deleteDialogVisible.sync="regainDialogVisible"
      :deleteColumns="regainColumns"
      :deleteErrorData="regainErrorData"
      @closed="regainDialogVisibleClosed"
    ></ds-delete-detail>
    <bill-print-template
      ref="vptRef"
      :title="`${$t('h.title70')}`"
      :selectId="scrapTemplateId"
      :voucherPrintTempList="billPrintTemplate"
      @setVoucherTag="setBillPrintTemplate"
    ></bill-print-template>
    <bill-print-dialog
      ref="vpdRef"
      locationName="scrapTemplateId"
      :voucherData="selectScrapBills"
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
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import UploadPhoto from "@/components/ListComponents/NewAssetDialog/UploadPhoto";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsFilterTag from "@/components/DsFilterTag";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsSelectTree from "@/components/DsSelectTree";
import BillsExportDialog from "@/components/BillsComponents/BillsExportDialog";
import BillDetailDialog from "@/components/BillsComponents/BillDetailDialog";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import MatchAssetsDialog from "@/components/BillsComponents/MatchAssetsDialog";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { mapState } from "vuex";
import {
  scrapBillsColumns,
  statusListData,
  scrapDetailCell,
  deleteBillsErrorColumns,
  regainScrapErrorColumns,
} from "@/utils/systemData";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import {
  clickDownloadLink,
  countTableHeaderWidth,
  getTodayDate,
} from "@/utils/basic-methods";
import { deleteData, select, update } from "@/assets/api";
export default {
  components: {
    AssetPrintDialog,
    BillPrintDialog,
    BillPrintTemplate,
    DsDeleteDetail,
    DsTable,
    UploadPhoto,
    DsPagination,
    DsFilterDrawer,
    DsSearchBtn,
    DsSelectTree,
    BillDetailDialog,
    BillsExportDialog,
    NewBillsDialog,
    MatchAssetsDialog,
    DsFilterTag,
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
      billsTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      billsColums: scrapBillsColumns,
      scraptBills: [],
      selectScrapBills: [],
      filterDrawerVisible: false,
      filterForm: {
        staffId: [],
        deptId: [],
        status: [],
        destroyData: [],
      },
      andLike: "",
      highFilterTags: [],
      statusListData: statusListData,
      staffData: [],
      deptTreeProps: {
        value: "_id",
        label: "deptName",
        children: "children",
      },
      treeDepts: [],
      depts: [],
      uploadImgLoading: false,
      billPhotoFile: "",
      billsExportDialogVisible: false,
      exportPercentage: 0,
      exportStep: "",
      exportErrorContent: "",
      exportForm: {
        staffId: [],
        deptId: [],
        status: [],
        destroyData: [],
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
      newBillTitle: this.$t("h.title71"),
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      scrapForm: {
        _id: "",
        deptId: "", //部门id
        staffId: "", //员工id1
        scrapId: "", //报废原因id
        destroyData: getTodayDate(), //报废日期
        destroyBeizhu: "", //备注
      },
      scrapFormRules: {
        deptId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.department"),
            trigger: "change",
          },
        ],
        staffId: [
          { required: true, message: this.$t("h.tips4"), trigger: "change" },
        ],
        scrapId: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.scrapReason"),
            trigger: "change",
          },
        ],
        destroyData: [
          {
            type: "string",
            required: true,
            message: this.$t("h.tips4") + this.$t("h.finishDate"),
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
      scrapReasonData: [],
      deleteDialogVisible: false,
      deleteColumns: deleteBillsErrorColumns,
      deleteErrorData: [],
      regainDialogVisible: false,
      regainColumns: regainScrapErrorColumns,
      regainErrorData: [],
      billPrintTemplate: [],
      scrapTemplateId: "",
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
    isDisabled() {
      if (this.selectScrapBills.length == 0) {
        return true;
      } else if (this.selectScrapBills.length == 1) {
        if (this.selectScrapBills[0].status != 0) return true;
      } else {
        for (let i = 0; i < this.selectScrapBills.length; i++) {
          if (this.selectScrapBills[i].status != 0) {
            return true;
          }
        }
      }
      return false;
    },
  },
  methods: {
    getScrapBills() {
      this.tableLoading = true;
      if (this.filterForm.deptId == null) this.filterForm.deptId = [];
      if (this.filterForm.destroyData == null) this.filterForm.destroyData = [];
      select({
        func: "S0011",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          staffId: this.filterForm.staffId.join(","),
          deptId: this.filterForm.deptId.join(","),
          status: this.filterForm.status.join(","),
          destroyData: this.filterForm.destroyData.join(","),
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.scraptBills = data.data[1] || [];
          this.scraptBills.forEach((item) => {
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
    getScrapReason() {
      select({
        func: "S0012",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.scrapReasonData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
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
          this.getScrapBills();
        })
        .catch(() => {
          this.uploadImgLoading = false;
          return this.$message.error(this.$t("h.tips18"));
        });
    },
    handleSelectionChange(val) {
      this.selectScrapBills = val;
    },
    checkBillDetail(val) {
      this.billFormDetail = scrapDetailCell(val);
      this.billDetaulVal = val;
      this.detailMatchAssetIds = val.assetIds.split(",");
      if (this.detailMatchAssetIds.length) {
        this.getMatchAssets();
      }
      this.getBillsAuditMessage(val);
      this.billDetailDialogVisible = true;
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
    // staffRemoteMethod(query) {
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
            highFilteritem.name = this.$t("h.responsiblePerson");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "deptId") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let deptName = this.depts.find((el) => el._id == item).deptName;
              labels.push(deptName);
            });
            highFilteritem.name = this.$t("h.liquidationDepartment");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "status") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let label = this.statusListData.find(
                (el) => el.value == item
              ).label;
              labels.push(label);
            });
            highFilteritem.name = this.$t("h.auditStatus");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "destroyData") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.liquidationDate");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join(this.$t('h.to'));
            this.highFilterTags.push(highFilteritem);
          }
        }
      }
    },
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm[val.keyStr] = [];
      this.paginationForm.currentPage = 1;
      this.getScrapBills();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getScrapBills();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getScrapBills();
    },
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getScrapBills();
    },
    billsExportDialogVisibleClose() {
      this.$refs.exportFormRef.resetFields();
      this.exportPercentage = 0;
      this.exportStep = "";
      this.exportErrorContent = "";
    },
    submitExportForm() {
      this.exportStep = "loading";
      this.exportPercentage = 50;
      if (this.exportForm.destroyData == null) this.exportForm.destroyData = [];
      if (this.exportForm.deptId == null) this.exportForm.deptId = [];
      update({
        func: "U0035",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          staffId: this.exportForm.staffId.join(","),
          deptId: this.exportForm.deptId.join(","),
          status: this.exportForm.status.join(","),
          destroyData: this.exportForm.destroyData.join(","),
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
          type: "BF",
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
    newBillsDialogOpened() {
      this.$refs.scrapFormRef.clearValidate();
      this.$refs.billAssetsRef.$refs.dsTableRef.clearSelection();
    },
    newBillsDialogClose() {
      this.selectBillAssets = [];
      this.billAssets = [];
      this.assetIdsState = [];
      this.scrapForm._id = "";
      this.scrapForm.deptId = "";
      this.scrapForm.staffId = "";
      this.scrapForm.destroyBeizhu = "";
      this.scrapForm.destroyData = "";
      this.scrapForm.scrapId = "";
      this.newBillTitle = this.$t("h.title71");
      this.$refs.billsTableRef.$refs.dsTableRef.clearSelection();
    },
    deptInput(val) {
      if (!val) return false;
      let matchStaffData = this.staffData.filter((item) => item.deptId == val);
      if (matchStaffData.length) {
        let matchStaff = matchStaffData.find(
          (item) => item._id == this.scrapForm.staffId
        );
        if (!matchStaff) this.scrapForm.staffId = "";
        return;
      } else {
        this.scrapForm.staffId = "";
      }
    },
    staffSelectChange(val) {
      if (!val) return false;
      this.scrapForm.deptId = this.staffData.find(
        (item) => item._id == val
      ).deptId;
    },
    billAssetsSelectionChange(val) {
      this.selectBillAssets = val;
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
    sbumitScrapForm() {
      this.$refs.scrapFormRef.validate((valid) => {
        if (!valid) return false;
        if (!this.billAssets.length) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips112"),
          });
        }
        const LOADING = this.$loading(this.dialogLoading);
        let permissonId = this.scrapForm._id == "" ? 40 : 42;
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
          func: "U0012",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.scrapForm._id,
            assetIds: assetIdsArr.join(","),
            assetNames: assetNamesArr.join(","),
            assertCodes: assertCodesArr.join(","),
            deptId: this.scrapForm.deptId,
            staffId: this.scrapForm.staffId, // 员工id
            destroyData: this.scrapForm.destroyData, //清理日期
            scrapId: this.scrapForm.scrapId, // 报废原因id
            destroyOpera: this.userInfo.staffName, // 操办人
            destroyBeizhu: this.scrapForm.destroyBeizhu, //备注
            destroyState: "4",
            fromState: fromStateArr.join(","),
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newBillsDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getScrapBills();
          })
          .catch(() => {
            LOADING.close();
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    savaSelectAssets(val) {
      this.billAssets = val;
      this.matchAssetsDialogVisible = false;
    },
    editScrapForm() {
      if (!this.selectScrapBills.length || this.selectScrapBills.length > 1) {
        return this.$message.error(this.$t("h.tips110"));
      }
      if (this.selectScrapBills[0].status != -1) {
        return this.$message.error(this.$t("h.tips111"));
      }
      // this.getMatchEditStaff(this.selectScrapBills[0].staffId);
      this.getMatchEditAssets(this.selectScrapBills[0].assetIds);
      this.scrapForm._id = this.selectScrapBills[0]._id;
      this.scrapForm.deptId = this.selectScrapBills[0].deptId;
      this.scrapForm.staffId = this.selectScrapBills[0].staffId;
      this.scrapForm.scrapId = this.selectScrapBills[0].scrapId;
      this.scrapForm.destroyData = this.selectScrapBills[0].destroyData;
      this.scrapForm.destroyBeizhu = this.selectScrapBills[0].destroyBeizhu;
      // 记录之前资产状态的逻辑
      let assetIdsArr = this.selectScrapBills[0].assetIds.split(",");
      let stateArr = this.selectScrapBills[0].fromState.split(",");
      assetIdsArr.forEach((item, index) => {
        this.assetIdsState.push({
          _id: assetIdsArr[index],
          state: stateArr[index],
        });
      });
      this.newBillTitle = this.$t("h.title72");
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
    deleteScrapBills() {
      if (this.selectScrapBills.length == 0) {
        return this.$message.error(this.$t("h.tips22"));
      } else {
        for (let i = 0; i < this.selectScrapBills.length; i++) {
          if (this.selectScrapBills[i].status != -1) {
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
      if (index > this.selectScrapBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getScrapBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips118"));
        }
        return;
      }
      deleteData({
        func: "D0011",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectScrapBills[index]._id,
          permissonId: 41,
        },
      })
        .then(({ data }) => {
          if (data.code != 0)
            this.deleteErrorData.push({
              roleRule: this.selectScrapBills[index].roleRule,
              assetNames: this.selectScrapBills[index].assetNames,
              reason: data.data,
            });
          this.multiDeleteBill(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            roleRule: this.selectScrapBills[index].roleRule,
            assetNames: this.selectScrapBills[index].assetNames,
            reason: this.$t("h.tips18"),
          });
          this.multiDeleteBill(++index);
        });
    },
    regainDialogVisibleClosed() {
      this.regainErrorData = [];
    },
    regainScrapAssets() {
      this.tableLoading = true;
      this.regainErrorData = [];
      this.multiRegainBill(0);
    },
    multiRegainBill(index) {
      if (index > this.selectScrapBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getScrapBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.regainErrorData.length) {
          this.regainDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips127"));
        }
        return;
      }
      deleteData({
        func: "D0019",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectScrapBills[index]._id,
          permissonId: 43,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.regainErrorData.push({
              roleRule: this.selectScrapBills[index].roleRule,
              assetNames: this.selectScrapBills[index].assetNames,
              reason: data.data,
            });
          }
          this.multiRegainBill(++index);
        })
        .catch(() => {
          this.regainErrorData.push({
            roleRule: this.selectScrapBills[index].roleRule,
            assetNames: this.selectScrapBills[index].assetNames,
            reason: this.$t("h.tips18"),
          });
          this.multiRegainBill(++index);
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
          type: "BF",
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.billPrintTemplate = data.data;
          this.scrapTemplateId = localStorage.getItem("scrapTemplateId");
          if (
            !this.billPrintTemplate.some(
              (item) => item._id == this.scrapTemplateId
            )
          ) {
            this.scrapTemplateId = this.billPrintTemplate[0]._id;
            localStorage.setItem("scrapTemplateId", this.scrapTemplateId);
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips119"));
        });
    },
    setBillPrintTemplate(id) {
      this.scrapTemplateId = id;
      window.localStorage.setItem("scrapTemplateId", id);
    },
    goPrintBills() {
      if (this.selectScrapBills.length == 0)
        return this.$message.error(this.$t("h.tips121"));
      if (this.selectScrapBills.length > 10)
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
    this.getScrapBills();
    this.getDepts();
    this.getScrapReason();
    this.getBillPrintTemplate();
  },
};
</script>
<style lang="scss" scoped>
.scrap {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .scrap-card {
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
.scarp-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.scarp-card-content {
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
