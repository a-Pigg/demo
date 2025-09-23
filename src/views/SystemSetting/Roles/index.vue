<template>
  <div class="roles">
    <el-card class="roles-card">
      <div slot="header" class="roles-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button size="mini" type="primary" @click="newRolesForm">{{
              $t("h.newBtn")
            }}</el-button>
            <el-button size="mini" @click="deleteRoles">{{
              $t("h.delBtn")
            }}</el-button>
          </ds-query-form-left-panel>
        </ds-query-form>
      </div>
      <div class="roles-card-content">
        <div class="bills-table">
          <ds-table
            ref="billsTableRef"
            :loading="loading"
            :tableConfig="billsTableConfig"
            :columns="billsColums"
            :tableData="
              rolesBills.slice(
                (paginationForm.currentPage - 1) * paginationForm.pageSize,
                paginationForm.currentPage * paginationForm.pageSize
              )
            "
            :rowKey="(row) => row._id"
            @handleSelectionChange="handleSelectionChange"
          >
            <template slot="operation" slot-scope="{ scope }">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="editRolesForm(scope.row)"
                >{{ $t("h.editBtn") }}</el-button
              >
              <span class="line"></span>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click="deleteRolesForm(scope.row)"
                >{{ $t("h.delBtn") }}</el-button
              >
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
    <new-bills-dialog
      class="new-bill-dialog"
      :title="newBillTitle"
      :newBillsDialogVisible.sync="newBillsDialogVisible"
      @opened="newBillsDialogOpened"
      @closed="newBillsDialogClosed"
      @sbumitForm="sbumitRolesForm"
    >
      <template slot="form">
        <el-form
          ref="rolesFormRef"
          label-width="130px"
          :model="rolesForm"
          :rules="rolesFormRules"
        >
          <el-form-item :label="$t('h.roleName')" prop="rolesName">
            <el-input v-model="rolesForm.rolesName"></el-input>
          </el-form-item>
        </el-form>
        <div class="permissons-tree">
          <el-tree
            ref="treeRef"
            node-key="id"
            show-checkbox
            default-expand-all
            :data="rolesPermissons"
            :props="rolesPermissonsProps"
            :default-checked-keys="defKeys"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ $t(`h.${node.label}`) }}</span>
            </span>
          </el-tree>
        </div>
      </template>
    </new-bills-dialog>
    <!-- 删除失败 -->
    <ds-delete-detail
      :deleteDialogVisible.sync="deleteDialogVisible"
      :deleteColumns="deleteColumns"
      :deleteErrorData="deleteErrorData"
      @closed="deleteDialogVisibleClosed"
    ></ds-delete-detail>
  </div>
