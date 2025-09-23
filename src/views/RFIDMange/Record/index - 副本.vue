<template>
  <!-- 出入记录 -->
  <div class="record">
    <el-card class="record-card">
      <div slot="header" class="record-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-select
              size="small"
              placeholder="请选择门禁"
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
          <el-button size="small" type="text" @click="openRecordDialog"
            >查询出入库监控</el-button
          >
        </div>
        <div class="record-table">
          <ds-table
            ref="recordTableRef"
            :loading="loading"
            :columns="columns"
            :tableConfig="recordConfig"
            :tableData="record"
          ></ds-table>
        </div>
        <div class="record-pagination"></div>
      </div>
    </el-card>
    <!-- 监控历史记录dialog -->
    <el-dialog
      top="0"
      custom-class="recordDialog"
      :show-close="false"
      :visible.sync="recordDialogVisible"
      @opened="recordDialogVisibleOpened"
      @closed="recordDialogVisibleClosed"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>门禁监控历史记录</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="recordDialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <div class="filter">
          <ds-filter-tag
            :filterTagsData="highFilterTags"
            @handleCloseTag="handleCloseFilterTag"
          ></ds-filter-tag>
          <el-button
            type="text"
            size="small"
            @click="filterDrawerVisible = true"
            >高级筛选</el-button
          >
        </div>
        <div class="table">
          <ds-table
            ref="historyTableRef"
            :loading="historyLoading"
            :columns="historyColumns"
            :tableConfig="historydConfig"
            :tableData="historyData"
          ></ds-table>
        </div>
      </div>
    </el-dialog>
    <!-- 高级筛选 -->
    <ds-filter-drawer
      :filterDrawerVisible.sync="filterDrawerVisible"
      @submitFilterForm="submitFilterForm"
      @resetFilterForm="resetFilterForm"
    >
      <el-form ref="filterFormRef" label-width="90px">
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="filterForm[0].value"
            clearable
            placeholder="请选择状态"
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
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="filterForm[1].value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="物品名称" prop="name">
          <el-input
            v-model="filterForm[2].value"
            placeholder="请输入物品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="number">
          <el-input
            v-model="filterForm[3].value"
            placeholder="请输入设备编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="warehouseName">
          <el-input
            v-model="filterForm[4].value"
            placeholder="请输入区域"
          ></el-input>
        </el-form-item>
      </el-form>
    </ds-filter-drawer>
  </div>
