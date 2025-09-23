<template>
  <!-- Type（资产分类设置） -->
  <div class="type">
    <el-card class="tree-card">
      <div slot="header" class="tree-card-header">
        <el-dropdown>
          <el-button size="mini" trigger="click" type="primary">
            {{ $t("h.newBtn")
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="newSameType">{{
              $t("h.peer")
            }}</el-dropdown-item>
            <el-dropdown-item @click.native="newSubType">{{
              $t("h.child")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          v-if="lang == 'ZH'"
          size="mini"
          class="add-national-standard"
          @click="standardDialogVisible = true"
          >{{ $t("h.addNationalStandard") }}</el-button
        >
        <el-button :class="{marginLeft:lang=='EN'}" size="mini" @click="readDialogVisible = true">
          {{ $t("h.bulkBtn") }}</el-button
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
              <span class="text">
                {{ data.code + "-" + node.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-card>
    <el-card class="edit-card">
      <div slot="header" class="edit-card-header">
        <span>{{ $t("h.assetCategory") }}</span>
      </div>
      <div class="edit-card-content">
        <div class="edit-form">
          <el-form
            ref="classFormRef"
            label-width="165px"
            label-position="right"
            :model="classForm"
            :rules="classFormRules"
          >
            <el-form-item :label="$t('h.categoryCode')" prop="code">
              <el-input :disabled="isEdit" v-model="classForm.code"></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.categoryName')" prop="classifyName">
              <el-input
                :disabled="isEdit"
                v-model="classForm.classifyName"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.superiorName')" prop="subName">
              <ds-select-tree
                ref="typeTreeSelectRef"
                :placeholder="$t('h.tips4') + $t('h.superiorName')"
                v-model="classForm.subId"
                :disabled="isEdit"
                :treeData="selectAsaetTypes"
                :defaultProps="assetTypeProps"
                :expand-on-click-node="false"
              >
              </ds-select-tree>
            </el-form-item>
            <el-form-item :label="$t('h.serviceLifeMonth')" prop="date">
              <el-input-number
                v-model="classForm.date"
                :min="1"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div class="edit-btns">
          <el-button type="danger" size="small" @click="deleteAssetType">{{
            $t("h.delBtn")
          }}</el-button>
          <el-button type="primary" size="small" @click="editAssetType">{{
            $t("h.saveBtn")
          }}</el-button>
        </div>
      </div>
    </el-card>
    <!-- 新建分类 -->
    <new-bills-dialog
      class="add-bill-dialog"
      :title="$t('h.title02')"
      :newBillsDialogVisible.sync="addBillsDialogVisible"
      @close="addBillsDialogClose"
      @sbumitForm="sbumitAddForm"
    >
      <template slot="form">
        <el-form
          ref="addFormRef"
          label-width="155px"
          :rules="addFormRules"
          :model="addForm"
        >
          <el-form-item :label="'* ' + $t('h.categoryCode')" prop="addCode">
            <el-input v-model="addForm.addCode"></el-input>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('h.title92')"
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
          <el-form-item :label="$t('h.categoryName')" prop="addClassName">
            <el-input v-model="addForm.addClassName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('h.superiorName')" prop="subName">
            <ds-select-tree
              v-model="addForm.subId"
              :disabled="true"
              :defaultProps="assetTypeProps"
              :treeData="assetTypes"
            >
              <!-- :initData="addForm.subId" -->
            </ds-select-tree>
          </el-form-item>
          <el-form-item :label="$t('h.serviceLifeMonth')" prop="date">
            <el-input-number
              v-model="addForm.date"
              :min="1"
            ></el-input-number> </el-form-item
        ></el-form>
      </template>
    </new-bills-dialog>
    <!-- 添加国标 -->
    <new-bills-dialog
      class="standard-bill-dialog"
      :title="$t('h.title01')"
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
    <!-- 导入分类 -->
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
  </div>
</template>
<script>
import DsSearch from "@/components/DsSearch";
import ReadExcelFile from "@/components/ReadExcelFile";
import UploadExcelFile from "@/components/ReadExcelFile/components/UploadExcelFile.vue";
import DsSelectTree from "@/components/DsSelectTree";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import * as XLSX from "xlsx";
import { mapState } from "vuex";
import { deleteData, select, update } from "@/assets/api";
import { transListDataToTreeData } from "@/utils/getTreeStructData";
import { clickDownloadLink } from "@/utils/basic-methods";
export default {
  components: {
    DsSearch,
    ReadExcelFile,
    UploadExcelFile,
    DsSelectTree,
    NewBillsDialog,
  },
  data() {
    return {
      lang: "ZH",
      standardDialogVisible: false,
      standardLoading: {
        target: ".standard-bill-dialog",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      readDialogVisible: false,
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
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.categoryName"),
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.usagePeriod"),
            trigger: "blur",
          },
        ],
      },
      tempForm: {
        id: null,
        subId: null,
      },
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
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.categoryName"),
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.usagePeriod"),
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.categoryCode"),
            trigger: "blur",
          },
        ],
      },
      typeLoading: false,
      typeSearch: "",
      assetTypes: [],
      selectAsaetTypes: [],
      assetTypeProps: {
        children: "children",
        label: "classifyName",
        value: "_id",
      },
      typesStandard: [],
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
    // 请求资产分类
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
          this.$nextTick(() => {
            this.$refs.typeTreeRef.filter(this.typeSearch);
          });
        })
        .catch(() => {
          this.typeLoading = false;
          // "服务器网络错误，请求资产分类失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 新建同级分类
    newSameType() {
      this.addForm.subId = this.tempForm.subId;
      this.addBillsDialogVisible = true;
    },
    // 新建下级分类
    newSubType() {
      this.addForm.subId = this.tempForm.id;
      this.addBillsDialogVisible = true;
    },
    // 树状分类搜索
    typeFilterNodeMethod(value, data) {
      if (!value) return true;
      return data.classifyName.indexOf(value) !== -1;
    },
    // 树状分类点击选中
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
    // 删除分类
    deleteAssetType() {
      this.$confirm(this.$t("h.tips155"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
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
                  title: this.$t("h.title27"),
                  message: data.data,
                });
              }
              this.$refs.classFormRef.resetFields();
              this.classForm.hierarchy = null;
              this.getAssetTypes();
              this.$message.success(data.data);
            })
            .catch(() => {
              // "服务器网络异常，删除资产分类失败"
              this.$message.error(this.$t("h.tips18"));
            });
        })
        .catch(() => {
          this.$message.info(this.$t("h.tips98"));
        });
    },
    // 编辑保存分类
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
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // 新建分类弹窗关闭
    addBillsDialogClose() {
      this.$refs["addFormRef"].resetFields();
    },
    // 提交新建分类信息
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
            // "服务器网络异常，新增资产分类失败"
            this.$message.error(this.$t("h.tips18"));
          });
      });
    },
    // 国标分类弹窗开启
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
          // "服务器网络错误，请求国标失败"
          this.$message.error(this.$t("h.tips18"));
        });
    },
    // 国标分类弹窗关闭
    standardDialogClose() {
      this.typesStandard = [];
    },
    // 提交国标分类信息
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
          // "服务器网络错误，添加国标失败"
          return this.$message.error(this.$t("h.tips18"));
        });
    },
    // 下载导入文件
    downloadImportFile() {
      clickDownloadLink(window.$EXCEL_URL + this.$t("h.assetTemplate2") + ".xlsx");
    },
    // 导入弹窗关闭
    readDialogVisibleClosed() {
      this.file.value = "";
      this.file.name = "";
      this.setp = "upload";
      this.percentage = 0;
      this.errorText = "";
    },
    // 提交导入文件
    readDialogVisibleSubmit() {
      if (!this.file.value)
        return this.$notify.error({
          title: this.$t("h.title18"),
          message: this.$t("h.title93"),
        });
      this.readExcel();
    },
    // 解析导入文件
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
          const ws = XLSX.utils
            .sheet_to_json(workbook.Sheets[wsname])
            .splice(1);
          if (!ws.length) {
            this.readLoading = false;
            return this.$notify.error({
              title: this.$t("h.title27"),
              message: this.$t("h.tips131"),
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
              // "服务器网络错误，请稍后再试"
              this.errorText = this.$t("h.tips18");
            });
        } catch (error) {
          this.readLoading = false;
          this.$notify({
            title: this.$t("h.title27"),
            message: this.$t("h.tips156"),
          });
        }
      };
      fileReader.readAsBinaryString(this.file.value);
    },
  },
  created() {
    this.getAssetTypes();
    this.lang = localStorage.getItem("lang");
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
.type {
  padding: 15px;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  box-sizing: border-box;
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
    .text {
      font-size: 14px;
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
.marginLeft {
  margin-left: 5px;
}
</style>
