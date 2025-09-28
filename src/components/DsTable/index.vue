<template>
  <div class="table-container">
    <!-- :header-cell-style="headerCellStyle"
      :row-style="rowStyle" -->
    <!-- :row-class-name="tableRowClassName" -->
    <el-table
      ref="dsTableRef"
      v-loading="loading"
      header-cell-class-name="table-header"
      cell-class-name="table-content"
      :data="tableData"
      :border="border"
      :size="size"
      :height="height"
      :row-key="rowKey"
      :row-class-name="tableRowClassName"
      :expand-row-keys="tableConfig.expands"
      :tree-props="treeProps"
      @selection-change="handleSelectionChange"
      @select-all="handleSelectionAll"
      @expand-change="expandDetailChange"
    >
      <!-- 多选 -->
      <el-table-column
        v-if="tableConfig.selection || tableConfig.multiple"
        align="center"
        width="55"
        type="selection"
        :reserve-selection="tableConfig.reserveSelection"
      >
      </el-table-column>
      <!-- 序号 -->
      <el-table-column
        v-if="tableConfig.index"
        type="index"
        align="center"
        :label="tableConfig.indexName || $t('h.index')"
        :width="tableConfig.indexWidth || 50"
        :fixed="tableConfig.indexFixed || 'left'"
      >
      </el-table-column>
      <!-- 可展开 -->
      <el-table-column
        v-if="tableConfig.expand"
        type="expand"
        align="center"
        :label="tableConfig.expandName"
        :width="tableConfig.expandWidth || 50"
        :fixed="tableConfig.expandFixed"
      >
        <template slot-scope="scope">
          <slot :scope="scope" name="expand" />
        </template>
      </el-table-column>
      <!-- 循环渲染 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width || ''"
        :min-width="column.minWidth"
        :align="column.align || 'center'"
        :fixed="column.fixed"
        :sortable="column.sortable || true"
        :resizable="column.resizable"
        :formatter="column.formatter"
        :show-overflow-tooltip="column.showOverflowTooltip"
      >
        <template slot-scope="scope">
          <!-- 图片 -->
          <div v-if="column.type == 'image'" class="table-image-cell">
            <el-image
              v-if="scope.row[column.prop]"
              :src="scope.row[column.prop]"
              :preview-src-list="[scope.row[column.prop]]"
              @click="a(scope)"
            ></el-image>
            <div class="no-image" v-else>
              <span>{{ $t("h.title51") }}</span>
            </div>
          </div>
          <!-- 资产状态 -->
          <el-badge
            v-else-if="column.type == 'assetState'"
            :is-dot="scope.row.stauss == 1"
            :class="scope.row.stauss == 1 ? 'is-dot' : ''"
          >
            <div
              :class="
                'table-state-cell ' +
                'table-state-cell' +
                scope.row[column.prop]
              "
              @click="checkAssetAuditing(scope.row.stauss)"
            >
              <span>{{
                column.formatter
                  ? column.formatter(scope.row, scope.column)
                  : scope.row[column.prop]
              }}</span>
            </div>
          </el-badge>
          <!-- 单据状态 -->
          <div
            v-else-if="column.type == 'billState'"
            :class="
              'bill-state-cell ' + 'bill-state-cell' + scope.row[column.prop]
            "
          >
            <span>{{
              column.formatter
                ? column.formatter(scope.row, scope.column)
                : scope.row[column.prop]
            }}</span>
          </div>
          <!-- 可点击查看详情 -->
          <div
            class="table-detail-cell"
            v-else-if="column.type == 'detail'"
            @click="checkTableRowDetail(scope.row)"
          >
            <span>{{ scope.row[column.prop] }}</span>
          </div>
          <!-- 树状节点 -->
          <span v-else-if="column.type == 'expand'">{{
            column.formatter
              ? column.formatter(scope.row, scope.column)
              : scope.row[column.prop]
          }}</span>
          <!-- 自定义插槽 -->
          <!-- v-else-if="column.type == undefined && column.slotName" -->
          <slot
            v-else-if="column.slotName"
            :scope="scope"
            :name="column.slotName"
            @click="ck2"
          />
          <!-- 正常显示 -->
          <div v-else class="show-tooltip">
            <span v-if="column.prop == 'workStatus'">{{
              $t(`h.${scope.row[column.prop]}`)
            }}</span>
            <span v-else @click="ck(scope,column)">{{
              column.formatter
                ? column.formatter(scope.row, scope.column)
                : scope.row[column.prop]
            }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 空table数据 -->
      <template slot="empty">
        <ds-default-page
          :defaultPageImgUrl="defaultPageImgUrl"
          :defaultPageTips="defaultPageTips"
        ></ds-default-page>
      </template>
    </el-table>
  </div>
</template>
<script>
import DsDefaultPage from "@/components/DsDefaultPage";
export default {
  name: "DsTable",
  components: {
    DsDefaultPage,
  },
  data() {
    return {
      selectData: [],
    };
  },
  // computed: {
  //   selectData: {
  //     get() {
  //       return this.selectRowData;
  //     },
  //     set(val) {
  //       this.$emit("update:selectRowData", val);
  //     },
  //   },
  // },
  props: {
    // 加载
    loading: {
      type: Boolean,
      default: false,
    },
    treeProps: {
      type: Object,
      default: () => {},
    },
    // 唯一的标识
    onlyKey: {
      type: String,
      default: "_id",
    },
    // 表格
    columns: {
      type: Array,
      require: true,
      default: () => [],
    },
    rowKey: {
      default: () => (row) => row.index,
    },
    selectRowData: {
      type: Array,
      default: () => [],
    },
    // 为表头设计样式
    headerCellStyle: {
      // default: () => {
      //   return { background: "#666", height: "70px", color: "pink" };
      // },
    },
    // 为每一行设计样式，比如设置每行的高度等等
    rowStyle: {
      // default: () => {
      //   return { height: "50px" };
      // },
    },
    /**
     * selection
     * reserveSelection
     * index
     * indexName
     * indexWidth
     * indexFixed
     */
    tableConfig: {
      type: Object,
      default: () => {
        return {
          selection: false,
          multiple: false,
          reserveSelection: false,
          index: false,
        };
      },
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    border: {
      type: Boolean,
      default: true,
    },
    // stripe: {
    //   type: Boolean,
    //   default: true,
    // },
    height: {
      type: String,
      default: "100%",
    },
    size: {
      type: String,
      default: "medium",
    },
    // 表格空数据的时候
    defaultPageImgUrl: {
      type: String,
      default: () => "",
    },
    defaultPageTips: {
      type: String,
      default: () => "",
    },
  },
  methods: {
    a(scope){
      console.log('图片',scope)
    },
    ck2(){
      console.log('点击自定义插槽')
    },
    ck(scope,column){
      console.log('click',scope)
      console.log(column)
    },
    handleSelectionAll() {
      if (this.tableConfig.multiple) {
        this.$refs.dsTableRef.clearSelection();
        return this.$message.info(this.$t("h.tips87"));
      }
    },
    // 多选
    handleSelectionChange(val) {
      console.log('多选',val)
      if (this.tableConfig.tableConfig && val.length > 1) {
        const newRows = val.filter((it, index) => {
          if (index == val.length - 1) {
            this.$refs.dsTableRef.toggleRowSelection(it, true);
            return true;
          } else {
            this.$refs.dsTableRef.toggleRowSelection(it, false);
            return false;
          }
        });
        this.selectData = newRows;
        this.$emit("handleSelectionChange", newRows);
      } else {
        this.selectData = val;
        this.$emit("handleSelectionChange", val);
      }
    },
    expandDetailChange(row, expandedRows) {
      // console.log("row>>>>", row);
      // console.log("expandedRows>>>>", expandedRows);
      this.$emit("expandDetailChange", row, expandedRows);
    },
    // 点击查看详情
    checkTableRowDetail(val) {
      console.log('点击查看详情',val)
      this.$emit("checkTableRowDetail", val);
    },
    // 点击查看是否在申请状态
    checkAssetAuditing(stauss) {
      if (stauss == 1) {
        this.$notify({
          title: "tips",
          message: this.$t("h.tips88"),
          position: "top-right",
          type: "warning",
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(this.rowKey());
      const checkIdList = this.selectData.map((item) => item[this.onlyKey]);
      if (checkIdList.includes(row[this.onlyKey])) return "select-row";
      if (rowIndex % 2 != 0) return "even-row";
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.table-container {
  height: 100%;
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
.table-detail-cell {
  color: #588ab9;
  cursor: pointer;
}
.is-dot {
  cursor: pointer;
}
.table-state-cell,
.bill-state-cell {
  // width: 65px;
  padding: 0 4px;
  height: 24px;
  border-radius: 2px;
  font-size: 13px;
  color: #fff;
}
.bill-state-cell {
  display: inline-block;
}
.bill-state-cell2 {
  background: rgb(245, 108, 108);
}
.bill-state-cell1 {
  background: rgb(144, 147, 153);
}
.bill-state-cell0 {
  background: rgb(103, 194, 58);
}
.bill-state-cell-2 {
  background: rgb(245, 108, 108);
}
.bill-state-cell-1 {
  background: rgb(144, 147, 153);
}
.bill-state-cell-0 {
  background: rgb(103, 194, 58);
}
.table-state-cell-1 {
  background-color: #f78989;
}
.table-state-cell0 {
  background-color: #61917d;
}
.table-state-cell1 {
  background-color: #e6cd85;
}
.table-state-cell2 {
  background-color: #99a8c6;
}
.table-state-cell3 {
  background-color: #7cc1c1;
}
.table-state-cell4 {
  background-color: #de9e82;
}
.table-state-cell5 {
  background-color: #82c9de;
}
.table-state-cellundefined {
  background: #f50;
}
.show-tooltip {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
::v-deep.el-table .even-row {
  background: #f8f8f8;
}
::v-deep.el-table .select-row {
  background: #f2f6ff;
}
::v-deep .el-badge__content.is-fixed {
  top: 3px;
}
// ::v-deep .el-radio__input {
//   display: none;
// }
// ::v-deep .el-radio__label {
//   padding-left: 0;
// }
</style>
