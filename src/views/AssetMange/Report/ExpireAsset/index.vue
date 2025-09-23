<template>
  <div class="expire-asset">
    <el-card class="expire-card">
      <div slot="header" class="expire-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-checkbox
              size="medium"
              v-model="inChecked"
              :false-label="1"
              :true-label="0"
              @change="getExpireBills"
              >{{ $t("h.includesPreviouslyExpiredAssets") }}</el-checkbox
            >
            <el-date-picker
              size="small"
              value-format="yyyy-MM"
              v-model="date"
              type="month"
              :placeholder="$t('h.tips4') + $t('h.tips134')"
              :clearable="false"
              @change="getExpireBills"
            >
            <!-- format="yyyy 年 MM 月" -->
            </el-date-picker>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="getExpireBills"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="expire-card-content">
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
            :tableData="
              expireBills.slice(
                (paginationForm.currentPage - 1) * paginationForm.pageSize,
                paginationForm.currentPage * paginationForm.pageSize
              )
            "
            :rowKey="(row) => row._id"
            @checkTableRowDetail="checkTableRowDetail"
          >
            <template slot="file" slot-scope="{ scope }">
              <el-popover
                v-if="scope.row.file != null && scope.row.file.length != 0"
                placement="top-start"
              >
                <div
                  class="file_download"
                  v-for="(item, index) in scope.row.file"
                  :key="index"
                >
                  <a :href="item.base64" :download="item.name">{{
                    item.name
                  }}</a>
                </div>
                <el-button slot="reference" size="mini" type="text">{{
                  $t("h.viewAttachments")
                }}</el-button>
              </el-popover>
              <span v-else>{{ $t("h.tableTips2") }}</span>
            </template>
          </ds-table>
        </div>
        <div class="bills-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
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
          <el-select
            v-if="item.prop == 'warehouseId'"
            ref="filterWareSelectRef"
            v-model="filterForm.warehouseId"
            multiple
            :placeholder="$t('h.tips4')"
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
              <span>{{ item.code }} - {{ item.warehouseName }}</span>
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop == 'responsibleId' || item.prop == 'staffId'"
            :ref="'filter' + item.prop + 'SelectRef'"
            v-model="filterForm[item.prop]"
            :placeholder="$t('h.tips4')"
            clearable
            multiple
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
    <!-- 查看详情 -->
    <asset-detail-dialog
      :detailDialogVisible.sync="detailDialogVisible"
      :assetDetailData="assetDetailData"
    ></asset-detail-dialog>
  </div>
</template>
<script>
import DsSelectTree from "@/components/DsSelectTree";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsFilterTag from "@/components/DsFilterTag";
import DsSearchBtn from "@/components/DsSearchBtn";
import AssetDetailDialog from "@/components/ListComponents/AssetDetailDialog";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { mapState } from "vuex";
import { countTableHeaderWidth } from "@/utils/basic-methods";
import { sourceListData } from "@/utils/systemData";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { select } from "@/assets/api";
export default {
  components: {
    DsSelectTree,
    DsTable,
    DsPagination,
    DsFilterDrawer,
    DsFilterTag,
    DsSearchBtn,
    AssetDetailDialog,
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
      expireBills: [],
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
        source: [],
        goodsId: [],
        warehouseId: [],
        deptId: [],
        staffId: [],
        responsibleId: [],
        inData: [],
        useDate: [],
      },
      andLike: "",
      date: "",
      inChecked: 0,
      detailDialogVisible: false,
      assetDetailData: null,
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
          // "网络异常，查询部门失败"
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
    getExpireBills() {
      this.tableLoading = true;
      select({
        func: "S0056",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          in: this.inChecked,
          date: this.date,
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
          this.total = data.data.length;
          this.expireBills = data.data;
        })
        .catch(() => {
          this.tableLoading = false;
          // "服务器网络错误，获取到期资产表失败"
          return this.$message.error(this.$t("h.tips18"));
        });
    },
    checkTableRowDetail(val) {
      this.assetDetailData = val;
      this.detailDialogVisible = true;
    },
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
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm[val.keyStr] = [];
      this.paginationForm.currentPage = 1;
      this.getExpireBills();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getExpireBills();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getExpireBills();
    },
  },
  created() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    this.date = year + "-" + month;
    this.getExpireBills();
    this.getDepts();
    this.getAssetAttr();
    this.getAssetType();
  },
};
</script>
<style lang="scss" scoped>
.expire-asset {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .expire-card {
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
.expire-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  .el-checkbox {
    margin-right: 30px;
  }
}
.expire-card-content {
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
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
  }
}
</style>
