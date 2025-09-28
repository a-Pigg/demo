<template>
  <div class="task">
    <el-card class="task-card">
      <el-tabs
        v-model="classActiveName"
        :before-leave="tabsClassBeforeLeave"
        class="task-tabs-box"
      >
        <!-- 资产 -->
        <el-tab-pane :label="$t('h.asset')" name="asset">
          <el-tabs
            v-model="activeName"
            :before-leave="tabsBeforeLeave"
            class="task-tabs"
          >
            <el-tab-pane :label="$t('h.pending')" name="pending">
              <div class="pending-header">
                <ds-query-form>
                  <ds-query-form-left-panel>
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-circle-check"
                      :disabled="isDisabled"
                      @click="resolvelPendingBills"
                      >{{ $t("h.passBtn") }}</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-circle-close"
                      :disabled="isDisabled"
                      @click="rejectPendingBills"
                      >{{ $t("h.rejectBtn") }}</el-button
                    >
                  </ds-query-form-left-panel>
                  <ds-query-form-right-panel>
                    <el-select
                      size="mini"
                      v-model="pendingBillsType"
                      filterable
                      :placeholder="$t('h.tips4') + $t('h.doucmentType')"
                      @change="getPendingBills"
                    >
                      <el-option
                        v-for="item in billTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <ds-search :value.sync="pendingSearchValue"></ds-search>
                  </ds-query-form-right-panel>
                </ds-query-form>
              </div>
              <div class="pending-content">
                <div class="bills-table">
                  <ds-table
                    ref="pendingTableRef"
                    :loading="pendingLoading"
                    :tableConfig="pendingTableConfig"
                    :columns="billsColums"
                    :tableData="
                      pendingTables.slice(
                        (pendingPagForm.currentPage - 1) *
                          pendingPagForm.pageSize,
                        pendingPagForm.currentPage * pendingPagForm.pageSize
                      )
                    "
                    :rowKey="(row) => row.roleRule"
                    @handleSelectionChange="handleSelectionChange"
                    @checkTableRowDetail="checkBillDetail"
                  ></ds-table>
                </div>
                <div class="bills-pagination">
                  <ds-pagination
                    small
                    :total="pendingTables.length"
                    :page.sync="pendingPagForm.currentPage"
                    :limit.sync="pendingPagForm.pageSize"
                    @pagination="getPendingBills"
                  ></ds-pagination>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('h.approved')" name="finished">
              <div class="finished-header">
                <ds-query-form>
                  <ds-query-form-left-panel> </ds-query-form-left-panel>
                  <ds-query-form-right-panel>
                    <el-select
                      size="mini"
                      v-model="finishedBillsType"
                      filterable
                      :placeholder="$t('h.tips4') + $t('h.doucmentType')"
                      @change="getFinishedBills"
                    >
                      <el-option
                        v-for="item in billTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <ds-search :value.sync="finishedSearchValue"></ds-search>
                  </ds-query-form-right-panel>
                </ds-query-form>
              </div>
              <div class="finished-content">
                <div class="bills-table">
                  <ds-table
                    ref="finishedTableRef"
                    :loading="finishedLoading"
                    :tableConfig="{}"
                    :columns="billsColums"
                    :tableData="
                      finishedTables.slice(
                        (finishedPagForm.currentPage - 1) *
                          finishedPagForm.pageSize,
                        finishedPagForm.currentPage * finishedPagForm.pageSize
                      )
                    "
                    :rowKey="(row) => row.roleRule"
                    @checkTableRowDetail="checkBillDetail"
                  ></ds-table>
                </div>
                <div class="bills-pagination">
                  <ds-pagination
                    small
                    :total="finishedTables.length"
                    :page.sync="finishedPagForm.currentPage"
                    :limit.sync="finishedPagForm.pageSize"
                    @pagination="getFinishedBills"
                  ></ds-pagination>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <!-- 物资 -->
        <el-tab-pane :label="$t('h.material')" name="article">
          <el-tabs
            v-model="articleActiveName"
            :before-leave="articleTabsBeforeLeave"
            class="task-tabs"
          >
            <!-- 待审核 -->
            <el-tab-pane :label="$t('h.pending')" name="pending">
              <div class="pending-header">
                <ds-query-form>
                  <ds-query-form-left-panel>
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-circle-check"
                      :disabled="articleIsDisabled"
                      @click="articleResolvelPendingBills"
                      >{{ $t("h.passBtn") }}</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-circle-close"
                      :disabled="articleIsDisabled"
                      @click="articleRejectPendingBills"
                      >{{ $t("h.rejectBtn") }}</el-button
                    >
                  </ds-query-form-left-panel>
                  <ds-query-form-right-panel>
                    <el-select
                      size="mini"
                      v-model="articlePendingBillsType"
                      filterable
                      :placeholder="$t('h.tips4') + $t('h.doucmentType')"
                      @change="getArticlePendingBills"
                    >
                      <el-option
                        v-for="item in articleBillTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <ds-search
                      :value.sync="articlePendingSearchValue"
                    ></ds-search>
                  </ds-query-form-right-panel>
                </ds-query-form>
              </div>
              <div class="pending-content">
                <div class="bills-table">
                  <ds-table
                    ref="articlePendingTableRef"
                    :loading="articlePendingLoading"
                    :tableConfig="pendingTableConfig"
                    :columns="articleBillsColums"
                    :tableData="
                      articlePendingTables.slice(
                        (articlePendingPagForm.currentPage - 1) *
                          articlePendingPagForm.pageSize,
                        articlePendingPagForm.currentPage *
                          articlePendingPagForm.pageSize
                      )
                    "
                    :rowKey="(row) => row.roleRule"
                    @handleSelectionChange="handleArticleSelectionChange"
                    @checkTableRowDetail="checkArticleBillDetail"
                  ></ds-table>
                </div>
                <div class="bills-pagination">
                  <ds-pagination
                    small
                    :total="articlePendingTables.length"
                    :page.sync="articlePendingPagForm.currentPage"
                    :limit.sync="articlePendingPagForm.pageSize"
                    @pagination="getArticlePendingBills"
                  ></ds-pagination>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('h.approved')" name="finished">
              <div class="finished-header">
                <ds-query-form>
                  <ds-query-form-left-panel> </ds-query-form-left-panel>
                  <ds-query-form-right-panel>
                    <el-select
                      size="mini"
                      v-model="articleFinishedBillsType"
                      filterable
                      :placeholder="$t('h.tips4') + $t('h.doucmentType')"
                      @change="getArticleFinishedBills"
                    >
                      <el-option
                        v-for="item in articleBillTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <ds-search
                      :value.sync="articleFinishedSearchValue"
                    ></ds-search>
                  </ds-query-form-right-panel>
                </ds-query-form>
              </div>
              <div class="finished-content">
                <div class="bills-table">
                  <ds-table
                    ref="finishedTableRef"
                    :loading="articleFinishedLoading"
                    :tableConfig="{}"
                    :columns="articleBillsColums"
                    :tableData="
                      articleFinishedTables.slice(
                        (articleFinishedPagForm.currentPage - 1) *
                          articleFinishedPagForm.pageSize,
                        articleFinishedPagForm.currentPage *
                          articleFinishedPagForm.pageSize
                      )
                    "
                    :rowKey="(row) => row.roleRule"
                    @checkTableRowDetail="checkArticleBillDetail"
                  ></ds-table>
                </div>
                <div class="bills-pagination">
                  <ds-pagination
                    small
                    :total="articleFinishedTables.length"
                    :page.sync="articleFinishedPagForm.currentPage"
                    :limit.sync="articleFinishedPagForm.pageSize"
                    @pagination="getArticleFinishedBills"
                  ></ds-pagination>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <ds-delete-detail
      :title="$t('h.title108')"
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <new-bills-dialog
      :title="$t('h.title109')"
      class="new-bill-dialog"
      :newBillsDialogVisible.sync="reasonDialogVisible"
      @closed="reasonDialogVisibleClosed"
      @sbumitForm="reasonDialogVisibleSubmit"
    >
      <template slot="form">
        <el-input
          type="textarea"
          :placeholder="$t('h.tips3') + $t('h.title110')"
          show-word-limit
          v-model="rejectReason"
          rows="5"
        >
        </el-input>
      </template>
    </new-bills-dialog>
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
    <!-- 物资查看详情 -->
    <bill-detail-dialog
      :billDetailDialogVisible.sync="articleBillDetailDialogVisible"
      :billFormDetail="articleBillFormDetail"
      :auditStep="auditStep"
      @closed="articleBillDetailDialogVisibleClosed"
    >
      <template slot="table">
        <ds-table
          ref="articleDetailTableRef"
          :loading="articleDetailLoading"
          :tableData="detailArticle"
          :columns="articleBillAssetsColumns"
          :tableConfig="detailConfig"
          :rowKey="(row) => row._id"
        ></ds-table>
      </template>
      <template slot="pagination">
        <ds-pagination
          small
          :total="articleDetailTotal"
          :page.sync="articleDetailPaginationForm.currentPage"
          :limit.sync="articleDetailPaginationForm.pageSize"
          @pagination="detailPagination"
        ></ds-pagination>
      </template>
    </bill-detail-dialog>
  </div>
