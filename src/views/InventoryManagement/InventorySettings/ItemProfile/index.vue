<template>
  <div class="ItemProfile">
    <el-card class="box-card">
      <div class="classification">
        <div class="dropdown">
          <el-dropdown @command="sortOperation">
            <el-button type="primary">
              {{ $t("h.title194")
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">{{
                $t("h.title02")
              }}</el-dropdown-item>
              <el-dropdown-item command="batchAdd">{{
                $t("h.bulkBtn")
              }}</el-dropdown-item>
              <el-dropdown-item command="modify">{{
                $t("h.修改分类")
              }}</el-dropdown-item>
              <el-dropdown-item command="delete">{{
                $t("h.删除分类")
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-tree
          class="el-menu-vertical-demo"
          :data="subMenuList"
          :props="subMenuListProps"
          :highlight-current="highlightCurrent"
          node-key="sortingId"
          @node-click="sortingDataSwitching"
        >
          <span slot-scope="{ data }" class="span">
            <span class="icon">
              <template v-if="data.children == null">
                <svg-icon class="childIcon" icon-file-name="childGb"></svg-icon>
              </template>
              <template v-else>
                <svg-icon class="parentIcon" icon-file-name="gb"></svg-icon>
              </template>
            </span>
            <span class="text" style="font-size: 14px">
              {{ data.code }}-{{ data.name }}
            </span>
          </span>
        </el-tree>
        <!-- 新建分类数据填写 -->
        <el-dialog
          :title="functionConversion ? $t('h.title197') : $t('h.title02')"
          :visible.sync="classificationVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form
            :model="sortingData"
            :rules="sortingRules"
            ref="sortingData"
            label-width="80px"
          >
            <el-form-item :label="$t('h.categoryCode')" prop="code">
              <el-input v-model="sortingData.code"></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.categoryName')" prop="name">
              <el-input v-model="sortingData.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('h.classification')" prop="subId">
              <!-- <el-select
                v-model="sortingData.subId"
                placeholder="请选择上级分类"
              >
                <el-option
                  v-for="item in superiorSortingData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select> -->
              <el-cascader
                :options="componentSortingData"
                :props="{ checkStrictly: true }"
                v-model="sortingData.subId"
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
            <!-- <el-form-item label="备注" prop="renark">
              <el-input v-model="sortingData.renark"></el-input>
            </el-form-item> -->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">{{ $t("h.cancelBtn") }}</el-button>
            <el-button
              type="primary"
              v-if="!functionConversion"
              @click="addSorting"
              >{{ $t("h.confirmBtn") }}</el-button
            >
            <el-button type="primary" v-else @click="modifySorting">{{
              $t("h.saveBtn")
            }}</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="operation-area">
        <!-- 头部 -->
        <div class="header">
          <ds-query-form>
            <ds-query-form-left-panel>
              <ds-search-btn
                :searchValue.sync="andLike"
                @search="search"
              ></ds-search-btn>
            </ds-query-form-left-panel>
            <ds-query-form-right-panel>
              <el-button size="mini" @click="showAll">{{
                $t("h.showAllItems")
              }}</el-button>
              <el-button size="mini" @click="exportFile">{{
                $t("h.title195")
              }}</el-button>
              <el-button size="mini" @click="articleDialogVisible = true">{{
                $t("h.title196")
              }}</el-button>
              <el-button type="primary" size="mini" @click="addingFiles">{{
                $t("h.createANewFile")
              }}</el-button>
            </ds-query-form-right-panel>
          </ds-query-form>
        </div>
        <!-- 筛选区域 -->
        <div class="screen">
          <ds-query-form>
            <ds-query-form-left-panel>
              <ds-filter-tag
                :filterTagsData="highFilterTags"
                @handleCloseTag="handleCloseFilterTag"
              ></ds-filter-tag>
            </ds-query-form-left-panel>
            <ds-query-form-right-panel>
              <span
                class="advancedSearch"
                @click="filterDrawerVisible = true"
                >{{ $t("h.advancedBtn") }}</span
              >
            </ds-query-form-right-panel>
          </ds-query-form>
        </div>
        <!-- 表格主体 -->
        <div class="asset-table">
          <ds-table
            ref="tableRef"
            :loading="tableLoading"
            :tableData="assetTableDataDisplay"
            :columns="columns"
            :rowKey="(row) => row.code"
          >
            <template slot="operation" slot-scope="{ scope }">
              <el-button size="mini" @click="modifyFiles(scope.row)">{{
                $t("h.changeBtn")
              }}</el-button>
              <el-button size="mini" @click="disableeFiles(scope.row)">{{
                scope.row.status ? $t("h.enable") : $t("h.disabled")
              }}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteFiles(scope.row)"
                >{{ $t("h.delBtn") }}</el-button
              >
            </template>
            <template slot="status" slot-scope="{ scope }">
              <p>{{ scope.row.status ? $t("h.disabled") : $t("h.enable") }}</p>
            </template>
            <!-- @handleSelectionChange="handleSelectionChange"
          @checkTableRowDetail="checkTableRowDetail" -->
          </ds-table>
        </div>
        <!-- 分页区域 -->
        <div class="pagination">
          <ds-pagination
            small
            :total="total"
            :page.sync="paginationForm.currentPage"
            :limit.sync="paginationForm.pageSize"
            @pagination="changeSizePage"
          ></ds-pagination>
        </div>
        <!-- 新建档案数据填写 -->
        <!-- 
          modifyFileData  修改时传入的原始数据对象
          attrData  商品属性下拉选项数据。
          superiorSortingData 物品分类的级联数据
          functionChange  标识当前是“新增”还是“修改”模式。
         -->
        <new-files-dialog
          :newDialogVisible.sync="fileDialogVisible"
          :treeSeleteData="treeSeleteData"
          :modifyFileData="modifyFileData"
          :attrData="assetAttrData"
          :superiorSortingData="componentSortingData"
          :addingFilesComplate.sync="addingFilesComplate"
          :functionChange.sync="functionChange"
        ></new-files-dialog>
        <!-- 高级筛选 -->
        <ds-filter-drawer
          :filterDrawerVisible.sync="filterDrawerVisible"
          @resetFilterForm="resetFilterForm"
          @submitFilterForm="submitFilterForm"
        >
          <el-form
            :model="advancedFiltering"
            ref="advancedFiltering"
            label-width="80px"
          >
            <el-form-item :label="$t('h.state')" prop="status">
              <el-select
                v-model="advancedFiltering.status"
                :placeholder="$t('h.tips4') + $t('h.state')"
              >
                <el-option :label="$t('h.enable')" value="false"></el-option>
                <el-option :label="$t('h.disabled')" value="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('h.price')" prop="minPrice">
              <div class="inp-box">
                <el-input
                  class="input-small"
                  v-model="advancedFiltering.minPrice"
                  :placeholder="$t('h.formTips72')"
                  type="number"
                  @change="changeMinPrice"
                  min="0"
                ></el-input
                >&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;
                <el-input
                  class="input-small"
                  v-model="advancedFiltering.maxPrice"
                  :placeholder="$t('h.formTips73')"
                  type="number"
                  @change="changeMaxPrice"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item :label="$t('h.formTips70')" prop="minUpperSize">
              <div class="inp-box">
                <el-input
                  class="input-small"
                  v-model="advancedFiltering.minUpperSize"
                  :placeholder="$t('h.formTips72')"
                  type="number"
                  @change="changeMinUpperSize"
                  min="0"
                ></el-input
                >&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;
                <el-input
                  class="input-small"
                  v-model="advancedFiltering.maxUpperSize"
                  :placeholder="$t('h.formTips73')"
                  type="number"
                  @change="changeMaxUpperSize"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item :label="$t('h.formTips71')" prop="minLowerSize">
              <div class="inp-box">
                <el-input
                  class="input-small"
                  v-model="advancedFiltering.minLowerSize"
                  :placeholder="$t('h.formTips72')"
                  type="number"
                  @change="changeMinLowerSize"
                  min="0"
                ></el-input
                >&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;
                <el-input
                  class="input-small"
                  v-model="advancedFiltering.maxLowerSize"
                  :placeholder="$t('h.formTips73')"
                  type="number"
                  @change="changeMaxLowerSize"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item :label="$t('h.fuzzyQuery')" prop="andLike">
              <el-input v-model="advancedFiltering.andLike"></el-input>
            </el-form-item>
          </el-form>
        </ds-filter-drawer>
      </div>
      <!-- 分类批量导入 -->
      <read-excel-file
        :readDialogVisible.sync="classificationDialogVisible"
        :setp="classificationSetp"
        :percentage="classificationPercentage"
        :errorText="classificationErrorText"
        :title="$t('h.bulkBtn')"
        @download="downloadImportFile"
        @closed="readDialogVisibleClosed"
        @submit="readDialogVisibleSubmit"
      >
        <upload-excel-file
          :value.sync="classificationFile"
          :loading="classificationLoading"
        ></upload-excel-file>
      </read-excel-file>
      <!-- 物品批量导入 -->
      <read-excel-file
        :readDialogVisible.sync="articleDialogVisible"
        :setp="articleSetp"
        :percentage="articlePercentage"
        :errorText="articleErrorText"
        :title="$t('h.bulkBtn')"
        @download="articleDownloadImportFile"
        @closed="articleReadDialogVisibleClosed"
        @submit="articleReadDialogVisibleSubmit"
      >
        <upload-excel-file
          :value.sync="articleFile"
          :loading="articleLoading"
        ></upload-excel-file>
      </read-excel-file>
    </el-card>
  </div>
</template>
<script>
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsTable from "@/components/DsTable";
import NewFilesDialog from "@/components/ItemProfileComponents/NewFilesDialog";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsPagination from "@/components/DsPagination";
import ReadExcelFile from "@/components/ReadExcelFile";
import UploadExcelFile from "@/components/ReadExcelFile/components/UploadExcelFile.vue";
import DsFilterTag from "@/components/DsFilterTag";
import { itemFileColumns } from "@/utils/systemData";
import { warehouseOperate, select } from "@/assets/api";
import { clickDownloadLink } from "@/utils/basic-methods";
import { mapState } from "vuex";
export default {
  components: {
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    DsSearchBtn,
    DsTable,
    NewFilesDialog,
    DsFilterDrawer,
    DsPagination,
    ReadExcelFile,
    UploadExcelFile,
    DsFilterTag,
  },
  data() {
    return {
      highlightCurrent: true,
      assetAttrData: [],
      //用户
      userId: "",
      token: "",
      staffId: "",
      //物品分类
      subMenuList: [],
      subMenuListProps: { children: "children", label: "name" },
      classificationVisible: false,
      sortingData: { code: "", name: "", subId: "", renark: "" },
      sortingRules: {
        code: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.categoryCode"),
            trigger: ["blur", "change"],
          },
          // {
          //   pattern: /^[A-Za-z0-9]+$/,
          //   message: "分类编码只能数字/字母",
          //   trigger: ["change", "blur"],
          // },
        ],
        name: [
          {
            required: true,
            message: this.$t("h.tips3") + this.$t("h.categoryName"),
            trigger: ["blur", "change"],
          },
        ],
        subId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.categoryParent"),
            trigger: "change",
          },
        ],
      },
      superiorSortingData: [{ name: this.$t("h.title199"), value: "-" }],
      componentSortingData: [],
      functionConversion: false, //判断分类数据填写是修改还是新增
      treeSeleteData: "",
      flag: false, //只有进行物品分类修改时为true
      //物品档案
      fileDialogVisible: false,
      andLike: "",
      tableLoading: false,
      columns: itemFileColumns,
      assetTableData: [],
      addingFilesComplate: false, //用于检测是否完成档案更新
      functionChange: false, //判断物品档案数据填写是修改还是新增
      modifyFileData: {}, //修改物品档案时所用数据
      filterDrawerVisible: false, //高级筛选弹框
      advancedFiltering: {
        status: "",
        minPrice: "",
        maxPrice: "",
        minUpperSize: "",
        maxUpperSize: "",
        minLowerSize: "",
        maxLowerSize: "",
        andLike: "",
      }, //高级筛选数据
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      highFilterTags: [],
      //分类批量导入
      classificationDialogVisible: false,
      classificationSetp: "upload",
      classificationPercentage: 0,
      classificationErrorText: "",
      classificationFile: {
        value: "",
        name: "",
      },
      classificationLoading: false,
      // 物品批量导入
      articleDialogVisible: false,
      articleSetp: "upload",
      articlePercentage: 0,
      articleErrorText: "",
      articleFile: {
        value: "",
        name: "",
      },
      articleLoading: false,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    //分页
    total() {
      return this.assetTableData.length;
    },
    ////代替assetTableData的页面数据显示
    assetTableDataDisplay() {
      let start = 0;
      let end = this.paginationForm.pageSize - 1;
      let arr = [];
      //   当页数不等于1从start=end*this.paginationForm.currentPage - 1开始到所设置的数据条数
      if (this.paginationForm.currentPage == 1) {
        for (let i = start; i < end; i++) {
          if (this.assetTableData[i]) {
            arr.push(this.assetTableData[i]);
          }
        }
      } else {
        for (
          let i = end * (this.paginationForm.currentPage - 1);
          i < end * this.paginationForm.currentPage;
          i++
        ) {
          if (this.assetTableData[i]) {
            arr.push(this.assetTableData[i]);
          }
        }
      }
      return arr;
    },
    // newSuperiorSortingData() {
    //   let arr = this.subMenuList;
    //   arr.forEach((item) => {
    //     item.label = item.name;
    //     item.value = item.sortingId;
    //     if (item.children && item.children.length) {
    //       this.modify(item.children);
    //     }
    //   });
    //   arr.unshift({ label: "无上级", value: "-" });
    //   return arr;
    // },
  },
  methods: {
    // 获取资产属性
    async getAssetAttr() {
      const { data: res } = await select({
        func: "S0022",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {},
      });
      if (res.code != 0) return this.$message.error(res.data);
      this.assetAttrData = res.data;
    },
    //删除用户高级筛选填写数据
    handleCloseFilterTag(val) {
      switch (val.keyStr) {
        case "status":
          this.advancedFiltering.status = "";
          break;
        case "price":
          this.advancedFiltering.maxPrice = "";
          this.advancedFiltering.minPrice = "";
          break;
        case "upperSize":
          this.advancedFiltering.maxUpperSize = "";
          this.advancedFiltering.minUpperSize = "";
          break;
        case "lowerSize":
          this.advancedFiltering.maxLowerSize = "";
          this.advancedFiltering.minLowerSize = "";
          break;
        default:
          this.advancedFiltering.andLike = "";
      }
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      let requstData = {
        status: "",
        price: "",
        upperSize: "",
        lowerSize: "",
        andLike: "",
      };
      this.highFilterTags.forEach((item) => {
        for (let key in requstData) {
          if (item.keyStr == key) {
            requstData[key] = item.value;
          }
        }
      });
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "SU0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
              this.superiorSortingData.forEach((item2) => {
                if (item.sortingId == item2.value) {
                  item.sorting = item2.name;
                }
              });
            });
          } else {
            this.assetTableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //高级筛选最大最小数限制
    changeMaxLowerSize(val) {
      if (this.advancedFiltering.minLowerSize.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.advancedFiltering.maxLowerSize = (
          this.advancedFiltering.minLowerSize * 1 +
          1
        ).toString();
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.advancedFiltering.maxLowerSize.trim() == "" ||
        Number(this.advancedFiltering.maxLowerSize) <=
          Number(this.advancedFiltering.minLowerSize)
      ) {
        this.advancedFiltering.maxLowerSize = (
          this.advancedFiltering.minLowerSize * 1 +
          1
        ).toString();
      }
    },
    changeMinLowerSize(val) {
      if (this.advancedFiltering.maxLowerSize.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.advancedFiltering.minLowerSize = "0";
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.advancedFiltering.maxLowerSize.trim() == "" ||
        Number(this.advancedFiltering.maxLowerSize) < Number(val)
      ) {
        this.advancedFiltering.maxLowerSize = (val * 1 + 1).toString();
      }
    },
    changeMaxUpperSize(val) {
      if (this.advancedFiltering.minUpperSize.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.advancedFiltering.maxUpperSize = (
          this.advancedFiltering.minUpperSize * 1 +
          1
        ).toString();
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.advancedFiltering.maxUpperSize.trim() == "" ||
        Number(this.advancedFiltering.maxUpperSize) <=
          Number(this.advancedFiltering.minUpperSize)
      ) {
        this.advancedFiltering.maxUpperSize = (
          this.advancedFiltering.minUpperSize * 1 +
          1
        ).toString();
      }
    },
    changeMinUpperSize(val) {
      if (this.advancedFiltering.maxUpperSize.trim() == "" && val == "") {
        return;
      }
      let re = /^[0-9]+$/;
      if (!re.test(val)) {
        this.advancedFiltering.minUpperSize = "0";
        return this.$message.error(this.$t("h.tips255"));
      }
      if (
        this.advancedFiltering.maxUpperSize.trim() == "" ||
        Number(this.advancedFiltering.maxUpperSize) < Number(val)
      ) {
        this.advancedFiltering.maxUpperSize = (val * 1 + 1).toString();
      }
    },
    changeMaxPrice() {
      if (
        this.advancedFiltering.maxPrice.trim() == "" ||
        Number(this.advancedFiltering.maxPrice) <=
          Number(this.advancedFiltering.minPrice)
      ) {
        this.advancedFiltering.maxPrice = (
          this.advancedFiltering.minPrice * 1 +
          1
        ).toString();
      }
    },
    changeMinPrice(val) {
      if (
        this.advancedFiltering.maxPrice.trim() == "" ||
        Number(this.advancedFiltering.maxPrice) < Number(val)
      ) {
        this.advancedFiltering.maxPrice = (val * 1 + 1).toString();
      }
    },
    // 分页功能
    // 设置条数 页数
    changeSizePage(val) {
      this.paginationForm.currentPage = val.page;
      this.paginationForm.pageSize = val.limit;
    },
    //物品确定上传文件
    articleReadDialogVisibleSubmit() {
      if (!this.articleFile.value)
        return this.$notify.error({
          title: this.$t("h.title18"),
          message: this.$t("h.title93"),
        });
      this.articleReadExcel();
    },
    articleReadExcel() {
      this.articleLoading = true;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.articleFile.value);
      fileReader.onload = (ev) => {
        try {
          let data = ev.target.result;
          data = data.split("base64,")[1];
          this.articleLoading = false;
          this.articleSetp = "loading";
          this.articlePercentage = 50;
          warehouseOperate({
            func: "SU0005",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              base64: data,
              permissonId: 16,
            },
          })
            .then(({ data }) => {
              this.articlePercentage = 100;
              if (data.code != 0) {
                this.articleSetp = "result";
                this.articleErrorText = data.data;
                return;
              }
              this.articleSetp = "result";
              this.getClassificationData();
            })
            .catch(() => {
              this.articlePercentage = 100;
              this.articleSetp = "result";
              // 服务器网络错误，请稍后再试
              this.articleErrorText = this.$t("h.tips18");
            });
        } catch (error) {
          this.articleLoading = false;
          this.$notify({
            title: this.$t("h.title27"),
            message: this.$t("h.tips156"),
          });
        }
      };
    },
    // 物品关闭批量导入
    articleReadDialogVisibleClosed() {
      this.articleFile.value = "";
      this.articleFile.name = "";
      this.articleSetp = "upload";
      this.articlePercentage = 0;
      this.articleErrorText = "";
    },
    //物品下载文件模板
    articleDownloadImportFile() {
      clickDownloadLink(window.$EXCEL_URL + "物品档案导入模板.xlsx");
    },
    //分类确定上传文件
    readDialogVisibleSubmit() {
      if (!this.classificationFile.value)
        return this.$notify.error({
          title: this.$t("h.title18"),
          message: this.$t("h.title93"),
        });
      this.readExcel();
    },
    readExcel() {
      this.classificationLoading = true;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.classificationFile.value);
      fileReader.onload = (ev) => {
        try {
          let data = ev.target.result;
          data = data.split("base64,")[1];
          this.classificationLoading = false;
          this.classificationSetp = "loading";
          this.classificationPercentage = 50;
          warehouseOperate({
            func: "SO0005",
            userId: this.userInfo._id,
            token: this.userInfo.token,
            requstData: {
              base64: data,
              permissonId: 16,
            },
          })
            .then(({ data }) => {
              this.classificationPercentage = 100;
              if (data.code != 0) {
                this.classificationSetp = "result";
                this.classificationErrorText = data.data;
                return;
              }
              this.classificationSetp = "result";
              this.getClassificationData();
            })
            .catch(() => {
              this.classificationPercentage = 100;
              this.classificationSetp = "result";
              // 服务器网络错误，请稍后再试
              this.classificationErrorText = this.$t("h.tips18");
            });
        } catch (error) {
          this.classificationLoading = false;
          this.$notify({
            title: this.$t("h.title27"),
            message: this.$t("h.tips156"),
          });
        }
      };
    },
    // 分类关闭批量导入
    readDialogVisibleClosed() {
      this.classificationFile.value = "";
      this.classificationFile.name = "";
      this.classificationSetp = "upload";
      this.classificationPercentage = 0;
      this.classificationErrorText = "";
    },
    //分类下载文件模板
    downloadImportFile() {
      clickDownloadLink(window.$EXCEL_URL + "物品分类导入模板.xlsx");
    },
    // 导出
    exportFile() {
      // if (!this.treeSeleteData) return this.$message.error("没有选中分类");
      let requstData = { pull: 1 };
      if (this.treeSeleteData.sortingId) {
        requstData.sortingId = this.treeSeleteData.sortingId;
      }
      warehouseOperate({
        func: "SU0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          clickDownloadLink(window.$EXCEL_URL + data.data);
          this.$message.success(this.$t("h.exportSuccessful"));
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //classificationVisible关闭
    handleClose() {
      this.sortingData = { code: "", name: "", subId: "", renark: "" };
      this.$refs["sortingData"].resetFields();
      if (this.flag) this.treeSeleteData = "";
      this.classificationVisible = false;
      this.functionConversion = false;
      this.flag = false;
    },
    //分类操作
    sortOperation(command) {
      if (command == "add") {
        this.componentSortingData.unshift({
          name: this.$t("h.title199"),
          label: this.$t("h.title199"),
          value: "-",
          sortingId: "-",
        });
        this.classificationVisible = true;
      } else if (command == "modify") {
        if (!this.treeSeleteData)
          return this.$message.error(this.$t("h.tips262"));
        this.classificationVisible = true;
        this.functionConversion = true;
        //this.superiorSortingData = this.superiorSortingData.filter(
        //   (item) => item.name != this.treeSeleteData.name
        // );
        // if (
        //   this.treeSeleteData.children &&
        //   this.treeSeleteData.children.length
        // ) {
        //   this.treeSeleteData.children.forEach((children) => {
        //     this.superiorSortingData = this.superiorSortingData.filter(
        //       (item) => item.name != children.name
        //     );
        //   });
        // }
        this.changeData(
          this.componentSortingData,
          this.treeSeleteData.sortingId
        );
        this.sortingData.code = this.treeSeleteData.code;
        this.sortingData.name = this.treeSeleteData.name;
        this.sortingData.subId = [this.treeSeleteData.subId];
        this.sortingData.renark = this.treeSeleteData.renark;
      } else if (command == "delete") {
        if (!this.treeSeleteData)
          return this.$message.error(this.$t("h.tips262"));
        this.deleteSorting();
      } else if (command == "batchAdd") {
        this.classificationDialogVisible = true;
      }
    },
    //新建分类
    addSorting() {
      this.$refs["sortingData"].validate((valid) => {
        if (!valid) return false;
        warehouseOperate({
          func: "SO0002",
          userId: this.userId,
          token: this.token,
          requstData: {
            code: this.sortingData.code,
            name: this.sortingData.name,
            subId:
              this.sortingData.subId.length > 1
                ? this.sortingData.subId[this.sortingData.subId.length - 1]
                : this.sortingData.subId.join(),
            renark: this.sortingData.renark,
          },
        })
          .then(({ data }) => {
            if (data.code == "-1") return this.$message.error(data.data);
            this.$message.success(data.data);
            this.getClassificationData();
            this.sortingData = { code: "", name: "", subId: "", renark: "" };
            this.$refs["sortingData"].resetFields();
            this.classificationVisible = false;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      });
    },
    //修改分类
    modifySorting() {
      this.$refs["sortingData"].validate((valid) => {
        if (!valid) return false;
        warehouseOperate({
          func: "SO0003",
          userId: this.userId,
          token: this.token,
          requstData: {
            sortingId: this.treeSeleteData.sortingId,
            code: this.sortingData.code,
            name: this.sortingData.name,
            subId:
              this.sortingData.subId.length > 1
                ? this.sortingData.subId[this.sortingData.subId.length - 1]
                : this.sortingData.subId.join(),
            renark: this.sortingData.renark,
          },
        })
          .then(({ data }) => {
            if (data.code == "-1")
              return this.$message.error(data.data + this.$t("h.tips263"));
            this.$message.success(data.data);
            this.flag = true;
            this.getClassificationData();
            this.handleClose();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      });
    },
    //删除分类
    deleteSorting() {
      if (this.treeSeleteData.children && this.treeSeleteData.children.length)
        return this.$message.error(this.$t("h.tips264"));
      this.$confirm(this.$t("h.tips265"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          warehouseOperate({
            func: "SO0004",
            userId: this.userId,
            token: this.token,
            requstData: {
              sortingId: this.treeSeleteData.sortingId,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1")
                return this.$message.error(this.$t("h.columns2"));
              this.$message.success(data.data);
              this.getClassificationData();
            })
            .catch((error) => {
              this.$message.error(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("h.tips98"),
          });
        });
    },
    //获取分类数据
    getClassificationData() {
      warehouseOperate({
        func: "SO0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data && data.data.length) {
            this.subMenuList = data.data;
            this.superiorSortingData = [
              { name: this.$t("h.title199"), value: "-" },
            ];
            this.subMenuList.forEach((item) => {
              this.superiorSortingData.push({
                name: item.name,
                value: item.sortingId,
              });
              if (!item.subId) {
                item.subId = "-";
              }
            });
            this.subMenuList = this.tree(data.data, "-");
            this.modify(this.subMenuList);
            this.componentSortingData = JSON.parse(
              JSON.stringify(this.subMenuList)
            );
          } else {
            this.subMenuList = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //树状图生成
    tree(list, subId) {
      const arr = [];
      // 1.遍历
      list.forEach((item) => {
        // 2.首次传入空字符串  判断list的pid是否为空 如果为空就是一级节点
        if (item.subId == subId) {
          // 找到之后就要去找item下面有没有子节点  以 item.id 作为 父 id, 接着往下找
          const children = this.tree(list, item.sortingId);
          if (children.length > 0) {
            // 如果children的长度大于0,说明找到了子节点
            item.children = children;
          }
          // 将item项, 追加到arr数组中
          arr.push(item);
        }
      });
      return arr;
    },
    //点击树状图返回将表格转换成相对应的数据
    async sortingDataSwitching(data) {
      this.highlightCurrent = true;
      this.treeSeleteData = data;
      await this.getFilesData(this.treeSeleteData.sortingId);
    },
    //新建档案
    addingFiles() {
      // if (!this.treeSeleteData) return this.$message.error("没有选中分类");
      this.fileDialogVisible = true;
    },
    // 获取物品档案数据
    getFilesData(sortingId) {
      warehouseOperate({
        func: "SU0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          sortingId,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (sortingId == this.subMenuList[0].sortingId)
            this.treeSeleteData = this.subMenuList[0];
          if (data.data && data.data.length) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
              this.superiorSortingData.forEach((item2) => {
                if (item.sortingId == item2.value) {
                  item.sorting = item2.name;
                }
              });
            });
          } else {
            this.assetTableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //删除档案
    deleteFiles(row) {
      this.$confirm(this.$t("h.tips265"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          warehouseOperate({
            func: "SU0004",
            userId: this.userId,
            token: this.token,
            requstData: {
              substanceId: row.substanceId,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message.success(data.data);
              this.getFilesData(this.treeSeleteData.sortingId);
            })
            .catch((error) => {
              this.$message.error(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("h.tips98"),
          });
        });
    },
    //禁/启用档案
    disableeFiles(row) {
      warehouseOperate({
        func: "SU0003",
        userId: this.userId,
        token: this.token,
        requstData: {
          code: row.code,
          name: row.name,
          barCode: row.barCode,
          sortingId: row.sortingId,
          logo: row.logo,
          specification: row.specification,
          price: row.price,
          measureUnit: row.measureUnit,
          lowerSize: row.lowerSize,
          upperSize: row.upperSize,
          remark: row.remark,
          image: row.image,
          staffId: this.staffId,
          status: !row.status,
          substanceId: row.substanceId,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.$message.success(data.data);
          this.getFilesData(this.treeSeleteData.sortingId);
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //修改档案
    modifyFiles(row) {
      console.log('修改档案',row)
      this.fileDialogVisible = true;
      this.modifyFileData = row;
      this.functionChange = true;
    },
    //搜索
    search() {
      warehouseOperate({
        func: "SU0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          andLike: this.andLike,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
              this.superiorSortingData.forEach((item2) => {
                if (item.sortingId == item2.value) {
                  item.sorting = item2.name;
                }
              });
            });
          } else {
            this.assetTableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //重置高级筛选
    resetFilterForm() {
      this.$refs["advancedFiltering"].resetFields();
      this.advancedFiltering.maxPrice = "";
      this.advancedFiltering.maxUpperSize = "";
      this.advancedFiltering.maxLowerSize = "";
      this.highFilterTags = [];
      warehouseOperate({
        func: "SU0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
              this.superiorSortingData.forEach((item2) => {
                if (item.sortingId == item2.value) {
                  item.sorting = item2.name;
                }
              });
            });
          } else {
            this.assetTableData = [];
          }
          this.filterDrawerVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //高级筛选
    submitFilterForm() {
      if (
        (this.advancedFiltering.minPrice.trim() != "" &&
          this.advancedFiltering.maxPrice.trim() == "") ||
        (this.advancedFiltering.minPrice.trim() == "" &&
          this.advancedFiltering.maxPrice.trim() != "")
      )
        return this.$message.error(this.$t("h.tips259"));
      if (
        (this.advancedFiltering.minUpperSize.trim() != "" &&
          this.advancedFiltering.maxUpperSize.trim() == "") ||
        (this.advancedFiltering.minUpperSize.trim() == "" &&
          this.advancedFiltering.maxUpperSize.trim() != "")
      )
        return this.$message.error(this.$t("h.tips259"));
      if (
        (this.advancedFiltering.minLowerSize.trim() != "" &&
          this.advancedFiltering.maxLowerSize.trim() == "") ||
        (this.advancedFiltering.minLowerSize.trim() == "" &&
          this.advancedFiltering.maxLowerSize.trim() != "")
      )
        return this.$message.error(this.$t("h.tips259"));
      let requstData = {
        status: this.advancedFiltering.status,
        price:
          this.advancedFiltering.minPrice +
          "," +
          this.advancedFiltering.maxPrice,
        upperSize:
          this.advancedFiltering.minUpperSize +
          "," +
          this.advancedFiltering.maxUpperSize,
        lowerSize:
          this.advancedFiltering.minLowerSize +
          "," +
          this.advancedFiltering.maxLowerSize,
        andLike: this.advancedFiltering.andLike,
      };
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "SU0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          this.highFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
              this.superiorSortingData.forEach((item2) => {
                if (item.sortingId == item2.value) {
                  item.sorting = item2.name;
                }
              });
            });
          } else {
            this.assetTableData = [];
          }
          for (let key in requstData) {
            if (key == "status") {
              let statusName = "";
              if (requstData[key]) {
                statusName = this.$t("h.disabled");
              } else {
                statusName = this.$t("h.enable");
              }
              this.highFilterTags.push({
                name: this.$t("h.state"),
                value: statusName,
                keyStr: key,
              });
            } else if (key == "price") {
              this.highFilterTags.push({
                name: this.$t("h.price"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "upperSize") {
              this.highFilterTags.push({
                name: this.$t("h.formTips70"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "lowerSize") {
              this.highFilterTags.push({
                name: this.$t("h.formTips71"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "andLike") {
              this.highFilterTags.push({
                name: this.$t("h.fuzzyQuery"),
                value: requstData[key],
                keyStr: key,
              });
            }
          }
          // this.$refs["advancedFiltering"].resetFields();
          // this.advancedFiltering.maxPrice = "";
          // this.advancedFiltering.maxUpperSize = "";
          // this.advancedFiltering.maxLowerSize = "";
          this.filterDrawerVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //显示全部数据
    showAll() {
      this.highlightCurrent = false;
      this.treeSeleteData = "";
      warehouseOperate({
        func: "SU0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
              this.superiorSortingData.forEach((item2) => {
                if (item.sortingId == item2.value) {
                  item.sorting = item2.name;
                }
              });
            });
          } else {
            this.assetTableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //修改分类选择数据
    modify(children) {
      children.forEach((item) => {
        // item.name = item.code + "-" + item.name;
        item.label = item.name;
        item.value = item.sortingId;
        if (item.children && item.children.length) {
          this.modify(item.children);
        }
      });
    },
    //清除不需要的仓库选择数据
    changeData(arr, id) {
      arr.forEach((item, index) => {
        if (item.value == id) {
          arr.splice(index, 1);
        }
        if (item.children && item.children.length)
          this.changeData(item.children, id);
      });
    },
  },
  watch: {
    addingFilesComplate: function (val) {
      if (val) {
        this.addingFilesComplate = false;
        this.getFilesData(this.treeSeleteData.sortingId);
      }
    },
    classificationVisible: function (val) {
      if (!val) {
        this.componentSortingData = JSON.parse(
          JSON.stringify(this.subMenuList)
        );
      }
    },
  },
  created() {
    this.userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
    this.token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
    this.staffId = JSON.parse(sessionStorage.getItem("vuex")).userInfo.staffId;
    this.getClassificationData();
    this.showAll();
    this.getAssetAttr();
  },
};
</script>
<style lang="scss" scoped>
.ItemProfile {
  height: calc(100% - 2px);
  box-sizing: border-box;
  padding: 15px;
}
.box-card {
  height: 100%;
  ::v-deep .el-card__header {
    padding: 0;
    height: 60px;
    border: none;
  }
  ::v-deep .el-card__body {
    display: flex;
    padding: 20;
    padding-top: 5px;
    height: 96.7%;
  }
}
::v-deep .table-header {
  padding: 0;
  height: 41px;
  font-size: 13px;
  color: #000;
  background-color: #f2f6ff !important;
  border-color: #eeeeee;
}
::v-deep .table-content {
  padding: 0;
  height: 42px;
  color: #333;
  font-size: 13px;
  border-color: #eeeeee;
}
.classification {
  width: 21.97%;
  height: 95%;
  .dropdown {
    height: 98px;
  }
  .el-dropdown {
    position: relative;
    left: 10px;
    margin-top: 15px;
  }
  .el-menu-vertical-demo {
    width: 100%;
    min-width: 200px;
    box-shadow: 0px 0px 20px 0px rgba(17, 10, 80, 0.1);
    .span {
      display: flex;
      align-items: center;
    }
    .svg-icon {
      width: 2em;
      height: 2em;
    }
  }
}
.operation-area {
  width: 78%;
  height: 100%;
  padding-left: 10px;
  .header {
    height: 60px;
  }
  .screen {
    margin-bottom: 5px;
    height: 28px;
    .advancedSearch {
      display: inline-block;
      margin-left: 10px;
      color: #188cfb;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .asset-table {
    height: calc(100% - 123px);
    padding-top: 5px;
  }
  .pagination {
    height: 40px;
  }
  .inp-box {
    display: flex;
    height: 40px;
    .input-small {
      width: 45%;
    }
  }
}
</style>
