<template>
  <div class="ConTransfer">
    <el-card class="card">
      <!-- 头部 -->
      <div class="header">
        <ds-query-form>
          <ds-query-form-left-panel
            ><el-button
              type="primary"
              size="small"
              @click="newBillsDialogVisible = true"
              >{{ $t("h.newBtn") }}</el-button
            >
            <el-dropdown
              trigger="click"
              :disabled="isEditDisable"
              @command="editingOperations"
            >
              <el-button size="small">
                {{ $t("h.editBtn")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="modify">{{
                  $t("h.changeBtn")
                }}</el-dropdown-item>
                <el-dropdown-item command="delete">{{
                  $t("h.delBtn")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="primary"
              size="small"
              @click="confirmConTransferDocuments"
              :disabled="isEditDisable"
              >{{ $t("h.confirmBtn") }}</el-button
            >
            <el-dropdown trigger="click" style="margin-left: 0px">
              <el-button size="small"
                >{{ $t("h.formTips5") }}
                <i class="el-icon-arrow-down el-icon--right"></i
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="goPrintBills">{{
                  $t("h.printBtn")
                }}</el-dropdown-item>
                <!-- @click.native="openPrintSet" -->
                <el-dropdown-item @click.native="openPrintSet">{{
                  $t("h.tempSetBtn")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="small" @click="exportFile">{{
              $t("h.exportBtn")
            }}</el-button>
          </ds-query-form-left-panel>
          <ds-query-form-right-panel>
            <ds-search-btn
              :searchValue.sync="andLike"
              @search="bodySearch"
            ></ds-search-btn>
          </ds-query-form-right-panel>
        </ds-query-form>
        <!-- 筛选区域  -->
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
                @click="bodyFilteringVisible = true"
                >{{ $t("h.advancedBtn") }}</span
              >
            </ds-query-form-right-panel>
          </ds-query-form>
        </div>
        <!-- 新增调拨 -->
        <new-bills-dialog
          class="new-bill-dialog"
          contentWidth="55%"
          :title="$t('h.title168')"
          :newBillsDialogVisible.sync="newBillsDialogVisible"
          @sbumitForm="conTransfer"
          @close="bulkBillsDialogClose"
          :look="look"
          :warning="warning"
        >
          <template slot="form">
            <p class="warning" v-if="warning">
              {{ $t("h.formTips54") }}{{ warningTitle }}{{ $t("h.title169") }}
            </p>
            <el-row :gutter="45">
              <el-form
                ref="conTransferFillInDataRef"
                label-width="80px"
                :model="conTransferFillInData"
                :rules="conTransferFillInDataRules"
                :disabled="look"
              >
                <el-col :span="12">
                  <el-form-item :label="$t('h.title173')" prop="roleRule">
                    <el-input
                      v-model="conTransferFillInData.roleRule"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.formTips64')" prop="outHouseId">
                    <el-cascader
                      :options="warehouseData"
                      :props="{ checkStrictly: true }"
                      v-model="conTransferFillInData.outHouseId"
                      :show-all-levels="false"
                    ></el-cascader>
                    <!-- <el-select
                      v-model="conTransferFillInData.outHouseId"
                      placeholder="请选择仓库"
                      filterable
                    >
                      <el-option
                        v-for="item in warehouseData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.transferDate')" prop="useDate">
                    <el-date-picker
                      type="date"
                      :placeholder="$t('h.tips4') + $t('h.transferDate')"
                      v-model="conTransferFillInData.useDate"
                      style="width: 100%"
                      clearable
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.formTips65')" prop="inHouseId">
                    <el-cascader
                      :options="warehouseData"
                      :props="{ checkStrictly: true }"
                      v-model="conTransferFillInData.inHouseId"
                      :show-all-levels="false"
                    ></el-cascader>
                    <!-- <el-select
                      v-model="conTransferFillInData.inHouseId"
                      placeholder="请选择仓库"
                      filterable
                    >
                      <el-option
                        v-for="item in warehouseData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.formTips66')" prop="useStaff">
                    <el-select
                      v-model="conTransferFillInData.useStaff"
                      :placeholder="$t('h.tips4') + $t('h.formTips66')"
                    >
                      <el-option
                        v-for="item in employeeData"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.formTips67')" prop="staffName">
                    <el-input
                      v-model="conTransferFillInData.staffName"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.formTips68')" prop="createDate">
                    <el-date-picker
                      disabled
                      type="date"
                      v-model="conTransferFillInData.createDate"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="$t('h.formTips69')" prop="remark">
                    <el-input
                      v-model="conTransferFillInData.remark"
                      type="textarea"
                      rows="3"
                      :placeholder="$t('h.tips3') + $t('h.formTips69')"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </template>
          <template slot="btns">
            <ds-query-form>
              <ds-query-form-left-panel>
                <span class="advancedSearch"
                  >{{ $t("h.title170") }} - {{ $t("h.title147") }}</span
                >
              </ds-query-form-left-panel>
              <ds-query-form-right-panel>
                <el-button
                  size="small"
                  type="primary"
                  v-if="!look"
                  :disabled="warning"
                  @click="articleDialogVisible = true"
                  >{{ $t("h.title171") }}</el-button
                >
                <el-button
                  size="small"
                  type="primary"
                  v-if="!look"
                  :disabled="warning"
                  @click="deleteArticleDetailsSelete"
                  >{{ $t("h.title172") }}</el-button
                >
              </ds-query-form-right-panel>
            </ds-query-form>
          </template>
          <template slot="table">
            <div class="bill-table">
              <el-table
                ref="multipleTable"
                :data="articleDetailsData"
                style="width: 100%"
                height="400"
                @selection-change="articleDetailsSelete"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column
                  v-for="(column, index) in newArticleDetailsColumns"
                  :label="column.label"
                  :prop="column.prop"
                  :width="column.width || ''"
                  align="center"
                  :fixed="column.fixed"
                  :key="index"
                  v-show="column.label == $t('h.action')"
                >
                  <template slot="header">
                    <span :class="column.prop">{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <div v-if="column.type == 'image'" class="table-image-cell">
                      <el-image
                        v-if="scope.row[column.prop]"
                        :src="scope.row[column.prop]"
                        :preview-src-list="[scope.row[column.prop]]"
                      ></el-image>
                      <div class="no-image" v-else>
                        <span>{{ $t("h.title51") }}</span>
                      </div>
                    </div>
                    <template v-else-if="!look && column.slotName == 'amount'">
                      <el-input-number
                        v-model="scope.row[column.prop]"
                        controls-position="right"
                        :min="1"
                        class="small-input"
                        @change="changeMoney(scope.$index, scope.row)"
                      ></el-input-number>
                    </template>
                    <template v-else-if="!look && column.slotName == 'remark'">
                      <el-input v-model="scope.row[column.prop]"></el-input>
                    </template>
                    <!-- 正常显示 -->
                    <div v-else class="show-tooltip">
                      <span>{{
                        column.formatter
                          ? column.formatter(scope.row, scope.column)
                          : scope.row[column.prop]
                      }}</span>
                    </div></template
                  >
                </el-table-column>
              </el-table>
            </div>
          </template>
        </new-bills-dialog>
        <!-- 添加物品  -->
        <el-dialog
          title="选择物品"
          :visible.sync="articleDialogVisible"
          width="60%"
          class="dialog-select-article"
          :before-close="articleDialogVisibleClose"
        >
          <div class="dialog-body">
            <el-tree
              v-if="subMenuList"
              class="el-menu-vertical-demo"
              :data="subMenuList"
              :props="subMenuListProps"
              highlight-current
              node-key="sortingId"
              current-node-key="1"
              :default-expanded-keys="['1']"
              @node-click="sortingDataSwitching"
            >
              <span slot-scope="{ node, data }">
                <span class="icon">
                  <template v-if="data.children == null">
                    <svg-icon
                      class="childIcon"
                      icon-file-name="childGb"
                    ></svg-icon>
                  </template>
                  <template v-else>
                    <svg-icon class="parentIcon" icon-file-name="gb"></svg-icon>
                  </template>
                </span>
                <span class="text" style="font-size: 14px">
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
            <div class="right">
              <div class="top">
                <ds-search-btn
                  :searchValue.sync="articleAndLike"
                  @search="articleSearch"
                ></ds-search-btn>
              </div>
              <!-- 筛选区域  -->
              <div class="screen">
                <ds-query-form>
                  <ds-query-form-left-panel>
                    <ds-filter-tag
                      :filterTagsData="articleHighFilterTags"
                      @handleCloseTag="articleHandleCloseFilterTag"
                    ></ds-filter-tag>
                  </ds-query-form-left-panel>
                  <ds-query-form-right-panel>
                    <span
                      class="advancedSearch"
                      @click="addFilteringVisible = true"
                      >{{ $t("h.advancedBtn") }}</span
                    >
                  </ds-query-form-right-panel>
                </ds-query-form>
              </div>
              <el-table
                class="articleTable"
                ref="articleData"
                :data="articleDataDisplay"
                height="51.5vh"
                @selection-change="articleSelete"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column
                  v-for="(column, index) in newArticleColumns"
                  :label="column.label"
                  :prop="column.prop"
                  :width="column.width || ''"
                  align="center"
                  :fixed="column.fixed"
                  :key="index"
                >
                  <template slot-scope="scope">
                    <div v-if="column.type == 'image'" class="table-image-cell">
                      <el-image
                        v-if="scope.row[column.prop]"
                        :src="scope.row[column.prop]"
                        :preview-src-list="[scope.row[column.prop]]"
                      ></el-image>
                      <div class="no-image" v-else>
                        <span>{{ $t("h.title51") }}</span>
                      </div>
                    </div>
                    <!-- 正常显示 -->
                    <div v-else class="show-tooltip">
                      <span>{{
                        column.formatter
                          ? column.formatter(scope.row, scope.column)
                          : scope.row[column.prop]
                      }}</span>
                    </div></template
                  >
                </el-table-column>
              </el-table>
              <!-- 分页区域 -->
              <div class="pagination">
                <ds-pagination
                  small
                  :total="articleTotal"
                  :page.sync="articlePaginationForm.currentPage"
                  :limit.sync="articlePaginationForm.pageSize"
                  @pagination="articleChangeSizePage"
                ></ds-pagination>
              </div>
            </div>
          </div>
          <span slot="footer" class="footer-span">
            <el-button size="small" @click="outArticleDialog">{{
              $t("h.cancelBtn")
            }}</el-button>
            <el-button
              size="small"
              type="primary"
              @click="determineItemSelection"
              >{{ $t("h.confirmBtn") }}</el-button
            >
          </span>
        </el-dialog>
        <!-- 添加物品高级筛选 -->
        <ds-filter-drawer
          :filterDrawerVisible.sync="addFilteringVisible"
          :modal="false"
          @resetFilterForm="resetArticleFilterForm"
          @submitFilterForm="submitArticleFilterForm"
        >
          <el-form
            :model="advancedFiltering"
            ref="advancedFiltering"
            label-width="80px"
          >
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
      <!-- 表格主体 -->
      <div class="body">
        <ds-table
          ref="assetTableDataDisplay"
          :loading="tableLoading"
          :tableData="assetTableDataDisplay"
          :tableConfig="assetTableConfig"
          :columns="columns"
          :rowKey="(row) => row.roleRule"
          onlyKey="roleRule"
          @handleSelectionChange="bodySelete"
        >
          <template slot="roleRule" slot-scope="{ scope }">
            <p class="inventory-name" @click="lookDetails(scope.row)">
              {{ scope.row.roleRule }}
            </p>
          </template>
        </ds-table>
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
      </div>
      <!-- 主体表格高级筛选 -->
      <ds-filter-drawer
        :filterDrawerVisible.sync="bodyFilteringVisible"
        @resetFilterForm="resetBodyFilterForm"
        @submitFilterForm="submitBodyFilterForm"
      >
        <el-form :model="bodyFiltering" ref="bodyFiltering" label-width="80px">
          <el-form-item :label="$t('h.state')" prop="status">
            <el-select
              v-model="bodyFiltering.status"
              :placeholder="$t('h.tips4') + $t('h.state')"
            >
              <el-option :label="$t('h.approved')" value="0"></el-option>
              <el-option :label="$t('h.pending')" value="1"></el-option>
              <el-option :label="$t('h.rejectBtn')" value="2"></el-option>
              <el-option :label="$t('h.draft')" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('h.creator')" prop="staffId">
            <el-select
              v-model="bodyFiltering.staffId"
              multiple
              :placeholder="$t('h.tips4')"
            >
              <el-option
                v-for="item in employeeData"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              >
              </el-option
            ></el-select>
          </el-form-item>
          <el-form-item :label="$t('h.creationTime')" prop="createDate">
            <!-- format="yyyy 年 MM 月 dd 日" -->
            <el-date-picker
              type="daterange"
              :placeholder="$t('h.tips4') + $t('h.creationTime')"
              v-model="bodyFiltering.createDate"
              style="width: 100%"
              clearable
              :start-placeholder="$t('h.startDate')"
              :end-placeholder="$t('h.endDate')"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('h.formTips74')" prop="useDate">
            <!-- format="yyyy 年 MM 月 dd 日" -->
            <el-date-picker
              type="daterange"
              :placeholder="$t('h.tips4') + $t('h.formTips74')"
              v-model="bodyFiltering.useDate"
              style="width: 100%"
              clearable
              :start-placeholder="$t('h.startDate')"
              :end-placeholder="$t('h.endDate')"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('h.formTips65')" prop="inHouseId">
            <el-cascader
              :options="warehouseData"
              :props="{ checkStrictly: true }"
              v-model="bodyFiltering.inHouseId"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('h.formTips64')" prop="outHouseId">
            <el-cascader
              :options="warehouseData"
              :props="{ checkStrictly: true }"
              v-model="bodyFiltering.outHouseId"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('h.fuzzyQuery')" prop="andLike">
            <el-input v-model="bodyFiltering.andLike"></el-input>
          </el-form-item>
        </el-form>
      </ds-filter-drawer>
      <!-- 打印 -->
      <!-- @setVoucherTag="setBillPrintTemplate" -->
      <bill-print-template
        ref="vptRef"
        :title="`${$t('h.formTips75')}`"
        :selectId="conTransferTemplateId"
        :voucherPrintTempList="billPrintTemplate"
      ></bill-print-template>
      <kc-bill-print-dialog
        ref="vpdRef"
        locationName="conTransferTemplateId"
        :userInfo="userInfo"
        :voucherData="assetTableSelectData"
        :voucherPrintTemplate="billPrintTemplate"
      ></kc-bill-print-dialog>
    </el-card>
  </div>
</template>
<script>
import DsQueryForm from "@/components/DsQueryForm";
import DsQueryFormLeftPanel from "@/components/DsQueryForm/components/DsQueryFormLeftPanel.vue";
import DsQueryFormRightPanel from "@/components/DsQueryForm/components/DsQueryFormRightPanel.vue";
import DsSearchBtn from "@/components/DsSearchBtn";
import DsTable from "@/components/DsTable";
import NewBillsDialog from "@/components/BillsComponents/NewBillsDialog";
import DsFilterDrawer from "@/components/DsFilterDrawer";
import DsPagination from "@/components/DsPagination";
import DsFilterTag from "@/components/DsFilterTag";
import BillPrintTemplate from "@/components/BillsComponents/BillPrintTemplate";
import KcBillPrintDialog from "@/components/BillsComponents/KcBillPrintDialog";
import { clickDownloadLink } from "@/utils/basic-methods";
import {
  conTransferColumns,
  conTransferArticleDetailsColumns,
  conTransferArticleColumns,
} from "@/utils/systemData";
import { getTodayDate } from "@/utils/basic-methods";
import { warehouseOperate, select } from "@/assets/api";
import { mapState } from "vuex";

export default {
  components: {
    DsQueryForm,
    DsQueryFormLeftPanel,
    DsQueryFormRightPanel,
    DsSearchBtn,
    DsTable,
    NewBillsDialog,
    DsFilterDrawer,
    DsPagination,
    DsFilterTag,
    BillPrintTemplate,
    KcBillPrintDialog,
  },
  data() {
    return {
      //打印模板
      conTransferTemplateId: "",
      billPrintTemplate: [],
      //用户
      userId: "",
      token: "",
      staffId: "",
      //仓库正在盘点警告
      warning: false,
      warningTitle: "",
      //员工数据
      employeeData: [],
      //部门
      deptId: "",
      //判断是调拨还是修改调拨单据
      isConTransfer: 0,
      //查看详情
      look: false,
      //判断编辑是否要改为禁用状态
      isEditDisable: true,
      //主体表格
      andLike: "",
      tableLoading: false,
      assetTableData: [],
      columns: conTransferColumns,
      assetTableConfig: {
        selection: true,
      },
      paginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      assetTableSelectData: [],
      houseNameData: [], //主体表格仓库名字数据
      //主体表格高级筛选
      bodyFilteringVisible: false,
      bodyFiltering: {
        status: "",
        staffId: "",
        createDate: "",
        useDate: "",
        outHouseId: [],
        inHouseId: [],
        andLike: "",
      },
      highFilterTags: [],
      //仓库数据
      warehouseData: [],
      //调拨填写数据
      newBillsDialogVisible: false,
      conTransferFillInData: {
        roleRule: "调拨单号",
        outHouseId: [],
        useDate: getTodayDate(),
        inHouseId: [],
        useStaff: "",
        staffName: JSON.parse(sessionStorage.getItem("vuex")).userInfo
          .staffName,
        createDate: getTodayDate(),
        remark: "",
      },
      conTransferFillInDataRules: {
        useStaff: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips66"),
            trigger: "change",
          },
        ],
      },
      sourceListData: [],
      //物品详情数据
      newArticleDetailsColumns: conTransferArticleDetailsColumns,
      articleDetailsData: [],
      selectArticleDetailsData: [],
      //   物品分类 + 物品档案
      articleDialogVisible: false,
      subMenuList: [],
      subMenuListProps: { children: "children", label: "name" },
      newArticleColumns: conTransferArticleColumns,
      articleData: [],
      articleAndLike: "",
      selectArticleData: [], //接收选中的物品数据
      articlePaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      difference: "all",
      recordSortingData: [],
      waitFilesData: false,
      //添加物品高级筛选
      addFilteringVisible: false,
      advancedFiltering: {
        minPrice: "",
        maxPrice: "",
        minUpperSize: "",
        maxUpperSize: "",
        minLowerSize: "",
        maxLowerSize: "",
        andLike: "",
      },
      articleHighFilterTags: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    articleDataDisplay() {
      let start = 0;
      let end = this.articlePaginationForm.pageSize - 1;
      let arr = [];
      //   当页数不等于1从start=end*this.articlePaginationForm.currentPage - 1开始到所设置的数据条数
      if (this.articlePaginationForm.currentPage == 1) {
        for (let i = start; i < end; i++) {
          if (this.articleData[i]) {
            arr.push(this.articleData[i]);
          }
        }
      } else {
        for (
          let i = end * (this.articlePaginationForm.currentPage - 1);
          i < end * this.articlePaginationForm.currentPage;
          i++
        ) {
          if (this.articleData[i]) {
            arr.push(this.articleData[i]);
          }
        }
      }
      return arr;
    },
    articleTotal() {
      return this.articleData.length;
    },
    assetTableDataDisplay() {
      let arr = [];
      let start = 0;
      let end = this.paginationForm.pageSize - 1;
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
    total() {
      return this.assetTableData.length;
    },
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.articleData.toggleRowSelection(row);
        });
      } else {
        this.$refs.articleData.clearSelection();
      }
    },
    //打开打印
    goPrintBills() {
      if (this.assetTableSelectData.length == 0)
        return this.$message.error(this.$t("h.tips121"));
      if (this.assetTableSelectData.length > 10)
        return this.$message.error(
          this.$t("h.tips122") + 10 + this.$t("h.tips123")
        );
      this.$refs["vpdRef"].voucherPrintDialogVisible = true;
    },
    //打开打印模板
    openPrintSet() {
      this.$refs["vptRef"].printTempDialogVisible = true;
    },
    //删除用户高级筛选填写数据
    articleHandleCloseFilterTag(val) {
      this.waitFilesData = true;
      this.difference = "individual";
      switch (val.keyStr) {
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
      this.articleHighFilterTags.splice(
        this.articleHighFilterTags.indexOf(val),
        1
      );
      let params = [
        {
          key: "price",
          value: "",
          handle: "",
        },
        {
          key: "upperSize",
          value: "",
          handle: "",
        },
        {
          key: "lowerSize",
          value: "",
          handle: "",
        },
        {
          key: "andLike",
          value: "",
          handle: "",
        },
      ];
      this.articleHighFilterTags.forEach((item) => {
        params.forEach((item2) => {
          if (item.keyStr == item2.key) {
            item2.value = item.value;
            item2.handle = item.handle;
          }
        });
      });
      params = params.filter((item) => {
        if (item.value) {
          return item;
        }
      });
      warehouseOperate({
        func: "BU0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          houseId:
            this.conTransferFillInData.outHouseId.length > 1
              ? this.conTransferFillInData.outHouseId[
                  this.conTransferFillInData.outHouseId.length - 1
                ]
              : this.conTransferFillInData.outHouseId.join(),
          status: false,
          params,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.articleData = data.data;
            this.articleData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
            });
            this.recordSortingData = JSON.parse(JSON.stringify(data.data));
            // if (this.selectArticleData && this.selectArticleData.length) {
            //   this.$nextTick(() => {
            //     this.selectArticleData.forEach((item) => {
            //       this.articleData.forEach((item2) => {
            //         if (item.sortingId == item2.sortingId) {
            //           this.toggleSelection([item2]);
            //         }
            //       });
            //     });
            //   });
            // }
          } else {
            this.articleData = [];
          }
          let timer = setTimeout(() => {
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
          this.markArticle();
        })
        .catch((error) => {
          this.$message.error(error);
          let timer = setTimeout(() => {
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
        });
    },
    handleCloseFilterTag(val) {
      switch (val.keyStr) {
        case "andLike":
          this.bodyFiltering.andLike = "";
          break;
        case "status":
          this.bodyFiltering.status = "";
          break;
        case "createDate":
          this.bodyFiltering.createDate = "";
          break;
        case "staffId":
          this.bodyFiltering.staffId = "";
          break;
        case "outHouseId":
          this.bodyFiltering.outHouseId = [];
          break;
        case "inHouseId":
          this.bodyFiltering.inHouseId = [];
          break;
        default:
          this.bodyFiltering.useDate = "";
          break;
      }
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      let requstData = {
        andLike: "",
        status: "", //审批状态查询 0已审批/1待审批/2驳回
        createDate: "",
        staffId: "",
        outHouseId: "", //调出仓库id
        inHouseId: "", //调入仓库id
        useDate: "", //调拨日期
      };
      this.highFilterTags.forEach((item) => {
        for (let key in requstData) {
          if (item.keyStr == key) {
            if (
              key == "status" ||
              key == "staffId" ||
              key == "outHouseId" ||
              key == "inHouseId"
            ) {
              requstData[key] = item.uploadValue;
            } else {
              requstData[key] = item.value;
            }
          }
        }
      });
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "AL0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.assetTableData = data.data;
          if (this.assetTableData) {
            this.assetTableData.forEach((item) => {
              if (item.status == "0") {
                item.statusName = this.$t("h.approved");
              } else if (item.status == "1") {
                item.statusName = this.$t("h.pending");
              } else if (item.status == "2") {
                item.statusName = this.$t("h.rejectBtn");
              } else if (item.status == "3") {
                item.statusName = this.$t("h.draft");
              }
            });
          } else {
            this.assetTableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //物品高级筛选最大最小数限制
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
    articleChangeSizePage(val) {
      let arr = this.selectArticleData;
      this.articlePaginationForm.currentPage = val.page;
      this.articlePaginationForm.pageSize = val.limit;
      let timer = setTimeout(() => {
        if (arr && arr.length) {
          this.$nextTick(() => {
            arr.forEach((item) => {
              this.articleData.forEach((item2) => {
                if (item.substanceId == item2.substanceId) {
                  this.toggleSelection([item2]);
                  if (timer) {
                    clearTimeout(timer);
                  }
                }
              });
            });
          });
        }
      }, 100);
    },
    //导出
    exportFile() {
      warehouseOperate({
        func: "AL0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          pull: 1,
        },
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
    //获取仓库数据
    getWarehouseData(userId, token) {
      warehouseOperate({
        func: "ST0001",
        userId,
        token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            let arr = [];
            data.data.forEach((item) => {
              if (!item.disabled && item.state == "0") {
                arr.push({
                  name: item.name,
                  label: item.name,
                  value: item.houseId,
                  state: item.state,
                  subId: item.subId,
                });
              }
              this.houseNameData.push({ name: item.name, value: item.houseId });
            });
            this.warehouseData = this.tree(arr, "-");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //获取员工数据
    getEmployeeData() {
      select({
        func: "S0005",
        userId: this.userId,
        token: this.token,
        requstData: {
          _id: "",
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.employeeData = data.data;
          this.deptId = data.data.find(
            (item) => item._id == this.userId
          ).deptId;
          if (!data.data) {
            this.employeeData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //监测入库仓库是否正在盘点
    watchInhouse(val) {
      for (let i = 0; i < this.warehouseData.length; i++) {
        if (
          this.warehouseData[i].value == val &&
          this.warehouseData[i].state == "-1"
        ) {
          this.warning = true;
          this.warningTitle = this.warehouseData[i].name;
          return;
        } else if (this.warehouseData.length - 1 == i) {
          this.warning = false;
          this.warningTitle = "";
        }
      }
    },
    //监测出库仓库是否正在盘点
    watchOuthouse(val) {
      for (let i = 0; i < this.warehouseData.length; i++) {
        if (
          this.warehouseData[i].value == val &&
          this.warehouseData[i].state == "-1"
        ) {
          this.warning = true;
          this.warningTitle = this.warehouseData[i].name;
          return;
        } else if (this.warehouseData.length - 1 == i) {
          this.warning = false;
          this.warningTitle = "";
        }
      }
    },
    //树状图生成
    tree(list, subId) {
      const arr = [];
      // 1.遍历
      list.forEach((item) => {
        // 2.首次传入空字符串  判断list的pid是否为空 如果为空就是一级节点
        if (item.subId == subId) {
          // 找到之后就要去找item下面有没有子节点  以 item.id 作为 父 id, 接着往下找
          const children = this.tree(list, item.value);
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
    //获取分类数据
    getClassificationData() {
      warehouseOperate({
        func: "BO0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          houseId:
            this.conTransferFillInData.outHouseId.length > 1
              ? this.conTransferFillInData.outHouseId[
                  this.conTransferFillInData.outHouseId.length - 1
                ]
              : this.conTransferFillInData.outHouseId.join(),
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.subMenuList = [
            { children: null, name: this.$t("h.title174"), sortingId: "1" },
          ];
          if (data.data && data.data.length) {
            this.subMenuList[0].children = [];
            data.data.forEach((item) => {
              this.subMenuList[0].children.push(item);
            });
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //点击树状图返回将表格转换成相对应的数据
    async sortingDataSwitching(data) {
      if (data.sortingId == "1") {
        this.difference = "all";
        this.getFilesData();
      } else {
        this.waitFilesData = true;
        this.difference = "individual";
        warehouseOperate({
          func: "BU0001",
          userId: this.userId,
          token: this.token,
          requstData: {
            houseId:
              this.conTransferFillInData.outHouseId.length > 1
                ? this.conTransferFillInData.outHouseId[
                    this.conTransferFillInData.outHouseId.length - 1
                  ]
                : this.conTransferFillInData.outHouseId.join(),
            status: false,
            sortingId: data.sortingId,
            params: [],
          },
        })
          .then(({ data }) => {
            if (data.code == "-1")
              return this.$message.error(
                data.data ? data.data : this.$t("h.tips256")
              );
            if (data.data) {
              this.articleData = data.data;
              this.articleData.forEach((item) => {
                if (item.image) {
                  item.image = window.$EXCEL_URL + "image/" + item.image;
                  item.prop = item.image;
                }
              });
              // if (this.selectArticleData && this.selectArticleData.length) {
              //   this.$nextTick(() => {
              //     this.selectArticleData.forEach((item) => {
              //       this.articleData.forEach((item2) => {
              //         if (item.sortingId == item2.sortingId) {
              //           this.toggleSelection([item2]);
              //         }
              //       });
              //     });
              //   });
              // }
              this.recordSortingData = JSON.parse(JSON.stringify(data.data));
            } else {
              this.articleData = [];
            }
            let timer = setTimeout(() => {
              this.waitFilesData = false;
              if (timer) {
                clearTimeout(timer);
              }
            }, 500);
            this.markArticle();
          })
          .catch((error) => {
            this.$message.error(error);
            let timer = setTimeout(() => {
              this.waitFilesData = false;
              if (timer) {
                clearTimeout(timer);
              }
            }, 500);
          });
      }
    },
    // 获取物品档案数据
    getFilesData(detection) {
      this.waitFilesData = true;
      let mark = [];
      warehouseOperate({
        func: "BU0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          houseId:
            this.conTransferFillInData.outHouseId.length > 1
              ? this.conTransferFillInData.outHouseId[
                  this.conTransferFillInData.outHouseId.length - 1
                ]
              : this.conTransferFillInData.outHouseId.join(),
          status: false,
          params: [],
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.articleData = data.data;
            this.articleData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
            });
            if (detection && this.articleDetailsData.length) {
              this.$nextTick(() => {
                this.articleDetailsData.forEach((item) => {
                  this.articleData.forEach((item2) => {
                    if (item.substanceId == item2.substanceId) {
                      this.toggleSelection([item2]);
                      mark.push(item2);
                    }
                  });
                });
              });
            }
          } else {
            this.articleData = [];
          }
          let timer = setTimeout(() => {
            if (detection && this.articleDetailsData.length) {
              this.selectArticleData = mark;
            }
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
          this.markArticle();
        })
        .catch((error) => {
          this.$message.error(error);
          let timer = setTimeout(() => {
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
        });
    },
    // 物品选择事件
    articleSelete(val) {
      if (this.difference == "all" && !this.waitFilesData) {
        this.selectArticleData = JSON.parse(JSON.stringify(val));
        this.selectArticleData.forEach((item) => {
          if (!item.amount) {
            item.amount = 1;
          }
          if (!item.price) {
            item.price = 0;
          }
          if (!item.money) {
            item.money = item.amount * item.price;
          }
        });
      } else if (this.difference == "individual" && !this.waitFilesData) {
        let recordArr = [];
        this.selectArticleData.forEach((item, index) => {
          if (
            this.recordSortingData.some(
              (item2) => item.sortingId == item2.sortingId
            )
          ) {
            recordArr.unshift(index);
          }
        });
        recordArr.forEach((item) => {
          this.selectArticleData.splice(item, 1);
        });
        this.selectArticleData = this.selectArticleData.concat(
          JSON.parse(JSON.stringify(val))
        );
      }
    },
    // 确定物品选择
    determineItemSelection() {
      this.articleDetailsData = this.selectArticleData;
      this.outArticleDialog();
      this.articleHighFilterTags = [];
    },
    // 物品详情选择事件
    articleDetailsSelete(val) {
      this.selectArticleDetailsData = val;
    },
    // 给物品记下已填的数字金额价格
    markArticle() {
      if (this.articleDetailsData && this.articleDetailsData.length) {
        this.articleDetailsData.forEach((item) => {
          this.articleData.forEach((item2) => {
            if (item.substanceId == item2.substanceId) {
              item2.amount = item.amount;
              item2.price = item.price;
              item2.money = item.money;
            }
          });
        });
      }
    },
    // 删除物品详情选中数据
    deleteArticleDetailsSelete() {
      if (
        !this.selectArticleDetailsData ||
        !this.selectArticleDetailsData.length
      )
        return this.$message.error(this.$t("h.tips22"));
      for (let i = this.articleDetailsData.length - 1; i >= 0; i--) {
        this.selectArticleDetailsData.forEach((item2) => {
          if (
            this.articleDetailsData[i] &&
            this.articleDetailsData[i].substanceId == item2.substanceId
          ) {
            this.articleDetailsData.splice(i, 1);
            if (i == 0) {
              this.$message.success(this.$t("h.tips128"));
            }
          }
        });
      }
      this.selectArticleDetailsData = [];
    },
    //退出添加物品
    articleDialogVisibleClose() {
      this.articleDialogVisible = false;
      this.articleAndLike = "";
      this.subMenuList = [];
      this.articleData = [];
      this.difference = "all";
    },
    outArticleDialog() {
      this.articleDialogVisible = false;
      this.articleAndLike = "";
      this.subMenuList = [];
      this.articleData = [];
      this.difference = "all";
    },
    //物品分类+档案搜索
    articleSearch() {
      this.waitFilesData = true;
      this.difference = "individual";
      warehouseOperate({
        func: "BU0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          houseId:
            this.conTransferFillInData.outHouseId.length > 1
              ? this.conTransferFillInData.outHouseId[
                  this.conTransferFillInData.outHouseId.length - 1
                ]
              : this.conTransferFillInData.outHouseId.join(),
          status: false,
          params: [
            {
              key: "andLike",
              value: this.articleAndLike,
              handle: "OIS",
            },
          ],
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.articleData = data.data;
            this.articleData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
            });
            this.recordSortingData = JSON.parse(JSON.stringify(data.data));
            // if (this.selectArticleData && this.selectArticleData.length) {
            //   this.$nextTick(() => {
            //     this.selectArticleData.forEach((item) => {
            //       this.articleData.forEach((item2) => {
            //         if (item.sortingId == item2.sortingId) {
            //           this.toggleSelection([item2]);
            //         }
            //       });
            //     });
            //   });
            // }
          } else {
            this.articleData = [];
          }
          let timer = setTimeout(() => {
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
          this.markArticle();
        })
        .catch((error) => {
          this.$message.error(error);
          let timer = setTimeout(() => {
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
        });
    },
    //物品金额改变
    changeMoney(index, row) {
      this.articleDetailsData[index].money = row.amount * row.price;
    },
    //调拨||修改调拨单据
    conTransfer() {
      this.$refs["conTransferFillInDataRef"].validate((valid) => {
        if (!valid) return false;
        if (!this.articleDetailsData || !this.articleDetailsData.length)
          return this.$message.error(this.$t("h.tips256"));
        let inHouseId =
          this.conTransferFillInData.inHouseId.length > 1
            ? this.conTransferFillInData.inHouseId[
                this.conTransferFillInData.inHouseId.length - 1
              ]
            : this.conTransferFillInData.inHouseId.join();
        let outHouseId =
          this.conTransferFillInData.outHouseId.length > 1
            ? this.conTransferFillInData.outHouseId[
                this.conTransferFillInData.outHouseId.length - 1
              ]
            : this.conTransferFillInData.outHouseId.join();
        if (inHouseId == outHouseId)
          return this.$message.error(this.$t("h.tips257"));
        let pass = false;
        let details = [];
        for (let i = 0; i < this.articleDetailsData.length; i++) {
          details.push({
            substanceId: this.articleDetailsData[i].substanceId,
            amount: this.articleDetailsData[i].amount,
            money: this.articleDetailsData[i].money,
            price: this.articleDetailsData[i].price,
            remark: this.articleDetailsData[i].remark,
          });
          if (this.articleDetailsData[i].money < 1) {
            pass = true;
          }
        }
        if (pass) {
          return this.$message.error(this.$t("h.tips258"));
        }
        if (this.isConTransfer == 0) {
          warehouseOperate({
            func: "AL0002",
            userId: this.userId,
            token: this.token,
            requstData: {
              createDate: this.conTransferFillInData.createDate,
              useDate: this.conTransferFillInData.useDate,
              staffId: this.staffId,
              remark: this.conTransferFillInData.remark,
              outHouseId,
              inHouseId,
              useStaff: this.conTransferFillInData.useStaff,
              deptId: this.deptId,
              details,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message.success(data.data);
              this.newBillsDialogVisible = false;
              this.isConTransfer = 0;
              this.$refs["conTransferFillInDataRef"].resetFields();
              this.articleDetailsData = [];
              this.selectArticleDetailsData = [];
              // 获取调拨单据
              this.getConTransferDocuments();
            })
            .catch((error) => {
              this.$message.error(error);
            });
        } else if (this.isConTransfer == 1) {
          warehouseOperate({
            func: "AL0003",
            userId: this.userId,
            token: this.token,
            requstData: {
              allocateId: this.conTransferFillInData.allocateId, //调拨id 必填
              useDate: this.conTransferFillInData.useDate, //调拨日期
              remark: this.conTransferFillInData.remark,
              outHouseId, //调出仓库
              inHouseId, //调入仓库
              useStaff: this.conTransferFillInData.useStaff, //调入人
              deptId: this.deptId,
              details,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message.success(data.data);
              this.newBillsDialogVisible = false;
              this.isConTransfer = 0;
              this.$refs["conTransferFillInDataRef"].resetFields();
              this.articleDetailsData = [];
              this.selectArticleDetailsData = [];
              this.getConTransferDocuments();
            })
            .catch((error) => {
              this.$message.error(error);
            });
        }
      });
    },
    // 关闭NewBillsDialog
    bulkBillsDialogClose() {
      this.$refs["conTransferFillInDataRef"].resetFields();
      this.articleDetailsData = [];
      this.selectArticleDetailsData = [];
      this.look = false;
      this.conTransferFillInData = {
        roleRule: this.$t("h.title173"),
        outHouseId: [],
        useDate: getTodayDate(),
        inHouseId: [],
        useStaff: "",
        staffName: JSON.parse(sessionStorage.getItem("vuex")).userInfo
          .staffName,
        createDate: getTodayDate(),
        remark: "",
      };
      this.isConTransfer = 0;
    },
    //获取调拨单据
    getConTransferDocuments() {
      warehouseOperate({
        func: "AL0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data && data.data.length) {
            this.assetTableData = data.data;
            // let timer = setTimeout(() => {
            this.assetTableData.forEach((item) => {
              if (item.status == "0") {
                item.statusName = this.$t("h.approved");
              } else if (item.status == "1") {
                item.statusName = this.$t("h.pending");
              } else if (item.status == "2") {
                item.statusName = this.$t("h.rejectBtn");
              } else if (item.status == "3") {
                item.statusName = this.$t("h.draft");
              }
            });
            //   if (timer) {
            //     clearTimeout(timer);
            //   }
            // }, 100);
          } else {
            this.assetTableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //重置物品高级筛选
    resetArticleFilterForm() {
      this.waitFilesData = true;
      this.difference = "individual";
      this.articleHighFilterTags = [];
      this.$refs["advancedFiltering"].resetFields();
      this.advancedFiltering.maxPrice = "";
      this.advancedFiltering.maxUpperSize = "";
      this.advancedFiltering.maxLowerSize = "";
      warehouseOperate({
        func: "BU0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          houseId:
            this.conTransferFillInData.outHouseId.length > 1
              ? this.conTransferFillInData.outHouseId[
                  this.conTransferFillInData.outHouseId.length - 1
                ]
              : this.conTransferFillInData.outHouseId.join(),
          status: false,
          params: [],
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.articleData = data.data;
            this.articleData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
            });
            this.recordSortingData = JSON.parse(JSON.stringify(data.data));
            // if (this.selectArticleData && this.selectArticleData.length) {
            //   this.$nextTick(() => {
            //     this.selectArticleData.forEach((item) => {
            //       this.articleData.forEach((item2) => {
            //         if (item.sortingId == item2.sortingId) {
            //           this.toggleSelection([item2]);
            //         }
            //       });
            //     });
            //   });
            // }
          } else {
            this.articleData = [];
          }
          let timer = setTimeout(() => {
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
          this.markArticle();
          this.$refs["advancedFiltering"].resetFields();
          this.addFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
          let timer = setTimeout(() => {
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
        });
    },
    //物品高级筛选
    submitArticleFilterForm() {
      this.waitFilesData = true;
      this.difference = "individual";
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
      let params = [
        {
          key: "price",
          value:
            this.advancedFiltering.minPrice +
            "," +
            this.advancedFiltering.maxPrice,
          handle: "OIS",
        },
        {
          key: "upperSize",
          value:
            this.advancedFiltering.minUpperSize +
            "," +
            this.advancedFiltering.maxUpperSize,
          handle: "OIS",
        },
        {
          key: "lowerSize",
          value:
            this.advancedFiltering.minLowerSize +
            "," +
            this.advancedFiltering.maxLowerSize,
          handle: "OIS",
        },
        {
          key: "andLike",
          value: this.advancedFiltering.andLike,
          handle: "OIS",
        },
      ];
      params = params.filter((item) => {
        if (item.value && item.value != ",") {
          return item;
        }
      });
      warehouseOperate({
        func: "BU0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          houseId:
            this.conTransferFillInData.outHouseId.length > 1
              ? this.conTransferFillInData.outHouseId[
                  this.conTransferFillInData.outHouseId.length - 1
                ]
              : this.conTransferFillInData.outHouseId.join(),
          status: false,
          params,
        },
      })
        .then(({ data }) => {
          this.articleHighFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.articleData = data.data;
            this.articleData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
            });
            this.recordSortingData = JSON.parse(JSON.stringify(data.data));
            // if (this.selectArticleData && this.selectArticleData.length) {
            //   this.$nextTick(() => {
            //     this.selectArticleData.forEach((item) => {
            //       this.articleData.forEach((item2) => {
            //         if (item.sortingId == item2.sortingId) {
            //           this.toggleSelection([item2]);
            //         }
            //       });
            //     });
            //   });
            // }
          } else {
            this.articleData = [];
          }
          let timer = setTimeout(() => {
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
          this.markArticle();
          params.forEach((item) => {
            if (item.key == "price") {
              this.articleHighFilterTags.push({
                name: this.$t("h.price"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "upperSize") {
              this.articleHighFilterTags.push({
                name: this.$t("h.formTips70"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "lowerSize") {
              this.articleHighFilterTags.push({
                name: this.$t("h.formTips71"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            } else if (item.key == "andLike") {
              this.articleHighFilterTags.push({
                name: this.$t("h.fuzzyQuery"),
                value: item.value,
                keyStr: item.key,
                handle: item.handle,
              });
            }
          });
          // this.$refs["advancedFiltering"].resetFields();
          // this.advancedFiltering.maxPrice = "";
          // this.advancedFiltering.maxUpperSize = "";
          // this.advancedFiltering.maxLowerSize = "";
          this.addFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
          let timer = setTimeout(() => {
            this.waitFilesData = false;
            if (timer) {
              clearTimeout(timer);
            }
          }, 500);
        });
    },
    //重置主体表格高级筛选
    resetBodyFilterForm() {
      this.highFilterTags = [];
      this.$refs["bodyFiltering"].resetFields();
      warehouseOperate({
        func: "AL0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.assetTableData = data.data;
          if (this.assetTableData) {
            this.assetTableData.forEach((item) => {
              if (item.status == "0") {
                item.statusName = this.$t("h.approved");
              } else if (item.status == "1") {
                item.statusName = this.$t("h.pending");
              } else if (item.status == "2") {
                item.statusName = this.$t("h.rejectBtn");
              } else if (item.status == "3") {
                item.statusName = this.$t("h.draft");
              }
            });
          } else {
            this.assetTableData = [];
          }
          this.bodyFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 主体表格高级筛选
    submitBodyFilterForm() {
      let requstData = {
        andLike: this.bodyFiltering.andLike,
        status: this.bodyFiltering.status, //审批状态查询 0已审批/1待审批/2驳回
        createDate: this.bodyFiltering.createDate
          ? this.bodyFiltering.createDate.join()
          : this.bodyFiltering.createDate,
        staffId: this.bodyFiltering.staffId
          ? this.bodyFiltering.staffId.join()
          : this.bodyFiltering.staffId,
        outHouseId:
          this.bodyFiltering.outHouseId.length > 1
            ? this.bodyFiltering.outHouseId[
                this.bodyFiltering.outHouseId.length - 1
              ]
            : this.bodyFiltering.outHouseId.join(), //调出仓库id
        inHouseId:
          this.bodyFiltering.inHouseId.length > 1
            ? this.bodyFiltering.inHouseId[
                this.bodyFiltering.inHouseId.length - 1
              ]
            : this.bodyFiltering.inHouseId.join(), //调入仓库id
        useDate: this.bodyFiltering.useDate
          ? this.bodyFiltering.useDate.join()
          : this.bodyFiltering.useDate, //调拨日期
      };
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "AL0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          this.highFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          this.assetTableData = data.data;
          if (this.assetTableData) {
            this.assetTableData.forEach((item) => {
              if (item.status == "0") {
                item.statusName = this.$t("h.approved");
              } else if (item.status == "1") {
                item.statusName = this.$t("h.pending");
              } else if (item.status == "2") {
                item.statusName = this.$t("h.rejectBtn");
              } else if (item.status == "3") {
                item.statusName = this.$t("h.draft");
              }
            });
          } else {
            this.assetTableData = [];
          }
          for (let key in requstData) {
            if (key == "andLike") {
              this.highFilterTags.push({
                name: this.$t("h.fuzzyQuery"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "status") {
              let statusName = "";
              if (requstData[key] == "0") {
                item.statusName = this.$t("h.approved");
              } else if (requstData[key] == "1") {
                item.statusName = this.$t("h.pending");
              } else if (requstData[key] == "2") {
                item.statusName = this.$t("h.rejectBtn");
              } else if (requstData[key] == "3") {
                item.statusName = this.$t("h.draft");
              }
              this.highFilterTags.push({
                name: this.$t("h.state"),
                value: statusName,
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "createDate") {
              this.highFilterTags.push({
                name: this.$t("h.creationTime"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "staffId") {
              let name = "";
              this.employeeData.forEach((children) => {
                if (children._id == requstData[key]) {
                  name = children.name;
                }
              });
              this.highFilterTags.push({
                name: this.$t("h.creator"),
                value: name,
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "outHouseId") {
              let houseName = "";
              this.houseNameData.forEach((children) => {
                if (children.value == requstData[key]) {
                  houseName = children.name;
                }
              });
              this.highFilterTags.push({
                name: this.$t("h.formTips64"),
                value: houseName,
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "inHouseId") {
              let houseName = "";
              this.houseNameData.forEach((children) => {
                if (children.value == requstData[key]) {
                  houseName = children.name;
                }
              });
              this.highFilterTags.push({
                name: this.$t("h.formTips65"),
                value: houseName,
                uploadValue: requstData[key],
                keyStr: key,
              });
            } else if (key == "useDate") {
              this.highFilterTags.push({
                name: this.$t("h.formTips74"),
                value: requstData[key],
                keyStr: key,
              });
            }
          }
          this.bodyFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //主体表格搜索
    bodySearch() {
      warehouseOperate({
        func: "AL0001",
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
              if (requstData[key] == "0") {
                item.statusName = this.$t("h.approved");
              } else if (requstData[key] == "1") {
                item.statusName = this.$t("h.pending");
              } else if (requstData[key] == "2") {
                item.statusName = this.$t("h.rejectBtn");
              } else if (requstData[key] == "3") {
                item.statusName = this.$t("h.draft");
              }
            });
          } else {
            this.assetTableData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //主体表格选择事件
    bodySelete(val) {
      this.assetTableSelectData = val;
      if (this.assetTableSelectData.length == 0) {
        this.isEditDisable = true;
        return;
      }
      for (let i = 0; i < this.assetTableSelectData.length; i++) {
        if (this.assetTableSelectData[i].status != "3") {
          this.isEditDisable = true;
          break;
        } else if (i == this.assetTableSelectData.length - 1) {
          this.isEditDisable = false;
          break;
        }
      }
      this.assetTableSelectData.forEach((item) => {
        item.list[0].amount = item.details[0].amount;
        item.list[0].money = item.details[0].money;
      });
    },
    //编辑操作
    editingOperations(command) {
      if (command == "modify") {
        this.modifyReceiptDocuments();
      } else if (command == "delete") {
        this.deleteReceiptDocuments();
      }
    },
    //修改调拨单据
    modifyReceiptDocuments() {
      if (this.assetTableSelectData.length > 1)
        return this.$message.error(this.$t("h.tips110"));
      this.newBillsDialogVisible = true;
      this.isConTransfer = 1;
      this.conTransferFillInData = {
        roleRule: this.assetTableSelectData[0].roleRule,
        outHouseId: this.assetTableSelectData[0].outHouseId,
        useDate: this.assetTableSelectData[0].useDate,
        inHouseId: this.assetTableSelectData[0].inHouseId,
        useStaff: this.assetTableSelectData[0].useStaff,
        staffName: this.assetTableSelectData[0].staffId,
        createDate: this.assetTableSelectData[0].createDate,
        remark: this.assetTableSelectData[0].remark,
        allocateId: this.assetTableSelectData[0].allocateId,
      };
      this.articleDetailsData = this.assetTableSelectData[0].list;
      this.assetTableSelectData[0].details.forEach((item, index) => {
        this.articleDetailsData[index].amount = item.amount;
        this.articleDetailsData[index].money = item.money;
        this.articleDetailsData[index].price = item.price;
        this.articleDetailsData[index].remark = item.remark;
        this.articleDetailsData[index].substanceId = item.substanceId;
      });
      this.articleDetailsData.forEach((item) => {
        if (item.image && item.image[0] != "h") {
          item.image = window.$EXCEL_URL + "image/" + item.image;
          item.prop = item.image;
        }
      });
    },
    //删除调拨单据
    deleteReceiptDocuments() {
      let arr = [];
      this.assetTableSelectData.forEach((item) => arr.push(item.allocateId));
      let allocateId = arr.join();
      this.$confirm(this.$t("h.tips260"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          warehouseOperate({
            func: "AL0004",
            userId: this.userId,
            token: this.token,
            requstData: {
              allocateId,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message({
                type: "success",
                message: this.$t("h.tips128"),
              });
              this.getConTransferDocuments();
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
    //确认调拨单据
    confirmConTransferDocuments() {
      if (this.assetTableSelectData.length > 1)
        return this.$message.error(this.$t("h.tips110"));
      let arr = [];
      this.assetTableSelectData.forEach((item) => arr.push(item.allocateId));
      let allocateId = arr.join();
      warehouseOperate({
        func: "AL0005",
        userId: this.userId,
        token: this.token,
        requstData: {
          allocateId,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.$message({
            type: "success",
            message: this.$t("h.tips261"),
          });
          this.getConTransferDocuments();
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //查看详情
    lookDetails(row) {
      this.newBillsDialogVisible = true;
      this.look = true;
      this.conTransferFillInData = {
        roleRule: row.roleRule,
        outHouseId: row.outHouseId,
        useDate: row.useDate,
        inHouseId: row.inHouseId,
        useStaff: row.useStaff,
        staffName: row.staffId,
        createDate: row.createDate,
        remark: row.remark,
        allocateId: row.allocateId,
      };
      if (row.list) {
        this.articleDetailsData = row.list;
      } else {
        this.articleDetailsData = [];
      }
      if (row.details) {
        row.details.forEach((item, index) => {
          this.articleDetailsData[index].amount = item.amount;
          this.articleDetailsData[index].money = item.money;
          this.articleDetailsData[index].price = item.price;
          this.articleDetailsData[index].remark = item.remark;
          this.articleDetailsData[index].substanceId = item.substanceId;
        });
      }
      this.articleDetailsData.forEach((item) => {
        if (item.image && item.image[0] != "h") {
          item.image = window.$EXCEL_URL + "image/" + item.image;
          item.prop = item.image;
        }
      });
    },
    //获取打印模板数据
    getBillPrintTemplate() {
      select({
        func: "S0034",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          type: "CTR",
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.billPrintTemplate = data.data;
          this.conTransferTemplateId = localStorage.getItem(
            "conTransferTemplateId"
          );
          if (
            !this.billPrintTemplate.some(
              (item) => item._id == this.conTransferTemplateId
            )
          ) {
            this.conTransferTemplateId = this.billPrintTemplate[0]._id;
            localStorage.setItem(
              "conTransferTemplateId",
              this.conTransferTemplateId
            );
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips119"));
        });
    },
  },
  watch: {
    articleDialogVisible: async function (val) {
      if (val) {
        this.getClassificationData();
        await this.getFilesData(true);
      }
    },
    "conTransferFillInData.outHouseId": function (val) {
      for (let i = 0; i < this.warehouseData.length; i++) {
        if (
          this.warehouseData[i].value == val &&
          this.warehouseData[i].state == "-1"
        ) {
          this.warning = true;
          this.warningTitle = this.warehouseData[i].name;
          return;
        } else if (this.warehouseData.length - 1 == i) {
          this.warning = false;
          this.warningTitle = "";
          this.watchInhouse(
            this.conTransferFillInData.inHouseId.length > 1
              ? this.conTransferFillInData.inHouseId[
                  this.conTransferFillInData.inHouseId.length - 1
                ]
              : this.conTransferFillInData.inHouseId.join()
          );
        }
      }
      if (!this.look && this.isConTransfer != 1) {
        this.articleDetailsData = [];
      }
    },
    "conTransferFillInData.inHouseId": function (val) {
      for (let i = 0; i < this.warehouseData.length; i++) {
        if (
          this.warehouseData[i].value == val &&
          this.warehouseData[i].state == "-1"
        ) {
          this.warning = true;
          this.warningTitle = this.warehouseData[i].name;
          return;
        } else if (this.warehouseData.length - 1 == i) {
          this.warning = false;
          this.warningTitle = "";
          this.watchOuthouse(
            this.conTransferFillInData.outHouseId.length > 1
              ? this.conTransferFillInData.outHouseId[
                  this.conTransferFillInData.outHouseId.length - 1
                ]
              : this.conTransferFillInData.outHouseId.join()
          );
        }
      }
      if (!this.look && this.isConTransfer != 1) {
        this.articleDetailsData = [];
      }
    },
    articleDataDisplay: function () {
      if (this.selectArticleData && this.selectArticleData.length) {
        this.$nextTick(() => {
          this.selectArticleData.forEach((item) => {
            this.articleData.forEach((item2) => {
              if (item.substanceId == item2.substanceId) {
                this.toggleSelection([item2]);
              }
            });
          });
        });
      }
    },
  },
  created() {
    if (!window.localStorage.getItem("conTransferTemplateId")) {
      window.localStorage.setItem("conTransferTemplateId", 44);
    }
    this.userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
    this.token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
    this.staffId = JSON.parse(sessionStorage.getItem("vuex")).userInfo.staffId;
    this.getWarehouseData(this.userId, this.token);
    this.getConTransferDocuments();
    this.getEmployeeData();
    this.conTransferTemplateId = localStorage.getItem("conTransferTemplateId");
    this.getBillPrintTemplate();
  },
};
</script>
<style lang="scss" scoped>
.ConTransfer {
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  .card {
    width: 100%;
    height: 100%;
    padding: 20px;
    padding-top: 10px;
    box-sizing: border-box;
    ::v-deep .el-card__body {
      padding: 0;
      height: 100%;
    }
  }
}
.header {
  margin-bottom: 10px;
  .screen {
    height: 28px;
    margin-top: 5px;
    margin-bottom: 5px;
    .advancedSearch {
      margin-left: 5px;
      cursor: pointer;
      color: #798cfb;
      font-size: 14px;
    }
  }
  .dialog-select-article {
    display: flex;
    align-items: center;
    ::v-deep .el-dialog {
      height: 81.6%;
      margin-top: 0px !important;
    }
    ::v-deep .el-dialog__header {
      /* height: 2.48vh; */
      height: 3%;
    }
    ::v-deep .el-dialog__footer {
      /* height: 7.2vh; */
      height: 8.82%;
      .footer-span {
        display: inline-block;
        height: 100%;
      }
    }
  }
  .table-image-cell {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    max-width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    .no-image {
      width: 100%;
      background-color: #bbb;
    }
  }
  .bill-table {
    margin-top: 10px;
    .amount {
      color: red;
    }
    .small-input{
      width: 100px;
    }
  }
  .dialog-body {
    display: flex;
    height: 91%;
    .el-menu-vertical-demo {
      width: 32.4%;
      /* min-width: 200px; */
      box-shadow: 1px 1px 20px 0px rgba(17, 10, 80, 0.1);
    }
    .right {
      width: 67.6%;
    }
    .top {
      justify-content: space-between;
      display: flex;
      align-items: center;
    }
    .articleTable {
      margin-bottom: 10px;
    }
    .inp-box {
      display: flex;
      height: 40px;
    }
    .input-small {
      width: 45%;
    }
  }
  .warning {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX((-50%));
    color: #f56c6c;
  }
  @media screen and (min-width: 985px) and (max-width: 1199px) {
    .dialog-body {
      .right {
        width: 65%;
      }
    }
  }
  @media screen and (max-width: 984px) {
    .dialog-body {
      .right {
        width: 50%;
      }
    }
  }
}
.body {
  height: 88%;
  .inventory-name {
    color: #6a83fb;
    cursor: pointer;
  }
  .pagination {
    height: 40px;
  }
}
</style>
