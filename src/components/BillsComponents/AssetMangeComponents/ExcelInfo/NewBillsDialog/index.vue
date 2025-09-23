<template>
  <el-dialog
    fullscreen
    custom-class="dialog"
    :show-close="false"
    :visible.sync="dialogVisible"
    @opened="dialogVisibleOpened"
    @closed="dialogVisibleClosed"
  >
    <div slot="title" class="dialog_title">
      <div class="title_left">
        <el-button
          type="primary"
          icon="el-icon-back"
          circle
          plain
          size="small"
          @click="dialogVisible = false"
        ></el-button>
        <span>{{ $t("h.title84") }}</span>
      </div>
      <div class="title_right">
        <el-button type="primary" size="small" @click="submitTemplate">{{
          $t("h.confirmBtn")
        }}</el-button>
        <el-button size="small" @click="dialogVisible = false">{{
          $t("h.cancelBtn")
        }}</el-button>
      </div>
    </div>
    <div class="dialog_body">
      <div class="file_info">
        <el-form
          ref="elFormRef"
          label-width="200px"
          label-position="left"
          :rules="excelIdenFormRules"
          :inline="true"
          :model="excelIdenForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('h.advancedSearch2') + ':'"
                prop="fileName"
              >
                <el-input v-model="excelIdenForm.fileName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips20') + ':'" prop="rowHeadNum">
                <el-input v-model="excelIdenForm.rowHeadNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('h.formTips21') + ':'" prop="rowDataNum">
                <el-input v-model="excelIdenForm.rowDataNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="8" class="file">
            <span>{{ $t("h.title85") }}:</span>
            <slot />
          </el-col>
          <el-col :span="8" class="file">
            <el-button type="text" @click="createTemplateTable">{{
              $t("h.title86")
            }}</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="notNllAndUnqiue">
        <!-- trigger="hover" -->
        <el-popover placement="top-start">
          <div class="tag_box">
            <el-tag
              size="small"
              effect="dark"
              v-for="item in notNullHeadCheckData"
              :key="item._id"
              >{{ item.nameShow }}</el-tag
            >
          </div>
          <el-button size="mini" type="text" slot="reference"
            >{{ $t("h.title87") }}({{ notNullHeadCheckData.length }})
          </el-button>
        </el-popover>
        <el-popover placement="top-start">
          <div class="tag_box">
            <el-tag
              size="small"
              effect="dark"
              v-for="item in uniqueHeadCheckData"
              :key="item._id"
              >{{ item.nameShow }}</el-tag
            >
          </div>
          <el-button size="mini" type="text" slot="reference"
            >{{ $t("h.title88") }}({{ uniqueHeadCheckData.length }})
          </el-button>
        </el-popover>
      </div>
      <div class="edit-table">
        <ds-table
          :loading="tableLoading"
          :rowKey="(row) => row._id"
          :columns="loaclExcelColumns"
          :tableConfig="loaclExcelConfig"
          :tableData="localExcelData"
        >
          <template slot="system" slot-scope="{ scope }">
            <el-select
              size="mini"
              v-model.lazy="scope.row.systemId"
              value-key="nameShow"
              :placeholder="$t('h.tips4')"
              filterable
              clearable
              @change="(val) => onSelectChange(val, scope.row)"
            >
              <el-option
                v-for="item in systemTableData"
                :key="item.dbDataName"
                :label="item.nameShow"
                :value="item._id"
              >
              </el-option>
            </el-select>
          </template>
          <template slot="type" slot-scope="{ scope }">
            <el-select disabled v-model="scope.row.type" size="mini">
              <el-option
                v-for="item in valueType"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </template>
          <template slot="character" slot-scope="{ scope }">
            <el-checkbox
              v-model="scope.row.notNull"
              :disabled="isSystemNotNull(scope.row.dbDataName)"
              :true-label="1"
              :false-label="0"
              >{{ $t("h.title89") }}</el-checkbox
            >
            <el-checkbox
              v-model="scope.row.unique"
              :disabled="isSystemUnique(scope.row.dbDataName)"
              :true-label="1"
              :false-label="0"
              @change="(val) => onUniqueChange(val, scope.row)"
              >{{ $t("h.title90") }}</el-checkbox
            >
          </template>
          <template slot="default" slot-scope="{ scope }">
            <el-input
              v-if="scope.row.type == 'String' || scope.row.type == 'Double'"
              v-model="scope.row.defaultVal"
              :disabled="scope.row.unique == 1"
              :placeholder="$t('h.tips3') + $t('h.title91')"
              size="mini"
              clearable
              @change="(val) => onDefaultValChange(val, scope.row)"
            ></el-input>
            <el-date-picker
              :disabled="scope.row.unique == 1"
              v-else-if="scope.row.type == 'Date'"
              v-model="scope.row.defaultVal"
              type="date"
              size="mini"
              style="width: 135px"
              :placeholder="$t('h.tips4') + $t('h.date')"
              clearable
              :range-separator="$t('h.to')"
              :start-placeholder="$t('h.startDate')"
              :end-placeholder="$t('h.endDate')"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <span v-else></span>
          </template>
          <template slot="range" slot-scope="{ scope }">
            <span>{{ scope.row.rangeSt }}-{{ scope.row.rangeEnd }}</span>
          </template>
          <template slot="format"></template>
          <template slot="rule"></template>
        </ds-table>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { select, update } from "@/assets/api";
