<template>
  <div>
    <el-dialog
      top="0"
      custom-class="dialog"
      :show-close="false"
      :visible.sync="dialogVisible"
      @open="dialogVisibleOpen"
      @close="dialogVisibleClose"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.title04") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="dialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <div class="print-filter">
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
        <div class="print-table">
          <ds-table
            ref="printTableRef"
            :loading="tableLoading"
            :rowKey="(row) => row._id"
            :tableData="printHistoryData"
            :columns="printHistoryColumns"
            :tableConfig="printHistoryTableConfig"
            @expandDetailChange="expandDetailChange"
          >
            <template slot="export" slot-scope="{ scope }">
              <el-tooltip
                :enterable="false"
                effect="dark"
                :content="$t('h.export')"
                placement="top"
              >
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-document"
                  @click="exportPrintHistory(scope.row._id)"
                ></el-button>
              </el-tooltip>
            </template>
            <div slot="expand" slot-scope="{ scope }" class="detail">
              <div class="detail-table">
                <ds-table
                  :tableData="scope.row.details"
                  :tableConfig="detailsConfig"
                  :columns="detailColumns"
                >
                  <template slot="printType" slot-scope="{ scope }">
                    <el-tag v-if="scope.row.code == '0000'" size="mini">{{
                      $t("h.title36")
                    }}</el-tag>
                    <el-tag
                      v-else-if="scope.row.code.substring(0, 2) == '01'"
                      size="mini"
                      >{{ $t("h.title37") }}</el-tag
                    >
                    <el-tag
                      v-else-if="scope.row.code.substring(0, 2) == '02'"
                      size="mini"
                      >{{ $t("h.title49") }}</el-tag
                    >
                    <el-tag v-else size="mini">{{ $t("h.title50") }}</el-tag>
                  </template>
                </ds-table>
              </div>
              <div class="detail-pagination">
                <ds-pagination
                  small
                  :total="detailTotal"
                  :page.sync="detailPaginationForm.currentPage"
                  :limit.sync="detailPaginationForm.pageSize"
                  @pagination="detailPagination"
                ></ds-pagination>
              </div>
            </div>
          </ds-table>
        </div>
        <div class="print-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getPrintDetail"
          >
          </ds-pagination>
        </div>
      </div>
    </el-dialog>
    <ds-filter-drawer
      :filterDrawerVisible.sync="filterDrawerVisible"
      @submitFilterForm="submitFilterForm"
      @resetFilterForm="resetFilterForm"
    >
      <el-form
        ref="advancedFormRef"
        label-width="100px"
        label-position="left"
        :model="advancedForm"
      >
        <el-form-item :label="$t('h.date')" prop="date">
          <el-date-picker
            v-model="advancedForm.date"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
            value-format="yyyy-MM-dd"
          >
          <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('h.operator')" prop="name">
          <el-input
            v-model="advancedForm.name"
            :placeholder="$t('h.tips3') + $t('h.operator')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('h.templateName')" prop="templateName">
          <el-input
            v-model="advancedForm.templateName"
            :placeholder="$t('h.tips3') + $t('h.templateName')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('h.device')" prop="printer">
          <el-input
            v-model="advancedForm.printer"
            :placeholder="$t('h.tips3') + $t('h.device')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('h.numberOfFailures')" prop="errorSize">
          <el-input
            v-model.number="advancedForm.errorSize[0]"
            :placeholder="$t('h.tips3') + $t('h.initialValue')"
            style="width: calc(50% - 8px)"
          ></el-input>
          -
          <el-input
            v-model.number="advancedForm.errorSize[1]"
            :placeholder="$t('h.tips3') + $t('h.endValue')"
            style="width: calc(50% - 8px)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('h.numberOfSuccesses')" prop="successSize">
          <el-input
            v-model.number="advancedForm.successSize[0]"
            :placeholder="$t('h.tips3') + $t('h.initialValue')"
            style="width: calc(50% - 8px)"
          ></el-input>
          -
          <el-input
            v-model.number="advancedForm.successSize[1]"
            :placeholder="$t('h.tips3') + $t('h.endValue')"
            style="width: calc(50% - 8px)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('h.fuzzyQuery')" prop="andLike">
          <el-input
            v-model="advancedForm.andLike"
            :placeholder="$t('h.tips3') + $t('h.fuzzyQuery')"
          ></el-input>
        </el-form-item>
      </el-form>
    </ds-filter-drawer>
  </div>
