<template>
  <div class="sku">
    <el-card class="sku-card">
      <div class="sku-card-content">
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
            <el-button size="small" type="primary" @click="newSku">{{
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
              :loading="tableLoading"
              :tableData="assets"
              :columns="assetsColumns"
              :tableConfig="assetsConfig"
              :rowKey="(row) => row.id"
              onlyKey="id"
            >
              <template slot="operation" slot-scope="{ scope }">
                <el-button
                  type="text"
                  size="small"
                  @click="editSkuForm(scope.row)"
                  >{{ $t("h.changeBtn") }}</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="deleteSku(scope.row.id)"
                  >{{ $t("h.delBtn") }}</el-button
                >
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
    </el-card>
    <new-bills-dialog
      class="new-dialog"
      :newBillsDialogVisible.sync="newDialogVisible"
      :title="dialogTitle"
      @sbumitForm="sbumitSkuForm"
      @close="newDialogVisibleClosed"
      @opened="newDialogVisibleOpened"
    >
      <template slot="form">
        <el-form
          ref="skuFormRef"
          label-width="120px"
          :model="skuForm"
          :rules="skuFormRules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('h.assetCategory')"
                prop="assetClassifyId"
              >
                <ds-select-tree
                  :disabled="dialogTitle == $t('h.title156')"
                  :placeholder="$t('h.tips4') + $t('h.assetCategory')"
                  v-model="skuForm.assetClassifyId"
                  :defaultProps="typeProps"
                  :treeData="assetTypes"
                >
                </ds-select-tree>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.assetName')" prop="assetTemplateName">
                <el-input v-model="skuForm.assetTemplateName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.columns27')" prop="specification">
                <el-input v-model="skuForm.specification"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.columns28')" prop="measureUnit">
                <el-input v-model="skuForm.measureUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.creationDate')" prop="createdDate">
                <!-- format="yyyy 年 MM 月 dd 日" -->
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  type="date"
                  :placeholder="$t('h.tips4') + $t('h.creationDate')"
                  v-model="skuForm.createdDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.originalValue')" prop="amount">
                <el-input-number
                  v-model="skuForm.amount"
                  :precision="2"
                  :step="1"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </new-bills-dialog>
  </div>
</template>
<script>
import { select, update } from "@/assets/api";
import { mapState } from "vuex";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { assetsColumns } from "@/utils/systemData";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsSelectTree from "@/components/DsSelectTree";
export default {
  components: {
    DsTable,
    DsPagination,
    DsSelectTree,
    NewBillsDialog,
  },
  data() {
    return {
      treeLoading: false,
      assetTypes: [],
      typeProps: {
        value: "_id",
        label: "classifyName",
        children: "children",
      },
      filtetClassId: "",
      tableLoading: false,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      assets: [],
      assetsColumns: assetsColumns,
      assetsConfig: {
        selection: false,
        reserveSelection: false,
      },
      newDialogVisible: false,
      dialogTitle: this.$t("h.title157"),
      dialogLoading: {
        target: ".new-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      skuForm: {
        id: null,
        amount: 0,
        assetTemplateName: "",
        assetClassifyId: "",
        createdDate: "",
        measureUnit: "",
        specification: "",
      },
      skuFormRules: {
        assetTemplateName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.assetName"),
            trigger: "blur",
          },
        ],
        assetClassifyId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.assetCategory"),
            trigger: "change",
          },
        ],
        createdDate: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.creationDate"),
            trigger: "change",
          },
        ],
        specification: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.columns27"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
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
          console.log(data);
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 点击分类列表
    handleNodeClick(data) {
      this.skuForm.assetClassifyId = data._id;
      this.filtetClassId = data._id;
      this.paginationForm.currentPage = 1;
      this.getAssets();
    },
    // 确认添加/修改
    sbumitSkuForm() {
      this.$refs.skuFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        update({
          func: "U0065",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            id: this.skuForm.id,
            amount: this.skuForm.amount,
            assetTemplateName: this.skuForm.assetTemplateName,
            assetClassifyId: this.skuForm.assetClassifyId,
            createdDate: this.skuForm.createdDate,
            measureUnit: this.skuForm.measureUnit,
            specification: this.skuForm.specification,
            permissonId: 26,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newDialogVisible = false;
            this.paginationForm.currentPage = 1;
            this.getAssets();
          })
          .catch(() => {
            LOADING.close();
            // 服务器网络错误，新增/编辑单据失败
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // 新建
    newSku() {
      this.dialogTitle = this.$t("h.title157");
      this.newDialogVisible = true;
    },
    // 显示全部
    showALlSku() {
      this.filtetClassId = "";
      this.$refs.typeTree.setCurrentKey(null);
      this.paginationForm.currentPage = 1;
      this.getAssets();
    },
    // 编辑
    editSkuForm(data) {
      this.skuForm.id = data.id;
      this.skuForm.amount = data.amount;
      this.skuForm.assetTemplateName = data.assetTemplateName;
      this.skuForm.assetClassifyId = data.assetClassifyId;
      this.skuForm.createdDate = data.createdDate;
      this.skuForm.measureUnit = data.measureUnit;
      this.skuForm.specification = data.specification;
      this.dialogTitle = this.$t("h.title156");
      this.newDialogVisible = true;
    },
    // 删除
    deleteSku(id) {},
    newDialogVisibleOpened() {
      this.$refs.skuFormRef.clearValidate();
    },
    // 关闭弹框回调函数
    newDialogVisibleClosed() {
      this.skuForm.id = null;
      this.skuForm.amount = 0;
      this.skuForm.assetTemplateName = "";
      this.skuForm.assetClassifyId = "";
      this.skuForm.createdDate = "";
      this.skuForm.measureUnit = "";
      this.skuForm.specification = "";
    },
  },
  created() {
    this.getAssetType();
    this.getAssets();
  },
};
</script>
<style lang="scss" scoped>
.sku {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .sku-card {
    padding: 15px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    ::v-deep .el-card__body {
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }
}
.sku-card-content {
  display: flex;
  width: 100%;
  height: 100%;
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
