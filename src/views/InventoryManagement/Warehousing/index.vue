<template>
  <div class="Warehousing">
    <!-- <button @click="a">点</button> -->
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
              :disabled="assetTableSelectData.length <= 0"
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
            <el-dropdown trigger="click" style="margin-left: 0px">
              <el-button size="small"
                >{{ $t("h.formTips5") }}
                <i class="el-icon-arrow-down el-icon--right"></i
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="goPrintBills">{{
                  $t("h.printBtn")
                }}</el-dropdown-item>
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
        <!-- 新增入库 -->
        <new-bills-dialog
          class="new-bill-dialog"
          contentWidth="55%"
          :title="$t('h.title226')"
          :newBillsDialogVisible.sync="newBillsDialogVisible"
          @sbumitForm="warehousing"
          @close="bulkBillsDialogClose"
          @opened="getWarehouseData"
          @before-close="bulkBillsDialogClose"
          :look="look"
          :warning="warning"
        >
          <template slot="form">
            <p class="warning" v-if="warning">
              {{ $t("h.formTips54") }}{{ warningTitle }}{{ $t("h.title169") }}
            </p>
            <el-row :gutter="45">
              <el-form
                ref="pushWarehouseDataRef"
                label-width="80px"
                :model="pushWarehouseData"
                :rules="pushWarehouseRules"
                :disabled="look"
              >
                <el-col :span="12">
                  <!-- 入库单号 -->
                  <el-form-item
                    :label="$t('h.warehouseEntryNumber')"
                    prop="roleRule"
                  >
                    <el-input
                      v-model="pushWarehouseData.roleRule"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- 入库仓库 -->
                  <el-form-item :label="$t('h.columns50')" prop="houseId">
                    <el-cascader
                      @change="change"
                      :options="warehouseData"
                      :props="{ checkStrictly: true }"
                      v-model="pushWarehouseData.houseId"
                      :show-all-levels="false"
                    ></el-cascader>
                    <!-- <el-select
                      v-model="pushWarehouseData.houseId"
                      placeholder="请选择仓库"
                      clearable
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
                  <!-- 业务日期 -->
                  <el-form-item :label="$t('h.formTips80')" prop="useDate">
                    <el-date-picker
                      type="date"
                      :placeholder="$t('h.tips4') + $t('h.formTips80')"
                      v-model="pushWarehouseData.useDate"
                      style="width: 100%"
                      clearable
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- 供应商信息 -->
                  <!-- <el-form-item :label="$t('h.supplier')" prop="vendName">
                    <el-input v-model="pushWarehouseData.vendName"></el-input>
                  </el-form-item> -->
                  <el-form-item :label="$t('h.supplier')" prop="vendName">
                    <el-select
                      v-model="pushWarehouseData.vendorId"
                      filterable
                      placeholder="请选择"
                      @change="change"
                    >
                      <el-option
                        v-for="item in vendors"
                        :key="item.id"
                        :label="item.vendName"
                        :value="item.vendorId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- 经办人 -->
                  <el-form-item :label="$t('h.formTips67')" prop="staffName">
                    <el-select
                      v-model="pushWarehouseData.staffName"
                      :placeholder="$t('h.tips4')"
                      clearable
                      filterable
                      disabled
                      :filter-method="() => {}"
                      v-load-more="{
                        options: staffData,
                        modelField: '_id',
                        model: staffId,
                        searchField: 'andLike',
                        func: 'S0005',
                        userInfo: userInfo,
                      }"
                    >
                      <el-option
                        v-for="item in staffData"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- 经办日期  $t('h.formTips68')-->
                  <el-form-item
                    :label="$t('h.enteringWarehouseDate')"
                    prop="createDate"
                  >
                    <el-date-picker
                      disabled
                      type="date"
                      v-model="pushWarehouseData.createDate"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- 验收结论 -->
                  <el-form-item
                    :label="$t('h.formTips85')"
                    prop="acceptanceConclusion"
                  >
                    <el-select
                      v-model="pushWarehouseData.acceptanceConclusion"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in acceptanceConclusion"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- 入库方式 -->
                  <el-form-item
                    :label="$t('h.formTips86')"
                    prop="receivingMethodId"
                  >
                    <el-select
                      v-model="pushWarehouseData.receivingMethodId"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in storageMethodListData"
                        :key="item._id"
                        :label="item.label"
                        :value="item._id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="$t('h.comment')" prop="remark">
                    <el-input
                      v-model="pushWarehouseData.remark"
                      type="textarea"
                      rows="3"
                      :placeholder="$t('h.tips4') + $t('h.comment')"
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
                  >{{ $t("h.title225") }} - {{ $t("h.title147") }}</span
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
                        @change="changeMoney(scope.$index, scope.row)"
                        class="small-input"
                      ></el-input-number>
                    </template>
                    <template v-else-if="!look && column.slotName == 'price'">
                      <el-input-number
                        v-model="scope.row[column.prop]"
                        controls-position="right"
                        :min="0"
                        @change="changeMoney(scope.$index, scope.row)"
                        class="small-input"
                      ></el-input-number>
                    </template>
                    <template v-else-if="!look && column.slotName == 'money'">
                      <el-input
                        v-model="scope.row[column.prop]"
                        controls-position="right"
                        :min="0"
                        disabled
                      ></el-input>
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
          ref="articleDialog"
          :visible.sync="articleDialogVisible"
          width="60%"
          class="dialog-select-article"
          :before-close="articleDialogVisibleClose"
        >
          <div class="dialog-body">
            <el-tree
              class="el-menu-vertical-demo"
              :data="subMenuList"
              :props="subMenuListProps"
              :highlight-current="highlightCurrent"
              node-key="sortingId"
              @node-click="sortingDataSwitching"
              v-loading="waitFilesData"
            >
              <span slot-scope="{ data }">
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
                  {{ data.code }}-{{ data.name }}
                </span>
              </span>
            </el-tree>
            <div class="right">
              <div class="top">
                <ds-search-btn
                  :searchValue.sync="articleAndLike"
                  @search="articleSearch"
                ></ds-search-btn>
                <el-button size="mini" @click="getFilesData('showAll')">{{
                  $t("h.showAllItems")
                }}</el-button>
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
                v-loading="waitFilesData"
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
                    <div class="show-tooltip" v-else>
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
          :rowKey="(row) => row.warehousingId"
          onlyKey="warehousingId"
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
              <!-- TODO:高级筛选 审核状态 -->
              <!-- <el-option :label="$t('h.pending')" value="1"></el-option> -->
              <el-option :label="$t('h.pending')" value="-1"></el-option>
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
          <el-form-item :label="$t('h.fuzzyQuery')" prop="andLike">
            <el-input v-model="bodyFiltering.andLike"></el-input>
          </el-form-item>
        </el-form>
      </ds-filter-drawer>
      <!-- 打印 -->
      <!-- @setVoucherTag="setBillPrintTemplate" -->
      <!-- 模板设置 -->
      <bill-print-template
        ref="vptRef"
        :title="`${$t('h.formTips75')}`"
        :selectId="warehousingTemplateId"
        :voucherPrintTempList="billPrintTemplate"
      ></bill-print-template>

      <kc-bill-print-dialog
        ref="vpdRef"
        locationName="warehousingTemplateId"
        :userInfo="userInfo"
        :voucherData="assetTableSelectData"
        :voucherPrintTemplate="billPrintTemplate"
      ></kc-bill-print-dialog>
    </el-card>
  </div>
