<template>
  <div>
    <!-- @open="open" -->
    <el-dialog
      top="0"
      custom-class="dialog"
      fullscreen
      :visible.sync="dialogVisible"
      :show-close="false"
      destroy-on-close
    >
      <div class="header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button
              type="primary"
              icon="el-icon-arrow-left"
              circle
              @click="out"
            ></el-button>
            <span class="title">{{
              newFunctionChange ? $t("h.title156") : $t("h.title157")
            }}</span>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <el-button size="small" @click="out">{{
              $t("h.cancelBtn")
            }}</el-button>
            <el-button
              size="small"
              v-if="!newFunctionChange"
              type="primary"
              @click="addFiles"
              >{{ $t("h.confirmBtn") }}</el-button
            >
            <el-button
              size="small"
              v-if="newFunctionChange"
              type="primary"
              @click="modifyFiles"
              >{{ $t("h.saveBtn") }}</el-button
            >
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="body">
        <el-row class="nav" :gutter="45">
          <el-form
            label-width="100px"
            label-position="left"
            ref="assetFormRef"
            :model="assetForm"
            :rules="assetFormRules"
          >
            <el-col :span="12">
              <el-form-item :label="$t('h.title166')" prop="code">
                <el-input v-model="assetForm.code"></el-input>
              </el-form-item>
            </el-col>
            <!-- 物资批号 -->
            <!-- <el-col :span="12">
              <el-form-item :label="$t('h.title166up')" prop="code">
                <el-input v-model="assetForm.code"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips38')" prop="name">
                <el-input v-model="assetForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips63')" prop="barCode">
                <el-input v-model="assetForm.barCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips55')" prop="sortingId">
                <!-- <el-select
                  v-model="assetForm.sortingId"
                  placeholder="请选择物品分类"
                >
                  <el-option
                    v-for="item in newSuperiorSortingData"
                    :key="item.name"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
                <el-cascader
                  :options="newSuperiorSortingData"
                  :props="{ checkStrictly: true }"
                  v-model="assetForm.sortingId"
                  clearable
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips81')" prop="goodsId">
                <el-select
                  filterable
                  clearable
                  v-model="assetForm.goodsId"
                  :placeholder="$t('h.tips4') + $t('h.formTips81')"
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
            <el-col :span="12">
              <el-form-item :label="$t('h.title198')" prop="logo">
                <el-input v-model="assetForm.logo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 生产日期 -->
              <el-form-item :label="$t('h.formTips82')" prop="productionDate">
                <el-date-picker
                  type="date"
                  :placeholder="$t('h.tips4') + $t('h.formTips82')"
                  v-model="assetForm.productionDate"
                  style="width: 100%"
                  clearable
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 失效日期 -->
              <el-form-item :label="$t('h.formTips83')" prop="expirationDate">
                <el-date-picker
                  type="date"
                  :placeholder="$t('h.tips4') + $t('h.formTips83')"
                  v-model="assetForm.expirationDate"
                  style="width: 100%"
                  clearable
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips84')" prop="acquisitionStatus">
                <el-select
                  filterable
                  clearable
                  v-model="assetForm.acquisitionStatus"
                  :placeholder="$t('h.tips4') + $t('h.formTips84')"
                >
                  <el-option
                    v-for="item in acquisitionStatus"
                    :key="item._id"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('h.columns27')" prop="specification">
                <el-input v-model="assetForm.specification"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.columns70')" prop="price">
                <el-input v-model="assetForm.price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.columns28')" prop="measureUnit">
                <el-input v-model="assetForm.measureUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.columns57')" prop="lowerSize">
                <el-input v-model="assetForm.lowerSize"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.columns58')" prop="upperSize">
                <el-input v-model="assetForm.upperSize"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.comment')" prop="remark">
                <el-input v-model="assetForm.remark"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.columns71')" prop="image">
                <upload-photo :value.sync="assetForm.image"></upload-photo>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import UploadPhoto from "@/components/ListComponents/NewAssetDialog/UploadPhoto";
