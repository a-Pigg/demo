<template>
  <div>
    <el-dialog
      top="0"
      custom-class="dialog"
      :show-close="false"
      :visible.sync="dialogVisible"
      @opened="dialogVisibleOpened"
      @closed="dialogVisibleClosed"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.assetHistoryDetails") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="dialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <div class="detail-filter">
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
        <div class="detail-table">
          <ds-table
            :loading="tableLoading"
            :tableData="assetHistoryDetail"
            :columns="columns"
          ></ds-table>
        </div>
        <div class="detail-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getAssetHistoryDetail"
          >
          </ds-pagination>
        </div>
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
        <el-form-item :label="$t('h.advancedSearch5')" prop="userName">
          <!-- <el-select
            v-model="filterForm.userName"
            placeholder="请选择操作员"
            collapse-tags
            multiple
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
              {{ item.deptName }} - {{ item.code }} - {{ item.name }}
            </el-option>
          </el-select> -->
          <el-select
            v-model="filterForm.userName"
            :placeholder="$t('h.tips4') + $t('h.advancedSearch1')"
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
      total: 0,
      paginationForm: {
        pageSize: 20,
        currentPage: 1,
      },
      tableLoading: false,
      columns: assetHistoryColumns,
      assetHistoryDetail: [],
      filterDrawerVisible: false,
      filterForm: {
        date: [],
        type: [],
        userName: [],
      },
      highFilterTags: [],
      staffData: [],
      historyTypeData: historyTypeData,
    };
  },
  props: {
    historyDialogVisible: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    dialogVisible: {
      get() {
        return this.historyDialogVisible;
      },
      set(val) {
        this.$emit("update:historyDialogVisible", val);
      },
    },
  },
  methods: {
    getAssetHistoryDetail() {
      this.tableLoading = true;
      if (this.filterForm.date == null) this.filterForm.date = [];
      select({
        func: "S0046",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          assetCode: this.code,
          type: this.filterForm.type.join(","),
          date: this.filterForm.date.join(","),
          userName: this.filterForm.userName.join(","),
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          data.data[1].forEach((item) => {
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
          this.assetHistoryDetail = data.data[1];
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    dialogVisibleOpened() {
      this.getAssetHistoryDetail();
    },
    dialogVisibleClosed() {
      this.assetHistoryDetail = [];
      this.highFilterTags = [];
      this.filterForm.date = [];
      this.filterForm.type = [];
      this.filterForm.userName = [];
      this.paginationForm.currentPage = 1;
      this.paginationForm.pageSize = 20;
      this.total = 0;
      this.$emit("closed");
    },
    staffRemoteMethod(query) {
      if (!query) {
        this.staffData = [];
        return false;
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
          if (data.code) return this.$message.error(data.data);
          this.staffData = data.data;
        })
        .catch(() => {
          // "服务器网络错误，查询操作人失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    mapHighFilterTags() {
      this.highFilterTags = [];
      for (let key in this.filterForm) {
        if (this.filterForm[key] && this.filterForm[key].length) {
          if (key == "date") {
            let highFilteritem = {};
            highFilteritem.name = this.$t("h.processingDate");
            highFilteritem.keyStr = key;
            highFilteritem.value = this.filterForm[key].join(this.$t("h.to"));
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
      this.getAssetHistoryDetail();
    },
    submitFilterForm() {
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAssetHistoryDetail();
    },
    resetFilterForm() {
      this.$refs["filterFormRef"].resetFields();
      this.filterDrawerVisible = false;
      this.mapHighFilterTags();
      this.paginationForm.currentPage = 1;
      this.getAssetHistoryDetail();
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
  }
}
.detail-filter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 35px;
  .advanced-filter-btn {
    margin-right: 15px;
  }
}
.detail-table {
  height: calc(100% - 75px);
}
.detail-pagination {
  height: 40px;
}
</style>
