<template>
  <el-dialog
    top="0"
    custom-class="dialog"
    :show-close="false"
    :visible.sync="dialogVisible"
    @opened="dialogVisibleOpened"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <span>{{ $t("h.title150") + $t("h.asset") }}</span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="dialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body">
      <div class="sku-tree">
        <div class="title">
          <span>{{ $t("h.assetCategory") }}</span>
        </div>
        <div class="content">
          <el-tree
            v-loading="treeLoading"
            ref="typeTree"
            node-key="_id"
            highlight-current
            :expand-on-click-node="false"
            :data="assetTypes"
            :props="typeProps"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }">
              <span class="icon">
                <template v-if="data.children == null">
                  <svg-icon
                    class="childIcon"
                    icon-file-name="childGb"
                    v-if="(data.hierarchy || '').split('|')[0] == 'G'"
                  ></svg-icon>
                  <svg-icon
                    class="childIcon"
                    icon-file-name="childQb"
                    v-else
                  ></svg-icon>
                </template>
                <template v-else>
                  <svg-icon
                    class="parentIcon"
                    icon-file-name="gb"
                    v-if="data.hierarchy.split('|')[0] == 'G'"
                  ></svg-icon>
                  <svg-icon
                    class="parentIcon"
                    icon-file-name="qb"
                    v-else
                  ></svg-icon>
                </template>
              </span>
              <span class="text" style="font-size: 14px">
                {{ data.code + "-" + node.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="sku-table">
        <div class="btns">
          <el-button size="small" type="primary">{{
            $t("h.newBtn")
          }}</el-button>
          <el-button size="small" type="primary" @click="showALlSku">{{
            $t("h.showAllItems")
          }}</el-button>
        </div>
        <div class="filter">
          <el-button class="advanced-filter-btn" type="text" size="small">{{
            $t("h.advancedBtn")
          }}</el-button>
        </div>
        <div class="table">
          <ds-table
            ref="assetTableRef"
            :loading="tableLoading"
            :tableData="assets"
            :columns="assetsColumns"
            :tableConfig="assetsConfig"
            :rowKey="(row) => row.id"
            onlyKey="id"
            @handleSelectionChange="handleSelectionChange"
          >
            <template slot="operation">
              <el-button type="text" size="small">{{
                $t("h.changeBtn")
              }}</el-button>
              <el-button type="text" size="small">{{
                $t("h.delBtn")
              }}</el-button>
            </template>
          </ds-table>
        </div>
        <div class="pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getAssets"
          ></ds-pagination>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">{{
        $t("h.cancelBtn")
      }}</el-button>
      <el-button size="small" type="primary" @click="save">{{
        $t("h.confirmBtn")
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { select } from "@/assets/api";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { assetsColumns } from "@/utils/systemData";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
export default {
  components: {
    DsTable,
    DsPagination,
  },
  data() {
    return {
      treeLoading: false,
      typeProps: {
        value: "_id",
        label: "classifyName",
        children: "children",
      },
      assetTypes: [],
      tableLoading: false,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      assetsColumns: assetsColumns,
      assetsConfig: {
        selection: true,
        reserveSelection: true,
      },
      filtetClassId: "",
      assets: [],
      selectAssets: [],
    };
  },
  props: {
    skuDialogVisible: {
      type: Boolean,
      default: false,
    },
    updateSkuSelectState: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    dialogVisible: {
      get() {
        return this.skuDialogVisible;
      },
      set(val) {
        this.$emit("update:skuDialogVisible", val);
      },
    },
  },
  methods: {
    // 请求资产分类
    getAssetType() {
      this.treeLoading = true;
      select({
        func: "S0006",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.treeLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.assetTypes = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          this.treeLoading = false;
          // 服务器网络错误，请求资产分类失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 请求资产
    getAssets() {
      this.tableLoading = true;
      select({
        func: "S0060",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          index: this.paginationForm.currentPage,
          page: this.paginationForm.pageSize,
          assetClassifyId: this.filtetClassId,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.assets = data.data[1];
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    handleNodeClick(data) {
      this.filtetClassId = data._id;
      this.paginationForm.currentPage = 1;
      this.getAssets();
    },
    showALlSku() {
      this.filtetClassId = "";
      this.$refs.typeTree.setCurrentKey(null);
      this.paginationForm.currentPage = 1;
      this.getAssets();
    },
    handleSelectionChange(val) {
      this.selectAssets = val;
    },
    dialogVisibleOpened() {
      this.$refs.assetTableRef.$refs.dsTableRef.clearSelection();
      this.updateSkuSelectState.forEach((item) => {
        let skuItem = this.assets.find((el) => el.id == item.proId);
        this.$refs.assetTableRef.$refs.dsTableRef.toggleRowSelection(
          skuItem,
          true
        );
      });
      this.getAssetType();
      this.getAssets();
    },
    save() {
      this.$emit("save", this.selectAssets);
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
  height: calc(100% - 100px);
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
    padding: 14px 14px 0 14px;
    height: calc(100% - 98px);
    box-sizing: border-box;
  }
  .el-dialog__footer {
    padding: 14px 14px 14px;
  }
}
.dialog-body {
  display: flex;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  .sku-tree {
    width: 25%;
    box-sizing: border-box;
    border-right: 1px solid #eee;
    .title {
      margin-bottom: 10px;
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      font-weight: bold;
      color: #588ab9;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
    }
    .content {
      height: calc(100% - 58px);
      overflow: hidden;
      box-sizing: border-box;
    }
    .content:hover {
      overflow: auto;
    }
    .parentIcon {
      font-size: 20px;
    }
    .childIcon {
      font-size: 20px;
    }
  }
  .sku-table {
    padding: 0 10px;
    width: 75%;
    box-sizing: border-box;
    overflow: auto;
    .btns {
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    .filter {
      display: flex;
      justify-content: flex-end;
      height: 35px;
      .advanced-filter-btn {
        margin-left: 5px;
      }
    }
    .table {
      height: calc(100% - 123px);
    }
    .pagination {
      height: 40px;
    }
  }
}
</style>