</template>
<script>
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
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
  inventoryColumns,
  articleDetailsColumns,
  newItemFileColumns,
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
      highlightCurrent: true,
      //部门数据
      receivingDepartmentData: [],
      //资产属性
      assetAttrData: [],
      //打印模板
      warehousingTemplateId: "",
      billPrintTemplate: [],
      billPrintTemplate2: [],
      //用户
      userId: "",
      token: "",
      staffId: "",
      staffData: [],
      //仓库正在盘点警告
      warning: false,
      warningTitle: "",
      //员工数据
      employeeData: [],
      //判断是入库还是修改入库单据
      isWarehousing: true,
      //查看详情
      look: false,
      //主体表格
      andLike: "",
      tableLoading: false,
      assetTableData: [],
      columns: inventoryColumns,
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
        andLike: "",
      },
      highFilterTags: [],
      //仓库数据
      warehouseData: [],
      //入库数据
      newBillsDialogVisible: false,
      //入库表单数据
      pushWarehouseData: {
        roleRule: this.$t("h.warehouseEntryNumber"),
        houseId: [],
        useDate: getTodayDate(),
        vendName: "",
        // vendorId: "",
        staffName: JSON.parse(sessionStorage.getItem("vuex")).userInfo
          .staffName,
        createDate: getTodayDate(),
        remark: "",
        acceptanceConclusion: "",
        receivingMethodId: "",
      },
      acceptanceConclusion: [
        {
          value: "合格",
          label: "合格",
        },
        {
          value: "不合格",
          label: "不合格",
        },
      ],
      pushWarehouseRules: {
        houseId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips54"),
            trigger: "change",
          },
        ],
        receivingMethodId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips86"),
            trigger: "change",
          },
        ],
      },
      sourceListData: [],
      //物品详情数据
      newArticleDetailsColumns: articleDetailsColumns,
      articleDetailsData: [],
      selectArticleDetailsData: [],
      //   物品分类 + 物品档案
      articleDialogVisible: false,
      subMenuList: [],
      subMenuListProps: { children: "children", label: "name" },
      newArticleColumns: newItemFileColumns,
      articleData: [],
      articleAndLike: "",
      selectArticleData: [], //接收选中的物品数据
      articlePaginationForm: {
        currentPage: 1,
        pageSize: 20,
      },
      difference: "all",
      recordSortingData: [],
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
      waitFilesData: false,
      // 导出——存储用户勾选的行
      selectedRows: [],
      vendors: [],
    };
  },
  computed: {
    ...mapState(["userInfo", "storageMethodListData"]),
    articleTotal() {
      return this.articleData.length;
    },
    total() {
      return this.assetTableData.length;
    },
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
  },
  methods: {
    change() {
      console.log("更改的数据", this.pushWarehouseData);
    },
    // a(){
    //   console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',this.billPrintTemplate[0].txImg)
    //   this.billPrintTemplate[0].txImg = this.billPrintTemplate2[0].txImg
    //   console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',this.billPrintTemplate[0].txImg)
    // },
    // 获取供应商
    getVendors() {
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
          if (data.code != 0) return this.$message.error(data.data);
          // this.total = data.data[0];
          this.vendors = data.data[1];
          this.vendors = this.vendors.map((item) => ({
            ...item,
            vendorId: item.id,
            vendName: item.name,
          }));
          console.log("获取供应商", this.vendors);
        })
        .catch(() => {
          // 服务器网络错误，请求供应商失败
          this.$message.error(this.$t("h.tips18"));
        });
    },
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
    //获取打印模板数据  —— 入库
    getBillPrintTemplate() {
      select({
        func: "S0034",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          type: "KCRK",
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.billPrintTemplate = data.data;
          console.log("billPrintTemplate---", this.billPrintTemplate);
          this.warehousingTemplateId = localStorage.getItem(
            "warehousingTemplateId"
          );
          if (
            !this.billPrintTemplate.some(
              (item) => item._id == this.warehousingTemplateId
            )
          ) {
            this.warehousingTemplateId = this.billPrintTemplate[0]._id;
            localStorage.setItem(
              "warehousingTemplateId",
              this.warehousingTemplateId
            );
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips119"));
        });
    },
    // —— 出库
    // getBillPrintTemplate2() {
    //   select({
    //     func: "S0034",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       type: "CRE",
    //     },
    //   })
    //     .then(({ data }) => {
    //       if (data.code != 0) return this.$message.error(data.data);
    //       this.billPrintTemplate2 = data.data;
    //       console.log('billPrintTemplate2',this.billPrintTemplate2)
    //       // this.outboundTemplateId = localStorage.getItem("outboundTemplateId");
    //       // if (
    //       //   !this.billPrintTemplate2.some(
    //       //     (item) => item._id == this.outboundTemplateId
    //       //   )
    //       // ) {
    //       //   this.outboundTemplateId = this.billPrintTemplate2[0]._id;
    //       //   localStorage.setItem("outboundTemplateId", this.outboundTemplateId);
    //       // }
    //     })
    //     .catch(() => {
    //       this.$message.error(this.$t("h.tips119"));
    //     });
    // },
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
      let requstData = {
        status: "false",
        price: "",
        upperSize: "",
        lowerSize: "",
        andLike: "",
      };
      this.articleHighFilterTags.forEach((item) => {
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
            this.articleData = data.data;
            this.articleData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
            });
            this.recordSortingData = JSON.parse(JSON.stringify(data.data));
            //改
            // if (this.selectArticleData && this.selectArticleData.length) {
            //   this.$nextTick(() => {
            //     this.selectArticleData.forEach((item) => {
            //       this.articleData.forEach((item2) => {
            //         if (item.substanceId == item2.substanceId) {
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
        case "status":
          this.bodyFiltering.status = "";
          break;
        case "staffId":
          this.bodyFiltering.staffId = "";
          break;
        case "createDate":
          this.bodyFiltering.createDate = "";
          break;
        default:
          this.bodyFiltering.andLike = "";
          break;
      }
      this.highFilterTags.splice(this.highFilterTags.indexOf(val), 1);
      let requstData = {
        andLike: "",
        status: "", //审批状态查询 0为已审批 1为待审批
        createDate: "",
        staffId: "",
        type: "0", // 单据类型  选择0为入库单据 1为出库单据
      };
      this.highFilterTags.forEach((item) => {
        for (let key in requstData) {
          if (item.keyStr == key) {
            if (key == "status" || key == "staffId") {
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
        func: "WA0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.type == "0") {
                item.typeName = this.$t("h.title222");
              } else {
                item.typeName = this.$t("h.title223");
              }
              if (item.status == "0") {
                item.statusName = this.$t("h.approved");
              } else {
                item.statusName = this.$t("h.pending");
              }
              this.houseNameData.forEach((item2) => {
                if (item.houseId == item2.value) {
                  item.houseName = item2.name;
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
    //获取仓库数据
    // getWarehouseData() {
    //   warehouseOperate({
    //     func: "ST0001",
    //     userId: this.userId,
    //     token: this.token,
    //     requstData: {},
    //   })
    //     .then(({ data }) => {
    //       console.log("data->data", data.data);
    //       if (data.code == "-1") return this.$message.error(data.data);
    //       if (data.data) {
    //         let arr = [];
    //         data.data.forEach((item) => {
    //           if (!item.disabled && item.state == "0") {
    //             arr.push({
    //               name: item.name,
    //               label: item.name,
    //               value: item.houseId,
    //               state: item.state,
    //               subId: item.subId,
    //             });
    //           }
    //           this.houseNameData.push({
    //             name: item.name,
    //             value: item.houseId,
    //             state: item.state,
    //           });
    //         });
    //         this.warehouseData = this.tree(arr, "-");
    //       }
    //       console.log("houseNameData--", this.houseNameData);
    //       console.log("warehouseData--", this.warehouseData);
    //     })
    //     .catch((error) => {
    //       this.$message.error(error);
    //     });
    // },
getWarehouseData() {
  warehouseOperate({
    func: "ST0001",
    userId: this.userId,
    token: this.token,
    requstData: {},
  })
    .then(({ data }) => {
      if (data.code == "-1") {
        return this.$message.error(data.data);
      }

      if (data.data) {
        // 1. 准备用于树形结构的数组（只包含启用且未禁用的仓库）
        const treeNodes = [];
        this.houseNameData = []; // 清空，避免重复添加

        data.data.forEach((item) => {
          // 无论是否禁用，都加入 houseNameData（扁平列表）
          this.houseNameData.push({
            name: item.name,
            value: item.houseId,
            state: item.state,
          });

          // 只将启用且未禁用的节点加入树形结构
          if (!item.disabled && item.state == "0") {
            treeNodes.push({
              label: item.name, // el-tree 默认用 label 显示
              value: item.houseId, // 用 houseId 作为唯一值
              state: item.state,
              subId: item.subId,
              children: [], // 初始化 children
              code: item.code,
              disabled: item.disabled,
            });
          }
        });

        // 2. 构建树形结构（核心逻辑）
        const rootValue = "-"; // 根节点标识
        const map = {};
        const roots = [];

        treeNodes.forEach((node) => {
          map[node.value] = node;
        });

        treeNodes.forEach((node) => {
          if (node.subId === rootValue) {
            roots.push(node);
          } else {
            const parent = map[node.subId];
            if (parent) {
              parent.children.push(node);
            }
          }
        });

        // 3. 清理空的 children 属性：如果 children 存在但为空数组，则删除该属性
        const removeEmptyChildren = (nodes) => {
          nodes.forEach(node => {
            if (node.children && Array.isArray(node.children)) {
              if (node.children.length === 0) {
                // 删除 children 属性
                delete node.children;
              } else {
                // 递归处理子节点
                removeEmptyChildren(node.children);
              }
            }
          });
        };

        // 执行清理
        removeEmptyChildren(roots);

        // 4. 赋值给响应式数据
        this.warehouseData = roots;

        // 5. 打印调试
        console.log("扁平仓库列表--", this.houseNameData);
        console.log("树形仓库结构--", this.warehouseData);
      }
    })
    .catch((error) => {
      console.error("获取仓库数据失败：", error);
      this.$message.error("获取仓库数据失败：" + (error.message || "网络错误"));
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
          if (data.data) {
            this.employeeData = data.data;
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
          if (data.data) {
            this.subMenuList = data.data;
            this.subMenuList.forEach((item) => {
              if (!item.subId) {
                item.subId = "-";
              }
            });
            this.subMenuList = this.tree(this.subMenuList, "-");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //点击树状图返回将表格转换成相对应的数据
    async sortingDataSwitching(data) {
      this.highlightCurrent = true;
      this.difference = "individual";
      await this.getFilesData(data.sortingId);
    },
    // 获取物品档案数据
    getFilesData(sortingId) {
      this.waitFilesData = true;
      let mark = [];
      let requstData = { status: false };
      if (sortingId == "showAll") {
        this.difference = "all";
        this.highlightCurrent = false;
      } else if (sortingId && sortingId != "await") {
        requstData.sortingId = sortingId;
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
            this.articleData = JSON.parse(JSON.stringify(data.data));
            this.articleData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
            });
            if (sortingId == "await") {
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
            if (sortingId && sortingId != "await") {
              this.recordSortingData = JSON.parse(JSON.stringify(data.data));
            }
            let timer = setTimeout(() => {
              if (sortingId == "await") {
                this.selectArticleData = mark;
              }
              this.waitFilesData = false;
              if (timer) {
                clearTimeout(timer);
              }
            }, 500);
          } else {
            this.articleData = [];
            this.waitFilesData = false;
          }
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
            this.recordSortingData.every(
              (item2) => item.substanceId == item2.substanceId
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
      }
    },
    // 确定物品选择
    determineItemSelection() {
      this.articleDetailsData = JSON.parse(
        JSON.stringify(this.selectArticleData)
      );
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
        return this.$message.error(this.$t("h.tips256"));
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
      this.warning = false;
      this.warningTitle = "";
      this.articleAndLike = "";
      this.subMenuList = [];
      this.articleData = [];
      this.difference = "all";
    },
    outArticleDialog() {
      if (this.difference == "individual") {
        this.waitFilesData = true;
        let timer = setTimeout(() => {
          this.waitFilesData = false;
          if (timer) {
            clearTimeout(timer);
          }
        }, 500);
      }
      this.articleDialogVisible = false;
      this.warning = false;
      this.warningTitle = "";
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
        func: "SU0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          andLike: this.articleAndLike,
          status: false,
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.articleData = JSON.parse(JSON.stringify(data.data));
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
            //         if (item.substanceId == item2.substanceId) {
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
        });
    },
    //物品金额改变
    changeMoney(index, row) {
      this.articleDetailsData[index].money = row.amount * row.price;
    },

    //入库||修改入库单据
    warehousing() {
      this.$refs["pushWarehouseDataRef"].validate((valid) => {
        if (!valid) return false;
        if (!this.articleDetailsData || !this.articleDetailsData.length)
          return this.$message.error(this.$t("h.tips256"));
        let pass = false;
        let details = [];
        for (let i = 0; i < this.articleDetailsData.length; i++) {
          details.push({
            substanceId: this.articleDetailsData[i].substanceId,
            amount: this.articleDetailsData[i].amount,
            money: this.articleDetailsData[i].money,
            price: this.articleDetailsData[i].price,
          });
          if (this.articleDetailsData[i].money < 1) {
            pass = true;
          }
        }
        if (pass) {
          return this.$message.error(this.$t("h.tips258"));
        }
        let deptId = this.staffData.find(
          (item) => item._id == this.userId
        ).deptId;
        //是入库
        if (this.isWarehousing) {
          warehouseOperate({
            func: "IN0002",
            userId: this.userId,
            token: this.token,
            requstData: {
              createDate: this.pushWarehouseData.createDate,
              useDate: this.pushWarehouseData.useDate,
              staffId: this.staffId,
              deptId: deptId,
              type: "0", //传 0为入库单据  2为退库单据
              // vendName: this.pushWarehouseData.vendName,
              vendorId: this.pushWarehouseData.vendorId,
              houseId:
                this.pushWarehouseData.houseId.length > 1
                  ? this.pushWarehouseData.houseId[
                      this.pushWarehouseData.houseId.length - 1
                    ]
                  : this.pushWarehouseData.houseId.join(),
              remark: this.pushWarehouseData.remark,
              details,
              acceptanceConclusion: this.pushWarehouseData.acceptanceConclusion,
              receivingMethodId: this.pushWarehouseData.receivingMethodId,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message.success(data.data);
              this.newBillsDialogVisible = false;
              this.isWarehousing = true;
              this.$refs["pushWarehouseDataRef"].resetFields();
              this.articleDetailsData = [];
              this.selectArticleDetailsData = [];
              this.getWarehousingDocuments();
            })
            .catch((error) => {
              this.$message.error(error);
            });
        } else {
          //修改入库
          warehouseOperate({
            func: "IN0003",
            userId: this.userId,
            token: this.token,
            requstData: {
              // warehousingId: this.pushWarehouseData.warehousingId,
              // createDate: this.pushWarehouseData.createDate,
              // staffId: this.staffId,
              // deptId: deptId,
              // vendName: this.pushWarehouseData.vendName,
              // houseId:
              //   this.pushWarehouseData.houseId.length > 1
              //     ? this.pushWarehouseData.houseId[
              //         this.pushWarehouseData.houseId.length - 1
              //       ]
              //     : this.pushWarehouseData.houseId.join(),
              // remark: this.pushWarehouseData.remark,
              // details,
              warehousingId: this.pushWarehouseData.warehousingId,
              createDate: this.pushWarehouseData.createDate,
              staffId: this.staffId,
              deptId: deptId,
              // vendName: this.pushWarehouseData.vendName,
              vendorId: this.pushWarehouseData.vendorId,
              // houseId:
              //   this.pushWarehouseData.houseId.length > 1
              //     ? this.pushWarehouseData.houseId[
              //         this.pushWarehouseData.houseId.length - 1
              //       ]
              //     : this.pushWarehouseData.houseId.join(),
              houseId: Array.isArray(this.pushWarehouseData.houseId)
                ? this.pushWarehouseData.houseId.length > 1
                  ? this.pushWarehouseData.houseId[
                      this.pushWarehouseData.houseId.length - 1
                    ]
                  : this.pushWarehouseData.houseId.join("")
                : this.pushWarehouseData.houseId,
              remark: this.pushWarehouseData.remark,
              acceptanceConclusion: this.pushWarehouseData.acceptanceConclusion,
              receivingMethodId: this.pushWarehouseData.receivingMethodId,
              details,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message.success(data.data);
              this.newBillsDialogVisible = false;
              this.isWarehousing = true;
              this.$refs["pushWarehouseDataRef"].resetFields();
              this.articleDetailsData = [];
              this.selectArticleDetailsData = [];
              this.getWarehousingDocuments();
            })
            .catch((error) => {
              this.$message.error(error);
            });
        }
      });
    },
    // 关闭NewBillsDialog
    bulkBillsDialogClose() {
      this.$refs["pushWarehouseDataRef"].resetFields();
      this.articleDetailsData = [];
      this.selectArticleDetailsData = [];
      this.isWarehousing = true;
      this.look = false;
      this.pushWarehouseData = {
        roleRule: this.$t("h.warehouseEntryNumber"),
        houseId: [],
        useDate: getTodayDate(),
        vendName: "",
        vendorId: "",
        staffName: JSON.parse(sessionStorage.getItem("vuex")).userInfo
          .staffName,
        createDate: getTodayDate(),
        remark: "",
      };
      console.log("关闭Dialog 后 pushWarehouseData", this.pushWarehouseData);
    },
    //获取入库单据
    getWarehousingDocuments() {
      warehouseOperate({
        func: "WA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          type: "0",
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            let timer = setTimeout(() => {
              this.assetTableData.forEach((item) => {
                this.houseNameData.forEach((item2) => {
                  if (item.houseId == item2.value) {
                    item.houseName = item2.name;
                  }
                });
                if (item.type == "0") {
                  item.typeName = this.$t("h.title222");
                } else {
                  item.typeName = this.$t("h.title223");
                }
                if (item.status == "0") {
                  item.statusName = this.$t("h.approved");
                } else {
                  item.statusName = this.$t("h.pending");
                }
              });
              if (timer) {
                clearTimeout(timer);
              }
            }, 100);
            console.log("assetTableData-----------", this.assetTableData);
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
        func: "SU0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          status: false,
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
            //         if (item.substanceId == item2.substanceId) {
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
          this.addFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
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
      let requstData = {
        status: "false",
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
          this.articleHighFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.articleData = JSON.parse(JSON.stringify(data.data));
            this.articleData.forEach((item) => {
              if (item.image) {
                item.image = window.$EXCEL_URL + "image/" + item.image;
                item.prop = item.image;
              }
            });
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
          for (let key in requstData) {
            if (key == "price") {
              this.articleHighFilterTags.push({
                name: this.$t("h.price"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "upperSize") {
              this.articleHighFilterTags.push({
                name: this.$t("h.formTips70"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "lowerSize") {
              this.articleHighFilterTags.push({
                name: this.$t("h.formTips71"),
                value: requstData[key],
                keyStr: key,
              });
            } else if (key == "andLike") {
              this.articleHighFilterTags.push({
                name: this.$t("h.fuzzyQuery"),
                value: requstData[key],
                keyStr: key,
              });
            }
          }
          this.addFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //重置主体表格高级筛选
    resetBodyFilterForm() {
      this.$refs["bodyFiltering"].resetFields();
      this.highFilterTags = [];
      warehouseOperate({
        func: "WA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          type: "0", // 单据类型  选择0为入库单据 1为出库单据
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.type == "0") {
                item.typeName = this.$t("h.title222");
              } else {
                item.typeName = this.$t("h.title223");
              }
              if (item.status == "0") {
                item.statusName = this.$t("h.approved");
              } else {
                item.statusName = this.$t("h.pending");
              }
              this.houseNameData.forEach((item2) => {
                if (item.houseId == item2.value) {
                  item.houseName = item2.name;
                }
              });
            });
          } else {
            this.assetTableData = [];
          }
          this.$refs["bodyFiltering"].resetFields();
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
        status: this.bodyFiltering.status, //审批状态查询 0为已审批 1为待审批
        createDate: this.bodyFiltering.createDate
          ? this.bodyFiltering.createDate.join()
          : this.bodyFiltering.createDate,
        staffId: this.bodyFiltering.staffId
          ? this.bodyFiltering.staffId.join()
          : this.bodyFiltering.staffId,
        type: "0", // 单据类型  选择0为入库单据 1为出库单据
      };
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "WA0001",
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
              if (item.type == "0") {
                item.typeName = this.$t("h.title222");
              } else {
                item.typeName = this.$t("h.title223");
              }
              if (item.status == "0") {
                item.statusName = this.$t("h.approved");
              } else {
                item.statusName = this.$t("h.pending");
              }
              this.houseNameData.forEach((item2) => {
                if (item.houseId == item2.value) {
                  item.houseName = item2.name;
                }
              });
            });
          } else {
            this.assetTableData = [];
          }
          for (let key in requstData) {
            if (key == "status") {
              let statusName = "";
              if (requstData[key] == "0") {
                statusName = this.$t("h.approved");
              } else {
                statusName = this.$t("h.pending");
              }
              this.highFilterTags.push({
                name: this.$t("h.state"),
                value: statusName,
                uploadValue: requstData[key],
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
            } else if (key == "createDate") {
              this.highFilterTags.push({
                name: this.$t("h.creationTime"),
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
          // this.$refs["bodyFiltering"].resetFields();
          this.bodyFilteringVisible = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //主体表格搜索
    bodySearch() {
      warehouseOperate({
        func: "WA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          andLike: this.andLike,
          type: "0", // 单据类型  选择0为入库单据 1为出库单据
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.type == "0") {
                item.typeName = this.$t("h.title222");
              } else {
                item.typeName = this.$t("h.title223");
              }
              if (item.status == "0") {
                item.statusName = this.$t("h.approved");
              } else {
                item.statusName = this.$t("h.pending");
              }
              this.houseNameData.forEach((item2) => {
                if (item.houseId == item2.value) {
                  item.houseName = item2.name;
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
    //主体表格选择事件
    bodySelete(val) {
      console.log("选择了表格", val);
      //存储选择的数据
      this.selectedRows = val;
      console.log("存储选择的数据", this.selectedRows);
      this.assetTableSelectData = val;
      this.assetTableSelectData.forEach((item) => {
        item.list[0].amount = item.details[0].amount;
        item.list[0].money = item.details[0].money;
      });
      console.log("assetTableSelectData", this.assetTableSelectData);
    },
    //编辑操作
    editingOperations(command) {
      if (command == "modify") {
        this.modifyReceiptDocuments();
      } else if (command == "delete") {
        this.deleteReceiptDocuments();
      }
    },
    //修改入库单据
    modifyReceiptDocuments() {
      if (this.assetTableSelectData.length > 1)
        return this.$message.error(this.$t("h.tips110"));
      this.newBillsDialogVisible = true;
      this.isWarehousing = false;
      this.pushWarehouseData = {
        roleRule: this.assetTableSelectData[0].roleRule,
        houseId: this.assetTableSelectData[0].houseId,
        useDate: this.assetTableSelectData[0].useDate,
        // vendName: this.assetTableSelectData[0].vendName,
        vendorId: this.assetTableSelectData[0].vendorId,
        staffName: this.assetTableSelectData[0].staffId,
        createDate: this.assetTableSelectData[0].createDate,
        remark: this.assetTableSelectData[0].remark,
        acceptanceConclusion: this.assetTableSelectData[0].acceptanceConclusion,
        receivingMethodId: this.assetTableSelectData[0].receivingMethodId,
        warehousingId: this.assetTableSelectData[0].warehousingId,
      };
      console.log("修改入库单据------------------", this.pushWarehouseData);
      this.articleDetailsData = this.assetTableSelectData[0].list;
      this.assetTableSelectData[0].details.forEach((item, index) => {
        this.articleDetailsData[index].amount = item.amount;
        this.articleDetailsData[index].money = item.money;
        this.articleDetailsData[index].price = item.price;
        this.articleDetailsData[index].substanceId = item.substanceId;
      });
    },
    //删除入库单据
    deleteReceiptDocuments() {
      let arr = [];
      this.assetTableSelectData.forEach((item) => arr.push(item.warehousingId));
      let warehousingId = arr.join();
      this.$confirm(this.$t("h.tips260"), this.$t("h.title18"), {
        confirmButtonText: this.$t("h.confirmBtn"),
        cancelButtonText: this.$t("h.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          warehouseOperate({
            func: "WA0004",
            userId: this.userId,
            token: this.token,
            requstData: {
              warehousingId,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message({
                type: "success",
                message: this.$t("h.tips128"),
              });
              this.getWarehousingDocuments();
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
    //查看详情
    lookDetails(row) {
      this.newBillsDialogVisible = true;
      this.look = true;
      // let houseName = "";
      // this.houseNameData.forEach((item2) => {
      //   if (row.houseId == item2.value) {
      //     houseName = item2.name;
      //   }
      // });
      this.pushWarehouseData = {
        roleRule: row.roleRule,
        houseId: row.houseId,
        useDate: row.useDate,
        vendName: row.vendName,
        vendorId: row.vendorId,
        staffName: row.staffId,
        createDate: row.createDate,
        remark: row.remark,
        warehousingId: row.warehousingId,
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
    //导出
    exportFile() {
      // 有勾选 → 导出勾选；无勾选 → 导出全部
      if (this.selectedRows.length == 1) {
        //导出勾选数据
        this.exportSelectedToLocal();
      } else {
        warehouseOperate({
          func: "WA0001",
          userId: this.userId,
          token: this.token,
          requstData: {
            type: "0",
            pull: 1,
          },
        })
          .then(({ data }) => {
            if (data.code == "-1") return this.$message.error(data.data);
            console.log("导出数据：", data.data);
            clickDownloadLink(window.$EXCEL_URL + data.data);
            this.$message.success(this.$t("h.exportSuccessful"));
          })
          .catch((error) => {
            this.$message.error(error);
          });
      }
    },
    // 成 Excel 导出勾选数据
    // exportSelectedToLocal() {
    //   if (this.selectedRows.length === 0) {
    //     this.$message.warning("请先勾选要导出的数据");
    //     return;
    //   }
    // 准备数据
    // const exportData = this.selectedRows.map((row) => ({
    //   状态: row.statusName || "",
    //   单据类型:
    //     row.type === "0" ? "入库单据" : row.type === "1" ? "出库单据" : "",
    //   业务时间: row.useDate || "",
    //   业务人: row.useStaffName || "",
    //   操作人: row.staffName || "",
    //   创建时间: row.createDate || "",
    //   仓库: row.houseName || "",
    //   部门名称: row.deptName || "",
    //   供应商: row.vendName || "",
    //   备注: row.remark || "",
    // }));

    // 创建 workbook 和 worksheet
    // const workbook = new ExcelJS.Workbook();
    // const worksheet = workbook.addWorksheet("数据");

    // // 定义列（顺序与 exportData 一致）
    // const columns = Object.keys(exportData[0] || []);
    // worksheet.columns = columns.map((key) => ({
    //   header: key,
    //   key: key,
    //   width: 11, // 设置默认列宽
    // }));

    // // 设置表头样式（第1行）
    // const headerRow = worksheet.getRow(1);
    // headerRow.eachCell((cell) => {
    //   cell.font = {
    //     name: "SimSun", // 宋体
    //     size: 14,
    //     bold: true,
    //   };
    //   cell.fill = {
    //     type: "pattern",
    //     pattern: "solid",
    //     fgColor: { argb: "FFC0C0C0" }, // 表头背景色 #c0c0c0
    //   };
    //   cell.alignment = {
    //     vertical: "middle",
    //     horizontal: "center",
    //     wrapText: true, // 启用自动换行
    //   };
    // });

    // // 添加数据行
    // exportData.forEach((rowData) => {
    //   worksheet.addRow(rowData);
    // });

    // // 导出文件
    // workbook.xlsx
    //   .writeBuffer()
    //   .then((buffer) => {
    //     const blob = new Blob([buffer], {
    //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     });
    //     const fileName = `导出数据_${dayjs().format(
    //       "YYYY-MM-DD HH:mm:ss"
    //     )}.xlsx`;
    //     saveAs(blob, fileName);
    //     this.$message.success(`成功导出 ${this.selectedRows.length} 条数据`);
    //   })
    //   .catch((error) => {
    //     console.error("导出失败:", error);
    //     this.$message.error("导出失败，请重试");
    //   });
    // },
    //导出勾选数据+样式
    // exportSelectedToLocal() {
    //   // 准备数据
    //   console.log(this.selectedRows[0].list);
    //   const exportData = this.selectedRows[0].list.map((row) => ({
    //     物品编码: row.code || "",
    //     商品名称: row.name || "",
    //     入库数量: row.amount || "",
    //     入库单价: row.price || "",
    //     入库金额: row.price * row.amount || "",
    //     商品条码: row.barCode || "",
    //     规格型号: row.specification || "",
    //     安全库存下限: row.lowerSize || "",
    //     安全库存上限: row.upperSize || "",
    //     备注: row.remark || "",
    //     照片: row.image || "",
    //   }));
    //   //创建 workbook 和 worksheet
    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet("数据");

    //   // 定义列（顺序与 exportData 一致）
    //   const columns = Object.keys(exportData[0] || []);
    //   worksheet.columns = columns.map((key) => ({
    //     header: key,
    //     key: key,
    //     width: 11, // 设置默认列宽
    //   }));

    //   // 设置表头样式（第1行）
    //   const headerRow = worksheet.getRow(1);
    //   headerRow.eachCell((cell) => {
    //     cell.font = {
    //       name: "SimSun", // 宋体
    //       size: 14,
    //       bold: true,
    //     };
    //     cell.fill = {
    //       type: "pattern",
    //       pattern: "solid",
    //       fgColor: { argb: "FFC0C0C0" }, // 表头背景色 #c0c0c0
    //     };
    //     cell.alignment = {
    //       vertical: "middle",
    //       horizontal: "center",
    //       wrapText: true, // 启用自动换行
    //     };
    //   });

    //   // 添加数据行
    //   exportData.forEach((rowData) => {
    //     worksheet.addRow(rowData);
    //   });

    //   // 导出文件
    //   workbook.xlsx
    //     .writeBuffer()
    //     .then((buffer) => {
    //       const blob = new Blob([buffer], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //       });
    //       const fileName = `导出数据_${dayjs().format(
    //         "YYYY-MM-DD HH:mm:ss"
    //       )}.xlsx`;
    //       saveAs(blob, fileName);
    //       this.$message.success(`成功导出 ${this.selectedRows.length} 条数据`);
    //     })
    //     .catch((error) => {
    //       console.error("导出失败:", error);
    //       this.$message.error("导出失败，请重试");
    //     });
    // },

    async exportSelectedToLocal() {
      // 检查是否有选中数据
      if (!this.selectedRows?.length || !this.selectedRows[0]?.list?.length) {
        this.$message.warning("请先选择要导出的数据");
        return;
      }

      // 后端图片服务基础地址
      //window.$EXCEL_URL +
      // const IMAGE_BASE_URL = "http://192.168.11.137:20170/upload/image";
      const IMAGE_BASE_URL = window.$EXCEL_URL + "image";

      const list1 = this.selectedRows[0].list || [];
      const list2 = this.selectedRows[0].details || [];

      // 构建 details 的 Map（以 substanceId 为 key）
      const list2Map = new Map();
      list2.forEach((item) => {
        if (item.substanceId) {
          list2Map.set(item.substanceId, item);
        }
      });

      // 准备导出数据，确保照片字段为完整 URL
      const exportData = list1.map((row) => {
        const extra = list2Map.get(row.substanceId) || {};
        let imageUrl = row.image || "";
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = imageUrl.startsWith("/")
            ? IMAGE_BASE_URL + imageUrl
            : IMAGE_BASE_URL + "/" + imageUrl;
        }
        return {
          物品编码: row.code || "",
          商品名称: row.name || "",
          入库数量: extra.amount || "",
          入库单价: extra.price || "",
          入库金额: extra.money || "",
          商品条码: row.barCode || "",
          规格型号: row.specification || "",
          安全库存下限: row.lowerSize || "",
          安全库存上限: row.upperSize || "",
          备注: row.remark || "",
          照片: imageUrl,
        };
      });

      // 创建 workbook 和 worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("入库数据");

      // 定义所有列（包含“照片”）
      const dataColumns = [
        "物品编码",
        "商品名称",
        "入库数量",
        "入库单价",
        "入库金额",
        "商品条码",
        "规格型号",
        "安全库存下限",
        "安全库存上限",
        "备注",
        "照片", // 表头列
      ];

      // 设置列宽
      worksheet.columns = dataColumns.map((key) => ({
        header: key,
        key: key,
        width: key === "照片" ? 20 : 14,
      }));

      // 表头样式（无边框）
      const headerRow = worksheet.getRow(1);
      headerRow.height = 24;
      headerRow.eachCell((cell) => {
        cell.font = { name: "SimSun", size: 14, bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC0C0C0" },
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
      });

      // 添加数据行（照片列留空，不显示 URL）
      const textColumns = dataColumns.slice(0, -1); // 前10列
      exportData.forEach((rowData) => {
        const values = textColumns.map((col) => rowData[col]);
        values.push(""); // 第11列（照片）留空
        const row = worksheet.addRow(values);
        row.height = 80;
        row.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
        });
      });

      // 异步嵌入图片到“照片”列（第11列）
      for (let i = 0; i < exportData.length; i++) {
        const imageUrl = exportData[i].照片;
        if (!imageUrl) continue;

        try {
          const response = await fetch(imageUrl, {
            method: "GET",
            mode: "cors",
          });

          if (!response.ok) {
            console.warn(`图片请求失败 [${response.status}]:`, imageUrl);
            continue;
          }

          const contentType =
            response.headers.get("content-type") || "image/png";
          const extMatch = contentType.match(/image\/(jpeg|png|gif|bmp|webp)/);
          const extension = extMatch ? extMatch[1] : "png";

          const arrayBuffer = await response.arrayBuffer();

          const imageId = workbook.addImage({
            buffer: arrayBuffer,
            extension: extension,
          });

          // 插入到第11列（K列），行号 i + 2（第1行为表头）
          worksheet.addImage(imageId, {
            tl: { col: 10, row: i + 1 }, // 0-based: 第11列 = index 10
            br: { col: 11, row: i + 2 },
            editAs: "oneCell",
          });
        } catch (error) {
          console.error(`嵌入图片失败:`, imageUrl, error);
          worksheet.getCell(`K${i + 2}`).value = "图片加载失败";
        }
      }
      // 导出文件
      try {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileName = `入库物品明细导出_${dayjs().format(
          "YYYYMMDD_HHmmss"
        )}.xlsx`;
        saveAs(blob, fileName);
        // ${exportData.length} 条
        this.$message.success(`成功导出入库物品明细数据`);
        // this.$message.success(`导出成功`);
      } catch (err) {
        console.error("Excel 导出失败:", err);
        this.$message.error("导出失败，请重试");
      }
    },

    // 获取资产属性
    // async getAssetAttr() {
    //   const { data: res } = await select({
    //     func: "S0022",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {},
    //   });
    //   if (res.code != 0) return this.$message.error(res.data);
    //   this.assetAttrData = res.data;
    // },
  },
  watch: {
    articleDialogVisible: function (val) {
      if (val) {
        this.getClassificationData();
        if (this.articleDetailsData && this.articleDetailsData.length) {
          this.getFilesData("await");
        } else {
          this.getFilesData();
        }
      }
    },
    "pushWarehouseData.houseId": function (val) {
      for (let i = 0; i < this.houseNameData.length; i++) {
        if (
          this.houseNameData[i].value == val &&
          this.houseNameData[i].state == "-1"
        ) {
          this.warning = true;
          this.warningTitle = this.houseNameData[i].name;
          return;
        } else if (this.houseNameData.length - 1 == i) {
          this.warning = false;
          this.warningTitle = "";
        }
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
    if (!window.localStorage.getItem("warehousingTemplateId")) {
      window.localStorage.setItem("warehousingTemplateId", 42);
    }
    this.userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
    this.token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
    this.staffId = JSON.parse(sessionStorage.getItem("vuex")).userInfo.staffId;
    this.getWarehousingDocuments();
    this.getEmployeeData();
    this.warehousingTemplateId = localStorage.getItem("warehousingTemplateId");
    this.getBillPrintTemplate();
    // this.getBillPrintTemplate2()
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',this.billPrintTemplate)
    // this.getAssetAttr();
    this.getVendors();
  },
};
</script>


<style lang="scss" scoped>
.Warehousing {
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
      height: 81.6vh;
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
    .price {
      color: red;
    }
    .money {
      color: red;
    }
    .small-input {
      width: 100px;
    }
  }
  .warning {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX((-50%));
    color: #f56c6c;
  }
  .dialog-body {
    display: flex;
    /* height: 91%; */
    .el-menu-vertical-demo {
      width: 32.4%;
      /* min-width: 200px; */
      box-shadow: 1px 1px 20px 0px rgba(17, 10, 80, 0.1);
    }
    .right {
      width: 67.6%;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .articleTable {
      margin-bottom: 10px;
    }
    .inp-box {
      display: flex;
      height: 40px;
      .input-small {
        width: 45%;
      }
    }
  }
  /* @media screen and (min-width: 1200px) and (max-width: 1919px) {
  } */
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
