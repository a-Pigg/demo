<template>
  <el-dialog
    top="0"
    custom-class="autoDialog"
    :show-close="false"
    :visible.sync="autoDialogVisible"
    @closed="autoDialogVisibleClosed"
    @opened="autoDialogVisibleOpened"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <span>{{ $t("h.automaticInventory") }}</span>
        <span class="checking" v-show="timer != null"
          >{{ $t("h.title133") }}<i class="el-icon-loading"></i
        ></span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="autoDialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="assetTabsClick">
          <el-tab-pane :label="`${$t('h.title134')}(${notTotal})`" name="not">
            <div class="table">
              <ds-table
                ref="notTableRef"
                :loading="notLoading"
                :rowKey="(row) => row._id"
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
          <el-tab-pane :label="`${$t('h.title135')}(${thenTotal})`" name="then">
            <div class="table">
              <ds-table
                ref="notTableRef"
                :loading="thenLoading"
                :rowKey="(row) => row._id"
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
          <el-tab-pane
            :label="`${$t('h.title136')}(${otherTotal})`"
            name="other"
          >
            <div class="table">
              <ds-table
                ref="otherTableRef"
                :loading="otherLoading"
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
</template>
<script>
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import { mapState } from "vuex";
import { countTableHeaderWidth } from "@/utils/basic-methods";
import { closeCheck, getCheckEPC, openCheck, select } from "@/assets/api";
export default {
  components: {
    DsTable,
    DsPagination,
  },
  data() {
    return {
      timer: null,
      timer2: null,
      activeName: "not",
      // 未盘
      notTotal: 0,
      notLoading: false,
      notPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      notAssets: [],
      // 已盘
      thenTotal: 0,
      thenLoading: false,
      thenPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      thenAssets: [],
      // 盘盈
      otherLoading: false,
      otherTotal: 0,
      otherPaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      otherAssets: [],
      // 盘点机盘点到的所有epc
      allEpc: [],
      // 天线
      usedAnts: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    deviceInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(["userInfo", "assetTableHeader", "stateListData"]),
    autoDialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
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
    autoDialogVisibleClosed() {
      clearInterval(this.timer);
      clearTimeout(this.timer2);
      this.endAutoCheck();
      this.notTotal = 0;
      this.thenTotal = 0;
      this.otherTotal = 0;
      this.notPaginationForm.currentPage = 1;
      this.thenPaginationForm.currentPage = 1;
      this.otherPaginationForm.currentPage = 1;
      this.notAssets = [];
      this.thenAssets = [];
      this.otherAssets = [];
      this.allEpc = [];
    },
    autoDialogVisibleOpened() {
      this.notTotal = 0;
      this.thenTotal = 0;
      this.otherTotal = 0;
      this.notPaginationForm.currentPage = 1;
      this.thenPaginationForm.currentPage = 1;
      this.otherPaginationForm.currentPage = 1;
      this.notAssets = [];
      this.thenAssets = [];
      this.otherAssets = [];
      this.allEpc = [];
      // 解析天线绑定数值
      this.setAntArr();
      this.startAutoCheck();
      this.getThenAssets();
      this.getOtherAssets();
    },
    // 解析天线绑定数值
    setAntArr() {
      this.deviceInfo.warehouseIds.forEach((e) => {
        let antarr = e.ant
          .split("")
          .reverse()
          .map((value, index) => (value == 1 ? index + 1 : -1))
          .filter((index) => index !== -1);
        this.usedAnts = [...this.usedAnts, ...antarr];
      });
    },
    assetTabsClick() {},
    // 获取未盘点资产
    getNotAssets() {
      this.notLoading = true;
      let waresId = [];
      this.deviceInfo.warehouseIds.forEach((e) => {
        waresId.push(e.wareHouseId);
      });
      let item = [
        { key: "warehouseId", handle: "OIS", value: waresId.join(",") },
      ];
      this.allEpc.forEach((e) => {
        item.push({ key: "code", handle: "NIS", value: e });
      });
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // 分页
          page: this.thenPaginationForm.pageSize,
          index: this.thenPaginationForm.currentPage,
          // 筛选条件
          item: item,
        },
      })
        .then(({ data }) => {
          this.notLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.notTotal = data.data[0];
          this.notAssets = this.setTableCostomKey(data.data[1]);
        })
        .catch(() => {
          this.notLoading = false;
        });
    },
    // 获取已经盘点资产
    getThenAssets() {
      this.thenLoading = true;
      let waresId = [];
      this.deviceInfo.warehouseIds.forEach((e) => {
        waresId.push(e.wareHouseId);
      });
      let item = [
        { key: "code", handle: "OIS", value: this.allEpc.join(",") },
        { key: "warehouseId", handle: "OIS", value: waresId.join(",") },
      ];
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // 分页
          page: this.thenPaginationForm.pageSize,
          index: this.thenPaginationForm.currentPage,
          // 筛选
          item: item,
        },
      })
        .then(({ data }) => {
          this.thenLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.thenTotal = data.data[0];
          this.thenAssets = this.setTableCostomKey(data.data[1]);
        })
        .catch(() => {
          this.thenLoading = false;
        });
    },
    // 获取盘盈资产
    getOtherAssets() {
      this.otherLoading = true;
      let item = [
        {
          key: "code",
          handle: "OIS",
          value: this.allEpc.join(","),
        },
      ];
      this.deviceInfo.warehouseIds.forEach((e) => {
        item.push({
          key: "warehouseId",
          handle: "NIS",
          value: e.wareHouseId,
        });
      });
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
          this.otherLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.otherTotal = data.data[0];
          this.otherAssets = this.setTableCostomKey(data.data[1]);
        })
        .catch(() => {
          this.otherLoading = false;
        });
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
    // 开启自动盘点
    startAutoCheck() {
      this.getNotAssets();
      openCheck({
        rfidIp: this.deviceInfo.ip,
        rfidRegion: "NA",
        power: 30,
        antnum: this.deviceInfo.antLength,
        usedAnts: this.usedAnts,
        readingDuration: this.deviceInfo.inventoryDuration,
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.message);
          this.$message.success(data.message);
          this.startRequest();
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips232"));
        });
    },
    startRequest() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      let expirationTime = this.deviceInfo.inventoryDuration;
      this.timer = setInterval(() => {
        // 发送请求
        this.makeRequest();
        expirationTime -= 5;
        if (expirationTime < 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.anewAutoCheck();
        }
      }, 5000);
    },
    makeRequest() {
      getCheckEPC({
        rfidIp: this.deviceInfo.ip, //盘点机的IP
        needNew: false,
      })
        .then(({ data }) => {
          if (data.code != 0) {
            clearInterval(this.timer);
            this.timer = null;
            this.$message.error(data.data);
            this.anewAutoCheck();
          }
          if (!data.state) {
            clearInterval(this.timer);
            this.timer = null;
            this.anewAutoCheck();
          }
          if (data.message.length) {
            this.allEpc = Array.from(
              new Set([...this.allEpc, ...data.message])
            );
            this.getNotAssets();
            this.getThenAssets();
            this.getOtherAssets();
          }
        })
        .catch(() => {
          clearInterval(this.timer);
          this.timer = null;
          this.$message.error(this.$t("h.tips18"));
          this.anewAutoCheck();
        });
    },
    // 重新开启盘点
    anewAutoCheck() {
      let timedInterval = this.deviceInfo.timedInterval * 60 * 1000;
      this.timer2 = setTimeout(() => {
        clearTimeout(this.timer2);
        this.notTotal = 0;
        this.thenTotal = 0;
        this.notPaginationForm.currentPage = 1;
        this.thenPaginationForm.currentPage = 1;
        this.notAssets = [];
        this.thenAssets = [];
        this.allEpc = [];
        this.getThenAssets();
        this.getOtherAssets();
        this.startAutoCheck();
      }, timedInterval);
    },
    // 结束盘点
    endAutoCheck() {
      closeCheck({
        rfidIp: this.deviceInfo.ip, //盘点机的IP
      })
        .then(() => {})
        .catch(() => {});
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearTimeout(this.timer2);
  },
};
</script>
<style lang="scss" scoped>
::v-deep .autoDialog {
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
    .content {
      height: 100%;
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
</style>
