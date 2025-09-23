<template>
  <div class="vendor">
    <el-card class="vendor-card">
      <!-- 卡片头部 -->
      <div slot="header" class="vendor-card-header">
        <ds-query-form>
          <!-- 按钮区域 -->
          <ds-query-form-left-panel>
            <el-button
              size="small"
              type="primary"
              @click="newVendorDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editVendorForm">{{
                  $t("h.changeBtn")
                }}</el-dropdown-item>
                <el-dropdown-item>{{ $t("h.delBtn") }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </ds-query-form-left-panel>
          <!-- 搜索区域 -->
          <ds-query-form-right-panel>
            <ds-search-btn></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <!-- 卡片主体 -->
      <div class="vendor-card-content">
        <!-- 高级筛选 -->
        <div class="vendor-filter">
          <el-button class="advanced-filter-btn" type="text" size="small">{{
            $t("h.advancedBtn")
          }}</el-button>
        </div>
        <!-- 表格 -->
        <div class="vendor-table">
          <ds-table
            ref="vendorTableRef"
            :loading="tableLoading"
            :tableData="vendors"
            :columns="vendorsColumns"
            :tableConfig="vendorsConfig"
            :rowKey="(row) => row.id"
            onlyKey="id"
            @handleSelectionChange="handleSelectionChange"
          ></ds-table>
        </div>
        <!-- 分页 -->
        <div class="vendor-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getVendors"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <new-bills-dialog
      class="new-vendor-dialog"
      :newBillsDialogVisible.sync="newVendorDialogVisible"
      @sbumitForm="sbumitVendorForm"
      @close="newVendorDialogVisibleClosed"
    >
      <template slot="form">
        <el-form
          ref="vendorFormRef"
          label-width="120px"
          :model="vendorForm"
          :rules="vendorFormRules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips47')" prop="name">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.formTips47')"
                  v-model="vendorForm.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips48')" prop="contacts">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.formTips48')"
                  v-model="vendorForm.contacts"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips49')" prop="phone">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.formTips49')"
                  v-model="vendorForm.phone"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips50')" prop="email">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.formTips50')"
                  v-model="vendorForm.email"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips51')" prop="bankName">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.formTips51')"
                  v-model="vendorForm.bankName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips52')" prop="bankAccount">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.formTips52')"
                  v-model="vendorForm.bankAccount"
                ></el-input>
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
import { vendorsColumns } from "@/utils/systemData";
import DsTable from "@/components/DsTable";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsQueryForm from "@/components/DsQueryForm";
import DsPagination from "@/components/DsPagination";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
export default {
  components: {
    DsTable,
    DsSearchBtn,
    DsQueryForm,
    DsPagination,
    NewBillsDialog,
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
      vendorsColumns: vendorsColumns,
      vendorsConfig: {
        selection: true,
        reserveSelection: true,
      },
      selectVendors: [],
      vendors: [],
      newVendorDialogVisible: false,
      dialogLoading: {
        target: ".new-vendor-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      vendorForm: {
        id: null,
        name: "", //供应商名称
        bankAccount: "", //  银行账号
        bankName: "", //开户行
        contacts: "", // 联系人
        email: "", //邮箱
        phone: "", //联系电话
      },
      vendorFormRules: {
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.formTips47"),
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
    // 获取供应商
    getVendors() {
      this.tableLoading = true;
      select({
        func: "S0061",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          page: this.paginationForm.pageSize,
          index: this.paginationForm.currentPage,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data[0];
          this.vendors = data.data[1];
        })
        .catch(() => {
          this.tableLoading = false;
          // 服务器网络错误，请求供应商失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    sbumitVendorForm() {
      this.$refs.vendorFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        update({
          func: "U0064",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            id: this.vendorForm.id,
            name: this.vendorForm.name,
            bankAccount: this.vendorForm.bankAccount,
            bankName: this.vendorForm.bankName,
            contacts: this.vendorForm.contacts,
            email: this.vendorForm.email,
            phone: this.vendorForm.phone,
            permissonId: 26,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newVendorDialogVisible = false;
            this.getVendors();
            // 清空选项
            this.$refs.vendorTableRef.$refs.dsTableRef.clearSelection();
          })
          .catch(() => {
            LOADING.close();
            // 服务器网络错误，新增/编辑单据失败
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    newVendorDialogVisibleClosed() {
      this.vendorForm._id = null;
      this.vendorForm.name = "";
      this.vendorForm.bankAccount = "";
      this.vendorForm.bankName = "";
      this.vendorForm.contacts = "";
      this.vendorForm.email = "";
      this.vendorForm.phone = "";
    },
    handleSelectionChange(val) {
      this.selectVendors = val;
    },
    // 修改
    editVendorForm() {
      if (!this.selectVendors.length) {
        return this.$message.error(this.$t("h.tips252"));
      }
      if (this.selectVendors.length > 1) {
        return this.$message.error(this.$t("h.tips253"));
      }
      this.vendorForm.id = this.selectVendors[0].id;
      this.vendorForm.name = this.selectVendors[0].name;
      this.vendorForm.bankAccount = this.selectVendors[0].bankAccount;
      this.vendorForm.bankName = this.selectVendors[0].bankName;
      this.vendorForm.contacts = this.selectVendors[0].contacts;
      this.vendorForm.email = this.selectVendors[0].email;
      this.vendorForm.phone = this.selectVendors[0].phone;
      this.newVendorDialogVisible = true;
    },
  },
  created() {
    this.getVendors();
  },
};
</script>
<style lang="scss" scoped>
.vendor {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .vendor-card {
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
.vendor-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.vendor-card-content {
  height: 100%;
  .vendor-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .vendor-table {
    height: calc(100% - 75px);
  }
  .vendor-pagination {
    height: 40px;
  }
}
</style>
