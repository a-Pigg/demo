<template>
  <div class="asset-statement">
    <el-card class="statement-card">
      <div slot="header" class="statement-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <span class="num"
              >{{ $t("h.grossOriginalValue") }}：{{ statData.money || 0 }}</span
            >
            <span class="num"
              >{{ $t("h.currentDiscount") }}：{{
                statData.depreciationMoney || 0
              }}</span
            >
            <span class="num"
              >{{ $t("h.cumulativeDiscount") }}：{{
                statData.accuDepreciation || 0
              }}</span
            >
            <span class="num"
              >{{ $t("h.netValue") }}：{{ statData.netValue || 0 }}</span
            >
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="findAssetSearch"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="statement-card-content">
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
            :tableConfig="billsTableConfig"
            :columns="billsColums"
            :tableData="assetStatementBills"
            :rowKey="(row) => row._id"
            @checkTableRowDetail="checkTableRowDetail"
          ></ds-table>
        </div>
        <div class="bills-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getAssetStatementBills"
          ></ds-pagination>
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
          <el-select
            v-if="item.prop == 'source'"
            v-model="filterForm.source"
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
            v-if="item.prop == 'deptId'"
            v-model="filterForm.deptId"
            :placeholder="$t('h.tips4')+$t('h.department')"
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
            :placeholder="$t('h.tips4')+$t('h.classification')"
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
          <el-date-picker
            v-if="item.prop == 'inData' || item.prop == 'useDate'"
            value-format="yyyy-MM-dd"
            v-model="filterForm[item.prop]"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
          >
          <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
          <el-select
            v-if="item.prop == 'goodsId'"
            v-model="filterForm.goodsId"
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
          <!-- <el-select
            v-if="item.prop == 'responsibleId' || item.prop == 'staffId'"
            :ref="'filter' + item.prop + 'SelectRef'"
            v-model="filterForm[item.prop]"
            placeholder="请选择"
            multiple
            filterable
            remote
            :remote-method="staffRemoteMethod"
            :loading="selectLoading"
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
            v-if="item.prop == 'responsibleId' || item.prop == 'staffId'"
            :ref="'filter' + item.prop + 'SelectRef'"
            v-model="filterForm[item.prop]"
            :placeholder="$t('h.tips4')"
            multiple
            clearable
            filterable
            :filter-method="() => {}"
            v-load-more="{
              options: staffData,
              modelField: '_id',
              model: filterForm[item.prop].join(','),
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
      </el-form>
    </ds-filter-drawer>
    <asset-detail-dialog
      :detailDialogVisible.sync="detailDialogVisible"
      :assetDetailData="assetDetailData"
    ></asset-detail-dialog>
  </div>
