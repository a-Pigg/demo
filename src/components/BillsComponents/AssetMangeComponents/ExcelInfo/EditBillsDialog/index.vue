<template>
  <el-dialog
    fullscreen
    custom-class="edit_dialog"
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
        <span>{{ $t("h.tips152") }}</span>
      </div>
      <div class="title_right">
        <el-button type="primary" size="small" @click="submitEditTemplate">{{
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
          label-width="110px"
          label-position="left"
          :rules="excelIdenFormRules"
          :inline="true"
          :model="excelIdenForm"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item
                :label="$t('h.advancedSearch2') + ':'"
                prop="fileName"
              >
                <el-input v-model="excelIdenForm.fileName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('h.formTips20') + ':'" prop="rowHeadNum">
                <el-input v-model="excelIdenForm.rowHeadNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('h.formTips21') + ':'" prop="rowDataNum">
                <el-input v-model="excelIdenForm.rowDataNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
          :columns="editColumns"
          :tableConfig="editConfig"
          :tableData="editTableData"
        >
          <template slot="system" slot-scope="{ scope }">
            <el-select
              size="mini"
              :placeholder="$t('h.tips4')"
              v-model.lazy="scope.row.dbDataName"
              filterable
              clearable
              @change="(val) => onSelectChange(val, scope.row)"
            >
              <el-option
                v-for="item in systemTableData"
                :key="item._id"
                :label="item.nameShow"
                :value="item.dbDataName"
              ></el-option>
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
              :placeholder="$t('h.tips3') + $t('h.title91')"
              size="mini"
              clearable
              :disabled="scope.row.unique == 1"
            ></el-input>
            <el-date-picker
              :disabled="scope.row.unique == 1"
              v-else-if="scope.row.type == 'Date'"
              v-model="scope.row.defaultVal"
              type="date"
              size="mini"
              style="width: 139px"
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
import DsTable from "@/components/DsTable";
export default {
  components: { DsTable },
  data() {
    return {
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
      tableLoading: false,
      editConfig: { index: true },
      editColumns: loaclExcelColumns,
      editTableData: [],
      systemTableData: [],
      initNotNull: [],
      initUnique: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    templateEditTableData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    ...mapState(["userInfo"]),
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
          const num = this.editTableData.filter((editItem) => {
            return item.dbDataName == editItem.dbDataName;
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
          const num = this.editTableData.filter((editItem) => {
            return item.dbDataName == editItem.dbDataName;
          }).length;
          if (!num) tempArr.push(item);
        }
      });
      return tempArr;
    },
  },
  methods: {
    ...mapActions(["GET_ASSETFORMHEADER"]),
    dialogVisibleOpened() {
      this.getUserAssetTableHead();
      this.editTableData = this.templateEditTableData[0].content.item;
      this.editTableData.forEach((item, index) => (item._id = index));
      this.excelIdenForm.fileName = this.templateEditTableData[0].content.name;
      this.excelIdenForm.rowHeadNum =
        this.templateEditTableData[0].content.colRow;
      this.excelIdenForm.rowDataNum =
        this.templateEditTableData[0].content.valRow;
    },
    dialogVisibleClosed() {
      this.editTableData = [];
      this.systemTableData = [];
      this.initNotNull = [];
      this.initUnique = [];
      this.$refs["elFormRef"].resetFields();
      this.$emit("dialogVisibleClosed");
    },
    onSelectChange(val, row) {
      // // 删除
      if (val === "") {
        this.editTableData[row._id].dbFmt = "";
        this.editTableData[row._id].defaultVal = "";
        this.editTableData[row._id].notNull = null;
        this.editTableData[row._id].rangeEnd = null;
        this.editTableData[row._id].rangeSt = null;
        this.editTableData[row._id].type = "";
        this.editTableData[row._id].unique = null;
        return;
      }
      // 校验是否重复
      let repeatNum = this.editTableData.filter((item) => {
        return item.dbDataName == val;
      }).length;
      if (repeatNum > 1) {
        this.editTableData[row._id].dbDataName = "";
        return this.$message.error(`${this.$t("h.tips146")}`);
      }
      // 赋值

      const selectSystemItem = this.systemTableData.find(
        (item) => item.dbDataName == val
      );
      this.editTableData[row._id].dbDataName = selectSystemItem.dbDataName;
      this.editTableData[row._id].dbFmt = selectSystemItem.dbFmt;
      this.editTableData[row._id].defaultVal = selectSystemItem.defaultVal;
      this.editTableData[row._id].notNull = selectSystemItem.notNull;
      this.editTableData[row._id].rangeEnd = selectSystemItem.rangeEnd;
      this.editTableData[row._id].rangeSt = selectSystemItem.rangeSt;
      this.editTableData[row._id].type = selectSystemItem.type;
      this.editTableData[row._id].unique = selectSystemItem.unique;
    },
    onUniqueChange(val, row) {
      if (val) {
        let selectUniqueNum = this.uniqueHeadCheckData.length;
        this.editTableData.forEach((item) => {
          if (item.unique) selectUniqueNum += 1;
        });
        if (selectUniqueNum > 2) {
          this.editTableData[row._id].unique = 0;
          return this.$message.error(this.$t("h.tips147"));
        }
      }
      if (val) {
        this.editTableData[row._id].defaultVal = "";
        this.editTableData[row._id].notNull = 1;
      }
      if (!val) {
        const selectSystemItem = this.systemTableData.find(
          (item) => item.dbDataName == row.dbDataName
        );
        this.editTableData[row._id].defaultVal = selectSystemItem.defaultVal;
        this.editTableData[row._id].notNull = selectSystemItem.notNull;
      }
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
          this.systemTableData.forEach((item) => {
            if (item.dbFmt == null) item.dbFmt = "";
            if (item.rangeSt == null) item.rangeSt = "";
            if (item.rangeEnd == null) item.rangeEnd = "";
            if (item.defaultVal == null) item.defaultVal = "";
            if (item.notNull) this.initNotNull.push(item);
            if (item.unique) this.initUnique.push(item);
          });
        })
        .catch(() => {
          // "服务器网络错误，请求系统属性字段失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    submitEditTemplate() {
      const loadingInstance = this.$loading({ target: ".edit_dialog" });
      if (this.notNullHeadCheckData.length) {
        loadingInstance.close();
        return this.$message.error(this.$t("h.tips153"));
      }
      if (this.templateEditTableData[0].content.name == "默认模板") {
        loadingInstance.close();
        return this.$message.error(this.$t("h.tips154"));
      }

      this.$refs["elFormRef"].validate((valid) => {
        if (!valid) return;
        let editKey = deepCopy(
          this.editTableData.filter((item) => item.dbDataName)
        );
        editKey.forEach((item) => delete item._id);
        update({
          func: "U0052",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            permissonId: 77,
            fig: false,
            infoType: 3,
            dbSize: this.templateEditTableData[0].content.dbSize,
            colRow: this.excelIdenForm.rowHeadNum,
            valRow: this.excelIdenForm.rowDataNum,
            aname: this.templateEditTableData[0].content.name,
            name: this.excelIdenForm.fileName,
            item: editKey,
          },
        })
          .then(({ data }) => {
            loadingInstance.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.$message.success(data.data);
            this.dialogVisible = false;
            const time = setTimeout(() => {
              clearTimeout(time);
              this.$emit("updateExcelInfo");
              this.GET_ASSETFORMHEADER();
            }, 1000);
          })
          .catch(() => {
            loadingInstance.close();
            // "服务器网络错误，修改导入模板失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .edit_dialog {
  .el-dialog__header {
    padding: 0;
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
  .el-dialog__body {
    padding: 10px 0 15px 0;
    width: 100%;
    height: calc(100% - 54px);
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
    width: calc(100% - 120px);
  }
}
.notNllAndUnqiue {
  & > span {
    margin-right: 10px;
  }
}
.edit-table {
  height: calc(100% - 120px);
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
