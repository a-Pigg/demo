<template>
  <el-dialog
    top="0"
    custom-class="dialog"
    fullscreen
    :visible.sync="dialogVisible"
    :show-close="false"
    @open="dialogVisibleOpen"
    @opened="dialogVisibleOpened"
    @close="dialogVisibleClose"
    @closed="dialogVisibleClosed"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          circle
          @click="dialogVisible = false"
        ></el-button>
        <span class="title">{{ title }}</span>
      </div>
      <div class="right">
        <el-button size="small" @click="dialogVisible = false">{{
          $t("h.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="submitAssetForm">{{
          $t("h.confirmBtn")
        }}</el-button>
      </div>
    </div>
    <div class="dialog-body">
      <el-row class="nav" :gutter="45">
        <el-form
          label-width="100px"
          label-position="left"
          ref="assetFormRef"
          :model="assetForm"
          :rules="assetFormRules"
        >
          <el-col :span="12">
            <el-form-item :label="formLabel['classifyId']" prop="classifyId">
              <ds-select-tree
                :placeholder="$t('h.tips4') + formLabel['classifyId']"
                v-model="assetForm.classifyId"
                :defaultProps="assetTypeProps"
                :treeData="typeData"
              ></ds-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['assetCode']" prop="assetCode">
              <el-input
                :disabled="assetForm._id == '' ? false : true"
                clearable
                v-model="assetForm.assetCode"
                :placeholder="$t('h.tips3') + formLabel['assetCode']"
              ></el-input>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('h.tips17')"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['name']" prop="name">
              <el-input
                clearable
                v-model="assetForm.name"
                :placeholder="$t('h.tips3') + formLabel['name']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['groudName']" prop="groudName">
              <el-input
                clearable
                v-model="assetForm.groudName"
                :placeholder="$t('h.tips3') + formLabel['groudName']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['model']" prop="model">
              <el-input
                clearable
                v-model="assetForm.model"
                :placeholder="$t('h.tips3') + formLabel['model']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['snNumber']" prop="snNumber">
              <el-input
                clearable
                v-model="assetForm.snNumber"
                :placeholder="$t('h.tips3') + formLabel['snNumber']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['unit']" prop="unit">
              <el-input
                clearable
                v-model="assetForm.unit"
                :placeholder="$t('h.tips3') + formLabel['unit']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['inData']" prop="inData">
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                :placeholder="$t('h.tips4') + formLabel['inData']"
                v-model="assetForm.inData"
              >
                <!-- format="yyyy 年 MM 月 dd 日" -->
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['source']" prop="source">
              <el-select
                filterable
                clearable
                v-model="assetForm.source"
                :placeholder="$t('h.tips4') + formLabel['source']"
              >
                <el-option
                  v-for="(item, index) in sourceData"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['num']" prop="num">
              <el-input
                disabled
                v-model="assetForm.num"
                :placeholder="$t('h.tips3') + formLabel['num']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['goodsId']" prop="goodsId">
              <el-select
                filterable
                clearable
                v-model="assetForm.goodsId"
                :placeholder="$t('h.tips4') + formLabel['goodsId']"
              >
                <el-option
                  v-for="item in attrData"
                  :key="item._id"
                  :label="item.name"
                  :value="item.goodsqId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dialogVisible">
            <el-form-item :label="formLabel['warehouseId']" prop="warehouseId">
              <!-- <el-select
                placeholder="请选择区域"
                v-model="assetForm.warehouseId"
                clearable
                filterable
                remote
                :remote-method="wareRemoteMethod"
              >
                <el-option
                  v-for="item in wareData"
                  :key="item._id"
                  :label="item.warehouseName"
                  :value="item._id"
                >
                  <span> {{ item.code }} - {{ item.warehouseName }} </span>
                </el-option>
              </el-select> -->
              <el-select
                :placeholder="$t('h.tips4') + formLabel['warehouseId']"
                v-model="assetForm.warehouseId"
                clearable
                filterable
                :filter-method="() => {}"
                v-load-more="{
                  options: wareData,
                  modelField: '_id',
                  model: assetForm.warehouseId,
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
          </el-col>
          <el-col :span="24">
            <span class="form-title">{{ $t("h.supplierInformation") }}</span>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['producter']" prop="producter">
              <el-input
                clearable
                v-model="assetForm.producter"
                :placeholder="$t('h.tips3') + formLabel['producter']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['productAddr']" prop="productAddr">
              <el-input
                clearable
                v-model="assetForm.productAddr"
                :placeholder="$t('h.tips3') + formLabel['productAddr']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['supplier']" prop="supplier">
              <el-input
                clearable
                v-model="assetForm.supplier"
                :placeholder="$t('h.tips3') + formLabel['supplier']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="formLabel['supplierPerson']"
              prop="supplierPerson"
            >
              <el-input
                clearable
                v-model="assetForm.supplierPerson"
                :placeholder="$t('h.tips3') + formLabel['supplierPerson']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="formLabel['supplierPhone']"
              prop="supplierPhone"
            >
              <el-input
                clearable
                v-model="assetForm.supplierPhone"
                :placeholder="$t('h.tips3') + formLabel['supplierPhone']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <span class="form-title">{{ $t("h.maintenanceInformation") }}</span>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="formLabel['maintainPerson']"
              prop="maintainPerson"
            >
              <el-input
                clearable
                v-model="assetForm.maintainPerson"
                :placeholder="$t('h.tips3') + formLabel['maintainPerson']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="formLabel['maintainLast']"
              prop="maintainLast"
            >
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                :placeholder="$t('h.tips4') + formLabel['maintainLast']"
                v-model="assetForm.maintainLast"
              >
                <!-- format="yyyy 年 MM 月 dd 日" -->
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="formLabel['maintainRemark']"
              prop="maintainRemark"
            >
              <el-input
                clearable
                v-model="assetForm.maintainRemark"
                :placeholder="$t('h.tips3') + formLabel['maintainRemark']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <span class="form-title">{{ $t("h.useInformation") }}</span>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['useDate']" prop="useDate">
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                :placeholder="$t('h.tips4') + formLabel['useDate']"
                v-model="assetForm.useDate"
              >
              <!-- format="yyyy 年 MM 月 dd 日" -->
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['useState']" prop="useState">
              <el-input
                clearable
                v-model="assetForm.useState"
                :placeholder="$t('h.tips3') + formLabel['useState']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['useType']" prop="useType">
              <el-input
                clearable
                v-model="assetForm.useType"
                :placeholder="$t('h.tips3') + formLabel['useType']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['deptCode']" prop="deptCode">
              <el-input
                clearable
                v-model="assetForm.deptCode"
                :placeholder="$t('h.tips3') + formLabel['deptCode']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['deptId']" prop="deptId">
              <ds-select-tree
                :placeholder="$t('h.tips4') + formLabel['deptId']"
                v-model="assetForm.deptId"
                :defaultProps="deptTreeProps"
                :treeData="deptData"
                @input="deptInput"
              >
              </ds-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dialogVisible">
            <el-form-item
              :label="formLabel['responsibleId']"
              prop="responsibleId"
            >
              <!-- <el-select
                v-model="assetForm.responsibleId"
                placeholder="请选择使用员工"
                clearable
                filterable
                remote
                :remote-method="staffRemoteMethod"
                @change="staffSelectChange"
              >
                <el-option
                  v-for="item in staffData"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                >
                  <span
                    >{{ item.name + "(" + item.code + ")" }} -{{
                      item.deptName
                    }}</span
                  >
                </el-option>
              </el-select> -->
              <el-select
                v-model="assetForm.responsibleId"
                :placeholder="$t('h.tips4') + formLabel['responsibleId']"
                clearable
                filterable
                :filter-method="() => {}"
                @change="staffSelectChange"
                v-load-more="{
                  options: staffData,
                  modelField: '_id',
                  model: assetForm.responsibleId,
                  searchField: 'andLike',
                  func: 'S0005',
                  userInfo: userInfo,
                }"
              >
                <el-option
                  v-for="item in staffData"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                >
                  <span
                    >{{ item.name + "(" + item.code + ")" }} -{{
                      item.deptName
                    }}</span
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <span class="form-title">{{ $t("h.financialInformation") }}</span>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['money']" prop="money">
              <el-input
                v-model="assetForm.money"
                :placeholder="$t('h.tips3') + formLabel['money']"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['goalQuota']" prop="goalQuota">
              <el-input
                v-model.number="assetForm.goalQuota"
                :placeholder="$t('h.tips3') + formLabel['goalQuota']"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <span class="form-title">{{ $t("h.otherInformation") }}</span>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="formLabel['assertBeizhu']"
              prop="assertBeizhu"
            >
              <el-input
                type="textarea"
                rows="5"
                :placeholder="$t('h.tips3') + formLabel['assertBeizhu']"
                v-model="assetForm.assertBeizhu"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formLabel['photo']" prop="photo">
              <upload-photo :value.sync="assetForm.photo"></upload-photo>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <span class="form-title">{{ $t("h.attachmentInformation") }}</span>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="file" class="attached-file">
              <upload-attached-file
                :value.sync="assetForm.file"
              ></upload-attached-file>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="customData.length">
            <span class="form-title">{{ $t("h.customInformation") }}</span>
          </el-col>
          <template v-if="customData.length">
            <el-col
              :span="12"
              v-for="item in customData"
              :key="item.dbDataName"
            >
              <el-form-item :label="item.nameShow" :prop="item.dbDataName">
                <el-input
                  v-model="assetForm[item.dbDataName]"
                  :placeholder="$t('h.tips3') + item.nameShow"
                ></el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-form>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { update } from "@/assets/api";
