<template>
  <div class="device">
    <el-card class="device-card">
      <div slot="header" class="device-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button type="primary" size="small" @click="createDevice">{{
              $t("h.newBtn")
            }}</el-button>
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editBaseInfo">{{
                  $t("h.editBtn") + $t("h.tips230")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="editWareInfo">{{
                  $t("h.editBtn") + $t("h.tips231")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="deleteDevice">{{
                  $t("h.delBtn")
                }}</el-dropdown-item>
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
            ref="deviceTableRef"
            :loading="loading"
            :columns="columns"
            :tableConfig="devicesConfig"
            :tableData="devices"
            :rowKey="(row) => row.equipmentId"
            onlyKey="equipmentId"
            @handleSelectionChange="handleSelectionChange"
          >
            <template slot="ant" slot-scope="{ scope }">
              <el-button
                type="text"
                size="mini"
                @click="checkAntennaBinding(scope.row)"
              >
                {{ $t("h.antennaBindingDetails") }}
              </el-button>
              <span class="line" v-if="scope.row.type == '1'"></span>
              <el-button
                v-if="scope.row.type == '1'"
                type="text"
                size="mini"
                icon="el-icon-tickets"
                @click="autoCheck(scope.row)"
                >{{ $t("h.automaticInventory") }}</el-button
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
          <el-form-item :label="$t('h.formTips30')" prop="name">
            <el-input
              v-model="deviceForm.name"
              :placeholder="$t('h.tips3') + $t('h.formTips30')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.formTips37')" prop="type">
            <el-radio-group v-model="deviceForm.type">
              <el-radio :label="0"> {{ $t("h.title128") }}</el-radio>
              <el-radio :label="1"> {{ $t("h.title129") }}</el-radio>
              <el-radio :label="2"> {{ $t("h.title130") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('h.formTips31')" prop="cloudNumber">
            <el-input
              v-model="deviceForm.cloudNumber"
              :placeholder="$t('h.tips3') + $t('h.formTips31')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.tips48')" prop="model">
            <el-input
              v-model="deviceForm.model"
              :placeholder="$t('h.tips3') + $t('h.tips48')"
            ></el-input>
          </el-form-item>
          <!-- 定时间隔 ：分钟 -->
          <el-form-item
            v-if="deviceForm.type == 1"
            :label="$t('h.formTips32')"
            prop="timedInterval"
          >
            <el-input-number
              v-model="deviceForm.timedInterval"
              size="small"
              :min="1"
              controls-position="right"
            ></el-input-number>
            <span style="margin-left: 10px">{{ $t("h.title131") }}</span>
          </el-form-item>
          <!-- 盘点时长：秒 -->
          <el-form-item
            v-if="deviceForm.type == 1"
            :label="$t('h.formTips33')"
            prop="inventoryDuration"
          >
            <el-input-number
              v-model="deviceForm.inventoryDuration"
              size="small"
              :min="30"
              controls-position="right"
            ></el-input-number>
            <span style="margin-left: 10px">{{ $t("h.second") }}</span>
          </el-form-item>
          <el-form-item label="IP" prop="ip" v-if="deviceForm.type != 2">
            <el-input
              v-model="deviceForm.ip"
              :placeholder="$t('h.tips3') + 'IP'"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('h.formTips34')"
            prop="port"
            v-if="deviceForm.type == 0"
          >
            <el-input
              v-model="deviceForm.port"
              :placeholder="$t('h.tips3') + $t('h.formTips34')"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('h.formTips35')"
            prop="antLength"
            v-if="deviceForm.type == 1"
          >
            <el-input-number
              v-model="deviceForm.antLength"
              controls-position="right"
              step-strictly
              :min="1"
              @change="onChangeAntLength"
            ></el-input-number>
          </el-form-item>
          <el-form-item :label="$t('h.formTips36')" prop="warehouseIds">
            <el-select
              style="width: 100%"
              :placeholder="$t('h.tips4') + $t('h.formTips36')"
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
          v-if="deviceForm.type == 1 && deviceForm.warehouseIds.length"
        >
          <h5>{{ $t("h.title132") }}</h5>
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
                :placeholder="$t('h.tips4')"
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
          <span>{{ $t("h.antennaBindingDetails") }}</span>
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
    <!-- 删除失败详情 -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
    <!-- 编辑基础信息 -->
    <new-bills-dialog
      class="base-dialog"
      :title="$t('h.editBtn') + $t('h.tips230')"
      :newBillsDialogVisible.sync="baseDialogVisible"
      @opened="baseDialogOpened"
      @close="baseDialogClose"
      @sbumitForm="sbumitBaseForm"
    >
      <template slot="form">
        <el-form
          ref="baseFormRef"
          label-width="130px"
          :model="baseForm"
          :rules="baseFormRules"
        >
          <el-form-item :label="$t('h.formTips30')" prop="name">
            <el-input
              v-model="baseForm.name"
              :placeholder="$t('h.tips3') + $t('h.formTips30')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.formTips37')" prop="type">
            <el-radio-group v-model="baseForm.type">
              <el-radio :label="0">{{ $t("h.title128") }}</el-radio>
              <el-radio :label="1">{{ $t("h.title129") }}</el-radio>
              <el-radio :label="2">{{ $t("h.title130") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('h.formTips31')" prop="cloudNumber">
            <el-input
              disabled
              v-model="baseForm.cloudNumber"
              :placeholder="$t('h.tips3') + $t('h.formTips31')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.tips48')" prop="model">
            <el-input
              v-model="baseForm.model"
              :placeholder="$t('h.tips3') + $t('h.tips48')"
            ></el-input>
          </el-form-item>
          <!-- 定时间隔 ：分钟 -->
          <el-form-item
            v-if="baseForm.type == 1"
            :label="$t('h.formTips32')"
            prop="timedInterval"
          >
            <el-input-number
              v-model="baseForm.timedInterval"
              size="small"
              :min="1"
              controls-position="right"
            ></el-input-number>
            <span style="margin-left: 10px">{{ $t("h.title131") }}</span>
          </el-form-item>
          <!-- 盘点时长：秒 -->
          <el-form-item
            v-if="baseForm.type == 1"
            :label="$t('h.formTips33')"
            prop="inventoryDuration"
          >
            <el-input-number
              v-model="baseForm.inventoryDuration"
              size="small"
              :min="30"
              controls-position="right"
            ></el-input-number>
            <span style="margin-left: 10px">{{ $t("h.second") }}</span>
          </el-form-item>
          <el-form-item label="IP" prop="ip" v-if="baseForm.type != 2">
            <el-input
              v-model="baseForm.ip"
              :placeholder="$t('h.tips3') + 'IP'"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('h.formTips34')"
            prop="port"
            v-if="baseForm.type == 0"
          >
            <el-input
              v-model="baseForm.port"
              :placeholder="$t('h.tips3') + $t('h.formTips34')"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('h.formTips35')"
            prop="antLength"
            v-if="baseForm.type == 1"
          >
            <el-input-number
              v-model="baseForm.antLength"
              controls-position="right"
              step-strictly
              :min="1"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </template>
    </new-bills-dialog>
    <!-- 编辑区域信息 -->
    <new-bills-dialog
      class="ware-dialog"
      :title="$t('h.editBtn') + $t('h.tips231')"
      :newBillsDialogVisible.sync="wareDialogVisible"
      @close="wareDialogClose"
      @opened="wareDialogOpened"
      @sbumitForm="sbumitEditWareForm"
    >
      <template slot="form">
        <el-form
          ref="editAreaFormRef"
          label-width="130px"
          :model="editWareForm"
          :rules="editWareFormRules"
        >
          <el-form-item :label="$t('h.formTips36')" prop="warehouseIds">
            <el-select
              style="width: 100%"
              :placeholder="$t('h.tips4') + $t('h.formTips36')"
              v-model="editWareForm.warehouseIds"
              clearable
              filterable
              multiple
              @remove-tag="onRemoveWareTag"
              @clear="onClearWare"
              :filter-method="() => {}"
              v-load-more="{
                options: wareData,
                modelField: 'ids',
                model: editWareForm.warehouseIds.join(','),
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
        <el-form
          v-if="
            selectDevices.length == 1 &&
            selectDevices[0].type == 1 &&
            editWareForm.warehouseIds.length
          "
          ref="antennaFormRef"
          label-width="130px"
          :model="antennaForm"
        >
          <el-form-item
            v-for="item in editAntWares"
            :key="item._id"
            :label="item.warehouseName"
            :prop="`${item._id}`"
          >
            <el-select
              v-model="antennaForm[item._id]"
              :placeholder="$t('h.tips4')"
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
      </template>
    </new-bills-dialog>
    <!-- 自动盘点 -->
    <auto-check-dialog
      :visible.sync="autoVisible"
      :deviceInfo="deviceInfo"
    ></auto-check-dialog>
  </div>
</template>
<script>
import AutoCheckDialog from "@/components/BillsComponents/AutoCheckDialog";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import {
  antennaColumns,
  deleteDevoceErrorColumns,
  deviceColumns,
} from "@/utils/systemData";
import { connectpost, deleteData, select, update } from "@/assets/api";
import { mapState } from "vuex";
export default {
  components: {
    AutoCheckDialog,
    DsDeleteDetail,
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
      selectDevices: [],
      newBillTitle: this.$t("h.newBtn") + this.$t("h.device"),
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
        // 设备编号
        cloudNumber: "",
        // 型号
        model: "",
        // 定时间隔
        timedInterval: 1,
        // 盘点时长
        inventoryDuration: 30,
        // 绑定区域
        warehouseIds: [],
        // ip
        ip: "",
        // 端口
        port: "",
        // 天线数量
        antLength: null,
        // permissonId:26
      },
      deviceFormRules: {
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips30"),
            trigger: "blur",
          },
        ],
        cloudNumber: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips31"),
            trigger: "blur",
          },
        ],
        ip: [
          {
            required: true,
            message: this.$t("h.tips3") + "IP",
            trigger: "blur",
          },
        ],
        port: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips34"),
            trigger: "blur",
          },
        ],
        warehouseIds: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips36"),
            trigger: "change",
          },
        ],
      },
      wareData: [],
      deviceAntenna: [
        {
          label: this.$t("h.title140"),
          value: 1,
          disabled: false,
        },
      ],
      antennaForm: {},
      dialogAntennaVisible: false,
      antennaBindingData: [],
      antennaColumns: antennaColumns,
      deleteDialogVisible: false,
      deleteColumns: deleteDevoceErrorColumns,
      deleteErrorData: [],
      // 编辑基础信息
      baseDialogVisible: false,
      baseForm: {
        equipmentId: "",
        // 设备名称
        name: "",
        // 设备类型
        type: 0,
        // 设备编号
        cloudNumber: "",
        // 型号
        model: "",
        // 定时间隔
        timedInterval: 1,
        // 盘点时长
        inventoryDuration: 30,
        ip: "",
        port: "",
        // 天线数量
        antLength: null,
      },
      baseFormRules: {
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips30"),
            trigger: "blur",
          },
        ],
        cloudNumber: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips31"),
            trigger: "blur",
          },
        ],
        ip: [
          {
            required: true,
            message: this.$t("h.tips3") + "IP",
            trigger: "blur",
          },
        ],
        port: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips34"),
            trigger: "blur",
          },
        ],
      },
      wareDialogVisible: false,
      editWareForm: {
        warehouseIds: [],
      },
      editWareFormRules: {
        warehouseIds: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.area"),
            trigger: "change",
          },
        ],
      },
      editWareFlag: false,
      // 自动盘点
      autoVisible: false,
      deviceInfo: {},
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    wares() {
      if (this.deviceForm.type == 1) {
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
    editAntWares() {
      if (this.editWareFlag && this.selectDevices[0].type == 1) {
        let arr = [];
        this.editWareForm.warehouseIds.forEach((e) => {
          let item = this.wareData.find((item) => item._id == e);
          if (item) {
            arr.push(item);
          }
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
        if (this.deviceForm.type == 1) {
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
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 表格选中设备信息
    handleSelectionChange(val) {
      this.selectDevices = val;
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
      this.deviceForm.ip = "";
      this.deviceForm.port = "";
      this.deviceForm.type = 0;
      this.deviceForm.timedInterval = 1;
      this.deviceForm.inventoryDuration = 30;
      this.deviceForm.antLength = null;
      this.deviceForm.warehouseIds = [];
      this.antennaForm = {};
      this.deviceAntenna = [
        {
          label: this.$t("h.title140"),
          value: 1,
          disabled: false,
        },
      ];
    },
    connectingDevice(rfidIp, rfidPort, rfidDevId, autoSubmit, submitUrl) {
      connectpost({
        rfidIp: rfidIp, //RFID门禁IP
        rfidPort: rfidPort, //RFID门禁端口
        rfidDevId: rfidDevId,
        autoSubmit: autoSubmit,
        submitUrl: submitUrl,
      })
        .then(({ data }) => {
          if (data.code != 0) {
            return this.$message.error(data.message);
          }
          this.$message.success(data.message);
        })
        .catch(() => {
          // "服务网络错误，连接门禁设备失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 发送设备表单
    sbumitDeviceForm() {
      this.$refs.deviceFormRef.validate((valid) => {
        if (!valid) return false;
        if (this.deviceForm.type == 1) {
          let flag = true;
          for (const key in this.antennaForm) {
            if (this.antennaForm[key].length == 0) {
              flag = false;
              break;
            }
          }
          if (!flag) {
            this.$message.error(this.$t("h.tips233"));
            return false;
          }
        }
        const LOADING = this.$loading(this.dialogLoading);
        let wareIds = [];
        wareIds = this.deviceForm.warehouseIds.map((e) => {
          return {
            warehouseId: e,
          };
        });
        if (this.deviceForm.type == 1) this.bingAntToString(wareIds);
        update({
          func: "U0080",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            name: this.deviceForm.name,
            type: this.deviceForm.type,
            cloudNumber: this.deviceForm.cloudNumber,
            timedInterval:
              this.deviceForm.type == 1 ? this.deviceForm.timedInterval : null,
            inventoryDuration:
              this.deviceForm.type == 1
                ? this.deviceForm.inventoryDuration
                : null,
            model: this.deviceForm.model,
            ip: this.deviceForm.ip,
            port: this.deviceForm.port,
            warehouseIds: wareIds,
            antLength: this.deviceForm.antLength,
            permissonId: 26,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.getDevice();
            if (this.deviceForm.type == 0) {
              this.connectingDevice(
                this.deviceForm.ip,
                this.deviceForm.port,
                this.deviceForm.cloudNumber,
                true,
                window.$BAER_URL.checkCode
              );
            }
            this.newBillsDialogVisible = false;
          })
          .catch((err) => {
            LOADING.close();
            console.log(err);
            // "服务器网络异常，新增/编辑设备失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // -------
    onChangeAntLength(currentValue, oldValue) {
      let ant = [];
      for (let i = 0; i < currentValue; i++) {
        let obj = {
          label: `${i + 1}${this.$t("h.title141")}`,
          value: i + 1,
          disabled: false,
        };
        ant.push(obj);
      }
      this.deviceAntenna = ant;
      this.antennaForm = {};
    },
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
      console.log(val);
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
      this.antennaForm = {};
    },
    // 查看天线绑定详情
    checkAntennaBinding(row) {
      if (row.type != "1") return this.$message.info(this.$t("h.tips234"));
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
            e.ant += `${index + 1}${this.$t("h.title141")}`;
          }
        });
      });
      this.dialogAntennaVisible = true;
    },
    dialogAntennaVisibleClosed() {
      this.antennaBindingData = [];
    },
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    deleteDevice() {
      if (this.selectDevices.length == 0) {
        return this.$message.error(this.$t("h.tips22"));
      }
      this.$confirm(this.$t("h.tips235"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          this.deleteErrorData = [];
          this.multiDeletaDevice(0);
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    multiDeletaDevice(index) {
      if (index > this.selectDevices.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getDevice();
        this.$refs["deviceTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips236"));
        }
        return;
      }
      deleteData({
        func: "D0032",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          equipmentId: this.selectDevices[index].equipmentId,
          permissonId: 26,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              cloudNumber: this.selectDevices[index].cloudNumber,
              name: this.selectDevices[index].name,
              reason: data.data,
            });
          }
          this.multiDeletaDevice(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            cloudNumber: this.selectDevices[index].cloudNumber,
            name: this.selectDevices[index].name,
            reason: this.$t("h.tips18"),
          });
          this.multiDeleteArea(++index);
        });
    },
    // 编辑基础信息
    editBaseInfo() {
      if (this.selectDevices.length === 0) {
        return this.$message.error(this.$t("h.tips237"));
      }
      if (this.selectDevices.length > 1) {
        return this.$message.error(this.$t("h.tips238"));
      }
      this.baseForm.equipmentId = this.selectDevices[0].equipmentId;
      this.baseForm.name = this.selectDevices[0].name;
      this.baseForm.type = parseInt(this.selectDevices[0].type);
      this.baseForm.cloudNumber = this.selectDevices[0].cloudNumber;
      this.baseForm.model = this.selectDevices[0].model;
      this.baseForm.ip = this.selectDevices[0].ip;
      this.baseForm.port = this.selectDevices[0].port;
      this.baseForm.antLength = this.selectDevices[0].antLength;
      this.baseForm.timedInterval = this.selectDevices[0].timedInterval;
      this.baseForm.inventoryDuration = this.selectDevices[0].inventoryDuration;
      this.baseDialogVisible = true;
    },
    baseDialogOpened() {
      this.$refs.baseFormRef.clearValidate();
    },
    baseDialogClose() {
      this.baseForm.equipmentId = "";
      this.baseForm.name = "";
      this.baseForm.type = 0;
      this.baseForm.timedInterval = 1;
      this.baseForm.inventoryDuration = 30;
      this.baseForm.cloudNumber = "";
      this.baseForm.model = "";
      this.baseForm.ip = "";
      this.baseForm.port = "";
      this.baseForm.antLength = null;
      this.$refs["deviceTableRef"].$refs["dsTableRef"].clearSelection();
    },
    sbumitBaseForm() {
      this.$refs.baseFormRef.validate((valid) => {
        if (!valid) return false;
      });
      const LOADING = this.$loading({
        target: ".base-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      update({
        func: "U0081",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          equipmentId: this.baseForm.equipmentId,
          name: this.baseForm.name,
          type: this.baseForm.type,
          cloudNumber: this.baseForm.cloudNumber,
          model: this.baseForm.model,
          timedInterval:
            this.baseForm.type == 1 ? this.baseForm.timedInterval : null,
          inventoryDuration:
            this.baseForm.type == 1 ? this.baseForm.inventoryDuration : null,
          ip: this.baseForm.ip,
          port: this.baseForm.port,
          antLength: this.baseForm.antLength,
          permissonId: 26,
        },
      })
        .then(({ data }) => {
          LOADING.close();
          if (data.code != 0) return this.$message.error(data.data);
          this.baseDialogVisible = false;
          this.$message.success(data.data);
          this.getDevice();
        })
        .catch(() => {
          LOADING.close();
          // 服务器网络异常，编辑设备基础信息失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    editWareInfo() {
      if (this.selectDevices.length === 0) {
        return this.$message.error(this.$t("h.tips237"));
      }
      if (this.selectDevices.length > 1) {
        return this.$message.error(this.$t("h.tips238"));
      }
      this.editWareFlag = true;
      // 处理天线
      if (this.selectDevices[0].type == 1) {
        console.log("天线数量", this.selectDevices[0].antLength);
        this.onChangeAntLength(this.selectDevices[0].antLength);
        this.selectDevices[0].warehouseIds.forEach((e) => {
          this.antennaForm[e.wareHouseId] = [];
          e.ant
            .split("")
            .reverse()
            .forEach((t, i) => {
              if (t == 1) {
                this.antennaForm[e.wareHouseId].push(i + 1);
                this.deviceAntenna[i].disabled = true;
              }
            });
        });
      }
      // 处理区域
      this.selectDevices[0].warehouseIds.forEach((e) => {
        this.editWareForm.warehouseIds.push(e.wareHouseId);
      });
      this.wareDialogVisible = true;
      console.log(this.selectDevices[0]);
    },
    wareDialogOpened() {},
    wareDialogClose() {
      this.editWareForm.warehouseIds = [];
      this.antennaForm = {};
      this.deviceAntenna = [
        {
          label: this.$t("h.title140"),
          value: 1,
          disabled: false,
        },
      ];
    },
    sbumitEditWareForm() {
      this.$refs.editAreaFormRef.validate((valid) => {
        if (!valid) return false;
        if (this.selectDevices[0].type == 1) {
          let flag = true;
          for (const key in this.antennaForm) {
            if (this.antennaForm[key].length == 0) {
              flag = false;
              break;
            }
          }
          if (!flag) {
            this.$message.error(this.$t("h.tips233"));
            return false;
          }
        }
        let item = [];
        item = this.editWareForm.warehouseIds.map((e) => {
          return {
            warehouseId: e,
            equipmentId: this.selectDevices[0].equipmentId,
          };
        });
        if (this.selectDevices[0].type == 1) this.bingAntToString(item);
        update({
          func: "U0082",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            item: item,
            permissonId: 26,
          },
        })
          .then(({ data }) => {
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.wareDialogVisible = false;
            this.getDevice();
          })
          .catch(() => {
            // 服务器网络异常，新增/编辑设备失败
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // 绑定天线转换32
    bingAntToString(itemArr) {
      let hexArr = [];
      for (const key in this.antennaForm) {
        if (this.antennaForm[key].length) {
          let ant = [];
          for (let i = 0; i < 32; i++) ant[i] = 0;
          let obj = { key: key, ant: ant };
          this.antennaForm[key].forEach((e) => (obj.ant[e - 1] = 1));
          obj.ant.reverse();
          hexArr.push(obj);
        }
      }
      itemArr.forEach((e) => {
        hexArr.forEach((c) => {
          if (e.warehouseId == c.key) e.ant = c.ant.join("");
        });
      });
    },
    // 自动盘点
    autoCheck(row) {
      this.deviceInfo = row;
      this.autoVisible = true;
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
.line {
  vertical-align: middle;
  margin: 0 10px;
  border-right: 2px solid #000;
}
</style>