import { loaclExcelColumns } from "@/utils/systemData";
import deepCopy from "@/utils/deepCopy";
import axios from "axios";
import DsTable from "@/components/DsTable";
export default {
  components: { DsTable },
  data() {
    return {
      tableLoading: false,
      excelIdenForm: {
        fileName: "",
        rowHeadNum: null,
        rowDataNum: null,
      },
      excelIdenFormRules: {
        fileName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.advancedSearch2"),
            trigger: "blur",
          },
        ],
        rowHeadNum: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips20"),
            trigger: "blur",
          },
        ],
        rowDataNum: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips21"),
            trigger: "blur",
          },
        ],
      },
      loaclExcelConfig: { index: true },
      loaclExcelColumns: loaclExcelColumns,
      localExcelData: [],
      systemTableData: [],
      valueType: [
        {
          label: this.$t("h.tips142"),
          value: "String",
        },
        {
          label: this.$t("h.tips143"),
          value: "Double",
        },
        {
          label: this.$t("h.date"),
          value: "Date",
        },
      ],
      initNotNull: [],
      initUnique: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    excelFileBase64: String,
    excelFileName: String,
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
    notNullHeadCheckData() {
      let tempArr = [];
      this.systemTableData.forEach((item) => {
        if (item.notNull) {
          const num = this.localExcelData.filter((localItem) => {
            return item.dbDataName == localItem.dbDataName;
          }).length;
          if (!num) tempArr.push(item);
        }
      });
      return tempArr;
    },
    uniqueHeadCheckData() {
      let tempArr = [];
      this.systemTableData.forEach((item) => {
        if (item.unique) {
          const num = this.localExcelData.filter((localItem) => {
            return item.dbDataName == localItem.dbDataName;
          }).length;
          if (!num) tempArr.push(item);
        }
      });
      return tempArr;
    },
    ...mapState(["userInfo"]),
  },
  watch: {
    excelFileBase64(val) {
      if (val == "") {
        this.localExcelData = [];
        this.$refs["elFormRef"].resetFields();
        this.getUserAssetTableHead();
      }
    },
  },
  methods: {
    ...mapActions(["GET_ASSETFORMHEADER"]),
    dialogVisibleOpened() {
      this.getUserAssetTableHead();
    },
    dialogVisibleClosed() {
      this.localExcelData = [];
      this.systemTableData = [];
      this.initNotNull = [];
      this.initUnique = [];
      this.$refs["elFormRef"].resetFields();
      this.$emit("dialogVisibleClosed");
    },
    isSystemNotNull(dbDataName) {
      if (
        dbDataName == "assetCode" ||
        dbDataName == "type" ||
        dbDataName == "name" ||
        dbDataName == "inData" ||
        dbDataName == "source" ||
        dbDataName == "goodsName" ||
        dbDataName == "num" ||
        dbDataName == "assertPosition" ||
        !dbDataName
      ) {
        return true;
      }
      return false;
      // let isDisabled = false
      // for (let i = 0; i < this.initNotNull.length; i++) {
      //   if (dbDataName == this.initNotNull[i].dbDataName) {
      //     isDisabled = true
      //     break
      //   }
      // }
      // return isDisabled
    },
    isSystemUnique(dbDataName) {
      if (dbDataName == "assetCode" || !dbDataName) return true;
      return false;
    },
    getUserAssetTableHead() {
      select({
        func: "S0048",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          data.data.item.sort((item1, item2) => item1.sort - item2.sort);
          data.data.item.sort((item1, item2) => item2.notNull - item1.notNull);
          data.data.item.splice(
            data.data.item.findIndex((item) => item.dbDataName == "photo"),
            1
          );
          data.data.item.splice(
            data.data.item.findIndex((item) => item.dbDataName == "file"),
            1
          );
          data.data.item.splice(
            data.data.item.findIndex((item) => item.dbDataName == "state"),
            1
          );
          this.systemTableData = data.data.item.map((item, index) => {
            return {
              _id: index,
              colFmt: "",
              colName: "",
              colType: "",
              dbDataName: item.dbDataName,
              nameShow: item.nameShow,
              dbFmt: item.format,
              notNull: item.notNull,
              rangeEnd: item.rangeEnd,
              rangeSt: item.rangeSt,
              type: item.type,
              unique: item.unique,
              defaultVal: item.defaultVal,
            };
          });
          this.systemTableData.forEach((item) => {
            if (item.dbFmt == null) item.dbFmt = "";
            if (item.rangeSt == null) item.rangeSt = "";
            if (item.rangeEnd == null) item.rangeEnd = "";
            if (item.defaultVal == null) item.defaultVal = "";

            if (item.notNull) this.initNotNull.push(item);
            if (item.unique) this.initUnique.push(item);
          });
          this.systemTableData.push({
            _id: this.systemTableData.length,
            colFmt: "",
            colName: "",
            colType: "",
            dbDataName: "otherData",
            nameShow: this.$t("h.other"),
            dbFmt: "",
            notNull: 0,
            rangeEnd: "",
            rangeSt: "",
            type: "String",
            unique: 0,
            defaultVal: "",
          });
        })
        .catch(() => {
          // "服务器网络错误，请求系统属性字段失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    createTemplateTable() {
      if (!this.excelFileBase64)
        return this.$message.error(this.$t("h.title28"));
      if (!this.excelIdenForm.fileName)
        this.excelIdenForm.fileName = this.excelFileName;
      this.$refs["elFormRef"].validate((valid) => {
        if (!valid) return;
        this.tableLoading = true;
        axios({
          url: "http://127.0.0.1:7788/Service/",
          method: "post",
          params: {
            sendCode: "2",
            param: "1",
          },
          data: {
            inputType: "fileBase64",
            excelFile: this.excelFileBase64.split("base64,")[1],
            fileName: this.excelFileName,
            titleRow: this.excelIdenForm.rowHeadNum,
            dataRow: this.excelIdenForm.rowDataNum,
          },
        })
          .then(({ data }) => {
            this.tableLoading = false;
            if (data.code != 0)
              return this.$message.error(
                `${this.$t("h.tips144")}:${data.code}`
              );
            const item = JSON.parse(data.message).item;
            this.localExcelData = item.map((item, index) => {
              return {
                _id: index,
                colFmt: item.format,
                colName: item.name,
                colType: item.type,
                dbDataName: "",
                dbFmt: "",
                defaultVal: "",
                nameShow: "",
                notNull: null,
                rangeEnd: null,
                rangeSt: null,
                type: "",
                unique: null,
                systemId: null,
              };
            });
          })
          .catch(() => {
            this.tableLoading = false;
            this.$message.error(this.$t("h.tips145"));
          });
      });
    },
    //搞定
    onSelectChange(val, row) {
      // 点击删除
      if (val === "") {
        this.localExcelData[row._id].dbDataName = "";
        this.localExcelData[row._id].dbFmt = "";
        this.localExcelData[row._id].defaultVal = "";
        this.localExcelData[row._id].nameShow = "";
        this.localExcelData[row._id].notNull = null;
        this.localExcelData[row._id].rangeEnd = null;
        this.localExcelData[row._id].rangeSt = null;
        this.localExcelData[row._id].type = "";
        this.localExcelData[row._id].unique = null;
        this.localExcelData[row._id].systemId = null; //
        return;
      }
      // 检测重复选择
      const repeatNum = this.localExcelData.filter(
        (item) => item.systemId == val
      ).length;
      if (repeatNum > 1) {
        this.localExcelData[row._id].systemId = null;
        return this.$message.error(`${row.dbDataName}${this.$t("h.tips146")}`);
      }
      this.localExcelData[row._id].dbDataName =
        this.systemTableData[val].dbDataName;
      this.localExcelData[row._id].dbFmt = this.systemTableData[val].dbFmt;
      this.localExcelData[row._id].defaultVal =
        this.systemTableData[val].defaultVal;
      this.localExcelData[row._id].nameShow =
        this.systemTableData[val].nameShow;
      this.localExcelData[row._id].notNull = this.systemTableData[val].notNull;
      this.localExcelData[row._id].rangeEnd =
        this.systemTableData[val].rangeEnd;
      this.localExcelData[row._id].rangeSt = this.systemTableData[val].rangeSt;
      this.localExcelData[row._id].type = this.systemTableData[val].type;
      this.localExcelData[row._id].unique = this.systemTableData[val].unique;
    },
    onUniqueChange(val, row) {
      // 选择唯一值需要检测唯一值是否超过两个
      if (val) {
        let selectUniqueNum = this.uniqueHeadCheckData.length;
        this.localExcelData.forEach((item) => {
          if (item.unique) selectUniqueNum += 1;
        });
        if (selectUniqueNum > 2) {
          this.localExcelData[row._id].unique = 0;
          return this.$message.error(this.$t("h.tips147"));
        }
      }
      // 唯一则必填
      if (val) {
        this.localExcelData[row._id].defaultVal = "";
        this.localExcelData[row._id].notNull = 1;
      }
      if (!val) {
        this.localExcelData[row._id].defaultVal =
          this.systemTableData[row.systemId].defaultVal;
        this.localExcelData[row._id].notNull =
          this.systemTableData[row.systemId].notNull;
      }
    },
    onDefaultValChange(val, row) {
      const rangeSt = row.rangeSt;
      const rangeEnd = row.rangeEnd;
      if (row.type == "String") {
        if (rangeSt && val.length < rangeSt) {
          this.localExcelData[row._id].defaultVal = null;
          return this.$message.error(`${this.$t("h.tips148")}${rangeSt}`);
        }
        if (rangeEnd && val.length > rangeEnd) {
          this.localExcelData[row._id].defaultVal = null;
          return this.$message.error(`${this.$t("h.tips149")}${rangeEnd}`);
        }
        // if (val == '') this.systemTableData[row.value._id].defaultVal = null
        // else this.systemTableData[row.value._id].defaultVal = val
      }
      if (row.type == "Double") {
        const isNumber = Number(val);
        if (isNumber != 0 && !isNumber) {
          this.localExcelData[row._id].defaultVal = null;
          return this.$message.error(this.$t("h.tips3") + this.$t("h.tips150"));
        }
        if (rangeSt && Number(val) < Number(rangeSt)) {
          this.localExcelData[row._id].defaultVal = null;
          return this.$message.error(`${this.$t("h.tips148")}${rangeSt}`);
        }
        if (rangeEnd && Number(val) > Number(rangeEnd)) {
          this.localExcelData[row._id].defaultVal = null;
          return this.$message.error(`${this.$t("h.tips149")}${rangeEnd}`);
        }
        // if (val == '') this.systemTableData[row.value._id].defaultVal = null
        // else this.systemTableData[row.value._id].defaultVal = Number(val)
      }
    },
    submitTemplate() {
      const loadingInstance = this.$loading({ target: ".el-dialog" });
      if (this.notNullHeadCheckData.length) {
        loadingInstance.close();
        return this.$message.error(this.$t("h.tips151"));
      }
      let submitKey = deepCopy(
        this.localExcelData.filter((item) => item.dbDataName)
      );

      submitKey.forEach((item) => {
        delete item.nameShow;
        delete item._id;
        delete item.systemId;
      });
      update({
        func: "U0052",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          permissonId: 77,
          fig: true,
          infoType: 3,
          colRow: this.excelIdenForm.rowHeadNum,
          valRow: this.excelIdenForm.rowDataNum,
          name: this.excelIdenForm.fileName,
          item: submitKey,
        },
      })
        .then(({ data }) => {
          loadingInstance.close();
          if (data.code != 0) return this.$message.error(data.data);
          else {
            this.$message.success(data.data);
            this.dialogVisible = false;
            this.$emit("updateExcelInfo");
            this.GET_ASSETFORMHEADER();
          }
        })
        .catch(() => {
          loadingInstance.close();
          // "服务器网络错误，提交导入模板失败"
          return this.$message.error(this.$t("h.tips18"));
        });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 10px 0 15px 0;
    width: 100%;
    height: calc(100% - 54px);
    box-sizing: border-box;
  }
  .title_left {
    span {
      margin-left: 25px;
      font-size: 18px;
    }
  }
  .dialog_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    width: 100%;
    height: 54px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
  }
  .dialog_body {
    margin: 0 auto;
    padding: 15px;
    width: 1200px;
    height: 100%;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }
}
::v-deep .file_info {
  margin: 10px 0 20px 0;
  .el-form-item {
    width: 100%;
  }
  .el-form-item__content {
    width: calc(100% - 210px);
  }
  .file {
    display: flex;
    align-items: center;
    height: 154px;
    span {
      margin-right: 10px;
    }
  }
}
.notNllAndUnqiue {
  & > span {
    margin-right: 10px;
  }
}
.edit-table {
  height: calc(100% - 272px);
}
.tag_box {
  max-width: 300px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .el-tag {
    margin-right: 10px;
    margin-top: 5px;
  }
}
</style>
