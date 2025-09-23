<template>
  <div>
    <el-dialog
      top="0"
      custom-class="report-dialog"
      fullscreen
      :visible.sync="dialogVisible"
      :show-close="false"
      @open="dialogVisibleOpen"
      @opened="dialogVisibleOpened"
      @close="dialogVisibleClose"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            circle
            @click="dialogVisible = false"
          ></el-button>
          <span class="title">{{ $t("h.inventoryReport") }}</span>
        </div>
        <div class="right">
          <el-button
            type="text"
            icon="el-icon-close"
            @click="dialogVisible = false"
          ></el-button>
        </div>
      </div>
      <div class="dialog-body" ref="reportRef">
        <div class="check-show">
          <ul class="check-show-num">
            <li class="item">
              <img
                class="item-img"
                src="@/assets/images/icon-ought.png"
                alt=""
              />
              <div class="title">
                <h3 v-if="queryInfo">
                  {{ queryInfo.queryAmount }}
                </h3>
                <h3 v-else>0</h3>
                <span>{{ $t("h.quantityToBeOffered") }}</span>
              </div>
            </li>
            <li class="item">
              <img
                class="item-img"
                src="@/assets/images/icon-firm.png"
                alt=""
              />
              <div class="title">
                <h3 v-if="queryInfo">
                  {{ queryInfo.queryActual }}
                </h3>
                <h3 v-else>0</h3>
                <span>{{ $t("h.actualQuantityOffered") }}</span>
              </div>
            </li>
            <li class="item">
              <img
                class="item-img"
                src="@/assets/images/icon-profit.png"
                alt=""
              />
              <div class="title">
                <h3 v-if="queryInfo">
                  {{ queryInfo.correctNum }}
                </h3>
                <h3 v-else>0</h3>
                <span>{{ $t("h.matchBetweenAccountAndReality") }}</span>
              </div>
            </li>
            <li class="item">
              <img
                class="item-img"
                src="@/assets/images/icon-loss.png"
                alt=""
              />
              <div class="title">
                <h3 v-if="queryInfo">
                  {{ queryInfo.queryNotget }}
                </h3>
                <h3 v-else>0</h3>
                <span>{{ $t("h.inventoryLossQuantity") }}</span>
              </div>
            </li>
            <li class="item">
              <img
                class="item-img"
                src="@/assets/images/icon-unknown.png"
                alt=""
              />
              <div class="title">
                <h3 v-if="queryInfo">
                  {{ queryInfo.unnecessaryNum }}
                </h3>
                <h3 v-else>0</h3>
                <span>{{ $t("h.inventorySurplusQuantity") }}</span>
              </div>
            </li>
          </ul>
          <div class="check-show-echart" ref="checkPieRef"></div>
        </div>
        <ul class="table-tabs">
          <li
            v-for="(item, index) in tabletabs"
            :key="index"
            :class="index == activeTableNum ? 'active-item item' : 'item'"
            @click="selectCheckTable(index)"
          >
            <span>{{ item }}</span>
          </li>
          <div
            class="tips"
            v-if="tabletabs[activeTableNum] != $t('h.inventorySurplusAssets')"
          >
            <i class="el-icon-warning"></i>
            <span
              >{{ tabletabs[activeTableNum] }}{{ $t("h.tips128")
              }}{{ $t("h.inventorySurplusQuantity") }}{{ deleteNum }}个</span
            >
          </div>
        </ul>
        <div class="check-table">
          <ds-table
            ref="checkTableRef"
            :loading="tableLoading"
            :tableData="assets"
            :columns="columns"
            :tableConfig="tableConfig"
            :rowKey="(row) => row._id"
            @checkTableRowDetail="checkTableRowDetail"
          ></ds-table>
        </div>
        <div class="check-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="pagination"
          ></ds-pagination>
        </div>
      </div>
    </el-dialog>
    <asset-detail-dialog
      :detailDialogVisible.sync="detailDialogVisible"
      :assetDetailData="assetDetailData"
      @closed="detailDialogVisibleClosed"
    ></asset-detail-dialog>
  </div>
