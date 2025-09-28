<template>
  <div class="manufacturer">
    <button @click="a">点我 生产厂家</button>
    <el-card class="manufacturer-card">
      <!-- 卡片头部 -->
      <div slot="header" class="manufacturer-card-header">
        <ds-query-form>
          <!-- 按钮区域 -->
          <ds-query-form-left-panel>
            <el-button
              size="small"
              type="primary"
              @click="newManufacturerDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-dropdown trigger="click">
              <el-button size="small">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editManufacturerForm">{{
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
      <div class="manufacturer-card-content">
        <!-- 高级筛选 -->
        <div class="manufacturer-filter">
          <el-button class="advanced-filter-btn" type="text" size="small">{{
            $t("h.advancedBtn")
          }}</el-button>
        </div>
        <!-- 表格 -->
        <div class="manufacturer-table">
          <ds-table
            ref="manufacturerTableRef"
            :loading="tableLoading"
            :tableData="manufacturers"
            :columns="manufacturersColumns"
            :tableConfig="manufacturersConfig"
            :rowKey="(row) => row.id"
            onlyKey="id"
            @handleSelectionChange="handleSelectionChange"
          ></ds-table>
        </div>
        <!-- 分页 -->
        <div class="manufacturer-pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="getManufacturers"
          ></ds-pagination>
        </div>
      </div>
    </el-card>
    <new-bills-dialog
      class="new-manufacturer-dialog"
      :newBillsDialogVisible.sync="newManufacturerDialogVisible"
      @sbumitForm="sbumitManufacturerForm"
      @close="newManufacturerDialogVisibleClosed"
    >
      <template slot="form">
        <el-form
          ref="manufacturerFormRef"
          label-width="120px"
          :model="manufacturerForm"
          :rules="manufacturerFormRules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('h.manufacturerFullName')" prop="fullName">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.manufacturerFullName')"
                  v-model="manufacturerForm.fullName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips87')" prop="abbreviation">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.formTips87')"
                  v-model="manufacturerForm.abbreviation"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('h.formTips88')" prop="registrationCode">
                <el-input
                  :placeholder="$t('h.tips3') + $t('h.formTips88')"
                  v-model="manufacturerForm.registrationCode"
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
import { update, warehouseOperate } from "@/assets/api";
import { mapState } from "vuex";
import { manufacturersColumns } from "@/utils/systemData";
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
      manufacturersColumns: manufacturersColumns,
      manufacturersConfig: {
        selection: true,
        reserveSelection: true,
      },
      selectManufacturers: [],
      manufacturers: [],
      newManufacturerDialogVisible: false,
      dialogLoading: {
        target: ".new-manufacturer-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      manufacturerForm: {
        manufacturerId: null,
        fullName: "", //厂家全称
        abbreviation: "", //厂家简称
        registrationCode: "", // 注册编码
      },
      manufacturerFormRules: {
        fullName: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.manufacturerFullName"),
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
    a() {
      console.log("manufacturers----", this.manufacturers);
    },
    // 获取生产厂家
    getManufacturers() {
      this.tableLoading = true;
      warehouseOperate({
        func: "MA0004",
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
          this.manufacturers = data.data[1];
        })
        .catch(() => {
          this.tableLoading = false;
          // 服务器网络错误，请求供应商失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
    //新增生产厂家
    sbumitManufacturerForm() {
      this.$refs.manufacturerFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.dialogLoading);
        warehouseOperate({
          func: "MA0001",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            // manufacturerId: this.manufacturerForm.manufacturerId,
            fullName: this.manufacturerForm.fullName,
            abbreviation: this.manufacturerForm.abbreviation,
            registrationCode: this.manufacturerForm.registrationCode,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.newManufacturerDialogVisible = false;
            this.getManufacturers();
            // 清空选项
            this.$refs.manufacturerTableRef.$refs.dsTableRef.clearSelection();
          })
          .catch(() => {
            LOADING.close();
            // 服务器网络错误，新增/编辑单据失败
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    newManufacturerDialogVisibleClosed() {
      this.manufacturerForm.manufacturerId = null;
      this.manufacturerForm.fullName = "";
      this.manufacturerForm.abbreviation = "";
      this.manufacturerForm.registrationCode = "";
    },
    handleSelectionChange(val) {
      this.selectManufacturers = val;
    },
    // TODO 修改
    editManufacturerForm() {
      if (!this.selectManufacturers.length) {
        return this.$message.error(this.$t("h.tips252"));
      }
      if (this.selectManufacturers.length > 1) {
        return this.$message.error(this.$t("h.tips253"));
      }
      this.manufacturerForm.id = this.selectManufacturers[0].id;
      this.manufacturerForm.name = this.selectManufacturers[0].name;
      this.manufacturerForm.bankAccount =
        this.selectManufacturers[0].bankAccount;
      this.manufacturerForm.bankName = this.selectManufacturers[0].bankName;
      this.manufacturerForm.contacts = this.selectManufacturers[0].contacts;
      this.manufacturerForm.email = this.selectManufacturers[0].email;
      this.manufacturerForm.phone = this.selectManufacturers[0].phone;
      this.newManufacturerDialogVisible = true;
    },
  },
  created() {
    this.getManufacturers();
  },
};
</script>
<style lang="scss" scoped>
.manufacturer {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f8;
  .manufacturer-card {
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
.manufacturer-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.manufacturer-card-content {
  height: 100%;
  .manufacturer-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    .advanced-filter-btn {
      margin-left: 5px;
    }
  }
  .manufacturer-table {
    height: calc(100% - 75px);
  }
  .manufacturer-pagination {
    height: 40px;
  }
}
</style>
