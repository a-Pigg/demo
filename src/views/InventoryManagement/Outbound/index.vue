<template>
  <div class="Warehousing">
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
            <el-button type="primary" size="small" @click="stockReturn">{{
              $t("h.returningInventory")
            }}</el-button>
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
        <!-- 新增出库 -->
        <new-bills-dialog
          class="new-bill-dialog"
          contentWidth="55%"
          :title="isWarehousing == '2' ? $t('h.title215') : $t('h.title216')"
          :newBillsDialogVisible.sync="newBillsDialogVisible"
          @sbumitForm="outbound"
          @close="bulkBillsDialogClose"
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
                  <el-form-item
                    :label="
                      isWarehousing == '2' ? $t('h.title217') : $t('h.title218')
                    "
                    prop="roleRule"
                  >
                    <el-input
                      v-model="pushWarehouseData.roleRule"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="
                      isWarehousing == '2' ? $t('h.title219') : $t('h.title220')
                    "
                    prop="houseId"
                  >
                    <el-cascader
                      :options="warehouseData"
                      :props="{ checkStrictly: true }"
                      v-model="pushWarehouseData.houseId"
                      :show-all-levels="false"
                    ></el-cascader>
                    <!-- <el-select
                      v-model="pushWarehouseData.houseId"
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
                  <el-form-item
                    :label="
                      isWarehousing == '2'
                        ? $t('h.revertDate')
                        : $t('h.collectionDate')
                    "
                    prop="useDate"
                  >
                    <el-date-picker
                      type="date"
                      :placeholder="
                        isWarehousing == '2'
                          ? $t('h.tips4') + $t('h.revertDate')
                          : $t('h.tips4') + $t('h.collectionDate')
                      "
                      v-model="pushWarehouseData.useDate"
                      style="width: 100%"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="
                      isWarehousing == '2'
                        ? $t('h.personWhoReturned')
                        : $t('h.recipient')
                    "
                    prop="useStaff"
                  >
                    <el-select
                      v-model="pushWarehouseData.useStaff"
                      :placeholder="
                        isWarehousing == '2'
                          ? $t('h.tips4') + $t('h.personWhoReturned')
                          : $t('h.tips4') + $t('h.recipient')
                      "
                      @change="selectEmployee"
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
                  <el-form-item
                    :label="
                      isWarehousing == '2'
                        ? $t('h.revertDepartment')
                        : $t('h.collectionDepartment')
                    "
                    prop="deptId"
                  >
                    <el-select
                      v-model="pushWarehouseData.deptId"
                      :placeholder="
                        isWarehousing == '2'
                          ? $t('h.tips4') + $t('h.revertDepartment')
                          : $t('h.tips4') + $t('h.collectionDepartment')
                      "
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="item in receivingDepartmentData"
                        :key="item._id"
                        :label="item.deptName"
                        :value="item._id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('h.formTips67')" prop="staffName">
                    <el-select
                      v-model="pushWarehouseData.staffName"
                      :placeholder="$t('h.tips4')"
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
                  >{{
                    isWarehousing == "2" ? $t("h.title213") : $t("h.title214")
                  }}
                  - {{ $t("h.title147") }}</span
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
                      ></el-input-number>
                    </template>
                    <template v-else-if="!look && column.slotName == 'price'">
                      <el-input-number
                        v-model="scope.row[column.prop]"
                        controls-position="right"
                        :min="0"
                        @change="changeMoney(scope.$index, scope.row)"
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
              @node-click="sortingDataSwitching"
              v-loading="waitFilesData"
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
              :placeholder="$t('h.tips4') + $t('h.title221')"
            >
              <el-option :label="$t('h.approved')" value="0"></el-option>
              <el-option :label="$t('h.pending')" value="1"></el-option>
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
      <bill-print-template
        ref="vptRef"
        :title="`${$t('h.formTips75')}`"
        :selectId="outboundTemplateId"
        :voucherPrintTempList="billPrintTemplate"
      ></bill-print-template>
      <kc-bill-print-dialog
        ref="vpdRef"
        locationName="outboundTemplateId"
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
  OutboundColumns,
  outboundDetailsColumns,
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
      outboundTemplateId: "",
      billPrintTemplate: [
        // {
        //   _id: 34,
        //   type: "CRE",
        //   title: "5.5英寸出库单据标签",
        //   resolution: 180,
        //   width: 216.0,
        //   height: 127.0,
        //   xorg: 0.0,
        //   yorg: 0.0,
        //   fontFace: "思源黑体",
        //   fontSize: 22.0,
        //   item: [
        //     {
        //       name: "roleRule",
        //       type: "text",
        //       alignH: "left",
        //       alignV: "center",
        //       xpos: 34.0,
        //       ypos: 14.1,
        //       width: 52.0,
        //       height: 6.3,
        //       data: "CRE20231016143829",
        //       codeWidht: null,
        //       codeHeight: null,
        //       interval: null,
        //       itemData: null,
        //     },
        //     {
        //       name: "useStaffName",
        //       type: "text",
        //       alignH: "left",
        //       alignV: "center",
        //       xpos: 34.0,
        //       ypos: 23.2,
        //       width: 52.0,
        //       height: 6.3,
        //       data: "张三",
        //       codeWidht: null,
        //       codeHeight: null,
        //       interval: null,
        //       itemData: null,
        //     },
        //     {
        //       name: "houseName",
        //       type: "text",
        //       alignH: "left",
        //       alignV: "center",
        //       xpos: 99.0,
        //       ypos: 14.1,
        //       width: 33.0,
        //       height: 6.3,
        //       data: "北京xxx",
        //       codeWidht: null,
        //       codeHeight: null,
        //       interval: null,
        //       itemData: null,
        //     },
        //     {
        //       name: "deptName",
        //       type: "text",
        //       alignH: "left",
        //       alignV: "center",
        //       xpos: 99.0,
        //       ypos: 23.2,
        //       width: 33.0,
        //       height: 6.3,
        //       data: "人事部",
        //       codeWidht: null,
        //       codeHeight: null,
        //       interval: null,
        //       itemData: null,
        //     },
        //     {
        //       name: "createDate",
        //       type: "text",
        //       alignH: "left",
        //       alignV: "center",
        //       xpos: 99.0,
        //       ypos: 31.8,
        //       width: 75.0,
        //       height: 6.3,
        //       data: "2023-10-16",
        //       codeWidht: null,
        //       codeHeight: null,
        //       interval: null,
        //       itemData: null,
        //     },
        //     {
        //       name: "useDate",
        //       type: "text",
        //       alignH: "left",
        //       alignV: "center",
        //       xpos: 163.0,
        //       ypos: 14.1,
        //       width: 60.0,
        //       height: 6.3,
        //       data: "2023-10-16",
        //       codeWidht: null,
        //       codeHeight: null,
        //       interval: null,
        //       itemData: null,
        //     },
        //     {
        //       name: "staffName",
        //       type: "text",
        //       alignH: "left",
        //       alignV: "center",
        //       xpos: 163.0,
        //       ypos: 23.2,
        //       width: 60.0,
        //       height: 6.3,
        //       data: "张三",
        //       codeWidht: null,
        //       codeHeight: null,
        //       interval: null,
        //       itemData: null,
        //     },
        //     {
        //       name: "tableTemp",
        //       type: "table",
        //       alignH: null,
        //       alignV: null,
        //       xpos: null,
        //       ypos: null,
        //       width: null,
        //       height: null,
        //       data: null,
        //       codeWidht: null,
        //       codeHeight: null,
        //       interval: null,
        //       itemData: [
        //         {
        //           name: "index",
        //           type: "text",
        //           alignH: "center",
        //           alignV: "center",
        //           xpos: 16.0,
        //           ypos: 49.0,
        //           width: 11.0,
        //           height: 8.3,
        //           data: "01",
        //           codeWidht: null,
        //           codeHeight: null,
        //           interval: 9.3,
        //         },
        //         {
        //           name: "code",
        //           type: "text",
        //           alignH: "left",
        //           alignV: "center",
        //           xpos: 28.0,
        //           ypos: 49.0,
        //           width: 51.0,
        //           height: 8.3,
        //           data: "2",
        //           codeWidht: null,
        //           codeHeight: null,
        //           interval: 9.3,
        //         },
        //         {
        //           name: "name",
        //           type: "text",
        //           alignH: "left",
        //           alignV: "center",
        //           xpos: 74.0,
        //           ypos: 49.0,
        //           width: 53.0,
        //           height: 8.3,
        //           data: "扫把",
        //           codeWidht: null,
        //           codeHeight: null,
        //           interval: 9.3,
        //         },
        //         {
        //           name: "specification",
        //           type: "text",
        //           alignH: "left",
        //           alignV: "center",
        //           xpos: 121.0,
        //           ypos: 49.0,
        //           width: 43.0,
        //           height: 8.3,
        //           data: "中",
        //           codeWidht: null,
        //           codeHeight: null,
        //           interval: 9.3,
        //         },
        //         {
        //           alignH: "left",
        //           alignV: "center",
        //           codeHeight: null,
        //           codeWidht: null,
        //           data: "1",
        //           height: 8.3,
        //           interval: 9.3,
        //           name: "amount",
        //           type: "text",
        //           width: 19,
        //           xpos: 160,
        //           ypos: 49,
        //         },
        //         {
        //           alignH: "left",
        //           alignV: "center",
        //           codeHeight: null,
        //           codeWidht: null,
        //           data: "10",
        //           height: 8.3,
        //           interval: 9.3,
        //           name: "money",
        //           type: "text",
        //           width: 23,
        //           xpos: 178,
        //           ypos: 49,
        //         },
        //       ],
        //     },
        //   ],
        //   txImg:
        //     "data:image/jpeg;base64,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dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDYtMjhUMTU6NTc6MTkrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTAtMTNUMTM6NDE6NTcrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTEwLTEzVDEzOjQxOjU3KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjAxODZhYTgtZTc5NC03NTQxLWE2YTItNmRmMGNmMjJiMjIwIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZThmMzI4NmItYWU4Ny1kNjQ5LTk1NGMtOWVlYzM4YTZkZDY2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Y2Q4OTUyMjMtNDEyYi00ODRmLTkxZDAtYzBmZmNlNGRlNGU3IiBwaG90b3Nob3A6Q29sb3JNb2RlPSIxIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iRG90IEdhaW4gMTUlIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZDg5NTIyMy00MTJiLTQ4NGYtOTFkMC1jMGZmY2U0ZGU0ZTciIHN0RXZ0OndoZW49IjIwMjItMDYtMjhUMTU6NTc6MTkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDM1NTg2MjEtOGIzZS1mNTRjLTkwZDMtZDQxNDk5NjU4N2UzIiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI4VDE1OjU3OjM5KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuNCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmI5ZGFjMmUxLTI2NjUtNGI0ZC04MDFlLTNhOWIyOGY2ZmNkMSIgc3RFdnQ6d2hlbj0iMjAyMy0xMC0xM1QxMzo0MTo1NyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9qcGVnIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL2pwZWciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYwMTg2YWE4LWU3OTQtNzU0MS1hNmEyLTZkZjBjZjIyYjIyMCIgc3RFdnQ6d2hlbj0iMjAyMy0xMC0xM1QxMzo0MTo1NyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpiOWRhYzJlMS0yNjY1LTRiNGQtODAxZS0zYTliMjhmNmZjZDEiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozZmI3MzI1OS1mNGU2LTIzNGQtOTcyNC1mZmEyZDcyOTY2OWEiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZDg5NTIyMy00MTJiLTQ4NGYtOTFkMC1jMGZmY2U0ZGU0ZTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iA6BJQ0NfUFJPRklMRQABAQAAA5BBREJFAhAAAHBydHJHUkFZWFlaIAfPAAYAAwAAAAAAAGFjc3BBUFBMAAAAAG5vbmUAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtQURCRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWNwcnQAAADAAAAAMmRlc2MAAAD0AAAAZ3d0cHQAAAFcAAAAFGJrcHQAAAFwAAAAFGtUUkMAAAGEAAACDHRleHQAAAAAQ29weXJpZ2h0IDE5OTkgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQAAABkZXNjAAAAAAAAAA1Eb3QgR2FpbiAxNSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAAD21gABAAAAANMtWFlaIAAAAAAAAAAAAAAAAAAAAABjdXJ2AAAAAAAAAQAAAAAQACoATgB5AKoA4AEb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VphVaYVWmFVphVaYVWmFVphVaYVWmFVphVaYVWmFVphVaYVWmFVphVaYVWmFVphVaYVWmFVphVaYVWmFVphUJjAmo5tMKrTCq0wqtMKrTCq0wqtMKrTCq0wqtMKrTCq0wqtMKrTCq0wqExgTUc2mFVphVaYVWmFVphVaYVWmFVphVaYVWmFVphVaYVWmFVphVaYVWmFVphVaYVWmFWxfGbpet7W+t/i581ydz5rlMs8LyIN1f7hur4PYvjN0vW9rfW/xc+a5O581ymWeF5EG6v8AcN1fB7F8Zul63tb63+LnzXJ3PmuUyzwvIg3V/uG6vg9i+M3S9b2t9b/Fz5rk7nzXKZZ4XkQbq/3DdXwexfGbpet7W+t/i581ydz5rlMs8LyIN1f7hur4PYvjN0vW9rfW/wAXPmuTufNcplnheRBur/cN1fB7F8Zul63tb63+LnzXJ3PmuUyzwvIg3V/uG6vg9i+M3S9b24Bt3cftporaaK2mitporaaK2mitporaaK2micR5tgWtporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2micR5tgWtporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaKTx5tRE200VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00QmPNs7m2mitporaaK2mitporaaK2mitporaaK2mitporaaK2mitporaaITHm2dzbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRW00VtNFbTRbF8Zul63tb63+LnzXJ3PmuUyzwvIg3V/uG6vg9i+M3S9b2t9b/Fz5rk7nzXKZZ4XkQbq/3DdXwexfGbpet7W+t/i581ydz5rlMs8LyIN1f7hur4PYvjN0vW9rfW/wAXPmuTufNcplnheRBur/cN1fB7F8Zul63t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JB5vItKI2BcMQvshu9at/wAxuuy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLUjS7NRDJFJB5vItKI2BcMQvshu9at/zG67L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctROu7NQABFIiKPIEREcYzMyexQGuy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5auy/dpHLV2X7tI5aiENmoqgtkkSPIWyWAXbDmexDunG3P3HK7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctXZfu0jlq7L92kctRCGzUVQWySJHkLZLALthzPYh3Tjbn7jldl+7SOWrsv3aRy1dl+7SOWrsv3aRy1dl+7SOWrsv3aRy1dl+7SOWrsv3aRy1dl+7SOWrsv3aRy1dl+7SOWrsv3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1IbzCoR33Q8rr5Yr8aM6yf8AA5WRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6juWJOBI0hF/CybWM5s3Ja5remGbx3MhvN3m6tVkStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1Oo7liTgSNIRfwsm1jObNyWua3phm8dzIbzd5urVZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OpjYhJRSjOolqLJAfK25luuxQabD7xzErIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6nkoScByRVMEWSX92gN5wQi5o83ubuPYzu5ON1kStUldTrIlapK6nWRK1SV1OsiVqkrqdZErVJXU6yJWqSup1kStUldTrIlapK6nWRK1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ebuWUG82beCTf9SxjLNWDvc3nM25eZrSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetR0WRGt82kYF5u5ZQbzZt4JN/wBSxjLNWDvc3nM25eZrSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rUxXZEYgSM7aQY7gko3blsQcLaTt2f17pz+XWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetT7EiMipJG0qx3FtFzaBjN/wDyQXYXV3iZ3Hzl5nLpvSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetT7EiMipJG0qx3FtFzaBjN/wDyQXYXV3iZ3Hzl5nLpvSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61pUXVnO9a0qLqznetaVF1ZzvWtKi6s53rWlRdWc71rSourOd61P3j9X4ZL3rjo9RN946R+yi9Fk8ZsrxRF6LJ4zZXiqd0V7i3PEe0elD+V2b4BtHpQ/ldm+CT94/V+GS9646PUTfeOkfsovRZPGbK8UReiyeM2V4qndFe4tzxHtHpQ/ldm+AbR6UP5XZvgk/eP1fhkveuOj1E33jpH7KL0WTxmyvFEXosnjNleKp3RXuLc8R7R6UP5XZvgG0elD+V2b4JP3j9X4ZL3rjo9RN946R+yi9Fk8ZsrxRF6LJ4zZXiqd0V7i3PEe0elD+V2b4BtHpQ/ldm+CT94/V+GS9646PUTfeOkfsovRZPGbK8UReiyeM2V4qndFe4tzxHtHpQ/ldm+AbR6UP5XZvgk/eP1fhkveuOj1E33jpH7KL0WTxmyvFEXosnjNleKp3RXuLc8R7R6UP5XZvgG0elD+V2b4JP3j9X4ZL3rjo9RN946R+yi9Fk8ZsrxRF6LJ4zZXiqd0V7i3PEe0elD+V2b4BtHpQ/ldm+CT94/V+GS9646PUVIzDBtZzARvm2a51+1aZb2fJAMf7860WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VUdVjxrfNpGBOcOWVG82beETn9NxTHNWAus5nM43d53RYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVR1WPGt82kYE5w5ZUbzZt4ROf03FMc1YC6zmczjd3ndFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVTEdjxhBYztpRkOESDduWyBstmtXh/UvW/5laLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VPsR4yqskbSLIcSyXNoGK3/APGneBdXePmsfN3ebvXNFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VPsR4yqskbSLIcSyXNoGK3/APGneBdXePmsfN3ebvXNFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VWixdZc7qrRYusud1VosXWXO6q0WLrLndVaLF1lzuqtFi6y53VU/eP1fhkveuOj1E33jpH7KL0WTxmyvFEXosnjNleKp3RXuLc8R7R6UP5XZvgG0elD+V2b4JP3j9X4ZL3rjo9RN946R+yi9Fk8ZsrxRF6LJ4zZXiqd0V7i3PEe0elD+V2b4BtHpQ/ldm+CT94/V+GS9646PUTfeOkfsovRZPGbK8UReiyeM2V4q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",
        //   bkImg: "",
        //   dbName: null,
        // },
      ],
      //用户
      userId: "",
      token: "",
      staffId: "",
      staffData: [],
      //仓库正在盘点警告
      warning: false,
      warningTitle: "",
      //部门数据
      receivingDepartmentData: [],
      //员工数据
      employeeData: [],
      //查看详情
      look: false,
      //判断是出库还是修改出库单据
      isWarehousing: 0,
      //主体表格
      andLike: "",
      tableLoading: false,
      assetTableData: [],
      columns: OutboundColumns,
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
      //出库数据
      newBillsDialogVisible: false,
      pushWarehouseData: {
        roleRule: this.$t("h.title218"),
        houseId: [],
        useDate: getTodayDate(),
        useStaff: "",
        deptId: "",
        staffName: JSON.parse(sessionStorage.getItem("vuex")).userInfo.staffId,
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
        useStaff: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.recipient"),
            trigger: "change",
          },
        ],
        deptId: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.department"),
            trigger: "change",
          },
        ],
        useDate: [
          {
            required: true,
            message: this.$t("h.tips4") + this.$t("h.collectionDate"),
            trigger: "change",
          },
        ],
      },
      sourceListData: [],
      //物品详情数据
      articleDetailsData: [],
      selectArticleDetailsData: [],
      //   物品分类 + 物品档案
      articleDialogVisible: false,
      subMenuList: [],
      subMenuListProps: { children: "children", label: "name" },
      newArticleColumns: conTransferArticleColumns,
      newArticleDetailsColumns: outboundDetailsColumns,
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
      // refundOrOut: false,
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
    //获取打印模板数据
    getBillPrintTemplate() {
      select({
        func: "S0034",
        userId: this.userInfo._id,
        token: this.userInfo.token,
        requstData: {
          type: "CRE",
        },
      })
        .then(({ data }) => {
          if (data.code != 0) return this.$message.error(data.data);
          this.billPrintTemplate = data.data;
          this.outboundTemplateId = localStorage.getItem("outboundTemplateId");
          if (
            !this.billPrintTemplate.some(
              (item) => item._id == this.outboundTemplateId
            )
          ) {
            this.outboundTemplateId = this.billPrintTemplate[0]._id;
            localStorage.setItem("outboundTemplateId", this.outboundTemplateId);
          }
        })
        .catch(() => {
          this.$message.error(this.$t("h.tips119"));
        });
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
        type: "1,2", // 单据类型  选择0为入库单据 1为出库单据
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
              } else if (item.type == "1") {
                item.typeName = this.$t("h.title223");
              } else if (item.type == "2") {
                item.typeName = this.$t("h.title224");
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
    //选择员工事件
    selectEmployee(val) {
      let deptId = "";
      this.employeeData.forEach((item) => {
        if (item._id == val) {
          deptId = item.deptId;
        }
      });
      this.receivingDepartmentData.forEach((item) => {
        if (item._id == deptId) {
          this.pushWarehouseData.deptId = item._id;
        }
      });
    },
    //导出
    exportFile() {
      warehouseOperate({
        func: "WA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          type: "1,2",
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
    //获取部门数据
    getReceivingDepartmentData() {
      select({
        func: "S0004",
        userId: this.userId,
        token: this.token,
        requstData: {
          _id: "",
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.receivingDepartmentData = data.data;
          } else {
            this.receivingDepartmentData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
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
          this.subMenuList = [
            { children: null, name: this.$t("h.title174"), sortingId: "1" },
          ];
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
              return this.$message.error(
                data.data ? data.data : this.$t("h.tips256")
              );
            if (data.data) {
              this.articleData = JSON.parse(JSON.stringify(data.data));
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
            this.articleData = JSON.parse(JSON.stringify(data.data));
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
    //出库 || 修改出库 || 退库
    outbound() {
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
        //出库
        if (this.isWarehousing == 0) {
          warehouseOperate({
            func: "OU0002",
            userId: this.userId,
            token: this.token,
            requstData: {
              createDate: this.pushWarehouseData.createDate,
              useDate: this.pushWarehouseData.useDate,
              staffId: this.pushWarehouseData.staffName,
              vendName: this.pushWarehouseData.vendName,
              houseId:
                this.pushWarehouseData.houseId.length > 1
                  ? this.pushWarehouseData.houseId[
                      this.pushWarehouseData.houseId.length - 1
                    ]
                  : this.pushWarehouseData.houseId.join(),
              remark: this.pushWarehouseData.remark,
              useStaff: this.pushWarehouseData.useStaff,
              deptId: this.pushWarehouseData.deptId,
              details,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message.success(data.data);
              this.newBillsDialogVisible = false;
              this.isWarehousing = 0;
              this.$refs["pushWarehouseDataRef"].resetFields();
              this.articleDetailsData = [];
              this.selectArticleDetailsData = [];
              this.getOutboundDocuments();
            })
            .catch((error) => {
              this.$message.error(error);
            });
        } else if (this.isWarehousing == 1) {
          warehouseOperate({
            func: "OU0003",
            userId: this.userId,
            token: this.token,
            requstData: {
              warehousingId: this.pushWarehouseData.warehousingId,
              createDate: this.pushWarehouseData.createDate,
              useDate: this.pushWarehouseData.useDate,
              staffId: this.pushWarehouseData.staffName,
              vendName: this.pushWarehouseData.vendName,
              houseId:
                this.pushWarehouseData.houseId.length > 1
                  ? this.pushWarehouseData.houseId[
                      this.pushWarehouseData.houseId.length - 1
                    ]
                  : this.pushWarehouseData.houseId.join(),
              remark: this.pushWarehouseData.remark,
              useStaff: this.pushWarehouseData.useStaff,
              deptId: this.pushWarehouseData.deptId,
              details,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message.success(data.data);
              this.newBillsDialogVisible = false;
              this.isWarehousing = 0;
              this.$refs["pushWarehouseDataRef"].resetFields();
              this.articleDetailsData = [];
              this.selectArticleDetailsData = [];
              this.getOutboundDocuments();
            })
            .catch((error) => {
              this.$message.error(error);
            });
        } else if (this.isWarehousing == 2) {
          //退库
          warehouseOperate({
            func: "IN0002",
            userId: this.userId,
            token: this.token,
            requstData: {
              createDate: this.pushWarehouseData.createDate,
              useDate: this.pushWarehouseData.useDate,
              staffId: this.staffId,
              useStaff: this.pushWarehouseData.useStaff,
              deptId: this.pushWarehouseData.deptId,
              type: "2", //传 0为入库单据  2为退库单据
              vendName: " ",
              houseId:
                this.pushWarehouseData.houseId.length > 1
                  ? this.pushWarehouseData.houseId[
                      this.pushWarehouseData.houseId.length - 1
                    ]
                  : this.pushWarehouseData.houseId.join(),
              remark: this.pushWarehouseData.remark,
              details,
            },
          })
            .then(({ data }) => {
              if (data.code == "-1") return this.$message.error(data.data);
              this.$message.success(data.data);
              this.newBillsDialogVisible = false;
              this.isWarehousing = 0;
              this.$refs["pushWarehouseDataRef"].resetFields();
              this.articleDetailsData = [];
              this.selectArticleDetailsData = [];
              this.getOutboundDocuments();
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
      // this.newArticleDetailsColumns.forEach((item) => {
      //   switch (item.prop) {
      //     case "amount":
      //       item.label = "*出库数量";
      //       break;
      //     case "price":
      //       item.label = "出库单价";
      //       break;
      //     case "money":
      //       item.label = "*出库金额";
      //       break;
      //   }
      // });
      this.articleDetailsData = [];
      this.selectArticleDetailsData = [];
      this.isWarehousing = 0;
      this.pushWarehouseData = {
        roleRule: this.$t("h.title218"),
        houseId: [],
        useDate: getTodayDate(),
        useStaff: "",
        deptId: "",
        staffName: JSON.parse(sessionStorage.getItem("vuex")).userInfo.staffId,
        createDate: getTodayDate(),
        remark: "",
      };
      this.look = false;
    },
    //获取出库/退库单据
    getOutboundDocuments() {
      warehouseOperate({
        func: "WA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          type: "1,2",
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
                } else if (item.type == "1") {
                  item.typeName = this.$t("h.title223");
                } else if (item.type == "2") {
                  item.typeName = this.$t("h.title224");
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
        func: "WA0001",
        userId: this.userId,
        token: this.token,
        requstData: {
          type: "1,2", // 单据类型  选择0为入库单据 1为出库单据
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.type == "0") {
                item.typeName = this.$t("h.title222");
              } else if (item.type == "1") {
                item.typeName = this.$t("h.title223");
              } else if (item.type == "2") {
                item.typeName = this.$t("h.title224");
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
        type: "1,2", // 单据类型  选择0为入库单据 1为出库单据
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
              } else if (item.type == "1") {
                item.typeName = this.$t("h.title223");
              } else if (item.type == "2") {
                item.typeName = this.$t("h.title224");
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
          type: "1,2", // 单据类型  选择0为入库单据 1为出库单据
        },
      })
        .then(({ data }) => {
          if (data.code == "-1") return this.$message.error(data.data);
          if (data.data) {
            this.assetTableData = data.data;
            this.assetTableData.forEach((item) => {
              if (item.type == "0") {
                item.typeName = this.$t("h.title222");
              } else if (item.type == "1") {
                item.typeName = this.$t("h.title223");
              } else if (item.type == "2") {
                item.typeName = this.$t("h.title224");
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
      this.assetTableSelectData = val;
      this.assetTableSelectData.forEach((item) => {
        item.list[0].amount = item.details[0].amount;
        item.list[0].money = item.details[0].money;
      });
    },
    //编辑操作
    editingOperations(command) {
      if (command == "modify") {
        this.modifyDeliveryDocuments();
      } else if (command == "delete") {
        this.deleteDeliveryDocuments();
      }
    },
    //修改出库单据
    modifyDeliveryDocuments() {
      if (this.assetTableSelectData.length > 1)
        return this.$message.error(this.$t("h.tips110"));
      this.newBillsDialogVisible = true;
      this.isWarehousing = 1;
      // if (this.assetTableSelectData[0].type == 2) {
      //   this.newArticleDetailsColumns.forEach((item) => {
      //     switch (item.prop) {
      //       case "amount":
      //         item.label = "*退库数量";
      //         break;
      //       case "price":
      //         item.label = "退库单价";
      //         break;
      //       case "money":
      //         item.label = "*退库金额";
      //         break;
      //     }
      //   });
      // }
      this.pushWarehouseData = {
        roleRule: this.assetTableSelectData[0].roleRule,
        houseId: this.assetTableSelectData[0].houseId,
        useDate: this.assetTableSelectData[0].useDate,
        useStaff: this.assetTableSelectData[0].useStaff,
        deptId: this.assetTableSelectData[0].deptId,
        staffName: this.assetTableSelectData[0].staffId,
        createDate: this.assetTableSelectData[0].createDate,
        remark: this.assetTableSelectData[0].remark,
        warehousingId: this.assetTableSelectData[0].warehousingId,
      };
      this.articleDetailsData = this.assetTableSelectData[0].list;
      this.assetTableSelectData[0].details.forEach((item, index) => {
        this.articleDetailsData[index].amount = item.amount;
        this.articleDetailsData[index].money = item.money;
        this.articleDetailsData[index].price = item.price;
        this.articleDetailsData[index].substanceId = item.substanceId;
      });
    },
    //删除出库单据
    deleteDeliveryDocuments() {
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
              this.getOutboundDocuments();
            })
            .catch((error) => {
              this.$message.error(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message:  this.$t("h.tips98"),
          });
        });
    },
    //退库
    stockReturn() {
      // this.newArticleDetailsColumns.forEach((item) => {
      //   switch (item.prop) {
      //     case "amount":
      //       item.label = "*退库数量";
      //       break;
      //     case "price":
      //       item.label = "退库单价";
      //       break;
      //     case "money":
      //       item.label = "*退库金额";
      //       break;
      //   }
      // });
      this.isWarehousing = 2;
      this.newBillsDialogVisible = true;
    },
    //查看详情
    lookDetails(row) {
      this.newBillsDialogVisible = true;
      this.look = true;
      this.pushWarehouseData = {
        roleRule: row.roleRule,
        houseId: row.houseId,
        useDate: row.useDate,
        useStaff: row.useStaff,
        deptId: row.deptId,
        vendName: row.vendName,
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
      if (!this.look && this.isWarehousing != 1) {
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
    if (!window.localStorage.getItem("outboundTemplateId")) {
      window.localStorage.setItem("outboundTemplateId", 45);
    }
    this.userId = JSON.parse(sessionStorage.getItem("vuex")).userInfo._id;
    this.token = JSON.parse(sessionStorage.getItem("vuex")).userInfo.token;
    this.staffId = JSON.parse(sessionStorage.getItem("vuex")).userInfo.staffId;
    this.getWarehouseData(this.userId, this.token);
    this.getOutboundDocuments();
    this.getEmployeeData();
    this.getReceivingDepartmentData();
    this.outboundTemplateId = localStorage.getItem("outboundTemplateId");
    this.getBillPrintTemplate();
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
      font-size: 14px;
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
    .amount {
      color: red;
    }
    .money {
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
      width: 48%;
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