</template>
<script>
import DsSelectTree from "@/components/DsSelectTree";
import AssetDetailDialog from "@/components/ListComponents/AssetDetailDialog";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsFilterTag from "@/components/DsFilterTag";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { select } from "@/assets/api";
import { mapState } from "vuex";
import {
  keepTwoDeciamllFull,
  countTableHeaderWidth,
} from "@/utils/basic-methods";
import { filterCondtionData, sourceListData } from "@/utils/systemData";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
export default {
  components: {
    DsSelectTree,
    AssetDetailDialog,
    DsTable,
    DsPagination,
    DsFilterDrawer,
    DsFilterTag,
    DsSearchBtn,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      tableLoading: false,
      billsTableConfig: {},
      assetStatementBills: [],
      statData: {},
      filterDrawerVisible: false,
      highFilterTags: [],
      sourceListData: sourceListData,
      assetAttrData: [],
      depts: [],
      treeDepts: [],
      assetTypes: [],
      treeAssetTypes: [],
      selectLoading: false,
      staffData: [],
      assetAreaData: [],
      filterForm: {
        state: [],
        classifyId: [],
        goodsId: [],
        warehouseId: [],
        deptId: [],
        staffId: [],
        responsibleId: [],
        inData: [],
        useDate: [],
      },
      andLike: "",
      detailDialogVisible: false,
      assetDetailData: null,
      filterCondtionData: filterCondtionData,
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
        if (item.dbDataName == "responsible") {
          tempObj.prop = "responsibleId";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "operator") {
          tempObj.prop = "staffId";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "useDept") {
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
        } else if (item.dbDataName == "inData") {
          tempObj.prop = "inData";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "source") {
          tempObj.prop = "source";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "state") {
          tempObj.prop = "state";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "useDate") {
          tempObj.prop = "useDate";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        } else if (item.dbDataName == "goodsName") {
          tempObj.prop = "goodsId";
          tempObj.label = item.nameShow;
          tempArray.push(tempObj);
        }
      });
      return tempArray;
    },
    billsColums() {
      let columns = [];
      this.assetTableHeader.forEach((item) => {
        if (item.attr == "assetCode") {
          columns.push({
            type: "detail",
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        } else if (
          item.attr == "name" ||
          item.attr == "inData" ||
          item.attr == "money" ||
          item.attr == "depreciationMoney" ||
          item.attr == "accuDepreciation" ||
          item.attr == "netValue" ||
          item.attr == "workLife" ||
          item.attr == "remainLift" ||
          item.attr == "goalQuota"
        ) {
          columns.push({
            prop: item.attr,
            label: item.label,
            fixed: item.fixed,
            minWidth: countTableHeaderWidth(item.label),
            showOverflowTooltip: true,
          });
        }
      });
      return columns;
    },
  },
  methods: {
    getAssetStatementBills() {
      this.tableLoading = true;
      select({
        func: "S0036",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          state: this.filterForm.state.join(","),
          classifyId: this.filterForm.classifyId.join(","),
          goodsId: this.filterForm.goodsId.join(","),
          warehouseId: this.filterForm.warehouseId.join(","),
          deptId: this.filterForm.deptId.join(","),
          staffId: this.filterForm.staffId.join(","),
          responsibleId: this.filterForm.responsibleId.join(","),
          inData: this.filterForm.inData.join(","),
          useDate: this.filterForm.useDate.join(","),
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          if (data.data == this.$t("h.noAssets")) {
            this.total = 0;
            this.assetStatementBills = [];
            return;
          }
          for (let key in data.data[0]) {
            data.data[0][key] = keepTwoDeciamllFull(data.data[0][key]);
          }
          this.statData = data.data[0];
          this.total = data.data[1];
          this.assetStatementBills = data.data[2].map((item) => {
            item.depreciationMoney = keepTwoDeciamllFull(
              item.depreciationMoney
            );
            item.money = keepTwoDeciamllFull(item.money);
            item.accuDepreciation = keepTwoDeciamllFull(item.accuDepreciation);
            item.netValue = keepTwoDeciamllFull(item.netValue);
            item.goalQuota = keepTwoDeciamllFull(item.goalQuota);
            if (item.goalQuota) item.goalQuota = item.goalQuota * 100 + "%";
            return item;
          });
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 查看资产详情
    checkTableRowDetail(val) {
      this.assetDetailData = val;
      this.detailDialogVisible = true;
    },
    // 模糊查询
    findAssetSearch() {
      this.paginationForm.currentPage = 1;
      this.getAssetStatementBills();
    },
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
    // 获取资产属性
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
          // "服务器网络异常，查询资产属性失败"
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
    // staffRemoteMethod(query) {
    //   if (!query) {
    //     this.staffData = [];
    //     return false;
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
    //       this.$message.error("服务器网络错误，查询员工失败");
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
          } else if (key == "responsibleId") {
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
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "staffId") {
            let highFilteritem = {};
            let labels = [];
            this.$refs.filterstaffIdSelectRef[0].selected.forEach((item) => {
              labels.push(item.label);
            });
            highFilteritem.name = this.assetFormHeader.find(
              (item) => item.dbDataName == "operator"
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
          } else if (key == "source") {
            let highFilteritem = {};
            highFilteritem.name = this.assetFormHeader.find(
              (item) => item.dbDataName == "source"
            ).nameShow;
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "goodsId") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let goodName = this.assetAttrData.find((goodItem) => {
                return goodItem.goodsqId == item;
              }).name;
              labels.push(goodName);
            });
            highFilteritem.name = this.assetFormHeader.find(
              (item) => item.dbDataName == "goodsName"
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
          } else if (key == "inData") {
            let highFilteritem = {};
            highFilteritem.name = this.assetFormHeader.find(
              (item) => item.dbDataName == "inData"
            ).nameShow;
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join(this.$t("h.to"));
            this.highFilterTags.push(highFilteritem);
          } else if (key == "useDate") {
            let highFilteritem = {};
            highFilteritem.name = this.assetFormHeader.find(
              (item) => item.dbDataName == "useDate"
            ).nameShow;
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join(this.$t("h.to"));
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
    // 高级筛选点击tag
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm[val.keyStr] = [];
      this.paginationForm.currentPage = 1;
      this.getAssetStatementBills();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAssetStatementBills();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAssetStatementBills();
    },
  },
  created() {
    this.getAssetStatementBills();
    this.getDepts();
    this.getAssetAttr();
    this.getAssetType();
  },
};
</script>
<style lang="scss" scoped>
.asset-statement {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .statement-card {
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
.statement-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  .num {
    margin-right: 20px;
    font-size: 12px;
  }
}
.statement-card-content {
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
  .bills-pagination {
    height: 40px;
  }
}
</style>
