<template>
  <div>
    <el-dialog
      top="0"
      custom-class="assets-dialog"
      :show-close="false"
      :visible.sync="dialogVibible"
      @opened="dialogVibibleOpened"
      @close="dialogVibibleClose"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.title16") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="dialogVibible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <div class="asset-filter">
          <ds-filter-tag
            :filterTagsData="highFilterTags"
            @handleCloseTag="handleCloseFilterTag"
          ></ds-filter-tag>
          <ds-search-btn
            :searchValue.sync="andLike"
            @search="findAssetSearch"
          ></ds-search-btn>
          <el-button
            class="advanced-filter-btn"
            type="text"
            size="small"
            @click="filterDrawerVisible = true"
            >{{ $t("h.advancedBtn") }}</el-button
          >
        </div>
        <div class="asset-table">
          <ds-table
            ref="assetTableRef"
            :loading="loading"
            :tableData="matchBillsAssets"
            :columns="columns"
            :tableConfig="tableConfig"
            :rowKey="(row) => row._id"
            @handleSelectionChange="handleSelectionChange"
          ></ds-table>
        </div>
        <div class="asset-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getMatchBillsAssets"
          ></ds-pagination>
        </div>
        <div class="btns">
          <el-button size="small" @click="dialogVibible = false">{{
            $t("h.cancelBtn")
          }}</el-button>
          <el-button type="primary" size="small" @click="saveSelectAssets">{{
            $t("h.confirmBtn")
          }}</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 筛选抽屉 -->
    <ds-filter-drawer
      :filterDrawerVisible.sync="filterDrawerVisible"
      @submitFilterForm="submitFilterForm"
      @resetFilterForm="resetFilterForm"
    >
      <!-- <el-form ref="filterFormRef" label-width="95px" label-position="left">
        <el-form-item
          v-for="item in filterFormHead"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
        >
          <el-select
            v-if="
              item.prop == 'assetCode' ||
              item.prop == 'name' ||
              item.prop == 'model' ||
              item.prop == 'snNumber' ||
              item.prop == 'unit' ||
              item.prop == 'money'
            "
            v-model="filterForm[item.index].handle"
            style="width: 120px"
            placeholder="请选择条件"
            clearable
            filterable
          >
            <el-option
              v-for="item in filterCondtionData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            style="margin-left: 5px; width: 224px"
            v-if="
              item.prop == 'assetCode' ||
              item.prop == 'name' ||
              item.prop == 'model' ||
              item.prop == 'snNumber' ||
              item.prop == 'unit' ||
              item.prop == 'money'
            "
            v-model="filterForm[item.index].value"
            :placeholder="'请输入' + item.label"
          ></el-input>
          <el-select
            v-if="item.prop == 'source'"
            v-model="filterForm[item.index].value"
            multiple
            placeholder="请选择"
            clearable
            filterable
            collapse-tags
          >
            <el-option
              v-for="item in sourceListData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <ds-select-tree
            v-if="item.prop == 'classifyId'"
            v-model="filterForm[item.index].value"
            placeholder="请选择分类"
            :treeData="assetTypeData"
            :defaultProps="{
              children: 'children',
              label: 'classifyName',
              value: '_id',
            }"
            :collapseTags="true"
            :checkStrictly="true"
            :multiple="true"
          ></ds-select-tree>
          <el-date-picker
            v-if="item.prop == 'inData'"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            v-model="filterForm[item.index].value"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-select
            v-if="item.prop == 'goodsId'"
            v-model="filterForm[item.index].value"
            multiple
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="(item, i) in assetAttrData"
              :key="i"
              :label="item.name"
              :value="item.goodsqId"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop == 'warehouseId'"
            ref="filterWareSelectRef"
            placeholder="请选择"
            v-model="filterForm[item.index].value"
            multiple
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: assetAreaData,
              modelField: '_id',
              searchField: 'andLike',
              func: 'S0003',
              userInfo: userInfo,
            }"
          > -->
      <!-- model: filterForm[item.index].value, -->
      <!-- <el-option
              v-for="item in assetAreaData"
              :key="item._id"
              :label="item.warehouseName"
              :value="item._id"
            >
              <span> {{ item.code }} - {{ item.warehouseName }} </span>
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop == 'staffId'"
            ref="filterStaffIdSelectRef"
            v-model="filterForm[item.index].value"
            placeholder="请选择"
            multiple
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: staffData,
              modelField: '_id',
              searchField: 'andLike',
              func: 'S0005',
              userInfo: userInfo,
            }"
          > -->
      <!-- model: filterForm[item.index].value, -->
      <!-- <el-option
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
      </el-form> -->
      <el-form ref="filterFormRef" label-width="105px" label-position="left">
        <el-form-item
          v-for="item in highFilterArr"
          :key="item.id"
          :label="item.label"
          :prop="item.attr"
        >
          <el-select
            v-if="
              item.attr == 'assetCode' ||
              item.attr == 'name' ||
              item.attr == 'model' ||
              item.attr == 'snNumber' ||
              item.attr == 'unit' ||
              item.attr == 'money' ||
              item.attr == 'printSize'
            "
            v-model="filterForm[item.index].handle"
            style="width: 120px"
            :placeholder="$t('h.tips4') + $t('h.criteria')"
            clearable
            filterable
          >
            <el-option
              v-for="item in filterCondtionData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            style="margin-left: 5px; width: 214px"
            v-if="
              item.attr == 'assetCode' ||
              item.attr == 'name' ||
              item.attr == 'model' ||
              item.attr == 'snNumber' ||
              item.attr == 'unit' ||
              item.attr == 'money' ||
              item.attr == 'printSize'
            "
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips3') + item.label"
          ></el-input>
          <el-select
            v-if="item.attr == 'state'"
            v-model="filterForm[item.index].value"
            multiple
            :placeholder="$t('h.tips4')"
            clearable
            filterable
            collapse-tags
          >
            <el-option
              v-for="item in stateListData"
              :key="item._id"
              :label="item.label"
              :value="item._id"
            ></el-option>
          </el-select>
          <el-select
            v-if="item.attr == 'source'"
            v-model="filterForm[item.index].value"
            multiple
            :placeholder="$t('h.tips4')"
            clearable
            filterable
            collapse-tags
          >
            <el-option
              v-for="item in sourceListData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <ds-select-tree
            v-if="item.attr == 'deptId'"
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips4') + $t('h.department')"
            :treeData="deptTreeData"
            :defaultProps="{
              children: 'children',
              label: 'deptName',
              value: '_id',
            }"
            :checkStrictly="true"
            :multiple="true"
            collapseTags
          >
          </ds-select-tree>
          <ds-select-tree
            v-if="item.attr == 'classifyId'"
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips4') + $t('h.classification')"
            :treeData="assetTypeData"
            :defaultProps="{
              children: 'children',
              label: 'classifyName',
              value: '_id',
            }"
            :collapseTags="true"
            :checkStrictly="true"
            :multiple="true"
          >
          </ds-select-tree>
          <el-date-picker
            v-if="item.attr == 'inData' || item.attr == 'useDate'"
            value-format="yyyy-MM-dd"
            v-model="filterForm[item.index].value"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
            <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
          <el-select
            v-if="item.attr == 'goodsId'"
            v-model="filterForm[item.index].value"
            multiple
            :placeholder="$t('h.tips4')"
            clearable
            filterable
          >
            <el-option
              v-for="(item, i) in assetAttrData"
              :key="i"
              :label="item.name"
              :value="item.goodsqId"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.attr == 'warehouseId'"
            ref="filterWareSelectRef"
            v-model="filterForm[item.index].value"
            multiple
            :placeholder="$t('h.tips4')"
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: assetAreaData,
              modelField: '_id',
              searchField: 'andLike',
              func: 'S0003',
              userInfo: userInfo,
            }"
          >
            <!-- model: filterForm[item.index].value, -->
            <el-option
              v-for="item in assetAreaData"
              :key="item._id"
              :label="item.warehouseName"
              :value="item._id"
            >
              <span>{{ item.code }} - {{ item.warehouseName }}</span>
            </el-option>
          </el-select>
          <el-select
            v-if="item.attr == 'responsibleId' || item.attr == 'staffId'"
            :ref="'filter' + item.attr + 'SelectRef'"
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips4')"
            clearable
            multiple
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: staffData,
              modelField: '_id',
              searchField: 'andLike',
              func: 'S0005',
              userInfo: userInfo,
            }"
          >
            <!-- model: filterForm[item.index].value, -->
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
          <el-input
            v-if="
              item.attr != 'responsibleId' &&
              item.attr != 'staffId' &&
              item.attr != 'deptId' &&
              item.attr != 'classifyId' &&
              item.attr != 'warehouseId' &&
              item.attr != 'inData' &&
              item.attr != 'source' &&
              item.attr != 'state' &&
              item.attr != 'useDate' &&
              item.attr != 'goodsId' &&
              item.attr != 'assetCode' &&
              item.attr != 'name' &&
              item.attr != 'model' &&
              item.attr != 'snNumber' &&
              item.attr != 'unit' &&
              item.attr != 'money' &&
              item.attr != 'printSize'
            "
            v-model="filterForm[item.index].value"
            :placeholder="$t('h.tips3') + item.label"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- <el-popover
        placement="left-end"
        trigger="click"
        slot="set"
        ref="highSetPopverRef"
      >
        <div class="dropdown-menu">
          <span class="title">设置高级筛选列</span>
          <div class="dropdown-menu-item">
            <el-switch
              v-for="item in listFilterSetData"
              :key="item.id"
              :active-text="item.label"
              v-model="item.hightFilter"
              active-color="#78A1C7"
              inactive-color="#C0CCDA"
            ></el-switch>
          </div>
          <div class="btn">
            <el-button
              class="svae-btn"
              type="primary"
              size="small"
              @click="saveHightFilter"
              >保存设置</el-button
            >
          </div>
        </div>
        <el-button
          slot="reference"
          type="text"
          size="small"
          style="margin-right: 10px"
          >设置</el-button
        >
      </el-popover> -->
    </ds-filter-drawer>
  </div>
