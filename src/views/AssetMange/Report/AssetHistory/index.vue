<template>
  <div class="assset-history">
    <el-card class="history-card">
      <div slot="header" class="history-card-header">
        <ds-query-form>
          <!-- 按钮区域 -->
          <ds-query-form-left-panel> </ds-query-form-left-panel>
          <!-- 搜索区域 -->
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="findBillsSearch"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="history-card-content">
        <!-- 高级筛选 -->
        <div class="history-filter">
          <el-button
            class="advanced-filter-btn"
            type="text"
            size="small"
            icon="el-icon-refresh"
            @click="getAssetHistoryBills"
            >{{ $t("h.refreshList") }}</el-button
          >
        </div>
        <!-- 表格 -->
        <div class="history-table">
          <ds-table
            ref="printTableRef"
            :loading="tableLoading"
            :rowKey="(row) => row.assetCode"
            :tableData="printHistoryBills"
            :columns="columns"
            :tableConfig="tableConfig"
          >
            <template slot="operation" slot-scope="{ scope }">
              <el-button
                size="mini"
                type="text"
                @click="checkHistoryDetail(scope.row.assetCode)"
                >{{ $t("h.viewDetails") }}</el-button
              >
            </template>
          </ds-table>
        </div>
        <!-- 分页 -->
        <div class="history-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getAssetHistoryBills"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <asset-history-detail
      :historyDialogVisible.sync="historyDialogVisible"
      :code="historyAssetCode"
      @closed="historyAssetCodeClosed"
    ></asset-history-detail>
  </div>
</template>
<script>
import DsTable from "@/components/DsTable";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsPagination from "@/components/DsPagination";
import AssetHistoryDetail from "@/components/BillsComponents/AssetMangeComponents/Report/AssetHistoryDetail";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { mapState } from "vuex";
import { select } from "@/assets/api";
import { countTableHeaderWidth } from "@/utils/basic-methods";

export default {
  components: {
    DsTable,
    DsSearchBtn,
    DsQueryForm,
    DsPagination,
    AssetHistoryDetail,
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
      andLike: "",
      tableLoading: false,
      tableConfig: {},
      printHistoryBills: [],
      historyDialogVisible: false,
      historyAssetCode: "",
    };
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader"]),
    columns() {
      let columns = [];
      this.assetTableHeader.forEach((item) => {
        if (item.attr == "assetCode") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "name") {
          columns.push({
            prop: "assetName",
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        }
      });
      columns.push({
        label: this.$t("h.action"),
        sortable: false,
        slotName: "operation",
        width: "110",
        fixed: "left",
      });
      return columns;
    },
  },
  methods: {
    getAssetHistoryBills() {
      this.tableLoading = true;
      select({
        func: "S0046",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.printHistoryBills = data.data[1];
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    checkHistoryDetail(assetCode) {
      this.historyAssetCode = assetCode;
      this.historyDialogVisible = true;
    },
    historyAssetCodeClosed() {
      this.historyAssetCode = "";
    },
    findBillsSearch() {
      this.paginationForm.currentPage = 1;
      this.getAssetHistoryBills();
    },
  },
  created() {
    this.getAssetHistoryBills();
  },
};
</script>
<style lang="scss" scoped>
.assset-history {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .history-card {
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
.history-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.history-card-content {
  height: 100%;
  .history-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .history-table {
    height: calc(100% - 75px);
  }
  .history-pagination {
    height: 40px;
  }
}
</style>
