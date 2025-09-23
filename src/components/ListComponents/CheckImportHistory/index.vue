<template>
  <div>
    <el-dialog
      top="0"
      custom-class="history-dialog"
      :show-close="false"
      :visible.sync="dialogVisible"
      @opened="getImportHistory"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.title07") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="dialogVisible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <div class="timeLine">
          <el-timeline>
            <el-timeline-item
              v-for="item in importHistoryData"
              :key="item._id"
              :timestamp="item.indata.split(' ')[0]"
              placement="top"
            >
              <el-card>
                <div class="message">
                  <div class="sheet-name">
                    {{ $t("h.importTableName") }}：<span>{{
                      item.fileName
                    }}</span>
                  </div>
                  <div class="name">
                    {{ $t("h.operator") }}：<span>{{ item.userName }}</span>
                  </div>
                  <div class="time">
                    {{ $t("h.operationTime") }}：<span>{{ item.indata }}</span>
                  </div>
                </div>
                <div class="btns">
                  <div>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="lookImportAssets(item.assetids)"
                      >{{ $t("h.viewAssets") }}</el-button
                    >
                  </div>
                  <div>
                    <el-button
                      class="reset-btn"
                      type="danger"
                      size="mini"
                      @click="resetImportAssets(item._id)"
                      >{{ $t("h.unimport") }}</el-button
                    >
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      custom-class="assets-dialog"
      :show-close="false"
      :visible.sync="assetsDialogVibible"
      @closed="assetsDialogVibibleClosed"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.importAssetDetails") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="assetsDialogVibible = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <div class="asset-table">
          <ds-table
            :loading="tableLoading"
            :tableData="importAssetsData"
            :columns="columns"
            :tableConfig="tableConfid"
          ></ds-table>
        </div>
        <div class="asset-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getImportAssets"
          ></ds-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { select, deleteData } from "@/assets/api";
import { mapState } from "vuex";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
export default {
  components: {
    DsTable,
    DsPagination,
  },
  data() {
    return {
      loadingStyle: {
        target: ".timeLine",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      tableLoading: false,
      importHistoryData: [],
      assetsDialogVibible: false,
      importAssetsData: [],
      importAssetIds: "",
      tableConfid: {
        index: true,
      },
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
    };
  },
  props: {
    checkImportDialogVisible: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    dialogVisible: {
      get() {
        return this.checkImportDialogVisible;
      },
      set(val) {
        this.$emit("update:checkImportDialogVisible", val);
      },
    },
  },
  methods: {
    // 请求
    getImportHistory() {
      const LOADING = this.$loading(this.loadingStyle);
      select({
        func: "S0030",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          LOADING.close();
          if (data.code != 0) return this.$message.error(data.data);
          this.importHistoryData = data.data;
        })
        .catch(() => {
          LOADING.close();
          this.$message.error(this.$t("h.tips18"));
        });
    },
    assetsDialogVibibleClosed() {
      this.importAssetIds = "";
      this.importAssetsData = [];
      this.total = 0;
      this.paginationForm.currentPage = 1;
      this.paginationForm.pageSize = 20;
    },
    getImportAssets() {
      this.lookImportAssets(this.importAssetIds);
    },
    // 查看导入资产详情
    lookImportAssets(assetIds) {
      this.assetsDialogVibible = true;
      this.tableLoading = true;
      select({
        func: "S0007",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          // _id: assetIds,
          item: [{ key: "_id", handle: "OIS", value: assetIds }],
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.importAssetIds = assetIds;
          this.total = data.data[0];
          this.importAssetsData = data.data[1];
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 撤销导入资产
    resetImportAssets(_id) {
      const LOADING = this.$loading(this.loadingStyle);
      this.$confirm(this.$t("h.tips37"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          deleteData({
            func: "D0022",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              id: _id,
              permissonId: 24,
            },
          })
            .then(({ data }) => {
              LOADING.close();
              if (data.code != 0) return this.$message.error(data.data);
              this.getImportHistory();
              this.$emit("refreshAssets");
              this.$message.success(this.$t("h.tips38"));
            })
            .catch(() => {
              LOADING.close();
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          LOADING.close();
          this.$message({
            type: "info",
            message: this.$t("h.tips29"),
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .history-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 600px;
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
    padding: 14px;
  }
  .dialog-body {
    padding-right: 5px;
    height: 380px;
    overflow: auto;
  }
}
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
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
    .asset-table {
      height: calc(100% - 40px);
    }
    .asset-pagination {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      height: 40px;
    }
  }
}
::v-deep .el-card__body {
  height: 65px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  .message {
    flex: 1;
    .sheet-name,
    .name,
    .time {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .btns {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
}
::v-deep .el-message-box__message {
  p {
    background: #f50;
  }
}
</style>
