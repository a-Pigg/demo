<template>
  <!-- Dict（字典） -->
  <div class="dict">
    <el-card class="dict-card">
      <div slot="header" class="dict-card-header">
        <ds-query-form>
          <!-- 按钮区域 -->
          <ds-query-form-left-panel>
            <el-button type="paimary" size="small" disabled>{{
              $t("h.newBtn")
            }}</el-button>
          </ds-query-form-left-panel>
          <!-- 搜索区域 -->
          <ds-query-form-right-panel></ds-query-form-right-panel>
        </ds-query-form>
      </div>
      <div class="dict-card-content">
        <!-- 筛选区域 -->
        <div class="dict-filter"></div>
        <!-- 表格主体 -->
        <div class="dict-table">
          <ds-table
            ref="tableRef"
            :loading="loading"
            :tableConfig="config"
            :columns="columns"
            :tableData="dicts"
            @checkTableRowDetail="checkTableRowDetail"
          >
            <template slot="operation" slot-scope="{ scope }">
              <el-button
                :disabled="!scope.row.disabled"
                type="text"
                size="small"
                @click="forbiddenDict(scope.row)"
                >{{ $t("h.disabled") }}</el-button
              >
              <span class="line"></span>
              <el-button
                :disabled="!scope.row.delete"
                type="text"
                size="small"
                @click="deleteDict(scope.row)"
                >{{ $t("h.delBtn") }}</el-button
              >
            </template>
          </ds-table>
        </div>
        <!-- 分页区域 -->
        <div class="dict-pagination">
          <!-- <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
          ></ds-pagination> -->
        </div>
      </div>
    </el-card>
    <!-- 字典详情 -->
    <el-dialog
      top="0"
      custom-class="detailDialog"
      :show-close="false"
      :visible.sync="detailOpen"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.title15") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="detailOpen = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <el-tabs v-model="activeName" tab-position="left" style="height: 100%">
          <el-tab-pane :label="$t('h.basicInformation')" name="base">
            <div class="tab-pane-titel">
              <span>{{ $t("h.basicInformation") }}</span>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="editDict"
                >{{ $t("h.editBtn") }}</el-button
              >
            </div>
            <div class="tab-pane-content">
              <el-row :gutter="20">
                <el-col
                  v-for="(item, index) in dictDetail"
                  :key="index"
                  :span="item.span"
                  :class="item.class"
                  >{{ item.val }}</el-col
                >
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('h.dictionaryItemList')" name="table">
            <div class="head">
              <!-- disabled -->

              <el-button type="primary" size="small"  :disabled="editForm.cascade">{{
                $t("h.newBtn")
              }}</el-button>
            </div>
            <div class="table">
              <ds-table
                :loading="detailLoading"
                :tableConfig="config"
                :columns="detailColumns"
                :tableData="detailData"
              >
                <template slot="operation" slot-scope="{ scope }">
                  <el-button
                    type="text"
                    size="small"
                    @click="editDictRow(scope.row)"
                    >{{ $t("h.editBtn") }}</el-button
                  >
                  <span class="line"></span>
                  <el-button
                    disabled
                    type="text"
                    size="small"
                    @click="deleteDictRow(scope.row)"
                    >{{ $t("h.delBtn") }}</el-button
                  >
                </template>
              </ds-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!-- 修改字典 -->
    <el-dialog
      top="0"
      custom-class="editDialog"
      :show-close="false"
      :visible.sync="editOpen"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.changeBtn") + $t("h.Dict") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="editOpen = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <div class="form">
          <el-form
            :model="editForm"
            :rules="editRules"
            ref="editFormRef"
            label-width="100px"
          >
            <el-form-item :label="$t('h.dictionaryName')" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.comment')" prop="comment">
              <el-input type="textarea" v-model="editForm.comment"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btns">
          <el-button type="primary" size="small" @click="submitEditForm">{{
            $t("h.confirmBtn")
          }}</el-button>
          <el-button size="small">{{ $t("h.cancelBtn") }}</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 修改字典详情 -->
    <!-- @closed="editDialogClosed" -->
    <el-dialog
      top="0"
      custom-class="editDialog"
      :show-close="false"
      :visible.sync="editDetailOpen"
      @closed="editDialogClosed"
    >
      <div slot="title" class="dialog-header">
        <div class="left">
          <span>{{ $t("h.changeBtn") + $t("h.dictionaryDetails") }}</span>
        </div>
        <div class="right">
          <i class="el-icon-close" @click="editDetailOpen = false"></i>
        </div>
      </div>
      <div class="dialog-body">
        <div class="form">
          <el-form
            :model="editDetailForm"
            :rules="editDetailRules"
            ref="editDetailFormRef"
            label-width="100px"
          >
            <el-form-item :label="$t('h.name')" prop="value">
              <el-input v-model="editDetailForm.value"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btns">
          <el-button
            type="primary"
            size="small"
            @click="submitEditDetailForm"
            >{{ $t("h.confirmBtn") }}</el-button
          >
          <el-button size="small">{{ $t("h.cancelBtn") }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import { mapMutations, mapState } from "vuex";
import { select, update } from "@/assets/api";
import { countTableHeaderWidth } from "@/utils/basic-methods";
import { dictDetailCell } from "@/utils/systemData";
export default {
  components: {
    DsTable,
    DsPagination,
    DsQueryForm,
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
      loading: false,
      config: {},
      columns: [
        {
          type: "detail",
          prop: "name",
          // label: "字典名称",
          label: this.$t("h.dictionaryName"),
          showOverflowTooltip: true,
          width: 288,
        },
        {
          prop: "comment",
          // label: "备注",
          label: this.$t("h.comment"),
          showOverflowTooltip: true,
          minWidth: countTableHeaderWidth(this.$t("h.comment")),
        },
        {
          // label: "操作",
          label: this.$t("h.action"),
          slotName: "operation",
          width: 200,
          fixed: "right",
        },
      ],
      dicts: [],
      detailOpen: false,
      activeName: "base",
      dictDetail: [],
      detailLoading: false,
      detailColumns: [
        {
          prop: "value",
          label: this.$t("h.name"),
          showOverflowTooltip: true,
          minWidth: countTableHeaderWidth(this.$t("h.name")),
        },
        {
          label: this.$t("h.action"),
          slotName: "operation",
          width: countTableHeaderWidth(this.$t("h.action")),
          fixed: "right",
        },
      ],
      detailData: [],
      editOpen: false,
      editForm: {
        dictionaryId: "",
        name: "",
        comment: "",
        cascade:"",
      },
      editRules: {
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.dictionaryName"),
            trigger: "blur",
          },
        ],
      },
      editDetailOpen: false,
      editDetailForm: {
        dictionaryId: "",
        dryId: "",
        value: "",
      },
      editDetailRules: {
        value: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.name"),
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
    ...mapMutations(["SET_ASSETSTATE"]),
    // 获取字典列表
    getDicts(dictionaryId) {
      this.loading = true;
      select({
        func: "S0072",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.dicts = data.data;
          
          if (dictionaryId) {
            let item = this.dicts.find((e) => {
              return e.dictionaryId == dictionaryId;
            });
            this.dictDetail = dictDetailCell(item);
            this.editForm.dictionaryId = item.dictionaryId;
            this.editForm.name = item.name;
            this.editForm.comment = item.comment;
            
            
          }
        })
        .catch(() => {
          this.loading = false;
          // "服务器网络错误，请求字典列表失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 获取字典详情
    getDictDetail(dictionaryId) {
      this.detailLoading = true;
      select({
        func: "S0071",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          dictionaryId: dictionaryId,
        },
      })
        .then(({ data }) => {
          this.detailLoading = false;
          if (data.code != 0) {
            return this.$message.error(data.data);
          }
          if (dictionaryId == "3ed47c5ae18e42bc894cf1bffb772bdb") {
            this.SET_ASSETSTATE(data.data);
          }
          this.detailData = data.data;
        })
        .catch(() => {
          this.detailLoading = false;
          // "服务器错误，查询字典详情失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 禁用字典
    forbiddenDict(row) {},
    // 删除字典
    deleteDict(row) {},
    // 查看字典详情
    async checkTableRowDetail(val) {
      this.dictDetail = dictDetailCell(val);
      console.log('val',val)
      this.editForm.dictionaryId = val.dictionaryId;
      this.editForm.name = val.name;
      this.editForm.comment = val.comment;
       this.editForm.cascade = val.cascade
      await this.getDictDetail(val.dictionaryId);
      this.detailOpen = true;
    },
    editDict() {
      this.editOpen = true;
    },
    // 删除字典某一项
    deleteDictRow(row) {},
    // 编辑修改字典某一项
    editDictRow(row) {
      this.editDetailForm.dryId = row.dryId;
      this.editDetailForm.dictionaryId = row.dictionaryId;
      this.editDetailForm.value = row.value;
      this.editDetailOpen = true;
    },
    // 提交字典修改表单
    submitEditForm() {
      this.$refs["editFormRef"].validate((valid) => {
        if (!valid) return false;
        update({
          func: "U0079",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            dictionaryId: this.editForm.dictionaryId,
            name: this.editForm.name,
            comment: this.editForm.comment,
            permissonId: 92,
          },
        })
          .then(({ data }) => {
            if (data.code != 0) {
              return this.$message.error(data.data);
            }
            this.getDicts(this.editForm.dictionaryId);
            this.$message.success(data.data);
            this.editOpen = false;
          })
          .catch(() => {
            // "服务器错误，修改失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // 修改字典详情修改表单
    submitEditDetailForm() {
      this.$refs["editDetailFormRef"].validate((valid) => {
        if (!valid) return false;
        update({
          func: "U0078",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            dryId: this.editDetailForm.dryId,
            dictionaryId: this.editDetailForm.dictionaryId,
            value: this.editDetailForm.value,
            permissonId: 92,
          },
        })
          .then(({ data }) => {
            if (data.code != 0) {
              return this.$message.error(data.data);
            }
            this.editDetailOpen = false;
            this.getDictDetail(this.editDetailForm.dictionaryId);
            this.$message.success(data.data);
          })
          .catch(() => {
            // "服务器错误，修改字典详情失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    editDialogClosed() {},
  },
  created() {
    this.getDicts();
  },
};
</script>
<style lang="scss" scoped>
.dict {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .dict-card {
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
.dict-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.dict-card-content {
  height: 100%;
  .dict-filter {
    display: flex;
    justify-content: flex-end;
    height: 35px;
  }
  .dict-table {
    height: calc(100% - 75px);
  }
  .dict-pagination {
    height: 40px;
  }
}
.line {
  vertical-align: middle;
  margin: 0 10px;
  border-right: 2px solid #000;
}
::v-deep .detailDialog {
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
  }
}
::v-deep .el-tabs__content {
  padding: 8px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  .el-tab-pane {
    height: 100%;
  }
}
.tab-pane-titel {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 10px;
  font-size: 16px;
}
.tab-pane-titel::before {
  position: absolute;
  top: 4px;
  left: 0px;
  content: "";
  width: 4px;
  height: 16px;
  background-color: #588ab9;
}
.tab-pane-content {
  margin-top: 10px;
  .el-row {
    width: calc(100% - 10px);
    .el-col {
      margin: 10px 0;
    }
    .col-title {
      height: 40px;
      line-height: 40px;
      color: #588ab9;
    }
    .col-content {
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background-color: #eee;
      border-radius: 6px;
      color: #000;
    }
  }
}
.table {
  height: calc(100% - 42px);
  margin-top: 10px;
}
::v-deep .editDialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: 580px;
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
}
.btns {
  text-align: center;
}
</style>
