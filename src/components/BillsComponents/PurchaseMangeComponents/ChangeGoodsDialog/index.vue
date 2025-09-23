<template>
  <el-dialog
    top="0"
    custom-class="changeGoodsDialog"
    :show-close="false"
    :visible.sync="dialogVisible"
    @opened="dialogVisibleOpened"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <span>{{ $t("h.title150") }} {{ $t("h.formTips46") }}</span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="dialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body">
      <div class="change-goods-filter">
        <el-button class="advanced-filter-btn" type="text" size="small">{{
          $t("h.advancedBtn")
        }}</el-button>
      </div>
      <div class="change-goods-table">
        <ds-table
          ref="billsTableRef"
          :loading="loading"
          :tableData="requstBills"
          :columns="requstBillsColumns"
          :tableConfig="requstBillsConfig"
          :rowKey="(row) => row.id"
          @handleSelectionChange="handleSelectionChange"
        >
          <template slot="select" slot-scope="{ scope }">
            <el-button type="text" @click="purchasingSelect(scope.row)">{{
              $t("h.title150")
            }}</el-button>
          </template>
          <div slot="expand" slot-scope="{ scope }" class="detail-table">
            <ds-table
              :tableData="scope.row.details"
              :tableConfig="detailsConfig"
              :columns="detailColumns"
            ></ds-table>
          </div>
        </ds-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <ds-pagination
        small
        :total="total"
        :page.sync="paginationForm.currentPage"
        :limit.sync="paginationForm.pageSize"
        @pagination="getRequstBills"
      ></ds-pagination>
      <div class="btns">
        <el-button size="mini" @click="dialogVisible = false">{{
          $t("h.cancelBtn")
        }}</el-button>
        <el-button type="primary" size="mini" @click="save">{{
          $t("h.confirmBtn")
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { requstDetailColumns } from "@/utils/systemData";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import { select } from "@/assets/api";
export default {
  components: {
    DsTable,
    DsPagination,
  },
  data() {
    return {
      loading: false,
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      requstBills: [],
      selectRequstBills: [],
      detailColumns: requstDetailColumns,
      detailsConfig: {
        index: true,
      },
    };
  },
  props: {
    changeDialogVisible: {
      type: Boolean,
      default: false,
    },
    requstBillsConfig: {
      type: Object,
      default: () => {},
    },
    requstBillsColumns: {
      type: Array,
      default: () => [],
    },
    updateRequstSelectState: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    dialogVisible: {
      get() {
        return this.changeDialogVisible;
      },
      set(val) {
        this.$emit("update:changeDialogVisible", val);
      },
    },
  },
  methods: {
    getRequstBills() {
      this.loading = true;
      select({
        func: "S0062",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.requstBills = data.data[1];
          this.requstBills.forEach((item) => {
            let goodDetails = [];
            item.details.forEach((el) => {
              goodDetails.push(el.skuName);
            });
            item.goodDetails = goodDetails.join("/");
          });
        })
        .catch(() => {
          this.loading = false;
          // 服务器网络错误，请求采购申请单据失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    purchasingSelect(row) {
      this.$emit("select", row);
    },
    save() {
      this.$emit("save", this.selectRequstBills);
    },
    handleSelectionChange(val) {
      this.selectRequstBills = val;
    },
    dialogVisibleOpened() {
      this.$refs.billsTableRef.$refs.dsTableRef.clearSelection();
      this.updateRequstSelectState.forEach((item) => {
        let requstItem = this.requstBills.find(
          (el) => el.id == item.purchasingId
        );
        this.$refs.billsTableRef.$refs.dsTableRef.toggleRowSelection(
          requstItem,
          true
        );
      });
      this.getRequstBills();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .changeGoodsDialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: calc(100% - 60px);
  height: calc(100% - 60px);
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
    padding: 0 14px 0 14px;
    height: calc(100% - 76px);
    box-sizing: border-box;
  }
  .dialog-body {
    height: 100%;
  }
  .el-dialog__footer {
    padding: 0;
    height: 40px;
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;
    height: 100%;
    box-sizing: border-box;
  }
}
.change-goods-filter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 35px;
  .advanced-filter-btn {
    margin-right: 15px;
  }
}
.change-goods-table {
  height: calc(100% - 35px);
}
.detail-table {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}
</style>
