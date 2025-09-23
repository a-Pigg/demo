<template>
  <div class="edit-table">
    <el-table
      ref="editTableRef"
      v-loading="loading"
      border
      header-cell-class-name="table-header"
      cell-class-name="table-content"
      size="medium"
      height="100%"
      :data="tableData"
    >
      <el-table-column
        type="index"
        align="center"
        :label="$t('h.index')"
      ></el-table-column>
      <el-table-column
        align="center"
        v-for="item in columns"
        :key="item.prop"
        :width="item.width"
      >
        <template slot="header">
          <span :class="item.class">{{ item.label }}</span>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.isSet">
            <!-- 日期 -->
            <el-date-picker
              v-if="
                item.prop == 'inData' ||
                item.prop == 'useDate' ||
                item.prop == 'maintainLast'
              "
              size="mini"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('h.tips4') + item.label"
              v-model="scope.row[item.prop]"
            >
            <!-- format="yyyy 年 MM 月 dd 日" -->
            </el-date-picker>
            <!-- 残值率 -->
            <el-input
              v-else-if="item.prop == 'goalQuota'"
              size="mini"
              v-model="scope.row[item.prop]"
            >
              <span slot="append">%</span>
            </el-input>
            <!-- 选择 -->
            <!-- 选择-放置区域 -->
            <!-- <ds-select-tree
              v-else-if="item.prop == 'assertPosition'"
              placeholder="请选择区域"
              v-model="scope.row.warehouseId"
              :defaultProps="{
                children: 'children',
                label: 'warehouseName',
                value: '_id',
              }"
              :treeData="treeAreas"
              isLastNode
            ></ds-select-tree> -->
            <el-select
              v-else-if="item.prop == 'assertPosition'"
              v-model="scope.row.warehouseId"
              size="mini"
              clearable
              filterable
              :filter-method="() => {}"
              v-load-more="{
                options: wareData,
                modelField: '_id',
                model: scope.row.warehouseId,
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
            <!-- 选择-使用人 -->
            <el-select
              v-else-if="item.prop == 'responsible'"
              v-model="scope.row.responsibleId"
              size="mini"
              clearable
              filterable
              :filter-method="() => {}"
              @change="
                (val) => {
                  staffSelectChange(val, scope.row);
                }
              "
              v-load-more="{
                options: staffData,
                modelField: '_id',
                model: scope.row.responsibleId,
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
            <!-- 选择-来源 -->
            <el-select
              v-else-if="item.prop == 'source'"
              size="mini"
              filterable
              clearable
              v-model="scope.row[item.prop]"
            >
              <el-option
                v-for="(item, index) in sourceData"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- 选择-资产属性 -->
            <el-select
              v-else-if="item.prop == 'goodsName'"
              size="mini"
              filterable
              clearable
              v-model="scope.row.goodsId"
            >
              <el-option
                v-for="item in attrData"
                :key="item._id"
                :label="item.name"
                :value="item.goodsqId"
              ></el-option>
            </el-select>
            <!-- 树状 -->
            <!-- 树状-资产类别 -->
            <ds-select-tree
              v-else-if="item.prop == 'type'"
              v-model="scope.row.classifyId"
              size="mini"
              :treeData="treeAssetTypes"
              :defaultProps="typeDefaultProps"
            ></ds-select-tree>
            <!-- 树状-部门 -->
            <ds-select-tree
              v-else-if="item.prop == 'useDept'"
              v-model="scope.row.deptId"
              size="mini"
              :treeData="treeDepts"
              :defaultProps="deptDefaultProps"
              @input="
                (val) => {
                  deptInput(val, scope.row);
                }
              "
            ></ds-select-tree>
            <!-- 图片 -->
            <upload-table-photo
              v-else-if="item.prop == 'photo'"
              :value.sync="scope.row[item.prop]"
            >
            </upload-table-photo>
            <!-- 附件 -->
            <upload-table-file
              v-else-if="item.prop == 'file'"
              :value.sync="scope.row[item.prop]"
            ></upload-table-file>
            <!-- 直接输入-数量 -->
            <el-input
              v-else-if="item.prop == 'num'"
              disabled
              size="mini"
              v-model="scope.row[item.prop]"
            ></el-input>
            <!-- 直接输入 -->
            <el-input
              :disabled="item.prop == 'assetCode'"
              v-else
              size="mini"
              v-model="scope.row[item.prop]"
            ></el-input>
          </span>
          <!-- 无图片 -->
          <span
            v-else-if="
              !scope.row.isSet &&
              item.prop == 'photo' &&
              scope.row[item.prop] == ''
            "
          >
            {{ $t("h.tableTips1") }}
          </span>
          <!-- 有图片 -->
          <div
            class="table-img"
            v-else-if="
              !scope.row.isSet && item.prop == 'photo' && scope.row[item.prop]
            "
          >
            <img :src="scope.row[item.prop]" alt="" />
          </div>
          <!-- 无附件 -->
          <span
            v-else-if="
              !scope.row.isSet &&
              item.prop == 'file' &&
              scope.row[item.prop] == ''
            "
          >
            {{ $t("h.tableTips2") }}
          </span>
          <!-- 有附件 -->
          <span
            v-else-if="
              !scope.row.isSet && item.prop == 'file' && scope.row[item.prop]
            "
          >
            <el-popover placement="top-start">
              <div v-for="(item, index) in scope.row.file" :key="index">
                <a :href="item.base64" :download="item.name">{{ item.name }}</a>
              </div>
              <el-button slot="reference" size="mini" type="text">{{
                $t("h.viewAttachments")
              }}</el-button>
            </el-popover>
          </span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="90px" fixed="right">
        <!-- <template slot="header">
          <el-button size="mini" type="primary" @click="add">新增</el-button>
        </template> -->
        <template slot="header">
          <span>{{ $t("h.action") }}</span>
        </template>
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.isSet"
            size="mini"
            type="primary"
            @click="edit(scope.row, scope.$index)"
            >{{ $t("h.editBtn") }}</el-button
          >
          <el-button
            v-else
            size="mini"
            type="primary"
            @click="save(scope.row, scope.$index)"
            >{{ $t("h.saveBtn") }}</el-button
          >
          <!-- <el-button
            v-if="!scope.row.isSet"
            size="mini"
            type="primary"
            @click="copy(scope.row, scope.$index)"
            >复制</el-button
          > -->
          <!-- <el-button
            size="mini"
            type="primary"
            @click="handleDelete(scope.row, scope.$index)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