import { mapState } from "vuex";
import { regEx } from "@/utils/regEx";
import { sourceListData } from "@/utils/systemData";
import DsSelectTree from "@/components/DsSelectTree";
import UploadPhoto from "./UploadPhoto";
import UploadAttachedFile from "./UploadAttachedFile";
export default {
  components: {
    DsSelectTree,
    UploadPhoto,
    UploadAttachedFile,
  },
  data() {
    const checkGoalQuota = (rule, value, callback) => {
      if (value && !regEx.goalQuota.test(value)) {
        callback(this.$t("h.tips126"));
      } else {
        callback();
      }
    };
    const checkMoney = (rule, value, callback) => {
      if (value && !regEx.money.test(value)) {
        callback(this.$t("h.tips125"));
      } else {
        callback();
      }
    };
    return {
      customData: [],
      formLabel: {},
      assetForm: {
        _id: "",
        staffId: "", //操作人
        stauss: 0, //状态
        state: 0, //状态
        // -----基本信息
        assetCode: "", //资产编码
        classifyId: "", // 类别
        name: "", // 资产名称
        groudName: "", //资产组名称
        model: "", //型号
        snNumber: "", //sn码
        unit: "", //单位
        inData: "", //购入日期
        source: "", //来源方式
        num: 1, //数量
        goodsId: "", //资产属性
        warehouseId: "", //放置区域
        //供应商信息
        producter: "", //制造商
        productAddr: " ", //产地
        supplier: "", // 供应商
        supplierPerson: "", // 供应商负责人
        supplierPhone: "", // 供应商电话
        // 维保信息
        maintainPerson: "", //维保人
        maintainLast: "", // 维保到期时间
        maintainRemark: "", // 维保说明
        // 使用信息
        useDate: "", //使用日期
        responsibleId: "", //使用人
        useState: "", // 使用情况
        useType: "", //经济用途
        deptId: "", //使用部门
        deptCode: "", // 部门代码
        // --------财务信息
        money: "", //金额
        goalQuota: "", //残值率
        // -----其他
        assertBeizhu: "", //备注
        photo: "", //图片
        // 附件信息
        file: [],
        // ----自定义信息
        jsons: null,
      },
      assetFormRules: {
        classifyId: [
          { required: true, message: "请选择资产类别", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入资产名称", trigger: "blur" }],
        inData: [{ required: true, message: "请选择日期", trigger: "change" }],
        source: [
          { required: true, message: "请选择来源方式", trigger: "change" },
        ],
        warehouseId: [
          { required: true, message: "请选择区域", trigger: "change" },
        ],
        goodsId: [
          { required: true, message: "请选择资产属性", trigger: "change" },
        ],
        goalQuota: [{ validator: checkGoalQuota, trigger: "blur" }],
        money: [{ validator: checkMoney, trigger: "blur" }],
      },
      assetTypeProps: {
        children: "children",
        label: "classifyName",
        value: "_id",
      },
      deptTreeProps: {
        children: "children",
        label: "deptName",
        value: "_id",
      },
      sourceData: sourceListData,
      wareData: [],
      staffData: [],
    };
  },
  props: {
    newDialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "新建资产",
    },
    typeData: {
      type: Array,
      default: () => [],
    },
    attrData: {
      type: Array,
      default: () => [],
    },
    deptData: {
      type: Array,
      default: () => [],
    },
    selectAssetForm: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(["userInfo", "assetFormHeader"]),
    dialogVisible: {
      get() {
        return this.newDialogVisible;
      },
      set(val) {
        this.$emit("update:newDialogVisible", val);
      },
    },
  },
  methods: {
    dialogVisibleOpen() {
      this.customData = this.assetFormHeader.filter((item) => {
        if (item.dbDataName.length == 32) {
          this.$set(this.assetForm, item.dbDataName, "");
          return item;
        }
      });
      let addRulesData = this.assetFormHeader.filter((item) => {
        if (
          item.dbDataName != "type" &&
          item.dbDataName != "name" &&
          item.dbDataName != "inData" &&
          item.dbDataName != "source" &&
          item.dbDataName != "inData" &&
          item.dbDataName != "num" &&
          item.dbDataName != "goodsName" &&
          item.dbDataName != "assertPosition" &&
          item.dbDataName != "assetCode"
        ) {
          if (item.notNull == 1) {
            return item;
          }
        }
      });
      addRulesData.forEach((item) => {
        this.assetFormRules[item.dbDataName] = [
          {
            required: true,
            message: this.$t("h.tips13") + item.nameShow,
            trigger: "blur",
          },
        ];
      });
      if (this.title == "编辑资产") {
        for (let key in this.assetForm) {
          if (key == "jsons") {
            for (let k in this.selectAssetForm["jsons"]) {
              this.assetForm[k] = this.selectAssetForm["jsons"][key];
            }
          } else if (key == "goalQuota") {
            this.assetForm[key] = this.selectAssetForm[key] * 100;
          } else if (key == "file" && this.selectAssetForm[key] == null) {
            this.assetForm[key] = [];
          } else {
            this.assetForm[key] = this.selectAssetForm[key];
          }
        }
      }
      for (let key in this.assetForm) {
        if (
          key.length != 32 &&
          key != "jsons" &&
          key != "file" &&
          key != "staffId" &&
          key != "stauss" &&
          key != "state" &&
          key != "_id"
        ) {
          if (key == "permissonId") continue;
          if (key == "classifyId") {
            this.formLabel[key] = this.assetFormHeader.find(
              (item) => item.dbDataName == "type"
            ).nameShow;
          } else if (key == "goodsId") {
            this.formLabel[key] = this.assetFormHeader.find(
              (item) => item.dbDataName == "goodsName"
            ).nameShow;
          } else if (key == "warehouseId") {
            this.formLabel[key] = this.assetFormHeader.find(
              (item) => item.dbDataName == "assertPosition"
            ).nameShow;
          } else if (key == "responsibleId") {
            this.formLabel[key] = this.assetFormHeader.find(
              (item) => item.dbDataName == "responsible"
            ).nameShow;
          } else if (key == "deptId") {
            this.formLabel[key] = this.assetFormHeader.find(
              (item) => item.dbDataName == "useDept"
            ).nameShow;
          } else {
            this.formLabel[key] = this.assetFormHeader.find(
              (item) => item.dbDataName == key
            ).nameShow;
          }
        }
      }
      this.assetFormRules.classifyId[0].message =
        this.$t("h.tips4") + this.formLabel["classifyId"];
      this.assetFormRules.name[0].message =
        this.$t("h.tips3") + this.formLabel["name"];
      this.assetFormRules.inData[0].message =
        this.$t("h.tips4") + this.formLabel["inData"];
      this.assetFormRules.source[0].message =
        this.$t("h.tips4") + this.formLabel["source"];
      this.assetFormRules.warehouseId[0].message =
        this.$t("h.tips4") + this.formLabel["warehouseId"];
      this.assetFormRules.goodsId[0].message =
        this.$t("h.tips4") + this.formLabel["goodsId"];
    },
    dialogVisibleOpened() {},
    dialogVisibleClose() {
      this.$refs.assetFormRef.resetFields();
      this.assetForm._id = "";
      this.assetForm.staffId = "";
      this.assetForm.stauss = 0;
      this.assetForm.state = 0;
      this.assetForm.assetCode = "";
      this.assetForm.classifyId = "";
      this.assetForm.name = "";
      this.assetForm.groudName = "";
      this.assetForm.model = "";
      this.assetForm.snNumber = "";
      this.assetForm.unit = "";
      this.assetForm.inData = "";
      this.assetForm.source = "";
      this.assetForm.num = 1;
      this.assetForm.goodsId = "";
      this.assetForm.warehouseId = "";
      this.assetForm.producter = "";
      this.assetForm.productAddr = "";
      this.assetForm.supplier = "";
      this.assetForm.supplierPerson = "";
      this.assetForm.supplierPhone = "";
      this.assetForm.maintainPerson = "";
      this.assetForm.maintainLast = "";
      this.assetForm.maintainRemark = "";
      this.assetForm.useDate = "";
      this.assetForm.responsibleId = "";
      this.assetForm.useState = "";
      this.assetForm.useType = "";
      this.assetForm.deptId = "";
      this.assetForm.deptCode = "";
      this.assetForm.money = "";
      this.assetForm.goalQuota = "";
      this.assetForm.assertBeizhu = "";
      this.assetForm.photo = "";
      this.assetForm.file = [];
      this.assetForm.jsons = null;
      this.customData.forEach((item) => {
        delete this.assetForm[item.dbDataName];
      });
    },
    dialogVisibleClosed() {
      this.$emit("refreshAssets");
    },
    // async wareRemoteMethod(query) {
    //   if (!query) {
    //     this.wareData = [];
    //     return;
    //   }
    //   const { data: res } = await select({
    //     func: "S0003",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       andLike: query,
    //     },
    //   });
    //   if (res.code != 0) return this.$message.error(res.data);
    //   this.wareData = res.data;
    // },
    // async staffRemoteMethod(query) {
    //   if (!query) {
    //     this.staffData = [];
    //     return;
    //   }
    //   const { data: res } = await select({
    //     func: "S0005",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       andLike: query,
    //     },
    //   });
    //   if (res.code != 0) return this.$message.error(res.data);
    //   this.staffData = res.data;
    // },
    deptInput(val) {
      if (!val) return false;
      let matchStaffData = this.staffData.filter((item) => item.deptId == val);
      if (matchStaffData.length) {
        let matchStaff = matchStaffData.find(
          (item) => item._id == this.assetForm.responsibleId
        );
        if (!matchStaff) this.assetForm.responsibleId = "";
        return;
      } else {
        this.assetForm.responsibleId = "";
      }
    },
    staffSelectChange(val) {
      if (!val) return false;
      this.assetForm.deptId = this.staffData.find(
        (item) => item._id == val
      ).deptId;
    },
    submitAssetForm() {
      this.$refs.assetFormRef.validate(async (valid) => {
        if (!valid) return false;
        const loadingInstance = this.$loading({
          target: ".dialog",
          background: "rgba(0, 0, 0, 0.7)",
        });
        if (this.customData.length) this.assetForm.jsons = {};
        this.customData.forEach((item) => {
          this.assetForm.jsons[item.dbDataName] =
            this.assetForm[item.dbDataName];
          // delete this.assetForm[item.dbDataName];
        });
        let permissonId = this.assetForm._id == "" ? 23 : 25;
        this.assetForm.staffId = this.userInfo.staffId;
        this.assetForm.permissonId = permissonId;
        if (this.assetForm.deptId && this.assetForm.stauss == "0")
          this.assetForm.state = 1;
        if (this.assetForm.goalQuota)
          this.assetForm.goalQuota = this.assetForm.goalQuota / 100;
        const { data: res } = await update({
          func: "U0008",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: this.assetForm,
        }).catch(() => {
          loadingInstance.close();
          return this.$message.error(this.$t("h.tips18"));
        });
        loadingInstance.close();
        if (res.code != 0) return this.$message.error(res.data);
        this.$message.success(res.data[0]);
        this.dialogVisible = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
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
  }
  .el-dialog__body {
    padding: 0;
    height: calc(100% - 54px);
  }
  .dialog-body {
    position: relative;
    height: 100%;
    overflow: auto;
  }
  .el-form-item__label {
    // max-width: 100px; /* 你可以根据需要设置最大宽度 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-form-item__label:hover {
    white-space: normal;
    overflow: visible;
    text-overflow: inherit;
  }
}
.nav {
  position: relative;
  padding: 15px;
  margin: 10px auto !important;
  width: 950px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
.form-title {
  display: block;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.el-icon-question {
  font-size: 20px;
  color: #473bb4;
  position: absolute;
  top: 10px;
  right: -25px;
}
::v-deep .attached-file {
  .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
