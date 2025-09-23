<template>
  <el-dialog
    :title="$t('h.title95')"
    :visible.sync="dialogVisible"
    custom-class="ds-dialog"
    fullscreen
    @opened="dialogOpened"
    @closed="dialogClosed"
    @close="dialogClose"
  >
    <div class="custom-body">
      <!-- 步骤条区域 -->
      <div class="custom-setp">
        <el-steps :active="active" simple finish-status="success">
          <el-step :title="$t('h.drawLabelComponents1')"></el-step>
          <el-step :title="$t('h.drawLabelComponents2')"></el-step>
          <el-step :title="$t('h.drawLabelComponents3')"></el-step>
        </el-steps>
      </div>
      <!-- 自定义区域 -->
      <div class="custom-content" :style="cssVars">
        <!-- 显示区域第1步 -->
        <div class="show-left" ref="showLeftRef"></div>
        <!-- 数值操作区域第1步-->
        <div class="handle-right" v-if="active == 0">
          <el-form
            label-width="150px"
            ref="sizeFormRef"
            :model="sizeForm"
            :rules="sizeFormRules"
          >
            <el-form-item :label="$t('h.drawLabelComponents4')" prop="width">
              <el-input v-model.number="sizeForm.width">
                <span slot="suffix">mm</span>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('h.drawLabelComponents5')" prop="height">
              <el-input v-model.number="sizeForm.height">
                <span slot="suffix">mm</span>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('h.drawLabelComponents6')" prop="margin">
              <el-input v-model.number="sizeForm.margin">
                <span slot="suffix">mm</span>
              </el-input>
              <div class="smallPrompt">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('h.drawLabelComponents7')"
                  placement="left"
                >
                  <el-button icon="el-icon-question"></el-button>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item :label="$t('h.drawLabelComponents8')" prop="rowNum">
              <el-input v-model.number="sizeForm.rowNum">
                <span slot="suffix">{{ $t("h.drawLabelComponents13") }}</span>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('h.drawLabelComponents9')" prop="colNum">
              <el-input v-model.number="sizeForm.colNum">
                <span slot="suffix">{{ $t("h.drawLabelComponents14") }}</span>
              </el-input>
            </el-form-item>
            <!-- 修改时显示end -->
            <el-form-item
              :label="$t('h.drawLabelComponents10')"
              class="font el-form-item-marginsix"
            >
              <span style="color: #ccc">{{
                $t("h.drawLabelComponents15")
              }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('h.drawLabelComponents11')"
              class="el-form-item-marginsix"
            >
              <span style="color: #ccc">{{ tableWidth }}mm</span>
            </el-form-item>
            <el-form-item
              :label="$t('h.drawLabelComponents12')"
              class="el-form-item-marginforty"
            >
              <span style="color: #ccc">{{ tableHeight }}mm</span>
            </el-form-item>
            <!-- 修改时显示end -->
            <el-form-item style="text-align: center" class="colorItem btns">
              <el-button
                size="small"
                class="fortyPercentButton"
                @click="resetSizeForm"
                >{{ $t("h.resetBtn") }}</el-button
              >
              <el-button
                class="colorItem-button fortyPercentButton"
                type="primary"
                size="small"
                @click="createTable"
                :disabled="saveBtnDisabled"
                >{{ $t("h.drawLabelComponents16") }}</el-button
              >
            </el-form-item>
            <el-form-item
              class="colorItem"
              style="text-align: center"
              v-if="!stepVal"
            >
              <el-button
                type="success"
                size="small"
                class="colorItem-button ninetyPercentButton"
                @click="saveLabelBody"
                :disabled="nextSetp"
                >{{ $t("h.drawLabelComponents17") }}</el-button
              >
            </el-form-item>
            <!-- 修改时显示start -->
            <el-form-item
              style="text-align: center"
              v-if="stepVal"
              class="colorItem"
            >
              <el-button
                type="success"
                size="small"
                class="colorItem-button"
                @click="modifySaveLabelBody"
                :disabled="nextSetp"
                >{{ $t("h.drawLabelComponents18") }}</el-button
              >
            </el-form-item>
            <!-- 修改时显示end -->
          </el-form>
          <div class="tips">
            <!-- <i class="el-icon-warning">操作说明：</i> -->
            <p>{{ $t("h.drawLabelComponents19") }}</p>
            <p>{{ $t("h.drawLabelComponents20") }}</p>
            <p>{{ $t("h.drawLabelComponents21") }}</p>
            <p>{{ $t("h.drawLabelComponents22") }}</p>
            <p>{{ $t("h.drawLabelComponents23") }}</p>
            <p>{{ $t("h.drawLabelComponents24") }}</p>
            <p>{{ $t("h.drawLabelComponents25") }}</p>
          </div>
        </div>
        <!-- 显示区域第2步 -->
        <!-- 数值操作区域第2步-->
        <div class="handle-right" v-if="active == 1">
          <el-form
            label-width="100px"
            ref="cellFormRef"
            :model="cellForm"
            :rules="cellFormRules"
          >
            <el-form-item :label="$t('h.drawLabelComponents26')" prop="type">
              <el-select
                v-model="cellForm.type"
                :placeholder="$t('h.tips4') + $t('h.drawLabelComponents26')"
                :disabled="selectCell == null"
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('h.drawLabelComponents27')"
              prop="data"
              v-if="textContent"
            >
              <el-input
                v-model="cellForm.data"
                :disabled="selectCell == null"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('h.drawLabelComponents28')"
              prop="name"
              v-if="textExist"
            >
              <el-select
                v-model="cellForm.name"
                :placeholder="$t('h.tips4') + $t('h.drawLabelComponents28')"
                :disabled="selectCell == null"
              >
                <el-option
                  v-for="(item, index) in dataList"
                  :key="index"
                  :label="item.nameShow"
                  :value="item.dbDataName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('h.drawLabelComponents29')" prop="align">
              <el-select
                v-model="cellForm.align"
                :placeholder="$t('h.tips4') + $t('h.drawLabelComponents30')"
                :disabled="selectCell == null"
              >
                <el-option
                  v-for="(item, index) in alignList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="wordSize" prop="fontSize" v-if="textContent">
              <el-input-number
                :min="12"
                :disabled="selectCell == null"
                step-strictly
                v-model="cellForm.fontSize"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              :label="logo"
              prop="logo"
              v-if="cellForm.type == 'logo'"
            >
              <add-picture
                :value.sync="cellForm.logo"
                :imgHeight.sync="cellForm.imgHeight"
                :imgWidth.sync="cellForm.imgWidth"
                :clickRecord.sync="clickRecord"
              ></add-picture>
            </el-form-item>
            <el-form-item
              :label="$t('h.drawLabelComponents31')"
              prop="imgProportion"
              v-if="cellForm.type == 'logo'"
            >
              <el-input-number
                :min="0"
                :max="20"
                :disabled="selectCell == null"
                step-strictly
                v-model="cellForm.imgProportion"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              :label="$t('h.drawLabelComponents32')"
              prop="codeProportion"
              v-if="cellForm.type == 'QRcode'"
            >
              <el-input-number
                :min="0"
                :max="10"
                :disabled="selectCell == null"
                step-strictly
                v-model="cellForm.codeProportion"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              style="text-align: center"
              class="colorItem el-form-item-marginTopThirty"
            >
              <el-button
                size="small"
                class="fortyPercentButton"
                v-if="!stepVal"
                @click="goBack"
                >{{ $t("h.drawLabelComponents33") }}</el-button
              >
              <el-button
                size="small"
                type="primary"
                class="colorItem-button fortyPercentButton"
                @click="saveTableCell"
                :disabled="selectCell == null"
                >{{ $t("h.confirmBtn") }}</el-button
              >
            </el-form-item>
            <el-form-item style="text-align: center" class="colorItem">
              <el-button
                class="colorItem-button ninetyPercentButton"
                type="success"
                size="small"
                @click="svaeLabelContent"
                :disabled="nextSetp"
                >{{ $t("h.drawLabelComponents17") }}</el-button
              >
            </el-form-item>
          </el-form>
          <div class="tips">
            <!-- <i class="el-icon-warning">操作说明：</i> -->
            <p>{{ $t("h.drawLabelComponents19") }}</p>
            <p>{{ $t("h.drawLabelComponents34") }}</p>
            <p>{{ $t("h.drawLabelComponents35") }}</p>
            <p>{{ $t("h.drawLabelComponents23") }}</p>
            <p>{{ $t("h.drawLabelComponents36") }}</p>
            <p>{{ $t("h.drawLabelComponents37") }}</p>
            <p>
              {{ $t("h.drawLabelComponents38") }}
            </p>
            <p>{{ $t("h.drawLabelComponents39") }}</p>
            <p>{{ $t("h.drawLabelComponents40") }}</p>
          </div>
        </div>
        <!-- 显示区域第3步 -->
        <!-- 数值操作区域第3步-->
        <div class="handle-right" v-if="active == 2">
          <el-form label-width="100px" :model="borderForm" ref="borderFormRef">
            <el-form-item
              :label="$t('h.drawLabelComponents41')"
              prop="name"
              :rules="[
                {
                  required: true,
                  message: $t('h.drawLabelComponents42'),
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                v-model="borderForm.name"
                :placeholder="$t('h.tips3') + $t('h.drawLabelComponents41')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="border">
              <el-checkbox
                v-model="borderForm.border"
                @change="checkboxChange"
                >{{ $t("h.drawLabelComponents43") }}</el-checkbox
              >
            </el-form-item>
            <el-form-item
              v-if="!stepVal"
              class="colorItem el-form-item-marginTopThirty"
            >
              <el-button
                class="fortyPercentButton"
                size="small"
                @click="goBack"
                >{{ $t("h.drawLabelComponents33") }}</el-button
              >
              <el-button
                class="fortyPercentButton"
                :class="
                  borderFormComplete ? 'colorItem-button' : 'colorItem-button1'
                "
                size="small"
                type="primary"
                :disabled="!borderFormComplete"
                @click="submitLabelJson"
                >{{ $t("h.drawLabelComponents44") }}</el-button
              >
            </el-form-item>
            <el-form-item
              v-if="stepVal"
              class="colorItem el-form-item-marginTopThirty"
            >
              <el-button
                class="fortyPercentButton"
                size="small"
                @click="goBack"
                >{{ $t("h.drawLabelComponents33") }}</el-button
              >
              <el-button
                class="fortyPercentButton"
                :class="
                  borderFormComplete ? 'colorItem-button' : 'colorItem-button1'
                "
                size="small"
                type="primary"
                :disabled="!borderFormComplete"
                @click="modifySubmitLabelJson"
                >{{ $t("h.drawLabelComponents44") }}</el-button
              >
            </el-form-item>
          </el-form>
          <div class="tips">
            <!-- <i class="el-icon-warning">操作说明：</i> -->
            <p>{{ $t("h.drawLabelComponents19") }}</p>
            <p>{{ $t("h.drawLabelComponents45") }}</p>
            <p>
              {{ $t("h.drawLabelComponents46") }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div id="menu" class="menu" ref="menuRef">
      <div class="menu__item" @click.stop="colSpanClick(false)">
        <i class="icon el-icon-right"></i>
        <span>{{ $t("h.drawLabelComponents47") }}</span>
        <el-input-number
          size="mini"
          :min="0"
          step-strictly
          @focus="elInputNumberChangeCol"
          v-model="colSpanCellNum"
        ></el-input-number>
        <span>{{ $t("h.drawLabelComponents49") }}</span>
      </div>
      <div class="menu__item" @click.stop="rowSpanClick(false)">
        <i class="icon el-icon-bottom"></i>
        <span>{{ $t("h.drawLabelComponents48") }}</span>
        <el-input-number
          size="mini"
          :min="0"
          step-strictly
          @focus="elInputNumberChangeRow"
          v-model="rowSpanCellNum"
        ></el-input-number>
        <span>{{ $t("h.drawLabelComponents49") }}</span>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import QRCode from "qrcodejs2";
import AddPicture from "./components/AddPicture.vue";
import { mapState } from "vuex";
import { update } from "@/assets/api";
export default {
  name: "DrawPrintedPictures",
  data() {
    var checkWidth = (rule, value, callback) => {
      if (value > 100) {
        callback(new Error(this.$t("h.drawLabelComponents50") + "100"));
      } else {
        callback();
      }
    };
    var checkHeight = (rule, value, callback) => {
      if (value > 60) {
        callback(new Error(this.$t("h.drawLabelComponents51") + "60"));
      } else {
        callback();
      }
    };
    var checkRow = (rule, value, callback) => {
      if (value > 18) {
        callback(
          new Error(
            this.$t("h.drawLabelComponents52") +
              "18" +
              this.$t("h.drawLabelComponents13")
          )
        );
      } else {
        callback();
      }
    };
    var checkCol = (rule, value, callback) => {
      if (value > 18) {
        callback(
          new Error(
            this.$t("h.drawLabelComponents53") +
              "18" +
              this.$t("h.drawLabelComponents13")
          )
        );
      } else {
        callback();
      }
    };
    return {
      handleRightStyle: "40px 50px 0 20px",
      customContentStyle: "20px",
      elFormItemContentStyle: "150px",
      elFormItemStyle: "18px",
      lang: "ZH",
      wordSize: this.$t("h.drawLabelComponents54"),
      logo: "LOGO",
      border: this.$t("h.drawLabelComponents43"),
      active: 0,
      watchActive: 0,
      nextSetp: true,
      colSpanCellNum: 0,
      rowSpanCellNum: 0,
      submitLabel: {
        name: "",
        deviceRelate: [
          {
            leftMargin: 0,
            printDarkness: 8,
            topMargin: 0,
            printModel: "DL-218",
          },
          {
            leftMargin: 0,
            printDarkness: 8,
            topMargin: 0,
            printModel: "DL-735",
          },
          {
            leftMargin: 0,
            printDarkness: 8,
            topMargin: 0,
            printModel: "DL-721",
          },
        ],
      },
      selectCell: null,
      sizeForm: {
        width: "", // 标签宽度mm
        height: "", // 标签高度mm
        rowNum: "", // 行数
        colNum: "", // 列数
        dpi: 300, //dpi
        margin: "", //边距
      },
      sizeFormRules: {
        width: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.drawLabelComponents4"),
            trigger: ["change", "blur"],
          },
          {
            pattern: /^(([1-9][0-9]*)(\.\d{1,2})?|0\.\d{1,2})$/,
            message: this.$t("h.drawLabelComponents55"),
            trigger: ["change", "blur"],
          },
          { validator: checkWidth, trigger: ["change", "blur"] },
        ],
        height: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.drawLabelComponents5"),
            trigger: ["change", "blur"],
          },
          {
            pattern: /^(([1-9][0-9]*)(\.\d{1,2})?|0\.\d{1,2})$/,
            message: this.$t("h.drawLabelComponents56"),
            trigger: ["change", "blur"],
          },
          { validator: checkHeight, trigger: ["change", "blur"] },
        ],
        rowNum: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.drawLabelComponents8"),
            trigger: "change",
          },
          { type: "number", message: this.$t("h.drawLabelComponents57") },

          {
            pattern: /^[1-9]\d*$/,
            message: this.$t("h.drawLabelComponents57"),
            trigger: "change",
          },
          { validator: checkRow, trigger: "change" },
        ],
        colNum: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.drawLabelComponents9"),
            trigger: "change",
          },
          { type: "number", message: this.$t("h.drawLabelComponents58") },
          {
            pattern: /^[1-9]\d*$/,
            message: this.$t("h.drawLabelComponents58"),
            trigger: "change",
          },
          { validator: checkCol, trigger: "change" },
        ],
        margin: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.drawLabelComponents6"),
            trigger: ["change", "blur"],
          },
          {
            pattern: /^(([1-9][0-9]*)(\.\d{1,2})?|0\.\d{1,2})$/,
            message: this.$t("h.drawLabelComponents59"),
            trigger: ["change", "blur"],
          },
        ],
      },
      cellForm: {
        type: "", //单元格类型
        data: "", //默认值
        name: "", //应当读取的key
        fontSize: 12,
        align: "center",
        logo: "",
        codeProportion: 9,
        imgProportion: 10,
        imgHeight: 0,
        imgWidth: 0,
      },
      cellFormRules: {
        type: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.drawLabelComponents26"),
            trigger: "change",
          },
        ],
        data: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.title91"),
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.drawLabelComponents28"),
            trigger: "change",
          },
        ],
        align: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.drawLabelComponents30"),
            trigger: "change",
          },
        ],
        fontSize: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.drawLabelComponents30"),
            trigger: "blur",
          },
        ],
      },
      typeList: [
        { label: this.$t("h.drawLabelComponents60"), value: "title" },
        { label: this.$t("h.drawLabelComponents61"), value: "data" },
        { label: "logo", value: "logo" },
        { label: this.$t("h.drawLabelComponents62"), value: "QRcode" },
      ],
      alignList: [
        { label: this.$t("h.drawLabelComponents63"), value: "left" },
        { label: this.$t("h.drawLabelComponents64"), value: "center" },
        { label: this.$t("h.drawLabelComponents65"), value: "right" },
      ],
      borderForm: {
        name: "",
        border: true,
      },
      borderFormRules: {
        name: {
          required: true,
          message: this.$t("h.tips4") + this.$t("h.drawLabelComponents26"),
          trigger: ["change", "blur"],
        },
      },
      observer: {},
      //记录当前单元格所占行数
      currentCellRow: 0,
      //记录当前单元格所占列数
      currentCellCol: 0,
      //第二步文本对应值显示隐藏
      textExist: false,
      //第二步文本内容显示隐藏
      textContent: false,
      //记录第一步table表格
      firstTable: "",
      secondTable: "",
      //记录添加logo组件button删除图片的点击
      clickRecord: false,
      //记录el-input-number中input值改变前的数字
      changeBeforeCol: 0,
      changeBeforeRow: 0,
      secondDisabled: false,
      //鉴别向下合并是用按钮还是输入框进行
      downwardDifferentiate: false,
      //监测borderForm.name是否已输入值
      borderFormComplete: false,
      // dataList: [
      //   { nameShow: this.$t("h.title166"), dbDataName: "code" },
      //   { nameShow: this.$t("h.formTips38"), dbDataName: "name" },
      //   { nameShow: this.$t("h.formTips63"), dbDataName: "barCode" },
      //   { nameShow: this.$t("h.formTips55"), dbDataName: "sorting" },
      //   { nameShow: this.$t("h.title198"), dbDataName: "logo" },
      //   { nameShow: this.$t("h.columns27"), dbDataName: "specification" },
      //   { nameShow: this.$t("h.columns28"), dbDataName: "measureUnit" },
      //   { nameShow: this.$t("h.columns70"), dbDataName: "price" },
      //   { nameShow: this.$t("h.columns57"), dbDataName: "lowerSize" },
      //   { nameShow: this.$t("h.columns58"), dbDataName: "upperSize" },
      //   { nameShow: this.$t("h.comment"), dbDataName: "remark" },
      // ],
    };
  },
  props: {
    customDialogVisible: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Object,
      default: () => {},
    },
    templateType: {
      type: Number,
      default: 0,
    },
    dataList:{
      type: Array,
      default: () => [],
    }
  },
  components: {
    AddPicture,
  },
  computed: {
    ...mapState(["userInfo"]),
    // dataList() {
    //   let newArr = [];
    //   let arr = this.assetFormHeader.map((item) => {
    //     return {
    //       nameShow: item.nameShow,
    //       dbDataName: item.dbDataName,
    //     };
    //   });
    //   arr.forEach((el) => {
    //     if (
    //       el.dbDataName != "state" &&
    //       el.dbDataName != "photo" &&
    //       el.dbDataName != "file"
    //     ) {
    //       newArr.push(el);
    //     }
    //   });

    //   return newArr;
    // },
    dialogVisible: {
      get() {
        return this.customDialogVisible;
      },
      set(val) {
        this.$emit("update:customDialogVisible", val);
      },
    },
    stepVal: {
      get() {
        return this.step;
      },
      set(val) {
        this.$emit("update:step", val);
      },
    },
    tableWidth() {
      if (this.sizeForm.width && this.sizeForm.margin) {
        return this.sizeForm.width - this.sizeForm.margin * 2;
      }
      return this.$t("h.drawLabelComponents66");
    },
    tableHeight() {
      if (this.sizeForm.height && this.sizeForm.margin) {
        return this.sizeForm.height - this.sizeForm.margin * 2;
      }
      return this.$t("h.drawLabelComponents67");
    },
    saveBtnDisabled() {
      if (
        typeof this.tableHeight != "number" ||
        this.tableHeight == NaN ||
        this.tableHeight < 1
      ) {
        return true;
      } else if (
        typeof this.tableWidth != "number" ||
        this.tableWidth == NaN ||
        this.tableWidth < 1
      ) {
        return true;
      }
      return false;
    },
    cssVars() {
      return {
        "--handleRightStyle": this.handleRightStyle,
        "--customContentStyle": this.customContentStyle,
        "--elFormItemContentStyle": this.elFormItemContentStyle,
        "--elFormItemStyle": this.elFormItemStyle,
      };
    },
  },
  watch: {
    step: function (nVal, oVal) {
      if (nVal == true) {
        this.dblCreateTable();
      }
    },
    clickRecord: function (nVal, oVal) {
      if (oVal != nVal) {
        this.saveTableCell();
      }
    },
    "cellForm.type": function (nVal, oVal) {
      if (nVal == "logo" || nVal == "title") {
        this.textExist = false;
      } else {
        this.textExist = true;
      }
      if (nVal == "QRcode" || nVal == "logo") {
        this.textContent = false;
        this.$refs["cellFormRef"].clearValidate(["name"]);
      } else {
        this.textContent = true;
      }
      if (nVal == "logo") {
        this.logo =
          "L" + "\xa0\xa0" + "O" + "\xa0\xa0" + "G" + "\xa0\xa0" + "O";
      }
      if (!nVal) {
        this.textExist = false;
        this.textContent = false;
      }
      if (nVal) {
        this.$refs["cellFormRef"].clearValidate(["type"]);
        this.$refs["cellFormRef"].clearValidate(["name"]);
      }
      if (nVal != oVal && this.watchActive == 1) {
        this.$refs["cellFormRef"].clearValidate(["data"]);
        this.$refs["cellFormRef"].clearValidate(["name"]);
      }
    },
    "cellForm.logo": function (nVal) {
      if (nVal == "") {
        this.saveTableCell();
      }
    },
    dialogVisible: function (nVal) {
      if (nVal) {
        this.$nextTick(() => {
          // "字" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "体"
          document.querySelector(".font label").innerText = this.$t(
            "h.drawLabelComponents10"
          );
        });
      }
    },
    active: function (nVal) {
      if (nVal == 0) {
        this.$nextTick(() => {
          // "字" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "体"
          document.querySelector(".font label").innerText = this.$t(
            "h.drawLabelComponents10"
          );
        });
      }
      if (nVal == 2) {
        // "边" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "框"
        this.border = this.$t("h.drawLabelComponents43");
      }
    },
    textContent: function (nVal) {
      if (nVal) {
        // "字" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "号"
        this.wordSize = this.$t("h.drawLabelComponents54");
      }
    },
    "borderForm.name": function (nVal) {
      if (nVal.trim() == "") {
        this.borderFormComplete = false;
      } else {
        this.borderFormComplete = true;
      }
    },
  },
  methods: {
    // 返回上一步
    goBack() {
      if (this.active != 0) {
        if (this.cellForm.type != "logo" && this.active == 1) {
          this.$refs["cellFormRef"].clearValidate(["type", "data"]);
        }
        if (this.active == 2) {
          this.borderForm.name = "";
        }
        this.active -= 1;
        this.watchActive = this.active;
        const menu = document.getElementById("menu");
        menu.classList.remove("active");
        this.$refs["showLeftRef"].innerHTML = "";
        this.cellForm.logo = "";
        this.secondDisabled = false;
        this.selectCell = null;
        if (this.active == 0) {
          this.$refs["showLeftRef"].innerHTML = this.firstTable;
          // 重新设置sizeForm规则(解决从步骤二步骤伞回到步骤一规则不起作用)
          this.$nextTick(() => {
            let checkWidth = (rule, value, callback) => {
              if (value > 100) {
                callback(new Error(this.$t("h.drawLabelComponents50") + "100"));
              } else {
                callback();
              }
            };
            let checkHeight = (rule, value, callback) => {
              if (value > 60) {
                callback(new Error(this.$t("h.drawLabelComponents51") + "60"));
              } else {
                callback();
              }
            };
            let checkRow = (rule, value, callback) => {
              if (value > 18) {
                callback(
                  new Error(
                    this.$t("h.drawLabelComponents52") +
                      "18" +
                      this.$t("h.drawLabelComponents13")
                  )
                );
              } else {
                callback();
              }
            };
            let checkCol = (rule, value, callback) => {
              if (value > 18) {
                callback(
                  new Error(
                    this.$t("h.drawLabelComponents53") +
                      "18" +
                      this.$t("h.drawLabelComponents13")
                  )
                );
              } else {
                callback();
              }
            };
            this.sizeFormRules = {
              width: [
                {
                  required: true,
                  message:
                    this.$t("h.tips3") + this.$t("h.drawLabelComponents4"),
                  trigger: ["change", "blur"],
                },
                {
                  // pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                  pattern: /^(([1-9][0-9]*)(\.\d{1,2})?|0\.\d{1,2})$/,
                  message: this.$t("h.drawLabelComponents55"),
                  trigger: ["change", "blur"],
                },
                { validator: checkWidth, trigger: ["change", "blur"] },
              ],
              height: [
                {
                  required: true,
                  message:
                    this.$t("h.tips3") + this.$t("h.drawLabelComponents5"),
                  trigger: ["change", "blur"],
                },
                {
                  pattern: /^(([1-9][0-9]*)(\.\d{1,2})?|0\.\d{1,2})$/,
                  message: this.$t("h.drawLabelComponents56"),
                  trigger: ["change", "blur"],
                },
                { validator: checkHeight, trigger: ["change", "blur"] },
              ],
              rowNum: [
                {
                  required: true,
                  message:
                    this.$t("h.tips3") + this.$t("h.drawLabelComponents8"),
                  trigger: "change",
                },
                { type: "number", message: this.$t("h.drawLabelComponents57") },
                {
                  pattern: /^[1-9]\d*$/,
                  message: this.$t("h.drawLabelComponents57"),
                  trigger: "change",
                },
                { validator: checkRow, trigger: "change" },
              ],
              colNum: [
                {
                  required: true,
                  message:
                    this.$t("h.tips3") + this.$t("h.drawLabelComponents9"),
                  trigger: "change",
                },
                { type: "number", message: this.$t("h.drawLabelComponents58") },
                {
                  pattern: /^[1-9]\d*$/,
                  message: this.$t("h.drawLabelComponents58"),
                  trigger: "change",
                },
                { validator: checkCol, trigger: "change" },
              ],
              margin: [
                {
                  required: true,
                  message:
                    this.$t("h.tips3") + this.$t("h.drawLabelComponents6"),
                  trigger: ["change", "blur"],
                },
                {
                  pattern: /^(([1-9][0-9]*)(\.\d{1,2})?|0\.\d{1,2})$/,
                  message: this.$t("h.drawLabelComponents59"),
                  trigger: ["change", "blur"],
                },
              ],
            };
          });
          for (let i = 0; i < document.querySelectorAll("td").length; i++) {
            document.querySelectorAll("td")[i].style.background = "#fff";
          }
          this.nextSetp = false;
          document
            .querySelector(".label2")
            .addEventListener("contextmenu", (e) => {
              //取消默认的浏览器自带右键
              e.preventDefault();
              if (e.target.localName != "td") return;
              for (let i = 0; i < document.querySelectorAll("td").length; i++) {
                document.querySelectorAll("td")[i].style.background = "#fff";
              }
              e.target.style.background = "#ccc";
              this.colSpanCellNum =
                e.target.getAttribute("colspan") === null
                  ? 0
                  : e.target.getAttribute("colspan") * 1 - 1;
              this.rowSpanCellNum =
                e.target.getAttribute("rowspan") === null
                  ? 0
                  : e.target.getAttribute("rowspan") * 1 - 1;
              this.currentCellRow = this.rowSpanCellNum;
              this.currentCellCol = this.colSpanCellNum;
              this.selectCell = e.target;
              const menu = document.getElementById("menu");
              //根据事件对象中鼠标点击的位置，进行定位
              menu.style.left = e.clientX + "px";
              menu.style.top = e.clientY - 54 + "px";
              menu.classList.add("active");
              let inputs = document.querySelectorAll("#menu input");
              inputs[0].addEventListener("change", (e) => {
                let determine = Number(e.target.value);
                determine =
                  determine - this.changeBeforeCol >= 0
                    ? determine - this.changeBeforeCol
                    : this.changeBeforeCol - determine;
                if (determine == 0) {
                  this.colSpanCellNum = this.currentCellCol;
                  return this.$message.error(
                    this.$t("h.drawLabelComponents68")
                  );
                }
                for (let i = 0; i < determine; i++) {
                  this.colSpanClick(determine);
                }
              });
              inputs[1].addEventListener("change", (e) => {
                this.downwardDifferentiate = true;
                let determine = Number(e.target.value);
                determine =
                  determine - this.changeBeforeRow >= 0
                    ? determine - this.changeBeforeRow
                    : this.changeBeforeRow - determine;
                if (determine == 0) {
                  this.rowSpanCellNum = this.currentCellRow;
                  return this.$message.error(
                    this.$t("h.drawLabelComponents68")
                  );
                }
                for (let i = 0; i < determine; i++) {
                  this.rowSpanClick(determine);
                }
                this.downwardDifferentiate = false;
              });
            });
          document
            .querySelector(".show-left")
            .addEventListener("click", (e) => {
              if (e.target.localName != "td") {
                const menu = document.getElementById("menu");
                menu.classList.remove("active");
              }
            });
          this.setUpResize();
        } else if (this.active == 1) {
          this.$refs["showLeftRef"].innerHTML = this.secondTable;
          for (let i = 0; i < document.querySelectorAll("td").length; i++) {
            document.querySelectorAll("td")[i].style.background = "#fff";
          }
          document
            .querySelector(".label2")
            .addEventListener("contextmenu", (e) => {
              e.preventDefault();
              if (e.target.localName == "td" || e.target.localName == "img") {
                for (
                  let i = 0;
                  i < document.querySelectorAll("td").length;
                  i++
                ) {
                  document.querySelectorAll("td")[i].style.background = "#fff";
                }
                this.cellForm.logo = "";
                let x;
                let y;
                if (e.target.localName == "td") {
                  e.target.style.background = "#ccc";
                  x = e.target.dataset.position.split(",")[0];
                  y = e.target.dataset.position.split(",")[1];
                } else if (e.target.localName == "img") {
                  e.target.parentNode.style.background = "#ccc";
                  x = e.target.parentNode.dataset.position.split(",")[0];
                  y = e.target.parentNode.dataset.position.split(",")[1];
                }
                this.submitLabel.tableCell.forEach((item) => {
                  if (item.position[0] == x && item.position[1] == y) {
                    this.cellForm.type = item.type;
                    this.cellForm.data = item.data;
                    this.cellForm.name = item.name;
                    this.cellForm.fontSize = item.fontSize;
                    this.cellForm.align = item.align;
                    this.cellForm.codeProportion = item.codeProportion
                      ? item.codeProportion
                      : 10;
                    this.cellForm.imgProportion = item.imgProportion
                      ? item.imgProportion
                      : 10;
                    this.cellForm.imgHeight = item.imgHeight
                      ? item.imgHeight
                      : 0;
                    this.cellForm.imgWidth = item.imgWidth ? item.imgWidth : 0;
                    if (item.type == "logo") {
                      this.cellForm.logo = item.logo;
                    }
                  }
                });
                if (e.target.localName == "td") {
                  this.selectCell = e.target;
                } else if (e.target.localName == "img") {
                  this.selectCell = e.target.parentNode;
                }
              }
            });
        }
      }
    },
    // 重置标签主体
    resetSizeForm() {
      this.nextSetp = true;
      this.colSpanCellNum = 0;
      this.rowSpanCellNum = 0;
      this.sizeForm.width = "";
      this.sizeForm.height = "";
      this.sizeForm.rowNum = "";
      this.sizeForm.colNum = "";
      this.sizeForm.margin = "";
      this.selectCell = null;
      const menu = document.getElementById("menu");
      menu.classList.remove("active");
      this.$refs["showLeftRef"].innerHTML = "";
      this.$nextTick(() => {
        this.$refs["sizeFormRef"].clearValidate([
          "width",
          "height",
          "rowNum",
          "colNum",
          "margin",
        ]);
      });
    },
    // 创建标签主体
    createTable() {
      this.$refs["sizeFormRef"].validate((valid) => {
        if (!valid) return false;
        const menu = document.getElementById("menu");
        menu.classList.remove("active");
        this.$refs["showLeftRef"].innerHTML = "";
        let labelElement = document.createElement("div");
        labelElement.className = "label2";
        labelElement.style.width = this.mmConverterPx(
          this.sizeForm.width,
          this.sizeForm.dpi
        );
        labelElement.style.height = this.mmConverterPx(
          this.sizeForm.height,
          this.sizeForm.dpi
        );
        labelElement.style.padding = this.mmConverterPx(
          this.sizeForm.margin,
          this.sizeForm.dpi
        );
        labelElement.style.background = "#fff";
        labelElement.style.boxSizing = "border-box";
        labelElement.innerHTML = this.getTableHTML();
        this.$refs["showLeftRef"].appendChild(labelElement);
        // let trs = document.querySelectorAll("tr");
        let tableDiv = document.querySelector(".custom-body");
        let trs = [];
        if (tableDiv) trs = tableDiv.querySelectorAll("tr");
        for (let i = 0; i < trs.length; i++) {
          for (let j = 0; j < trs[i].children.length; j++) {
            let element = trs[i].children[j];
            this.observer["e" + i + j] = new MutationObserver(
              (mutationList) => {
                let tableH = Number(
                  this.mmConverterPx(this.tableHeight, this.sizeForm.dpi).split(
                    "p"
                  )[0]
                );

                let nowTableH = document.querySelector("table").offsetHeight;
                while (nowTableH > Math.round(tableH)) {
                  element.style.height = element.offsetHeight - 1 + "px";
                  nowTableH = document.querySelector("table").offsetHeight;
                }
              }
            );
            this.observer["e" + i + j].observe(element, {
              attributes: true,
              attributeFilter: ["style"],
              attributeOldValue: true,
            });
          }
        }
        this.nextSetp = false;
        document
          .querySelector(".label2")
          .addEventListener("contextmenu", (e) => {
            //取消默认的浏览器自带右键
            e.preventDefault();
            if (e.target.localName != "td") return;
            for (let i = 0; i < document.querySelectorAll("td").length; i++) {
              document.querySelectorAll("td")[i].style.background = "#fff";
            }
            e.target.style.background = "#ccc";
            this.colSpanCellNum =
              e.target.getAttribute("colspan") === null
                ? 0
                : e.target.getAttribute("colspan") * 1 - 1;
            this.rowSpanCellNum =
              e.target.getAttribute("rowspan") === null
                ? 0
                : e.target.getAttribute("rowspan") * 1 - 1;
            this.currentCellRow = this.rowSpanCellNum;
            this.currentCellCol = this.colSpanCellNum;
            this.selectCell = e.target;
            const menu = document.getElementById("menu");
            //根据事件对象中鼠标点击的位置，进行定位
            menu.style.left = e.clientX + "px";
            menu.style.top = e.clientY - 54 + "px";
            menu.classList.add("active");
            let inputs = document.querySelectorAll("#menu input");
            inputs[0].addEventListener("change", (e) => {
              let determine = Number(e.target.value);
              determine =
                determine - this.changeBeforeCol >= 0
                  ? determine - this.changeBeforeCol
                  : this.changeBeforeCol - determine;
              if (determine == 0) {
                this.colSpanCellNum = this.currentCellCol;
                return this.$message.error(this.$t("h.drawLabelComponents68"));
              }
              for (let i = 0; i < determine; i++) {
                this.colSpanClick(true);
              }
            });
            inputs[1].addEventListener("change", (e) => {
              this.downwardDifferentiate = true;
              let determine = Number(e.target.value);
              determine =
                determine - this.changeBeforeRow >= 0
                  ? determine - this.changeBeforeRow
                  : this.changeBeforeRow - determine;
              if (determine == 0) {
                this.rowSpanCellNum = this.currentCellRow;
                return this.$message.error(this.$t("h.drawLabelComponents68"));
              }
              for (let i = 0; i < determine; i++) {
                this.rowSpanClick(true);
              }
              this.downwardDifferentiate = false;
            });
          });
        document.querySelector(".show-left").addEventListener("click", (e) => {
          if (e.target.localName != "td") {
            const menu = document.getElementById("menu");
            menu.classList.remove("active");
          }
        });
      });
    },
    // 1
    // 双击修改 创建标签主体
    dblCreateTable() {
      this.borderForm.name = this.tableData.name;
      this.borderForm.border = this.tableData.border;
      this.$nextTick(() => {
        this.$refs["showLeftRef"].innerHTML = "";
        let labelElement = document.createElement("div");
        labelElement.className = "label2";
        labelElement.style.background = "#fff";
        labelElement.style.boxSizing = "border-box";
        labelElement.style.display = "flex";
        labelElement.style.flexDirection = "row";
        labelElement.style.justifyContent = "center";
        labelElement.style.alignItems = "center";
        let tableHtmlArr = this.tableData;
        console.log("tableHtmlArr>>>", tableHtmlArr);
        let tableCell = [];
        this.sizeForm.width = tableHtmlArr.width;
        this.sizeForm.height = tableHtmlArr.height;
        this.sizeForm.rowNum = tableHtmlArr.rowNum;
        this.sizeForm.colNum = tableHtmlArr.colNum;
        this.sizeForm.dpi = tableHtmlArr.dpi;
        this.sizeForm.margin = tableHtmlArr.margin;
        labelElement.style.width = this.mmConverterPx(
          tableHtmlArr.width,
          tableHtmlArr.dpi
        );
        labelElement.style.height = this.mmConverterPx(
          tableHtmlArr.height,
          tableHtmlArr.dpi
        );
        labelElement.style.padding = this.mmConverterPx(
          tableHtmlArr.margin,
          tableHtmlArr.dpi
        );
        tableCell = tableHtmlArr.tableCell;
        labelElement.innerHTML = tableHtmlArr.html;
        this.$refs["showLeftRef"].appendChild(labelElement);
        tableCell.forEach((item, index) => {
          if (item.type == "logo") {
            document
              .querySelectorAll("td")
              [index].children[0].setAttribute("src", item.logo);
          } else if (item.type == "QRcode") {
            let thisWidth = Number(
              this.mmConverterPx(item.width, tableHtmlArr.dpi).split("p")[0]
            );
            let thisHeight = Number(
              this.mmConverterPx(item.height, tableHtmlArr.dpi).split("p")[0]
            );
            let qrCodelength =
              thisWidth - thisHeight > 0
                ? ((thisHeight - 10) / 10) * item.codeProportion
                : ((thisWidth - 10) / 10) * item.codeProportion;
            let qrCodeElement = document.createElement("div");
            new QRCode(qrCodeElement, {
              text: "GZ88888888",
              width: qrCodelength,
              height: qrCodelength,
              colorLight: "#ffffff", // 二维码背景色
              correctLevel: QRCode.CorrectLevel.H,
            });
            qrCodeElement.lastChild.onload = () => {
              document
                .querySelectorAll("td")
                [index].children[0].setAttribute(
                  "src",
                  qrCodeElement.lastChild.getAttribute("src")
                );
            };
          }
        });
        this.nextSetp = false;
        document
          .querySelector(".label2")
          .addEventListener("contextmenu", (e) => {
            //取消默认的浏览器自带右键
            e.preventDefault();
            if (e.target.localName != "td") return;
            for (let i = 0; i < document.querySelectorAll("td").length; i++) {
              document.querySelectorAll("td")[i].style.background = "#fff";
            }
            e.target.style.background = "#ccc";
            this.colSpanCellNum =
              e.target.getAttribute("colspan") === null
                ? 0
                : e.target.getAttribute("colspan") * 1 - 1;
            this.rowSpanCellNum =
              e.target.getAttribute("rowspan") === null
                ? 0
                : e.target.getAttribute("rowspan") * 1 - 1;
            this.currentCellRow = this.rowSpanCellNum;
            this.currentCellCol = this.colSpanCellNum;
            this.selectCell = e.target;
            const menu = document.getElementById("menu");
            //根据事件对象中鼠标点击的位置，进行定位
            menu.style.left = e.clientX + "px";
            menu.style.top = e.clientY - 54 + "px";
            menu.classList.add("active");
          });
        this.modifySaveLabelBody();
      });
    },
    //向左新增一列
    leftIncrease() {
      if (this.selectCell == null) return;
      let trs = this.selectCell.parentNode.parentNode.children;
      let index = 0;
      for (let i = 0; i < trs.length; i++) {
        for (let j = 0; j < trs[i].children.length; j++) {
          if (trs[i].children[j] == this.selectCell) {
            index = j;
          }
        }
      }
      let thisWidth = Number(
        window.getComputedStyle(this.selectCell).width.split("p")[0]
      );
      let thisColSpan = Number(this.selectCell.getAttribute("colspan"));
      let tdWidth = thisWidth / thisColSpan;
      this.sizeForm.width = this.pxConverterMM(
        Number(
          window
            .getComputedStyle(document.querySelector(".label2"))
            .width.split("p")[0]
        ),
        this.sizeForm.dpi
      );
      for (let i = 0; i < trs.length; i++) {
        let tds = document.createElement("td");
        tds.style.width = `${tdWidth}px`;
        tds.style.border = "1px solid #000";
        tds.style.boxSizing = "border-box";
        tds.style.overflow = "hidden";
        tds.style.whiteSpace = "nowrap";
        tds.style.textOverflow = "ellipsis";
        if (trs[i].children.length - 1 < index) {
          trs[i].appendChild(tds);
        } else {
          trs[i].children[index].insertAdjacentElement("beforebegin", tds);
        }
      }
      this.sizeForm.colNum += 1;
      this.setUpResize();
    },
    //向右新增一列
    rightIncrease() {
      if (this.selectCell == null) return;
      let trs = this.selectCell.parentNode.parentNode.children;
      let index = 0;
      for (let i = 0; i < trs.length; i++) {
        for (let j = 0; j < trs[i].children.length; j++) {
          if (trs[i].children[j] == this.selectCell) {
            index = j;
          }
        }
      }
      let thisWidth = Number(
        window.getComputedStyle(this.selectCell).width.split("p")[0]
      );
      let thisColSpan = Number(this.selectCell.getAttribute("colspan"));
      let tdWidth = thisWidth / thisColSpan;
      this.sizeForm.width = this.pxConverterMM(
        Number(
          window
            .getComputedStyle(document.querySelector(".label2"))
            .width.split("p")[0]
        ),
        this.sizeForm.dpi
      );
      for (let i = 0; i < trs.length; i++) {
        let tds = document.createElement("td");
        tds.style.width = `${tdWidth}px`;
        tds.style.border = "1px solid #000";
        tds.style.boxSizing = "border-box";
        tds.style.overflow = "hidden";
        tds.style.whiteSpace = "nowrap";
        tds.style.textOverflow = "ellipsis";
        if (trs[i].children.length - 1 < index) {
          trs[i].appendChild(tds);
        } else {
          trs[i].children[index].insertAdjacentElement("afterend", tds);
        }
      }
      this.sizeForm.colNum += 1;
      this.setUpResize();
    },
    // 根据sizeForm解析table
    getTableHTML() {
      let tWidth = this.mmConverterPx(this.tableWidth, this.sizeForm.dpi);
      let tHeight = this.mmConverterPx(this.tableHeight, this.sizeForm.dpi);
      let tableStyle = `width:${tWidth};
                        height:${tHeight};
                        border:2px solid #000;
                        border-collapse:collapse;
                        box-sizing:border-box
                        `;
      let tableHtml = `<table style="${tableStyle}">`;
      for (let i = 0; i < this.sizeForm.rowNum; i++) {
        tableHtml += `<tr>`;
        for (let j = 0; j < this.sizeForm.colNum; j++) {
          let tdStyle = `border:2px solid #000;
                         box-sizing:border-box;
                         overflow:hidden;
                         white-space:nowrap;
                         text-overflow:ellipsis;
                         `;
          if (j < this.sizeForm.colNum - 1 && i < this.sizeForm.rowNum - 1) {
            tdStyle += "resize: both;";
          }
          tableHtml += `<td style="${tdStyle}" data-position="${i},${j}"></td>`;
        }
        tableHtml += "</tr>";
      }
      tableHtml += "</table>";
      return tableHtml;
    },
    // 向右合并单元格
    colSpanClick(determine) {
      let selectPositionY = 0; //当前单元格所在列坐标
      let selectPositionX = 0; //当前单元格所在行坐标
      for (let i = 0; i < this.selectCell.parentNode.children.length; i++) {
        if (this.selectCell.parentNode.children[i] === this.selectCell) {
          selectPositionY = i;
        }
      }
      for (
        let i = 0;
        i < this.selectCell.parentNode.parentNode.children.length;
        i++
      ) {
        if (
          this.selectCell.parentNode.parentNode.children[i] ===
          this.selectCell.parentNode
        ) {
          selectPositionX = i;
        }
      }
      if (
        selectPositionY === this.selectCell.parentNode.children.length - 1 &&
        this.colSpanCellNum > this.currentCellCol
      ) {
        if (!determine) {
          this.$message.error(this.$t("h.drawLabelComponents69"));
        }
        this.colSpanCellNum -= 1;
        this.selectCell.setAttribute("colSpan", this.colSpanCellNum + 1);
        return;
      }
      this.selectCell.setAttribute("colSpan", this.colSpanCellNum + 1);
      //当前单元格所占行数
      let thisCellRowspan =
        this.selectCell.getAttribute("rowspan") === null
          ? 1
          : Number(this.selectCell.getAttribute("rowspan"));
      // 删除单元格
      if (this.colSpanCellNum > this.currentCellCol) {
        for (
          let i = selectPositionX + thisCellRowspan;
          i > selectPositionX;
          i--
        ) {
          let lastCell =
            this.selectCell.parentNode.parentNode.children[i - 1].children
              .length - 1;
          let lastCellRowspan =
            this.selectCell.parentNode.parentNode.children[i - 1].children[
              lastCell
            ].getAttribute("rowspan") === null
              ? 1
              : Number(
                  this.selectCell.parentNode.parentNode.children[
                    i - 1
                  ].children[lastCell].getAttribute("rowspan")
                );
          let lastCellColspan =
            this.selectCell.parentNode.parentNode.children[i - 1].children[
              lastCell
            ].getAttribute("colspan") === null
              ? 1
              : Number(
                  this.selectCell.parentNode.parentNode.children[
                    i - 1
                  ].children[lastCell].getAttribute("colspan")
                );
          this.selectCell.parentNode.parentNode.children[i - 1].removeChild(
            this.selectCell.parentNode.parentNode.children[i - 1].children[
              lastCell
            ]
          );
          this.detectionCell(lastCellRowspan, lastCellColspan, i);
        }
      }
      // 当进行复原操作时填补单元格
      if (this.colSpanCellNum < this.currentCellCol) {
        for (
          let i = selectPositionX + thisCellRowspan;
          i > selectPositionX;
          i--
        ) {
          let tds = document.createElement("td");
          if (this.stepVal) {
            tds.style.border = "1px solid #000";
          } else {
            tds.style.border = "2px solid #000";
          }
          tds.style.boxSizing = "border-box";
          tds.style.overflow = "hidden";
          tds.style.whiteSpace = "nowrap";
          tds.style.textOverflow = "ellipsis";
          this.selectCell.parentNode.parentNode.children[i - 1].appendChild(
            tds
          );
        }
      }
      if (this.colSpanCellNum > this.currentCellCol) {
        this.currentCellCol += 1;
      } else if (this.colSpanCellNum < this.currentCellCol) {
        this.currentCellCol -= 1;
      }
      this.setUpResize();
    },
    // 向下合并单元格
    rowSpanClick(determine) {
      let selectPositionY = 0; //当前单元格所在列坐标
      let selectPositionX = 0; //当前单元格所在行坐标
      for (let i = 0; i < this.selectCell.parentNode.children.length; i++) {
        if (this.selectCell.parentNode.children[i] === this.selectCell) {
          selectPositionY = i;
        }
      }
      for (
        let i = 0;
        i < this.selectCell.parentNode.parentNode.children.length;
        i++
      ) {
        if (
          this.selectCell.parentNode.parentNode.children[i] ===
          this.selectCell.parentNode
        ) {
          selectPositionX = i;
        }
      }
      //当前单元格所占行数
      let rowspan =
        this.selectCell.getAttribute("rowspan") === null
          ? 1
          : Number(this.selectCell.getAttribute("rowspan"));
      if (
        this.rowSpanCellNum > this.currentCellRow &&
        selectPositionX + rowspan >= this.sizeForm.rowNum
      ) {
        if (!determine) {
          this.$message.error(this.$t("h.drawLabelComponents70"));
        }
        this.rowSpanCellNum = this.rowSpanCellNum - 1;
        return;
      }
      if (
        this.downwardDifferentiate &&
        this.rowSpanCellNum != this.currentCellRow
      ) {
        if (this.currentCellRow < this.rowSpanCellNum) {
          this.selectCell.setAttribute("rowSpan", this.currentCellRow + 2);
        } else if (this.currentCellRow > this.rowSpanCellNum) {
          this.selectCell.setAttribute("rowSpan", this.currentCellRow);
        }
      } else if (this.rowSpanCellNum != this.currentCellRow) {
        this.selectCell.setAttribute("rowSpan", this.rowSpanCellNum + 1);
      }
      //当前单元格所占列数
      let thisCellColspan =
        this.selectCell.getAttribute("colspan") === null
          ? 1
          : Number(this.selectCell.getAttribute("colspan"));
      //当前单元格所占行数
      let thisCellRowspan =
        this.selectCell.getAttribute("rowspan") === null
          ? 1
          : Number(this.selectCell.getAttribute("rowspan"));
      // 删除单元格
      if (this.rowSpanCellNum > this.currentCellRow) {
        for (
          let i = selectPositionY + thisCellColspan;
          i > selectPositionY;
          i--
        ) {
          let nextRow = selectPositionX + thisCellRowspan - 1;
          let lastCell =
            this.selectCell.parentNode.parentNode.children[nextRow].children
              .length - 1;
          let lastCellRowspan =
            this.selectCell.parentNode.parentNode.children[nextRow].children[
              lastCell
            ].getAttribute("rowspan") === null
              ? 1
              : Number(
                  this.selectCell.parentNode.parentNode.children[
                    nextRow
                  ].children[lastCell].getAttribute("rowspan")
                );
          let lastCellColspan =
            this.selectCell.parentNode.parentNode.children[nextRow].children[
              lastCell
            ].getAttribute("colspan") === null
              ? 1
              : Number(
                  this.selectCell.parentNode.parentNode.children[
                    nextRow
                  ].children[lastCell].getAttribute("colspan")
                );
          this.detectionColCell(
            lastCellRowspan,
            lastCellColspan,
            nextRow,
            lastCell,
            selectPositionX,
            thisCellRowspan
          );
        }
      }
      // 当进行复原操作时填补单元格
      if (this.currentCellRow > this.rowSpanCellNum) {
        let nextRow = selectPositionX + thisCellRowspan;
        for (let i = 0; i < thisCellColspan; i++) {
          let tds = document.createElement("td");
          if (this.stepVal) {
            tds.style.border = "1px solid #000";
          } else {
            tds.style.border = "2px solid #000";
          }
          tds.style.boxSizing = "border-box";
          tds.style.overflow = "hidden";
          tds.style.whiteSpace = "nowrap";
          tds.style.textOverflow = "ellipsis";
          this.selectCell.parentNode.parentNode.children[nextRow].appendChild(
            tds
          );
        }
      }
      if (this.currentCellRow < this.rowSpanCellNum) {
        this.currentCellRow += 1;
      } else if (this.currentCellRow > this.rowSpanCellNum) {
        this.currentCellRow -= 1;
      }
      this.setUpResize();
    },
    // 完成标签主体创建，开始下一步
    saveLabelBody() {
      this.$refs["sizeFormRef"].validate((valid) => {
        if (!valid) return false;
        let trs = this.$refs["showLeftRef"].querySelectorAll("tr");
        for (let i = 0; i < trs.length; i++) {
          for (let j = 0; j < trs[i].children.length; j++) {
            trs[i].children[j].setAttribute("data-position", `${i},${j}`);
          }
        }
        this.selectCell = null;
        this.submitLabel.margin = this.sizeForm.margin;
        this.submitLabel.width = this.sizeForm.width;
        this.submitLabel.height = this.sizeForm.height;
        this.submitLabel.rowNum = this.sizeForm.rowNum;
        this.submitLabel.colNum = this.sizeForm.colNum;
        this.submitLabel.tableWidth = this.tableWidth;
        this.submitLabel.tableHeight = this.tableHeight;
        this.submitLabel.fontFace = this.$t("h.drawLabelComponents15");
        this.submitLabel.border = true;
        this.submitLabel.borderWidth = 2;
        this.submitLabel.tdBotderWidth = 1;
        this.submitLabel.dpi = this.sizeForm.dpi;
        this.submitLabel.tableCell = [];
        this.firstTable = this.$refs["showLeftRef"].innerHTML;
        // let tdsElement = document.querySelectorAll("td");
        let tableDiv = document.querySelector(".custom-body");
        let tdsElement = [];
        if (tableDiv) tdsElement = tableDiv.querySelectorAll("td");
        const menu = document.getElementById("menu");
        menu.classList.remove("active");
        tdsElement.forEach((el) => {
          let cellItem = {};
          cellItem.width = this.pxConverterMM(
            el.offsetWidth,
            this.sizeForm.dpi
          );
          cellItem.height = this.pxConverterMM(
            el.offsetHeight,
            this.sizeForm.dpi
          );
          cellItem.rowSpan = Number(el.getAttribute("rowSpan")) || 1;
          cellItem.colSpan = Number(el.getAttribute("colSpan")) || 1;
          cellItem.position = [
            Number(el.getAttribute("data-position").split(",")[0]),
            Number(el.getAttribute("data-position").split(",")[1]),
          ];
          cellItem.type = "";
          cellItem.data = "";
          cellItem.name = "";
          cellItem.fontSize = 28;
          cellItem.align = "center";
          this.submitLabel.tableCell.push(cellItem);
        });
        this.$refs["showLeftRef"].innerHTML = "";
        this.createLabel();
        this.active = 1;
        this.watchActive = this.active;
        this.$message.closeAll();
        document
          .querySelector(".label2")
          .addEventListener("contextmenu", (e) => {
            e.preventDefault();
            if (e.target.localName == "td" || e.target.localName == "img") {
              for (let i = 0; i < document.querySelectorAll("td").length; i++) {
                document.querySelectorAll("td")[i].style.background = "#fff";
              }
              this.cellForm.logo = "";
              let x;
              let y;
              if (e.target.localName == "td") {
                e.target.style.background = "#ccc";
                x = e.target.dataset.position.split(",")[0];
                y = e.target.dataset.position.split(",")[1];
              } else if (e.target.localName == "img") {
                e.target.parentNode.style.background = "#ccc";
                x = e.target.parentNode.dataset.position.split(",")[0];
                y = e.target.parentNode.dataset.position.split(",")[1];
              }
              this.submitLabel.tableCell.forEach((item) => {
                if (item.position[0] == x && item.position[1] == y) {
                  this.cellForm.type = item.type;
                  this.cellForm.data = item.data;
                  this.cellForm.name = item.name;
                  this.cellForm.fontSize = item.fontSize;
                  this.cellForm.align = item.align;
                  this.cellForm.codeProportion = item.codeProportion
                    ? item.codeProportion
                    : 10;
                  this.cellForm.imgProportion = item.imgProportion
                    ? item.imgProportion
                    : 10;
                  this.cellForm.imgHeight = item.imgHeight ? item.imgHeight : 0;
                  this.cellForm.imgWidth = item.imgWidth ? item.imgWidth : 0;
                  if (item.type == "logo") {
                    this.cellForm.logo = item.logo;
                  }
                }
              });
              if (e.target.localName == "td") {
                this.selectCell = e.target;
              } else if (e.target.localName == "img") {
                this.selectCell = e.target.parentNode;
              }
            }
          });
      });
    },
    //修改模板 下一步
    modifySaveLabelBody() {
      let trs = this.$refs["showLeftRef"].querySelectorAll("tr");
      for (let i = 0; i < trs.length; i++) {
        for (let j = 0; j < trs[i].children.length; j++) {
          trs[i].children[j].setAttribute("data-position", `${i},${j}`);
        }
      }
      //获取localStorage:tableHtml中tableCell数据
      let tableHtmlArr = this.tableData;
      let oldTableCell = tableHtmlArr.tableCell;
      this.selectCell = null;
      this.submitLabel.margin = this.sizeForm.margin;
      this.submitLabel.width = this.sizeForm.width;
      this.submitLabel.height = this.sizeForm.height;
      this.submitLabel.rowNum = this.sizeForm.rowNum;
      this.submitLabel.colNum = this.sizeForm.colNum;
      this.submitLabel.tableWidth = this.tableWidth;
      this.submitLabel.tableHeight = this.tableHeight;
      this.submitLabel.fontFace = this.$t("h.drawLabelComponents15");
      this.submitLabel.border = tableHtmlArr.border;
      this.submitLabel.borderWidth = 2;
      this.submitLabel.tdBotderWidth = 1;
      this.submitLabel.dpi = this.sizeForm.dpi;
      this.submitLabel.tableCell = [];
      this.firstTable = this.$refs["showLeftRef"].innerHTML;
      // let tdsElement = document.querySelectorAll("td");
      let tableDiv = document.querySelector(".custom-body");
      let tdsElement = [];
      if (tableDiv) tdsElement = tableDiv.querySelectorAll("td");
      let tableCellIndex = 0;
      const menu = document.getElementById("menu");
      menu.classList.remove("active");
      tdsElement.forEach((el) => {
        let cellItem = {};
        cellItem.width = this.pxConverterMM(el.offsetWidth, this.sizeForm.dpi);
        cellItem.height = this.pxConverterMM(
          el.offsetHeight,
          this.sizeForm.dpi
        );
        cellItem.rowSpan = Number(el.getAttribute("rowSpan")) || 1;
        cellItem.colSpan = Number(el.getAttribute("colSpan")) || 1;
        cellItem.position = [
          Number(el.getAttribute("data-position").split(",")[0]),
          Number(el.getAttribute("data-position").split(",")[1]),
        ];
        let text = el.innerHTML.split(".")[0];
        for (let i = tableCellIndex; i < oldTableCell.length; i++) {
          cellItem.align = oldTableCell[i].align;
          cellItem.fontSize = oldTableCell[i].fontSize;
          if (
            (el.innerHTML != "" && el.innerHTML == oldTableCell[i].data) ||
            text == oldTableCell[i].data.slice(0, text.length)
          ) {
            cellItem.type = oldTableCell[i].type;
            cellItem.data = oldTableCell[i].data;
            cellItem.name = oldTableCell[i].name;
            tableCellIndex = i + 1;
            break;
          } else if (
            el.innerHTML != "" &&
            el.innerHTML.split("<")[1] != "" &&
            el.innerHTML.split("<")[1] != undefined
          ) {
            if (
              (el.innerHTML.split("<")[1].substring(0, 3) == "img" &&
                oldTableCell[i].type == "QRcode") ||
              oldTableCell[i].type == "logo"
            ) {
              cellItem.type = oldTableCell[i].type;
              cellItem.data = oldTableCell[i].data;
              cellItem.name = oldTableCell[i].name;
              tableCellIndex = i + 1;
              if (oldTableCell[i].type == "logo") {
                cellItem.logo = oldTableCell[i].logo;
                cellItem.imgProportion = oldTableCell[i].imgProportion;
                cellItem.imgHeight = oldTableCell[i].imgHeight;
                cellItem.imgWidth = oldTableCell[i].imgWidth;
              }
              if (oldTableCell[i].type == "QRcode") {
                cellItem.codeProportion = oldTableCell[i].codeProportion;
              }
              break;
            }
          } else {
            cellItem.type = "";
            cellItem.data = "";
            cellItem.name = "";
          }
        }
        this.submitLabel.tableCell.push(cellItem);
      });
      this.modifyCreateLabel();
      this.active = 1;
      this.watchActive = this.active;
      document.querySelector(".label2").addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (e.target.localName == "td" || e.target.localName == "img") {
          for (let i = 0; i < document.querySelectorAll("td").length; i++) {
            document.querySelectorAll("td")[i].style.background = "#fff";
          }
          this.cellForm.logo = "";
          let x;
          let y;
          if (e.target.localName == "td") {
            e.target.style.background = "#ccc";
            x = e.target.dataset.position.split(",")[0];
            y = e.target.dataset.position.split(",")[1];
          } else if (e.target.localName == "img") {
            e.target.parentNode.style.background = "#ccc";
            x = e.target.parentNode.dataset.position.split(",")[0];
            y = e.target.parentNode.dataset.position.split(",")[1];
          }
          this.submitLabel.tableCell.forEach((item) => {
            if (item.position[0] == x && item.position[1] == y) {
              this.cellForm.type = item.type;
              this.cellForm.data = item.data;
              this.cellForm.name = item.name;
              this.cellForm.fontSize = item.fontSize;
              this.cellForm.align = item.align;
              this.cellForm.codeProportion = item.codeProportion
                ? item.codeProportion
                : 10;
              this.cellForm.imgProportion = item.imgProportion
                ? item.imgProportion
                : 10;
              this.cellForm.imgHeight = item.imgHeight ? item.imgHeight : 0;
              this.cellForm.imgWidth = item.imgWidth ? item.imgWidth : 0;
              if (item.type == "logo") {
                this.cellForm.logo = item.logo;
              }
            }
          });
          if (e.target.localName == "td") {
            this.selectCell = e.target;
          } else if (e.target.localName == "img") {
            this.selectCell = e.target.parentNode;
          }
        }
      });
    },
    // 生成标签
    createLabel() {
      let labelEl = document.createElement("div");
      let dpi = this.submitLabel.dpi;
      labelEl.style.width = this.mmConverterPx(this.submitLabel.width, dpi);
      labelEl.style.height = this.mmConverterPx(this.submitLabel.height, dpi);
      labelEl.style.background = "#fff";
      labelEl.style.boxSizing = "border-box";
      labelEl.style.padding = this.mmConverterPx(this.submitLabel.margin, dpi);
      labelEl.className = "label2";
      let tableWidth = this.mmConverterPx(this.submitLabel.tableWidth, dpi);
      let tableHeight = this.mmConverterPx(this.submitLabel.tableHeight, dpi);
      let borderStyle = this.submitLabel.borderWidth + "px solid #000";
      let tdBorderStyle = this.submitLabel.tdBotderWidth + "px solid #000";
      let tableStyle = `width:${tableWidth};
                      height:${tableHeight};
                      font:${this.submitLabel.fontFace};
                      border:${borderStyle};
                      border-collapse:collapse;
                      box-sizing:border-box;`;
      let tableEleHTML = `<table style="${tableStyle}">`;
      for (let i = 0; i < this.submitLabel.rowNum; i++) {
        tableEleHTML += "<tr>";
        for (let j = 0; j < this.submitLabel.colNum; j++) {
          for (let k = 0; k < this.submitLabel.tableCell.length; k++) {
            if (
              this.submitLabel.tableCell[k].position[0] == i &&
              this.submitLabel.tableCell[k].position[1] == j
            ) {
              let tdStyle = `
                            border:${tdBorderStyle};
                            width:${this.mmConverterPx(
                              this.submitLabel.tableCell[k].width,
                              dpi
                            )};
                            height:${this.mmConverterPx(
                              this.submitLabel.tableCell[k].height,
                              dpi
                            )};
                            font-size:${
                              this.submitLabel.tableCell[k].fontSize
                            }px;
                            border-collapse:collapse;
                            text-align:center;
                            box-sizing:border-box;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                            white-space: nowrap;
                            cursor: pointer;`;
              tableEleHTML += `<td style="${tdStyle}" data-position="${i},${j}" rowspan="${this.submitLabel.tableCell[k].rowSpan}" colspan="${this.submitLabel.tableCell[k].colSpan}"></td>`;
            }
          }
        }
        tableEleHTML += `</tr>`;
      }
      tableEleHTML += `</table>`;
      labelEl.innerHTML = tableEleHTML;
      this.$refs["showLeftRef"].appendChild(labelEl);
    },
    // 确认增加单元格完成后生成标签
    modifyCreateLabel() {
      let labelEl = document.createElement("div");
      let dpi = this.submitLabel.dpi;
      labelEl.style.width = this.mmConverterPx(this.submitLabel.width, dpi);
      labelEl.style.height = this.mmConverterPx(this.submitLabel.height, dpi);
      labelEl.style.background = "#fff";
      labelEl.style.boxSizing = "border-box";
      labelEl.style.padding = this.mmConverterPx(this.submitLabel.margin, dpi);
      labelEl.className = "label2";
      labelEl.style.display = "flex";
      labelEl.style.flexDirection = "row";
      labelEl.style.justifyContent = "center";
      labelEl.style.alignItems = "center";
      let tableWidth = this.mmConverterPx(this.submitLabel.tableWidth, dpi);
      let tableHeight = this.mmConverterPx(this.submitLabel.tableHeight, dpi);
      let borderStyle;
      let tdBorderStyle;
      if (this.submitLabel.border) {
        borderStyle = this.submitLabel.borderWidth + "px solid #000";
        tdBorderStyle = this.submitLabel.tdBotderWidth + "px solid #000";
      } else {
        borderStyle = "none";
        tdBorderStyle = "none";
      }
      let tableStyle = `width:${tableWidth};
                      height:${tableHeight};
                      font:${this.submitLabel.fontFace};
                      border:${borderStyle};
                      border-collapse:collapse;
                      box-sizing:border-box;`;
      let tableEleHTML = `<table style="${tableStyle}">`;
      for (let i = 0; i < this.submitLabel.rowNum; i++) {
        tableEleHTML += "<tr>";
        for (let j = 0; j < this.submitLabel.colNum; j++) {
          for (let k = 0; k < this.submitLabel.tableCell.length; k++) {
            if (
              this.submitLabel.tableCell[k].position[0] == i &&
              this.submitLabel.tableCell[k].position[1] == j
            ) {
              console.log("align>>>", this.submitLabel.tableCell[k].align);
              let tdWidth =
                (Number(
                  this.mmConverterPx(
                    this.submitLabel.tableCell[k].width,
                    dpi
                  ).split("p")[0]
                ) /
                  Number(tableWidth.split("p")[0])) *
                100;
              let tdStyle = `width:${this.mmConverterPx(
                this.submitLabel.tableCell[k].width,
                dpi
              )};
                             height:${this.mmConverterPx(
                               this.submitLabel.tableCell[k].height,
                               dpi
                             )};
                             border:${tdBorderStyle};
                             font-size:${
                               this.submitLabel.tableCell[k].fontSize
                             }px;
                             border-collapse:collapse;
                             text-align:${this.submitLabel.tableCell[k].align};
                             box-sizing:border-box;
                             text-overflow: ellipsis;
                             overflow: hidden;
                             word-break: break-all;
                             white-space: nowrap;
                             cursor: pointer;`;
              if (
                this.submitLabel.tableCell[k].data != "" ||
                this.submitLabel.tableCell[k].logo != ""
              ) {
                tableEleHTML += `<td style="${tdStyle}" data-position="${i},${j}" rowspan="${
                  this.submitLabel.tableCell[k].rowSpan
                }" colspan="${this.submitLabel.tableCell[k].colSpan}">${
                  document.querySelectorAll("td")[k].innerHTML
                }</td>`;
              } else {
                tableEleHTML += `<td style="${tdStyle}" data-position="${i},${j}" rowspan="${this.submitLabel.tableCell[k].rowSpan}" colspan="${this.submitLabel.tableCell[k].colSpan}"></td>`;
              }
            }
          }
        }
        tableEleHTML += `</tr>`;
      }
      tableEleHTML += `</table>`;
      labelEl.innerHTML = tableEleHTML;
      this.$refs["showLeftRef"].innerHTML = "";
      this.$refs["showLeftRef"].appendChild(labelEl);
    },
    // 保存单个单元格
    saveTableCell() {
      this.$refs["cellFormRef"].validate((valid) => {
        if (!valid) return false;
        let clickWidth = this.selectCell.clientWidth;
        if (this.cellForm.type == "data" || this.cellForm.type == "QRcode") {
          if (!this.cellForm.name) {
            return this.$message.error(this.$t("h.drawLabelComponents71"));
          }
        }
        let x = this.selectCell.dataset.position.split(",")[0];
        let y = this.selectCell.dataset.position.split(",")[1];
        this.submitLabel.tableCell.forEach((item) => {
          if (item.position[0] == x && item.position[1] == y) {
            item.type = this.cellForm.type;
            item.data = this.cellForm.data;
            item.name = this.cellForm.name;
            if (this.cellForm.type != "logo")
              item.fontSize = this.cellForm.fontSize;
            item.align = this.cellForm.align;
            this.selectCell.style.textAlign = item.align;
            this.selectCell.style.fontSize = item.fontSize + "px";
            this.selectCell.style.color = "#000";
            if (this.cellForm.type == "QRcode") {
              item.data = "GZ88888888";
              item.codeProportion = this.cellForm.codeProportion;
              //获取当前td宽高
              let thisWidth = Number(
                window.getComputedStyle(this.selectCell).width.split("p")[0]
              );
              let thisHeight = Number(
                window.getComputedStyle(this.selectCell).height.split("p")[0]
              );
              let qrCodelength =
                thisWidth - thisHeight > 0
                  ? ((thisHeight - 10) / 10) * this.cellForm.codeProportion
                  : ((thisWidth - 10) / 10) * this.cellForm.codeProportion;
              let qrCodeElement = document.createElement("div");
              new QRCode(qrCodeElement, {
                text: "GZ88888888",
                width: qrCodelength,
                height: qrCodelength,
                colorLight: "#ffffff", // 二维码背景色
                correctLevel: QRCode.CorrectLevel.H,
              });
              qrCodeElement.lastChild.onload = () => {
                this.selectCell.innerHTML = `<img
                                              src="${qrCodeElement.lastChild.getAttribute(
                                                "src"
                                              )}"
                                              style="vertical-align:middle;"
                                              />`;
              };
            } else if (this.cellForm.type == "logo") {
              //获取当前td宽高
              let thisWidth = Number(
                window.getComputedStyle(this.selectCell).width.split("p")[0]
              );
              let thisHeight = Number(
                window.getComputedStyle(this.selectCell).height.split("p")[0]
              );
              let willHeight;
              let willWidth;
              if (this.stepVal) {
                willHeight = Number(
                  this.mmConverterPx(
                    this.cellForm.imgHeight,
                    this.submitLabel.dpi
                  ).split("p")[0]
                );
                willWidth = Number(
                  this.mmConverterPx(
                    this.cellForm.imgWidth,
                    this.submitLabel.dpi
                  ).split("p")[0]
                );
              } else {
                willHeight = this.cellForm.imgHeight;
                willWidth = this.cellForm.imgWidth;
              }
              if (this.cellForm.imgHeight > thisHeight) {
                let num = this.cellForm.imgHeight - thisHeight;
                willHeight = this.cellForm.imgHeight - 10 - num;
                willWidth = this.cellForm.imgWidth - 10 - num;
              }
              if (willWidth > thisWidth) {
                let num = this.cellForm.imgWidth - thisWidth;
                willWidth = this.cellForm.imgWidth - 10 - num;
                willHeight = this.cellForm.imgHeight - 10 - num;
              }
              willHeight = (willHeight / 10) * this.cellForm.imgProportion;
              willWidth = (willWidth / 10) * this.cellForm.imgProportion;
              if (thisWidth - 2 <= willWidth || thisHeight - 2 <= willHeight)
                return this.$message.error(this.$t("h.drawLabelComponents72"));
              item.imgProportion = this.cellForm.imgProportion;
              item.logo = this.cellForm.logo;
              item.imgHeight = this.pxConverterMM(
                willHeight,
                this.submitLabel.dpi
              );
              item.imgWidth = this.pxConverterMM(
                willWidth,
                this.submitLabel.dpi
              );
              if (this.cellForm.logo) {
                this.selectCell.innerHTML = `<img
                                              src="${this.cellForm.logo}"
                                              style="vertical-align:middle;width:${willWidth}px;height:${willHeight}px"/>`;
              } else {
                item.type = "";
                item.data = "";
                item.name = "";
                this.selectCell.innerHTML = "";
              }
            } else {
              // 字体
              this.selectCell.innerText = item.data;
              // 宽度;
              let stringLength = item.data.length - 1;
              // 单元格宽度
              let nowWidth = this.selectCell.clientWidth;
              while (nowWidth > clickWidth) {
                this.selectCell.innerText =
                  item.data.slice(0, stringLength) + "...";
                stringLength -= 1;
                nowWidth = this.selectCell.clientWidth;
                if (stringLength < 1) {
                  this.selectCell.innerText = item.data.slice(0, 1);
                  return;
                }
              }
            }
          }
        });
      });
    },
    // 完成标签内容的创建，下一步
    svaeLabelContent() {
      // let nextStepConfirm = [];
      // this.submitLabel.tableCell.forEach((item) => {
      //   nextStepConfirm.push(item.type);
      // });
      // nextStepConfirm.forEach((item1) => {
      //   nextStepConfirm.forEach((item2) => {
      //     if (item1 == "data" && item2 == "QRcode") {
      //       this.secondDisabled = true;
      //       return;
      //     } else if (item1 == "QRcode" && item2 == "data") {
      //       this.secondDisabled = true;
      //       return;
      //     }
      //   });
      // });
      for (let i = 0; i < this.submitLabel.tableCell.length; i++) {
        if (this.submitLabel.tableCell[i].type == "data") {
          this.secondDisabled = true;
          break;
        }
      }

      if (!this.secondDisabled) {
        return this.$message.error(this.$t("h.drawLabelComponents73"));
      } else {
        this.selectCell = document.querySelector(".label2");
        this.secondTable = this.$refs["showLeftRef"].innerHTML;
        document
          .querySelector(".label2")
          .removeEventListener("contextmenu", (e) => {});
        this.$refs["showLeftRef"].innerHTML = "";
        this.$refs["cellFormRef"].clearValidate(["data", "type"]);
        this.active++;
        this.watchActive = this.active;
        this.$refs["showLeftRef"].appendChild(this.selectCell);
        this.cellForm.type = "";
        this.cellForm.data = "";
        this.cellForm.name = "";
      }
    },
    checkboxChange(val) {
      if (val) {
        document.querySelector("table").style.border = "2px solid #000";
        document.querySelectorAll("td").forEach((el) => {
          el.style.border = "1px solid #000";
        });
      } else {
        document.querySelector("table").style.border = "none";
        document.querySelectorAll("td").forEach((el) => {
          el.style.border = "none";
        });
      }
    },
    // 1
    submitLabelJson() {
      this.$refs["borderFormRef"].validate((valid) => {
        if (!valid) return false;
        if (!this.borderForm.name) {
          return false;
        }
        this.submitLabel.name = this.borderForm.name;
        this.submitLabel.border = this.borderForm.border;
        // 提示参数是否完整
        // let codeData = this.submitLabel.tableCell.find((item) => {
        //   return item.type == "QRcode";
        // });
        for (let i = 0; i < document.querySelectorAll("td").length; i++) {
          document.querySelectorAll("td")[i].style.background = "#fff";
        }
        // if (!codeData) {
        //   return this.$message.error("缺少二维码");
        // }
        this.submitLabel.tableCell.forEach((item, index) => {
          if (item.type == "logo" || item.type == "QRcode") {
            document
              .querySelectorAll("td")
              [index].children[0].setAttribute("src", "");
          }
        });
        this.submitLabel.html = document.querySelector(".label2").innerHTML;
        this.submitLabel.permissonId = 23;
        this.submitLabel.type = this.templateType;
        update({
          func: "U0018",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: this.submitLabel,
        })
          .then(({ data }) => {
            if (data.code != 0) return this.$message.error(data.data);
            this.dialogVisible = false;
            this.$emit("refreshTags");
          })
          .catch(() => {
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // 2
    //修改好模板 最终确认生成图片
    modifySubmitLabelJson() {
      this.$refs["borderFormRef"].validate((valid) => {
        if (!valid) return false;
        if (!this.borderForm.name) {
          return false;
        }
        this.submitLabel.name = this.borderForm.name;
        this.submitLabel.border = this.borderForm.border;
        let element = document.createElement("div");
        element.style.position = "fixed";
        element.style.top = "-1000px";
        document.body.appendChild(element);
        for (let i = 0; i < document.querySelectorAll("td").length; i++) {
          document.querySelectorAll("td")[i].style.background = "#fff";
        }
        this.submitLabel.tableCell.forEach((item, index) => {
          if (item.type == "logo" || item.type == "QRcode") {
            document
              .querySelectorAll("td")
              [index].children[0].setAttribute("src", "");
          }
        });
        this.submitLabel.html = document.querySelector(".label2").innerHTML;
        this.stepVal = false;
        this.submitLabel.permissonId = 23;
        this.submitLabel._id = this.tableData._id;
        this.submitLabel.type = this.templateType;
        update({
          func: "U0018",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: this.submitLabel,
        })
          .then(({ data }) => {
            if (data.code != 0) return this.$message.error(data.data);
            this.dialogVisible = false;
            this.$emit("refreshTags");
          })
          .catch(() => {
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // 弹窗开启
    dialogOpened() {
      this.$nextTick(() => {
        if (this.watchActive == 0) {
          let checkWidth = (rule, value, callback) => {
            if (value > 100) {
              callback(new Error(this.$t("h.drawLabelComponents50") + "100"));
            } else {
              callback();
            }
          };
          let checkHeight = (rule, value, callback) => {
            if (value > 60) {
              callback(new Error(this.$t("h.drawLabelComponents51") + "60"));
            } else {
              callback();
            }
          };
          let checkRow = (rule, value, callback) => {
            if (value > 18) {
              callback(
                new Error(
                  this.$t("h.drawLabelComponents52") +
                    "18" +
                    this.$t("h.drawLabelComponents13")
                )
              );
            } else {
              callback();
            }
          };
          let checkCol = (rule, value, callback) => {
            if (value > 18) {
              callback(
                new Error(
                  this.$t("h.drawLabelComponents53") +
                    "18" +
                    this.$t("h.drawLabelComponents13")
                )
              );
            } else {
              callback();
            }
          };
          this.sizeFormRules = {
            width: [
              {
                required: true,
                message: this.$t("h.tips3") + this.$t("h.drawLabelComponents4"),
                trigger: ["change", "blur"],
              },
              {
                pattern: /^(([1-9][0-9]*)(\.\d{1,2})?|0\.\d{1,2})$/,
                message: this.$t("h.drawLabelComponents55"),
                trigger: ["change", "blur"],
              },
              { validator: checkWidth, trigger: ["change", "blur"] },
            ],
            height: [
              {
                required: true,
                message: this.$t("h.tips3") + this.$t("h.drawLabelComponents5"),
                trigger: ["change", "blur"],
              },
              {
                pattern: /^(([1-9][0-9]*)(\.\d{1,2})?|0\.\d{1,2})$/,
                message: this.$t("h.drawLabelComponents56"),
                trigger: ["change", "blur"],
              },
              { validator: checkHeight, trigger: ["change", "blur"] },
            ],
            rowNum: [
              {
                required: true,
                message: this.$t("h.tips3") + this.$t("h.drawLabelComponents8"),
                trigger: "change",
              },
              { type: "number", message: this.$t("h.drawLabelComponents57") },

              {
                pattern: /^[1-9]\d*$/,
                message: this.$t("h.drawLabelComponents57"),
                trigger: "change",
              },
              { validator: checkRow, trigger: "change" },
            ],
            colNum: [
              {
                required: true,
                message: this.$t("h.tips3") + this.$t("h.drawLabelComponents9"),
                trigger: "change",
              },
              { type: "number", message: this.$t("h.drawLabelComponents58") },
              {
                pattern: /^[1-9]\d*$/,
                message: this.$t("h.drawLabelComponents58"),
                trigger: "change",
              },
              { validator: checkCol, trigger: "change" },
            ],
            margin: [
              {
                required: true,
                message: this.$t("h.tips3") + this.$t("h.drawLabelComponents6"),
                trigger: ["change", "blur"],
              },
              {
                pattern: /^(([1-9][0-9]*)(\.\d{1,2})?|0\.\d{1,2})$/,
                message: this.$t("h.drawLabelComponents59"),
                trigger: ["change", "blur"],
              },
            ],
          };
          this.$nextTick(() => {
            this.$refs["sizeFormRef"].clearValidate([
              "width",
              "height",
              "rowNum",
              "colNum",
              "margin",
            ]);
          });
        }
      });
      document.querySelector(".show-left").addEventListener("click", () => {
        this.$refs.menuRef.classList.remove("active");
        for (let i = 0; i < document.querySelectorAll("td").length; i++) {
          document.querySelectorAll("td")[i].style.background = "#fff";
        }
      });
    },
    // 弹窗关闭
    dialogClosed() {
      const menu = document.getElementById("menu");
      menu.classList.remove("active");
      this.sizeForm.width = "";
      this.sizeForm.height = "";
      this.sizeForm.rowNum = "";
      this.sizeForm.colNum = "";
      this.sizeForm.margin = "";
      this.colSpanCellNum = 0;
      this.rowSpanCellNum = 0;
      this.cellForm.type = "";
      this.cellForm.data = "";
      this.cellForm.name = "";
      this.cellForm.logo = "";
      this.borderForm.name = "";
      this.selectCell = null;
      this.$refs["showLeftRef"].innerHTML = "";
      this.submitLabel = {
        name: "",
        deviceRelate: [
          {
            leftMargin: 0,
            printDarkness: 8,
            topMargin: 0,
            printModel: "DL-218",
          },
          {
            leftMargin: 0,
            printDarkness: 8,
            topMargin: 0,
            printModel: "DL-735",
          },
          {
            leftMargin: 0,
            printDarkness: 8,
            topMargin: 0,
            printModel: "DL-721",
          },
        ],
      };
      if (this.watchActive == 0) {
        this.$nextTick(() => {
          this.$refs["sizeFormRef"].clearValidate([
            "width",
            "height",
            "rowNum",
            "colNum",
            "margin",
          ]);
        });
      } else if (this.watchActive == 1) {
        this.$refs["cellFormRef"].clearValidate(["type", "data", "name"]);
      } else if (this.watchActive == 2) {
        this.$refs["borderFormRef"].clearValidate(["name"]);
      }
      document.querySelector(".show-left").removeEventListener("click", () => {
        this.$refs.menuRef.classList.remove("active");
      });
      this.secondDisabled = false;
      this.stepVal = false;
      this.active = 0;
      this.watchActive = this.active;
      this.$emit("closed");
    },
    dialogClose() {},
    // 将毫米换算成像素px
    mmConverterPx(mm, dpi) {
      return Math.floor((mm / 25.4) * dpi * 100) / 100 + "px";
    },
    // 将像素换算成毫米
    pxConverterMM(px, dpi) {
      return Math.floor((px / dpi) * 25.4 * 100) / 100;
    },
    //合并操作检测单元格占行列状况 适用于向右合并
    detectionCell(lastCellRowspan, lastCellColspan, i) {
      if (lastCellRowspan != 1 || lastCellColspan != 1) {
        if (lastCellColspan == 1) {
          for (let j = i; j < i - 1 + lastCellRowspan; j++) {
            let tds = document.createElement("td");
            tds.style.border = "2px solid #000";
            tds.style.boxSizing = "border-box";
            tds.style.overflow = "hidden";
            tds.style.whiteSpace = "nowrap";
            tds.style.textOverflow = "ellipsis";
            this.selectCell.parentNode.parentNode.children[j].appendChild(tds);
          }
        } else {
          for (let z = 0; z < lastCellColspan - 1; z++) {
            let tds = document.createElement("td");
            tds.style.border = "2px solid #000";
            tds.style.boxSizing = "border-box";
            tds.style.overflow = "hidden";
            tds.style.whiteSpace = "nowrap";
            tds.style.textOverflow = "ellipsis";
            this.selectCell.parentNode.parentNode.children[i - 1].appendChild(
              tds
            );
          }
          for (let j = i; j < i - 1 + lastCellRowspan; j++) {
            for (let k = 0; k < lastCellColspan; k++) {
              let tds = document.createElement("td");
              tds.style.border = "2px solid #000";
              tds.style.boxSizing = "border-box";
              tds.style.overflow = "hidden";
              tds.style.whiteSpace = "nowrap";
              tds.style.textOverflow = "ellipsis";
              this.selectCell.parentNode.parentNode.children[j].appendChild(
                tds
              );
            }
          }
        }
      }
    },
    //适用于向下合并
    detectionColCell(
      lastCellRowspan,
      lastCellColspan,
      i,
      lastCell,
      selectPositionX,
      thisCellRowspan
    ) {
      this.selectCell.parentNode.parentNode.children[i].removeChild(
        this.selectCell.parentNode.parentNode.children[i].children[lastCell]
      );
      if (lastCellColspan != 1 || lastCellRowspan != 1) {
        if (lastCellColspan == 1) {
          for (
            let j = selectPositionX + thisCellRowspan;
            j < selectPositionX + thisCellRowspan + lastCellRowspan - 1;
            j++
          ) {
            let tds = document.createElement("td");
            tds.style.border = "2px solid #000";
            tds.style.boxSizing = "border-box";
            tds.style.overflow = "hidden";
            tds.style.whiteSpace = "nowrap";
            tds.style.textOverflow = "ellipsis";
            this.selectCell.parentNode.parentNode.children[j].appendChild(tds);
          }
        } else {
          for (let z = 0; z < lastCellColspan - 1; z++) {
            let tds = document.createElement("td");
            tds.style.border = "2px solid #000";
            tds.style.boxSizing = "border-box";
            tds.style.overflow = "hidden";
            tds.style.whiteSpace = "nowrap";
            tds.style.textOverflow = "ellipsis";
            this.selectCell.parentNode.parentNode.children[
              selectPositionX + thisCellRowspan - 1
            ].appendChild(tds);
          }
          for (
            let j = selectPositionX + thisCellRowspan;
            j < selectPositionX + thisCellRowspan + lastCellRowspan - 1;
            j++
          ) {
            for (let k = 0; k < lastCellColspan; k++) {
              let tds = document.createElement("td");
              tds.style.border = "2px solid #000";
              tds.style.boxSizing = "border-box";
              tds.style.overflow = "hidden";
              tds.style.whiteSpace = "nowrap";
              tds.style.textOverflow = "ellipsis";
              this.selectCell.parentNode.parentNode.children[j].appendChild(
                tds
              );
            }
          }
        }
      }
    },
    //获取所有tr给符合条件的td设置resize: both
    setUpResize() {
      let tableDiv = document.querySelector(".custom-body");
      let trs = [];
      if (tableDiv) trs = tableDiv.querySelectorAll("tr");
      for (let i = 0; i < trs.length; i++) {
        for (let j = 0; j < trs[i].children.length; j++) {
          if (i != trs.length - 1 && j != trs[i].children.length - 1) {
            trs[i].children[j].style.resize = "both";
          } else if (trs[i].children.length == 1) {
            trs[i].children[j].style.resize = "both";
          } else {
            trs[i].children[j].style.resize = "none";
          }
        }
      }
      for (let i = 0; i < trs.length; i++) {
        for (let j = 0; j < trs[i].children.length; j++) {
          let element = trs[i].children[j];
          this.observer["e" + i + j] = new MutationObserver((mutationList) => {
            let tableH = Number(
              this.mmConverterPx(this.tableHeight, this.sizeForm.dpi).split(
                "p"
              )[0]
            );
            let nowTableH = document.querySelector("table").offsetHeight;
            while (nowTableH > Math.round(tableH)) {
              element.style.height = element.offsetHeight - 1 + "px";
              nowTableH = document.querySelector("table").offsetHeight;
            }
          });
          this.observer["e" + i + j].observe(element, {
            attributes: true,
            attributeFilter: ["style"],
            attributeOldValue: true,
          });
        }
      }
    },
    elInputNumberChangeCol() {
      this.changeBeforeCol = this.colSpanCellNum;
    },
    elInputNumberChangeRow() {
      this.changeBeforeRow = this.rowSpanCellNum;
    },
  },
  mounted() {
    let MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;
    this.lang = localStorage.getItem("lang");
    if (this.lang == "EN") {
      this.handleRightStyle = "10px 30px 0 20px";
      this.customContentStyle = "8px";
      this.elFormItemContentStyle = "0px";
      this.elFormItemStyle = "30px";
    }
  },
  beforeDestroy() {
    let tableDiv = document.querySelector(".custom-body");
    let trs = [];
    if (tableDiv) trs = tableDiv.querySelectorAll("tr");
    for (let i = 0; i < trs.length; i++) {
      for (let j = 0; j < trs[i].children.length; j++) {
        if (this.observer) {
          this.observer["e" + i + j].disconnect();
          this.observer["e" + i + j].takeRecords();
          this.observer["e" + i + j] = null;
        }
      }
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  position: relative;
  padding: 0;
  width: 100%;
  height: calc(100% - 54px);
  .custom-body {
    padding: 20px 0px 20px 0px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .custom-content {
      display: flex;
      margin-top: var(--customContentStyle);
      /* height: calc(100% - 66px); */
      height: 100%;
    }
  }
}
::v-deep .el-dialog__header {
  width: 98.9%;
  position: absolute;
  top: 9px;
  left: 0px;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  padding: 20px 0px 10px 20px;
  button {
    position: relative;
    top: 3px;
  }
}
::v-deep .el-steps--simple {
  padding: 13px 28%;
}
::v-deep .el-step__head {
  &.is-success {
    color: #446695;
    border-color: #446695;
  }
  &.is-process {
    color: #446695;
    border-color: #446695;
  }
}
::v-deep .el-step__title {
  // max-width: 61% !important;
  &.is-success {
    color: #446695;
  }
  &.is-process {
    color: #446695;
  }
}
.show-left {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  background: linear-gradient(to right, #4991a4, #5b8bb8);
}
.handle-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--handleRightStyle);
  width: 23.3%;
  height: 100%;
  box-sizing: border-box;
  border-top: 1px solid #eeefef;
  .el-form-item {
    margin-bottom: var(--elFormItemStyle);
  }
  .el-form-item-marginsix {
    margin-bottom: 6px;
  }
  .el-form-item-marginforty {
    margin-bottom: 20px;
  }
  .el-form-item-marginTopThirty {
    margin-top: 30px;
  }
  .el-select {
    width: 100%;
  }
  .el-input-number {
    width: 100%;
  }
  .smallPrompt {
    position: absolute;
    width: 23px;
    height: 23px;
    overflow: hidden;
    display: inline-block;
    bottom: 9px;
    right: -24px;
    .el-button {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #1a6c7a;
      font-size: 20px;
    }
  }
  .colorItem {
    ::v-deep .el-form-item__content {
      margin-left: var(--elFormItemContentStyle) !important;
    }
    .colorItem-button {
      background-color: #578ab9;
      border-color: #fff;
    }
    .colorItem-button2 {
      background-color: #abc4dc;
      border-color: #fff;
    }
    .fortyPercentButton {
      width: 45%;
    }
    .ninetyPercentButton {
      width: 94%;
    }
  }
  .tips {
    padding-left: 10px;
    margin: 0px auto 50px auto;
    font-size: 14px;
    color: #666;
  }
}
.menu {
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 5px;
  background: #fff;
  border: 1px solid #dadce0;
  border-radius: 3px;
  visibility: hidden;
  .menu__item {
    width: 220px;
    height: 32px;
    border-radius: 3px;
    line-height: 32px;
    color: #000;
    cursor: pointer;
    .icon {
      font-weight: bold;
      margin: 0 5px;
    }
    .el-input-number {
      margin: 0 5px;
      width: 100px;
    }
    &:hover {
      background: #dce5e8;
    }
  }
}
.active {
  visibility: visible;
}
</style>
