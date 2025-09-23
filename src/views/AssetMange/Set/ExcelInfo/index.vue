<template>
  <div class="excel-info">
    <el-card class="excel-info-card">
      <div slot="header" class="excel-card-header">
        <ds-query-form>
          <ds-query-form-left-panel>
            <el-button
              type="primary"
              size="mini"
              @click="newDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-dropdown trigger="click">
              <el-button size="mini">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editTemplate">{{
                  $t("h.changeBtn")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="deteleTemplate">{{
                  $t("h.delBtn")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </ds-query-form-left-panel>
        </ds-query-form>
      </div>
      <div class="excel-card-content">
        <div class="bills-table">
          <ds-table
            ref="tableRef"
            onlyKey="name"
            :loading="tableLoading"
            :tableData="
              templateBills.slice(
                (paginationForm.currentPage - 1) * paginationForm.pageSize,
                paginationForm.currentPage * paginationForm.pageSize
              )
            "
            :columns="templateColumns"
            :tableConfig="tempTableConfig"
            :rowKey="(row) => row.name"
            @handleSelectionChange="handleSelectionChange"
          ></ds-table>
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
      :visible.sync="newDialogVisible"
      :excelFileBase64="excelFile.value"
      :excelFileName="excelFile.name"
      @dialogVisibleClosed="newDialogVisibleClosed"
      @updateExcelInfo="getTemplateBills"
    >
      <upload-excel-base64 :value.sync="excelFile"></upload-excel-base64>
    </new-bills-dialog>
    <edit-bills-dialog
      :visible.sync="editDialogVisible"
      :templateEditTableData="editTableData"
      @dialogVisibleClosed="editDialogVisbileClosed"
      @updateExcelInfo="getTemplateBills"
    ></edit-bills-dialog>
  </div>
</template>
<script>
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import UploadExcelBase64 from "@/components/UploadExcelBase64";
import NewBillsDialog from "@/components/BillsComponents/AssetMangeComponents/ExcelInfo/NewBillsDialog";
import EditBillsDialog from "@/components/BillsComponents/AssetMangeComponents/ExcelInfo/EditBillsDialog";
import { templateBillsColumns } from "@/utils/systemData";
import { mapState } from "vuex";
import { select, deleteData } from "@/assets/api";
export default {
  components: {
    DsTable,
    DsPagination,
    DsQueryForm,
    DsQueryFormLeftPanel,
    UploadExcelBase64,
    EditBillsDialog,
    NewBillsDialog,
  },
  data() {
    return {
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      tableLoading: false,
      tempTableConfig: {
        selection: true,
        reserveSelection: true,
      },
      templateColumns: templateBillsColumns,
      templateBills: [],
      selectTemplateBills: [],
      newDialogVisible: false,
      excelFile: {
        value: "",
        name: "",
      },
      editDialogVisible: false,
      editTableData: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    getTemplateBills() {
      this.tableLoading = true;
      select({
        func: "S0045",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.templateBills = Object.keys(data.data).map((key) => {
            if (data.data[key])
              return {
                name: key.replace(".txt", ""),
                content: JSON.parse(data.data[key]),
              };
            else
              return { name: key.replace(".txt", ""), content: data.data[key] };
          });
          this.total = this.templateBills.length;
        })
        .catch(() => {
          this.tableLoading = false;
          // "服务器网络错误，获取资产导入模板失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    handleSelectionChange(val) {
      this.selectTemplateBills = val;
    },
    newDialogVisibleClosed() {
      this.excelFile.value = "";
      this.excelFile.name = "";
    },
    editDialogVisbileClosed() {
      this.editTableData = [];
      this.$refs.tableRef.$refs["dsTableRef"].clearSelection();
    },
    editTemplate() {
      if (!this.selectTemplateBills.length)
        return this.$message.error(this.$t("h.tips22"));
      if (this.selectTemplateBills.length > 1)
        // "当前只能编辑一个数据"
        return this.$message.error(this.$t("h.tips87"));
      this.editTableData = JSON.parse(JSON.stringify(this.selectTemplateBills));
      this.editDialogVisible = true;
    },
    deteleTemplate() {
      if (!this.selectTemplateBills.length)
        return this.$message.error(this.$t("h.tips22"));
      this.tableLoading = true;
      const deleteName = this.selectTemplateBills.map((item) => item.name);
      deleteData({
        func: "D0026",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          permissonId: 77,
          name: deleteName,
        },
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.$message.success(data.data);
          this.$refs["tableRef"].$refs["dsTableRef"].clearSelection();
          let timer = setTimeout(() => {
            clearTimeout(timer);
            this.getTemplateBills();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
          // "服务网络错误，删除模板失败"
          return this.$message.error(this.$t("h.tips18"));
        });
    },
  },
  created() {
    this.getTemplateBills();
  },
};
</script>
<style lang="scss" scoped>
.excel-info {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .excel-info-card {
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
.excel-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.excel-card-content {
  height: 100%;
  .bills-table {
    margin-top: 10px;
    height: calc(100% - 50px);
  }
  .bills-pagination {
    height: 40px;
  }
}
</style>
