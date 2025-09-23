<template>
  <el-dialog
    custom-class="select-staff-dialog"
    top="0"
    :visible.sync="dialogVisible"
    :show-close="false"
    @opened="dialogVisibleOpened"
    @closed="dialogVisibleClosed"
  >
    <div slot="title" class="dialog-header">
      <div class="title">
        <span>{{ title }}</span>
      </div>
      <i class="el-icon-close" @click="dialogVisible = false"></i>
    </div>
    <div class="dialog-body">
      <div class="dialog-body-search">
        <ds-search-btn
          :searchValue.sync="andLike"
          @search="findStaffSearch"
        ></ds-search-btn>
      </div>
      <div class="dialog-body-data">
        <div class="dept-tree">
          <el-tree
            ref="deptTreeRef"
            node-key="_id"
            highlight-current
            :expand-on-click-node="false"
            :data="deptTreeData"
            :props="{
              children: 'children',
              label: 'deptName',
              value: '_id',
            }"
            @node-click="handleDeptNodeClick"
          >
            <span slot-scope="{ node, data }">
              <img
                v-if="data.subId == null"
                class="tree-top-icon"
                src="@/assets/images/icon-dept-top.png"
              />

              <img
                v-else
                class="tree-second-icon"
                src="@/assets/images/icon-dept-second.png"
              />
              <span class="text">
                {{ data.code + "-" + node.label }}
              </span>
            </span>
          </el-tree>
        </div>
        <div class="staff-area">
          <div class="staff-area-table">
            <ds-table
              :loading="tableLoading"
              :columns="columns"
              :tableData="staffData"
              :rowKey="(row) => row._id"
              :tableConfig="{
                selection: true,
                multiple: multiple,
                reserveSelection: true,
              }"
            ></ds-table>
          </div>
          <div class="staff-area-pagination">
            <ds-pagination
              small
              :total="total"
              :page.sync="paginationForm.currentPage"
              :limit.sync="paginationForm.pageSize"
              @pagination="getStaffData"
            ></ds-pagination>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { select } from "@/assets/api";
import { mapState } from "vuex";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
export default {
  name: "DsSelectStaffDialog",
  components: {
    DsSearchBtn,
    DsTable,
    DsPagination,
  },
  data() {
    return {
      tableLoading: false,
      columns: [
        {
          label: "工号",
          prop: "code",
          showOverflowTooltip: true,
          width: "125px",
        },
        {
          label: "职工名称",
          prop: "name",
          showOverflowTooltip: true,
        },
        {
          label: "手机号码",
          prop: "phone",
          showOverflowTooltip: true,
          width: "150px",
        },
        {
          label: "部门名称",
          prop: "deptName",
          showOverflowTooltip: true,
        },
        {
          label: "状态",
          prop: "workStatus",
          showOverflowTooltip: true,
          width: "120",
        },
      ],
      staffData: [],
      total: 0,
      andLike: "",
      dept_id: null,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
    };
  },
  props: {
    title: {
      type: String,
      default: "请选择员工",
    },
    staffDialogVisible: {
      type: Boolean,
      default: false,
    },
    deptTreeData: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    dialogVisible: {
      get() {
        return this.staffDialogVisible;
      },
      set(val) {
        this.$emit("update:staffDialogVisible", val);
      },
    },
  },
  methods: {
    async getStaffData() {
      this.tableLoading = true;
      const { data: res } = await select({
        func: "S0005",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
          andLike: this.andLike,
          dept_id: this.dept_id,
        },
      });
      this.tableLoading = false;
      if (res.code != 0) return this.$message.error(res.data);
      this.total = res.data[1];
      this.staffData = res.data[0];
    },
    findStaffSearch() {
      this.paginationForm.currentPage = 1;
      this.paginationForm.pageSize = 20;
      this.getStaffData();
    },
    handleDeptNodeClick(node) {
      this.dept_id = node._id;
      this.paginationForm.currentPage = 1;
      this.paginationForm.pageSize = 20;
      this.getStaffData();
    },
    dialogVisibleOpened() {
      this.getStaffData();
    },
    dialogVisibleClosed() {
      this.paginationForm.currentPage = 1;
      this.paginationForm.pageSize = 20;
      this.andLike = "";
      this.dept_id = null;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .select-staff-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65%;
  height: 90%;
  border-radius: 6px;
  overflow: hidden;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 15px;
    height: calc(100% - 43px);
    box-sizing: border-box;
    overflow: auto;
  }
}
.dialog-header {
  display: flex;
  padding-left: 8px;
  height: 43px;
  line-height: 43px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  .title {
    width: calc(100% - 43px);
    font-size: 14px;
  }
  .el-icon-close {
    cursor: pointer;
    width: 43px;
    height: 43px;
    line-height: 43px;
    text-align: center;
    font-size: 24px;
    color: #999;
    &:hover {
      color: #000;
    }
  }
}
.dialog-body {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  min-width: 930px;
  min-height: 550px;
  .dialog-body-search {
    width: 220px;
  }
  .dialog-body-data {
    display: flex;
    margin-top: 5px;
    width: 100%;
    height: calc(100% - 37px);
    .dept-tree {
      width: 260px;
      height: 100%;
      overflow: auto;
      border: 1px solid #eee;
    }
    .staff-area {
      margin-left: 10px;
      width: calc(100% - 270px);
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
    .staff-area-table {
      height: calc(100% - 40px);
    }
    .staff-area-pagination {
      height: 40px;
      border: 1px solid #eee;
      border-top: none;
      box-sizing: border-box;
    }
  }
}
.tree-top-icon {
  vertical-align: middle;
  width: 20px;
  height: 20px;
}
.tree-second-icon {
  vertical-align: middle;
  width: 16px;
  height: 16px;
}
</style>
