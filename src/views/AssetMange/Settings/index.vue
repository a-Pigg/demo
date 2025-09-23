<template>
  <div class="settings">
    <el-tabs v-model="activeName" @tab-click="settingsTabClick">
      <el-tab-pane label="资产分类" name="first" class="type-tab-pane">
        <el-card class="tree-card">
          <div slot="header" class="tree-card-header">
            <el-dropdown>
              <el-button size="mini" trigger="click" type="primary">
                新建分类<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="newSameType"
                  >新建同级</el-dropdown-item
                >
                <el-dropdown-item @click.native="newSubType"
                  >新建下级</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              size="mini"
              class="add-national-standard"
              @click="standardDialogVisible = true"
              >添加国标</el-button
            >
            <el-button size="mini" @click="readDialogVisible = true">
              导入</el-button
            >
          </div>
          <div class="tree-card-content" v-loading="typeLoading">
            <div class="tree-type-search">
              <ds-search size="small" :value.sync="typeSearch"></ds-search>
            </div>
            <div class="tree-type-list">
              <el-tree
                ref="typeTreeRef"
                highlight-current
                node-key="_id"
                :data="assetTypes"
                :props="assetTypeProps"
                :expand-on-click-node="false"
                :filter-node-method="typeFilterNodeMethod"
                @node-click="assetTypesNodeClick"
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
        </el-card>
        <el-card class="edit-card">
          <div slot="header" class="edit-card-header">
            <span>资产分类</span>
          </div>
          <div class="edit-card-content">
            <div class="edit-form">
              <el-form
                ref="classFormRef"
                label-width="110px"
                label-position="right"
                :model="classForm"
                :rules="classFormRules"
              >
                <el-form-item label="分类编码" prop="code">
                  <el-input
                    :disabled="isEdit"
                    v-model="classForm.code"
                  ></el-input>
                </el-form-item>
                <el-form-item label="分类名称" prop="classifyName">
                  <el-input
                    :disabled="isEdit"
                    v-model="classForm.classifyName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="上级名称" prop="subName">
                  <ds-select-tree
                    ref="typeTreeSelectRef"
                    placeholder="请选择上级分类"
                    v-model="classForm.subId"
                    :disabled="isEdit"
                    :treeData="selectAsaetTypes"
                    :defaultProps="assetTypeProps"
                    :expand-on-click-node="false"
                  >
                  </ds-select-tree>
                </el-form-item>
                <el-form-item label="使用期限(月)" prop="date">
                  <el-input-number
                    v-model="classForm.date"
                    :min="1"
                  ></el-input-number>
                </el-form-item>
              </el-form>
            </div>
            <div class="edit-btns">
              <el-button type="danger" size="small" @click="deleteAssetType"
                >删除</el-button
              >
              <el-button type="primary" size="small" @click="editAssetType"
                >保存</el-button
              >
            </div>
          </div>
        </el-card>
        <new-bills-dialog
          class="add-bill-dialog"
          title="新建分类"
          :newBillsDialogVisible.sync="addBillsDialogVisible"
          @opened="addBillsDialogOpened"
          @close="addBillsDialogClose"
          @sbumitForm="sbumitAddForm"
        >
          <template slot="form">
            <el-form
              ref="addFormRef"
              label-width="110px"
              :rules="addFormRules"
              :model="addForm"
            >
              <el-form-item label="* 分类编码" prop="addCode">
                <el-input v-model="addForm.addCode"></el-input>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="编码必须是唯一的，如果不设置编码，系统将按照您设置的规则自动产生编码。"
                  placement="top"
                >
                  <i
                    class="el-icon-question"
                    style="
                      font-size: 20px;
                      color: #473bb4;
                      position: absolute;
                      top: 10px;
                      right: -25px;
                    "
                  ></i>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="分类名称" prop="addClassName">
                <el-input v-model="addForm.addClassName"></el-input>
              </el-form-item>
              <el-form-item label="上级分类" prop="subName">
                <ds-select-tree
                  v-model="addForm.subId"
                  :disabled="true"
                  :defaultProps="assetTypeProps"
                  :treeData="assetTypes"
                >
                  <!-- :initData="addForm.subId" -->
                </ds-select-tree>
              </el-form-item>
              <el-form-item label="使用期限(月)" prop="date">
                <el-input-number
                  v-model="addForm.date"
                  :min="1"
                ></el-input-number>
              </el-form-item>
            </el-form>
          </template>
        </new-bills-dialog>
        <!-- 添加国标 -->
        <new-bills-dialog
          class="standard-bill-dialog"
          title="添加国标"
          :newBillsDialogVisible.sync="standardDialogVisible"
          @opened="standardDialogOpened"
          @close="standardDialogClose"
          @sbumitForm="sbumitStandardForm"
        >
          <template slot="form">
            <el-tree
              ref="standardTreeRef"
              node-key="_id"
              show-checkbox
              :data="typesStandard"
              :props="assetTypeProps"
            >
              <span slot-scope="{ data }">
                <span class="text" style="font-size: 14px">
                  {{ data.code + " - " + data.classifyName }}
                </span>
              </span>
            </el-tree>
          </template>
        </new-bills-dialog>
        <read-excel-file
          :readDialogVisible.sync="readDialogVisible"
          :setp="setp"
          :percentage="percentage"
          :errorText="errorText"
          :title="$t('h.bulkBtn')"
          @download="downloadImportFile"
          @closed="readDialogVisibleClosed"
          @submit="readDialogVisibleSubmit"
        >
          <upload-excel-file
            :value.sync="file"
            :loading="readLoading"
          ></upload-excel-file>
        </read-excel-file>
      </el-tab-pane>
      <el-tab-pane label="模板标签设置" name="second">
        <el-card class="template-card">
          <div slot="header" class="template-card-header">
            <span>资产打印标签模板</span>
          </div>
          <div class="template-card-content" v-loading="templateLoading">
            <el-row>
              <el-col :xs="24" :sm="12" :lg="8">
                <div class="grid-content">
                  <div class="pedding-add-asset" @click="addAssetTempalte">
                    <i class="el-icon-plus"></i>
                  </div>
                </div>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :lg="8"
                v-for="(item, index) in printTemplates"
                :key="item._id"
              >
                <div class="grid-content" @click="checkAssesTemplate(item._id)">
                  <img :src="item.base" class="template-img" />
                  <div class="mask-box"></div>
                  <button
                    class="check-tempalate-btn"
                    v-show="assetTemaplateId == item._id"
                  >
                    <i class="el-icon-check"></i>
                  </button>
                  <button
                    class="delete-template-btn"
                    v-show="item._id > 7"
                    @click.stop="deleteAssetTemplate(item._id)"
                  >
                    <i class="el-icon-close"></i>
                  </button>
                  <button
                    class="edit-template-btn"
                    v-show="item.edit"
                    @click.stop="editAssetTemplate(index)"
                  >
                    <i class="el-icon-edit"></i>
                  </button>
                </div>
                <div class="title">
                  <span>{{ item.title }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <draw-printed-pictures
          :customDialogVisible.sync="customDialogVisible"
          :step.sync="step"
          :tableData="templateItem"
          @closed="customDialogVisibleClosed"
          @refreshTags="getAssetTemplates"
        ></draw-printed-pictures>
      </el-tab-pane>
      <el-tab-pane label="报废原因设置" name="thirdy">
        <el-card class="reason-card">
          <div slot="header" class="reason-card-header">
            <ds-query-form>
              <ds-query-form-left-panel>
                <el-button
                  type="primary"
                  size="small"
                  @click="reasonBillsDialogVisible = true"
                  >新建</el-button
                >
                <el-button type="danger" size="small" @click="deleteReasons"
                  >删除</el-button
                >
              </ds-query-form-left-panel>
              <ds-query-form-right-panel>
                <ds-search size="small" :value.sync="andLike"></ds-search>
              </ds-query-form-right-panel>
            </ds-query-form>
          </div>
          <div class="reason-card-content">
            <div class="bills-table">
              <ds-table
                ref="billsTableRef"
                :loading="tableLoading"
                :tableData="scrapTables"
                :columns="scrapReasonBillsColumns"
                :tableConfig="scrapReasonBillsConfig"
                :rowKey="(row) => row._id"
                @handleSelectionChange="handleSelectionChange"
              >
                <template slot="operation" slot-scope="{ scope }">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-edit"
                    @click="editReasonForm(scope.row)"
                    >编辑</el-button
                  >
                  <span class="line"></span>
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteReasonForm(scope.row)"
                    >删除</el-button
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
          title="新建报废原因"
          :newBillsDialogVisible.sync="reasonBillsDialogVisible"
          @opened="reasonBillsDialogOpened"
          @close="reasonBillsDialogClose"
          @sbumitForm="sbumitReasonForm"
        >
          <template slot="form">
            <el-form
              ref="reasonFormRef"
              label-width="130px"
              :model="reasonForm"
              :rules="reasonFormRules"
            >
              <el-form-item label="报废原因" prop="code" label-width="120px">
                <el-input
                  v-model="reasonForm.scrapResult"
                  placeholder="请输入报废原因"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </new-bills-dialog>
        <ds-delete-detail
          :deleteDialogVisible.sync="deleteDialogVisible"
          :deleteColumns="deleteColumns"
          :deleteErrorData="deleteErrorData"
          @closed="deleteDialogVisibleClosed"
        ></ds-delete-detail>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import DrawPrintedPictures from "@/components/DrawPrintedPictures";
import ReadExcelFile from "@/components/ReadExcelFile";
import UploadExcelFile from "@/components/ReadExcelFile/components/UploadExcelFile.vue";
import DsSelectTree from "@/components/DsSelectTree";
import DsDeleteDetail from "@/components/DsDeleteDetail";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsTable from "@/components/DsTable";
import DsPagination from "@/components/DsPagination";
import DsSearch from "@/components/DsSearch";
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import {
  scrapReasonBillsColumns,
  deleteReasonErrorColumns,
} from "@/utils/systemData";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { clickDownloadLink } from "@/utils/basic-methods";
import { getCanvasTemplate } from "@/utils/getAssetTemplate";
import { dataToPrintImg } from "@/utils/dataToPrintImage";
import { deleteData, select, update } from "@/assets/api";
import { mapState } from "vuex";
import * as XLSX from "xlsx";
export default {
  components: {
    DrawPrintedPictures,
    ReadExcelFile,
    UploadExcelFile,
    DsSelectTree,
    DsDeleteDetail,
    NewBillsDialog,
    DsTable,
    DsPagination,
    DsSearch,
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
  },
  data() {
    return {
      activeName: "first",
      total: 0,
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      tableLoading: false,
      scrapReasonBillsConfig: {
        selection: true,
        reserveSelection: true,
      },
      andLike: "",
      scrapReasonBillsColumns: scrapReasonBillsColumns,
      scrapReasonBills: [],
      selectScrapReasonBills: [],
      reasonBillsDialogVisible: false,
      reasonLoading: {
        target: ".new-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      reasonForm: {
        _id: "",
        scrapResult: "",
      },
      reasonFormRules: {
        scrapResult: [
          { required: true, message: "请输入报废原因", trigger: "blur" },
        ],
      },
      deleteDialogVisible: false,
      deleteColumns: deleteReasonErrorColumns,
      deleteErrorData: [],
      templateLoading: false,
      assetTemaplateId: null,
      printTemplates: [],
      assetTemplates: [],
      customDialogVisible: false,
      step: false,
      templateItem: {},
      typeLoading: false,
      assetTypeProps: {
        children: "children",
        label: "classifyName",
        value: "_id",
      },
      assetTypes: [],
      selectAsaetTypes: [],
      typeSearch: "",
      classForm: {
        classifyName: null,
        code: null,
        date: null,
        subId: null,
        hierarchy: null,
        subName: null,
      },
      classFormRules: {
        classifyName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        date: [{ required: true, message: "请输入使用期限", trigger: "blur" }],
        code: [{ required: true, message: "请输入分类编码", trigger: "blur" }],
      },
      tempForm: {
        id: null,
        subId: null,
      },
      addBillsDialogVisible: false,
      addLoading: {
        target: ".add-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      addForm: {
        addClassName: null,
        addCode: null,
        date: 12,
        subId: null,
      },
      addFormRules: {
        addClassName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        date: [{ required: true, message: "请输入使用期限", trigger: "blur" }],
      },
      standardDialogVisible: false,
      standardLoading: {
        target: ".standard-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      typesStandard: [],
      readDialogVisible: false,
      file: {
        value: "",
        name: "",
      },
      setp: "upload",
      percentage: 0,
      errorText: "",
      readLoading: false,
      mapKey: {
        "资产分类编码（必填）": "code",
        "资产分类名称（必填）": "classifyName",
        "年限（月）（必填）": "date",
        上级资产分类编码: "subcode",
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    isEdit() {
      if (
        this.classForm.hierarchy &&
        this.classForm.hierarchy.split("|")[0] == "G"
      )
        return true;
      return false;
    },
    scrapTables() {
      const search = this.andLike;
      if (search) {
        return this.scrapReasonBills.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search) > -1;
          });
        });
      }
      return this.scrapReasonBills;
    },
  },
  watch: {
    assetTypes(val) {
      if (val.length != 0) {
        this.$nextTick(() => {
          document.querySelector(".el-tree-node__content").click();
        });
      }
    },
    typeSearch(val) {
      this.$refs.typeTreeRef.filter(val);
    },
  },
  methods: {
    settingsTabClick(e) {
      if (e.name == "thirdy") this.getScrapReasonBills();
      else if (e.name == "second") this.getAssetTemplates();
    },
    // 报废原因
    getScrapReasonBills() {
      this.tableLoading = true;
      select({
        func: "S0012",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.total = data.data.length;
          this.scrapReasonBills = data.data;
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error("服务器网络错误，请求报废原因失败");
        });
    },
    handleSelectionChange(val) {
      this.selectScrapReasonBills = val;
    },
    editReasonForm(row) {
      this.reasonForm._id = row._id;
      this.reasonForm.scrapResult = row.scrapResult;
      this.reasonBillsDialogVisible = true;
    },
    deleteReasonForm(row) {
      this.$confirm("此操作将永久删除该原因, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableLoading = true;
          deleteData({
            func: "D0015",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              _id: row._id,
              permissonId: 22,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) {
                this.tableLoading = false;
                return this.$message.err(data.data);
              }
              this.getScrapReasonBills();
            })
            .catch(() => {
              this.tableLoading = false;
              this.$message.error("服务器网络错误，删除报废原因失败");
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    reasonBillsDialogOpened() {
      this.$refs.reasonFormRef.clearValidate();
    },
    reasonBillsDialogClose() {
      this.reasonForm._id = "";
      this.reasonForm.scrapResult = "";
    },
    sbumitReasonForm() {
      this.$refs.reasonFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.reasonLoading);
        let permissonId = this.reasonForm._id == "" ? 20 : 21;
        update({
          func: "U0015",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: this.reasonForm._id,
            scrapResult: this.reasonForm.scrapResult,
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.reasonBillsDialogVisible = false;
            this.getScrapReasonBills();
            this.$message.success(data.data);
          })
          .catch(() => {
            LOADING.close();
            this.$message.error("服务器网络错误，新增编辑报废原因失败");
          });
      });
    },
    deleteDialogVisibleClosed() {
      this.deleteErrorData = [];
    },
    deleteReasons() {
      if (!this.selectScrapReasonBills.length) {
        return this.$message.error("请选择要删除的报废原因");
      }
      this.$confirm("此操作将永久删除该原因, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableLoading = true;
          this.deleteErrorData = [];
          this.multiDeleteReason(0);
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    multiDeleteReason(index) {
      if (index > this.selectScrapReasonBills.length - 1) {
        this.paginationForm.currentPage = 1;
        this.getScrapReasonBills();
        this.$refs["billsTableRef"].$refs["dsTableRef"].clearSelection();
        if (this.deleteErrorData.length) {
          this.deleteDialogVisible = true;
        } else {
          this.$message.success("删除报废原因成功");
        }
        return;
      }
      deleteData({
        func: "D0015",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          _id: this.selectScrapReasonBills[index]._id,
          permissonId: 22,
        },
      })
        .then(({ data }) => {
          if (data.code != 0) {
            this.deleteErrorData.push({
              scrapResult: this.selectScrapReasonBills[index].scrapResult,
              reason: data.data,
            });
          }
          this.multiDeleteReason(++index);
        })
        .catch(() => {
          this.deleteErrorData.push({
            scrapResult: this.selectScrapReasonBills[index].scrapResult,
            reason: "服务器网络错误",
          });
          this.multiDeleteReason(++index);
        });
    },
    // 资产打印模版
    customDialogVisibleClosed() {
      this.templateItem = {};
      this.step = false;
    },
    getAssetTemplates() {
      this.templateLoading = true;
      this.assetTemaplateId = window.localStorage.getItem("assetTemaplateId");
      select({
        func: "S0019",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(async ({ data }) => {
          this.templateLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.assetTemplates = data.data;
          if (!data.data.some((item) => item._id == this.assetTemaplateId)) {
            this.assetTemaplateId = data.data[0]._id;
            localStorage.setItem("assetTemaplateId", this.assetTemaplateId);
          }
          this.printTemplates = [];
          for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].html) {
              // 1.新方式
              let element = document.createElement("div");
              element.style.position = "fixed";
              element.style.top = "-10000px";
              document.body.appendChild(element);
              let base64 = await dataToPrintImg(
                data.data[i],
                element,
                undefined
              );
              document.body.removeChild(element);
              this.printTemplates.push({
                _id: data.data[i]._id,
                base: base64,
                title: data.data[i].name,
                edit: true,
              });
            } else {
              // 2.旧方式
              let canvas = document.createElement("CANVAS");
              let tagItemInfo = await getCanvasTemplate(
                data.data[i],
                canvas,
                undefined,
                false
              );
              tagItemInfo._id = data.data[i]._id;
              tagItemInfo.edit = data.data[i].false;
              this.printTemplates.push(tagItemInfo);
            }
            // let element = document.createElement("div");
            // element.style.position = "fixed";
            // element.style.top = "-1000px";
            // document.body.appendChild(element);
            // let base64 = await dataToPrintImg(testData[i], element, undefined);
            // document.body.removeChild(element);
            // this.printTemplates.push({
            //   _id: testData[i]._id,
            //   base: base64,
            //   title: testData[i].name,
            // });
          }
        })
        .catch(() => {
          this.templateLoading = false;
          this.$message.error("服务器网络异常，请求资产打印模版异常");
        });
    },
    checkAssesTemplate(_id) {
      this.assetTemaplateId = _id;
      window.localStorage.setItem("assetTemaplateId", _id);
    },
    deleteAssetTemplate(_id) {
      if (_id == this.assetTemaplateId) {
        return this.$notify.error({
          title: "错误",
          message: "选中项无法删除",
        });
      }
      if (_id <= 7) {
        return this.$notify.error({
          title: "错误",
          message: "默认模板不可删除",
        });
      }
      this.$confirm("是否确认删除该模板,删除后该模板永久丢失", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.templateLoading = true;
          deleteData({
            func: "D0018",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              _id: _id,
              permissonId: 57,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) {
                this.templateLoading = false;
                return this.$message.error(data.data);
              }
              this.getAssetTemplates();
              this.$message.success(data.data);
            })
            .catch(() => {
              this.templateLoading = false;
              this.$message.error("服务器网络错误，删除打印资产模版失败");
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    editAssetTemplate(index) {
      this.templateItem = this.assetTemplates[index];
      this.customDialogVisible = true;
      this.step = true;
    },
    addAssetTempalte() {
      this.customDialogVisible = true;
    },
    // 资产分类
    getAssetTypes() {
      this.typeLoading = true;
      select({
        func: "S0006",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          this.typeLoading = false;
          if (data.code != 0) return this.$message.error(data.data);
          this.assetTypes = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          this.typeLoading = false;
          this.$message.error("服务器网络错误，请求资产分类失败");
        });
    },
    assetTypesNodeClick(data) {
      this.$refs.classFormRef.clearValidate();
      this.tempForm.id = null;
      this.tempForm.subId = null;
      this.classForm.hierarchy = null;
      this.selectAsaetTypes = JSON.parse(JSON.stringify(this.assetTypes));
      if (data) {
        this.$nextTick(() => {
          this.$refs.typeTreeSelectRef.removeNode(data);
        });
        this.classForm.id = data._id;
        this.classForm.classifyName = data.classifyName;
        this.classForm.code = data.code;
        this.classForm.subId = data.subId;
        this.classForm.hierarchy = data.hierarchy;
        this.classForm.date = data.date;
        this.tempForm.id = data._id;
        this.tempForm.subId = data.subId;
      }
    },
    typeFilterNodeMethod(value, data) {
      if (!value) return true;
      return data.classifyName.indexOf(value) !== -1;
    },
    deleteAssetType() {
      this.$confirm("此操作将永久删除该资产分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteData({
            func: "D0007",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              _id: this.classForm.id,
              permissonId: 17,
            },
          })
            .then(({ data }) => {
              if (data.code != 0) {
                return this.$notify.error({
                  title: "错误",
                  message: data.data,
                });
              }
              this.$refs.classFormRef.resetFields();
              this.classForm.hierarchy = null;
              this.getAssetTypes();
              this.$message.success(data.data);
            })
            .catch(() => {
              this.$message.error("服务器网络异常，删除资产分类失败");
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    editAssetType() {
      this.$refs.classFormRef.validate((valid) => {
        if (!valid) return false;
        let permissonId = 18;
        if (this.assetTypes.length == 0) permissonId = 16;
        update({
          func: "U0013",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            classifyName: this.classForm.classifyName,
            _id: this.classForm.id,
            code: this.classForm.code,
            date: this.classForm.date,
            subId: this.classForm.subId,
            permissonId: permissonId,
          },
        })
          .then(({ data }) => {
            if (data.code != 0) return this.$message.error(data.data);
            this.getAssetTypes();
            this.$message.success(data.data);
          })
          .catch(() => {
            this.$message.error("服务器网络异常");
          });
      });
    },
    newSameType() {
      this.addForm.subId = this.tempForm.subId;
      this.addBillsDialogVisible = true;
    },
    newSubType() {
      this.addForm.subId = this.tempForm.id;
      this.addBillsDialogVisible = true;
    },
    addBillsDialogOpened() {},
    addBillsDialogClose() {
      this.$refs["addFormRef"].resetFields();
    },
    sbumitAddForm() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return false;
        const LOADING = this.$loading(this.addLoading);
        update({
          func: "U0013",
          userId: this.userInfo._id,
          token: this.userInfo.token,
          requstData: {
            _id: "",
            classifyName: this.addForm.addClassName,
            code: this.addForm.addCode,
            date: this.addForm.date,
            subId: this.addForm.subId,
            permissonId: 16,
          },
        })
          .then(({ data }) => {
            LOADING.close();
            if (data.code != 0) return this.$message.error(data.data);
            this.addBillsDialogVisible = false;
            this.getAssetTypes();
            this.$message.success(data.data);
          })
          .catch(() => {
            LOADING.close();
            this.$message.error("服务器网络异常，新增资产分类失败");
          });
      });
    },
    standardDialogOpened() {
      const LOADING = this.$loading(this.standardLoading);
      select({
        func: "S0047",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      })
        .then(({ data }) => {
          LOADING.close();
          if (data.code != 0) return this.$message.error(data.data);
          this.typesStandard = transListDataToTreeData(data.data, null);
        })
        .catch(() => {
          LOADING.close();
          this.$message.error("服务器网络错误，请求国标失败");
        });
    },
    standardDialogClose() {
      this.typesStandard = [];
    },
    sbumitStandardForm() {
      const LOADING = this.$loading(this.standardLoading);
      let standardIds = this.$refs.standardTreeRef.getCheckedKeys();
      let standardHalfIds = this.$refs.standardTreeRef.getHalfCheckedKeys();
      let ids = [...standardIds, ...standardHalfIds].join(",");
      update({
        func: "U0053",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          classify: ids,
          permissonId: 16,
        },
      })
        .then(({ data }) => {
          LOADING.close();
          if (data.code != 0) return this.$message.error(data.data);
          this.standardDialogVisible = false;
          this.getAssetTypes();
          this.$message.success(data.data);
        })
        .catch(() => {
          LOADING.close();
          return this.$message.error("服务器网络错误，添加国标失败");
        });
    },
    readDialogVisibleClosed() {
      this.file.value = "";
      this.file.name = "";
      this.setp = "upload";
      this.percentage = 0;
      this.errorText = "";
    },
    downloadImportFile() {
      clickDownloadLink(window.$EXCEL_URL + this.$t("h.assetTemplate2") +".xlsx");
    },
    readDialogVisibleSubmit() {
      if (!this.file.value)
        return this.$notify.error({
          title: "提示",
          message: "请选择要上传的Excel文件",
        });
      this.readExcel();
    },
    readExcel() {
      this.readLoading = true;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
            cellDates: false,
          });
          const wsname = workbook.SheetNames[0];
          // 解析为json,打印ws 就可以看到读取出的表格数据
          const ws = XLSX.utils
            .sheet_to_json(workbook.Sheets[wsname])
            .splice(1);
          if (!ws.length) {
            this.readLoading = false;
            return this.$notify.error({
              title: "错误",
              message: "该Excel表为空表",
            });
          }
          let crackExcelData = [];
          for (let i = 0; i < ws.length; i++) {
            let ExecekRow = {};
            for (let key in ws[i]) ExecekRow[this.mapKey[key]] = ws[i][key];
            crackExcelData.push(ExecekRow);
          }
          this.readLoading = false;
          this.setp = "loading";
          this.percentage = 50;
          update({
            func: "U0055",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              classify: crackExcelData,
              permissonId: 16,
            },
          })
            .then(({ data }) => {
              this.percentage = 100;
              if (data.code != 0) {
                this.setp = "result";
                this.errorText = data.data;
                return;
              }
              this.setp = "result";
              this.getAssetTypes();
            })
            .catch(() => {
              this.percentage = 100;
              this.setp = "result";
              this.errorText = "服务器网络错误，请稍后再试";
            });
        } catch (error) {
          this.readLoading = false;
          this.$notify({ title: "错误", message: "excel解析失败" });
        }
      };
      fileReader.readAsBinaryString(this.file.value);
    },
  },
  created() {
    this.getAssetTypes();
    let newMapKey = [
      this.$t("h.fileDownload4"),
      this.$t("h.fileDownload5"),
      this.$t("h.fileDownload6"),
      this.$t("h.fileDownload7"),
    ];
    const keys = [];
    for (var key in this.mapKey) {
      keys.push(key);
    }
    let str1 = JSON.stringify(this.mapKey);
    //tarKeys的数组长度和this.mapKey的key值长度一致，不一致也没影响，无论谁多谁少
    for (let i = 0; i < newMapKey.length; i++) {
      str1 = str1.replace(keys[i], newMapKey[i]);
    }
    this.mapKey = JSON.parse(str1);
  },
};
</script>
<style lang="scss" scoped>
.settings {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .reason-card,
  .template-card {
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
  .type-tab-pane {
    display: flex;
    overflow: auto;
  }
  .tree-card {
    padding: 0 15px;
    min-width: 335px;
    width: 700px;
    overflow: hidden;
    box-shadow: 0px 0px 20px 0px rgba(17, 10, 80, 0.1);
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
  .edit-card {
    padding: 0 15px;
    margin-left: 20px;
    min-width: 700px;
    width: 100%;
    height: 426px;
    box-sizing: border-box;
    box-shadow: 0px 0px 20px 0px rgba(17, 10, 80, 0.1);
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
.reason-card-header {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.reason-card-content {
  height: 100%;
  .bills-table {
    margin-top: 10px;
    height: calc(100% - 50px);
    .line {
      vertical-align: middle;
      margin: 0 10px;
      border-right: 2px solid #000;
    }
  }
  .bills-pagination {
    height: 40px;
  }
}
.template-card-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 18px;
}
.template-card-content {
  margin: 10px 0;
  height: calc(100% - 20px);
  overflow: auto;
  .grid-content {
    position: relative;
    padding: 10px;
    margin-bottom: 10px;
    height: 280px;
    overflow: hidden;
    border-radius: 2px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      .mask-box {
        opacity: 1;
      }
    }
    .template-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 5px;
      box-shadow: 0px 0px 8px 0px rgba(10, 10, 10, 0.2);
    }
    .mask-box {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      opacity: 0;
      background: rgba(2, 29, 87, 0.2);
      transition: opacity 0.3s;
      -webkit-transition: opacity 0.3s; /* Safari */
    }
    .check-tempalate-btn {
      position: absolute;
      top: 8px;
      left: 10px;
      z-index: 2;
      outline: none;
      border: none;
      border-radius: 50%;
      background-color: #588ab9;
      .el-icon-check {
        padding: 4px;
        font-size: 18px;
        color: #fff;
      }
    }
    .delete-template-btn {
      position: absolute;
      top: 8px;
      right: 10px;
      z-index: 2;
      outline: none;
      background-color: transparent;
      border: none;
      border-radius: 5px;
      transition: all 0.25s;
      .el-icon-close {
        transition: all 0.25s;
        padding: 4px;
        border-radius: 5px;
        font-size: 18px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        text-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
      }
      .el-icon-close:hover {
        border-radius: 50%;
        background: #d84d4e;
      }
    }
    .edit-template-btn {
      position: absolute;
      top: 8px;
      right: 40px;
      z-index: 2;
      outline: none;
      background-color: transparent;
      border: none;
      border-radius: 5px;
      transition: all 0.25s;
      .el-icon-edit {
        transition: all 0.25s;
        padding: 4px;
        border-radius: 5px;
        font-size: 18px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        text-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
      }
      .el-icon-edit:hover {
        border-radius: 50%;
        background: #588ab9;
      }
    }
    .pedding-add-asset {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      box-shadow: 0px 0px 8px 0px rgba(10, 10, 10, 0.2);
      color: #588ab9;
      font-size: 36px;
    }
  }
  .title {
    height: 25px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
}
.tree-card-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  .add-national-standard {
    margin-left: 10px;
  }
}
.tree-card-content {
  padding: 10px 0;
  height: 100%;
  box-sizing: border-box;
  .tree-type-search {
    padding: 0 0 10px 0;
    overflow: hidden;
  }
  .tree-type-list {
    height: calc(100% - 42px);
    overflow: auto;
    .parentIcon {
      font-size: 20px;
    }
    .childIcon {
      font-size: 20px;
    }
  }
}
.edit-card-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  font-size: 18px;
  font-weight: bold;
}
.edit-card-content {
  height: 100%;
  .edit-form {
    margin: 20px;
    width: 450px;
  }
  .edit-btns {
    text-align: center;
  }
}
::v-deep .el-tabs {
  height: 100%;
  .el-tabs__header {
    height: 60px;
    margin: 0;
    background: #fff;
    border-top: 1px solid #eeeeee;
    box-sizing: border-box;
    .el-tabs__nav-wrap {
      height: 60px;
      &::after {
        display: none;
      }
      .el-tabs__nav-scroll {
        height: 60px;
        .el-tabs__nav {
          height: 60px;
          margin-left: 136px;
          .el-tabs__item {
            height: 60px;
            line-height: 60px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #73727f;
          }
          .el-tabs__active-bar {
            height: 4px;
            border-radius: 2px;
            background: #588ab9;
          }
          .is-active {
            color: #588ab9;
            font-weight: bold;
          }
        }
      }
    }
  }
  .el-tabs__content {
    padding: 15px;
    height: calc(100% - 90px) !important;
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