</template>
<script>
import { select } from "@/assets/api";
import { mapState } from "vuex";
import { countTableHeaderWidth } from "@/utils/basic-methods";
import AssetDetailDialog from "@/components/ListComponents/AssetDetailDialog";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
export default {
  components: {
    AssetDetailDialog,
    DsTable,
    DsPagination,
  },
  data() {
    return {
      //echart图
      chartData: [
        { value: 0, name: this.$t("h.quantityToBeOffered") },
        { value: 0, name: this.$t("h.actualQuantityOffered") },
        { value: 0, name: this.$t("h.matchBetweenAccountAndReality") },
        { value: 0, name: this.$t("h.inventoryLossQuantity") },
        { value: 0, name: this.$t("h.inventorySurplusQuantity") },
      ],
      tabletabs: [
        this.$t("h.matchBetweenAccountAndReality"),
        this.$t("h.inventoryLossAssets"),
        this.$t("h.inventorySurplusAssets"),
      ],
      activeTableNum: 0,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      tableLoading: false,
      tableConfig: {
        index: true,
      },
      notQueryedCodes: [],
      hadQueryedCodes: [],
      assets: [],
      deleteNum: 0,
      detailDialogVisible: false,
      assetDetailData: null,
    };
  },
  props: {
    reportDialogVisible: {
      type: Boolean,
      default: false,
    },
    checkBillReport: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader", "stateListData"]),
    dialogVisible: {
      get() {
        return this.reportDialogVisible;
      },
      set(val) {
        this.$emit("update:reportDialogVisible", val);
      },
    },
    queryInfo: {
      get() {
        return this.checkBillReport;
      },
      set(val) {
        this.$emit("update:checkBillReport", val);
      },
    },
    columns() {
      if (this.activeTableNum != 2) {
        let columns = [];
        this.assetTableHeader.forEach((item) => {
          if (item.attr == "photo") {
            columns.push({
              type: "image",
              prop: item.attr,
              label: item.label,
              width: countTableHeaderWidth(item.label),
            });
          } else if (item.attr == "assetCode") {
            columns.push({
              type: "detail",
              prop: item.attr,
              label: item.label,
              width: countTableHeaderWidth(item.label),
              showOverflowTooltip: true,
            });
          } else if (item.attr == "state") {
            columns.push({
              type: "assetState",
              prop: item.attr,
              label: item.label,
              width: countTableHeaderWidth(item.label),
              formatter: (row) => {
                return this.stateListData.find((e) => {
                  return e._id == row[item.attr];
                }).label;
              },
            });
          } else if (
            item.attr == "name" ||
            item.attr == "type" ||
            item.attr == "model" ||
            item.attr == "assertPosition"
          ) {
            columns.push({
              prop: item.attr,
              label: item.label,
              minWidth: countTableHeaderWidth(item.label),
              showOverflowTooltip: true,
            });
          }
        });
        return columns;
      } else {
        let columns = [
          {
            type: "detail",
            prop: "code",
            label: this.$t("h.tableTips3"),
            minWidth: countTableHeaderWidth(this.$t("h.tableTips3")),
            showOverflowTooltip: true,
          },
        ];
        this.assetTableHeader.forEach((item) => {
          if (item.attr == "name" || item.attr == "assetCode") {
            columns.push({
              prop: item.attr,
              label: item.label,
              minWidth: countTableHeaderWidth(item.label),
              showOverflowTooltip: true,
            });
          }
        });
        return columns;
      }
    },
  },
  methods: {
    dialogVisibleClose() {
      document.querySelector(".el-dialog__body").scrollTop = 0;
      this.queryInfo = {};
      this.total = 0;
      this.deleteNum = 0;
      this.paginationForm.currentPage = 1;
      this.paginationForm.pageSize = 20;
      this.activeTableNum = 0;
      this.assets = [];
      this.notQueryedCodes = [];
      this.hadQueryedCodes = [];
      this.chartData = [
        { value: 0, name: this.$t("h.quantityToBeOffered") },
        { value: 0, name: this.$t("h.actualQuantityOffered") },
        { value: 0, name: this.$t("h.matchBetweenAccountAndReality") },
        { value: 0, name: this.$t("h.inventoryLossQuantity") },
        { value: 0, name: this.$t("h.inventorySurplusQuantity") },
      ];

      this.$emit("close");
    },
    dialogVisibleOpen() {
      // 盘盈数量
      let unnecessaryNum =
        this.queryInfo.unnecessary == null
          ? 0
          : this.queryInfo.unnecessary.length;
      this.$set(this.queryInfo, "unnecessaryNum", unnecessaryNum);
      // 盘亏资产
      if (this.queryInfo.notQueryedCodes) {
        this.notQueryedCodes = this.queryInfo.notQueryedCodes.split(",");
        this.notQueryedCodes = this.notQueryedCodes.filter((item) => {
          return item && item.trim();
        });
      }
      // 账实相符
      if (this.queryInfo.hadQueryedCodes) {
        this.hadQueryedCodes = this.queryInfo.hadQueryedCodes
          .split(";")
          .filter(Boolean);
      }
      let correctNum =
        this.hadQueryedCodes.length > 0 ? this.hadQueryedCodes.length : 0;
      this.$set(this.queryInfo, "correctNum", correctNum);
      // 统计图数据
      this.chartData[0].value = this.queryInfo.queryAmount; //应盘数量
      this.chartData[1].value = this.queryInfo.queryActual; //实盘数量
      this.chartData[2].value = this.queryInfo.correctNum; //账实相符
      this.chartData[3].value = this.queryInfo.queryNotget; //盘亏数量
      this.chartData[4].value = this.queryInfo.unnecessaryNum; // 盘盈数量
      // 进来为账实相符表格
      if (this.hadQueryedCodes.length) {
        this.getAssets(this.hadQueryedCodes.join(","));
      }
    },
    dialogVisibleOpened() {
      const chartInstance = this.$echarts.init(this.$refs.checkPieRef);
      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: "30px",
          top: "middle",
        },
        series: [
          {
            type: "pie",
            center: ["35%", "50%"],
            radius: [65, 130],
            data: this.chartData,
            color: ["#5B7CAF", "#79AA47", "#E78342", "#D16464", "#855EBA"],
          },
        ],
      };
      chartInstance.setOption(option);
    },
    selectCheckTable(val) {
      this.activeTableNum = val;
      this.assets = [];
      this.deleteNum = 0;
      this.total = 0;
      this.paginationForm.currentPage = 1;
      if (val == 0 && this.hadQueryedCodes.length) {
        this.getAssets(this.hadQueryedCodes.join(","));
      } else if (val == 1 && this.notQueryedCodes.length) {
        this.getAssets(this.notQueryedCodes.join(","));
      } else if (val == 2) {
        this.total = this.queryInfo.unnecessaryNum;
        this.assets = this.unknownQueryByPage();
      }
    },
    unknownQueryByPage() {
      if (this.queryInfo.unnecessary == null) return [];
      const start =
        (this.paginationForm.currentPage - 1) * this.paginationForm.pageSize;
      const end =
        this.paginationForm.currentPage * this.paginationForm.pageSize;
      return this.queryInfo.unnecessary.slice(start, end);
    },
    pagination() {
      if (this.activeTableNum == 0 && this.hadQueryedCodes.length) {
        this.getAssets(this.hadQueryedCodes.join(","));
      } else if (this.activeTableNum == 1 && this.notQueryedCodes.length) {
        this.getAssets(this.notQueryedCodes.join(","));
      } else {
        this.assets = this.unknownQueryByPage();
      }
    },
    getAssets(code) {
      this.tableLoading = true;
      this.$nextTick(() => {
        this.$refs.checkTableRef.$refs.dsTableRef.bodyWrapper.scrollTop = 0;
      });
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // code: code,
          item: [{ key: "code", handle: "OIS", value: code }],
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.assets = data.data[1];
          if (this.activeTableNum == 0) {
            this.deleteNum = this.queryInfo.correctNum - this.total;
          } else if (this.activeTableNum == 1) {
            this.deleteNum = this.queryInfo.queryNotget - this.total;
          }
        })
        .catch(() => {
          this.tableLoading = false;
          this.total = 0;
          this.deleteNum = 0;
          this.assets = [];
          this.$message.error(this.$t("h.tips18"));
        });
    },
    checkTableRowDetail(val) {
      this.tableLoading = true;
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // code: val.code,
          item: [{ key: "code", handle: "OIS", value: val.code }],
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          if (data.data.length) {
            this.assetDetailData = data.data[0];
            this.detailDialogVisible = true;
          } else {
            this.$message.error(this.$t("h.tips129"));
          }
        })
        .catch(() => {
          this.tableLoading = false;
          this.assetDetailData = null;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    detailDialogVisibleClosed() {
      this.assetDetailData = null;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .report-dialog {
  border-radius: 0px;
  overflow: hidden;
  .el-dialog__header {
    padding: 0;
  }
  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 54px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    .el-button.is-circle {
      padding: 8px;
      vertical-align: middle;
    }
    .title {
      margin-left: 30px;
      font-size: 18px;
      vertical-align: middle;
    }
    .el-icon-close {
      font-size: 24px;
    }
  }
  .el-dialog__body {
    padding: 30px 20px;
    height: calc(100% - 54px);
    overflow: auto;
    box-sizing: border-box;
  }
  .dialog-body {
    margin: 0 auto;
    width: 1000px;
  }
}
.check-show {
  display: flex;
  justify-content: space-between;
  height: 490px;
  .check-show-num {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .item {
      display: flex;
      align-items: center;
      width: 200px;
      height: 80px;
      background: #ffffff;
      box-shadow: 0px 5px 20px 0px rgba(65, 65, 66, 0.1);
      border-radius: 8px;
    }
    .item-img {
      margin: 0 29px 0 15px;
      width: 50px;
      height: 50px;
    }
    h3 {
      text-align: center;
      font-size: 24px;
      font-weight: 400;
      color: #131315;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: #8b8b8e;
    }
  }
  .check-show-echart {
    width: 780px;
    box-shadow: 0px 5px 20px 0px rgba(65, 65, 66, 0.1);
    border-radius: 8px;
  }
}
.table-tabs {
  position: relative;
  display: flex;
  margin-top: 20px;
  width: 100%;
  height: 38px;
  background: #f1f1f1;
  .item {
    padding: 10px 12px;
    color: #888;
    &:hover {
      cursor: pointer;
      color: #588ab9;
      background: #fff;
      box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
    }
  }
  .active-item {
    color: #588ab9;
    font-weight: bold;
    background: #fff;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
  }
  .tips {
    position: absolute;
    display: flex;
    align-items: center;
    right: 20px;
    top: 0;
    height: 38px;
    color: #f56c6c;
    font-size: 14px;
    font-weight: bold;
    i {
      font-size: 18px;
      margin-right: 5px;
    }
  }
}
.check-table {
  margin-top: 10px;
  height: 500px;
}
.check-pagination {
  height: 40px;
}
</style>