import { warehouseOperate } from "@/assets/api";
export default {
  props: {
    newDialogVisible: {
      type: Boolean,
      default: false,
    },
    addingFilesComplate: {
      type: Boolean,
      default: false,
    },
    functionChange: {
      type: Boolean,
      default: false,
    },
    // treeSeleteData: {
    //   type: [Object, String],
    //   default: () => ({} || ""),
    // },
    modifyFileData: {
      type: Object,
      default: () => ({}),
    },
    superiorSortingData: {
      type: Array,
      default: () => [],
    },
    attrData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      assetForm: {
        code: "",
        name: "",
        barCode: "",
        sortingId: [],
        goodsId: "",
        logo: "",
        //生产日期
        productionDate: "",
        //失效日期
        expirationDate: "",
        //是否采集
        acquisitionStatus: "",
        specification: "",
        price: "",
        measureUnit: "",
        lowerSize: "",
        upperSize: "",
        remark: "",
        image: "",
      },
      assetFormRules: {
        code: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.categoryCode"),
            trigger: ["blur", "change"],
          },
          // {
          //   pattern: /^[A-Za-z0-9]+$/,
          //   message: "分类编码只能数字/字母",
          //   trigger: ["change", "blur"],
          // },
        ],
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.categoryName"),
            trigger: ["blur", "change"],
          },
        ],
        sortingId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips55"),
            trigger: "change",
          },
        ],
        goodsId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.assetAttributes"),
            trigger: "change",
          },
        ],
        acquisitionStatus: [
          {
            required: true,
            message: this.$t("h.tips4") + "采集属性",
            trigger: "change",
          },
        ],
      },
      //用户数据
      userId: "",
      token: "",
      staffId: "",

      //是否采集
      acquisitionStatus: [
        {
          name: "是",
          value: true,
        },
        {
          name: "否",
          value: false,
        },
      ],
    };
  },
  methods: {
    //新建物品
    addFiles() {
      this.$refs["assetFormRef"].validate((valid) => {
        if (!valid) return false;
        warehouseOperate({
          func: "SU0002",
          userId: this.userId,
          token: this.token,
          //TODO：添加和修改物品-添加请求体字段
          requstData: {
            code: this.assetForm.code,
            name: this.assetForm.name,
            barCode: this.assetForm.barCode,
            sortingId:
              this.assetForm.sortingId.length > 1
                ? this.assetForm.sortingId[this.assetForm.sortingId.length - 1]
                : this.assetForm.sortingId.join(),
            logo: this.assetForm.logo,
            specification: this.assetForm.specification,
            price: this.assetForm.price,
            goodsId: this.assetForm.goodsId,
            measureUnit: this.assetForm.measureUnit,
            lowerSize: this.assetForm.lowerSize,
            upperSize: this.assetForm.upperSize,
            remark: this.assetForm.remark,
            image: this.assetForm.image,
            staffId: this.staffId,
            status: false,
            productionDate: this.assetForm.productionDate,
            expirationDate: this.assetForm.expirationDate,
            acquisitionStatus: this.assetForm.acquisitionStatus,
          },
        }).then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.$message.success(data.data);
          this.assetForm = {
            code: "",
            name: "",
            barCode: "",
            sortingId: "",
            logo: "",
            specification: "",
            price: "",
            measureUnit: "",
            lowerSize: "",
            upperSize: "",
            remark: "",
            image: "",
            productionDate: "",
            expirationDate: "",
            acquisitionStatus: "",
          };
          this.$refs["assetFormRef"].resetFields();
          this.cAddingFilesComplate = true;
          this.dialogVisible = false;
          this.newFunctionChange = false;
        });
      });
    },
    // 退出el-dialog
    out() {
      this.assetForm = {
        code: "",
        name: "",
        barCode: "",
        sortingId: "",
        logo: "",
        specification: "",
        price: "",
        measureUnit: "",
        lowerSize: "",
        upperSize: "",
        remark: "",
        image: "",
        productionDate: "",
        expirationDate: "",
        acquisitionStatus: "",
      };
      this.$refs["assetFormRef"].resetFields();
      this.dialogVisible = false;
      this.newFunctionChange = false;
    },
    //修改档案
    modifyFiles() {
      console.log("修改档案");
      this.$refs["assetFormRef"].validate((valid) => {
        if (!valid) return false;
        let requstData = {
          code: this.assetForm.code,
          name: this.assetForm.name,
          barCode: this.assetForm.barCode,
          // sortingId:
          //   this.assetForm.sortingId.length > 1
          //     ? this.assetForm.sortingId[this.assetForm.sortingId.length - 1]
          //     : this.assetForm.sortingId.join(),
          e:
            this.assetForm.sortingId.length > 1
              ? this.assetForm.sortingId[this.assetForm.sortingId.length - 1]
              : this.assetForm.sortingId.join(),
          logo: this.assetForm.logo,
          specification: this.assetForm.specification,
          price: this.assetForm.price,
          goodsId: this.assetForm.goodsId,
          measureUnit: this.assetForm.measureUnit,
          lowerSize: this.assetForm.lowerSize,
          upperSize: this.assetForm.upperSize,
          remark: this.assetForm.remark,
          image: this.assetForm.image == "h" ? "" : this.assetForm.image,
          staffId: this.staffId,
          status: false,
          substanceId: this.modifyFileData.substanceId,

          productionDate: this.assetForm.productionDate,
          expirationDate: this.assetForm.expirationDate,
          acquisitionStatus: this.assetForm.acquisitionStatus,
        };
        for (let key in requstData) {
          if (requstData[key] == this.modifyFileData.image) {
            delete requstData[key];
          }
        }
        warehouseOperate({
          func: "SU0003",
          userId: this.userId,
          token: this.token,
          requstData,
        }).then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.$message.success(data.data);
          this.assetForm = {
            code: "",
            name: "",
            barCode: "",
            sortingId: "",
            logo: "",
            specification: "",
            price: "",
            goodsId: "",
            measureUnit: "",
            lowerSize: "",
            upperSize: "",
            remark: "",
            image: "",
            productionDate: "",
            expirationDate: "",
            acquisitionStatus: "",
          };
          this.$refs["assetFormRef"].resetFields();
          this.cAddingFilesComplate = true;
          this.dialogVisible = false;
          this.newFunctionChange = false;
        });
      });
    },
    // open() {
    //   if (!this.newFunctionChange) {
    //     this.assetForm.sortingId = this.treeSeleteData.sortingId;
    //   }
    // },
    modify(children) {
      children.forEach((item) => {
        item.label = item.name;
        item.value = item.sortingId;
        if (item.children && item.children.length) {
          this.modify(item.children);
        }
      });
    },
  },
  components: {
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    UploadPhoto,
  },
  computed: {
    dialogVisible: {
      get() {
        return this.newDialogVisible;
      },
      set(val) {
        this.$emit("update:newDialogVisible", val);
      },
    },
    cAddingFilesComplate: {
      get() {
        return this.addingFilesComplate;
      },
      set(val) {
        this.$emit("update:addingFilesComplate", val);
      },
    },
    newFunctionChange: {
      get() {
        return this.functionChange;
      },
      set(val) {
        this.$emit("update:functionChange", val);
      },
    },
    newSuperiorSortingData() {
      let arr = this.superiorSortingData;
      arr.forEach((item) => {
        item.label = item.name;
        item.value = item.sortingId;
        if (item.children && item.children.length) {
          this.modify(item.children);
        }
      });
      return arr;
    },
  },
  created() {
    this.userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
    this.token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
    this.staffId = JSON.parse(sessionStorage.getItem("vuex")).userInfo.staffId;
  },
  watch: {
    newFunctionChange: function (val) {
      console.log("newFunctionChange---");
      if (val) {
        this.assetForm = {
          code: this.modifyFileData.code,
          name: this.modifyFileData.name,
          barCode: this.modifyFileData.barCode,
          sortingId: this.modifyFileData.sortingId,
          logo: this.modifyFileData.logo,
          specification: this.modifyFileData.specification,
          price: this.modifyFileData.price,
          measureUnit: this.modifyFileData.measureUnit,
          lowerSize: this.modifyFileData.lowerSize,
          upperSize: this.modifyFileData.upperSize,
          remark: this.modifyFileData.remark,
          image: this.modifyFileData.image,
          goodsId: this.modifyFileData.goodsId,
          productionDate: this.modifyFileData.productionDate,
          expirationDate: this.modifyFileData.expirationDate,
          acquisitionStatus: this.modifyFileData.acquisitionStatus,
        };
      }
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
  .el-dialog__body {
    padding: 0;
    height: calc(100% - 54px);
  }
}
.header {
  padding: 10px 20px;
  .title {
    margin-left: 30px;
    font-size: 18px;
    vertical-align: middle;
  }
}
.body {
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
}
</style>
