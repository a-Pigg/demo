<template>
  <!-- 出入记录 -->
  <div class="record">
    <el-card class="record-card">
      <div slot="header" class="record-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-select
              size="small"
              :placeholder="$t('h.tips4') + $t('h.title128')"
              v-model="selectDevice"
              filterable
              clearable
              @change="onChangeDevice"
              @clear="onClearDevice"
            >
              <el-option
                v-for="item in devices"
                :key="item.equipmentId"
                :label="item.name"
                :value="item.equipmentId"
              >
                <span>{{ item.cloudNumber }} - {{ item.name }}</span>
              </el-option>
            </el-select>
            <el-button
              v-show="selectDevice"
              type="primary"
              size="small"
              style="margin-left: 10px"
              @click="disconnectDevice"
              >{{ $t("h.title142") }}</el-button
            >
            <!-- <span>实时出门记录</span> -->
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="findAssetSearch"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="record-card-content">
        <div class="record-filter">
          <ds-filter-tag
            :filterTagsData="highFilterTags"
            @handleCloseTag="handleCloseFilterTag"
          ></ds-filter-tag>
          <el-button
            type="text"
            size="small"
            @click="filterDrawerVisible = true"
            >{{ $t("h.advancedBtn") }}</el-button
          >
        </div>
        <div class="record-table">
          <ds-table
            ref="recordTableRef"
            :loading="historyLoading"
            :columns="historyColumns"
            :tableConfig="historydConfig"
            :tableData="historyData"
          ></ds-table>
        </div>
        <div class="record-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getMonitoringRecord"
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
      <el-form ref="filterFormRef" label-width="90px">
        <el-form-item :label="$t('h.state')" prop="status">
          <el-select
            v-model="filterForm[0].value"
            clearable
            :placeholder="$t('h.tips4') + $t('h.state')"
          >
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-radio-group v-model="filterForm[0].value">
            <el-radio :label="true">合法</el-radio>
            <el-radio :label="false">非法</el-radio>
          </el-radio-group> -->
        </el-form-item>
        <el-form-item :label="$t('h.date')" prop="date">
          <el-date-picker
            v-model="filterForm[1].value"
            type="datetimerange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('h.formTips38')" prop="name">
          <el-input
            v-model="filterForm[2].value"
            :placeholder="$t('h.tips3') + $t('h.formTips38')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('h.formTips31')"
          prop="number"
          v-if="!this.selectDeviceInfo.CloudSN"
        >
          <el-input
            v-model="filterForm[3].value"
            :placeholder="$t('h.tips3') + $t('h.formTips31')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('h.area')" prop="warehouseName">
          <el-input
            v-model="filterForm[4].value"
            :placeholder="$t('h.tips3') + $t('h.area')"
          ></el-input>
        </el-form-item>
      </el-form>
    </ds-filter-drawer>
  </div>
