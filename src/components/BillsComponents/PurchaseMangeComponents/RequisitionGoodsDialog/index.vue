<template>
  <el-dialog
    top="0"
    custom-class="requisitionGoodsDialog"
    :show-close="false"
    :visible.sync="dialogVisible"
    destroy-on-close
    @opened="dialogVisibleOpened"
  >
    <div slot="title" class="dialog-header">
      <div class="left">
        <span>{{ $t("h.title150") }} {{ $t("h.title149") }}</span>
      </div>
      <div class="right">
        <i class="el-icon-close" @click="dialogVisible = false"></i>
      </div>
    </div>
    <div class="dialog-body">
      <div class="requst-filter">
        <el-button class="advanced-filter-btn" type="text" size="small"
          >{{$t("h.advancedBtn")}}</el-button
        >
      </div>
      <div class="requst-table">
        <ds-table
          ref="billsTableRef"
          :loading="loading"
          :tableData="requstBills"
          :columns="requstBillsColumns"
          :tableConfig="requstBillsConfig"
          :rowKey="(row) => row.id"
        >
          <div slot="expand" slot-scope="{ scope }" class="detail-table">
            <ds-table
              ref="detailTableRef"
              :tableData="scope.row.details"
              :tableConfig="detailsConfig"
              :columns="detailColumns"
            >
              <template slot="defined-header">
                <el-checkbox
                  v-model="scope.row.selectAll"
                  @change="subtableSelectionChange(scope.row, true)"
                />
              </template>
              <template slot-scope="{ scope: props }" slot="defined-content">
                <el-checkbox
                  v-model="props.row.selected"
                  @change="subtableSelectionChange(scope.row)"
                />
              </template>
            </ds-table>
          </div>
        </ds-table>
      </div>
      <div class="requst-pagination">
        <ds-pagination
          small
          :total="total"
          :page.sync="paginationForm.currentPage"
          :limit.sync="paginationForm.pageSize"
          @pagination="getRequstBills"
        ></ds-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogVisible = false">{{$t("h.cancelBtn")}}</el-button>
      <el-button size="mini" type="primary" @click="saveRequstGoods"
        >{{$t("h.confirmBtn")}}</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { select } from "@/assets/api";
import { mapState } from "vuex";
import {
  requisitionBillsColumns,
  requstDetailColumns,
} from "@/utils/systemData";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
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
        pageSize: 20,
        currentPage: 1,
      },
      requstBillsConfig: {
        expand: true,
        expandName: "",
        expandWidth: "50px",
        expandFixed: false,
        soltName: "expand",
      },
      requstBillsColumns: requisitionBillsColumns,
      requstBills: [],
      detailsConfig: {
        defined: true,
        key: "selectAll",
      },
      detailColumns: requstDetailColumns,
    };
  },
  props: {
    requstDialogVisible: {
      type: Boolean,
      default: false,
    },
    uodateGoodsSelect: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    dialogVisible: {
      get() {
        return this.requstDialogVisible;
      },
      set(val) {
        this.$emit("update:requstDialogVisible", val);
      },
    },
  },
  methods: {
    getRequstBills() {
      this.loading = true;
      select({
        func: "S0059",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          console.log(1);
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          data.data[1].forEach((item) => {
            item.selectAll = false;
            let goodDetails = [];
            item.details.forEach((el) => {
              el.roleRule = item.roleRule;
              el.selected = false;
              goodDetails.push(el.skuName);
            });
            item.goodDetails = goodDetails.join("/");
          });
          if (this.uodateGoodsSelect.length) {
            this.uodateGoodsSelect.forEach((item) => {
              data.data[1].forEach((el) => {
                el.details.forEach((d) => {
                  if (d.id == item.id) {
                    d.selected = true;
                  }
                });
                el.selectAll = el.details.every((d) => d.selected);
              });
            });
          }
          this.requstBills = data.data[1];
        })
        .catch(() => {
          this.loading = false;
          // "服务器网络错误，请求采购申请单据失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    subtableSelectionChange(row, isAll) {
      if (isAll) {
        // 全选
        row.details.forEach((el) => {
          el.selected = row.selectAll;
        });
      } else {
        // 单选
        row.selectAll = row.details.every((el) => el.selected);
      }
    },
    saveRequstGoods() {
      let matchArr = [];
      this.requstBills.forEach((item) => {
        item.details.forEach((el) => {
          if (el.selected) matchArr.push(el);
        });
      });
      this.$emit("save", matchArr);
    },
    dialogVisibleOpened() {
      this.getRequstBills();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .requisitionGoodsDialog {
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
    padding: 0px 10px;
    height: calc(100% - 84px);
    box-sizing: border-box;
  }
  .dialog-body {
    height: 100%;
  }
  .el-dialog__footer {
    padding: 0;
  }
  .dialog-footer {
    padding: 10px;
  }
}
.requst-filter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 35px;
  .advanced-filter-btn {
    margin-right: 15px;
  }
}
.requst-table {
  height: calc(100% - 75px);
}
.requst-pagination {
  height: 40px;
}
.detail-table {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}
</style>
