<template>
  <div class="device">
    <el-card class="device-card">
      <div slot="header" class="device-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button type="primary" size="small" @click="createDevice"
              >新建</el-button
            >
            <el-dropdown trigger="click">
              <el-button size="small">
                编辑<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editDeviceForm"
                  >修改</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel></ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="device-card-content">
        <div class="device-filter"></div>
        <div class="device-table">
          <ds-table
            :loading="loading"
            :columns="columns"
            :tableConfig="devicesConfig"
            :tableData="devices"
            :rowKey="(row) => row._id"
            @handleSelectionChange="handleSelectionChange"
          >
            <template slot="ant" slot-scope="{ scope }">
              <el-button
                type="text"
                size="mini"
                @click="checkAntennaBinding(scope.row)"
              >
                天线绑定详情
              </el-button>
            </template>
            <template slot="operation" slot-scope="{ scope }">
              <el-button
                type="text"
                size="mini"
                @click="activateWhiteList(scope.row)"
                >激活白名单</el-button
              >
            </template>
          </ds-table>
        </div>
        <div class="device-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getDevice"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <!-- 新增设备 -->
    <new-bills-dialog
      class="new-bill-dialog"
      :title="newBillTitle"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @close="newBillsDialogClose"
      @sbumitForm="sbumitDeviceForm"
    >
      <template slot="form">
        <el-form
          ref="deviceFormRef"
          label-width="130px"
          :model="deviceForm"
          :rules="deviceFormRules"
        >
          <el-form-item label="设备名称" prop="name">
            <el-input
              v-model="deviceForm.name"
              placeholder="请输入设备名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="type">
            <el-radio-group v-model="deviceForm.type">
              <el-radio :label="0">门禁</el-radio>
              <el-radio :label="1">盘点机</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="云序号" prop="cloudNumber">
            <el-input
              v-model="deviceForm.cloudNumber"
              placeholder="请输入云序号"
            ></el-input>
          </el-form-item>
          <el-form-item label="型号" prop="model">
            <el-input
              v-model="deviceForm.model"
              placeholder="请输入设备型号"
            ></el-input>
          </el-form-item>
          <el-form-item label="绑定区域" prop="warehouseIds">
            <el-select
              style="width: 100%"
              placeholder="请输入绑定区域"
              v-model="deviceForm.warehouseIds"
              clearable
              filterable
              multiple
              @remove-tag="onRemoveWareTag"
              @clear="onClearWare"
              :filter-method="() => {}"
              v-load-more="{
                options: wareData,
                modelField: '_id',
                searchField: 'andLike',
                func: 'S0003',
                userInfo: userInfo,
              }"
            >
              <el-option
                v-for="item in wareData"
                :key="item._id"
                :label="item.warehouseName"
                :value="item._id"
              >
                <span> {{ item.code }} - {{ item.warehouseName }} </span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <div
          class="antenna-area"
          v-if="deviceForm.type && deviceForm.warehouseIds.length"
        >
          <h5>区域绑定天线</h5>
          <el-form
            ref="antennaFormRef"
            label-width="100px"
            :model="antennaForm"
          >
            <el-form-item
              v-for="item in wares"
              :key="item._id"
              :label="item.warehouseName"
              :prop="`${item._id}`"
            >
              <el-select
                v-model="antennaForm[item._id]"
                placeholder="请选择"
                multiple
                clearable
                filterable
                @change="onChangeAntenna"
                @clear="onClearAntenna"
                @remove-tag="onRemoveAntennaTag"
              >
                <el-option
                  v-for="antennaItem in deviceAntenna"
                  :key="antennaItem.value"
                  :label="antennaItem.label"
                  :value="antennaItem.value"
                  :disabled="antennaItem.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </new-bills-dialog>
    <!-- 天线绑定详情 -->
    <el-dialog
      top="0"
      custom-class="dialogAntenna"
      :show-close="false"
      :visible.sync="dialogAntennaVisible"
      @closed="dialogAntennaVisibleClosed"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>天线绑定详情</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="dialogAntennaVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <ds-table
          :columns="antennaColumns"
          :tableConfig="{}"
          :tableData="antennaBindingData"
          :rowKey="(row) => row.warehouse_id"
        ></ds-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import {
  antennaColumns,
  deviceAntenna,
  deviceColumns,
} from "@/utils/systemData";
import { select, update } from "@/assets/api";
import { mapState } from "vuex";
export default {
  components: {
    NewBillsDialog,
    DsTable,
    DsPagination,
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
      loading: false,
      columns: deviceColumns,
      devicesConfig: {
        selection: true,
        reserveSelection: true,
      },
      devices: [],
      selectDevice: [],
      newBillTitle: "新建设备",
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      newBillsDialogVisible: false,
      deviceForm: {
        // 设备名称
        name: "",
        // 设备类型
        type: 0,
        // 云序号
        cloudNumber: "",
        // 型号
        model: "",
        // 绑定区域
        warehouseIds: [],
        // permissonId:26
      },
      deviceFormRules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        cloudNumber: [
          { required: true, message: "请输入云序号", trigger: "blur" },
        ],
        model: [{ required: true, message: "请输入设备型号", trigger: "blur" }],
        warehouseIds: [
          { required: true, message: "请选择绑定区域", trigger: "change" },
        ],
      },
      wareData: [],
      deviceAntenna: deviceAntenna,
      antennaForm: {},
      dialogAntennaVisible: false,
      antennaBindingData: [],
      antennaColumns: antennaColumns,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    wares() {
      if (this.deviceForm.type) {
        let arr = [];
        this.deviceForm.warehouseIds.forEach((e) => {
          let item = this.wareData.find((item) => item._id == e);
          arr.push(item);
        });
        return arr;
      } else {
        return [];
      }
    },
  },
  watch: {
    "deviceForm.warehouseIds": {
      handler(newValue) {
        if (this.deviceForm.type) {
          for (const key in this.antennaForm) {
            if (!newValue.includes(Number(key))) {
              delete this.antennaForm[key];
            }
          }
        }
      },
    },
  },
  methods: {
    // 获取设备信息
    getDevice() {
      this.loading = true;
      select({
        func: "S0073",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          data.data.forEach((e) => {
            let wareNames = [];
            e.wareHouseDOS.forEach((c) => {
              wareNames.push(c.warehouse_name);
            });
            e.warehouseName = wareNames.join(",");
          });
          this.devices = data.data;
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("服务器网络错误，请求设备信息失败");
        });
    },
    // 表格选中设备信息
    handleSelectionChange(val) {
      this.selectDevice = val;
      console.log(val);
    },
    // 新建按钮
    createDevice() {
      this.newBillsDialogVisible = true;
    },
    // 新建/编辑弹窗开启钩子
    newBillsDialogOpened() {
      this.$refs.deviceFormRef.clearValidate();
    },
    // 新建/编辑弹窗关闭钩子
    newBillsDialogClose() {
      this.deviceForm.name = "";
      this.deviceForm.cloudNumber = "";
      this.deviceForm.model = "";
      this.deviceForm.type = 0;
      this.deviceForm.warehouseIds = [];
      this.antennaForm = {};
      this.deviceAntenna.forEach((e) => {
        e.disabled = false;
      });
    },
    // 发送设备表单
    sbumitDeviceForm() {
      this.$refs.deviceFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        let wareIds = [];
        wareIds = this.deviceForm.warehouseIds.map((e) => {
          return {
            warehouseId: e,
          };
        });
        if (this.deviceForm.type == 1) {
          // 将绑定天线转换
          let hexArr = [];
          for (const key in this.antennaForm) {
            if (this.antennaForm[key].length) {
              // 有值，生成一个32个为0的数组
              let ant = [];
              for (let i = 0; i < 32; i++) {
                ant[i] = 0;
              }
              let obj = {
                key: key,
                ant: ant,
              };
              this.antennaForm[key].forEach((e, index) => {
                obj.ant[e - 1] = 1;
              });
              // 数组翻转
              obj.ant.reverse();
              hexArr.push(obj);
            }
          }
          wareIds.forEach((e) => {
            hexArr.forEach((c) => {
              if (e.warehouseId == c.key) {
                e.ant = c.ant.join("");
              }
            });
          });
        }
        update({
          func: "U0080",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            name: this.deviceForm.name,
            type: this.deviceForm.type,
            cloudNumber: this.deviceForm.cloudNumber,
            model: this.deviceForm.model,
            warehouseIds: wareIds,
            permissonId: 26,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newBillsDialogVisible = false;
            this.$message.success(data.data);
            this.getDevice();
          })
          .catch(() => {
            LOADING.close();
            this.$message.error("服务器网络异常，新增/编辑设备失败");
          });
      });
    },
    // 激活白名单
    activateWhiteList(row) {
      this.loading = true;
      update({
        func: "U0084",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          cloudNumber: row.cloudNumber,
        },
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.$message.success(data.data);
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("服务器网络错误，激活白名单失败");
        });
    },
    // -------
    onChangeAntenna(val) {
      this.deviceAntenna.forEach((e) => {
        val.forEach((v) => {
          if (e.value == v) {
            e.disabled = true;
          }
        });
      });
    },
    onRemoveAntennaTag(val) {
      console.log("onRemoveAntennaTag>>>", val);
      this.deviceAntenna.forEach((e) => {
        if (e.value == val) {
          e.disabled = false;
        }
      });
    },
    onClearAntenna() {
      let antenna = [];
      for (const key in this.antennaForm) {
        antenna = [...antenna, ...this.antennaForm[key]];
      }
      this.deviceAntenna.forEach((e) => {
        e.disabled = false;
      });
      antenna.forEach((e) => {
        this.deviceAntenna.forEach((v) => {
          if (e == v.value) {
            v.disabled = true;
          }
        });
      });
    },
    // ---------
    onRemoveWareTag(val) {
      this.antennaForm[val].forEach((e) => {
        this.deviceAntenna.forEach((v) => {
          if (v.value == e) {
            v.disabled = false;
          }
        });
      });
    },
    onClearWare() {
      this.deviceAntenna.forEach((e) => {
        e.disabled = false;
      });
    },
    // ---------
    editDeviceForm() {
      console.log("修改设备表单");
    },
    // 查看天线绑定详情
    checkAntennaBinding(row) {
      if (row.type != "1") return this.$message.info("该机器没有天线设置");
      this.antennaBindingData = row.wareHouseDOS.map((e) => {
        return {
          warehouse_id: e.warehouse_id,
          warehouse_name: e.warehouse_name,
        };
      });
      this.antennaBindingData.forEach((e) => {
        let item = row.warehouseIds.find(
          (v) => e.warehouse_id == v.wareHouseId
        );
        e.ant = "";
        let antArr = item.ant.split("").reverse();
        antArr.forEach((k, index) => {
          if (k == "1") {
            e.ant += `${index + 1}号天线  `;
          }
        });
      });
      this.dialogAntennaVisible = true;
    },
    dialogAntennaVisibleClosed() {
      this.antennaBindingData = [];
    },
  },
  created() {
    this.getDevice();
  },
};
</script>
<style lang="scss" scoped>
.device {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .device-card {
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
.device-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.device-card-content {
  height: 100%;
  .device-filter {
    height: 35px;
  }
  .device-table {
    height: calc(100% - 75px);
  }
  .device-pagination {
    height: 40px;
  }
}
.antenna-area {
  width: 100%;
  .antenna-select {
    width: 100%;
  }
  .item {
    display: flex;
    align-items: center;
    height: 40px;
    width: 100%;
    .label {
      padding-right: 12px;
      width: 118px;
      text-align: right;
    }
    .antenna {
      display: flex;
      align-items: center;
      width: calc(100% - 130px);
      height: 100%;
    }
  }
  .antenna-item {
    margin-right: 15px;
    width: 8px;
    height: 30px;
    border: 1px solid #eee;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    box-sizing: border-box;
    &:hover {
      background-color: #588ab9;
    }
  }
}
::v-deep .dialogAntenna {
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
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