</template>
<script>
import DsPagination from "@/components/DsPagination";
import DsFilterTag from "@/components/DsFilterTag";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsTable from "@/components/DsTable";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { countTableHeaderWidth } from "@/utils/basic-methods";
import {
  checkCode,
  connectpost,
  disconnectpost,
  getepcpost,
  select,
  warningpost,
} from "@/assets/api";
import { mapState } from "vuex";
import deepCopy from "@/utils/deepCopy";
export default {
  components: {
    DsPagination,
    DsTable,
    DsSearchBtn,
    DsQueryForm,
    DsFilterTag,
    DsFilterDrawer,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      andLike: "",
      selectDevice: "",
      selectDeviceInfo: {
        CloudSN: "",
        ip: "",
        port: "",
      },
      devices: [],
      timer: null,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      historyLoading: false,
      historyColumns: [
        {
          type: "assetState",
          prop: "status",
          label: this.$t("h.state"),
          fixed: false,
          width: countTableHeaderWidth(this.$t("h.state")),
          formatter: (row) => {
            if (row["status"]) {
              return this.$t("h.legitimate");
            } else {
              return this.$t("h.illegal");
            }
          },
        },
        {
          prop: "date",
          label: this.$t("h.date"),
          fixed: false,
          showOverflowTooltip: true,
          width: 180,
        },
        {
          prop: "name",
          label: this.$t("h.formTips38"),
          fixed: false,
          showOverflowTooltip: true,
          minWidth: countTableHeaderWidth(this.$t("h.formTips38")),
        },
        {
          prop: "number",
          label: this.$t("h.formTips31"),
          fixed: false,
          showOverflowTooltip: true,
          width: countTableHeaderWidth(this.$t("h.formTips31")),
        },
        {
          prop: "warehouseName",
          label: this.$t("h.area"),
          fixed: false,
          showOverflowTooltip: true,
          minWidth: countTableHeaderWidth(this.$t("h.area")),
        },
      ],
      historydConfig: {},
      historyData: [],
      filterDrawerVisible: false,
      filterForm: [
        { key: "status", handle: "OIS", value: null },
        { key: "date", handle: "ANDGTE", value: null },
        { key: "name", handle: "ANDLIKE", value: null },
        { key: "number", handle: "ANDLIKE", value: null },
        { key: "warehouseName", handle: "ANDLIKE", value: null },
      ],
      statusOption: [
        { value: true, label: this.$t("h.legitimate") },
        { value: false, label: this.$t("h.illegal") },
      ],
      highFilterTags: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    // 搜索
    findAssetSearch() {},
    // 查询出入库监控
    getMonitoringRecord() {
      this.historyLoading = true;
      let tempFilterArr = deepCopy(this.filterForm);
      let item = tempFilterArr.filter((e) => {
        let eType = typeof e.value;
        if (eType == "string" && e.value) {
          return e;
        } else if (e.value != null && eType == "object" && e.value.length) {
          return e;
        } else if (eType == "boolean") {
          return e;
        }
      });
      let dateDel = [];
      let dateAdd = [];
      item.forEach((e, index) => {
        if (e.key == "date") {
          dateAdd.push({
            handle: "ANDGTE",
            key: e.key,
            value: e.value[0],
          });
          dateAdd.push({
            handle: "ANDLTE",
            key: e.key,
            value: e.value[1],
          });
          dateDel.unshift(index);
        }
      });
      if (dateDel.length) {
        dateDel.forEach((e) => {
          item.splice(e, 1);
        });
        item = [...item, ...dateAdd];
      }
      if (this.selectDeviceInfo.CloudSN) {
        item.push({
          handle: "IS",
          key: "number",
          value: this.selectDeviceInfo.CloudSN,
        });
      }
      select({
        func: "S0077",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // 分页条件
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          item: item,
        },
      })
        .then(({ data }) => {
          this.historyLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[1];
          this.historyData = data.data[0];
        })
        .catch(() => {
          this.historyLoading = false;
          // 服务器网络错误，请求出入库监控历史记录失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 获取设备
    getDevices() {
      select({
        func: "S0073",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: 20,
          index: 1,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.devices = data.data.filter((e) => e.type == 0);
        })
        .catch(() => {
          // 服务器网络错误，请求设备信息失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    onChangeDevice(id) {
      if (!id) return;
      let deviceInfo = this.devices.find((e) => e.equipmentId == id);
      this.selectDeviceInfo.ip = deviceInfo.ip;
      this.selectDeviceInfo.port = deviceInfo.port;
      this.selectDeviceInfo.CloudSN = deviceInfo.cloudNumber;
      // 连接设备
      this.connectingDevice(false, "");
      // this.showAlert();
    },
    onClearDevice() {
      this.connectingDevice(true, window.$BAER_URL.checkCode);
    },
    // 链接设备
    connectingDevice(autoSubmit, submitUrl) {
      connectpost({
        rfidIp: this.selectDeviceInfo.ip, //RFID门禁IP
        rfidPort: this.selectDeviceInfo.port, //RFID门禁端口
        rfidDevId: this.selectDeviceInfo.CloudSN,
        autoSubmit: autoSubmit,
        submitUrl: submitUrl,
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.selectDevice = "";
            this.selectDeviceInfo.ip = "";
            this.selectDeviceInfo.port = "";
            this.selectDeviceInfo.CloudSN = "";

            return this.$message.error(data.message);
          }
          this.$message.success(data.message);
          if (!autoSubmit) {
            this.timer = setInterval(() => {
              this.getDoorEpc();
            }, 1000);
          }
        })
        .catch(() => {
          // 服务网络错误，连接门禁设备失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 断开设备
    disconnectDevice() {
      disconnectpost({
        rfidIp: this.selectDeviceInfo.ip, //RFID门禁IP
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.message);
          this.selectDeviceInfo.ip = "";
          this.selectDeviceInfo.port = "";
          this.selectDeviceInfo.CloudSN = "";
          clearInterval(this.timer);
          this.$message.success(data.message);
        })
        .catch(() => {
          // 服务网络错误，断开门禁设备失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 查询设备经过资产（EPC）
    getDoorEpc() {
      getepcpost({
        rfidIp: this.selectDeviceInfo.ip, //RFID门禁IP
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.message);
          this.checkEpc(data.message);
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 查证epc是否合法
    checkEpc(epc) {
      if (!epc.length) return;
      checkCode({
        code: epc.join(","), //RFID门禁IP
        number: this.selectDeviceInfo.CloudSN, //RFID门禁端口
        state: true,
      })
        .then(({ data }) => {
          if (data.code != 0) return;
          if (data.warning != 0) this.illegalEpc();
          this.getMonitoringRecord();
        })
        .catch(() => {});
    },
    // 非法资产发出警告
    illegalEpc() {
      warningpost({
        rfidIp: this.selectDeviceInfo.ip, //RFID门禁IP
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.message);
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.getMonitoringRecord();
    },
    resetFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.getMonitoringRecord();
    },
    mapHighFilterTags() {
      this.highFilterTags = [];
      let tempFilterArr = deepCopy(this.filterForm);
      let item = tempFilterArr.filter((e) => {
        let eType = typeof e.value;
        console.log(eType);
        if (eType == "string" && e.value) {
          return e;
        } else if (e.value != null && eType == "object" && e.value.length) {
          return e;
        } else if (eType == "boolean") {
          return e;
        }
      });
      console.log(item);
      item.forEach((e) => {
        if (e.key == "status") {
          let highFilteritem = {};
          highFilteritem.name = this.$t("h.state");
          highFilteritem.keyStr = e.key;
          highFilteritem.value =
            e.value == true ? this.$t("h.legitimate") : this.$t("h.illegal");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "date") {
          let highFilteritem = {};
          highFilteritem.name = this.$t("h.date");
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value.join(this.$t("h.to"));
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "name") {
          let highFilteritem = {};
          highFilteritem.name = this.$t("h.formTips38");
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value;
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "number") {
          let highFilteritem = {};
          highFilteritem.name = this.$t("h.formTips31");
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value;
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "warehouseName") {
          let highFilteritem = {};
          highFilteritem.name = this.$t("h.area");
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value;
          this.highFilterTags.push(highFilteritem);
        }
      });
    },
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm.forEach((e) => {
        if (e.key == val.keyStr) e.value = null;
      });
      this.getMonitoringRecord();
    },
    showAlert() {
      let obj = {
        rfidIp: this.selectDeviceInfo.ip, //RFID门禁IP
        rfidPort: this.selectDeviceInfo.port, //RFID门禁端口
        rfidDevId: this.selectDeviceInfo.CloudSN,
        autoSubmit: true,
        submitUrl: window.$BAER_URL.checkCode,
      };
      navigator.sendBeacon(window.$PRINT_URL2.connect, JSON.stringify(obj));
    },
  },
  created() {
    this.getDevices();
    this.getMonitoringRecord();
  },
  mounted() {
    window.addEventListener("beforeunload", this.showAlert);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    window.removeEventListener("beforeunload", this.showAlert);
  },
  beforeRouteLeave(to, form, next) {
    if (!this.selectDeviceInfo.CloudSN) return next();
    this.$confirm(this.$t("h.tips239"), this.$t("h.title18"), {
      confirmButtonText: this.$t("h.confirmBtn"),
      cancelButtonText: this.$t("h.cancelBtn"),
      type: "warning",
    })
      .then(() => {
        this.connectingDevice(true, window.$BAER_URL.checkCode);
        next();
      })
      .catch(() => {
        next();
      });
  },
};
</script>
<style lang="scss" scoped>
.record {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .record-card {
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
.record-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.record-card-content {
  height: 100%;
  .record-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
  }
  .record-table {
    height: calc(100% - 75px);
  }
  .record-pagination {
    height: 40px;
  }
}
</style>
