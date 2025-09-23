<template>
  <!-- 新版打印 -->
  <div class="print">
    <el-dialog
      v-loading="loading"
      :title="$t('h.title04')"
      custom-class="settingPrintDialog"
      :visible.sync="dialogVisible"
      fullscreen
      @closed="lookClose"
      @opened="openPrint"
    >
      <div class="box">
        <div class="box-1">
          <div class="tags">
            <el-row :gutter="10">
              <el-col
                :xs="colSize"
                :sm="colSize"
                :lg="colSize"
                v-for="(item, i) in pagMultipleSelection"
                :key="i"
              >
                <el-image
                  :src="item.base"
                  lazy
                  :preview-src-list="assetTagsSrcList"
                ></el-image>
              </el-col>
            </el-row>
          </div>
          <div class="pag">
            <!-- current-page 当前页数 -->
            <!-- total 总页数 -->
            <!-- page-size 每页显示多少条 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="cruuentSize"
              :page-sizes="[10, 20, 50]"
              :page-size="pageSize"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="multipleSelection.length"
            >
            </el-pagination>
          </div>
        </div>
        <div class="box-2" v-loading="refreshLoading">
          <el-form
            :model="ruleForm"
            :rules="ruleFormRules"
            ref="ruleFormRef"
            label-width="141px"
          >
            <el-form-item :label="$t('h.formTips1')" prop="printName">
              <el-select
                v-model="ruleForm.printName"
                :disabled="isTrueImg"
                :placeholder="$t('h.tips4') + $t('h.formTips1')"
                @change="selectChange"
                @clear="printSelectClear"
                clearable
                ref="printerSelectRef"
              >
                <el-option
                  v-for="(item, index) in symbol"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                >
                  {{
                    item.deType == "RFID"
                      ? item.name + " - RFID" + $t("h.formTips1")
                      : item.name +
                        " - " +
                        $t("h.tips47") +
                        "RFID" +
                        $t("h.formTips1")
                  }}
                </el-option>
              </el-select>
              <el-popover
                placement="top-start"
                :title="$t('h.formTips1') + $t('h.tips46')"
                width="200"
                trigger="hover"
              >
                <div>
                  {{ $t("h.formTips1") + $t("h.tips48") }}:{{ printerName
                  }}<br />{{ $t("h.formTips1") + $t("h.tips49") }}:{{
                    printerType == "RFID"
                      ? "RFID" + $t("h.formTips1")
                      : $t("h.tips47") + "RFID" + $t("h.formTips1")
                  }}
                </div>
                <img
                  class="printerInfoIcon"
                  slot="reference"
                  src="@/assets/images/detailIcon.png"
                  :alt="$t('h.tips46')"
                />
              </el-popover>
              <i
                @click="refreshPrinter"
                class="el-icon-refresh refresh_icon"
              ></i>
            </el-form-item>
            <el-form-item :label="$t('h.formTips2')" prop="printNum">
              <el-input-number
                v-model="ruleForm.printNum"
                :min="1"
                :precision="0"
                size="small"
              ></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('h.formTips3')" prop="moban">
              <el-select
                v-model="ruleForm.moban"
                :placeholder="$t('h.tips4') + $t('h.formTips3')"
                @change="templateSelectChange"
                ref="printTempSelectRef"
              >
                <el-option
                  v-for="(item, i) in assetTagsTemplate"
                  :key="i"
                  :label="item.title || item.name"
                  :value="item._id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('h.formTips4')" prop="mobanSize">
              <el-radio-group
                @change="mobanSizeChange"
                size="medium"
                v-model="ruleForm.mobanSize"
              >
                <el-radio-button label="100%"></el-radio-button>
                <el-radio-button label="75%"></el-radio-button>
                <el-radio-button label="50%"></el-radio-button>
                <el-radio-button label="25%"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button
                :disabled="exportPrintResultData.length == 0"
                @click="catchLastPrintResult"
                >{{ $t("h.viewRecentPrintResults") }}</el-button
              >
            </el-form-item>
            <el-collapse v-model="activeNames" accordion>
              <el-collapse-item :title="$t('h.formTips5')" name="1">
                <el-form-item :label="$t('h.formTips6')" prop="transverse">
                  <el-input-number
                    v-model="ruleForm.transverse"
                    size="small"
                    :precision="0"
                  ></el-input-number>
                  <span
                    style="
                      margin-left: 10px;
                      font-size: 12px;
                      position: absolute;
                      width: 165px;
                      line-height: 20px;
                    "
                    >{{ $t("h.formTips7") }}</span
                  >
                </el-form-item>
                <el-form-item :label="$t('h.formTips10')" prop="longitudinal">
                  <el-input-number
                    v-model="ruleForm.longitudinal"
                    size="small"
                    :precision="0"
                  ></el-input-number>
                  <span
                    style="
                      margin-left: 10px;
                      font-size: 12px;
                      position: absolute;
                      width: 165px;
                      line-height: 20px;
                    "
                    >{{ $t("h.formTips8") }}</span
                  >
                </el-form-item>
                <el-form-item :label="$t('h.formTips11')" prop="concentration">
                  <el-input-number
                    v-model="ruleForm.concentration"
                    :max="16"
                    :precision="0"
                    :min="0"
                    size="small"
                  ></el-input-number>
                  <span
                    style="
                      margin-left: 10px;
                      font-size: 12px;
                      position: absolute;
                      width: 165px;
                      line-height: 20px;
                    "
                    >{{ $t("h.formTips9") }}</span
                  >
                </el-form-item>
                <el-button
                  :disabled="isSave"
                  @click="saveMarginParam"
                  type="text"
                  style="margin-left: 40px"
                  >{{ $t("h.saveCurrentPrintSettings") }}</el-button
                >
              </el-collapse-item>
              <el-collapse-item
                v-show="false"
                :title="'RFID' + $t('h.Set')"
                name="2"
              >
                <el-form-item label="RFID">
                  <el-checkbox v-model="ruleForm.Rfid"></el-checkbox>
                </el-form-item>
                <el-form-item
                  :label="$t('h.userArea') + $t('h.printBtn')"
                  prop="userData"
                >
                  <el-checkbox v-model="ruleForm.desc"></el-checkbox>
                  <el-input
                    :placeholder="$t('h.tips3') + $t('h.tips50')"
                    v-if="ruleForm.desc"
                    type="textarea"
                    v-model="ruleForm.userData"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('h.acessPassword')" prop="oldResvSect">
                  <el-input
                    :placeholder="$t('h.tips3') + $t('h.password')"
                    v-model="ruleForm.oldResvSect"
                    style="width: 45%"
                  ></el-input>
                </el-form-item>
              </el-collapse-item>
              <!-- 打印机设置（校验标签位置/重启打印机） -->
              <el-collapse-item :title="$t('h.formTips12')" name="3">
                <el-form-item :label="$t('h.formTips13')">
                  <el-button
                    :disabled="facilityKey == '' ? true : false"
                    @click="checkRFIDTag"
                    >{{
                      printerType == "RFID"
                        ? $t("h.formTips13") + "RFID" + $t("h.formTips14")
                        : $t("h.formTips13") + $t("h.formTips14")
                    }}</el-button
                  >
                </el-form-item>
                <el-form-item>
                  <el-button @click="restartPrinter">{{
                    $t("h.restartThePrinter")
                  }}</el-button>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-form>
          <div class="box2_foot">
            <el-button @click="dialogVisible = false">{{
              $t("h.cancelBtn")
            }}</el-button>
            <el-button type="primary" @click="printingSetout('资产打印')">{{
              $t("h.confirmBtn")
            }}</el-button>
          </div>
        </div>
      </div>
      <div class="version">
        <div>
          {{ $t("h.title34") }}:<span>{{ rfidVersio.rfid_version }}</span>
        </div>
        <div>
          {{ $t("h.title35") }}:<span>{{ rfidVersio.service_version }}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 打印进度 -->
    <!-- resultList = [] -->
    <el-dialog
      custom-class="progressDialog"
      :visible.sync="printProgressDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      top="0"
      @close="printText = ''"
    >
      <div class="icon">
        <img src="@/assets/images/printLoading.gif" alt="" />
      </div>
      <div class="planInfo" v-html="printText" @click="closePrintPlan"></div>
      <div class="ptintTable">
        <el-table
          :data="resultList"
          style="width: 100%"
          height="100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="ackCode" :label="$t('h.state')" width="160">
            <template slot-scope="scope">
              <template v-if="scope.row.ackCode == '0000'">
                <el-tag size="mini">{{ $t("h.title36") }}</el-tag>
              </template>
              <template v-else-if="scope.row.ackCode.substring(0, 2) == '01'">
                <el-tag size="mini">{{ $t("h.title37") }}</el-tag>
              </template>
              <template v-else-if="scope.row.ackCode.substring(0, 2) == '02'">
                <el-tag size="mini">{{ $t("h.title38") }}</el-tag>
              </template>
              <template v-else-if="scope.row.ackCode.substring(0, 2) == '04'">
                <el-tag size="mini">{{ $t("h.title39") }}</el-tag>
              </template>
              <template v-else-if="scope.row.ackCode.substring(0, 2) == '08'">
                <el-tag size="mini">{{ $t("h.title40") }}</el-tag>
              </template>
              <template v-else-if="scope.row.ackCode.substring(0, 2) == '10'">
                <el-tag size="mini">{{ $t("h.title41") }}</el-tag>
              </template>
              <template
                v-else-if="scope.row.ackCode == 'ffff' && printStat == 'End'"
              >
                <el-tag size="mini">{{ $t("h.title42") }}</el-tag>
              </template>
              <template
                v-else-if="scope.row.ackCode == 'ffff' && printStat != 'End'"
              >
                <el-tag size="mini">{{ $t("h.title43") }}</el-tag>
              </template>
              <template v-else>
                <el-tag size="mini">{{ $t("h.title44") }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="$t('h.formTips15')" width="65px">
            <template slot-scope="scope">
              <el-tag
                size="mini"
                type="danger"
                effect="dark"
                v-if="
                  scope.row.ackCode != 'ffff' &&
                  scope.row.ackCode.substring(0, 2) != '00' &&
                  scope.row.ackCode.substring(2) != '00'
                "
              >
                {{ scope.row.ackCode.substring(2) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('h.assetName')"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="epc"
            label="EPC"
            min-width="230"
          ></el-table-column>
        </el-table>
      </div>
      <div class="printBtn">
        <el-button
          @click="exportResultDialogVisible = true"
          :disabled="exportFlag"
          type="success"
          >{{ $t("h.export") }}</el-button
        >
        <el-button
          @click="printProgressDialogVisible = false"
          style="background: #473bb4; color: #fff"
          >{{ $t("h.confirmBtn") }}</el-button
        >
      </div>
    </el-dialog>
    <!-- 是否导出打印结果dialog -->
    <el-dialog
      top="0"
      :title="$t('h.exportPrintingResults')"
      custom-class="exportResultDialog"
      :visible.sync="exportResultDialogVisible"
      @close="exportForm.fileName = ''"
    >
      <div slot="footer" class="dialog-footer">
        <el-form
          ref="exportFormRef"
          :model="exportForm"
          :rules="exportFormRules"
        >
          <el-form-item
            :label="$t('h.formTips16')"
            label-width="110px"
            prop="fileName"
          >
            <el-input
              v-model="exportForm.fileName"
              :placeholder="$t('h.tips3') + $t('h.formTips16')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button
            type="primary"
            @click="exportPrintResult"
            :disabled="exportForm.fileName.length == 0 ? true : false"
          >
            {{ $t("h.confirmBtn") }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- progressDIalog 进度条-->
    <true-progress-dialog
      ref="tpdRef"
      :loadingTitle="$t('h.title45')"
      :successTitle="$t('h.title46')"
      :errorTitle="$t('h.title47')"
      :percentage="percentageNum"
    ></true-progress-dialog>
  </div>
</template>
<script>
import { printPost, printGet, select, update } from "@/assets/api";
import { getCanvasTemplate } from "@/utils/getAssetTemplate";
import { dataToPrintImg } from "@/utils/dataToPrintImage";
import { downLoadExcel } from "@/utils/basic-methods";
import TrueProgressDialog from "./TrueProgressDialog.vue";
export default {
  data() {
    var checkUserData = (rule, value, callback) => {
      const lang = localStorage.getItem("lang");
      const regTest = /^[A-Za-z0-9]+$/;
      if (regTest.test(value) || !value) {
        callback();
      }
      if (lang == "EN") {
        callback(
          new Error("Please enter a combination of letters and numbers")
        );
      } else {
        callback(new Error("请输入字母与数字组合"));
      }
    };
    var checkResvSect = (rule, value, callback) => {
      const lang = localStorage.getItem("lang");
      const regTest = /^[A-Za-z0-9]{4,4}$/;
      if (regTest.test(value) || !value) {
        callback();
      }
      if (lang == "EN") {
        callback(new Error("Please enter letters or numbers with four digits"));
      } else {
        callback(new Error("请输入字母或数字且为四位"));
      }
    };
    return {
      tableData: [],
      // 导出打印结果dialog
      exportResultDialogVisible: false,
      exportForm: {
        fileName: "",
      },
      exportFormRules: {
        //已翻译
        fileName: [
          { required: true, message: "请输入导入文件名称", trigger: "blur" },
        ],
      },
      printResultFields: {
        资产编码: "assetCode",
        资产EPC: "EPC",
        标签写入EPC: "epc",
      },
      exportPrintResultData: [],
      loading: false,
      refreshLoading: false,
      // 分页功能
      pageSize: 10,
      cruuentSize: 1,
      exportFlag: true,
      resultList: [],
      // 打印进度dialog
      printProgressDialogVisible: false,
      printText: "",
      // dialog falag
      dialogVisible: false,
      // 预览图片
      multipleSelection: [],
      // 设置 form
      ruleForm: {
        printName: "",
        printNum: "",
        moban: "", // 模板
        mobanSize: "50%",
        transverse: "0",
        longitudinal: "0",
        concentration: "8",
        Rfid: true,
        desc: false,
        password: "",
        userData: "",
        // 新密码
        // newResvSect: '00000000',
        // 旧密码
        oldResvSect: "",
      },
      ruleFormRules: {
        //已翻译
        printName: [
          {
            required: true,
            message: "请选择打印机",
            trigger: "change",
          },
        ],
        moban: [
          {
            required: true,
            message: "请选择标签模板",
            trigger: "change",
          },
        ],
        userData: [
          { required: false, message: "请输入用户区信息", trigger: "blur" },

          { validator: checkUserData, trigger: "blur" },
        ],
        oldResvSect: [{ validator: checkResvSect, trigger: "blur" }],
      },
      // col的span
      colSize: 8,
      //定时器
      timer: "",
      //折叠层数
      activeNames: ["1"],
      //打印数据
      body: {
        printLab: [],
      },
      //下拉菜单数据
      symbol: [],
      // 打开的打印机类型
      printer: "",
      //打印机Key值
      facilityKey: "",
      //获取下拉选中的下标
      ListIndex: "",
      //打印机DPI
      printerDpi: "",
      //用于拼接数组
      NUMList: [],
      //打印机类型
      printerType: "",
      //解析后的打印机名称
      printerName: "",
      //所有资产标签模板(axios请求得到)
      assetTagsTemplate: [],
      // 处理放大的模板
      assetTagsSrcList: [],
      // 需要打印的模板
      printSelectList: [],
      // 记录打印的资产名称
      printAssetNames: [],
      tagsloading: null,
      percentageNum: 0,
      printStat: null,
      rfidVersio: {
        rfid_version: "",
        service_version: "",
      },
    };
  },
  components: { TrueProgressDialog },
  computed: {
    pagMultipleSelection() {
      return this.multipleSelection.slice(
        (this.cruuentSize - 1) * this.pageSize,
        this.cruuentSize * this.pageSize
      );
    },
    isTrueImg() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].err) {
          return true;
        }
      }
      return false;
    },
    isSave() {
      if (this.printerName) {
        return false;
      }
      return true;
    },
  },
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    selectAssetsData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    //监听打印机名称得变化，不为空时打开打印机
    "ruleForm.printName"(newVal) {
      if (newVal != "") {
        this.loading = true;
        this.printSelectList = [];
        if (this.facilityKey) {
          printGet({
            code: 3,
            key: this.facilityKey,
          })
            .then((result) => {
              this.facilityKey = "";
              printGet({
                code: 2,
                devType: this.symbol[this.ListIndex].deType,
                param: newVal,
              })
                .then(async (result) => {
                  this.$message.success(this.$t("h.tips51"));
                  this.facilityKey = result.data;
                  this.printerName = this.symbol[this.ListIndex].name;
                  this.printerType = this.symbol[this.ListIndex].deType;
                  if (this.printerName) {
                    let deviceRelate = this.assetTagsTemplate.find(
                      (item) => item._id == this.ruleForm.moban
                    ).deviceRelate;
                    let settingParam = deviceRelate.find(
                      (item) => this.printerName.indexOf(item.printModel) != -1
                    );
                    if (settingParam) {
                      this.ruleForm.transverse = settingParam.leftMargin;
                      this.ruleForm.longitudinal = settingParam.topMargin;
                      this.ruleForm.concentration = settingParam.printDarkness;
                    }
                  }
                  window.localStorage.setItem("facilityKey", result.data);
                  await this.lookPrint(2);
                })
                .catch((err) => {
                  this.loading = false;
                  this.$alert(this.$t("h.tips52"), "Tips", {
                    showClose: false,
                    confirmButtonText: this.$t("h.confirmBtn"),
                    callback: (action) => {
                      this.dialogVisible = false;
                    },
                  });
                  return this.$message(this.$t("h.tips53"));
                });
            })
            .catch((err) => {
              this.$message.error(this.$t("h.tips54"));
              printGet({
                code: 2,
                devType: this.symbol[this.ListIndex].deType,
                param: newVal,
              })
                .then(async (result) => {
                  this.$message.success(this.$t("h.tips51"));
                  this.facilityKey = result.data;
                  this.printerName = this.symbol[this.ListIndex].name;
                  this.printerType = this.symbol[this.ListIndex].deType;
                  if (this.printerName) {
                    let deviceRelate = this.assetTagsTemplate.find(
                      (item) => item._id == this.ruleForm.moban
                    ).deviceRelate;
                    let settingParam = deviceRelate.find(
                      (item) => this.printerName.indexOf(item.printModel) != -1
                    );
                    if (settingParam) {
                      this.ruleForm.transverse = settingParam.leftMargin;
                      this.ruleForm.longitudinal = settingParam.topMargin;
                      this.ruleForm.concentration = settingParam.printDarkness;
                    }
                  }
                  window.localStorage.setItem("facilityKey", result.data);
                  await this.lookPrint(2);
                })
                .catch((err) => {
                  this.loading = false;
                  this.$alert(this.$t("h.tips52"), "Tips", {
                    showClose: false,
                    confirmButtonText: this.$t("h.confirmBtn"),
                    callback: (action) => {
                      this.dialogVisible = false;
                    },
                  });
                  return this.$message(this.$t("h.tips53"));
                });
            });
        } else {
          printGet({
            code: 2,
            devType: this.symbol[this.ListIndex].deType,
            param: newVal,
          })
            .then(async (result) => {
              this.$message.success(this.$t("h.tips51"));
              this.facilityKey = result.data;
              this.printerName = this.symbol[this.ListIndex].name;
              this.printerType = this.symbol[this.ListIndex].deType;
              if (this.printerName) {
                let deviceRelate = this.assetTagsTemplate.find(
                  (item) => item._id == this.ruleForm.moban
                ).deviceRelate;
                let settingParam = deviceRelate.find(
                  (item) => this.printerName.indexOf(item.printModel) != -1
                );
                if (settingParam) {
                  this.ruleForm.transverse = settingParam.leftMargin;
                  this.ruleForm.longitudinal = settingParam.topMargin;
                  this.ruleForm.concentration = settingParam.printDarkness;
                }
              }
              window.localStorage.setItem("facilityKey", result.data);
              await this.lookPrint(2);
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
              this.$alert(this.$t("h.tips52"), "Tips", {
                showClose: false,
                confirmButtonText: this.$t("h.confirmBtn"),
                callback: (action) => {
                  this.dialogVisible = false;
                },
              });
              return this.$message(this.$t("h.tips53"));
            });
        }
      }
    },
    printSelectList(val, oldVal) {
      let printTagsLen = this.selectAssetsData.length;
      let createTagsLen = val.length;
      this.percentageNum = Math.trunc((createTagsLen / printTagsLen) * 100);
      if (printTagsLen == createTagsLen) {
        this.$refs["tpdRef"].trueProgressDialogVisible = false;
        this.print();
      }
    },
    exportResultDialogVisible(val) {
      this.exportFormRules.fileName[0].message =
        this.$t("h.tips3") + this.$t("h.formTips16");
    },
  },
  methods: {
    // 获取所有打印模板
    async getAssetTagsTemplate() {
      const { data: res } = await select({
        func: "S0019",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      }).catch((err) => {
        return this.$message.error(this.$t("h.tips18"));
      });
      if (res.code != 0) return this.$message.error(res.data);
      this.assetTagsTemplate = res.data;
    },
    // 关闭弹窗的回调
    lookClose() {
      this.exportPrintResultData = [];
      this.multipleSelection = [];
      this.printSelectList = [];
      this.printerDpi = "";
      this.printerName = "";
      this.assetTagsSrcList = [];
      this.printAssetNames = [];
      this.symbol = [];
      if (this.facilityKey) this.closePrint();
      this.ruleForm.password = "";
      this.$refs["ruleFormRef"].resetFields();
      this.$emit("refreshAssets");
      clearInterval(this.timer);
    },
    // 资产打印准备
    printingSetout() {
      this.$refs["ruleFormRef"].validate((valid) => {
        if (!valid) return false;
        if (this.selectAssetsData.length == this.printSelectList.length) {
          this.printStat = null;
          this.print();
        } else {
          this.$refs["tpdRef"].trueProgressDialogVisible = true;
          this.createPrintTags(this.printerDpi);
        }
      });
    },
    //资产打印
    print() {
      // 弹起打印提示框
      this.printText = this.$t("h.title48");
      this.printProgressDialogVisible = true;
      let resvSect = "";
      if (this.ruleForm.oldResvSect) {
        resvSect =
          this.strToHexCharCode(this.ruleForm.oldResvSect) + "00000000";
        this.ruleForm.password =
          "00F300A2" + this.strToHexCharCode(this.ruleForm.oldResvSect);
      } else {
        this.ruleForm.password = "";
      }
      if (this.printerType == "RFID") {
        for (let i = 0; i < this.printSelectList.length; i++) {
          this.body.printLab[i] = {
            tag: 8,
            printDpi: parseInt(this.printerDpi), //打印机的DPI
            xOffset: parseInt(this.ruleForm.transverse), //横向位置偏移，单位：mm
            yOffset: parseInt(this.ruleForm.longitudinal), //纵向位置偏移，单位：mm
            density: parseInt(this.ruleForm.concentration), //打印浓度，范围0~16
            epcSect: this.printSelectList[i].EPC,
            userSect: this.strToHexCharCode(this.ruleForm.userData), //暂时没有用上 空值
            lockLab: 0,
            encodeLab: 0,
            startIndex: 0,
            labAmount: 1,
            // resvSect: resvSect,
            // lockSect: this.ruleForm.password, //暂时没有用上 空值
            datEncode: "Base64", //"Base64","Hex","String"
            datFmt: "Img", //"Img","Text","Dat"
            prnDats: this.printSelectList[i].base.split(",")[1],
          };
          if (this.ruleForm.Rfid == false) {
            this.body.printLab[i].epcSect = "";
          } else if (this.ruleForm.desc == false) {
            this.body.printLab[i].userSect = "";
          }
        }
      } else {
        for (let i = 0; i < this.printSelectList.length; i++) {
          this.body.printLab[i] = {
            tag: 8,
            printDpi: parseInt(this.printerDpi), //打印机的DPI
            xOffset: parseInt(this.ruleForm.transverse), //横向位置偏移，单位：mm
            yOffset: parseInt(this.ruleForm.longitudinal), //纵向位置偏移，单位：mm
            density: parseInt(this.ruleForm.concentration), //打印浓度，范围0~16
            datEncode: "Base64", //"Base64","Hex","String"
            datFmt: "Img", //"Img","Text","Dat"
            prnDats: this.printSelectList[i].base.split(",")[1],
          };
          if (this.ruleForm.Rfid == false) {
            this.body.printLab[i].epcSect = "";
          } else if (this.ruleForm.desc == false) {
            this.body.printLab[i].userSect = "";
          }
        }
      }

      this.NUMList = this.body.printLab;
      //打印份数
      if (this.ruleForm.printNum > 1) {
        for (var h = 1; h < this.ruleForm.printNum; h++) {
          this.body.printLab = this.body.printLab.concat(this.NUMList);
          this.printAssetNames = this.printAssetNames.concat(
            this.printAssetNames
          );
        }
      }
      printPost(
        "post",
        {
          key: this.facilityKey,
          sendCode: "1",
        },
        this.base64Encode(JSON.stringify(this.body))
      )
        .then((result) => {
          this.resultList = [];
          this.exportFlag = true;
          //查看当前打印页数
          this.timer = setInterval(async () => {
            await this.lookPrint(0);
            await this.lookPrint(1);
          }, 2400);
          this.body.printLab = [];
        })
        .catch((err) => {
          this.body.printLab = [];
          this.printText = `${this.$t(
            "h.tips55"
          )}，<span class='colseSpan'>${this.$t("h.tips56")}<span>`;
        });
    },
    //获取下拉菜单选中值得下标
    selectChange(value) {
      this.ListIndex = this.symbol.findIndex((item) => {
        return item.value == value;
      });
    },
    // 清空打印机
    printSelectClear() {
      this.closePrint();
    },
    //关闭设备
    closePrint() {
      printGet({
        code: 3,
        key: this.facilityKey,
      })
        .then((result) => {
          this.ruleForm.printName = "";
          this.facilityKey = "";
          this.printerName = "";
          this.printerType = "";
          this.$message.success(this.$t("h.tips57"));
        })
        .catch((err) => {
          return this.$message.error(this.$t("h.tips58"));
        });
    },
    //字符串转16进制
    strToHexCharCode(str) {
      if (str === "") return "";
      var hexCharCode = [];
      for (var i = 0; i < str.length; i++) {
        hexCharCode.push(str.charCodeAt(i).toString(16));
      }
      return hexCharCode.join("");
    },
    // 打开枚举打印机
    openPrint() {
      // 获取当前服务版本
      this.getRfidVersion();
      //打开打印机将表单提示进行中英文切换
      this.ruleFormRules.printName[0].message =
        this.$t("h.tips4") + this.$t("h.formTips1");
      this.ruleFormRules.moban[0].message =
        this.$t("h.tips4") + this.$t("h.formTips17");
      this.ruleFormRules.userData[0].message =
        this.$t("h.tips3") + this.$t("h.formTips18");
      // 渲染非打印标签
      this.ruleForm.moban = parseInt(
        window.localStorage.getItem("assetTemaplateId")
      );
      if (
        !this.assetTagsTemplate.some((item) => item._id == this.ruleForm.moban)
      ) {
        this.ruleForm.moban = this.assetTagsTemplate[0]._id || 1;
      }
      this.openApplyAssetTags();
      // 打开dialog之前先关闭
      const facilityKey = window.localStorage.getItem("facilityKey");
      if (facilityKey) printGet({ code: 3, key: facilityKey });
      // 枚举打印机
      printGet({
        code: 1,
      })
        .then((result) => {
          result.data.symbol.forEach((item) => {
            if (
              item.split(";")[0] == "MFG:DASCOM" &&
              item.split(";")[1].indexOf("RFID") != -1
            )
              this.symbol.push({
                name: item.split(";")[2].split(":")[1],
                value: item,
                deType: item.split(";")[1].split(":")[1],
              });
          });
          this.$message.success(this.$t("h.tips59"));
        })
        .catch((error) => {
          if (error.response == undefined) {
            this.$confirm(this.$t("h.tips61"), this.$t("h.title18"), {
              confirmButtonText: this.$t("h.confirmBtn"),
              cancelButtonText: this.$t("h.cancelBtn"),
              type: "warning",
            })
              .then(() => {
                const link = document.createElement("a");
                const url = `https://asset.dascomyun.com/websocket/upload/${this.$t(
                  "h.assetTemplate6"
                )}.msi`;

                link.style.display = "none";
                link.href = url;
                link.setAttribute(`${this.$t("h.assetTemplate6")}.msi`, name);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: this.$t("h.tips62"),
                });
              });
          } else if (error.response.status == 400) {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message: this.$t("h.tips63"),
            });
          } else {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message:
                this.$t("h.tips60") + "," + this.$t("h.restartThePrinter"),
            });
          }
        });
    },
    // 重新刷新打印机
    refreshPrinter() {
      this.refreshLoading = true;
      if (this.facilityKey) this.closePrint();
      this.ruleForm.printName = "";
      this.printerDpi = "";
      this.printerName = "";
      this.symbol = [];
      // 枚举打印机
      printGet({
        code: 1,
      })
        .then((result) => {
          result.data.symbol.forEach((item) => {
            if (
              item.split(";")[0] == "MFG:DASCOM" &&
              item.split(";")[1].indexOf("RFID") != -1
            )
              this.symbol.push({
                name: item.split(";")[2].split(":")[1],
                value: item,
                deType: item.split(";")[1].split(":")[1],
              });
          });
          this.refreshLoading = false;
          this.$message.success(this.$t("h.tips64"));
        })
        .catch((error) => {
          this.refreshLoading = false;
          if (error.response == undefined) {
            this.$confirm(this.$t("h.tips61"), this.$t("h.title18"), {
              confirmButtonText: this.$t("h.confirmBtn"),
              cancelButtonText: this.$t("h.cancelBtn"),
              type: "warning",
            })
              .then(() => {
                const link = document.createElement("a");
                const url = `https://asset.dascomyun.com/websocket/upload/${this.$t(
                  "h.assetTemplate6"
                )}.msi`;

                link.style.display = "none";
                link.href = url;
                link.setAttribute(`${this.$t("h.assetTemplate6")}.msi`, name);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: this.$t("h.tips62"),
                });
              });
          } else if (error.response.status == 400) {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message: this.$t("h.tips63"),
            });
          } else {
            return this.$notify.error({
              title: this.$t("h.title27"),
              message:
                this.$t("h.tips60") + "," + this.$t("h.restartThePrinter"),
            });
          }
        });
    },
    //操作时查看设备状态
    lookPrint(id, isEnd) {
      printGet({
        code: 4,
        key: this.facilityKey,
        param: parseInt(id),
      })
        .then(async (result) => {
          if (id == 2) {
            //2==查看设备信息
            if (
              result.data.DeviceDPI == null ||
              result.data.DeviceDPI == undefined ||
              result.data.DeviceDPI == ""
            )
              this.printerDpi = 203;
            else this.printerDpi = result.data.DeviceDPI;
            this.loading = false;
          } else if (id == 0) {
            const stat = result.data.statInfo.stat;
            this.printStat = result.data.statInfo.stat;
            const errCode = result.data.statInfo.errCode;
            const labs = result.data.statInfo.labs;
            const totals = result.data.statInfo.totals;
            //打印中 打印进度
            this.printText = `${this.$t(
              "h.tips65"
            )}<span>${labs}</span>/<span>${totals}</span>${this.$t(
              "h.tips66"
            )} ... `;
            //查询返回，关闭定时器
            if (stat == "End" && errCode == 0) {
              clearInterval(this.timer);
              this.lookPrint(1, true);
              this.printText = `${this.$t("h.tips67")}`;
            } else if (stat == "Ready") {
              clearInterval(this.timer);
              this.printText = `${this.$t("h.tips68")}`;
              this.lookPrint(1, true);
            } else if (
              stat == "End" &&
              errCode != 0 &&
              labs == 0 &&
              totals == 0
            ) {
              clearInterval(this.timer);
              this.lookPrint(1, true);
              if (errCode == 1) {
                this.printText = `${this.$t("h.tips70")} + ${this.$t(
                  "h.tips69"
                )}`;
              } else if (errCode == 2) {
                this.printText = `${this.$t("h.tips71")} + ${this.$t(
                  "h.tips69"
                )}`;
              } else if (errCode == 3) {
                this.printText = `${this.$t("h.tips72")} + ${this.$t(
                  "h.tips69"
                )}`;
              }
            } else if (stat == "End" && errCode != 0) {
              clearInterval(this.timer);
              this.lookPrint(1, true);
              this.printText = `${this.$t("h.tips67")}`;
            }
            // }
          } else if (id == 1) {
            this.resultList = result.data.labInfo;
            for (let i = 0; i < this.resultList.length; i++) {
              this.resultList[i].name = this.printAssetNames[i].name;
            }
            if (isEnd) {
              // 导出按钮标识符
              this.exportFlag = false;
              // 需要导出的数据准备
              this.exportPrintResultData = this.printAssetNames;
              // epc是否重复验证
              this.resultList.forEach((item, index) => {
                for (let i = 0; i < this.resultList.length; i++) {
                  if (i == index) continue;
                  if (this.resultList[i].tid == this.resultList[index].tid) {
                    item.tips = this.$t("h.tips73");
                  } else {
                    item.tips = this.$t("h.tips74");
                  }
                }
              });
              // 导出结果统计
              for (let i = 0; i < this.resultList.length; i++) {
                for (let k in this.resultList[i]) {
                  this.exportPrintResultData[i][k] = this.resultList[i][k];
                }
              }
              // 提交打印历史给后台
              this.recordPrintHistory(result.data.labInfo);
            }
          }
        })
        .catch((err) => {
          if (id == 2) {
            this.$message.error(this.$t("h.tips75"));
            this.loading = false;
          }
          clearInterval(this.timer);
          this.printText = `${this.$t(
            "h.tips76"
          )},<span class='colseSpan'>${this.$t("h.tips56")}<span>`;
        });
    },
    //  打印结果点击关闭
    closePrintPlan(e) {
      const tagClassName = e.target.className;
      if (tagClassName == "colseSpan") this.printProgressDialogVisible = false;
    },
    // 将打印结果发送给后台
    async recordPrintHistory(labelArr) {
      if (this.printerType != "RFID") {
        labelArr.forEach((item, index) => {
          item.epc = this.printSelectList[index].EPC;
        });
      }
      const printName = this.$refs["printerSelectRef"].selected.label;
      const templateName = this.$refs["printTempSelectRef"].selected.label;
      const { data: res } = await update({
        func: "U0028",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          label: labelArr,
          _id: this.userInfo.staffId,
          printer: printName,
          templateName: templateName, //模板名称
          horizontalPosition: this.ruleForm.transverse, //横向位置
          verticalPosition: this.ruleForm.longitudinal, //纵向位置
          printDensity: this.ruleForm.concentration, //打印浓度
          userArea: this.ruleForm.userData, //用户区
          accessPassword: this.ruleForm.oldResvSect, //访问密码
        },
      }).catch((err) => {
        clearInterval(this.timer);
        return false;
      });
      if (res.code != 0) {
        // test
        clearInterval(this.timer);
        return this.$notify.error({
          title: this.$t("h.title27"),
          message: res.data + this.$t("h.tips77"),
        });
      }
      clearInterval(this.timer);
    },
    //对字符串进行分割，只显示及型号
    SplitDemo(a) {
      // 在每个;处进行分解。
      let ss = a.split(";");
      return ss;
    },
    //字符串转base64
    base64Encode(input) {
      var rv;
      rv = encodeURIComponent(input);
      rv = unescape(rv);
      rv = window.btoa(rv);
      return rv;
    },
    //分段截取字符串,并转为16进制数组  *未使用
    reBytesStrArr1(arr, str) {
      if (!str || str == undefined) return "";
      let num = 0;
      let result = "";
      let j = 0;
      for (let i = 0; i < str.length; i++) {
        var num1 = str.charCodeAt(i);
        if (48 <= num1 && num1 <= 58) {
          num += num1 - 48;
        } else if (97 <= num1 && num1 <= 102) {
          num += num1 - 97 + 10;
        } else if (65 <= num1 && num1 <= 70) {
          num += num1 - 65 + 10;
        } else {
          return;
        }
        if (i % 2 != 0) {
          arr[j++] = num;
          num = 0;
        } else {
          num = num * 16;
        }
      }
      if (str.length != 0 && str.length % 2 != 0) {
        arr[j] = num;
      }
      return arr;
    },
    // 选择模板
    templateSelectChange(val) {
      this.multipleSelection = [];
      this.printSelectList = [];
      this.printAssetNames = [];
      if (this.printerName) {
        let deviceRelate = this.assetTagsTemplate.find(
          (item) => item._id == val
        ).deviceRelate;

        let settingParam = deviceRelate.find(
          (item) => this.printerName.indexOf(item.printModel) != -1
        );
        if (settingParam) {
          this.ruleForm.transverse = settingParam.leftMargin;
          this.ruleForm.longitudinal = settingParam.topMargin;
          this.ruleForm.concentration = settingParam.printDarkness;
        }
      }
      this.openApplyAssetTags();
      this.$confirm(this.$t("h.tips78"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        cancelButtonClass: "changeCancelButton",
        type: "warning",
      })
        .then(() => {
          this.checkRFIDTag();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("h.tips79"),
          });
        });
    },
    // 进来渲染
    async openApplyAssetTags() {
      // 传值
      let canvas = document.createElement("CANVAS");
      await this.recApplyData(this.selectAssetsData, canvas, 0, false); //展示用
    },
    // 生成打印标签
    async createPrintTags(dpi) {
      const canvas = document.createElement("canvas");
      await this.recApplyData(this.selectAssetsData, canvas, 0, true, dpi);
    },
    // 多条渲染
    async recApplyData(data, canvas, i, printFlag, dpi) {
      if (i > data.length - 1 || !this.dialogVisible) {
        if (!this.dialogVisible) {
          this.exportPrintResultData = [];
          this.multipleSelection = [];
          this.printSelectList = [];
          this.printerDpi = "";
          this.assetTagsSrcList = [];
          this.printAssetNames = [];
        }
        return false;
      }
      // console.log(
      //   this.assetTagsTemplate.find((item) => item._id == this.ruleForm.moban)
      // );
      let template = this.assetTagsTemplate.find(
        (item) => item._id == this.ruleForm.moban
      );
      let printInfo = {};
      if (template.html) {
        let element = document.createElement("div");
        element.style.position = "fixed";
        element.style.top = "-1000px";
        document.body.appendChild(element);
        printInfo = await dataToPrintImg(template, element, data[i], dpi);
        document.body.removeChild(element);
      } else {
        printInfo = await getCanvasTemplate(
          template,
          canvas,
          data[i],
          printFlag,
          dpi
        );
      }
      if (printFlag == false) {
        this.multipleSelection.push(printInfo);
        this.assetTagsSrcList.push(printInfo.base);
      } else {
        this.printSelectList.push(printInfo);
        this.printAssetNames.push(printInfo);
      }
      i++;
      this.recApplyData(data, canvas, i, printFlag, dpi);
    },
    //  改变模板大小
    mobanSizeChange(val) {
      switch (val) {
        case "100%":
          this.colSize = 24;
          break;
        case "75%":
          this.colSize = 12;
          break;
        case "50%":
          this.colSize = 8;
          break;
        case "25%":
          this.colSize = 6;
          break;
      }
    },
    // 分页功能
    // 设置条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    // 点击其他页
    handleCurrentChange(cruuentSize) {
      this.cruuentSize = cruuentSize;
    },
    // 校验RFID标签
    checkRFIDTag() {
      if (!this.facilityKey) {
        return this.$notify.error({
          title: this.$t("h.title27"),
          message: this.$t("h.tips80"),
        });
      }
      let type = 0;
      if (this.printerType == "RFID") type = 1;
      this.loading = true;
      printGet({
        code: 5,
        key: this.facilityKey,
        param: 5,
        type: type,
      })
        .then((result) => {
          this.loading = false;
          this.$message.success(this.$t("h.tips81"));
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(this.$t("h.tips82"));
        });
    },
    exportPrintResult() {
      this.$refs["exportFormRef"].validate((vaild) => {
        if (!vaild) return false;
        const exportExcleData = this.exportPrintResultData.map(
          (item, index) => {
            return {
              index: index + 1,
              assetCode: item.assetCode,
              name: item.name,
              EPC: item.EPC,
              tid: item.tid,
              ackCode: item.ackCode,
            };
          }
        );
        // const lang = localStorage.getItem("lang");
        // if (lang == "EN") {
        //   const headStr = `${this.$t("h.index")},${this.$t(
        //     "h.assetCode"
        //   )},${this.$t("h.assetName")},EPC,${this.$t(
        //     "h.formTips14"
        //   )}TID,Verification code\n`;
        // } else {
        //   const headStr = `序号,资产编码,资产名称,资产EPC,标签TID,校验码\n`;
        // }
        const headStr = `序号,资产编码,资产名称,资产EPC,标签TID,校验码\n`;
        downLoadExcel(headStr, exportExcleData, this.exportForm.fileName);
        this.exportResultDialogVisible = false;
      });
    },
    // 重启打印机
    restartPrinter() {
      this.$refs["ruleFormRef"].validate((valid) => {
        if (!valid) {
          return this.$notify.error({
            title: this.$t("h.title27"),
            message: this.$t("h.tips80"),
          });
        }
        this.$confirm(this.$t("h.tips83"), this.$t("h.title18"), {
          confirmButtonText: this.$t("h.confirmBtn"),
          cancelButtonText: this.$t("h.cancelBtn"),
          type: "warning",
        })
          .then(() => {
            printGet({ code: 5, param: 1, key: this.facilityKey })
              .then((result) => {
                this.$message.success(this.$t("h.tips84"));
                this.dialogVisible = false;
              })
              .catch((err) => {
                this.$message.error(this.$t("h.tips85"));
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("h.tips86"),
            });
          });
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.tips == "是") return "repetition-row";
    },
    // 查看最近一次打印结果
    catchLastPrintResult() {
      this.printProgressDialogVisible = true;
    },
    // 保存打印设置
    async saveMarginParam() {
      let deviceRelate = this.assetTagsTemplate.find(
        (item) => item._id == this.ruleForm.moban
      ).deviceRelate;
      deviceRelate.forEach((item) => {
        if (this.printerName.indexOf(item.printModel) != -1) {
          item.leftMargin = this.ruleForm.transverse;
          item.topMargin = this.ruleForm.longitudinal;
          item.printDarkness = this.ruleForm.concentration;
        }
      });
      const { data: res } = await update({
        func: "U0018",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.ruleForm.moban,
          deviceRelate: deviceRelate,
          permissonId: 23,
        },
      });
      if (res.code != 0) return this.$message.error(res.data);
      this.$message.success(res.data);
    },
    //  获取rfid打印驱动版本
    getRfidVersion() {
      printGet({ code: 4, param: 4 })
        .then((result) => {
          console.log("=====>", result);
          this.rfidVersio.rfid_version = result.data.rfid_version;
          this.rfidVersio.service_version = result.data.service_version;
        })
        .catch((err) => {
          this.rfidVersio = "未知版本";
        });
    },
    // beforeunloadHandler (e) {
    //   console.log("e===>", e);
    //   e = e || window.event;
    //   if (e) {
    //     e.returnValue = '关闭提示';
    //   }
    //   return '关闭提示';
    // },
  },
  created() {
    this.getAssetTagsTemplate();
  },
  mounted() {
    // console.log("1231");
    // window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e));
    // window.addEventListener('unload', this.closePrint);
  },
  beforeDestroy() {
    // console.log("beforeDestroy");
    clearInterval(this.timer);
    // window.removeEventListener('beforeunload', this.beforeunloadHandler)
    // window.removeEventListener('unload', this.closePrint)
  },
};
</script>
<style lang="scss" scoped>
::v-deep .settingPrintDialog {
  position: relative;
  .el-dialog__title {
    margin-top: 17px;
    margin-left: 81px;
    font-family: Microsoft YaHei;
    font-weight: 700;
    font-size: 16px;
    color: #1c1c28;
  }
  .el-dialog__header {
    height: 50px;
    padding: 0;
    box-sizing: border-box;
    padding-top: 13px;
    .el-dialog__headerbtn {
      font-size: 24px;
      color: #abaaaa;
      top: 12px;
    }
  }
  .el-dialog__body {
    width: calc(100% - 50px);
    height: calc(100% - 50px);
    padding: 0 0 0 50px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    .box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .box-1 {
        position: relative;
        width: calc(100% - 500px);
        height: 100%;
        background: #ebeced;
        padding: 20px 20px 60px 20px;
        box-sizing: border-box;
        overflow: hidden;
        .tags {
          height: 100%;
          overflow: auto;
          box-sizing: border-box;
          .el-col {
            text-align: center;
          }
          .el-row {
            margin: 0 !important;
            box-sizing: border-box !important;
          }
        }
        .pag {
          position: absolute;
          bottom: 15px;
          right: 30px;
        }
        ::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 10px;
        }
        ::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 4px;
          // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(144, 147, 153, 0.6);
        }
        ::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          background: #ededed;
          margin: 5px 0;
        }
      }
      .box-2 {
        width: 500px;
        height: 100%;
        position: relative;
        overflow: hidden;
        border-top: 1px solid #eceff6;
        padding-top: 34px;
        box-sizing: border-box;
        .el-form {
          height: calc(100% - 100px);
          overflow: auto;
          .el-form-item__label {
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #303133;
          }
          .el-collapse-item__header {
            font-weight: bold;
            color: #000000;
          }
        }
        .box2_foot {
          width: 100%;
          position: absolute;
          right: 50%;
          bottom: 45px;
          transform: translate(50%);
          text-align: center;
          .el-button:nth-of-type(1) {
            width: 100px;
            margin-right: 40px;
            color: #999999;
            border: 1px solid #999999;
            border-radius: 2px;
            box-sizing: border-box;
          }
          .el-button:nth-of-type(2) {
            width: 100px;
            margin-left: 40px;
            background: #473bb4;
            border-radius: 2px;
            box-sizing: border-box;
          }
        }
        .el-collapse {
          margin: 0px 15px 0 32px;
        }
        // 打印机详情图标
        .printerInfoIcon {
          vertical-align: middle;
          margin-left: 14px;
        }
        // 箭头
        .el-collapse-item__arrow {
          font-weight: bold;
          color: #cdcdcd;
        }
      }
    }
  }
  .version {
    font-size: 12px;
    position: absolute;
    bottom: 10px;
    right: 20px;
  }
}
::v-deep .progressDialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-bottom: 0;
  width: 750px;
  height: 500px;
  border-radius: 14px;
  border: none;
  box-shadow: none;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    widows: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    .icon {
      width: 100%;
      height: 100px;
      overflow: hidden;
      text-align: center;
      img {
        height: 100%;
      }
    }
    .planInfo {
      margin-top: 5px;
      margin-bottom: 10px;
      height: 21px;
      text-align: center;
      font-size: 16px;
      color: #000;
      .resultSpan,
      .colseSpan {
        cursor: pointer;
        font-weight: bold;
        color: #0542f8;
      }
    }
    .ptintTable {
      width: 100%;
      height: calc(100% - 196px);
    }
    .printBtn {
      margin-top: 10px;
      text-align: center;
    }
    .el-table .repetition-row {
      background: #f0f9eb;
    }
  }
}
::v-deep .exportResultDialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 14px;
  min-width: 200px;
  .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
  }
  .el-dialog__header {
    padding: 10px 20px;
    border-bottom: 2px solid #eeeeee;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__footer {
    padding: 20px;
  }
  .btn {
    text-align: center;
    .el-button {
      padding: 0;
      span {
        display: block;
        width: 80px;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
::v-deep .changeCancelButton {
  font-size: 25px !important;
}
.refresh_icon {
  transition: all 1s;
  margin-left: 5px;
  cursor: pointer;
  font-size: 26px;
  vertical-align: middle;
  color: #4e42b7;
}
</style>
