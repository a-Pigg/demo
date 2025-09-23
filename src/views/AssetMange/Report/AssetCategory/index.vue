<template>
  <div class="asset-category">
    <el-card class="category-card">
      <div slot="header" class="category-card-header">
        <ds-query-form>
          <ds-query-form-left-panel></ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="getAssetCategoryBills"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="category-card-content">
        <div class="bills-filter">
          <ds-filter-tag
            :filterTagsData="highFilterTags"
            @handleCloseTag="handleCloseFilterTag"
          ></ds-filter-tag>
          <el-button
            class="advanced-filter-btn"
            type="text"
            size="small"
            @click="filterDrawerVisible = true"
            >{{ $t("h.advancedBtn") }}</el-button
          >
        </div>
        <div class="bills-table">
          <ds-table
            :loading="tableLoading"
            :tableConfig="{}"
            :columns="billsColums"
            :tableData="assetCategoryBills"
            :rowKey="(row) => row._id"
            :treeProps="{ children: 'children' }"
          ></ds-table>
        </div>
        <div class="bills-num">
          <div class="sum">
            <span>{{ $t("h.totalAssets") }}：</span>
            <span>{{ assetSum }}</span>
          </div>
          <div class="money">
            <span>{{ $t("h.totalAmount") }}：</span>
            <span>{{ assetMoney }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 高级筛选 -->
    <ds-filter-drawer
      :filterDrawerVisible.sync="filterDrawerVisible"
      @submitFilterForm="submitFilterForm"
      @resetFilterForm="resetFilterForm"
    >
      <el-form
        ref="filterFormRef"
        label-width="140px"
        label-position="center"
        :model="filterForm"
      >
        <el-form-item
          v-for="item in filterFormHead"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
        >
          <el-select
            v-if="item.prop == 'state'"
            v-model="filterForm.state"
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
          <ds-select-tree
            v-if="item.prop == 'deptId'"
            v-model="filterForm.deptId"
            :placeholder="$t('h.tips4') + $t('h.department')"
            :treeData="treeDepts"
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
            v-if="item.prop == 'classifyId'"
            v-model="filterForm.classifyId"
            :placeholder="$t('h.tips4') + $t('h.classification')"
            :treeData="treeAssetTypes"
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
          <!-- <el-select
            v-if="item.prop == 'warehouseId'"
            ref="filterWareSelectRef"
            v-model="filterForm.warehouseId"
            multiple
            placeholder="请选择"
            clearable
            filterable
            remote
            :remote-method="wareRemoteMethod"
          >
            <el-option
              v-for="item in assetAreaData"
              :key="item._id"
              :label="item.warehouseName"
              :value="item._id"
            >
              <span>{{ item.code }} - {{ item.warehouseName }}</span>
            </el-option>
          </el-select> -->
          <el-select
            v-if="item.prop == 'warehouseId'"
            ref="filterWareSelectRef"
            :placeholder="$t('h.tips4')"
            v-model="filterForm.warehouseId"
            multiple
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: assetAreaData,
              modelField: '_id',
              model: filterForm.warehouseId.join(','),
              searchField: 'andLike',
              func: 'S0003',
              userInfo: userInfo,
            }"
          >
            <el-option
              v-for="item in assetAreaData"
              :key="item._id"
              :label="item.warehouseName"
              :value="item._id"
            >
              <span> {{ item.code }} - {{ item.warehouseName }} </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ds-filter-drawer>
  </div>