</template>
<script>
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import { rolesBillsColumns, deleteRolesErrorColumns } from "@/utils/systemData";
import { mapState } from "vuex";
import { deleteData, select, update } from "@/assets/api";
export default {
  components: {
    DsTable,
    DsPagination,
    DsQueryForm,
    DsQueryFormLeftPanel,
    NewBillsDialog,
    DsDeleteDetail,
  },
  data() {
    return {
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      loading: false,
      billsTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      billsColums: rolesBillsColumns,
      rolesBills: [],
      selectRolesBills: [],
      rolesPermissons: [],
      rolesPermissonsProps: {
        label: "name",
        children: "children",
      },
      defKeys: [],
      newBillsDialogVisible: false,
      newBillTitle: this.$t("h.title100"),
      dialogLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      rolesForm: {
        _id: "",
        rolesName: "",
      },
      rolesFormRules: {
        rolesName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      deleteDialogVisible: false,
      deleteColumns: deleteRolesErrorColumns,
      deleteErrorData: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    getRolesBills() {
      this.loading = true;
      select({
        func: "S0002",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data.length;
          this.rolesBills = data.data;
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("服务器网络异常，查询角色列表失败");
        });
    },
    getRolesPermissons() {
      select({
        func: "S0020",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.rolesPermissons = data.data;
        })
        .catch(() => {
          this.$message.error("服务器网络错误，查询权限列表失败");
        });
    },
    handleSelectionChange(val) {
      this.selectRolesBills = val;
    },
    newRolesForm() {
      this.rolesPermissons = JSON.parse(JSON.stringify(this.rolesPermissons));
      this.newBillsDialogVisible = true;
    },
    editRolesForm(row) {
      this.rolesPermissons = JSON.parse(JSON.stringify(this.rolesPermissons));
      this.getDefKefs(row.menuList, this.defKeys);
      this.rolesForm._id = row._id;
      this.rolesForm.rolesName = row.roleName;
      this.newBillTitle = this.$t("h.title101");
      this.newBillsDialogVisible = true;
    },
    deleteRolesForm(row) {
      this.$confirm(this.$t("h.tips167"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          if (row._id == 1) return this.$message.error(this.$t("h.tips168"));
          this.loading = true;
          deleteData({
            func: "D0005",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              _id: row._id,
              permissonId: 54,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) {
                this.loading = false;
                return this.$message.error(data.data);
              }
              this.getRolesBills();
              this.$message.success({ message: this.$t("h.tips128") });
            })
            .catch(() => {
              this.loading = false;
              // "服务器网络异常，删除角色失败"
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("h.tips98"),
          });
        });
    },
    async deleteRoles() {
      if (!this.selectRolesBills.length) {
        return this.$message.error(this.$t("h.tips162"));
      }
      const confirmResult = await this.$confirm(
        this.$t("h.tips163"),
        this.$t("h.title18"),
        {
          confirmButtonText: this.$t("h.confirmBtn"),
          cancelButtonText: this.$t("h.cancelBtn"),
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult === "cancel")
        return this.$message.info(this.$t("h.tips98"));
      this.loading = true;
      this.deleteErrorData = [];
      this.multiDeleteRole(0);
    },
    multiDeleteRole(index) {
      if (index > this.selectRolesBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getRolesBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success(this.$t("h.tips98"));
        }
        return;
      }
      deleteData({
        func: "D0005",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectRolesBills[index]._id,
          permissonId: 54,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              name: this.selectRolesBills[index].roleName,
              reason: data.data,
            });
          }
          this.multiDeleteRole(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            name: this.selectRolesBills[index].roleName,
            reason: this.$t("h.tips18"),
          });
          this.multiDeleteRole(++index);
        });
    },
    newBillsDialogOpened() {
      this.$refs.rolesFormRef.clearValidate();
      this.$refs.billsTableRef.$refs.dsTableRef.clearSelection();
    },
    newBillsDialogClosed() {
      this.defKeys = [];
      this.rolesForm.rolesName = "";
      this.rolesForm._id = "";
      this.newBillTitle = this.$t("h.title100");
    },
    sbumitRolesForm() {
      this.$refs.rolesFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        const PID = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ];
        const permissonId = this.rolesForm._id == "" ? 53 : 55;
        update({
          func: "U0014",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.rolesForm._id,
            roleName: this.rolesForm.rolesName,
            pid: PID.join(","),
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newBillsDialogVisible = false;
            this.getRolesBills();
            this.$message.success(data.data);
          })
          .catch(() => {
            LOADING.close();
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    getDefKefs(node, data) {
      if (!node) {
        data = [];
        return;
      }
      for (let i = 0; i < node.length; i++) {
        let cNode = node[i];
        if (cNode.children) {
          this.getDefKefs(cNode.children, data);
        } else {
          data.push(cNode.id);
        }
      }
    },
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
  },
  created() {
    this.getRolesBills();
    this.getRolesPermissons();
  },
};
</script>
<style lang="scss" scoped>
.roles {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .roles-card {
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
.roles-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.roles-card-content {
  height: 100%;
  .bills-table {
    margin-top: 10px;
    height: calc(100% - 50px);
  }
  .bills-pagination {
    height: 40px;
  }
}
.line {
  vertical-align: middle;
  margin: 0 10px;
  border-right: 2px solid #000;
}
.permissons-tree {
  padding-left: 130px;
  height: 790px;
  overflow: auto;
  box-sizing: border-box;
}
</style>