</template>
<script>
import { select } from "@/assets/api";
import { mapState } from "vuex";
import { countTableHeaderWidth } from "@/utils/basic-methods";
import { filterCondtionData, sourceListData } from "@/utils/systemData";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import DsTable from "@/components/DsTable";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsPagination from "@/components/DsPagination";
import DsSelectTree from "@/components/DsSelectTree";
import DsFilterTag from "@/components/DsFilterTag";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import deepCopy from "@/utils/deepCopy";
export default {
  components: {
    DsTable,
    DsSearchBtn,
    DsFilterTag,
    DsPagination,
    DsSelectTree,
    DsFilterDrawer,
  },
  data() {
    return {
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      andLike: "",
      loading: false,
      // selectLoading: false,
      tableConfig: {
        selection: true,
        reserveSelection: true,
      },
      matchBillsAssets: [],
      selectMatchBillsAssets: [],
      //   高级筛选
      highFilterTags: [],
      filterDrawerVisible: false,
      filterForm: [
        // { key: "staffId", handle: "OIS", value: null },
        // { key: "classifyId", handle: "OIS", value: null },
        // { key: "warehouseId", handle: "OIS", value: null },
        // { key: "inData", handle: "OIS", value: null },
        // { key: "source", handle: "OIS", value: null },
        // { key: "goodsId", handle: "OIS", value: null },
        // { key: "assetCode", handle: "ANDLIKE", value: null },
        // { key: "name", handle: "ANDLIKE", value: null },
        // { key: "model", handle: "ANDLIKE", value: null },
        // { key: "snNumber", handle: "ANDLIKE", value: null },
        // { key: "unit", handle: "ANDLIKE", value: null },
        // { key: "money", handle: "ANDLIKE", value: null },
      ],
      sourceListData: sourceListData,
      assetTypeData: [],
      typeData: [],
      assetAttrData: [],
      assetAreaData: [],
      staffData: [],
      filterCondtionData: filterCondtionData,
      listFilterSetData: [], // 高级筛选列渲染
    };
  },
  props: {
    matchAssetsDialogVisible: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      default: "",
    },
    updateSelectBillAssets: {
      type: Array,
      default: () => [],
    },
    deptData: {
      type: Array,
      default: () => [],
    },
    deptTreeData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState([
      "userInfo",
      "assetTableHeader",
      "assetFormHeader",
      "stateListData",
    ]),
    columns() {
      let columns = [];
      this.assetTableHeader.forEach((item) => {
        if (item.show) {
          if (item.attr == "photo") {
            columns.push({
              type: "image",
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
            });
          } else if (item.attr == "goalQuota") {
            columns.push({
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
              showOverflowTooltip: true,
              formatter: (row) => {
                return row[item.attr] * 100 + "%";
              },
            });
          } else if (item.attr == "file") {
            columns.push({
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
              slotName: "file",
            });
          } else if (item.attr == "assetCode") {
            columns.push({
              type: "detail",
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
              showOverflowTooltip: true,
            });
          } else if (item.attr == "state") {
            columns.push({
              type: "assetState",
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
              formatter: (row) => {
                return this.stateListData.find((e) => {
                  return e._id == row[item.attr];
                }).label;
              },
            });
          } else {
            columns.push({
              prop: item.attr,
              label: item.label,
              fixed: item.fixed,
              width: countTableHeaderWidth(item.label),
              showOverflowTooltip: true,
            });
          }
        }
      });
      columns.push({
        prop: "printSize",
        label: this.$t("h.title57"),
        fixed: "right",
        showOverflowTooltip: true,
        width: countTableHeaderWidth(this.$t("h.title57")),
      });
      return columns;
    },
    filterFormHead() {
      let tempArray = [];
      this.assetFormHeader.forEach((item) => {
        let tempObj = {};
        if (item.dbDataName == "operator") {
          tempObj.prop = "staffId";
          tempObj.label = item.nameShow;
          tempObj.index = 0;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "type") {
          tempObj.prop = "classifyId";
          tempObj.label = item.nameShow;
          tempObj.index = 1;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "assertPosition") {
          tempObj.prop = "warehouseId";
          tempObj.label = item.nameShow;
          tempObj.index = 2;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "inData") {
          tempObj.prop = "inData";
          tempObj.label = item.nameShow;
          tempObj.index = 3;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "source") {
          tempObj.prop = "source";
          tempObj.label = item.nameShow;
          tempObj.index = 4;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "goodsName") {
          tempObj.prop = "goodsId";
          tempObj.label = item.nameShow;
          tempObj.index = 5;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "assetCode") {
          tempObj.prop = "assetCode";
          tempObj.label = item.nameShow;
          tempObj.index = 6;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "name") {
          tempObj.prop = "name";
          tempObj.label = item.nameShow;
          tempObj.index = 7;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "model") {
          tempObj.prop = "model";
          tempObj.label = item.nameShow;
          tempObj.index = 8;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "suNumber") {
          tempObj.prop = "snNumber";
          tempObj.label = item.nameShow;
          tempObj.index = 9;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "unit") {
          tempObj.prop = "unit";
          tempObj.label = item.nameShow;
          tempObj.index = 10;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "money") {
          tempObj.prop = "money";
          tempObj.label = item.nameShow;
          tempObj.index = 11;
          tempArray.push(tempObj);
        }
      });
      return tempArray;
    },
    highFilterArr() {
      //form渲染
      let arr = this.listFilterSetData.filter((e) => {
        return e.hightFilter;
      });
      this.filterForm = [];
      arr.forEach((e, index) => {
        e.index = index;
        // 状态 类别 购入日期 来源方式 放置区域 资产属性 使用日期 使用人 操办人 使用部门
        if (
          e.attr == "state" ||
          e.attr == "classifyId" ||
          // e.attr == "inData" ||
          e.attr == "source" ||
          e.attr == "warehouseId" ||
          e.attr == "goodsId" ||
          // e.attr == "useDate" ||
          e.attr == "responsibleId" ||
          e.attr == "staffId" ||
          e.attr == "deptId"
          // e.attr == "money"
        ) {
          this.filterForm.push({
            key: e.attr,
            handle: "OIS",
            value: null,
          });
        } else if (
          e.attr == "assetCode" ||
          e.attr == "name" ||
          e.attr == "model" ||
          e.attr == "snNumber" ||
          e.attr == "unit" ||
          e.attr == "money" ||
          e.attr == "printSize"
        ) {
          this.filterForm.push({
            key: e.attr,
            handle: "IS",
            value: null,
          });
        } else if (e.attr.length == 32) {
          this.filterForm.push({
            key: e.attr,
            handle: "ANDLIKE",
            value: null,
          });
        } else {
          this.filterForm.push({
            key: e.attr,
            handle: "IS",
            value: null,
          });
        }
      });
      return arr;
    },
    dialogVibible: {
      get() {
        return this.matchAssetsDialogVisible;
      },
      set(val) {
        this.$emit("update:matchAssetsDialogVisible", val);
      },
    },
  },
  methods: {
    // 弹框开启
    dialogVibibleOpened() {
      this.$refs.assetTableRef.$refs.dsTableRef.clearSelection();
      this.updateSelectBillAssets.forEach((item) => {
        this.$refs.assetTableRef.$refs.dsTableRef.toggleRowSelection(
          item,
          true
        );
      });
      this.getMatchBillsAssets();
      this.getAssetTypes();
      this.getAssetAttr();
      this.updateHighFilter();
    },
    // 弹框关闭
    dialogVibibleClose() {
      this.filterForm.forEach((e) => {
        e.value = null;
        if (
          e.key == "state" ||
          e.key == "classifyId" ||
          e.key == "source" ||
          e.key == "warehouseId" ||
          e.key == "goodsId" ||
          e.key == "responsibleId" ||
          e.key == "staffId" ||
          e.key == "deptId"
        ) {
          e.handle = "OIS";
        } else if (
          e.key == "assetCode" ||
          e.key == "name" ||
          e.key == "model" ||
          e.key == "snNumber" ||
          e.key == "unit" ||
          e.key == "money" ||
          e.key == "printSize"
        ) {
          e.handle = "IS";
        } else if (e.key.length == 32) {
          e.handle = "ANDLIKE";
        } else {
          e.handle = "IS";
        }
      });
      this.andLike = "";
      this.highFilterTags = [];
      this.paginationForm.currentPage = 1;
      this.matchBillsAssets = [];
      this.selectMatchBillsAssets = [];
    },
    // 选中表格数据
    handleSelectionChange(val) {
      this.selectMatchBillsAssets = val;
    },
    saveSelectAssets() {
      this.$emit("save", this.selectMatchBillsAssets);
    },
    // 获取符合条件的资产
    getMatchBillsAssets() {
      this.loading = true;
      let tempFilterArr = deepCopy(this.filterForm);
      let item = tempFilterArr.filter((e) => {
        let eType = typeof e.value;
        if (eType == "string" && e.value) {
          return e;
        } else if (e.value != null && eType == "object" && e.value.length) {
          return e;
        }
      });
      let dateDel = [];
      let dateAdd = [];
      item.forEach((e) => {
        if (e.key.length == 32) {
          e.key = "jsons." + e.key;
        }
        if (
          typeof e.value == "object" &&
          e.key != "inData" &&
          e.key != "maintainLast" &&
          e.key != "useDate"
        ) {
          e.value = e.value.join(",");
        }
        if (
          e.key == "inData" ||
          e.key == "maintainLast" ||
          e.key == "useDate"
        ) {
          dateAdd.push({
            handle: "ANDGTE",
            key: e.key,
            value: e.value[0],
          });
          dateAdd.push({
            handle: "ANDLTE",
            key: e.key,
            value: e.value[1],
          });
          dateDel.unshift(index);
        }
      });
      if (dateDel.length) {
        dateDel.forEach((e) => {
          item.splice(e, 1);
        });
        item = [...item, ...dateAdd];
      }
      item.push(
        { key: "state", handle: "OIS", value: this.state },
        { key: "stauss", handle: "OIS", value: 0 }
      );
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          // state: this.state,
          andLike: this.andLike,
          // 高级筛选条件
          item: item,
          // stauss: "0",
        },
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.matchBillsAssets = this.setTableCostomKey(data.data[1]);
        })
        .catch(() => {
          this.loading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 处理表头自定义字段
    setTableCostomKey(array) {
      array.forEach((item) => {
        for (let key in item["jsons"]) {
          item[key] = item["jsons"][key];
        }
        item.company = window.sessionStorage.getItem("loginCompanyName");
      });
      return array;
    },
    getAssetTypes() {
      this.typeLoading = true;
      select({
        func: "S0006",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.typeData = data.data;
          this.assetTypeData = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getAssetAttr() {
      select({
        func: "S0022",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.assetAttrData = data.data;
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 模糊搜索
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getMatchBillsAssets();
    },
    // 搜索获取资产区域
    // wareRemoteMethod(andLike) {
    //   if (!andLike) {
    //     this.assetAreaData = [];
    //     return;
    //   }
    //   select({
    //     func: "S0003",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       andLike: andLike,
    //     },
    //   })
    //     .then(({ data }) => {
    //       if (data.code != 0) return this.$message.error(data.data);
    //       this.assetAreaData = data.data;
    //     })
    //     .catch(() => {
    //       this.$message.error("服务器网络错误，请求失败");
    //     });
    // },
    // 员工搜索框模糊搜索
    // staffRemoteMethod(query) {
    //   if (!query) {
    //     this.staffData = [];
    //     return;
    //   }
    //   this.selectLoading = true;
    //   select({
    //     func: "S0005",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       andLike: query,
    //     },
    //   })
    //     .then(({ data }) => {
    //       this.selectLoading = false;
    //       if (data.code != 0) return this.$message.error(data.data);
    //       this.staffData = data.data;
    //     })
    //     .catch(() => {
    //       this.selectLoading = false;
    //       this.$message.error("服务器网络错误，请求失败");
    //     });
    // },
    // 映射高级筛选字段
    mapHighFilterTags() {
      this.highFilterTags = [];
      let tempFilterArr = deepCopy(this.filterForm);
      let item = tempFilterArr.filter((e) => {
        let eType = typeof e.value;
        if (eType == "string" && e.value) {
          return e;
        } else if (e.value != null && eType == "object" && e.value.length) {
          return e;
        }
      });
      // item.forEach((e) => {
      //   if (e.key == "warehouseId") {
      //     let highFilteritem = {};
      //     let labels = [];
      //     this.$refs.filterWareSelectRef[0].selected.forEach((item) => {
      //       labels.push(item.label);
      //     });
      //     highFilteritem.name = this.assetFormHeader.find(
      //       (item) => item.dbDataName == "assertPosition"
      //     ).nameShow;
      //     highFilteritem.keyStr = e.key;
      //     highFilteritem.value = labels.join(",");
      //     this.highFilterTags.push(highFilteritem);
      //   } else if (e.key == "staffId") {
      //     let highFilteritem = {};
      //     let labels = [];
      //     this.$refs.filterstaffIdSelectRef[0].selected.forEach((item) => {
      //       labels.push(item.label);
      //     });
      //     highFilteritem.name = this.assetFormHeader.find(
      //       (item) => item.dbDataName == "operator"
      //     ).nameShow;
      //     highFilteritem.keyStr = e.key;
      //     highFilteritem.value = labels.join(",");
      //     this.highFilterTags.push(highFilteritem);
      //   } else if (e.key == "source") {
      //     let highFilteritem = {};
      //     highFilteritem.name = this.assetFormHeader.find(
      //       (item) => item.dbDataName == "source"
      //     ).nameShow;
      //     highFilteritem.keyStr = e.key;
      //     highFilteritem.value = e.value.join(",");
      //     this.highFilterTags.push(highFilteritem);
      //   } else if (e.key == "goodsId") {
      //     let highFilteritem = {};
      //     let labels = [];
      //     e.value.forEach((item) => {
      //       let goodName = this.assetAttrData.find((goodItem) => {
      //         return goodItem.goodsqId == item;
      //       }).name;
      //       labels.push(goodName);
      //     });
      //     highFilteritem.name = this.assetFormHeader.find(
      //       (item) => item.dbDataName == "goodsName"
      //     ).nameShow;
      //     highFilteritem.keyStr = e.key;
      //     highFilteritem.value = labels.join(",");
      //     this.highFilterTags.push(highFilteritem);
      //   } else if (e.key == "classifyId") {
      //     let highFilteritem = {};
      //     let labels = [];
      //     e.value.forEach((item) => {
      //       let typeName = this.typeData.find((typeItem) => {
      //         return typeItem._id == item;
      //       }).classifyName;
      //       labels.push(typeName);
      //     });
      //     highFilteritem.name = this.assetFormHeader.find(
      //       (item) => item.dbDataName == "type"
      //     ).nameShow;
      //     highFilteritem.keyStr = e.key;
      //     highFilteritem.value = labels.join(",");
      //     this.highFilterTags.push(highFilteritem);
      //   } else if (e.key == "inData") {
      //     let highFilteritem = {};
      //     highFilteritem.name = this.assetFormHeader.find(
      //       (item) => item.dbDataName == "inData"
      //     ).nameShow;
      //     highFilteritem.keyStr = e.key;
      //     highFilteritem.value = e.value.join("至");
      //     this.highFilterTags.push(highFilteritem);
      //   } else {
      //     let highFilteritem = {};
      //     highFilteritem.name = this.assetFormHeader.find(
      //       (item) => item.dbDataName == e.key
      //     ).nameShow;
      //     highFilteritem.keyStr = e.key;
      //     let handle = this.filterCondtionData.find((el) => {
      //       return el.value == e.handle;
      //     }).label;
      //     highFilteritem.value = handle + e.value;
      //     this.highFilterTags.push(highFilteritem);
      //   }
      // });
      item.forEach((e) => {
        if (e.key == "warehouseId") {
          let highFilteritem = {};
          let labels = [];
          this.$refs.filterWareSelectRef[0].selected.forEach((item) => {
            labels.push(item.label);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "assertPosition"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "responsibleId") {
          let highFilteritem = {};
          let labels = [];
          this.$refs.filterresponsibleIdSelectRef[0].selected.forEach(
            (item) => {
              labels.push(item.label);
            }
          );
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "responsible"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "staffId") {
          let highFilteritem = {};
          let labels = [];
          this.$refs.filterstaffIdSelectRef[0].selected.forEach((item) => {
            labels.push(item.label);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "operator"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "deptId") {
          let highFilteritem = {};
          let labels = [];
          e.value.forEach((item) => {
            let deptName = this.deptData.find((deptItem) => {
              return deptItem._id == item;
            }).deptName;
            labels.push(deptName);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "useDept"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "source") {
          let highFilteritem = {};
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "source"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "goodsId") {
          let highFilteritem = {};
          let labels = [];
          e.value.forEach((item) => {
            let goodName = this.assetAttrData.find((goodItem) => {
              return goodItem.goodsqId == item;
            }).name;
            labels.push(goodName);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "goodsName"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "classifyId") {
          let highFilteritem = {};
          let labels = [];
          e.value.forEach((item) => {
            let typeName = this.typeData.find((typeItem) => {
              return typeItem._id == item;
            }).classifyName;
            labels.push(typeName);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "type"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "inData") {
          let highFilteritem = {};
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "inData"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value.join(this.$t("h.to"));
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "useDate") {
          let highFilteritem = {};
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "useDate"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = e.value.join(this.$t("h.to"));
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "state") {
          let highFilteritem = {};
          let labels = [];
          e.value.forEach((item) => {
            let stateName = this.stateListData.find((stateItem) => {
              return stateItem._id == item;
            }).label;
            labels.push(stateName);
          });
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == "state"
          ).nameShow;
          highFilteritem.keyStr = e.key;
          highFilteritem.value = labels.join(",");
          this.highFilterTags.push(highFilteritem);
        } else if (e.key == "printSize") {
          let highFilteritem = {};
          highFilteritem.name = this.$t("h.title57");
          highFilteritem.keyStr = e.key;
          let handle = this.filterCondtionData.find((el) => {
            return el.value == e.handle;
          }).label;
          highFilteritem.value = handle + e.value;
          this.highFilterTags.push(highFilteritem);
        } else {
          let highFilteritem = {};
          highFilteritem.name = this.assetFormHeader.find(
            (item) => item.dbDataName == e.key
          ).nameShow;
          highFilteritem.keyStr = e.key;
          let handle = this.filterCondtionData.find((el) => {
            return el.value == e.handle;
          }).label;
          highFilteritem.value = handle + e.value;
          this.highFilterTags.push(highFilteritem);
        }
      });
    },
    // 筛选
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm.forEach((e) => {
        if (e.key == val.keyStr) e.value = null;
      });
      this.paginationForm.currentPage = 1;
      this.getMatchBillsAssets();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getMatchBillsAssets();
    },
    resetFilterForm() {
      this.filterForm.forEach((e) => {
        e.value = null;
        if (
          e.key == "state" ||
          e.key == "classifyId" ||
          e.key == "source" ||
          e.key == "warehouseId" ||
          e.key == "goodsId" ||
          e.key == "responsibleId" ||
          e.key == "staffId" ||
          e.key == "deptId"
        ) {
          e.handle = "OIS";
        } else if (
          e.key == "assetCode" ||
          e.key == "name" ||
          e.key == "model" ||
          e.key == "snNumber" ||
          e.key == "unit" ||
          e.key == "money" ||
          e.key == "printSize"
        ) {
          e.handle = "IS";
        } else if (e.key.length == 32) {
          e.handle = "ANDLIKE";
        } else {
          e.handle = "IS";
        }
      });
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getMatchBillsAssets();
    },
    // 获取高级筛选列
    updateHighFilter() {
      let highKey =
        sessionStorage.getItem("loginCompanyName") + this.userInfo._id;
      this.listFilterSetData = JSON.parse(localStorage.getItem(highKey));
      let stateIndex = this.listFilterSetData.findIndex(
        (e) => e.attr == "state"
      );
      this.listFilterSetData[stateIndex].hightFilter = false;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .assets-dialog {
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
    padding: 0 14px;
    height: 100%;
    box-sizing: border-box;
    .asset-filter {
      margin: 10px 0;
      display: flex;
      justify-content: flex-end;
      height: 35px;
      .advanced-filter-btn {
        margin-left: 10px;
      }
    }
    .asset-table {
      height: calc(100% - 140px);
    }
    .asset-pagination {
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      height: 40px;
      background: #f2f2f2;
    }
    .btns {
      display: flex;
      justify-content: flex-end;
      margin: 5px 0;
      height: 35px;
    }
  }
}
</style>