// import { select } from "@/assets/api";
import { mapState } from "vuex";
import { regEx } from "@/utils/regEx";
import UploadTablePhoto from "@/components/BillsComponents/AssetMangeComponents/Received/EditTable/UploadTablePhoto";
import UploadTableFile from "@/components/BillsComponents/AssetMangeComponents/Received/EditTable/UploadTableFile";
import DsSelectTree from "@/components/DsSelectTree";
import { sourceListData } from "@/utils/systemData";
export default {
  components: {
    UploadTablePhoto,
    UploadTableFile,
    DsSelectTree,
  },
  data() {
    return {
      typeDefaultProps: {
        children: "children",
        label: "classifyName",
        value: "_id",
      },
      deptDefaultProps: {
        children: "children",
        label: "deptName",
        value: "_id",
      },
      wareData: [],
      staffData: [],
      sourceData: sourceListData,
    };
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    treeDepts: {
      type: Array,
      default: () => [],
    },
    depts: {
      type: Array,
      default: () => [],
    },
    treeAssetTypes: {
      type: Array,
      default: () => [],
    },
    assetTypes: {
      type: Array,
      default: () => [],
    },
    attrData: {
      type: Array,
      default: () => [],
    },
    // 树状放置区域再启用一下两个属性
    treeAreas: {
      type: Array,
      default: () => [],
    },
    areas: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    tableData: {
      get() {
        return this.data;
      },
      set(val) {
        this.$emit("update:data", val);
      },
    },
    tableRules() {
      let rules = [];
      this.columns.forEach((item) => {
        if (item.class) {
          rules.push(item.prop);
        }
      });
      return rules;
    },
  },
  methods: {
    deptInput(val, row) {
      if (!val) return false;
      let matchStaffData = this.staffData.filter((item) => item.deptId == val);
      if (matchStaffData.length) {
        let matchStaff = matchStaffData.find(
          (item) => item._id == row.responsibleId
        );
        if (!matchStaff) {
          row.responsibleId = "";
          row.responsible = "";
        }
        return;
      } else {
        row.responsible = "";
        row.responsibleId = "";
      }
    },
    staffSelectChange(val, row) {
      if (!val) return false;
      row.useDept = this.staffData.find((item) => item._id == val).deptName;
      row.deptId = this.staffData.find((item) => item._id == val).deptId;
      //   row.useDept =
      //     this.staffData[this.$refs.staffSelectRef[0]._data.hoverIndex].deptName;
    },
    // 编辑
    edit(row) {
      console.log(row);
      row.isSet = true;
      this.$refs.editTableRef.doLayout();
      // this.$set(row, "isSet", true);
    },
    // 保存
    save(row) {
      for (let i = 0; i < this.tableRules.length; i++) {
        if (!row[this.tableRules[i]]) {
          return this.$message.error(this.$t("h.tips23"));
        }
      }
      if (row.goalQuota) {
        if (!regEx.goalQuota.test(row.goalQuota)) {
          return this.$message.error(this.$t("h.tips24"));
        }
      }
      if (row.money) {
        if (!regEx.money.test(row.money)) {
          return this.$message.error(this.$t("h.tips25"));
        }
      }
      if (row.assetCode) {
        let repetitionNum = this.tableData.filter((item) => {
          return item.assetCode == row.assetCode;
        }).length;
        if (repetitionNum > 1) {
          return this.$message.error(this.$t("h.tips26"));
        }
      }
      //   显示
      if (row.warehouseId) {
        row.assertPosition = this.wareData.find(
          (item) => item._id == row.warehouseId
        ).warehouseName;
      }
      if (row.classifyId) {
        row.type = this.assetTypes.find(
          (item) => item._id == row.classifyId
        ).classifyName;
      }
      if (row.responsibleId) {
        row.responsible = this.staffData.find(
          (item) => item._id == row.responsibleId
        ).name;
      }
      if (row.deptId) {
        row.useDept = this.depts.find(
          (item) => item._id == row.deptId
        ).deptName;
      }
      if (row.goodsId) {
        row.goodsName = this.attrData.find(
          (item) => item.goodsqId == row.goodsId
        ).name;
      }
      row.isSet = false;
      this.$refs.editTableRef.doLayout();
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-table {
  height: calc(100vh - 133px);
}
::v-deep .table-header {
  padding: 0;
  height: 41px;
  font-size: 13px;
  color: #000;
  background-color: #f2f6ff !important;
  border-color: #eeeeee;
}
::v-deep .table-content {
  padding: 0;
  height: 42px;
  color: #333;
  font-size: 13px;
  border-color: #eeeeee;
}
.notNull {
  color: #f56c6c;
}
.table-img {
  width: 83px;
  height: 31px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
