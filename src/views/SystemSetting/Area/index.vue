<template>
  <div class="area">
    <el-card class="area-card">
      <div slot="header" class="area-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button
              type="primary"
              size="mini"
              @click="newBillsDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-button
              type="danger"
              size="mini"
              :disabled="isDeleteDisabled"
              @click="deleteAreas"
              >{{ $t("h.delBtn") }}</el-button
            >
            <el-button size="mini" @click="readDialogVisible = true">{{
              $t("h.bulkBtn")
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
      <div class="area-card-content">
        <div class="bills-table">
          <ds-table
            ref="billsTableRef"
            :loading="loading"
            :tableConfig="billsTableConfig"
            :columns="billsColums"
            :tableData="areaBills"
            :rowKey="(row) => row._id"
            @handleSelectionChange="handleSelectionChange"
          >
            <template slot="operation" slot-scope="{ scope }">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-tickets"
                @click="oneKeyCheck(scope.row)"
                >{{ $t("h.oneClickInventory") }}</el-button
              >
              <span class="line"></span>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="editAreaForm(scope.row)"
                >{{ $t("h.editBtn") }}</el-button
              >
              <span class="line"></span>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click="deleteAreaForm(scope.row)"
                >{{ $t("h.delBtn") }}</el-button
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
            @pagination="getAreaBills"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <!-- 新建/编辑 -->
    <new-bills-dialog
      class="new-bill-dialog"
      :title="newBillTitle"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitAreaForm"
    >
      <template slot="form">
        <el-form
          ref="areaFormRef"
          label-width="130px"
          :model="areaForm"
          :rules="areaFormRules"
        >
          <el-form-item
            :label="'*' + $t('h.areaCode')"
            prop="code"
            label-width="98px"
          >
            <el-input v-model="areaForm.code"></el-input>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('h.tips17')"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="
                  font-size: 20px;
                  color: #473bb4;
                  position: absolute;
                  top: 10px;
                  right: -20px;
                "
              ></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            :label="$t('h.areaName2')"
            prop="wareHouseName"
            label-width="98px"
          >
            <el-input v-model.trim="areaForm.wareHouseName"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
    <!-- 删除失败详情 -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <!-- 导入 -->
    <read-excel-file
      :readDialogVisible.sync="readDialogVisible"
      :setp="setp"
      :percentage="percentage"
      :errorText="errorText"
      :title="$t('h.bulkBtn')"
      @closed="readDialogVisibleClosed"
      @download="downloadImportFile"
      @submit="readDialogVisibleSubmit"
    >
      <upload-excel-file
        :value.sync="file"
        :loading="readLoading"
      ></upload-excel-file>
    </read-excel-file>
    <!-- 一键盘点dialog -->
    <el-dialog
      top="0"
      custom-class="oneKeyDialog"
      :show-close="false"
      :visible.sync="oneKeyDialogVisible"
      :before-close="oneKeyDialogBeforeClose"
      @closed="oneKeyDialogVisibleClosed"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.oneClickInventory") }}</span>
          <span class="checking" v-show="timer != null"
            >{{ $t("h.title133") }}<i class="el-icon-loading"></i>
          </span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="oneKeyDialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <div class="btns">
          <!-- :disabled="timer != null" -->
          <el-button
            v-if="timer == null"
            type="primary"
            size="mini"
            @click="startOneKeyCheck"
            >{{ $t("h.title143") }}</el-button
          >
          <el-button v-else type="warning" size="mini" @click="endCheck">{{
            $t("h.title144")
          }}</el-button>
          <el-select
            style="margin: 0 10px"
            size="mini"
            v-model="equimentOption"
            clearable
            filterable
            :placeholder="$t('h.tips4') + $t('h.title129')"
            :disabled="timer != null"
            @change="onChangePDT"
            value-key="equipment_id"
          >
            <el-option
              v-for="item in equiments"
              :key="item.equipment_id"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>
          <el-input
            v-model="ip"
            size="mini"
            style="width: 180px"
            :placeholder="$t('h.tips3') + $t('h.formTips39') + 'IP'"
          >
            <el-tooltip
              slot="suffix"
              effect="dark"
              :content="$t('h.formTips40')"
              placement="top-start"
            >
              <el-button
                type="text"
                icon="el-icon-info"
                size="mini"
              ></el-button>
            </el-tooltip>
          </el-input>
          <el-select
            style="margin: 0 10px"
            size="mini"
            :placeholder="$t('h.tips4') + $t('h.title145')"
            v-model="listingState"
            clearable
            filterable
            multiple
            collapse-tags
            @change="onChangeListingState"
            :disabled="timer != null"
          >
            <el-option
              v-for="item in listingStateList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <el-input-number
            size="mini"
            v-model="timeOut"
            controls-position="right"
            :min="30"
            :disabled="timer != null"
          ></el-input-number
          ><span style="margin-left: 3px">{{ $t("h.second") }}</span>
          <el-button
            type="success"
            size="mini"
            style="margin-left: 10px"
            :disabled="timer != null"
            @click="saveCheckResult"
            >{{ $t("h.saveBtn") + $t("h.inventoryResults") }}</el-button
          >
        </div>
        <div class="content">
          <el-tabs v-model="activeName" @tab-click="assetTabsClick">
            <el-tab-pane :label="$t('h.title134')" name="not">
              <div class="table">
                <ds-table
                  ref="notTableRef"
                  :rowKey="(row) => row._id"
                  :loading="oneKeyLoading"
                  :tableConfig="{}"
                  :columns="columns"
                  :tableData="notAssets"
                ></ds-table>
              </div>
              <div class="pagination">
                <ds-pagination
                  small
                  :total="notTotal"
                  :page.sync="notPaginationForm.currentPage"
                  :limit.sync="notPaginationForm.pageSize"
                  @pagination="getNotAssets"
                ></ds-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('h.title135')" name="then">
              <div class="table">
                <ds-table
                  ref="thenTableRef"
                  :rowKey="(row) => row._id"
                  :loading="oneKeyLoading"
                  :tableConfig="{}"
                  :columns="columns"
                  :tableData="thenAssets"
                ></ds-table>
              </div>
              <div class="pagination">
                <ds-pagination
                  small
                  :total="thenTotal"
                  :page.sync="thenPaginationForm.currentPage"
                  :limit.sync="thenPaginationForm.pageSize"
                  @pagination="getThenAssets"
                ></ds-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('h.title136')" name="other">
              <div class="table">
                <ds-table
                  ref="otherTableRef"
                  :loading="oneKeyLoading"
                  :tableConfig="{}"
                  :columns="columns"
                  :tableData="otherAssets"
                ></ds-table>
              </div>
              <div class="pagination">
                <ds-pagination
                  small
                  :total="otherTotal"
                  :page.sync="otherPaginationForm.currentPage"
                  :limit.sync="otherPaginationForm.pageSize"
                  @pagination="getOtherAssets"
                ></ds-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 盘点结果表单dialog -->
    <el-dialog
      top="0"
      custom-class="formDialog"
      :show-close="false"
      :visible.sync="formDialogVisible"
      @opened="formDialogVisibleOpened"
      @closed="formDialogVisibleClosed"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.inventoryResults") + $t("h.saveBtn") }}</span>
          <span class="tips">
            <i class="el-icon-info"></i>
            {{ $t("h.tips240") }}</span
          >
        </div>
        <div class="right">
          <i class="el-icon-close" @click="formDialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body" v-loading="checkLoading">
        <div class="form">
          <el-form
            label-width="100px"
            ref="checkFormRef"
            :model="checkForm"
            :rules="checkFormRules"
          >
            <el-form-item
              :label="$t('h.stocktakingSheetName')"
              prop="queryName"
            >
              <el-input
                v-model="checkForm.queryName"
                :placeholder="$t('h.tips3') + $t('h.stocktakingSheetName')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.creationTime')" prop="createDate">
              <!-- format="yyyy 年 MM 月 dd 日" -->
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="$t('h.tips4') + $t('h.creationTime')"
                v-model="checkForm.createDate"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('h.completionTime')" prop="completeDate">
              <!-- format="yyyy 年 MM 月 dd 日" -->
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="$t('h.tips4') + $t('h.completionTime')"
                v-model="checkForm.completeDate"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="btns">
          <el-button size="small" @click="formDialogVisible = false">{{
            $t("h.cancelBtn")
          }}</el-button>
          <el-button type="primary" size="small" @click="submitCheckForm">{{
            $t("h.confirmBtn")
          }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsSelectTree from "@/components/DsSelectTree";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import ReadExcelFile from "@/components/ReadExcelFile";
import UploadExcelFile from "@/components/ReadExcelFile/components/UploadExcelFile.vue";
import { mapState } from "vuex";
import {
  closeCheck,
  openCheck,
  getCheckEPC,
  deleteData,
  select,
  update,
} from "@/assets/api";
import {
  wareBillsColumns,
  deleteAreaErrorColumns,
  listingStateList,
} from "@/utils/systemData";
import {
  clickDownloadLink,
  countTableHeaderWidth,
  getTodayDate,
} from "@/utils/basic-methods";
import * as XLSX from "xlsx";
export default {
  components: {
    DsTable,
    DsPagination,
    DsSearchBtn,
    DsQueryForm,
    DsSelectTree,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    NewBillsDialog,
    DsDeleteDetail,
    ReadExcelFile,
    UploadExcelFile,
  },
  data() {
    return {
      andLike: "",
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      loading: false,
      billsTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      billsColums: wareBillsColumns,
      areaBills: [],
      selectAreaBills: [],
      newBillsDialogVisible: false,
      newBillTitle: this.$t("h.title96"),
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      areaForm: {
        code: null,
        wareHouseId: "",
        wareHouseName: "",
      },
      areaFormRules: {
        wareHouseName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.areaName2"),
            trigger: "blur",
          },
        ],
      },
      deleteDialogVisible: false,
      deleteColumns: deleteAreaErrorColumns,
      deleteErrorData: [],
      readDialogVisible: false,
      file: {
        value: "",
        name: "",
      },
      setp: "upload",
      percentage: 0,
      errorText: "",
      readLoading: false,
      mapKey: {
        "区域编码（必填）": "code",
        "区域名称（必填）": "warehouseName",
      },
      oneKeyDialogVisible: false,
      listingStateList: listingStateList,
      listingState: [],
      equiments: [],
      usedAnts: [],
      onekeyWareId: null,
      equimentOption: null,
      timeOut: 30,
      ip: "http://127.0.0.1:7788",
      oneKeyLoading: false,
      activeName: "not",
      // 未盘
      notTotal: 0,
      baseNotTotal: 0,
      notPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      notAssets: [],
      // 已盘
      thenTotal: 0,
      thenPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      thenAssets: [],
      // 盘盈
      otherTotal: 0,
      otherPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      otherAssets: [],
      // 循环发送
      timer: null,
      // 盘点机检测到的资产epc
      // 系统内的非目标资产epc
      // 系统外的非目标资产epc
      // 盘点到的EPC
      allEPC: [],
      formDialogVisible: false,
      checkLoading: false,
      checkForm: {
        queryName: "",
        createDate: getTodayDate(),
        completeDate: getTodayDate(),
      },
      checkFormRules: {
        queryName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.stocktakingSheetName"),
            trigger: "blur",
          },
        ],
        createDate: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.creationTime"),
            trigger: "change",
          },
        ],
        completeDate: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.completionTime"),
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader","stateListData"]),
    isDeleteDisabled() {
      if (this.selectAreaBills.length) return false;
      else return true;
    },
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
                if (row[item.attr] == -1) {
                  return this.$t("h.title137");
                } else {
                  return this.stateListData.find((e) => {
                    return e._id == row[item.attr];
                  }).label;
                }
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
  },
  methods: {
    getAreaBills() {
      this.loading = true;
      select({
        func: "S0003",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.areaBills = data.data[1];
        })
        .catch(() => {
          this.loading = false;
          // "服务器网络异常，请求放置区域失败"
          return this.$message.error(this.$t("h.tips18"));
        });
    },
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getAreaBills();
    },
    handleSelectionChange(val) {
      this.selectAreaBills = val;
    },
    editAreaForm(row) {
      this.areaForm.wareHouseId = row._id;
      this.areaForm.code = row.code;
      this.areaForm.wareHouseName = row.warehouseName;
      this.newBillTitle = this.$t("h.title97");
      this.newBillsDialogVisible = true;
    },
    deleteAreaForm(row) {
      this.$confirm(this.$t("h.tips161"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          deleteData({
            func: "D0002",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              _id: row._id,
              permissonId: 57,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) {
                this.loading = false;
                return this.$message.error(data.data);
              }
              // 删除成功后写下以下判断
              let totalPage = Math.ceil(
                (this.total - 1) / this.paginationForm.pageSize
              );
              let currentPage =
                this.paginationForm.currentPage > totalPage
                  ? totalPage
                  : this.paginationForm.currentPage;
              this.paginationForm.currentPage =
                currentPage < 1 ? 1 : currentPage;
              this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
              this.getAreaBills();
              this.$message.success(this.$t("h.tips128"));
            })
            .catch(() => {
              this.loading = false;
              // "服务器网络异常，删除失败"
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("h.tips98"),
          });
        });
    },
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    async deleteAreas() {
      if (!this.selectAreaBills.length) {
        return this.$message.error(this.$t("h.tips98"));
      }
      const confirmResult = await this.$confirm(
        this.$t("h.tips163"),
        this.$t("h.title18"),
        {
          confirmButtonText: this.$t("h.confirmBtn"),
          cancelButtonText: this.$t("h.cancelBtn"),
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult === "cancel")
        return this.$message.info(this.$t("h.tips98"));
      this.loading = true;
      this.deleteErrorData = [];
      this.multiDeleteArea(0);
    },
    multiDeleteArea(index) {
      if (index > this.selectAreaBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getAreaBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips164"));
        }
        return;
      }
      deleteData({
        func: "D0002",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectAreaBills[index]._id,
          permissonId: 24,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              code: this.selectAreaBills[index].code,
              name: this.selectAreaBills[index].warehouseName,
              reason: data.data,
            });
          }
          this.multiDeleteArea(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            code: this.selectAreaBills[index].code,
            name: this.selectAreaBills[index].warehouseName,
            reason: this.$t("h.tips18"),
          });
          this.multiDeleteArea(++index);
        });
    },
    newBillsDialogOpened() {
      this.$refs.areaFormRef.clearValidate();
    },
    newBillsDialogClose() {
      // this.$refs.areaFormRef.resetFields();
      this.areaForm.wareHouseId = "";
      this.areaForm.code = null;
      this.areaForm.wareHouseName = "";
      this.newBillTitle = this.$t("h.title96");
    },
    sbumitAreaForm() {
      this.$refs.areaFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        let permissonId = this.areaForm.wareHouseId == "" ? 56 : 58;
        update({
          func: "U0003",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.areaForm.wareHouseId,
            code: this.areaForm.code,
            warehouseName: this.areaForm.wareHouseName,
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newBillsDialogVisible = false;
            this.getAreaBills();
            this.$message.success(data.data);
          })
          .catch(() => {
            LOADING.close();
            // "服务器网络异常，新增/编码放置区域失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    readDialogVisibleClosed() {
      this.file.value = "";
      this.file.name = "";
      this.setp = "upload";
      this.percentage = 0;
      this.errorText = "";
    },
    downloadImportFile() {
      clickDownloadLink(
        window.$EXCEL_URL + `${this.$t("h.assetTemplate3")}.xlsx`
      );
    },
    readDialogVisibleSubmit() {
      if (!this.file.value)
        return this.$notify.error({
          title: this.$t("h.title18"),
          message: this.$t("h.title93"),
        });
      this.readExcel();
    },
    readExcel() {
      this.readLoading = true;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
            cellDates: false,
          });
          const wsname = workbook.SheetNames[0];
          // 解析为json,打印ws 就可以看到读取出的表格数据
          const ws = XLSX.utils
            .sheet_to_json(workbook.Sheets[wsname])
            .splice(1);
          if (!ws.length) {
            this.readLoading = false;
            return this.$notify.error({
              title: this.$t("h.title27"),
              message: this.$t("h.tips131"),
            });
          }
          let crackExcelData = [];
          for (let i = 0; i < ws.length; i++) {
            let ExecekRow = {};
            for (let key in ws[i]) ExecekRow[this.mapKey[key]] = ws[i][key];
            crackExcelData.push(ExecekRow);
          }
          this.readLoading = false;
          this.setp = "loading";
          this.percentage = 50;
          update({
            func: "U0059",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              item: crackExcelData,
              permissonId: 56,
            },
          })
            .then(({ data }) => {
              this.percentage = 100;
              if (data.code != 0) {
                this.setp = "result";
                this.errorText = data.data;
                return;
              }
              this.setp = "result";
              this.getAreaBills();
            })
            .catch(() => {
              this.percentage = 100;
              this.setp = "result";
              // "服务器网络错误，请稍后再试"
              this.errorText = this.$t("h.tips18");
            });
        } catch (error) {
          this.readLoading = false;
          this.$notify({
            title: this.$t("h.title27"),
            message: this.$t("h.tips156"),
          });
        }
      };
      fileReader.readAsBinaryString(this.file.value);
    },
    // 一键盘点
    oneKeyCheck(row) {
      // console.log(row);
      // 可用的盘点设备
      this.equiments = row.equiments.filter((e) => e.type == 1);
      // 用于查询该区域应盘资产
      this.onekeyWareId = row._id;
      // 一键盘点弹框弹出
      this.oneKeyDialogVisible = true;
      // 获取未盘点资产
      this.getNotAssets();
    },
    // 选中盘点机
    onChangePDT(val) {
      if (!val) return;
      this.usedAnts = this.areaBills
        .find((e) => e._id == this.onekeyWareId)
        .eaw.find((e) => e.equipmentId == val.equipment_id)
        .ant.split("")
        .reverse()
        .map((value, index) => (value == 1 ? index + 1 : -1))
        .filter((index) => index !== -1);
    },
    // tab卡片切换
    assetTabsClick(tab, event) {
      if (tab.name == "not") {
        this.getNotAssets();
      } else if (tab.name == "then") {
        this.getThenAssets();
      } else if (tab.name == "other") {
        this.getOtherAssets();
      }
    },
    // 获取未盘资产数量
    getNotAssets() {
      let item = [
        { key: "warehouseId", handle: "OIS", value: this.onekeyWareId },
        // {key:"listingState",handle:"OIS",value:}
      ];
      if (this.listingState.length) {
        item.push({
          key: "listingState",
          handle: "OIS",
          value: this.listingState.join(","),
        });
      }
      this.allEPC.forEach((e) => {
        item.push({ key: "code", handle: "NIS", value: e });
      });
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // 分页
          page: this.notPaginationForm.pageSize,
          index: this.notPaginationForm.currentPage,
          // 筛选条件
          item: item,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.notTotal = data.data[0];
          this.notAssets = this.setTableCostomKey(data.data[1]);
        })
        .catch(() => {});
    },
    // 获取已盘资产
    getThenAssets() {
      let item = [
        { key: "code", handle: "OIS", value: this.allEPC.join(",") },
        { key: "warehouseId", handle: "OIS", value: this.onekeyWareId },
      ];
      if (this.listingState.length) {
        item.push({
          key: "listingState",
          handle: "OIS",
          value: this.listingState.join(","),
        });
      }
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // 分页
          page: this.thenPaginationForm.pageSize,
          index: this.thenPaginationForm.currentPage,
          item: item,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.thenTotal = data.data[0];
          this.thenAssets = this.setTableCostomKey(data.data[1]);
        })
        .catch(() => {});
    },
    // 获取盘盈资产
    getOtherAssets() {
      let item = [
        {
          key: "code",
          handle: "OIS",
          value: this.allEPC.join(","),
        },
        { key: "warehouseId", handle: "NIS", value: this.onekeyWareId },
      ];
      if (this.listingState.length) {
        item.push({
          key: "listingState",
          handle: "NIS",
          value: this.listingState.join(","),
        });
      }
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.otherPaginationForm.pageSize,
          index: this.otherPaginationForm.currentPage,
          item: item,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.otherTotal = data.data[0];
          this.otherAssets = this.setTableCostomKey(data.data[1]);
        })
        .catch(() => {});
    },
    onChangeListingState() {
      if (this.activeName == "not") this.getNotAssets();
      else if (this.activeName == "then") this.getThenAssets();
      else if (this.activeName == "other") this.getOtherAssets();
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
    // 一键盘点关闭钩子
    oneKeyDialogVisibleClosed() {
      this.onekeyWareId = null;
      this.equiments = [];
      this.usedAnts = [];
      this.timeOut = 30;
      this.equimentOption = null;
      this.ip = "http://127.0.0.1:7788";
      this.activeName = "not";
      this.notTotal = 0;
      this.thenTotal = 0;
      this.otherTotal = 0;
      this.notPaginationForm.currentPage = 1;
      this.thenPaginationForm.currentPage = 1;
      this.otherPaginationForm.currentPage = 1;
      this.notAssets = [];
      this.thenAssets = [];
      this.otherAssets = [];
      this.timer = null;
      this.allEPC = [];
      this.listingState = [];
    },
    // 开始一键盘点
    startOneKeyCheck() {
      if (!this.equimentOption) return this.$message.error(this.$t("h.tips241"));
      if (this.ip == "") return this.$message.error(this.$t("h.tips242"));
      // 开始盘点清空
      this.notTotal = 0;
      this.thenTotal = 0;
      this.otherTotal = 0;
      this.notPaginationForm.currentPage = 1;
      this.thenPaginationForm.currentPage = 1;
      this.otherPaginationForm.currentPage = 1;
      this.notAssets = [];
      this.thenAssets = [];
      this.otherAssets = [];
      this.allEPC = [];
      this.getNotAssets();
      openCheck(
        {
          rfidIp: this.equimentOption.ip, //盘点机的IP
          rfidRegion: "NA", //盘点机的工作频段（可不设置，默认是NA）
          power: 30, //盘点机的功率（可不设置，默认最大）
          antnum: this.equimentOption.antLength, //天线数量，必填
          usedAnts: this.usedAnts, //使用哪个天线盘点，如使用1/2/3号天线[1,2,3],必填
          readingDuration: this.timeOut, //盘点时长，单位：秒，（可不设置，默认30秒）
        },
        this.ip + "/Service?sendCode=4&param=1"
      )
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.message);
          this.$message.success(data.message);
          this.startRequest();
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips232"));
        });
    },
    // 结束盘点
    endCheck() {
      closeCheck(
        {
          rfidIp: this.equimentOption.ip, //盘点机的IP
        },
        this.ip + "/Service?sendCode=4&param=4"
      )
        .then(({ data }) => {
          console.log(data);
        })
        .catch(() => {});
      // clearInterval(this.timer);
      // this.timer = null;
    },
    // 获取一键盘点结果
    startRequest() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      let expirationTime = this.timeOut;
      this.timer = setInterval(() => {
        // 发送请求
        this.makeRequest();
        expirationTime -= 5;
        if (expirationTime < 0) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 5000);
    },
    // 请求盘点机数据
    makeRequest() {
      getCheckEPC(
        {
          rfidIp: this.equimentOption.ip, //盘点机的IP
          needNew: true,
        },
        this.ip + "/Service?sendCode=4&param=2"
      )
        .then(({ data }) => {
          if (data.code != 0) {
            clearInterval(this.timer);
            this.timer = null;
            this.$message.error(data.data);
          }
          if (!data.state) {
            clearInterval(this.timer);
            this.timer = null;
          }
          if (data.message.length) {
            this.allEPC = [...this.allEPC, ...data.message];
            if (this.activeName == "not") this.getNotAssets();
            else if (this.activeName == "then") this.getThenAssets();
            else if (this.activeName == "other") this.getOtherAssets();
          }
        })
        .catch(() => {
          clearInterval(this.timer);
          this.timer = null;
          // 服务器网络异常，结束盘点
          this.$message.error(this.$t("h.tips18"));
        });
    },
    oneKeyDialogBeforeClose(done) {
      if (this.timer == null) return done();
      this.$confirm(this.$t("h.tips243"))
        .then((_) => {
          done();
          clearInterval(this.timer);
          this.timer = null;
        })
        .catch((_) => {});
    },
    // 保存判断结果
    saveCheckResult() {
      if (!this.allEPC.length) {
        this.$confirm(this.$t("h.tips244"))
          .then((_) => {
            this.formDialogVisible = true;
          })
          .catch((_) => {});
      } else {
        this.formDialogVisible = true;
      }
    },
    formDialogVisibleOpened() {
      this.$refs.checkFormRef.clearValidate();
    },
    formDialogVisibleClosed() {
      this.checkForm.createDate = "";
      this.checkForm.completeDate = "";
      this.checkForm.queryName = "";
    },
    submitCheckForm() {
      this.$refs.checkFormRef.validate((valid) => {
        if (!valid) return false;
        this.checkLoading = true;
        update({
          func: "U0085",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            warehouseId: this.onekeyWareId,
            epc: this.allEPC.join(","),
            createDate: this.checkForm.createDate,
            completeDate: this.checkForm.completeDate,
            queryName: this.checkForm.queryName,
            staffId: this.userInfo.staffId,
            staffName: this.userInfo.staffName,
            listingState: this.listingState.join(","),
            permissonId: 44,
          },
        })
          .then(({ data }) => {
            this.checkLoading = false;
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(this.$t("h.tips245"));
            this.formDialogVisible = false;
            this.oneKeyDialogVisible = false;
          })
          .catch(() => {
            this.checkLoading = false;
            // 服务器网络异常，查询报告资产失败
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
  },
  created() {
    this.getAreaBills();
    let newMapKey = [this.$t("h.fileDownload8"), this.$t("h.fileDownload9")];
    const keys = [];
    for (var key in this.mapKey) {
      keys.push(key);
    }
    let str1 = JSON.stringify(this.mapKey);
    //tarKeys的数组长度和this.mapKey的key值长度一致，不一致也没影响，无论谁多谁少
    for (let i = 0; i < newMapKey.length; i++) {
      str1 = str1.replace(keys[i], newMapKey[i]);
    }
    this.mapKey = JSON.parse(str1);
  },
};
</script>
<style lang="scss" scoped>
.area {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .area-card {
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
.area-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.area-card-content {
  height: 100%;
  .bills-table {
    margin-top: 10px;
    height: calc(100% - 50px);
  }
  .bills-pagination {
    height: 40px;
  }
}
.line {
  vertical-align: middle;
  margin: 0 10px;
  border-right: 2px solid #000;
}
::v-deep .oneKeyDialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 1200px;
  height: calc(100% - 150px);
  border-radius: 6px;
  overflow: hidden;
  .el-dialog__header {
    padding: 0;
  }
  .dialog-header {
    padding: 0 10px 0 20px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    box-sizing: border-box;
    font-size: 17px;
    font-weight: bold;
    .el-icon-close:hover {
      color: #588ab9;
      cursor: pointer;
    }
    .checking {
      margin-left: 10px;
      font-size: 14px;
      font-weight: 400;
    }
  }
  .el-dialog__body {
    padding: 0;
    height: calc(100% - 36px);
  }
  .dialog-body {
    padding: 14px 14px 0 14px;
    height: 100%;
    box-sizing: border-box;
    .btns {
      height: 28px;
      margin-bottom: 14px;
    }
    .content {
      height: calc(100% - 42px);
    }
    .el-tabs {
      height: 100%;
    }
    .el-tabs__content {
      height: calc(100% - 55px);
    }
    .el-tab-pane {
      height: 100%;
    }
    .table {
      height: calc(100% - 40px);
    }
    .pagination {
      height: 40px;
    }
  }
}
::v-deep .formDialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 580px;
  border-radius: 6px;
  overflow: hidden;
  .el-dialog__header {
    padding: 0;
  }
  .dialog-header {
    padding: 0 10px 0 20px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    box-sizing: border-box;
    font-size: 17px;
    font-weight: bold;
    .el-icon-close:hover {
      color: #588ab9;
      cursor: pointer;
    }
    .tips {
      margin-left: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #588ab9;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
  .dialog-body {
    padding: 14px;
    box-sizing: border-box;
  }
  .form {
    margin-top: 14px;
    .el-date-editor {
      width: 100%;
    }
  }
  .btns {
    text-align: center;
  }
}
</style>