</template>
<script>
import BillDetailDialog from "@/components/BillsComponents/BillDetailDialog";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import DsSearch from "@/components/DsSearch";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { mapState } from "vuex";
import {
  billTypes,
  approvalBillsColumns,
  deletePendingErrorColumns,
  repairDetailCell,
  revertDetailCell,
  scrapDetailCell,
  usingDetailCell,
  allocationDetailCell,
  receivedDetailCell,
  borrowDetailCell,
  returnDetailCell,
  articleBillTypes,
  articleApprovalBillsColumns,
  articleDeletePendingErrorColumns,
  articleOutboundTkDetailCell,
  articleWarehousingDetailCell,
  articleOutboundCkDetailCell,
  articleInventoryAdjustmentDetailCell,
  articleConTransferDetailCell,
} from "@/utils/systemData";
import { sortArr, countTableHeaderWidth } from "@/utils/basic-methods";
import { select, update, warehouseOperate } from "@/assets/api";
export default {
  components: {
    BillDetailDialog,
    NewBillsDialog,
    DsDeleteDetail,
    DsSearch,
    DsTable,
    DsPagination,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      activeName: "pending",
      billTypes: billTypes,
      pendingBillsType: "0",
      finishedBillsType: "0",
      billsColums: approvalBillsColumns,
      pendingPagForm: {
        currentPage: 1,
        pageSize: 20,
      },
      pendingLoading: false,
      pendingTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      pendingBills: [],
      selectpendingBills: [],
      finishedPagForm: {
        currentPage: 1,
        pageSize: 20,
      },
      finishedLoading: false,
      finishedBills: [],
      pendingSearchValue: "",
      finishedSearchValue: "",
      deleteDialogVisible: false,
      deleteColumns: deletePendingErrorColumns,
      deleteErrorData: [],
      reasonDialogVisible: false,
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      rejectReason: "",
      billDetailDialogVisible: false,
      billFormDetail: [],
      auditStep: [],
      detailLoading: false,
      detailAssets: [],
      detailMatchAssetIds: [],
      detailConfig: {},
      detailTotal: 0,
      detailPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      classActiveName: "asset",
      articleActiveName: "pending",
      articleBillTypes: articleBillTypes,
      articlePendingBillsType: "ALL",
      articleFinishedBillsType: "ALL",
      articleBillsColums: articleApprovalBillsColumns,
      articlePendingPagForm: {
        currentPage: 1,
        pageSize: 20,
      },
      articlePendingLoading: false,
      articlePendingBills: [],
      articleSelectpendingBills: [],

      articleFinishedPagForm: {
        currentPage: 1,
        pageSize: 20,
      },
      articleFinishedLoading: false,
      articleFinishedBills: [],
      articlePendingSearchValue: "",
      articleFinishedSearchValue: "",
      articleDeleteColumns: articleDeletePendingErrorColumns,
      articleDeleteErrorData: [],
      articleBillDetailDialogVisible: false,
      articleBillFormDetail: [],
      articleDetailLoading: false,
      detailArticle: [],
      detailArticleMatchAssetIds: [],
      articleDetailTotal: 0,
      articleDetailPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
    };
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader"]),
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
    isDisabled() {
      if (!this.selectpendingBills.length) return true;
      return false;
    },
    pendingTables() {
      const search = this.pendingSearchValue;
      if (search) {
        return this.pendingBills.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search) > -1;
          });
        });
      }
      return this.pendingBills;
    },
    finishedTables() {
      const search = this.finishedSearchValue;
      if (search) {
        return this.finishedBills.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search) > -1;
          });
        });
      }
      return this.finishedBills;
    },
    articleBillAssetsColumns() {
      let columns = [];
      columns.push({
        prop: "code",
        label: this.$t("h.title166"),
        fixed: "fixed",
        minWidth: countTableHeaderWidth(this.$t("h.title166")),
        showOverflowTooltip: true,
      });
      columns.push({
        prop: "name",
        label: this.$t("h.formTips38"),
        fixed: "fixed",
        minWidth: countTableHeaderWidth(this.$t("h.formTips38")),
        showOverflowTooltip: true,
      });
      columns.push({
        prop: "specification",
        label: this.$t("h.tips48"),
        fixed: "fixed",
        minWidth: countTableHeaderWidth(this.$t("h.tips48")),
        showOverflowTooltip: true,
      });
      columns.push({
        prop: "epc",
        label: "epc",
        fixed: "fixed",
        minWidth: countTableHeaderWidth("epc"),
        showOverflowTooltip: true,
      });
      columns.push({
        prop: "price",
        label: this.$t("h.price"),
        fixed: "fixed",
        minWidth: countTableHeaderWidth(this.$t("h.price")),
        showOverflowTooltip: true,
      });
      columns.push({
        type: "image",
        prop: "image",
        label: this.$t("h.columns71"),
        fixed: "fixed",
        width: countTableHeaderWidth(this.$t("h.columns71")),
      });
      return columns;
    },
    articleIsDisabled() {
      if (!this.articleSelectpendingBills.length) return true;
      return false;
    },
    articlePendingTables() {
      const search = this.articlePendingSearchValue;
      if (search) {
        return this.articlePendingBills.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search) > -1;
          });
        });
      }
      return this.articlePendingBills;
    },
    articleFinishedTables() {
      const search = this.articleFinishedSearchValue;
      if (search) {
        return this.articleFinishedBills.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search) > -1;
          });
        });
      }
      return this.articleFinishedBills;
    },
  },
  methods: {
    // 映射函数
    mapFunc(arr) {
      arr.forEach((item) => {
        switch (item.roleRule.slice(0, 2)) {
          case "LY":
            item.type = this.$t("h.columns16");
            item.applyDate = item.receiveData;
            item.typeStr = "LY";
            break;
          case "TK":
            item.type = this.$t("h.columns17");
            item.applyDate = item.date;
            item.typeStr = "TK";
            break;
          case "JY":
            item.type = this.$t("h.columns18");
            item.applyDate = item.borrowData;
            item.typeStr = "JY";
            break;
          case "BF":
            item.type = this.$t("h.columns19");
            item.applyDate = item.destroyData;
            item.typeStr = "BF";
            break;
          case "WX":
            item.type = this.$t("h.columns20");
            item.applyDate = item.receiveData;
            item.typeStr = "WX";
            break;
          case "ZY":
            item.type = this.$t("h.columns21");
            item.applyDate = item.date;
            item.typeStr = "ZY";
            break;
          case "RK":
            item.type = this.$t("h.columns22");
            item.applyDate = item.estaDate;
            item.typeStr = "RK";
            break;
          case "GH":
            item.type = this.$t("h.columns23");
            item.applyDate = item.date;
            item.typeStr = "GH";
        }
      });
    },
    articleMapFunc(arr) {
      arr.forEach((item) => {
        switch (item.roleRule.slice(0, 2)) {
          case "TK":
            item.type = this.$t("h.title234");
            item.applyDate = item.receiveData;
            item.typeStr = "TK";
            break;
          case "RK":
            item.type = this.$t("h.title235");
            item.applyDate = item.date;
            item.typeStr = "RK";
            break;
          case "CK":
            item.type = this.$t("h.title236");
            item.applyDate = item.borrowData;
            item.typeStr = "CK";
            break;
          case "TZ":
            item.type = this.$t("h.title237");
            item.applyDate = item.destroyData;
            item.typeStr = "TZ";
            break;
          case "DB":
            item.type = this.$t("h.title238");
            item.applyDate = item.receiveData;
            item.typeStr = "DB";
            break;
        }
      });
    },
    tabsClassBeforeLeave(val) {
      if (val == "asset") {
        if (this.activeName == "finished") {
          this.getFinishedBills();
        } else {
          this.getPendingBills();
        }
      } else {
        if (this.articleActiveName == "finished") {
          this.getArticleFinishedBills();
        } else {
          this.getArticlePendingBills();
        }
      }
    },
    getPendingBills() {
      this.pendingLoading = true;
      select({
        func: "S0023",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          assetUpId: this.pendingBillsType,
        },
      })
        .then(({ data }) => {
          this.pendingLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          if (data.data instanceof Array) {
            this.mapFunc(data.data);
            data.data.forEach((item) => {
              if (item.asset) {
                let assetNames = [];
                item.asset.forEach((assetItem) => {
                  assetNames.push(assetItem.name);
                });
                item.assetNames = assetNames.join(",");
              }
            });
            data.data.sort((a, b) => {
              // return (
              //   Date.parse(b.applyDate.replace(/-/g, "/")) -
              //   Date.parse(a.applyDate.replace(/-/g, "/"))
              // );
              return b.applyDate > a.applyDate ? 1 : -1;
            });
            this.pendingBills = data.data;
          } else {
            this.pendingBills = [];
          }
        })
        .catch((err) => {
          console.log(err);
          this.pendingLoading = false;
          // "误,获取待审批单据失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    handleSelectionChange(val) {
      this.selectpendingBills = val;
    },
    getFinishedBills() {
      this.finishedLoading = true;
      select({
        func: "S0025",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          assetUpId: this.finishedBillsType,
        },
      })
        .then(({ data }) => {
          console.log(data);
          this.finishedLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          if (data.data == "无已审核任务") {
            data.data = [];
          } else {
            this.mapFunc(data.data);
            data.data.forEach((item) => {
              if (item.asset) {
                let assetNames = [];
                item.asset.forEach((assetItem) => {
                  assetNames.push(assetItem.name);
                });
                item.assetNames = assetNames.join(",");
              }
            });
            data.data.sort((a, b) => {
              // return (
              //   Date.parse(b.applyDate.replace(/-/g, "/")) -
              //   Date.parse(a.applyDate.replace(/-/g, "/"))
              // );
              return b.applyDate > a.applyDate ? 1 : -1;
            });
          }
          this.finishedBills = data.data;
        })
        .catch((err) => {
          console.log(err);
          this.finishedLoading = false;
          // "服务器网络错误,获取已审批单据失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    tabsBeforeLeave(val) {
      if (val == "finished") {
        this.getFinishedBills();
      } else {
        this.getPendingBills();
      }
    },
    getArticlePendingBills() {
      this.articlePendingLoading = true;
      warehouseOperate({
        func: "NEX0001",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          result: this.articlePendingBillsType,
        },
      })
        .then(({ data }) => {
          this.articlePendingLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          if (data.data instanceof Array) {
            this.articleMapFunc(data.data);
            data.data.forEach((item) => {
              if (item.list) {
                let materialNames = [];
                item.list.forEach((materialItem) => {
                  materialNames.push(materialItem.name);
                });
                item.materialNames = materialNames.join(",");
              }
            });
            data.data.sort((a, b) => {
              // return (
              //   Date.parse(b.applyDate.replace(/-/g, "/")) -
              //   Date.parse(a.applyDate.replace(/-/g, "/"))
              // );
              return b.applyDate > a.applyDate ? 1 : -1;
            });
            console.log("this.articlePendingBills = data.data;");
            this.articlePendingBills = data.data;
            console.log(this.articlePendingBills);
          } else {
            this.articlePendingBills = [];
          }
        })
        .catch((err) => {
          console.log(err);
          this.articlePendingLoading = false;
          // 服务器网络错误,获取待审批单据失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    //多选
    handleArticleSelectionChange(val) {
      // console.log('aaaa',val)

      this.articleSelectpendingBills = val;

      let requestBills = sortArr(this.articleSelectpendingBills, "type");
      let requestBills2 = sortArr(this.articleSelectpendingBills, "typeStr");
      console.log("sortArr排序type", requestBills);
      console.log("sortArr排序typeStr", requestBills2);
      console.log("多选", this.articleSelectpendingBills);
    },
    getArticleFinishedBills() {
      this.articleFinishedLoading = true;
      warehouseOperate({
        func: "YEX0001",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          result: this.articleFinishedBillsType,
        },
      })
        .then(({ data }) => {
          this.articleFinishedLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          if (data.data == "无已审核任务" || !data.data) {
            data.data = [];
          } else {
            this.articleMapFunc(data.data);
            data.data.forEach((item) => {
              if (item.list) {
                let materialNames = [];
                item.list.forEach((materialItem) => {
                  materialNames.push(materialItem.name);
                });
                item.materialNames = materialNames.join(",");
              }
            });
            data.data.sort((a, b) => {
              // return (
              //   Date.parse(b.applyDate.replace(/-/g, "/")) -
              //   Date.parse(a.applyDate.replace(/-/g, "/"))
              // );
              return b.applyDate > a.applyDate ? 1 : -1;
            });
          }
          this.articleFinishedBills = data.data;
        })
        .catch((err) => {
          console.log(err);
          this.articleFinishedLoading = false;
          // 服务器网络错误,获取已审批单据失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    articleTabsBeforeLeave(val) {
      if (val == "finished") {
        this.getArticleFinishedBills();
      } else {
        this.getArticlePendingBills();
      }
    },
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    resolvelPendingBills() {
      this.pendingLoading = true;
      this.deleteErrorData = [];
      let requestBills = sortArr(this.selectpendingBills, "typeStr");
      this.multiPassBill(0, requestBills);
    },
    multiPassBill(index, arr) {
      if (index > arr.length - 1) {
        this.pendingPagForm.currentPage = 1;
        this.getPendingBills();
        this.$refs["pendingTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips181"));
        }
        return;
      }
      console.log(index);
      let housOutIds = [];
      let assetUpId = "";
      arr[index].forEach((el, j) => {
        if (j == 0 && el.roleRule.slice(0, 2) == "LY") {
          assetUpId = "1";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "TK") {
          assetUpId = "2";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "JY") {
          assetUpId = "3";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "BF") {
          assetUpId = "4";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "WX") {
          assetUpId = "5";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "ZY") {
          assetUpId = "6";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "RK") {
          assetUpId = "7";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "GH") {
          assetUpId = "8";
        }
        if (el.roleRule.slice(0, 2) == "GH") housOutIds.push(el.revertId);
        else housOutIds.push(el._id);
      });
      update({
        func: "U0025",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          housOutIds: housOutIds.join(","),
          signatureId: this.userInfo._id,
          assetUpId: assetUpId,
          permissonId: 67,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              type: assetUpId,
              reason: data.data,
            });
          }
          this.multiPassBill(++index, arr);
        })
        .catch(() => {
          this.deleteErrorData.push({
            type: assetUpId,
            // "服务器网络错误，审核失败"
            reason: this.$t("h.tips18"),
          });
          this.multiPassBill(++index, arr);
        });
    },
    rejectPendingBills() {
      this.reasonDialogVisible = true;
    },
    //通过审核
    // articleResolvelPendingBills() {
    //   this.articlePendingLoading = true;
    //   console.log("通过审核前", this.articleSelectpendingBills);
    //   // let requestBills = sortArr(this.articleSelectpendingBills, "typeStr");
    //   let passPromises = [];
    //   requestBills.forEach((item) => {
    //     let housOutIds = [];
    //     let types = "";
    //     // item.forEach((el, index) => {
    //     //判断审核类型 出库 入库 调拨
    //     if (index == 0 && el.roleRule.slice(0, 3) == "CYS") {
    //       types = "TK";
    //     } else if (index == 0 && el.roleRule.slice(0, 3) == "CIS") {
    //       types = "RK";
    //     } else if (index == 0 && el.roleRule.slice(0, 3) == "CRE") {
    //       types = "CK";
    //     } else if (index == 0 && el.roleRule.slice(0, 3) == "CAS") {
    //       types = "TZ";
    //     } else if (index == 0 && el.roleRule.slice(0, 3) == "CTR") {
    //       types = "DB";
    //     }
    //     if (el.allocateId) {
    //       housOutIds.push(el.allocateId);
    //     } else if (el.adjustId) {
    //       housOutIds.push(el.adjustId);
    //     } else {
    //       housOutIds.push(el.warehousingId);
    //     }
    //     // });
    //     passPromises.push(
    //       new Promise((resolve, reject) => {
    //         warehouseOperate({
    //           func: "EX0001",
    //           userId: this.userInfo._id,
    //           token: this.userInfo.token,
    //           requstData: {
    //             result: 0,
    //             id: housOutIds.join(","),
    //             types: types,
    //             // permissonId: 67,
    //           },
    //         })
    //           .then(({ data }) => {
    //             if (data.code != 0)
    //               reject({
    //                 type: types,
    //                 reason: data.data,
    //               });
    //             resolve(data);
    //           })
    //           .catch(() => {
    //             reject({
    //               type: types,
    //               // 服务器网络错误，审核失败
    //               reason: this.$t("h.tips18"),
    //             });
    //           });
    //       })
    //     );
    //   });
    //   Promise.allSettled(passPromises).then((res) => {
    //     let errorArr = res.filter((item) => item.status == "rejected");
    //     if (errorArr.length) {
    //       errorArr.forEach((item) => {
    //         this.articleDeleteErrorData.push(item.reason);
    //       });
    //       this.articlePendingPagForm.currentPage = 1;
    //       this.getArticlePendingBills();
    //       this.$refs["articlePendingTableRef"].$refs[
    //         "dsTableRef"
    //       ].clearSelection();
    //       this.articleDeleteDialogVisible = true;
    //     } else {
    //       this.articlePendingPagForm.currentPage = 1;
    //       this.getArticlePendingBills();
    //       this.$refs["articlePendingTableRef"].$refs[
    //         "dsTableRef"
    //       ].clearSelection();
    //       this.$message.success(this.$t("h.tips181"));
    //     }
    //   });
    // },
    //通过审核
    articleResolvelPendingBills() {
      this.articlePendingLoading = true;
      console.log("通过审核前", this.articleSelectpendingBills);
      let requestBills = this.articleSelectpendingBills; // 补上这行，否则 requestBills 未定义
      let passPromises = [];
      requestBills.forEach((item) => {
        let housOutIds = [];
        let types = "";

        // 直接使用 item，不再遍历 item（因为 item 是单个对象）
        if (item.roleRule.slice(0, 3) == "CYS") {
          types = "TK";
        } else if (item.roleRule.slice(0, 3) == "CIS") {
          types = "RK";
        } else if (item.roleRule.slice(0, 3) == "CRE") {
          types = "CK";
        } else if (item.roleRule.slice(0, 3) == "CAS") {
          types = "TZ";
        } else if (item.roleRule.slice(0, 3) == "CTR") {
          types = "DB";
        }
        if (item.allocateId) {
          housOutIds.push(item.allocateId);
        } else if (item.adjustId) {
          housOutIds.push(item.adjustId);
        } else {
          housOutIds.push(item.warehousingId);
        }
        passPromises.push(
          new Promise((resolve, reject) => {
            warehouseOperate({
              func: "EX0001",
              userId: this.userInfo._id,
              token: this.userInfo.token,
              requstData: {
                result: 0,
                id: housOutIds.join(","),
                types: types,
                // permissonId: 67,
              },
            })
              .then(({ data }) => {
                if (data.code != 0)
                  reject({
                    type: types,
                    reason: data.data,
                  });
                resolve(data);
              })
              .catch(() => {
                reject({
                  type: types,
                  // 服务器网络错误，审核失败
                  reason: this.$t("h.tips18"),
                });
              });
          })
        );
      });
      Promise.allSettled(passPromises).then((res) => {
        let errorArr = res.filter((item) => item.status == "rejected");
        if (errorArr.length) {
          errorArr.forEach((item) => {
            this.articleDeleteErrorData.push(item.reason);
          });
          this.articlePendingPagForm.currentPage = 1;
          this.getArticlePendingBills();
          this.$refs["articlePendingTableRef"].$refs[
            "dsTableRef"
          ].clearSelection();
          this.articleDeleteDialogVisible = true;
        } else {
          this.articlePendingPagForm.currentPage = 1;
          this.getArticlePendingBills();
          this.$refs["articlePendingTableRef"].$refs[
            "dsTableRef"
          ].clearSelection();
          this.$message.success(this.$t("h.tips181"));
        }
      });
    },
    //驳回审核
    // articleRejectPendingBills() {
    //   this.articlePendingLoading = true;
    //   let requestBills = sortArr(this.articleSelectpendingBills, "typeStr");
    //   let passPromises = [];
    //   requestBills.forEach((item) => {
    //     let housOutIds = [];
    //     let types = "";
    //     item.forEach((el, index) => {
    //       if (index == 0 && el.roleRule.slice(0, 3) == "CYS") {
    //         types = "TK";
    //       } else if (index == 0 && el.roleRule.slice(0, 3) == "CIS") {
    //         types = "RK";
    //       } else if (index == 0 && el.roleRule.slice(0, 3) == "CRE") {
    //         types = "CK";
    //       } else if (index == 0 && el.roleRule.slice(0, 3) == "CAS") {
    //         types = "TZ";
    //       } else if (index == 0 && el.roleRule.slice(0, 3) == "CTR") {
    //         types = "DB";
    //       }
    //       if (el.allocateId) {
    //         housOutIds.push(el.allocateId);
    //       } else if (el.adjustId) {
    //         housOutIds.push(el.adjustId);
    //       } else {
    //         housOutIds.push(el.warehousingId);
    //       }
    //     });
    //     passPromises.push(
    //       new Promise((resolve, reject) => {
    //         warehouseOperate({
    //           func: "EX0001",
    //           userId: this.userInfo._id,
    //           token: this.userInfo.token,
    //           requstData: {
    //             result: -2,
    //             id: housOutIds.join(","),
    //             types: types,
    //             // permissonId: 67,
    //           },
    //         })
    //           .then(({ data }) => {
    //             if (data.code != 0)
    //               reject({
    //                 type: types,
    //                 reason: data.data,
    //               });
    //             resolve(data);
    //           })
    //           .catch(() => {
    //             reject({
    //               type: types,
    //               // 服务器网络错误，审核失败
    //               reason: this.$t("h.tips18"),
    //             });
    //           });
    //       })
    //     );
    //   });
    //   Promise.allSettled(passPromises).then((res) => {
    //     let errorArr = res.filter((item) => item.status == "rejected");
    //     if (errorArr.length) {
    //       errorArr.forEach((item) => {
    //         this.articleDeleteErrorData.push(item.reason);
    //       });
    //       this.articlePendingPagForm.currentPage = 1;
    //       this.getArticlePendingBills();
    //       this.$refs["articlePendingTableRef"].$refs[
    //         "dsTableRef"
    //       ].clearSelection();
    //       this.articleDeleteDialogVisible = true;
    //     } else {
    //       this.articlePendingPagForm.currentPage = 1;
    //       this.getArticlePendingBills();
    //       this.$refs["articlePendingTableRef"].$refs[
    //         "dsTableRef"
    //       ].clearSelection();
    //       this.$message.success(this.$t("h.tips270"));
    //     }
    //   });
    // },
    articleRejectPendingBills() {
      this.articlePendingLoading = true;
      let requestBills = this.articleSelectpendingBills; // 单层数组
      let passPromises = [];
      requestBills.forEach((item) => {
        let housOutIds = [];
        let types = "";

        // 直接使用 item，item 是单个单据对象
        const prefix = item.roleRule?.slice(0, 3);
        if (prefix === "CYS") {
          types = "TK";
        } else if (prefix === "CIS") {
          types = "RK";
        } else if (prefix === "CRE") {
          types = "CK";
        } else if (prefix === "CAS") {
          types = "TZ";
        } else if (prefix === "CTR") {
          types = "DB";
        }

        if (item.allocateId) {
          housOutIds.push(item.allocateId);
        } else if (item.adjustId) {
          housOutIds.push(item.adjustId);
        } else {
          housOutIds.push(item.warehousingId);
        }

        passPromises.push(
          new Promise((resolve, reject) => {
            warehouseOperate({
              func: "EX0001",
              userId: this.userInfo._id,
              token: this.userInfo.token,
              requstData: {
                result: -2,
                id: housOutIds.join(","),
                types: types,
              },
            })
              .then(({ data }) => {
                if (data.code !== 0) {
                  reject({ type: types, reason: data.data });
                } else {
                  resolve(data);
                }
              })
              .catch(() => {
                reject({ type: types, reason: this.$t("h.tips18") });
              });
          })
        );
      });

      Promise.allSettled(passPromises).then((res) => {
        let errorArr = res.filter((item) => item.status === "rejected");
        if (errorArr.length) {
          errorArr.forEach((item) => {
            this.articleDeleteErrorData.push(item.reason);
          });
          this.articlePendingPagForm.currentPage = 1;
          this.getArticlePendingBills();
          this.$refs["articlePendingTableRef"].$refs[
            "dsTableRef"
          ].clearSelection();
          this.articleDeleteDialogVisible = true;
        } else {
          this.articlePendingPagForm.currentPage = 1;
          this.getArticlePendingBills();
          this.$refs["articlePendingTableRef"].$refs[
            "dsTableRef"
          ].clearSelection();
          this.$message.success(this.$t("h.tips270"));
        }
        // this.articlePendingLoading = false; // 建议取消注释，关闭 loading
      });
    },
    reasonDialogVisibleClosed() {
      this.rejectReason = "";
    },
    reasonDialogVisibleSubmit() {
      const LOADING = this.$loading(this.dialogLoading);
      this.deleteErrorData = [];
      let rejectBills = sortArr(this.selectpendingBills, "typeStr");
      this.multiRejectBill(0, rejectBills, LOADING);
    },
    multiRejectBill(index, arr, LOADING) {
      if (index > arr.length - 1) {
        LOADING.close();
        this.reasonDialogVisible = false;
        this.pendingPagForm.currentPage = 1;
        this.getPendingBills();
        this.$refs["pendingTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips181"));
        }
        return;
      }
      let housOutIds = [];
      let assetUpId = "";
      arr[index].forEach((el, j) => {
        if (j == 0 && el.roleRule.slice(0, 2) == "LY") {
          assetUpId = "1";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "TK") {
          assetUpId = "2";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "JY") {
          assetUpId = "3";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "BF") {
          assetUpId = "4";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "WX") {
          assetUpId = "5";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "ZY") {
          assetUpId = "6";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "RK") {
          assetUpId = "7";
        } else if (j == 0 && el.roleRule.slice(0, 2) == "GH") {
          assetUpId = "8";
        }
        if (el.roleRule.slice(0, 2) == "GH") housOutIds.push(el.revertId);
        else housOutIds.push(el._id);
      });
      update({
        func: "U0025",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          housOutIds: housOutIds.join(","),
          signatureId: "-1",
          assetUpId: assetUpId,
          permissonId: 67,
          rejection: this.rejectReason,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              type: assetUpId,
              reason: data.data,
            });
          }
          this.multiRejectBill(++index, arr, LOADING);
        })
        .catch(() => {
          this.deleteErrorData.push({
            type: assetUpId,
            // "服务器网络错误，审核失败"
            reason: this.$t("h.tips18"),
          });
          this.multiRejectBill(++index, arr, LOADING);
        });
    },
    billDetailDialogVisibleClosed() {
      this.detailAssets = [];
      this.detailTotal = 0;
      this.detailPaginationForm.currentPage = 1;
      this.detailPaginationForm.pageSize = 20;
      this.detailMatchAssetIds = [];
    },
    articleBillDetailDialogVisibleClosed() {
      this.detailArticle = [];
      this.articleDetailTotal = 0;
      this.articleDetailPaginationForm.currentPage = 1;
      this.articleDetailPaginationForm.pageSize = 20;
      this.detailArticleMatchAssetIds = [];
    },
    checkBillDetail(val) {
      if (val.typeStr == "LY") {
        this.billFormDetail = usingDetailCell(val);
      } else if (val.typeStr == "TK") {
        this.billFormDetail = revertDetailCell(val);
      } else if (val.typeStr == "JY") {
        this.billFormDetail = borrowDetailCell(val);
      } else if (val.typeStr == "BF") {
        this.billFormDetail = scrapDetailCell(val);
      } else if (val.typeStr == "WX") {
        this.billFormDetail = repairDetailCell(val);
      } else if (val.typeStr == "ZY") {
        this.billFormDetail = allocationDetailCell(val);
      } else if (val.typeStr == "RK") {
        this.billFormDetail = receivedDetailCell(val);
      } else if (val.typeStr == "GH") {
        this.billFormDetail = returnDetailCell(val);
      }
      if (val.typeStr == "RK") {
        this.detailTotal = val.asset.length;
        this.detailMatchAssets = val.asset;
        this.rkDetailPagination();
      } else {
        this.detailMatchAssetIds = val.assetIds.split(",");
        if (this.detailMatchAssetIds.length) {
          this.detailTotal = this.detailMatchAssetIds.length;
          this.detailPagination(val);
        }
      }
      this.getBillsAuditMessage(val);
      this.billDetailDialogVisible = true;
    },
    checkArticleBillDetail(val) {
      let valAuditMessage = {};
      if (val.allocateId) {
        valAuditMessage._id = val.allocateId;
      } else if (val.adjustId) {
        valAuditMessage._id = val.adjustId;
      } else {
        valAuditMessage._id = val.warehousingId;
      }
      valAuditMessage.examineOne = val.examineOne;
      valAuditMessage.examineTwo = val.examineTwo;
      valAuditMessage.examineThree = val.examineThree;
      valAuditMessage.examineFour = val.examineFour;
      valAuditMessage.examineFive = val.examineFive;
      if (val.roleRule.slice(0, 3) == "CYS") {
        valAuditMessage.typeStr = "CKTK";
        this.articleBillFormDetail = articleOutboundTkDetailCell(val);
      } else if (val.roleRule.slice(0, 3) == "CIS") {
        valAuditMessage.typeStr = "CKRK";
        this.articleBillFormDetail = articleWarehousingDetailCell(val);
      } else if (val.roleRule.slice(0, 3) == "CRE") {
        valAuditMessage.typeStr = "CKCK";
        this.articleBillFormDetail = articleOutboundCkDetailCell(val);
      } else if (val.roleRule.slice(0, 3) == "CAS") {
        valAuditMessage.typeStr = "CKTZ";
        this.articleBillFormDetail = articleInventoryAdjustmentDetailCell(val);
      } else if (val.roleRule.slice(0, 3) == "CTR") {
        valAuditMessage.typeStr = "CKDB";
        this.articleBillFormDetail = articleConTransferDetailCell(val);
      }
      this.articleDetailTotal = val.details.length;
      this.detailArticleMatchAssetIds = val.list;
      this.articleDetailPagination();
      this.getBillsAuditMessage(valAuditMessage);
      this.articleBillDetailDialogVisible = true;
    },
    getBillsAuditMessage(val) {
      let _id = null;
      if (val.typeStr == "GH") _id = val.revertId;
      else _id = val._id;
      select({
        func: "S0053",
        token: this.userInfo.token,
        userId: this.userInfo._id,
        requstData: {
          _id: _id,
          type: val.typeStr,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          // 这五个  0代表不需要审批 -1代表未审批 大于1代表审批人的id
          this.auditStep = this.createBillAuditMessage(val, data.data);
        })
        .catch(() => {
          // "服务器网络错误，查询单据审核信息失败"
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
    detailPagination(val) {
      let matchAssetIds = this.detailMatchAssetIds.slice(
        (this.detailPaginationForm.currentPage - 1) *
          this.detailPaginationForm.pageSize,
        this.detailPaginationForm.currentPage *
          this.detailPaginationForm.pageSize
      );
      this.getMatchAssets(matchAssetIds.join(","), val);
    },
    rkDetailPagination() {
      this.detailLoading = true;
      this.detailAssets = this.detailMatchAssets.slice(
        (this.detailPaginationForm.currentPage - 1) *
          this.detailPaginationForm.pageSize,
        this.detailPaginationForm.currentPage *
          this.detailPaginationForm.pageSize
      );
      this.detailLoading = false;
    },
    articleDetailPagination() {
      this.articleDetailLoading = true;
      this.detailArticle = this.detailArticleMatchAssetIds.slice(
        (this.articleDetailPaginationForm.currentPage - 1) *
          this.articleDetailPaginationForm.pageSize,
        this.articleDetailPaginationForm.currentPage *
          this.articleDetailPaginationForm.pageSize
      );
      this.articleDetailLoading = false;
    },
    getMatchAssets(_id, val) {
      this.detailLoading = true;
      this.$nextTick(() => {
        this.$refs.detailTableRef.$refs.dsTableRef.bodyWrapper.scrollTop = 0;
      });
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // _id: _id,
          item: [{ key: "_id", handle: "OIS", value: _id }],
        },
      })
        .then(({ data }) => {
          this.detailLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.detailAssets = data.data;
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
          // "服务器网络异常，查询报告资产失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
  },
  created() {
    this.getPendingBills();
  },
};
</script>
<style lang="scss" scoped>
.task {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .task-card {
    padding: 0 15px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    ::v-deep .el-card__body {
      padding: 0;
      height: 100%;
    }
  }
}
::v-deep .task-tabs-box {
  height: 100%;
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__content {
    height: calc(100% - 40px);
    .el-tab-pane {
      height: 100%;
    }
  }
  .el-tabs__item {
    padding-right: 0;
    font-size: 16px;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__active-bar {
    background-color: #fff;
  }
}
::v-deep .task-tabs {
  height: 100%;
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__content {
    height: calc(100% - 40px);
    .el-tab-pane {
      height: 100%;
    }
  }
  .el-tabs__item {
    padding-right: 0;
    font-size: 14px;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__active-bar {
    background-color: #588ab9;
  }
}
.pending-header,
.finished-header {
  height: 60px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.pending-content,
.finished-content {
  height: calc(100% - 60px);
  .bills-table {
    margin-top: 10px;
    height: calc(100% - 50px);
  }
  .bills-pagination {
    height: 40px;
  }
}
</style>