</template>
<script>
import { select, update } from "@/assets/api";
import { mapState } from "vuex";
import {
  clickDownloadLink,
  countTableHeaderWidth,
} from "@/utils/basic-methods";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsFilterTag from "@/components/DsFilterTag";
import DsFilterDrawer from "@/components/DsFilterDrawer";
export default {
  components: {
    DsTable,
    DsPagination,
    DsFilterDrawer,
    DsFilterTag,
  },
  data() {
    return {
      tableLoading: false,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      printHistoryTableConfig: {
        index: true,
        expand: true,
        // expandName: "打印记录",
        expandName: this.$t("h.printHistory"),
        expandWidth: "120px",
        expandFixed: false,
        soltName: "expand",
        expands: [],
      },
      printHistoryColumns: [
        {
          fixed: false,
          // label: "时间",
          label: this.$t("h.date"),
          prop: "date",
          showOverflowTooltip: true,
          width: "150px",
        },
        {
          fixed: false,
          // label: "操作人",
          label: this.$t("h.operator"),
          prop: "name",
          showOverflowTooltip: true,
          width: "150px",
        },
        {
          fixed: false,
          // label: "打印数量",
          label: this.$t("h.numberOfCopies"),
          prop: "size",
          showOverflowTooltip: true,
          width: countTableHeaderWidth(this.$t("h.numberOfCopies")),
        },
        {
          fixed: false,
          // label: "成功数量",
          label: this.$t("h.numberOfSuccesses"),
          prop: "successSize",
          showOverflowTooltip: true,
          width: countTableHeaderWidth(this.$t("h.numberOfSuccesses")),
        },
        {
          fixed: false,
          // label: "失败数量",
          label: this.$t("h.numberOfFailures"),
          prop: "errorSize",
          showOverflowTooltip: true,
          width: countTableHeaderWidth(this.$t("h.numberOfFailures")),
        },
        {
          fixed: false,
          // label: "设备",
          label: this.$t("h.device"),
          prop: "printer",
          showOverflowTooltip: true,
          width: "150px",
        },
        {
          fixed: false,
          // label: "模板名称",
          label: this.$t("h.templateName"),
          prop: "templateName",
          showOverflowTooltip: true,
          width: "150px",
        },
        {
          fixed: false,
          // label: "用户区",
          label: this.$t("h.userArea"),
          prop: "userArea",
          showOverflowTooltip: true,
          width: "150px",
        },
        {
          fixed: false,
          // label: "访问密码",
          label: this.$t("h.acessPassword"),
          prop: "accessPassword",
          showOverflowTooltip: true,
          width: "150px",
        },
        {
          fixed: "right",
          // label: "导出",
          label: this.$t("h.export"),
          slotName: "export",
          width: countTableHeaderWidth(this.$t("h.export")),
        },
      ],
      printHistoryData: [],
      expandData: null,
      detailsConfig: {
        index: true,
      },
      detailColumns: [
        {
          fixed: false,
          // label: "打印状态",
          label: this.$t("h.printStatus"),
          prop: "code",
          showOverflowTooltip: true,
          slotName: "printType",
          width: "150px",
        },
        {
          fixed: false,
          // label: "资产名称",
          label: this.$t("h.assetName"),
          prop: "assetName",
          showOverflowTooltip: true,
          width: "150px",
        },
        {
          fixed: false,
          // label: "资产编码",
          label: this.$t("h.assetCode"),
          prop: "assetCode",
          showOverflowTooltip: true,
          //   width: "150px",
        },
      ],
      detailTotal: 0,
      detailPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      highFilterTags: [],
      filterDrawerVisible: false,
      advancedForm: {
        name: "", // 操作人
        date: [], // 日期
        templateName: "", // 模板名称
        printer: "", //打印机名称
        errorSize: [], //失败数量
        successSize: [], //成功数量
        andLike: "",
      },
    };
  },
  props: {
    printDetailDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    dialogVisible: {
      get() {
        return this.printDetailDialogVisible;
      },
      set(val) {
        this.$emit("update:printDetailDialogVisible", val);
      },
    },
  },
  methods: {
    async getPrintDetail() {
      if (this.advancedForm.errorSize[0] > this.advancedForm.errorSize[1]) {
        return this.$message.error(this.$t("h.tips89"));
      }
      if (this.advancedForm.successSize[0] > this.advancedForm.successSize[1]) {
        return this.$message.error(this.$t("h.tips89"));
      }
      if (this.advancedForm.errorSize[0] && !this.advancedForm.errorSize[1]) {
        return this.$message.error(this.$t("h.tips90"));
      }
      if (!this.advancedForm.errorSize[0] && this.advancedForm.errorSize[1]) {
        return this.$message.error(this.$t("h.tips91"));
      }
      if (
        this.advancedForm.successSize[0] &&
        !this.advancedForm.successSize[1]
      ) {
        return this.$message.error(this.$t("h.tips92"));
      }
      if (
        !this.advancedForm.successSize[0] &&
        this.advancedForm.successSize[1]
      ) {
        return this.$message.error(this.$t("h.tips93"));
      }
      this.printHistoryTableConfig.expands = [];
      this.tableLoading = true;
      const { data: res } = await select({
        func: "S0031",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          name: this.advancedForm.name,
          date: this.advancedForm.date.join(","),
          templateName: this.advancedForm.templateName,
          printer: this.advancedForm.printer,
          errorSize: this.advancedForm.errorSize.join(","),
          successSize: this.advancedForm.successSize.join(","),
          andLike: this.advancedForm.andLike,
        },
      }).catch(() => {
        this.tableLoading = false;
        return this.$message.error(this.$t("h.tips18"));
      });
      this.tableLoading = false;
      if (res.code != 0) return this.$message.error(res.data);
      res.data[1].forEach((item) => {
        item.details = [];
      });
      this.total = res.data[0];
      this.printHistoryData = res.data[1];
    },
    dialogVisibleOpen() {
      this.getPrintDetail();
    },
    dialogVisibleClose() {
      this.printHistoryTableConfig.expands = [];
      this.advancedForm.name = "";
      this.advancedForm.date = [];
      this.advancedForm.templateName = "";
      this.advancedForm.printer = "";
      this.advancedForm.errorSize = [];
      this.advancedForm.successSize = [];
      this.advancedForm.andLike = "";
      this.highFilterTags = [];
      this.paginationForm.currentPage = 1;
      this.detailPaginationForm.currentPage = 1;
    },
    // 导出
    async exportPrintHistory(_id) {
      this.tableLoading = true;
      const { data: res } = await update({
        func: "U0029",
        token: this.userInfo.token,
        userId: this.userInfo._id,
        requstData: {
          lable_id: _id,
          permissonId: 59,
        },
      }).catch(() => {
        this.tableLoading = false;
        return this.$notify.error({
          title: this.$t("h.title27"),
          message: res.data,
        });
      });
      this.tableLoading = false;
      if (res.code != 0)
        return this.$notify.error({
          title: this.$t("h.title27"),
          message: res.data,
        });
      clickDownloadLink(window.$EXCEL_URL + res.data);
    },
    async expandDetailChange(row, expandedRows) {
      this.printHistoryTableConfig.expands = [];
      if (expandedRows.length > 0) {
        row ? this.printHistoryTableConfig.expands.push(row._id) : [];
      }
      if (expandedRows.length == 0) return false;
      this.expandData = row;
      this.tableLoading = true;
      const { data: res } = await select({
        func: "S0032",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: row._id,
          page: this.detailPaginationForm.pageSize,
          index: this.detailPaginationForm.currentPage,
        },
      }).catch(() => {
        this.tableLoading = false;
      });
      this.tableLoading = false;
      if (res.code != 0) {
        row.details = [];
        return this.$message.error(res.data);
      }
      this.detailTotal = res.data[0];
      row.details = res.data[1];
      this.$message.success(this.$t("h.tips94"));
    },
    detailPagination() {
      this.expandDetailChange(this.expandData, [this.expandData]);
    },
    resetFilterForm() {
      this.$refs.advancedFormRef.resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getPrintDetail();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getPrintDetail();
    },
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      if (typeof this.advancedForm[val.keyStr] == "string") {
        this.advancedForm[val.keyStr] = "";
      } else {
        this.advancedForm[val.keyStr] = [];
      }
      this.paginationForm.currentPage = 1;
      this.getPrintDetail();
    },
    mapHighFilterTags() {
      this.highFilterTags = [];
      for (let key in this.advancedForm) {
        if (this.advancedForm[key] && this.advancedForm[key].length) {
          if (key == "name") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.advancedSearch1");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.advancedForm[key];
            this.highFilterTags.push(highFilteritem);
          } else if (key == "date") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.date");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.advancedForm[key].join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "templateName") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.advancedSearch2");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.advancedForm[key];
            this.highFilterTags.push(highFilteritem);
          } else if (key == "printer") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.advancedSearch3");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.advancedForm[key];
            this.highFilterTags.push(highFilteritem);
          } else if (key == "errorSize") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.numberOfFailures");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.advancedForm[key].join("-");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "successSize") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.numberOfSuccesses");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.advancedForm[key].join("-");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "andLike") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.advancedSearch4");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.advancedForm[key];
            this.highFilterTags.push(highFilteritem);
          }
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 1400px;
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
  }
  .el-dialog__body {
    padding: 0;
    height: calc(100% - 36px);
  }
  .dialog-body {
    padding: 0 14px;
    height: 100%;
    box-sizing: border-box;
  }
  .detail {
    width: 100%;
    height: 570px;
    .detail-table {
      height: 540px;
    }
    .detail-pagination {
      height: 30px;
      display: flex;
      align-items: center;
    }
  }
  .el-table__expanded-cell {
    padding: 10px 10px 0px 10px;
  }
}
.print-filter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 35px;
  .advanced-filter-btn {
    margin-right: 15px;
  }
}
.print-table {
  height: calc(100% - 75px);
}
.print-pagination {
  height: 40px;
}
</style>
