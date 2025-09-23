<template>
  <div>
    <el-dialog
      top="0"
      custom-class="dialog"
      :show-close="false"
      :visible.sync="dialogVisible"
      @closed="dialogVisibleClosed"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.assetDetails") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="dialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body" v-if="detailDialogVisible">
        <el-tabs
          tab-position="left"
          style="height: 100%"
          @tab-click="handleClick"
        >
          <el-tab-pane :label="$t('h.basicInformation')">
            <div class="tab-pane-titel">
              <span>{{ $t("h.basicInformation") }}</span>
            </div>
            <div class="tab-pane-content">
              <el-row :gutter="20">
                <el-col :span="3" class="col-title">{{
                  deteilLabels.type
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.type || ""
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.assetCode
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.assetCode
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.name
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.name
                }}</el-col>

                <el-col :span="3" class="col-title">{{
                  deteilLabels.groudName
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.groudName
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.model
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.model
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.snNumber
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.snNumber
                }}</el-col>

                <el-col :span="3" class="col-title">{{
                  deteilLabels.unit
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.unit
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.inData
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.inData
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.source
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.source
                }}</el-col>

                <el-col :span="3" class="col-title">{{
                  deteilLabels.num
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.num
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.goodsName
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.goodsName
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.assertPosition
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.assertPosition
                }}</el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.supplierInformation')">
            <div class="tab-pane-titel">
              <span>{{ $t("h.supplierInformation") }}</span>
            </div>
            <div class="tab-pane-content">
              <el-row :gutter="20">
                <el-col :span="3" class="col-title">{{
                  deteilLabels.producter
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.producter
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.productAddr
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.productAddr
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.supplier
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.supplier
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.supplierPerson
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.supplierPerson
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.supplierPhone
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.supplierPhone
                }}</el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.maintenanceInformation')">
            <div class="tab-pane-titel">
              <span>{{ $t("h.maintenanceInformation") }}</span>
            </div>
            <div class="tab-pane-content">
              <el-row :gutter="20">
                <el-col :span="3" class="col-title">{{
                  deteilLabels.maintainPerson
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.maintainPerson
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.maintainLast
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.maintainLast
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.maintainRemark
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.maintainRemark
                }}</el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.useInformation')">
            <div class="tab-pane-titel">
              <span>{{ $t("h.useInformation") }}</span>
            </div>
            <div class="tab-pane-content">
              <el-row :gutter="20">
                <el-col :span="3" class="col-title">{{
                  deteilLabels.useDate
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.useDate
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.useState
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.useState
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.useType
                }}</el-col>
                <el-col :span="5" class="col-content">
                  {{ assetDetailData.useType }}
                </el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.deptCode
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.deptCode
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.useDept
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.useDept
                }}</el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.responsible
                }}</el-col>
                <el-col :span="5" class="col-content">{{
                  assetDetailData.responsible
                }}</el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.financialInformation')">
            <div class="tab-pane-titel">
              <span>{{ $t("h.financialInformation") }}</span>
            </div>
            <div class="tab-pane-content">
              <el-row :gutter="20">
                <el-col :span="3" class="col-title">{{
                  deteilLabels.money
                }}</el-col>
                <el-col :span="5" class="col-content">
                  {{ assetDetailData.money }}
                </el-col>
                <el-col :span="3" class="col-title">{{
                  deteilLabels.goalQuota
                }}</el-col>
                <el-col :span="5" class="col-content"
                  >{{ assetDetailData.goalQuota * 100 }}%</el-col
                >
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.otherInformation')">
            <div class="tab-pane-titel">
              <span>{{ $t("h.otherInformation") }}</span>
            </div>
            <div class="tab-pane-content">
              <el-row :gutter="20">
                <el-col :span="3" class="pic-title">{{
                  deteilLabels.photo
                }}</el-col>
                <el-col :span="5" class="pic-content">
                  <el-image
                    :src="assetDetailData.photo"
                    :preview-src-list="[assetDetailData.photo]"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                      <span>{{ $t("h.tableTips1") }}</span>
                    </div>
                  </el-image>
                </el-col>
                <el-col :span="16" class="pic-title"></el-col>
                <el-col :span="3" class="bz-title">{{
                  deteilLabels.assertBeizhu
                }}</el-col>
                <el-col :span="21" class="bz-content">
                  <span>{{ assetDetailData.assertBeizhu }}</span>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.attachmentInformation')">
            <div class="tab-pane-titel">
              <span>{{ $t("h.attachmentInformation") }}</span>
            </div>
            <div class="tab-pane-content">
              <ul class="files" v-if="assetDetailData.file">
                <li
                  class="file-item"
                  v-for="(item, index) in assetDetailData.file"
                  :key="index"
                >
                  <i class="el-icon-paperclip"></i>
                  <span class="file-name">{{ item.name }}</span>
                  <div class="icons">
                    <i class="el-icon-download" @click="downloadFile(item)"></i>
                  </div>
                </li>
              </ul>
              <div v-else class="no-file">
                <span>{{ $t("h.tableTips2") }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('h.customInformation')"
            v-if="assetDetailData.jsons"
          >
            <div class="tab-pane-titel">
              <span>{{ $t("h.customInformation") }}</span>
            </div>
            <div class="tab-pane-content">
              <el-row :gutter="20">
                <div v-for="(item, key) in assetDetailData.jsons" :key="key">
                  <el-col :span="3" class="col-title">{{
                    deteilLabels[key]
                  }}</el-col>
                  <el-col :span="5" class="col-content">{{ item }}</el-col>
                </div>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.AssetHistory')">
            <div class="history-filter">
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
            <div class="history-table">
              <ds-table
                :loading="loading"
                :tableData="assetHistoryData"
                :columns="historyColumns"
              ></ds-table>
            </div>
            <div class="history-pagination">
              <ds-pagination
                small
                :total="total"
                :page.sync="paginationForm.currentPage"
                :limit.sync="paginationForm.pageSize"
                @pagination="getAssetHistory"
              >
              </ds-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <ds-filter-drawer
      :filterDrawerVisible.sync="filterDrawerVisible"
      @submitFilterForm="submitFilterForm"
      @resetFilterForm="resetFilterForm"
    >
      <el-form ref="filterFormRef" label-width="100px" :model="filterForm">
        <el-form-item :label="$t('h.processingDate')" prop="date">
          <el-date-picker
            v-model="filterForm.date"
            type="daterange"
            :range-separator="$t('h.to')"
            :start-placeholder="$t('h.startDate')"
            :end-placeholder="$t('h.endDate')"
            value-format="yyyy-MM-dd"
          >
          <!-- format="yyyy 年 MM 月 dd 日" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('h.business')" prop="type">
          <el-select
            v-model="filterForm.type"
            :placeholder="$t('h.tips4') + $t('h.business')"
            collapse-tags
            multiple
            clearable
          >
            <el-option
              v-for="(item, i) in historyTypeData"
              :key="i"
              :label="item.name"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('h.operator')" prop="userId">
          <el-select
            v-model="filterForm.userName"
            :placeholder="$t('h.tips4') + $t('h.operator')"
            multiple
            clearable
            filterable
            allow-create
            :filter-method="() => {}"
            v-load-more="{
              options: staffData,
              modelField: 'name',
              model: filterForm.userName.join(','),
              searchField: 'andLike',
              func: 'S0005',
              userInfo: userInfo,
            }"
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
        </el-form-item>
      </el-form>
    </ds-filter-drawer>
  </div>
