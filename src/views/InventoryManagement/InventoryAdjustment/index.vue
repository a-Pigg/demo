<template>
  <div class="inventoryAdjustment">
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
        <!-- 新增调整库 -->
        <new-bills-dialog
          class="new-bill-dialog"
          contentWidth="55%"
          :title="$t('h.title191')"
          :newBillsDialogVisible.sync="newBillsDialogVisible"
          @sbumitForm="warehousing"
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
                ref="pushWarehouseDataRef"
                label-width="80px"
                :model="pushWarehouseData"
                :rules="pushWarehouseRules"
                :disabled="look"
              >
                <el-col :span="12">
                  <el-form-item :label="$t('h.documentNumber')" prop="roleRule">
                    <el-input
                      v-model="pushWarehouseData.roleRule"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.formTips79')" prop="houseId">
                    <el-cascader
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
                  <el-form-item :label="$t('h.supplier')" prop="vendName">
                    <el-input v-model="pushWarehouseData.vendName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.formTips67')" prop="staffName">
                    <el-input
                      v-model="pushWarehouseData.staffName"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.formTips68')" prop="createDate">
                    <el-date-picker
                      disabled
                      type="date"
                      v-model="pushWarehouseData.createDate"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="$t('h.comment')" prop="remark">
                    <el-input
                      v-model="pushWarehouseData.remark"
                      type="textarea"
                      rows="3"
                      :placeholder="$t('h.tips3') + $t('h.comment')"
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
                  >{{ $t("h.title190") }} - {{ $t("h.title147") }}</span
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
                    <template
                      v-else-if="column.slotName == 'afterAmount' && !look"
                    >
                      <el-input-number
                        v-model="scope.row[column.prop]"
                        controls-position="right"
                        :min="1"
                        @change="changeNum(scope.$index, scope.row)"
                      ></el-input-number>
                    </template>
                    <template
                      v-else-if="column.slotName == 'afterMoney' && !look"
                    >
                      <el-input-number
                        v-model="scope.row[column.prop]"
                        controls-position="right"
                        :min="1"
                        @change="changeMoney(scope.$index, scope.row)"
                      ></el-input-number>
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
          :title="$t('h.title192')"
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
              highlight-current
              node-key="sortingId"
              current-node-key="1"
              :default-expanded-keys="['1']"
              v-loading="waitFilesData"
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
                v-loading="waitFilesData"
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
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('h.formTips79')" prop="houseId">
            <el-cascader
              :options="warehouseData"
              :props="{ checkStrictly: true }"
              v-model="bodyFiltering.houseId"
              :show-all-levels="false"
            ></el-cascader>
            <!-- <el-select
              v-model="bodyFiltering.houseId"
              placeholder="请选择仓库"
              clearable
              filterable
            >
              <el-option
                v-for="item in houseNameData"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select> -->
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
      <bill-print-template
        ref="vptRef"
        :title="`${$t('h.formTips75')}`"
        :selectId="inventoryAdjustmentTemplateId"
        :voucherPrintTempList="billPrintTemplate"
      ></bill-print-template>
      <kc-bill-print-dialog
        ref="vpdRef"
        locationName="inventoryAdjustmentTemplateId"
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
import {
  adjustferColumns,
  adjustArticleDetailsColumns,
  conTransferArticleColumns,
} from "@/utils/systemData";
import { getTodayDate, clickDownloadLink } from "@/utils/basic-methods";
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
      inventoryAdjustmentTemplateId: "",
      billPrintTemplate: [
        {
          _id: 36,
          type: "CAS",
          title: "5.5英寸调整单据标签",
          resolution: 180,
          width: 216.0,
          height: 127.0,
          xorg: 0.0,
          yorg: 0.0,
          fontFace: "思源黑体",
          fontSize: 22.0,
          item: [
            {
              name: "roleRule",
              type: "text",
              alignH: "left",
              alignV: "center",
              xpos: 34.0,
              ypos: 14.1,
              width: 46.0,
              height: 6.3,
              data: "CAS20231018101249",
              codeWidht: null,
              codeHeight: null,
              interval: null,
              itemData: null,
            },
            {
              name: "vendName",
              type: "text",
              alignH: "left",
              alignV: "center",
              xpos: 34.0,
              ypos: 23.2,
              width: 46.0,
              height: 6.3,
              data: "茶花",
              codeWidht: null,
              codeHeight: null,
              interval: null,
              itemData: null,
            },
            {
              name: "houseName",
              type: "text",
              alignH: "left",
              alignV: "center",
              xpos: 98.0,
              ypos: 14.1,
              width: 46.0,
              height: 6.3,
              data: "北京xxx",
              codeWidht: null,
              codeHeight: null,
              interval: null,
              itemData: null,
            },
            {
              name: "staffName",
              type: "text",
              alignH: "left",
              alignV: "center",
              xpos: 98.0,
              ypos: 23.2,
              width: 46.0,
              height: 6.3,
              data: "张三",
              codeWidht: null,
              codeHeight: null,
              interval: null,
              itemData: null,
            },
            {
              name: "useDate",
              type: "text",
              alignH: "left",
              alignV: "center",
              xpos: 163.0,
              ypos: 14.1,
              width: 40.0,
              height: 6.3,
              data: "2023/10/23",
              codeWidht: null,
              codeHeight: null,
              interval: null,
              itemData: null,
            },
            {
              name: "createDate",
              type: "text",
              alignH: "left",
              alignV: "center",
              xpos: 163.0,
              ypos: 23.2,
              width: 40.0,
              height: 6.3,
              data: "2023/10/23",
              codeWidht: null,
              codeHeight: null,
              interval: null,
              itemData: null,
            },
            {
              name: "tableTemp",
              type: "table",
              alignH: null,
              alignV: null,
              xpos: null,
              ypos: null,
              width: null,
              height: null,
              data: null,
              codeWidht: null,
              codeHeight: null,
              interval: null,
              itemData: [
                {
                  name: "index",
                  type: "text",
                  alignH: "center",
                  alignV: "center",
                  xpos: 16.0,
                  ypos: 49.0,
                  width: 11.0,
                  height: 8.3,
                  data: "01",
                  codeWidht: null,
                  codeHeight: null,
                  interval: 9.3,
                },
                {
                  name: "code",
                  type: "text",
                  alignH: "left",
                  alignV: "center",
                  xpos: 28.0,
                  ypos: 49.0,
                  width: 51.0,
                  height: 8.3,
                  data: "2",
                  codeWidht: null,
                  codeHeight: null,
                  interval: 9.3,
                },
                {
                  name: "name",
                  type: "text",
                  alignH: "left",
                  alignV: "center",
                  xpos: 74.0,
                  ypos: 49.0,
                  width: 53.0,
                  height: 8.3,
                  data: "扫把",
                  codeWidht: null,
                  codeHeight: null,
                  interval: 9.3,
                },
                {
                  name: "specification",
                  type: "text",
                  alignH: "left",
                  alignV: "center",
                  xpos: 121.0,
                  ypos: 49.0,
                  width: 43.0,
                  height: 8.3,
                  data: "中",
                  codeWidht: null,
                  codeHeight: null,
                  interval: 9.3,
                },
                {
                  alignH: "left",
                  alignV: "center",
                  codeHeight: null,
                  codeWidht: null,
                  data: "1",
                  height: 8.3,
                  interval: 9.3,
                  name: "amount",
                  type: "text",
                  width: 19,
                  xpos: 160,
                  ypos: 49,
                },
                {
                  alignH: "left",
                  alignV: "center",
                  codeHeight: null,
                  codeWidht: null,
                  data: "10",
                  height: 8.3,
                  interval: 9.3,
                  name: "money",
                  type: "text",
                  width: 23,
                  xpos: 178,
                  ypos: 49,
                },
              ],
            },
          ],
          txImg:
            "data:image/jpeg;base64,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MS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDYtMjhUMTU6NTc6MTkrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTAtMTNUMTY6MDk6MDUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTEwLTEzVDE2OjA5OjA1KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Y2JmYWY4M2MtOGFjNi01MjQ3LWE3Y2MtNDJkOWI3MjZhYzhiIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZjE2ODc0M2QtNThlYS02ZTQxLWI3YzItNmE2ZGI5YjU5YzZiIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Y2Q4OTUyMjMtNDEyYi00ODRmLTkxZDAtYzBmZmNlNGRlNGU3IiBwaG90b3Nob3A6Q29sb3JNb2RlPSIxIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iRG90IEdhaW4gMTUlIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZDg5NTIyMy00MTJiLTQ4NGYtOTFkMC1jMGZmY2U0ZGU0ZTciIHN0RXZ0OndoZW49IjIwMjItMDYtMjhUMTU6NTc6MTkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDM1NTg2MjEtOGIzZS1mNTRjLTkwZDMtZDQxNDk5NjU4N2UzIiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI4VDE1OjU3OjM5KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuNCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzYzFhZTY3LTU1OTItZWM0Zi05MmNmLWE2MTMwYjQ3ZDhkZCIgc3RFdnQ6d2hlbj0iMjAyMy0xMC0xM1QxNjowOTowNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9qcGVnIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL2pwZWciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmNiZmFmODNjLThhYzYtNTI0Ny1hN2NjLTQyZDliNzI2YWM4YiIgc3RFdnQ6d2hlbj0iMjAyMy0xMC0xM1QxNjowOTowNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2M2MxYWU2Ny01NTkyLWVjNGYtOTJjZi1hNjEzMGI0N2Q4ZGQiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjZTI1MjNjZS0zZGRmLWY4NGYtYTA1My05N2FhNTk1OGYwZDUiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZDg5NTIyMy00MTJiLTQ4NGYtOTFkMC1jMGZmY2U0ZGU0ZTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iA6BJQ0NfUFJPRklMRQABAQAAA5BBREJFAhAAAHBydHJHUkFZWFlaIAfPAAYAAwAAAAAAAGFjc3BBUFBMAAAAAG5vbmUAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtQURCRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWNwcnQAAADAAAAAMmRlc2MAAAD0AAAAZ3d0cHQAAAFcAAAAFGJrcHQAAAFwAAAAFGtUUkMAAAGEAAACDHRleHQAAAAAQ29weXJpZ2h0IDE5OTkgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQAAABkZXNjAAAAAAAAAA1Eb3QgR2FpbiAxNSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAAD21gABAAAAANMtWFlaIAAAAAAAAAAAAAAAAAAAAABjdXJ2AAAAAAAAAQAAAAAQACoATgB5AKoA4AEbAVoBngHlAjECgALSAygDgQPdBDwEngUDBWsF1QZCBrIHJAeZCBAIiQkFCYMKAwqGCwsLkQwaDKUNMw3CDlMO5g97EBIQqxFGEeISgRMhE8MUZxUNFbUWXhcJ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1OsiVqkrqdZErVJXU6yJWqSup1kStUldTqO5Yk4EjSEX8LJtYzmzclrmt6YZvHcyG83ebq1WRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTqY2ISUUozqJaiyQHytuZbrsUGmw+8cxKyJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nUNsgkqoxmkWzFkmPkbbyHWoptOB943iVkStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdTyUJOA5IqmCLJL/DQG84IRc0eb3N3HsZ3cnG6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1P3j9X4ZL3rjo9RN946R+yi9Fk8ZsrxRF6LJ4zZXiqd0V7i3PEUHorPFt+A7R6UP5XZvgk/eP1fhkveuOj1E33jpH7KL0WTxmyvFEXosnjNleKp3RXuLc8RQeis8W34DtHpQ/ldm+CT94/V+GS9646PUTfeOkfsovRZPGbK8UReiyeM2V4qndFe4tzxFB6KzxbfgO0elD+V2b4JP3j9X4ZL3rjo9RN946R+yi9Fk8ZsrxRF6LJ4zZXiqd0V7i3PEUHorPFt+A7R6UP5XZvgk/eP1fhkveuOj1E33jpH7KL0WTxmyvFEXosnjNleKp3RXuLc8RQeis8W34DtHpQ/ldm+CT94/V+GS9646PUTfeOkfsovRZPGbK8UReiyeM2V4qndFe4tzxFB6KzxbfgO0elD+V2b4JP3j9X4ZL3rjo9RN946R+yi9Fk8ZsrxRF6LJ4zZXiqd0V7i3PEUHorPFt+A7R6UP5XZvgk/eP1fhkveuOj1E33jpH7KL0WTxmyvFEXosnjNleKp3RXuLc8RQeis8W34DtHpQ/ldm+CT94/V+GS9646PUV+TEYddK8wmbQGa4HXwG044FvIrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydR2khxkAo0glG6bsqQubNFsyC7y2712x/McrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydR2khxkAo0glG6bsqQubNFsyC7y2712x/McrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1MdahxgMIzpCQtNiQkLbhAYGLeKY1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OobrsOMZnGaIiJpsiIibbIzMybxjKtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TqeJw4yoEkRFFabWyPNoDthvN4gXrjjn77laDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk60GLwLfJ1oMXgW+TrQYvAt8nWgxeBb5OtBi8C3ydaDF4Fvk6n7x+r8Ml71x0eom+8dI/ZReiyeM2V4oi9Fk8ZsrxVO6K9xbniKD0Vni2/Ado9KH8rs3wSfvH6vwyXvXHR6ib7x0j9lF6LJ4zZXiiL0WTxmyvFU7or3FueIoPRWeLb8B2j0ofyuzfBJ+8fq/DJe9cdHqJvvHSP2UXosnjNleKIvRZPGbK8VTuivcW54ig9FZ4tvwHaPSh/K7N8En7x+r8Ml71x0eom+8dI/ZReiyeM2V4oi9Fk8ZsrxVO6K9xbniKD0Vni2/Ado9KH8rs3wSfvH6vwyXvXHR6ib7x0j9lF6LJ4zZXiiL0WTxmyvFU7or3FueIoPRWeLb8B2j0ofyuzfBJ+8fq/DJe9cdHqJvvHSP2UXosnjNleKIvRZPGbK8VTuivcW54ig9FZ4tvwHaPSh/K7N8En7x+r8Ml71x0eom+8dI/ZReiyeM2V4oi9Fk8ZsrxVO6K9xbniKD0Vni2/Ado9KH8rs3wSfvH6vwyXvXHR6ivOG+hFeYUCQ+0HkdfHFYjSWmQ/gbrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlR27cnAsaQq/ipNrFc2bku86vQDOY7eQ5m7zcmqy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65Udu3JwLGkKv4qTaxXNm5LvOr0AzmO3kOZu83JqsuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65UxwTkqoxnVS1KkmPkbcy2nZRtOB925iVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1yobhHJRSjNKtmVJAfK23kNNSgabD7tvErLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKnipycASRRMEqSP+GgOZwglZ085ujuPYzW5Nt1lytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcrLla3K65WXK1uV1ysuVrcrrlZcrW5XXKy5WtyuuVlytbldcqfvH6vwyXvXHR6ib7x0j9lF6LJ4zZXiiL0WTxmyvFU7or3FueIoPRWeLb8B2j0ofyuzfBJ+8fq/DJe9cdHqJvvHSP2UXosnjNleKIvRZPGbK8VTuivcW54ig9FZ4tvwHaPSh/K7N8En7x+r8Ml71x0eom+8dI/ZReiyeM2V4oi9Fk8ZsrxVO6K9xbniKD0Vni2/Ado9KH8rs3wSfvH6vwyXvXHR6ib7x0j9lF6LJ4zZXiiL0WTxmyvFU7or3FueIoPRWeLb8B2j0ofyuzfBJ+8fq/DJe9cdHqJvvHSP2UXosnjNleKIvRZPGbK8VTuivcW54ig9FZ4tvwHaPSh/K7N8En7x+r8Ml71x0eom+8dI/ZReiyeM2V4oi9Fk8ZsrxVO6K9xbniKD0Vni2/Ado9KH8rs3wSfvH6vwyXvXHR6ib7x0j9lF6LJ4zZXiiL0WTxmyvFU7or3FueIoPRWeLb8B2j0ofyuzfBJ+8fq/DJe9cdHqKsZ9gGs5gE2DcNM6/atPN7QjAeP9wFaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71qOiyI1vm0jAvN3LKDebNvBJv+pYxlmrB3ubzmbcvM1pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWo6LIjW+bSMC83csoN5s28Em/wCpYxlmrB3ubzmbcvM1pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71qYrsiMQJGdtIMdwSUbty2IOFtJ27P6905/LrSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetQ1akRhBYzVlCjuESDdt2BNwdpNXh/Xum/5daVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61PsSIyKkkbSrHcW0XNoGM3/9yC7C6u8TO4+cvM5dN6VF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWp+8fq/DJe9cdHqJvvHSP2UXosnjNleKIvRZPGbK8VTuivcW54ig9FZ4tvwHaPSh/K7N8En7x+r8Ml71x0eom+8dI/ZReiyeM2V4oi9Fk8ZsrxVO6K9xbniKD0Vni2/Ado9KH8rs3wSfvH6vwyXvXHR6ib7x0j9lF6LJ4zZXiiL0WTxmyvFU7or3FueIoPRWeLb8B2j0ofyuzfBJ+8fq/DJe9cdHqJvvHSP2UXosnjNleKIvRZPGbK8VTuivcW54ig9FZ4tvwHaPSh/K7N8En7x+r8Ml71x0eom+8dI/ZReiyeM2V4oi9Fk8ZsrxVO6K9xbniKD0Vni2/Ado9KH8rs3wSfvH6vwyXvXHR6ib7x0j9lF6LJ4zZXiiL0WTxmyvFU7or3FueIoPRWeLb8B2j0ofyuzfBJ+8fq/DJe9cdHqJvvHSP2UXosnjNleKIvRZPGbK8VTuivcW54ig9FZ4tvwHaPSh/K7N8En7x+r8Ml71x0eoqRmGDazmAjfNs1zr9q0y3s+SAY/351osXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqo6rHjW+bSMCc4csqN5s28InP6bimOasBdZzOZxu7zuixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6qjqseNb5tIwJzhyyo3mzbwic/puKY5qwF1nM5nG7vO6LF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6qmI7HjCCxnbSjIcIkG7ctkDZbNavD+pet/zK0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0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",
          bkImg: "",
          dbName: null,
        },
      ],
      //用户
      userId: "",
      token: "",
      staffId: "",
      //员工数据
      employeeData: [],
      //部门数据
      deptId: "",
      //查看详情
      look: false,
      //仓库正在盘点警告
      warning: false,
      warningTitle: "",
      //主体表格
      andLike: "",
      tableLoading: false,
      assetTableData: [],
      columns: adjustferColumns,
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
        houseId: [],
        createDate: "",
        andLike: "",
      },
      highFilterTags: [],
      //仓库数据
      warehouseData: [],
      //调整库数据
      newBillsDialogVisible: false,
      pushWarehouseData: {
        roleRule: this.$t("h.title193"),
        houseId: [],
        useDate: getTodayDate(),
        vendName: "",
        staffName: JSON.parse(sessionStorage.getItem("vuex")).userInfo
          .staffName,
        createDate: getTodayDate(),
        remark: "",
      },
      pushWarehouseRules: {
        houseId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.formTips54"),
            trigger: "change",
          },
        ],
      },
      sourceListData: [],
      //物品详情数据
      newArticleDetailsColumns: adjustArticleDetailsColumns,
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
    articleTotal() {
      return this.articleData.length;
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
            this.pushWarehouseData.houseId.length > 1
              ? this.pushWarehouseData.houseId[
                  this.pushWarehouseData.houseId.length - 1
                ]
              : this.pushWarehouseData.houseId.join(),
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
        case "status":
          this.bodyFiltering.status = "";
          break;
        case "staffId":
          this.bodyFiltering.staffId = "";
          break;
        case "houseId":
          this.bodyFiltering.houseId = [];
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
        houseId: "",
        status: "",
        createDate: "",
        staffId: "",
      };
      this.highFilterTags.forEach((item) => {
        for (let key in requstData) {
          if (item.keyStr == key) {
            if (key == "status" || key == "staffId" || key == "houseId") {
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
        func: "AD0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
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
        func: "AD0001",
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
              this.houseNameData.push({
                name: item.name,
                value: item.houseId,
                state: item.state,
              });
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
          if (data.data) {
            this.employeeData = data.data;
            this.deptId = data.data.find(
              (item) => item._id == this.userInfo._id
            ).deptId;
          } else {
            this.employeeData = [];
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
            this.pushWarehouseData.houseId.length > 1
              ? this.pushWarehouseData.houseId[
                  this.pushWarehouseData.houseId.length - 1
                ]
              : this.pushWarehouseData.houseId.join(),
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          this.subMenuList = [{ children: null, name: this.$t("h.title174"), sortingId: "1" }];
          if (data.data) {
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
    sortingDataSwitching(val) {
      if (val.sortingId == "1") {
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
              this.pushWarehouseData.houseId.length > 1
                ? this.pushWarehouseData.houseId[
                    this.pushWarehouseData.houseId.length - 1
                  ]
                : this.pushWarehouseData.houseId.join(),
            status: false,
            sortingId: val.sortingId,
            params: [],
          },
        })
          .then(({ data }) => {
            if (data.code == "-1")
              return this.$message.error(data.data ? data.data : this.$t("h.tips256"));
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
            this.pushWarehouseData.houseId.length > 1
              ? this.pushWarehouseData.houseId[
                  this.pushWarehouseData.houseId.length - 1
                ]
              : this.pushWarehouseData.houseId.join(),
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
              this.waitFilesData = false;
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
        this.selectArticleData.forEach((item) => {
          if (!item.amount) {
            item.amount = 0;
          }
          if (!item.price) {
            item.price = 0;
          }
          if (!item.money) {
            item.money = 0;
          }
          if (!item.contrastAmount) {
            item.contrastAmount = 0;
          }
          if (!item.contrastPrice) {
            item.contrastPrice = 0;
          }
          if (!item.contrastMoney) {
            item.contrastMoney = 0;
          }
          if (!item.afterAmount) {
            item.afterAmount = 0;
          }
          if (!item.afterPrice) {
            item.afterPrice = 0;
          }
          if (!item.afterMoney) {
            item.afterMoney = 0;
          }
        });
        this.selectArticleData = JSON.parse(JSON.stringify(val));
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
        this.selectArticleData.forEach((item) => {
          if (!item.amount) {
            item.amount = 0;
          }
          if (!item.price) {
            item.price = 0;
          }
          if (!item.money) {
            item.money = 0;
          }
          if (!item.contrastAmount) {
            item.contrastAmount = 0;
          }
          if (!item.contrastPrice) {
            item.contrastPrice = 0;
          }
          if (!item.contrastMoney) {
            item.contrastMoney = 0;
          }
          if (!item.afterAmount) {
            item.afterAmount = 0;
          }
          if (!item.afterPrice) {
            item.afterPrice = 0;
          }
          if (!item.afterMoney) {
            item.afterMoney = 0;
          }
        });
        this.selectArticleData = this.selectArticleData.concat(
          JSON.parse(JSON.stringify(val))
        );
      }
    },
    // 确定物品选择
    determineItemSelection() {
      this.$nextTick(() => {
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
      });
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
              item2.contrastAmount = item.contrastAmount;
              item2.contrastPrice = item.contrastPrice;
              item2.contrastMoney = item.contrastMoney;
              item2.afterAmount = item.afterAmount;
              item2.afterPrice = item.afterPrice;
              item2.afterMoney = item.afterMoney;
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
        return this.$message.error( this.$t("h.tips22"));
      for (let i = this.articleDetailsData.length - 1; i >= 0; i--) {
        this.selectArticleDetailsData.forEach((item2) => {
          if (
            this.articleDetailsData[i] &&
            this.articleDetailsData[i].substanceId == item2.substanceId
          ) {
            this.articleDetailsData.splice(i, 1);
            if (i == 0) {
              this.$message.success( this.$t("h.tips128"));
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
            this.pushWarehouseData.houseId.length > 1
              ? this.pushWarehouseData.houseId[
                  this.pushWarehouseData.houseId.length - 1
                ]
              : this.pushWarehouseData.houseId.join(),
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
    //物品数量改变
    changeNum(index, row) {
      this.articleDetailsData[index].afterMoney =
        row.afterPrice * row.afterAmount;
      if (row.afterMoney != this.articleDetailsData[index].afterMoney) {
        this.articleDetailsData[index].afterPrice =
          row.afterMoney / row.afterAmount;
      }
      this.articleDetailsData[index].contrastAmount =
        row.afterAmount - row.amount;
      this.articleDetailsData[index].contrastPrice = row.afterPrice - row.price;
      this.articleDetailsData[index].contrastMoney = row.afterMoney - row.money;
    },
    //物品金额改变
    changeMoney(index, row) {
      this.articleDetailsData[index].afterPrice =
        row.afterMoney / row.afterAmount;
      this.articleDetailsData[index].contrastAmount =
        row.afterAmount - row.amount;
      this.articleDetailsData[index].contrastPrice = row.afterPrice - row.price;
      this.articleDetailsData[index].contrastMoney = row.afterMoney - row.money;
    },
    //调整库
    warehousing() {
      this.$refs["pushWarehouseDataRef"].validate((valid) => {
        if (!valid) return false;
        if (!this.articleDetailsData || !this.articleDetailsData.length)
          return this.$message.error(this.$t("h.tips22"));
        let pass = false;
        let details = [];
        for (let i = 0; i < this.articleDetailsData.length; i++) {
          details.push({
            substanceId: this.articleDetailsData[i].substanceId,
            amount: this.articleDetailsData[i].contrastAmount,
            money: this.articleDetailsData[i].contrastMoney,
            price: this.articleDetailsData[i].contrastPrice,
          });
          if (this.articleDetailsData[i].money < 1) {
            pass = true;
          }
        }
        if (pass) {
          return this.$message.error(this.$t("h.tips258"));
        }
        warehouseOperate({
          func: "AD0002",
          userId: this.userId,
          token: this.token,
          requstData: {
            createDate: this.pushWarehouseData.createDate,
            useDate: this.pushWarehouseData.useDate,
            staffId: this.staffId,
            deptId: this.deptId,
            remark: this.pushWarehouseData.remark,
            houseId:
              this.pushWarehouseData.houseId.length > 1
                ? this.pushWarehouseData.houseId[
                    this.pushWarehouseData.houseId.length - 1
                  ]
                : this.pushWarehouseData.houseId.join(),
            details,
          },
        })
          .then(({ data }) => {
            if (data.code == "-1") return this.$message.error(data.data);
            this.$message.success(data.data);
            this.newBillsDialogVisible = false;
            this.$refs["pushWarehouseDataRef"].resetFields();
            this.articleDetailsData = [];
            this.selectArticleDetailsData = [];
            this.getWarehousingDocuments();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      });
    },
    // 关闭NewBillsDialog
    bulkBillsDialogClose() {
      this.$refs["pushWarehouseDataRef"].resetFields();
      this.look = false;
      this.articleDetailsData = [];
      this.pushWarehouseData = {
        roleRule: this.$t("h.title193"),
        houseId: [],
        useDate: getTodayDate(),
        vendName: "",
        staffName: JSON.parse(sessionStorage.getItem("vuex")).userInfo
          .staffName,
        createDate: getTodayDate(),
        remark: "",
      };
      this.selectArticleDetailsData = [];
    },
    //获取调整库单据
    getWarehousingDocuments() {
      warehouseOperate({
        func: "AD0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
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
            this.pushWarehouseData.houseId.length > 1
              ? this.pushWarehouseData.houseId[
                  this.pushWarehouseData.houseId.length - 1
                ]
              : this.pushWarehouseData.houseId.join(),
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
            this.pushWarehouseData.houseId.length > 1
              ? this.pushWarehouseData.houseId[
                  this.pushWarehouseData.houseId.length - 1
                ]
              : this.pushWarehouseData.houseId.join(),
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
        func: "AD0001",
        userId: this.userId,
        token: this.token,
        requstData: {},
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
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
        houseId:
          this.bodyFiltering.houseId.length > 1
            ? this.bodyFiltering.houseId[this.bodyFiltering.houseId.length - 1]
            : this.bodyFiltering.houseId.join(),
        status: this.bodyFiltering.status,
        createDate: this.bodyFiltering.createDate
          ? this.bodyFiltering.createDate.join()
          : this.bodyFiltering.createDate,
        staffId: this.bodyFiltering.staffId
          ? this.bodyFiltering.staffId.join()
          : this.bodyFiltering.staffId,
      };
      for (let key in requstData) {
        if (requstData[key] == "" || requstData[key] == ",") {
          delete requstData[key];
        }
      }
      warehouseOperate({
        func: "AD0001",
        userId: this.userId,
        token: this.token,
        requstData,
      })
        .then(({ data }) => {
          this.highFilterTags = [];
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
          } else {
            this.assetTableData = [];
          }
          for (let key in requstData) {
            if (key == "status") {
              let statusName = "";
              if (requstData[key] == "0") {
                statusName = this.$t("h.approved");
              } else if (requstData[key] == "1") {
                statusName = this.$t("h.pending");
              } else {
                statusName = this.$t("h.rejectBtn");
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
            } else if (key == "houseId") {
              let houseName = "";
              this.houseNameData.forEach((children) => {
                if (children.value == requstData[key]) {
                  houseName = children.name;
                }
              });
              this.highFilterTags.push({
                name: this.$t("h.formTips54"),
                value: houseName,
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
        func: "AD0001",
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
          } else {
            this.assetTableData = data.data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //主体表格选择事件
    bodySelete(val) {
      this.assetTableSelectData = val;
      this.assetTableSelectData.forEach((item) => {
        item.list[0].amount = item.details[0].newAmount;
        item.list[0].money = item.details[0].newMoney;
      });
    },
    //查看详情
    lookDetails(row) {
      this.newBillsDialogVisible = true;
      this.look = true;
      this.pushWarehouseData = {
        roleRule: row.roleRule,
        houseId: row.houseId,
        useDate: row.useDate,
        vendName: row.vendName,
        staffName: row.staffId,
        createDate: row.createDate,
        remark: row.remark,
      };
      if (row.list) {
        this.articleDetailsData = row.list;
      } else {
        this.articleDetailsData = [];
      }
      if (row.details) {
        row.details.forEach((item, index) => {
          this.articleDetailsData[index].amount = item.oldAmount;
          this.articleDetailsData[index].money = item.oldMoney;
          this.articleDetailsData[index].price = item.oldPrice;
          this.articleDetailsData[index].contrastAmount = item.amount;
          this.articleDetailsData[index].contrastMoney = item.money;
          this.articleDetailsData[index].contrastPrice = item.price;
          this.articleDetailsData[index].afterAmount = item.newAmount;
          this.articleDetailsData[index].afterMoney = item.newMoney;
          this.articleDetailsData[index].afterPrice = item.newPrice;
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
    //获取部门数据
    // getReceivingDepartmentData() {
    //   select({
    //     func: "S0004",
    //     userId: this.userInfo._id,
    //     token: this.userInfo.token,
    //     requstData: {
    //       _id: "",
    //     },
    //   })
    //     .then(({ data }) => {
    //       if (data.code == "-1") return this.$message.error(data.data);
    //       if (data.data) {
    //         this.deptId = data.data.find(
    //           (item) => item._id == this.userId
    //         ).deptId;
    //       }
    //     })
    //     .catch((error) => {
    //       this.$message.error(error);
    //     });
    // },
  },
  watch: {
    articleDialogVisible: async function (val) {
      if (val) {
        this.getClassificationData();
        await this.getFilesData(true);
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
      if (!this.look) {
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
    if (!window.localStorage.getItem("inventoryAdjustmentTemplateId")) {
      window.localStorage.setItem("inventoryAdjustmentTemplateId", 43);
    }
    this.userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
    this.token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
    this.staffId = JSON.parse(sessionStorage.getItem("vuex")).userInfo.staffId;
    this.getWarehousingDocuments();
    this.getEmployeeData();
    this.getWarehouseData(this.userInfo._id, this.userInfo.token);
    // this.getReceivingDepartmentData();
    this.inventoryAdjustmentTemplateId = localStorage.getItem(
      "inventoryAdjustmentTemplateId"
    );
  },
};
</script>
<style lang="scss" scoped>
.inventoryAdjustment {
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
  .screen {
    height: 28px;
    margin-top: 5px;
    margin-bottom: 5px;
    .advancedSearch {
      font-size: 14px;
      margin-left: 5px;
      cursor: pointer;
      color: #798cfb;
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
  .bill-table {
    margin-top: 10px;
    .afterAmount {
      color: red;
    }
    .afterMoney {
      color: red;
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