</template>
<script>
import DsSelectTree from "@/components/DsSelectTree";
import DsTable from "@/components/DsTable";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsFilterTag from "@/components/DsFilterTag";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { mapState } from "vuex";
import { countTableHeaderWidth } from "@/utils/basic-methods";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { select } from "@/assets/api";
export default {
  components: {
    DsSelectTree,
    DsTable,
    DsFilterDrawer,
    DsFilterTag,
    DsSearchBtn,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      tableLoading: false,
      assetCategoryBills: [],
      assetSum: 0,
      assetMoney: 0,
      filterDrawerVisible: false,
      highFilterTags: [],
      depts: [],
      treeDepts: [],
      assetTypes: [],
      treeAssetTypes: [],
      assetAreaData: [],
      filterForm: {
        state: [],
        classifyId: [],
        warehouseId: [],
        deptId: [],
      },
      andLike: "",
    };
  },
  computed: {
    ...mapState([
      "userInfo",
      "assetTableHeader",
      "assetFormHeader",
      "stateListData",
    ]),
    filterFormHead() {
      let tempArray = [];
      this.assetFormHeader.forEach((item) => {
        let tempObj = {};
        if (item.dbDataName == "useDept") {
          tempObj.prop = "deptId";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "type") {
          tempObj.prop = "classifyId";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "assertPosition") {
          tempObj.prop = "warehouseId";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "state") {
          tempObj.prop = "state";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        }
      });
      return tempArray;
    },
    billsColums() {
      let columns = [];
      this.assetTableHeader.forEach((item) => {
        if (item.attr == "type") {
          columns.push({
            type: "expand",
            prop: "classifyName",
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (item.attr == "money") {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        }
      });
      columns.push({
        prop: "count",
        label: this.$t("h.totalAssets"),
        fixed: false,
        minWidth: countTableHeaderWidth(this.$t("h.totalAssets")),
        showOverflowTooltip: true,
      });
      return columns;
    },
  },
  methods: {
    // 获取部门
    getDepts() {
      select({
        func: "S0004",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.depts = data.data;
          this.treeDepts = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          // "服务器网络异常，查询部门失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getAssetType() {
      select({
        func: "S0006",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.treeAssetTypes = transListDataToTreeData(data.data, null);
          this.assetTypes = data.data;
        })
        .catch(() => {
          // "服务器网络异常，查询资产类别失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    getAssetCategoryBills() {
      this.tableLoading = true;
      select({
        func: "S0044",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          state: this.filterForm.state.join(","),
          classifyId: this.filterForm.classifyId.join(","),
          warehouseId: this.filterForm.warehouseId.join(","),
          deptId: this.filterForm.deptId.join(","),
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) {
            this.assetCategoryBills = [];
            return this.$message.error(data.data);
          }
          this.assetSum = data.data[0];
          this.assetMoney = data.data[1];
          this.assetCategoryBills = transListDataToTreeData(data.data[2], null);
        })
        .catch(() => {
          this.tableLoading = false;
          this.assetCategoryBills = [];
          // "服务器网络错误，获取列表数据失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // wareRemoteMethod(query) {
    //   if (!query) {
    //     this.assetAreaData = [];
    //     return;
    //   }
    //   select({
    //     func: "S0003",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       andLike: query,
    //     },
    //   })
    //     .then(({ data }) => {
    //       if (data.code != 0) return this.$message.error(data.data);
    //       this.assetAreaData = data.data;
    //     })
    //     .catch(() => {
    //       this.$message.error("服务器网络错误，查询放置区域失败");
    //     });
    // },
    // 映射高级筛选字段
    mapHighFilterTags() {
      this.highFilterTags = [];
      for (let key in this.filterForm) {
        if (this.filterForm[key] && this.filterForm[key].length) {
          if (key == "warehouseId") {
            let highFilteritem = {};
            let labels = [];
            this.$refs.filterWareSelectRef[0].selected.forEach((item) => {
              labels.push(item.label);
            });
            highFilteritem.name = this.assetFormHeader.find(
              (item) => item.dbDataName == "assertPosition"
            ).nameShow;
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "deptId") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let deptName = this.depts.find((deptItem) => {
                return deptItem._id == item;
              }).deptName;
              labels.push(deptName);
            });
            highFilteritem.name = this.assetFormHeader.find(
              (item) => item.dbDataName == "useDept"
            ).nameShow;
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "classifyId") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let typeName = this.assetTypes.find((typeItem) => {
                return typeItem._id == item;
              }).classifyName;
              labels.push(typeName);
            });
            highFilteritem.name = this.assetFormHeader.find(
              (item) => item.dbDataName == "type"
            ).nameShow;
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "state") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let stateName = this.stateListData.find((stateItem) => {
                return stateItem._id == item;
              }).label;
              labels.push(stateName);
            });
            highFilteritem.name = this.assetFormHeader.find(
              (item) => item.dbDataName == "state"
            ).nameShow;
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          }
        }
      }
    },
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm[val.keyStr] = [];
      this.getAssetCategoryBills();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.getAssetCategoryBills();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.getAssetCategoryBills();
    },
  },
  created() {
    this.getAssetCategoryBills();
    this.getDepts();
    this.getAssetType();
  },
};
</script>
<style lang="scss" scoped>
.asset-category {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .category-card {
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
.category-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.category-card-content {
  height: 100%;
  .bills-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .bills-table {
    height: calc(100% - 75px);
  }
  .bills-num {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
    .sum {
      padding-right: 10px;
      font-size: 14px;
      font-weight: bold;
    }
    .money {
      padding: 0 10px;
      border-left: 1px solid #ccc;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