</template>
<script>
import { select } from "@/assets/api";
import { mapState } from "vuex";
import { clickDownloadLink } from "@/utils/basic-methods";
import { assetHistoryColumns, historyTypeData } from "@/utils/systemData";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsFilterTag from "@/components/DsFilterTag";
import DsFilterDrawer from "@/components/DsFilterDrawer";
export default {
  components: {
    DsTable,
    DsPagination,
    DsFilterTag,
    DsFilterDrawer,
  },
  data() {
    return {
      historyTypeData: historyTypeData,
      staffData: [],
      assetHistoryData: [],
      historyColumns: assetHistoryColumns,
      loading: false,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      filterDrawerVisible: false,
      filterForm: {
        date: [],
        type: [],
        userName: [],
      },
      highFilterTags: [],
    };
  },
  props: {
    detailDialogVisible: {
      type: Boolean,
      default: false,
    },
    assetDetailData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(["userInfo", "assetFormHeader"]),
    dialogVisible: {
      get() {
        return this.detailDialogVisible;
      },
      set(val) {
        this.$emit("update:detailDialogVisible", val);
      },
    },
    deteilLabels() {
      let obj = {};
      this.assetFormHeader.forEach((item) => {
        obj[item.dbDataName] = item.nameShow;
      });
      return obj;
    },
  },
  methods: {
    dialogVisibleClosed() {
      this.paginationForm.currentPage = 1;
      this.paginationForm.pageSize = 20;
      this.total = 0;
      this.assetHistoryData = [];
      this.highFilterTags = [];
      this.filterForm.type = [];
      this.filterForm.date = [];
      this.filterForm.userName = [];
      this.$emit("closed");
    },
    // 下载附件
    downloadFile(val) {
      clickDownloadLink(val.base64, "_blank", val.name);
    },
    handleClick(tab) {
      if (tab.label == "资产履历") this.getAssetHistory();
    },
    getAssetHistory() {
      this.loading = true;
      if (this.filterForm.date == null) this.filterForm.date = [];
      select({
        func: "S0046",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          assetCode: this.assetDetailData.assetCode,
          type: this.filterForm.type.join(","),
          date: this.filterForm.date.join(","),
          userName: this.filterForm.userName.join(","),
        },
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.assetHistoryData = data.data[1];
          this.assetHistoryData.forEach((item) => {
            let handle = {
              1: this.$t("h.Using"),
              2: this.$t("h.Revert"),
              3: this.$t("h.Borrow"),
              5: this.$t("h.Allocation"),
              6: this.$t("h.Repair"),
              7: this.$t("h.Scrap"),
              8: this.$t("h.Received"),
              9: this.$t("h.Check"),
              10: this.$t("h.assetDeletion"),
              11: this.$t("h.assetModification"),
              12: this.$t("h.Return"),
            };
            item.typeName = handle[item.type];
          });
        })
        .catch(() => {
          this.loading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 高级筛选
    mapHighFilterTags() {
      this.highFilterTags = [];
      for (let key in this.filterForm) {
        if (this.filterForm[key] && this.filterForm[key].length) {
          if (key == "date") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.processingDate");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join("至");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "type") {
            let highFilteritem = {};
            let labels = [];
            this.filterForm[key].forEach((item) => {
              let label = this.historyTypeData.find((typeItem) => {
                return typeItem._id == item;
              }).name;
              labels.push(label);
            });
            highFilteritem.name = this.$t("h.business");
            highFilteritem.keyStr = key;
            highFilteritem.value = labels.join(",");
            this.highFilterTags.push(highFilteritem);
          } else if (key == "userName") {
            let highFilteritem = {};
            // let labels = [];
            // this.$refs.highFilterStaffSelectref.selected.forEach((item) => {
            //   labels.push(item.label);
            // });
            highFilteritem.name = this.$t("h.advancedSearch5");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join(",");
            this.highFilterTags.push(highFilteritem);
          }
        }
      }
    },
    handleCloseFilterTag(val) {
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      this.filterForm[val.keyStr] = [];
      this.paginationForm.currentPage = 1;
      this.getAssetHistory();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAssetHistory();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAssetHistory();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
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
  .el-dialog__body {
    padding: 0;
    height: calc(100% - 36px);
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
  .dialog-body {
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
  }
}
::v-deep .el-tabs__content {
  padding: 8px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  .el-tab-pane {
    height: 100%;
  }
  .image-slot {
    width: 120px;
    height: 120px;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    line-height: 120px;
    text-align: center;
  }
}
.tab-pane-titel {
  position: relative;
  padding: 0 10px;
  font-size: 16px;
}
.tab-pane-titel::before {
  position: absolute;
  top: 4px;
  left: 0px;
  content: "";
  width: 4px;
  height: 16px;
  background-color: #588ab9;
}
.tab-pane-content {
  margin-top: 10px;
  height: calc(100% - 31px);
  .el-row {
    width: calc(100% - 10px);
    height: 100%;
    .el-col {
      margin: 10px 0;
    }
    .col-title {
      height: 40px;
      line-height: 40px;
      color: #588ab9;
    }
    .col-content {
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background-color: #eee;
      border-radius: 6px;
      color: #000;
    }
    .pic-title,
    .bz-title {
      height: 120px;
      color: #588ab9;
    }
    .pic-content {
      height: 120px;
    }
    .bz-content {
      height: 120px;
      background-color: #eee;
      border-radius: 6px;
      color: #000;
    }
    .el-image {
      height: 120px;
    }
  }
}
.files {
  display: flex;
}
.file-item {
  transition: all 0.25s;
  position: relative;
  margin-right: 10px;
  width: 150px;
  height: 150px;
  border: 1px solid #c0ccda;
  border-radius: 8px;
  box-sizing: border-box;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
    .icons {
      opacity: 1;
    }
  }
  .el-icon-paperclip {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 58px;
  }
  .file-name {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
    font-size: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .icons {
    transition: all 0.25s;
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    font-size: 24px;
    color: #fff;
    font-weight: bold;
    z-index: 1;
    .el-icon-download {
      transition: all 0.25s;
      cursor: pointer;
      margin-right: 10px;
    }
    .el-icon-download:hover {
      color: #d84d4e;
    }
  }
}
.no-file {
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border: 1px solid #c0ccda;
  border-radius: 8px;
  box-sizing: border-box;
}
.history-filter {
  display: flex;
  justify-content: flex-end;
  height: 35px;
  .advanced-filter-btn {
    margin-left: 5px;
  }
}
.history-table {
  height: calc(100% - 75px);
}
.history-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
}
</style>