</template>
<script>
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
      loading: false,
      recordConfig: {},
      columns: [
        {
          type: "billState",
          prop: "inOutState",
          label: "状态",
          fixed: false,
          width: countTableHeaderWidth("状态"),
          formatter: (row) => {
            switch (row["inOutState"]) {
              case -2:
                return "非法";
              case 0:
                return "合法";
              default:
                return "错误编码";
            }
          },
        },
        {
          prop: "time",
          label: "时间",
          fixed: false,
          showOverflowTooltip: true,
          width: 180,
        },
        {
          prop: "name",
          label: "物品名称",
          fixed: false,
          showOverflowTooltip: true,
          minWidth: countTableHeaderWidth("物品名称"),
        },
        {
          prop: "model",
          label: "型号",
          fixed: false,
          showOverflowTooltip: true,
          width: countTableHeaderWidth("型号"),
        },
        {
          prop: "assetCode",
          label: "编码",
          fixed: false,
          showOverflowTooltip: true,
          width: countTableHeaderWidth("ECP----------------------"),
        },
        {
          prop: "photo",
          type: "image",
          label: "图片",
          fixed: false,
          showOverflowTooltip: true,
          width: countTableHeaderWidth("图片"),
        },
      ],
      record: [],
      // deduplicationData: [],
      selectDevice: "",
      selectDeviceInfo: {
        CloudSN: "",
        ip: "",
        port: "",
      },
      devices: [],
      timer: null,
      recordDialogVisible: false,
      historyLoading: false,
      historyColumns: [
        {
          prop: "status",
          label: "状态",
          fixed: false,
          width: countTableHeaderWidth("状态"),
          formatter: (row) => {
            if (row["status"]) {
              return "合法";
            } else {
              return "非法";
            }
          },
        },
        {
          prop: "date",
          label: "日期",
          fixed: false,
          showOverflowTooltip: true,
          width: 180,
        },
        {
          prop: "name",
          label: "物品名称",
          fixed: false,
          showOverflowTooltip: true,
          minWidth: countTableHeaderWidth("物品名称"),
        },
        {
          prop: "number",
          label: "设备编号",
          fixed: false,
          showOverflowTooltip: true,
          width: countTableHeaderWidth("设备编号"),
        },
        {
          prop: "warehouseName",
          label: "区域",
          fixed: false,
          showOverflowTooltip: true,
          minWidth: countTableHeaderWidth("区域"),
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
        { value: true, label: "合法" },
        { value: false, label: "非法" },
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
        console.log(eType);
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
      select({
        func: "S0077",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          item: item,
        },
      })
        .then(({ data }) => {
          this.historyLoading = false;
          console.log(data);
          if (data.code != 0) return this.$message.error(data.data);
          this.historyData = data.data;
        })
        .catch(() => {
          this.historyLoading = false;
          this.$message.error("服务器网络错误，请求出入库监控历史记录失败");
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
          this.$message.error("服务器网络错误，请求设备信息失败");
        });
    },
    onChangeDevice(id) {
      if (!id) return;
      let deviceInfo = this.devices.find((e) => e.equipmentId == id);
      this.selectDeviceInfo.ip = deviceInfo.ip;
      this.selectDeviceInfo.port = deviceInfo.port;
      this.selectDeviceInfo.CloudSN = deviceInfo.cloudNumber;
      console.log(this.selectDeviceInfo);
      // 连接设备
      this.connectingDevice();
    },
    onClearDevice() {
      // 断开设备
      this.disconnectDevice();
    },
    // 链接设备
    connectingDevice() {
      connectpost({
        rfidIp: this.selectDeviceInfo.ip, //RFID门禁IP
        rfidPort: this.selectDeviceInfo.port, //RFID门禁端口
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
          this.timer = setInterval(() => {
            this.getDoorEpc();
          }, 1000);
        })
        .catch(() => {
          this.$message.error("服务网络错误，连接门禁设备失败");
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
          this.record = [];
          // this.deduplicationData = [];
          clearInterval(this.timer);
          this.$message.success(data.message);
        })
        .catch(() => {
          this.$message.error("服务网络错误，断开门禁设备失败");
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
          this.$message.error("服务器网络错误");
        });
    },
    // 查证epc是否合法
    checkEpc(epc) {
      if (!epc.length) return;
      checkCode({
        code: epc.join(","), //RFID门禁IP
        number: this.selectDeviceInfo.CloudSN, //RFID门禁端口
      })
        .then(({ data }) => {
          if (data.code != 0) return;
          if (data.data) {
            let nowTime = new Date();
            data.data.forEach((e) => {
              if (!e.whiteList) {
                this.illegalEpc();
                e.inOutState = -2;
              } else {
                e.inOutState = 0;
              }
              e.time = nowTime.toLocaleString();
              this.record.unshift(e);
            });
          }
          // console.log(data);
          // toLocaleString
          // if (data.data) {
          //   let myDate = new Date();
          //   data.data.forEach((itme1) => {
          //     if (
          //       itme1.name != "未知" &&
          //       this.deduplicationData.every(
          //         (item2) => item2.code !== itme1.code
          //       )
          //     ) {
          //       if (!itme1.whiteList) {
          //         this.illegalEpc();
          //         itme1.inOutState = -2;
          //       } else {
          //         itme1.inOutState = 0;
          //       }
          //       itme1.time = myDate.toLocaleTimeString();
          //       this.record.unshift(itme1);
          //       this.deduplicationData.unshift(itme1);
          //     }
          //   });
          // }
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
          this.$message.error("服务器网络错误");
        });
    },
    openRecordDialog() {
      this.recordDialogVisible = true;
    },
    recordDialogVisibleOpened() {
      this.getMonitoringRecord();
    },
    recordDialogVisibleClosed() {},
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
          highFilteritem.name = "状态";
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value == true ? "合法" : "非法";
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "date") {
          let highFilteritem = {};
          highFilteritem.name = "日期";
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value.join("至");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "name") {
          let highFilteritem = {};
          highFilteritem.name = "物品名称";
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value;
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "number") {
          let highFilteritem = {};
          highFilteritem.name = "设备编号";
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value;
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "warehouseName") {
          let highFilteritem = {};
          highFilteritem.name = "区域";
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
    showAlert(event) {
      const message = "你确定要离开吗？";
      event.returnValue = message; // 标准的浏览器需要设置returnValue属性
      return message; // 兼容非标准浏览器
    },
  },
  created() {
    this.getDevices();
  },
  mounted() {
    window.addEventListener("beforeunload", this.showAlert);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.disconnectDevice();
    window.removeEventListener("beforeunload", this.showAlert);
  },
  // beforeRouteLeave(to, form, next) {
  //   console.log(123);
  // },
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
::v-deep .recordDialog {
  position: fixed;
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
  }
  .el-dialog__body {
    padding: 0;
    height: calc(100% - 36px);
  }
  .dialog-body {
    padding: 0 14px 14px 14px;
    height: 100%;
    box-sizing: border-box;
    .filter {
      display: flex;
      justify-content: flex-end;
      height: 35px;
    }
    .table {
      height: calc(100% - 35px);
    }
  }
}
</style>
