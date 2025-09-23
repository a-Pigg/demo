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
            <el-select
              v-else-if="item.prop == 'assertPosition'"
              v-model="scope.row[item.prop]"
              size="mini"
              clearable
              filterable
              remote
              :remote-method="wareRemoteMethod"
            >
              <el-option
                v-for="item in wareData"
                :key="item._id"
                :label="item.warehouseName"
                :value="item.warehouseName"
              >
                <span> {{ item.code }} - {{ item.warehouseName }} </span>
              </el-option>
            </el-select>
            <!-- 选择-使用人 -->
            <el-select
              v-else-if="item.prop == 'responsible'"
              v-model="scope.row[item.prop]"
              ref="staffSelectRef"
              size="mini"
              placeholder="$t('h.tips4')"
              clearable
              filterable
              remote
              :remote-method="staffRemoteMethod"
              @change="staffSelectChange($event, scope.row)"
            >
              <el-option
                v-for="item in staffData"
                :key="item._id"
                :label="item.name"
                :value="item.name"
              >
                <span
                  >{{ item.name + "(" + item.code + ")" }} -{{
                    item.deptName
                  }}</span
                >
              </el-option>
            </el-select>
            <!-- <el-select
              v-else-if="item.prop == 'responsible'"
              size="mini"
              v-model="scope.row[item.prop]"
              placeholder="请选择"
              clearable
              filterable
              :filter-method="() => {}"
              @change="staffSelectChange($event, scope.row)"
              v-load-more="{
                options: staffData,
                modelField: '_id',
                model: scope.row[item.prop],
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
            </el-select> -->
            <!-- 选择-操办人 -->
            <el-select
              disabled
              v-else-if="item.prop == 'operator'"
              v-model="scope.row[item.prop]"
              size="mini"
              placeholder="$t('h.tips4')"
              clearable
              filterable
              remote
              :remote-method="staffRemoteMethod"
            >
              <el-option
                v-for="item in staffData"
                :key="item._id"
                :label="item.name"
                :value="item.name"
              >
                <span
                  >{{ item.name + "(" + item.code + ")" }} -{{
                    item.deptName
                  }}</span
                >
              </el-option>
            </el-select>
            <!-- <el-select
              disabled
              v-else-if="item.prop == 'operator'"
              size="mini"
              v-model="scope.row[item.prop]"
              placeholder="请选择"
              clearable
              filterable
              :filter-method="() => {}"
              v-load-more="{
                options: staffData,
                modelField: '_id',
                model: scope.row[item.prop],
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
            </el-select> -->
            <!-- 树状 -->
            <!-- 树状-资产类别 -->
            <edit-select-tree
              v-else-if="item.prop == 'type'"
              :value.sync="scope.row[item.prop]"
              :data="assetTypes"
              :defaultProps="typeDefaultProps"
            ></edit-select-tree>
            <!-- 树状-部门 -->
            <edit-select-tree
              v-else-if="item.prop == 'useDept'"
              :value.sync="scope.row[item.prop]"
              :data="depts"
              :defaultProps="deptDefaultProps"
              @input="
                (val) => {
                  deptInput(val, scope.row);
                }
              "
            ></edit-select-tree>
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
      <el-table-column align="center" width="250px" fixed="right">
        <template slot="header">
          <el-button size="mini" type="primary" @click="add">{{
            $t("h.newBtn")
          }}</el-button>
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
          <el-button
            v-if="!scope.row.isSet"
            size="mini"
            type="primary"
            @click="copy(scope.row, scope.$index)"
            >{{ $t("h.copy") }}</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleDelete(scope.row, scope.$index)"
            >{{ $t("h.delBtn") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { select } from "@/assets/api";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { mapState } from "vuex";
import { regEx } from "@/utils/regEx";
import UploadTablePhoto from "./UploadTablePhoto";
import UploadTableFile from "./UploadTableFile";
import EditSelectTree from "./EditSelectTree";
export default {
  components: {
    UploadTablePhoto,
    UploadTableFile,
    EditSelectTree,
  },
  data() {
    return {
      assetTypes: [],
      typeDefaultProps: {
        children: "children",
        label: "classifyName",
        value: "classifyName",
      },
      deptDefaultProps: {
        children: "children",
        label: "deptName",
        value: "deptName",
      },
      wareData: [],
      staffData: [],
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
    depts: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["userInfo", "assetFormHeader"]),
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
    getAssetTypes() {
      select({
        func: "S0006",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.assetTypes = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    wareRemoteMethod(query) {
      if (!query) {
        this.wareData = [];
        return;
      }
      select({
        func: "S0003",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          andLike: query,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.wareData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    staffRemoteMethod(query) {
      if (!query) {
        this.staffData = [];
        return;
      }
      select({
        func: "S0005",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          andLike: query,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.staffData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    deptInput(val, row) {
      if (!val) return false;
      let matchStaffData = this.staffData.filter(
        (item) => item.deptName == val
      );
      if (matchStaffData.length) {
        let matchStaff = matchStaffData.find(
          (item) => item.name == row.responsible
        );
        if (!matchStaff) row.responsible = "";
        return;
      } else {
        row.responsible = "";
      }
    },
    staffSelectChange(val, row) {
      if (!val) return false;
      row.useDept =
        this.staffData[this.$refs.staffSelectRef[0]._data.hoverIndex].deptName;
    },
    // 新增
    add() {
      let row = {
        isSet: true,
      };
      this.columns.forEach((item) => {
        if (item.prop == "num") {
          row[item.prop] = 1;
        } else if (item.prop == "file") {
          row[item.prop] = [];
        } else if (item.prop == "operator") {
          row[item.prop] = this.userInfo.staffName;
        } else {
          row[item.prop] = "";
        }
      });
      this.tableData.push(row);
    },
    // 编辑
    edit(row) {
      console.log(row);
      row.isSet = true;
      this.$refs.editTableRef.doLayout();
      // this.$set(row, "isSet", true);
    },
    // 删除
    handleDelete(row, index) {
      this.tableData.splice(index, 1);
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
      row.isSet = false;
      this.$refs.editTableRef.doLayout();
    },
    copy(row) {
      let copyRow = JSON.parse(JSON.stringify(row));
      copyRow.isSet = true;
      this.tableData.push(copyRow);
    },
  },
  created() {
    this.getAssetTypes();
  },
};
</script>
<style lang="scss" scoped>
.edit-table {
  height: 100%;
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
